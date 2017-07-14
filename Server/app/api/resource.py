from . import *

def filter_resources_location():
    # get location from session
    # get min max distance from request parameters
    label_name = request.args.get("label", None)
    min_distance = request.args.get("min", 0, float)
    max_distance = request.args.get("max", 100000000, float)
    location = get_session_object().location
    res_longitude = request.args.get("longitude", None, float)
    res_latitude = request.args.get("latitude", None, float)
    if res_latitude and res_latitude:
        location = [res_longitude, res_latitude]
    if label_name:
        rsrc = [rs for rs in Resource.objects(
            location__near=location, location__min_distance=min_distance,
            location__max_distance=max_distance, label=label_name
        ).order_by("-createdOn")]
    else:
        rsrc = [rs for rs in Resource.objects(
            location__near=location, location__min_distance=min_distance,
            location__max_distance=max_distance
        ).order_by("-createdOn")]
    ret = {
        "resources": json.loads(json.dumps(rsrc, cls=MongoEncoder))
    }
    return ret


# Get resources (all or for a particular label)
@app.route('/api/resources', methods=['GET'])
@jwt_required
def get_resources():
    ret = filter_resources_location()
    return jsonify(ret), 200


# disabled location
def render_content_feed(rsrc):
    ret = []
    if rsrc.adapterType == "google":
        gcfa = GoogleContentFeedAdapter(rsrc.query, rsrc.maxResults, rsrc.location["coordinates"])
        divs = gcfa.render_html()
        for div in divs:
            ret.append({"div": div})
    elif rsrc.adapterType == "weather":
        wcfa = WeatherContentFeedAdapter(rsrc.query, rsrc.maxResults, rsrc.location["coordinates"])
        ret.append({"div": wcfa.render_html()})
    return jsonify({"items": ret}), 200


# Get resources for a particular label
@app.route('/api/resources/<id>', methods=['GET'])
def get_resource(id):
    attach_name = "{0}.{1}"
    rsrc = Resource.objects(id=id).first()
    if not rsrc:
        return jsonify({"msg": "Resource doesn't exist"}), 400
    if isinstance(rsrc, ContentFeed):
        return render_content_feed(rsrc)
    elif isinstance(rsrc, Link):
        return jsonify({"Some": "link"}), 200
    elif isinstance(rsrc, PDFDocument) or \
            isinstance(rsrc, Text) or \
            isinstance(rsrc, Audio) or \
            isinstance(rsrc, Video):
        return send_file(
            rsrc.path, attachment_filename=attach_name.format(rsrc.name, rsrc.extension)
        )
    return jsonify({"msg": "Unknown resource type"}), 400


# TODO: delete the resource from file system
@app.route('/api/resources/<id>', methods=['DELETE'])
@jwt_required
def delete_resource(id):
    # path = "/home/ec2-user/Server/file_system/resources/" + name
    if not len(id) > 0:
        return jsonify({'msg': 'No resource found in request'}), 403

    resource_obj = Resource.objects(id=id)
    if len(resource_obj) == 0:
        return jsonify({"msg": "Resource doesn't exist!"}), 401

    Resource.objects(id=id).delete()
    # os.remove(path)
    return jsonify({'msg': 'Done'}), 200


@app.route('/api/resources', methods=['PUT'])
@jwt_required
def put_resource():
    # Modify label and whatever it is referencing
    old_label = request.json.get('name', None) # ==> thie should be the id of the target resource
    new_label = request.json.get('newname', None) # ==> this should be the new name for the target resource
    if not len(old_label) > 0:
        return jsonify({'msg': 'No label found in request'}), 403
    labelList = Resource.objects(id=old_label)
    if len(labelList) == 0:
        return jsonify({"msg": "Label doesn't exist!"}), 401
    Resource.objects(id=old_label).update_one(name=new_label) 
    return jsonify({'msg': 'Done'}), 200


@app.route('/api/resources', methods=['POST'])
@jwt_required
def post_resource():
    saved_obj = None
    try:
        # Use type to create collection documents
        res_type = request.form["type"]
        res_name = request.form["name"]
        res_label = request.form["label"]
        res_longitude = float(request.form["longitude"])
        res_latitude = float(request.form["latitude"])
        res_location = [res_longitude, res_latitude]
        res_createdBy = get_jwt_identity_override()  # Get username from auth
        # Fail early and often ;)
        allowed_res_list = ["text", "document", "link", "video", "audio", "contentfeed"]
        if not any(s == res_type for s in allowed_res_list):
            return jsonify({'msg': 'Invalid resource type'}), 400
        if res_type == "link":
            res_url = request.form["url"]
            saved_obj = Link(
                name=res_name, path=res_url, label=res_label,
                createdBy=res_createdBy, createdOn=datetime.datetime.now(),
                url=res_url, location=res_location
            ).save()
        elif res_type == "contentfeed":
            res_adapter_type = request.form["adapterType"]
            res_query = request.form["query"]
            res_maxResults = int(request.form["maxResults"])
            saved_obj = ContentFeed(
                name=res_name, path="", label=res_label,
                createdBy=res_createdBy, createdOn=datetime.datetime.now(),
                adapterType=res_adapter_type, location=res_location,
                query=res_query, maxResults=res_maxResults
            ).save()
        else:
            # Get file object
            res_file = request.files["file"]
            res_size = request.form["size"]
            # Get file extension
            res_extension = request.form["ext"]
            # Assign random name
            unique_filename = str(uuid.uuid4()) + '.' + str(res_extension)
            # res_path = os.path.join(app.config['RESOURCE_FOLDER'], unique_filename)
            res_path = "asdsd"
            # save file
            # res_file.save(res_path)
            if res_type == "text":
                saved_obj = Text(
                    name=res_name, path=res_path, label=res_label,
                    createdBy=res_createdBy, createdOn=datetime.datetime.now(),
                    extension=res_extension, size=res_size, location=res_location
                ).save()
            elif res_type == "document":
                saved_obj = PDFDocument(
                    name=res_name, path=res_path, label=res_label,
                    createdBy=res_createdBy, createdOn=datetime.datetime.now(),
                    extension=res_extension, size=res_size, location=res_location
                ).save()
            elif res_type == "video":
                saved_obj = Video(
                    name=res_name, path=res_path, label=res_label,
                    createdBy=res_createdBy, createdOn=datetime.datetime.now(),
                    extension=res_extension, size=res_size, location=res_location
                ).save()
            elif res_type == "audio":
                saved_obj = Audio(
                    name=res_name, path=res_path, label=res_label,
                    createdBy=res_createdBy, createdOn=datetime.datetime.now(),
                    extension=res_extension, size=res_size, location=res_location
                ).save()
    except KeyError:
        return jsonify({
            'msg': 'Invalid request format or missing parameters! (Use multipart form data)'
        }), 400
    except NotUniqueError:
        return jsonify({
            'msg': 'Resource with name already exists!'
        }), 400
    # Return saved object
    if not saved_obj:
        return jsonify({'msg': "Couldn't save resource!"}), 403
    return jsonify(json.loads(json.dumps(saved_obj, cls=MongoEncoder))), 200
