from . import *


# Generate unique session id, and store it
def create_session(username, location):
    session_key = "{0}.{1}".format(uuid.uuid4(), username)
    sess = UserSession(session_key, username, location)
    # Store session data
    localSessionStorage.put(session_key, sess)
    return create_access_token(identity=sess)


@app.route('/api/register', methods=['POST'])
def register():
    name = request.json.get('name', None)
    username = request.json.get('username', None)
    password = request.json.get('password', None)
    location = request.json.get('location', [])
    if username is None or password is None or name is None:
        return jsonify({"msg": "Invalid request"}), 401
    if user_exists(username):
        return jsonify({"msg": "User already exists"}), 401
    user = User(
        name=name, usertype="user", username=username,
        password=password, createdOn=datetime.datetime.now(),
        lastLogin=datetime.datetime.now()
    )
    user.save()
    ret = {
        'access_token': create_session(username, location)
    }
    return jsonify(ret), 200


# Standard login endpoint
@app.route('/api/login', methods=['POST'])
def login():
    username = request.json.get('username', None)
    password = request.json.get('password', None)
    location = request.json.get('location', None)
    user = User.objects(username=username, password=password)
    if len(user) == 0:
        return jsonify({"msg": "Bad User or Password"}), 401
    User.objects(username=username).update_one(lastLogin=datetime.datetime.now())

    # Login needs to have location attribute set
    if location is None:
        return jsonify({"msg": "Location is not set"}), 401

    ret = {
        'access_token': create_session(username, location)
    }
    return jsonify(ret), 200


# Endpoint for revoking the current users access token
@app.route('/api/logout', methods=['GET'])
@jwt_required
def logout():
    try:
        # delete session data
        key = get_jwt_identity()
        localSessionStorage.delete(key)
        revoke_current_token()
    except KeyError:
        return jsonify({
            'msg': 'Access token not found in the blacklist store'
        }), 400
    return jsonify({"msg": "Successfully logged out"}), 200
