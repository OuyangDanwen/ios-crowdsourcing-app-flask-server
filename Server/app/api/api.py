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

@app.route('/api/resources', methods=['GET'])
def getResources():
    rsrc = [rs for rs in Resource.objects().order_by("-createdOn")]
    ret = {
        "resources": json.loads(json.dumps(rsrc, cls=MongoEncoder))
    }
    return jsonify(ret), 200

@app.route('/api/backend_version', methods=['GET'])
@jwt_required
def getBackendVersion():
    return jsonify({'version': CURRENT_SERVER_VERSION}), 200

# Get resources for a particular label
@app.route('/api/<label>/resources', methods=['GET'])
def getLabelsResources(label):
    rsrc = [rs for rs in Resource.objects(label=label).order_by("-createdOn")]
    ret = {
        "resources": json.loads(json.dumps(rsrc, cls=MongoEncoder))
    }
    return jsonify(ret), 200

#TODO: delete the resource from file system
@app.route('/api/resources/<name>', methods=['DELETE'])
@jwt_required
def deleteResource(name):
    # path = "/home/ec2-user/Server/file_system/resources/" + name
    if not len(name) > 0:
        return jsonify({'msg': 'No resource found in request'}), 403

    resource_obj = Resource.objects(name=name)
    if len(resource_obj) == 0:
        return jsonify({"msg": "Resource doesn't exist!"}), 401

    Resource.objects(name=name).delete()
    #os.remove(path)
    return jsonify({'msg': 'Done'}), 200


@app.route('/api/resources/', methods=['PUT'])
@jwt_required
def putResource():
        # Modify label and whatever it is referencing
    old_label = request.json.get('name', None)
    new_label = request.json.get('newname', None)
    if not len(old_label) > 0:
        return jsonify({'msg': 'No label found in request'}), 403
    labelList = Resource.objects(name=old_label)
    if len(labelList) == 0:
        return jsonify({"msg": "Label doesn't exist!"}), 401
    Resource.objects(name=old_label).update_one(name=new_label)
    return jsonify({'msg': 'Done'}), 200

@app.route('/api/resources', methods=['POST'])
@jwt_required
def postResource():
    try:
        # Use type to create collection documents
        res_type = request.form["type"]
        res_name = request.form["name"]
        res_label = request.form["label"]
        res_createdBy = get_jwt_identity_override()  # Get username from auth
        # Fail early and often ;)
        if not any(s in res_type for s in ["document", "link", "video", "audio"]):
            return jsonify({'msg': 'Invalid resource format'}), 400
        if res_type == "link":
            res_url = request.form["url"]
            Link(
                name=res_name, path=res_url, label=res_label,
                createdBy=res_createdBy, createdOn=datetime.datetime.now(),
                url=res_url
            ).save()
            return jsonify({'msg': 'Saved!'}), 200
        # Get file object
        file = request.files["file"]
        res_size = request.form["size"]
        # Get file extension
        res_extension = file.filename.rsplit('.', 1)[1].lower()
        # Assign random name
        unique_filename = str(uuid.uuid4()) + '.' + str(res_extension)
        res_path = os.path.join(app.config['RESOURCE_FOLDER'], unique_filename)
        # save file
        file.save(res_path)
        if res_type == "document":
            Document(
                name=res_name, path=res_path, label=res_label,
                createdBy=res_createdBy, createdOn=datetime.datetime.now(),
                extension=res_extension, size=res_size
            ).save()
        elif res_type == "video":
            Video(
                name=res_name, path=res_path, label=res_label,
                createdBy=res_createdBy, createdOn=datetime.datetime.now(),
                extension=res_extension, size=res_size
            ).save()
        elif res_type == "audio":
            Audio(
                name=res_name, path=res_path, label=res_label,
                createdBy=res_createdBy, createdOn=datetime.datetime.now(),
                extension=res_extension, size=res_size
            ).save()
    except KeyError:
        return jsonify({
            'msg': 'Missing required request format'
        }), 400
    except NotUniqueError:
        return jsonify({
            'msg': 'URL already exists!'
        }), 400
    return jsonify({'msg': 'Done'}), 200

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
