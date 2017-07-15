from . import *


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
    if len(Label.objects(name=label)) > 0:
        return jsonify({"msg": "Label already exist!"}), 401
    username = get_jwt_identity_override()
    # Save label
    saved_obj = saveLabel(label, username)
    if not saved_obj:
        return jsonify({'msg': 'Error while creating label'}), 400
    files = request.files.getlist('files[]')
    saveLabelPhotos(files, label, username)
    return jsonify(json.loads(json.dumps(saved_obj, cls=MongoEncoder))), 200

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
