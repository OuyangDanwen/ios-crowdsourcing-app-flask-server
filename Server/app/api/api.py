from . import *
import threading

FILE_LOCK = threading.Lock() 


# Route for testing if auth works
@app.route('/api/protected', methods=['GET'])
@jwt_required
def protected():
    sess = get_session_object()
    return jsonify({'username': sess.username, 'location': sess.location}), 200


@app.route('/api/version', methods=['GET'])
@jwt_required
def version():
    return jsonify({'version': "1.1.0"}), 200


@app.route('/api/retraining_info', methods=['GET'])
@jwt_required
def getRetrainingInfo():
    with open(TRAIN_STATS_FILE) as f:
        last_line = f.readlines()[-1]
        training_info = last_line.split(', ')
        ret = {'training_time': training_info[0].split(': ')[1], 'training_duration': training_info[1].split(': '),
        'num_labels': training_info[2].split(': '), 'num_images': training_info[3].split(': ')}
    return jsonify(ret), 200


@app.route('/api/backend_version', methods=['GET'])
@jwt_required
def getBackendVersion():
    return jsonify({'version': CURRENT_SERVER_VERSION}), 200


@app.route('/api/mindsight/predictions/validate', methods=['POST'])
@jwt_required
def validate_label():
    username = get_jwt_identity_override()
    content = request.get_json()
    label = content['label']
    filenames = content['filenames']
    validation = content['validation']
    FILE_LOCK.acquire()
    if validation:#positive
        newPath = os.path.join(app.config['UPLOAD_FOLDER'], label)
        dirCount = len(os.listdir(newPath))
        for filename in filenames:
            dirCount = dirCount + 1
            newPath = os.path.join(newPath, label + '_' + str(dirCount) + '.jpeg')
            os.rename(filename, newPath)
        createThumbnail(label, newPath)
        Image(
            name=label + '_' + str(dirCount) + '.jpeg', path=newPath, label=label, 
            createdOn=datetime.datetime.now(), createdBy=username
            ).save()
    else:#negative
        existing_labels = os.listdir(app.config['FALSE_POSITIVE_FOLDER'])
        newPath = os.path.join(app.config['FALSE_POSITIVE_FOLDER'], label)
        if label not in existing_labels:
            os.mkdir(newPath)
        dirCount = len(os.listdir(newPath))
        for filename in filenames:
            dirCount = dirCount + 1
            newPath = os.path.join(newPath, label + '_' + str(dirCount) + '.jpeg')
            os.rename(filename, newPath)
    FILE_LOCK.release()
    return jsonify({'msg': 'Done'}), 200
