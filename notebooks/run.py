import ast
import cv2 as cv
import easyocr
from glob import glob
import numpy as np
import pandas as pd
import string
from ultralytics import YOLO

coco_model = YOLO('yolov8n.pt')
np_model = YOLO('/mnt/D/Projects/anpr/model/runs/detect/train/weights/best.pt')
videos = "/mnt/D/Projects/anpr/notebooks/inputs/embossed.mp4"

reader = easyocr.Reader(['en'], gpu=True)

def write_csv(results, output_path):
    with open(output_path, 'w') as f:
        f.write('{},{},{},{},{},{},{},{}\n'.format(
            'frame_number', 'track_id', 'car_bbox', 'car_bbox_score',
            'license_plate_bbox', 'license_plate_bbox_score', 'license_plate_number',
            'license_text_score'))
        for frame_number in results.keys():
            for track_id in results[frame_number].keys():
                if 'car' in results[frame_number][track_id].keys() and \
                   'license_plate' in results[frame_number][track_id].keys() and \
                   'number' in results[frame_number][track_id]['license_plate'].keys():
                    f.write('{},{},{},{},{},{},{},{}\n'.format(
                        frame_number,
                        track_id,
                        '[{} {} {} {}]'.format(
                            results[frame_number][track_id]['car']['bbox'][0],
                            results[frame_number][track_id]['car']['bbox'][1],
                            results[frame_number][track_id]['car']['bbox'][2],
                            results[frame_number][track_id]['car']['bbox'][3]
                        ),
                        results[frame_number][track_id]['car']['bbox_score'],
                        '[{} {} {} {}]'.format(
                            results[frame_number][track_id]['license_plate']['bbox'][0],
                            results[frame_number][track_id]['license_plate']['bbox'][1],
                            results[frame_number][track_id]['license_plate']['bbox'][2],
                            results[frame_number][track_id]['license_plate']['bbox'][3]
                        ),
                        results[frame_number][track_id]['license_plate']['bbox_score'],
                        results[frame_number][track_id]['license_plate']['number'],
                        results[frame_number][track_id]['license_plate']['text_score'])
                    )
        f.close()

dict_char_to_int = {'O': '0',
                    'I': '1',
                    'J': '3',
                    'A': '4',
                    'G': '6',
                    'S': '5'}

dict_int_to_char = {'0': 'O',
                    '1': 'I',
                    '3': 'J',
                    '4': 'A',
                    '6': 'G',
                    '5': 'S'}

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
        bbox, text, score = detection
        text = text.upper().replace(' ', '')
        if license_complies_format(text):
            return format_license(text), score
    return None, None

results = {}
video = cv.VideoCapture(videos)
ret = True
frame_number = -1
vehicles = [2,3,5]
while ret:
    ret, frame = video.read()
    frame_number += 1
    if ret:
        results[frame_number] = {}
        detections = coco_model.track(frame, persist=True)[0]
        for detection in detections.boxes.data.tolist():
            x1, y1, x2, y2, track_id, score, class_id = detection
            if int(class_id) in vehicles and score > 0.5:
                vehicle_bounding_boxes = []
                vehicle_bounding_boxes.append([x1, y1, x2, y2, track_id, score])
                for bbox in vehicle_bounding_boxes:
                    roi = frame[int(y1):int(y2), int(x1):int(x2)]
                    license_plates = np_model(roi)[0]
                    for license_plate in license_plates.boxes.data.tolist():
                        plate_x1, plate_y1, plate_x2, plate_y2, plate_score, _ = license_plate
                        plate = roi[int(plate_y1):int(plate_y2), int(plate_x1):int(plate_x2)]
                        plate_gray = cv.cvtColor(plate, cv.COLOR_BGR2GRAY)
                        _, plate_treshold = cv.threshold(plate_gray, 64, 255, cv.THRESH_BINARY_INV)
                        np_text, np_score = read_license_plate(plate_treshold)
                        if np_text is not None:
                            results[frame_number][track_id] = {
                                'car': {
                                    'bbox': [x1, y1, x2, y2],
                                    'bbox_score': score
                                },
                                'license_plate': {
                                    'bbox': [plate_x1, plate_y1, plate_x2, plate_y2],
                                    'bbox_score': plate_score,
                                    'number': np_text,
                                    'text_score': np_score
                                }
                            }
