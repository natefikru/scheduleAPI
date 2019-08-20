import json
from flask import request, Response
from sqlalchemy import and_
from models import User, Shift, app, database_file
import sqlite_helper as sh
from flask_cors import CORS
import arrow

CORS(app)

SQLITE_URI = database_file


@app.route("/user", methods=["POST"])
def create_user():
    session = sh.Sqlite.get_session(url=SQLITE_URI)
    request_body = request.get_json()
    first_name = ""
    last_name = ""
    email = ""
    is_manager = False
    if request_body.get('first_name'):
        first_name = request_body['first_name']
    if request_body.get('last_name'):
        last_name = request_body['last_name']
    if request_body.get('is_manager'):
        is_manager = request_body['is_manager']
    if request_body.get('email'):
        email = request_body.get('email')

    if not first_name or not last_name or not email:
        session.close()
        resp = Response(json.dumps({'error': 'received partial data'}), status=400, mimetype='application/json')
    else:
        user = User(first_name=first_name, last_name=last_name, is_manager=is_manager, email=email)
        session.add(user)
        session.commit()
        session.close()
        resp = Response(json.dumps({'message': "User Created"}), status=201, mimetype='application/json')
    return resp

@app.route("/user/<int:user_id>", methods=["PUT"])
def edit_user(user_id):
    session = sh.Sqlite.get_session(url=SQLITE_URI)
    request_body = request.get_json()
    first_name = ""
    last_name = ""
    email = ""
    is_manager = False
    if request_body.get('first_name'):
        first_name = request_body['first_name']
    if request_body.get('last_name'):
        last_name = request_body['last_name']
    if request_body.get('is_manager'):
        is_manager = request_body['is_manager']
    if request_body.get('email'):
        email = request_body.get('email')

    if not first_name or not last_name or not email:
        session.close()
        resp = Response(json.dumps({'error': 'received partial data'}), status=400, mimetype='application/json')
    else:
        user = session.query(User).filter(
            User.id == user_id
        ).first()
        user.first_name = first_name
        user.last_name = last_name
        user.email = email
        user.is_manager = is_manager
        session.commit()
        session.close()
        resp = Response(json.dumps({'message': "User Created"}), status=200, mimetype='application/json')
    return resp


@app.route('/users', methods=["GET"])
def get_users():
    session = sh.Sqlite.get_session(url=SQLITE_URI)
    users_object_list = session.query(User).all()

    session.close()
    user_list = []
    if users_object_list:
        for user_object in users_object_list:
            return_object = {
                "id": user_object.id,
                "first_name": user_object.first_name,
                "last_name": user_object.last_name,
                "email": user_object.email,
                "is_manager": user_object.is_manager
            }
            user_list.append(return_object)
    resp = Response(json.dumps(user_list), status=200, mimetype='application/json')
    return resp


@app.route('/user/<int:user_id>', methods=["GET"])
def get_user(user_id):
    session = sh.Sqlite.get_session(url=SQLITE_URI)
    user = session.query(User).filter(
        User.id == user_id
    ).first()
    session.close()
    if user:
        return_object = {
            "id": user.id,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email,
            "is_manager": user.is_manager
        }
        resp = Response(json.dumps(return_object), status=200, mimetype='application/json')
    else:
        return Response(json.dumps({'error': "User ID does not exist"}), status=404, mimetype='application/json')
    return resp


@app.route('/user/<int:user_id>/shifts', methods=["GET"])
def get_user_shifts(user_id):
    session = sh.Sqlite.get_session(url=SQLITE_URI)
    user = session.query(User).filter(
        User.id == user_id
    ).first()
    user_shift_list = []
    if user:
        if user.shifts:
            for shift_object in user.shifts:
                shift = {
                    "id": shift_object.id,
                    "user_id": shift_object.user_id,
                    "start_time": arrow.get(shift_object.start_time).timestamp,
                    "end_time": arrow.get(shift_object.end_time).timestamp
                }
                user_shift_list.append(shift)
            session.close()
        resp = Response(json.dumps(user_shift_list), status=200, mimetype='application/json')
    else:
        session.close()
        resp = Response(json.dumps({'error': "User ID does not exist"}), status=404, mimetype='application/json')
    return resp


@app.route('/user/<int:user_id>', methods=["DELETE"])
def delete_user(user_id):
    session = sh.Sqlite.get_session(url=SQLITE_URI)
    user = session.query(User).filter(
        User.id == user_id
    ).first()
    if user:
        session.delete(user)
        session.commit()
        session.close()
        resp = Response(json.dumps({'message': 'User Deleted'}), status=200, mimetype='application/json')
    else:
        session.close()
        resp = Response(json.dumps({'error': "User does not exist"}), status=404, mimetype='application/json')
    return resp


