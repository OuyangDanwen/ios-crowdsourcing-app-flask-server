from . import *


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
    base = "/home/ec2-user/Server/file_system/thumbnails/" + label + "/" + name
    return send_file(base, mimetype='image/jpeg')
