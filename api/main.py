import cv2 as cv
import easyocr
import numpy as np
import pandas as pd
import string
from ultralytics import YOLO
from flask_cors import CORS
from flask import Flask, request, jsonify

app = Flask("anpr")
CORS(app)

coco_model = YOLO('yolov8n.pt')
np_model = YOLO('best.pt')
reader = easyocr.Reader(['en'], gpu=True)

dict_char_to_int = {'O': '0', 'I': '1', 'J': '3', 'A': '4', 'G': '6', 'S': '5'}
dict_int_to_char = {'0': 'O', '1': 'I', '3': 'J', '4': 'A', '6': 'G', '5': 'S'}

results_df = pd.DataFrame(columns=['frame_number', 'track_id', 'car_bbox', 'car_bbox_score',
                                   'license_plate_bbox', 'license_plate_bbox_score',
                                   'license_plate_number', 'license_text_score'])

def license_complies_format(text):
    if len(text) != 7:
        return False
    if (text[0] in string.ascii_uppercase or text[0] in dict_int_to_char.keys()) and \
       (text[1] in string.ascii_uppercase or text[1] in dict_int_to_char.keys()) and \
       (text[2] in string.ascii_uppercase or text[2] in dict_int_to_char.keys()) and \
       (text[3] in ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'] or text[3] in dict_char_to_int.keys()) and \
       (text[4] in ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'] or text[4] in dict_char_to_int.keys()) and \
       (text[5] in ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'] or text[5] in dict_char_to_int.keys()) and \
       (text[6] in ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'] or text[6] in dict_char_to_int.keys()):
        return True
    else:
        return False

def format_license(text):
    license_plate_ = ''
    mapping = {0: dict_int_to_char, 1: dict_int_to_char, 4: dict_char_to_int, 5: dict_char_to_int, 6: dict_char_to_int,
               2: dict_int_to_char, 3: dict_char_to_int}
    for j in [0, 1, 2, 3, 4, 5, 6]:
        if text[j] in mapping[j].keys():
            license_plate_ += mapping[j][text[j]]
        else:
            license_plate_ += text[j]

    return license_plate_

def read_license_plate(license_plate_crop):
    detections = reader.readtext(license_plate_crop)
    for detection in detections:
        _, text, score = detection
        text = text.upper().replace(' ', '')
        if license_complies_format(text):
            return format_license(text), score
    return None, None

@app.route("/", methods=["GET"])
def ping():
    return "Pinging Model Application"

@app.route("/api/video", methods=["POST"])
def api():
    input_json = request.json
    videos = input_json['url']

    global results_df
    results_df = pd.DataFrame(columns=['frame_number', 'track_id', 'car_bbox', 'car_bbox_score',
                                       'license_plate_bbox', 'license_plate_bbox_score',
                                       'license_plate_number', 'license_text_score'])

    video = cv.VideoCapture(videos)
    frame_number = -1
    vehicles = [2, 3, 5]

    while True:
        ret, frame = video.read()
        frame_number += 1
        if not ret:
            break

        detections = coco_model.track(frame, persist=True)[0]
        for detection in detections.boxes.data.tolist():
            x1, y1, x2, y2, track_id, score, class_id = detection

            if int(class_id) in vehicles and score > 0.5:
                vehicle_bounding_boxes = [[x1, y1, x2, y2, track_id, score]]
                for bbox in vehicle_bounding_boxes:
                    x1, y1, x2, y2, track_id, score = bbox
                    roi = frame[int(y1):int(y2), int(x1):int(x2)]
                    license_plates = np_model(roi)[0]

                    for license_plate in license_plates.boxes.data.tolist():
                        plate_x1, plate_y1, plate_x2, plate_y2, plate_score, _ = license_plate
                        plate = roi[int(plate_y1):int(plate_y2), int(plate_x1):int(plate_x2)]
                        plate_gray = cv.cvtColor(plate, cv.COLOR_BGR2GRAY)
                        _, plate_threshold = cv.threshold(plate_gray, 64, 255, cv.THRESH_BINARY_INV)
                        np_text, np_score = read_license_plate(plate_threshold)

                        if np_text is not None:
                            new_row = pd.DataFrame({
                                'frame_number': [frame_number],
                                'track_id': [track_id],
                                'car_bbox': [[x1, y1, x2, y2]],
                                'car_bbox_score': [score],
                                'license_plate_bbox': [[plate_x1, plate_y1, plate_x2, plate_y2]],
                                'license_plate_bbox_score': [plate_score],
                                'license_plate_number': [np_text],
                                'license_text_score': [np_score]
                            })
                            results_df = pd.concat([results_df, new_row], ignore_index=True)


    video.release()

    total_license_score = results_df.groupby('license_plate_number')['license_text_score'].sum()
    max_license_score_row = results_df.loc[results_df.groupby('license_plate_number')['license_text_score'].idxmax()]
    result = pd.merge(max_license_score_row[['license_plate_number', 'track_id']],
                      total_license_score.reset_index(),
                      on='license_plate_number', how='inner')
    max_license_score_row = result.loc[result.groupby('track_id')['license_text_score'].idxmax()]

    average_time_per_track = results_df.groupby('track_id')['frame_number'].mean()
    max_license_score_row['average_time'] = (max_license_score_row['track_id'].map(average_time_per_track))/30

    return jsonify(max_license_score_row[['license_plate_number', 'license_text_score', 'track_id', 'average_time']].transpose().to_dict())


if __name__ == "__main__":
    app.run(debug=True, port=9696)