@app.route("/shift", methods=["POST"])
def create_shift():
    session = sh.Sqlite.get_session(url=SQLITE_URI)
    request_body = request.get_json()
    user_id = None
    start_time_epoch = None
    end_time_epoch = None

    if request_body.get('user_id'):
        user_id = request_body['user_id']
    if request_body.get('start_time'):
        start_time_epoch = request_body['start_time']
    if request_body.get('end_time'):
        end_time_epoch = request_body['end_time']

    user = session.query(User).filter(
        User.id == user_id
    ).first()

    shift = Shift(user_id=user_id, start_time=arrow.get(start_time_epoch).datetime, end_time=arrow.get(end_time_epoch).datetime)

    for user_shift in user.shifts:
        if int(start_time_epoch) >= arrow.get(user_shift.start_time).timestamp and int(start_time_epoch) <= arrow.get(user_shift.end_time).timestamp:
            session.close()
            resp = Response(json.dumps({'error': 'Start Time overlaps with existing shift'}),
                            status=400, mimetype='application/json')
            return resp
        elif int(end_time_epoch) >= arrow.get(user_shift.start_time).timestamp and int(end_time_epoch) <= arrow.get(user_shift.end_time).timestamp:
            session.close()
            resp = Response(json.dumps({'error': 'End Time overlaps with existing shift'}),
                            status=400, mimetype='application/json')
            return resp

    if not start_time_epoch or not end_time_epoch:
        session.close()
        resp = Response(json.dumps({'error': 'Shift was not created, No start time or end time was provided'}), status=400, mimetype='application/json')
    elif not user_id:
        session.close()
        resp = Response(json.dumps({'error': 'Shift was not created, No user id was provided'}), status=400, mimetype='application/json')
    else:
        session.add(shift)
        session.commit()
        session.close()
        resp = Response(json.dumps({'message': "Shift Created"}), status=201, mimetype='application/json')
    return resp

@app.route('/shift/<int:shift_id>', methods=["PUT"])
def edit_shift(shift_id):
    session = sh.Sqlite.get_session(url=SQLITE_URI)
    request_body = request.get_json()
    user_id = None
    start_time_epoch = None
    end_time_epoch = None

    if request_body.get('start_time'):
        start_time_epoch = request_body['start_time']
    if request_body.get('end_time'):
        end_time_epoch = request_body['end_time']
    if request_body.get('user_id'):
        user_id = request_body['user_id']

    shift = session.query(Shift).filter(
        Shift.id == shift_id
    ).first()
    user = session.query(User).filter(
        User.id == user_id
    ).first()

    for user_shift in user.shifts:
        if int(start_time_epoch) >= arrow.get(user_shift.start_time).timestamp and int(start_time_epoch) <= arrow.get(user_shift.end_time).timestamp and user_shift.id is not shift_id:
            session.close()
            resp = Response(json.dumps({'error': 'Start Time overlaps with existing shift'}),
                            status=400, mimetype='application/json')
            return resp
        elif int(end_time_epoch) >= arrow.get(user_shift.start_time).timestamp and int(end_time_epoch) <= arrow.get(user_shift.end_time).timestamp and user_shift.id is not shift_id:
            session.close()
            resp = Response(json.dumps({'error': 'End Time overlaps with existing shift'}),
                            status=400, mimetype='application/json')
            return resp

    if not start_time_epoch or not end_time_epoch:
        session.close()
        resp = Response(json.dumps({'error': 'No start time or end time was provided'}), status=400, mimetype='application/json')
    elif not user_id:
        session.close()
        resp = Response(json.dumps({'error': 'No user id was provided'}), status=400, mimetype='application/json')
    else:
        shift.start_time = arrow.get(start_time_epoch).datetime
        shift.end_time = arrow.get(end_time_epoch).datetime
        session.commit()
        session.close()
        resp = Response(json.dumps({'message': "Shift Edited"}), status=200, mimetype='application/json')
    return resp


@app.route('/shift/<int:shift_id>', methods=["GET"])
def get_shift(shift_id):
    session = sh.Sqlite.get_session(url=SQLITE_URI)
    session.close()
    shift = session.query(Shift).filter(
        Shift.id == shift_id
    ).first()

    if shift:
        return_object = {
            "id": shift.id,
            "user_id": shift.user_id,
            "start_time": arrow.get(shift.start_time).timestamp,
            "end_time": arrow.get(shift.end_time).timestamp,
            "user_first_name": shift.user.first_name,
            "user_last_name": shift.user.last_name
        }
        resp = Response(json.dumps(return_object), status=200, mimetype='application/json')
    else:
        resp = Response(json.dumps({'error': "User does not exist"}), status=404, mimetype='application/json')
    return resp


@app.route('/shifts', methods=["GET"])
def get_shifts():
    session = sh.Sqlite.get_session(url=SQLITE_URI)

    start_time = arrow.get(0).datetime
    end_time = arrow.get(2147483647).datetime

    if request.args.get('start_time'):
        start_time = request.args.get('start_time')
    if request.args.get('end_time'):
        end_time = request.args.get('end_time')


    shift_object_list = session.query(Shift).filter(and_(
        Shift.start_time > start_time,
        Shift.end_time < end_time
    )).order_by(Shift.start_time).all()

    shift_list = []
    if shift_object_list:
        for shift_object in shift_object_list:
            shift_values = {
                "id": shift_object.id,
                "user_id": shift_object.user_id,
                "start_time": arrow.get(shift_object.start_time).timestamp,
                "end_time": arrow.get(shift_object.end_time).timestamp,
                "user_first_name": shift_object.user.first_name,
                "user_last_name": shift_object.user.last_name
            }
            shift_list.append(shift_values)
        session.close()
    resp = Response(json.dumps(shift_list), status=200, mimetype='application/json')
    return resp


@app.route('/shift/<int:shift_id>', methods=["DELETE"])
def delete_shift(shift_id):
    session = sh.Sqlite.get_session(url=SQLITE_URI)
    shift = session.query(Shift).filter(
        Shift.id == shift_id
    ).first()
    if shift:
        session.delete(shift)
        session.commit()
        session.close()
        resp = Response(json.dumps({'message': 'Value Deleted'}), status=200, mimetype='application/json')
    else:
        session.close()
        resp = Response(json.dumps({'error': "Shift does not exist"}), status=404, mimetype='application/json')
    return resp


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)
