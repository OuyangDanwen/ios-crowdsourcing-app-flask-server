from . import *



# Route for testing if auth works
@app.route('/api/protected', methods=['GET'])
@jwt_required
def protected():
    sess = get_session_object()
    return jsonify({'Your location : ': sess.location}), 200

@app.route('/api/version', methods=['GET'])
@jwt_required
def version():
    return jsonify({'version': "1.1.0"}), 200

@app.route('/api/labels', methods=['GET'])
def getLabels():
    lbs = [lb for lb in Label.objects()]
    labels_dict_list = json.loads(json.dumps(lbs, cls=MongoEncoder))
    labels_list = []
    for lb in labels_dict_list:
        lb["images"] = Image.objects(label=lb["name"]).count()
        lb["resources"] = Resource.objects(label=lb["name"]).count()
        labels_list.append(lb)
    ret = {
        "labels": labels_list
    }
    return jsonify(ret), 200

@app.route('/api/labels', methods = ['POST'])
@jwt_required
def postLabel():
    label = request.form["label"].lower()
    if not len(label) > 0:
        return jsonify({'msg': 'No label found'}), 400
    username = get_jwt_identity_override()
    # Save label
    saveLabel(label, username)
    files = request.files.getlist('files[]')
    saveLabelPhotos(files, label, username)
    return jsonify({'msg': 'Done'}), 200

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

@app.route('/api/labels/', methods = ['PUT'])
def putLabel():
    # Modify label and whatever it is referencing
    old_label = request.json.get('label', None).lower()
    new_label = request.json.get('newlabel', None).lower()
    if not len(old_label) > 0:
        return jsonify({'msg': 'No label found in request'}), 403
    labelList = Label.objects(name=old_label)
    if len(labelList) == 0:
        return jsonify({"msg": "Label doesn't exist!"}), 401
    new_path = editLabel(old_label, new_label)
    # Change labelname in database
    Label.objects(name=old_label).update_one(name=new_label, path=new_path)
    # Change label in folder
    # Change label in database (resources
    Resource.objects(label=old_label).update(label=new_label)
    return jsonify({'msg': 'Done'}), 200

# TODO: Delete from filesystem (both resources, and everything associated with a label :'( )
@app.route('/api/labels/<label>', methods = ['DELETE'])
def deleteLabel(label):
    if not len(label) > 0:
        return jsonify({'msg': 'No label found in request'}), 403
    label_obj = Label.objects(name=label)
    if len(label_obj) == 0:
        return jsonify({"msg": "Label doesn't exist!"}), 401
    # try:
    Label.objects(name=label).delete()
    return jsonify({'msg': 'Done'}), 200

# Get all images
@app.route('/api/images', methods=['GET'])
def getImages():
    imgs = [img for img in Image.objects().order_by("-createdOn")]
    ret = {
        "images": json.loads(json.dumps(imgs, cls=MongoEncoder))
    }
    return jsonify(ret), 200

@app.route('/api/images/<label>', methods=['GET'])
def getImagesLabel(label):
    imgs = [img for img in Image.objects(label=label).order_by("-createdOn")]
    ret = {
        "images": json.loads(json.dumps(imgs, cls=MongoEncoder))
    }
    return jsonify(ret), 200

# TODO: Delete image from FS
@app.route('/api/images/<label>/<name>', methods = ['DELETE'])
def deleteImage(label, name):
    path = "/home/ec2-user/Server/file_system/train_image/" + label + "/" + name
    if not len(path) > 0:
        return jsonify({'msg': 'No Image found in request'}), 403
    img_obj = Image.objects(path=path)
    if len(img_obj) == 0:
        return jsonify({"msg": "Image doesn't exist!"}), 401
    # try:
    Image.objects(path=path).delete()
    return jsonify({'msg': 'Done'}), 200

# Check if path is valid!!!
@app.route('/api/images/<label>/<name>', methods=['GET'])
def sendImage(label, name):
    base = "/home/ec2-user/Server/file_system/train_image/" + label + "/" + name
    return send_file(base, mimetype='image/jpeg')

@app.route('/api/mindsight/predictions/validate', methods=['POST'])
@jwt_required
def validate_label():
    username = get_jwt_identity_override()
    content = request.get_json()
    label = content['label']
    filenames = content['filenames']
    validation = content['validation']
    if validation:#positive
        newPath = os.path.join(app.config['UPLOAD_FOLDER'], label)
        dirCount = len(os.listdir(newPath))
        for filename in filenames:
            dirCount = dirCount + 1
            newPath = os.path.join(newPath, label + '_' + str(dirCount) + 'jpeg')
            os.rename(filename, newPath)
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
    return jsonify({'msg': 'Done'}), 200
