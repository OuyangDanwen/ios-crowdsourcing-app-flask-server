from flask import render_template, request, redirect, url_for, flash, jsonify
from werkzeug.utils import secure_filename
from app import app, schema
import os
import tensorflow as tf
import thread
import json
import base64
import datetime
from mongoengine.connection import _get_db
from PIL import Image


ALLOWED_EXTENSIONS = set(['jpg', 'jpeg'])
modelFullPath = '/home/ec2-user/Server/tensorflow/retrained_model/output_graph.pb'
isGraphCreated = False

def create_graph():
    """Creates a graph from saved GraphDef file and returns a saver."""
    # Creates graph from saved graph_def.pb.
    with tf.gfile.FastGFile(modelFullPath, 'rb') as f:
        graph_def = tf.GraphDef()
        graph_def.ParseFromString(f.read())
        _ = tf.import_graph_def(graph_def, name='')

def predict(img_path, mode):
    f = open("/home/ec2-user/Server/log.txt", "a+")
    start = datetime.datetime.now()
    global isGraphCreated
    if not isGraphCreated:
        create_graph()
        isGraphCreated = True
    end = datetime.datetime.now()
    from predict_image import predictImage
    lbs = predictImage(img_path, mode)
    final_end = datetime.datetime.now()
    elapsed_time = end - start
    final_elapsed_time = final_end - start
    f.write("Time spent on loading the graph: " + str(elapsed_time) + "\n")
    f.write("Total time spent: " + str(final_elapsed_time) + ".\n")
    f.close()
    return lbs


def insert_training_data_and_create_labels():
    cwd = os.listdir(app.config['UPLOAD_FOLDER'])
    user = None
    if schema.User.objects(username="dummy").count() == 0:
        user = schema.User(
            usertype="admin", 
            name="admin", 
            username="dummy", 
            password="test", 
            createdOn=datetime.datetime.now(),
            lastLogin=datetime.datetime.now()
        )
        user.save()
    else:
        user = schema.User.objects.get(username="dummy")   

    for dir in cwd:
        label_path = os.path.join(app.config['UPLOAD_FOLDER'], dir)
        lb = schema.Label(
                name=dir, 
                path=label_path,
                createdOn=datetime.datetime.now(),
                createdBy=user.username
            )
        lb.save()
        files = os.listdir(label_path)
        for file in files:
            file_path = os.path.join(label_path, file)
            img = schema.Image(
                name=file, 
                path=file_path, 
                label=lb.name, 
                createdOn=datetime.datetime.now(),
                createdBy=user.username
            )
            img.save()        

def create_user(username):
    if schema.User.objects(username=username).count() == 0:
        user = schema.User(
            usertype="admin", 
            name="admin", 
            username=username, 
            password="test",
            createdOn=datetime.datetime.now(),
            lastLogin=datetime.datetime.now()
        )
        user.save() 

def create_label(label_name, username="dummy"):
    label_path = os.path.join(app.config['UPLOAD_FOLDER'], label_name)
    if schema.Label.objects(name=label_name).count() == 0:
        # user = schema.User.objects.get(username=username)
        lb = schema.Label(
            name=label_name, 
            path=label_path,
            createdOn=datetime.datetime.now(),
            createdBy=username
        )
        lb.save()        
    
def add_label_and_image(label_name, image_name, username="dummy"):
    create_user(username)
    create_label(label_name, username)
    file_path = os.path.join(os.path.join(app.config['UPLOAD_FOLDER'], label_name), image_name)
    lb = schema.Label.objects.get(name=label_name)
    user = schema.User.objects.get(username=username)
    img = schema.Image(
        name=image_name, 
        path=file_path, 
        label=lb.name, 
        createdOn=datetime.datetime.now(),
        createdBy=username
    )
    img.save()
    return       


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def handleLabel(text, file):
    labels = os.listdir(app.config['UPLOAD_FOLDER'])
    dirCount = {}
    if text in labels:
        dirCount[text] = len(os.listdir(os.path.join(app.config['UPLOAD_FOLDER'], text))) + 1
        newName = text + "/" + str(dirCount[text]) + ".jpg"
        newName = os.path.join(app.config['UPLOAD_FOLDER'], newName)
        file.save(newName)
        add_label_and_image(text.lower(), newName)
    else :
        newdir = os.path.join(app.config['UPLOAD_FOLDER'], text)
        os.mkdir(newdir)
        newName = os.path.join(newdir, "1.jpg")
        file.save(newName)
        add_label_and_image(text, newName)


@app.route('/', methods=['GET', 'POST'])
@app.route('/index', methods=['GET','POST'])
def index():
    if schema.Label.objects().count() == 0 and schema.Image.objects().count() == 0:
        insert_training_data_and_create_labels()
    if request.method == 'POST':
        if 'upload' in request.form:
            error = False
            files = request.files.getlist('files')
            for file in files:
                if file and allowed_file(file.filename):
                    try: 
                        handleLabel(request.form['text'].lower(), file)
                    except:
                        flash("Error: Failed to upload a labeled image!")
                        error = True
                        break
                else:
                    flash("Error: Only JPEG allowed!")
                    error = True
                    break
            if error == False:
                flash("Success: Labeled image saved!")
        elif 'predict' in request.form:
            file = request.files['file']
            if file and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                try: file.save(os.path.join(app.config['TEMP_FOLDER'], filename))
                except:
                    flash("Error: Failed to upload the image for prediction!")
                else:
                    return redirect(url_for('predict_image', filename = filename))
            else:
                flash("Error: Only JPEG allowed!")
        else:
            return redirect(url_for(request.url))

    user = {'name': 'Danwen'}
    return render_template('index.html', 
        title='Dashboard', user=user)