write_csv(results, './outputs/resultsEmbossed.csv')
video.release()
results = pd.read_csv('./outputs/resultsEmbossed.csv')

def draw_border(img, top_left, bottom_right, color=(0, 255, 0), thickness=6, line_length_x=200, line_length_y=200):
    x1, y1 = top_left
    x2, y2 = bottom_right

    cv.line(img, (x1, y1), (x1, y1 + line_length_y), color, thickness)  #-- top-left
    cv.line(img, (x1, y1), (x1 + line_length_x, y1), color, thickness)

    cv.line(img, (x1, y2), (x1, y2 - line_length_y), color, thickness)  #-- bottom-left
    cv.line(img, (x1, y2), (x1 + line_length_x, y2), color, thickness)

    cv.line(img, (x2, y1), (x2 - line_length_x, y1), color, thickness)  #-- top-right
    cv.line(img, (x2, y1), (x2, y1 + line_length_y), color, thickness)

    cv.line(img, (x2, y2), (x2, y2 - line_length_y), color, thickness)  #-- bottom-right
    cv.line(img, (x2, y2), (x2 - line_length_x, y2), color, thickness)

    return img

video = cv.VideoCapture(videos)
frame_width = int(video.get(3))
frame_height = int(video.get(4))
size = (frame_width, frame_height)
fourcc = cv.VideoWriter_fourcc(*'mp4v')
out = cv.VideoWriter('./outputs/resultsEmbossed.mp4', fourcc, 20.0, size)

frame_number = -1
video.set(cv.CAP_PROP_POS_FRAMES, 0)
ret = True
while ret:
    ret, frame = video.read()
    frame_number += 1
    if ret:
        df_ = results[results['frame_number'] == frame_number]
        for index in range(len(df_)):
            vhcl_x1, vhcl_y1, vhcl_x2, vhcl_y2 = ast.literal_eval(df_.iloc[index]['car_bbox'].replace('[ ', '[').replace('   ', ' ').replace('  ', ' ').replace(' ', ','))
            draw_border(
                frame, (int(vhcl_x1), int(vhcl_y1)),
                (int(vhcl_x2), int(vhcl_y2)), (0, 255, 0),
                12, line_length_x=200, line_length_y=200)
            plate_x1, plate_y1, plate_x2, plate_y2 = ast.literal_eval(df_.iloc[index]['license_plate_bbox'].replace('[ ', '[').replace('   ', ' ').replace('  ', ' ').replace(' ', ','))
            roi = frame[int(vhcl_y1):int(vhcl_y2), int(vhcl_x1):int(vhcl_x2)]
            cv.rectangle(roi, (int(plate_x1), int(plate_y1)), (int(plate_x2), int(plate_y2)), (0, 0, 255), 6)
            (text_width, text_height), _ = cv.getTextSize(
                df_.iloc[index]['license_plate_number'],
                cv.FONT_HERSHEY_SIMPLEX,2,6)
            cv.putText(
                frame,
                df_.iloc[index]['license_plate_number'],
                (int((vhcl_x2 + vhcl_x1 - text_width)/2), int(vhcl_y1 - text_height)),
                cv.FONT_HERSHEY_SIMPLEX,2,(0, 255, 0),6
            )
        out.write(frame)
        frame = cv.resize(frame, (1280, 720))
out.release()
video.release()

data = pd.read_csv('./outputs/resultsEmbossed.csv')
data['license_text_score'] = pd.to_numeric(data['license_text_score'], errors='coerce')
total_license_score = data.groupby('license_plate_number')['license_text_score'].sum()
max_license_score_row = data.loc[data.groupby('license_plate_number')['license_text_score'].idxmax()]
result = pd.merge(max_license_score_row[['license_plate_number', 'track_id']], total_license_score.reset_index(),
                  on='license_plate_number', how='inner')
max_license_score_row = result.loc[result.groupby('track_id')['license_text_score'].idxmax()]
print(max_license_score_row)
