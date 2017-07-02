from flask import request, jsonify
from app import app
import os
import threading
import json
import base64
from db_operations import insert_training_data_and_create_labels, create_user, create_label, add_label_and_image
from predict_image import create_graph, predictImage
from helper_functions import predict_helper, handleLabelForSingleImage, resize
from flask_jwt_extended import JWTManager, jwt_required, \
    get_jwt_identity, revoke_token, create_access_token, \
    get_raw_jwt


ALLOWED_EXTENSIONS = set(['jpg', 'jpeg'])
#a preliminary lock to prevent possible race conditions in saving and removal of images for prediction in the temp folder
FILE_LOCK = threading.Lock() 

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

#TODO: should conform to json request too --> currently no implementations on dashboard
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
def predict_mindsight():
	content = request.get_json()
	data = base64.b64decode(content['image'])
	FILE_LOCK.acquire()
	save to user-specific folder
	username = get_jwt_identity()
	existing_users = os.listdir(app.config['PREDICTION_FOLDER'])
	imgPath = os.path.join(app.config['PREDICTION_FOLDER'], username)
	if username in existing_users:
		imgPath = os.path.join(imgPath, str(len(os.listdir(app.config['PREDICTION_FOLDER'])) + 1) + '.jpeg')
	else:
		os.mkdir(imgPath)
		imgPath = os.path.join(imgPath, '1.jpeg')
	with open(imgPath, 'wb') as f:
		f.write(data)
	f.close()
	FILE_LOCK.release()
	predict
	labels = predict_helper(imgPath, "mobile")
	filename = 
	ret = {'labels': labels, 'filename': imgPath}
	return jsonify(ret), 200


@app.route('/api/retrain', methods=["GET"])
def retrain():
	from retrain_model import retrain
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
	coordinates = content['coordinates'] # a list of coordinates to reconstruct user tracing
	handleLabelForSingleImage(img, label, username, coordinates)
	return jsonify({'msg': 'success'}), 201