## TODO: Depreceate in next version (Implemented in api.py)
@app.route('/get_labels', methods=["GET"])
def get_labels():
    dirs = os.listdir(app.config['LABEL_FOLDER'])
    lbs = []
    db = _get_db()
    for dir in dirs:
        dic = {}
        dic['name'] = dir
        lb = schema.Label.objects.get(name=dir)
        dic['time'] = lb.createdOn
        lbs.append(dic)
    return jsonify(lbs)


@app.route('/predict_image', methods=['GET','POST'])
def predict_image():
    if request.method == 'POST':
        file = request.files["file[]"]
        img_path = ""
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            img_path = os.path.join(app.config['TEMP_FOLDER'], filename)
            file.save(img_path)
            lbs = predict(img_path, "dashboard")
            return jsonify(lbs)
    #remove this later

    filename = request.args['filename']
    filename = app.config['TEMP_FOLDER'] + filename
    img = Image.open(filename)
    output = predict(filename, "dashboard")

    size = str(img.size)
    with open("/home/ec2-user/Server/log.txt", "a+") as f:
        f.write("Image size: " + size + "\n")

    return render_template('predict_image.html', output = output)

    
    #return jsonify("Unrecognized Request")

## TODO: Depreceate in next version (Implemented in api.py)
@app.route('/show_version', methods=["GET"])
def show_version():
    return jsonify(version=tf.__version__)

@app.route('/retrain_model', methods=["GET"])
def retrain_module():
    from retrain_model import retrain
    thread.start_new_thread(retrain,())
    message = "Retraining has started in the background!"
    return render_template('retrain_model.html', message = message)

@app.route('/post', methods=["GET", "POST"])
def postForMobile():
    content = request.get_json()
    command = content['command']
    if command == 'classify':
        data = base64.b64decode(content['image'])
        filename = os.path.join(app.config['TEMP_FOLDER'], "tmp.jpg")
        with open(filename, 'wb') as f:
            f.write(data)
        lbs = predict(filename, "mobile")
        return jsonify(lbs)
    elif command == 'label':
        data = base64.b64decode(content['image'])
        text = content['label'].lower()
        username = content['username']
        labels = os.listdir(app.config['UPLOAD_FOLDER'])
        dirCount = {}

        if text in labels:
            dirCount[text] = len(os.listdir(os.path.join(app.config['UPLOAD_FOLDER'], text))) + 1
            newName = text + "/" + str(dirCount[text]) + ".jpg"
            newName = os.path.join(app.config['UPLOAD_FOLDER'], newName)
            with open(newName, 'wb') as f:
                f.write(data)
            add_label_and_image(text, newName, username)
        else :
            newdir = os.path.join(app.config['UPLOAD_FOLDER'], text)
            os.mkdir(newdir)
            newName = os.path.join(newdir, "1.jpg")
            with open(newName, 'wb') as f:
                f.write(data)
            add_label_and_image(text, newName, username)
        return jsonify("Success")
    else:
        return jsonify("Unrecognized Request")


@app.route('/add_label', methods=["GET", "POST"])
def addLabel():
    return jsonify("Unrecognized Request")

@app.route('/test', methods=["GET", "POST"])
def test():
    images = os.listdir(app.config['TEMP_FOLDER'])
    num_images = len(images)
    index = num_images
    if request.method == 'POST':
        files = request.files.getlist("file[]")
        for file in files:
            if file and allowed_file(file.filename):
                filename = str(index) + ".jpg"
                file.save(os.path.join(app.config['TEMP_FOLDER'], filename))
                index = index + 1
    return jsonify("success")



@app.route('/label', methods=["GET","POST"])
def labelForDashboard():
    #only this part will matter to you
    content = request.get_json()
    imgs = content['images']
    data = []
    for img in imgs:
        data.append(base64.b64decode(img))
    #end of part

    label = content['label'].lower()
    username = content['username']
    labels = os.listdir(app.config['UPLOAD_FOLDER'])
    dirCount = {}
    if label in labels:
        for img in data:
            dirCount[label] = len(os.listdir(os.path.join(app.config['UPLOAD_FOLDER'], label))) + 1
            newName = label + "/" + str(dirCount[label]) + ".jpg"
            newName = os.path.join(app.config['UPLOAD_FOLDER'], newName)
            with open(newName, 'wb') as f:
                f.write(img)
            add_label_and_image(label, newName, username)
    else :
        newdir = os.path.join(app.config['UPLOAD_FOLDER'], label)
        os.mkdir(newdir)
        dirCount[label] = 0
        for img in data:
            dirCount[label] = dirCount[label] + 1
            newName = os.path.join(newdir, str(dirCount[label]))
            with open(newName, 'wb') as f:
                f.write(data)
            add_label_and_image(label, newName, username)

    return jsonify("Success")