from flask import request, jsonify
from app import app
import os
import threading
import json
import base64
from ..logic.db_operations import  *
from ..tflow.predict_image import *
from ..logic.helper_functions import *
from flask_jwt_extended import JWTManager, jwt_required, \
    revoke_token, create_access_token, \
    get_raw_jwt
from . import *


ALLOWED_EXTENSIONS = set(['jpg', 'jpeg'])
FILE_LOCK = threading.Lock() 


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


# TODO: should conform to json request too --> currently no implementations on dashboard
@app.route('/api/dashboard/predictions', methods=['POST'])
def predict_dashboard():
    file = request.files["file[]"]
    img_path = ""
    if file and allowed_file(file.filename):
        FILE_LOCK.acquire()
        img_path = os.path.join(app.config['PREDICTION_FOLDER'],
            str(len(os.listdir(app.config['PREDICTION_FOLDER'])) + 1) + '.jpeg')
        thumbnail_path = os.path.join(app.config['RESIZE_FOLDER'],
            str(len(os.listdir(app.config['RESIZE_FOLDER']))) + '.jpeg')
        file.save(img_path)
        isResizable = resize(img_path, thumbnail_path)
        FILE_LOCK.release()
        if isResizable:
            ret = predict_helper(thumbnail_path, "dashboard")
            os.remove(thumbnail_path)
        else:
            ret = predict_helper(img_path, "dashboard")
        os.remove(img_path)
        return jsonify({'labels': ret}), 200

@app.route('/api/mindsight/predictions', methods=['POST'])
@jwt_required
def predict_mindsight():
    username = get_jwt_identity_override()
    content = request.get_json()
    data = base64.b64decode(content['image'])
    #save to user-specific folder
    existing_users = os.listdir(app.config['PREDICTION_FOLDER'])
    imgPath = os.path.join(app.config['PREDICTION_FOLDER'], username)
    if username in existing_users:
        imgPath = os.path.join(imgPath, str(len(os.listdir(imgPath)) + 1) + '.jpeg')
    else:
        os.mkdir(imgPath)
        imgPath = os.path.join(imgPath, '1.jpeg')
    with open(imgPath, 'wb') as f:
        f.write(data)
    f.close()
    labels = predict_helper(imgPath, "mobile") 
    ret = {'labels': labels, 'filename': imgPath}
    return jsonify(ret), 200


@app.route('/api/retrain', methods=["GET"])
def retrain():
    from ..tflow.retrain_model import retrain
    retrainer = threading.Thread(target=retrain, args=())
    retrainer.setDaemon(True)
    retrainer.start()
    return jsonify({'msg': 'success'}), 200

@app.route('/api/mindsight/labels', methods=['POST'])
def addLabel_mindsight():
    content = request.get_json()
    img = base64.b64decode(content['image'])
    label = content['label'].lower()
    username = content['username']
    coordinates = content['coordinates']
    handleLabelForSingleImage(img, label, username, coordinates)
    return jsonify({'msg': 'success'}), 201
