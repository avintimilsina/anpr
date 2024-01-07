from flask_cors import CORS
from flask import Flask

app = Flask("anpr")
CORS(app)

@app.route("/", methods=["GET"])
def ping():
    return "Pinging Model Application"

if __name__ == "__main__":
    app.run(debug=True, port=9696)