import json
from flask import request
from sqlalchemy import and_
from models import User, Shift, app, database_file
import sqlite_helper as sh
from flask_cors import CORS

CORS(app)

SQLITE_URI = database_file


@app.route("/", methods=["GET", "POST"])
def home():
    return "My flask app"


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
    user = User(first_name=first_name, last_name=last_name, is_manager=is_manager, email=email)
    session.add(user)
    session.commit()
    session.close()
    return json.dumps({'message': "User Created"})


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
        return json.dumps(user_list)
    else:
        return json.dumps({'message': 'No Users were found'})


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
        return json.dumps(return_object)
    else:
        return json.dumps({'error': "User ID does not exist"})


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
                    "start_time": shift_object.start_time,
                    "end_time": shift_object.end_time
                }
                user_shift_list.append(shift)
            session.close()
            return json.dumps(user_shift_list)
    else:
        session.close()
        return json.dumps({'error': "User ID does not exist"})


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
        return json.dumps({'message': 'User Deleted'})
    else:
        session.close()
        return json.dumps({'error': "User does not exist"})


@app.route("/shift", methods=["POST"])
def create_shift():
    session = sh.Sqlite.get_session(url=SQLITE_URI)
    request_body = request.get_json()
    user_id = None
    start_time = None
    end_time = None
    if request_body.get('user_id'):
        user_id = request_body['user_id']
    if request_body.get('start_time'):
        start_time = request_body['start_time']
    if request_body.get('end_time'):
        end_time = request_body['end_time']
    shift = Shift(user_id=user_id, start_time=start_time, end_time=end_time)
    if not start_time or not end_time:
        session.close()
        return json.dumps({'message': 'Shift was not created, No start time or end time was provided'})
    else:
        session.add(shift)
        session.commit()
        session.close()
        return json.dumps({'message': "Shift Created"})


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
            "start_time": shift.start_time,
            "end_time": shift.end_time,
            "user_first_name": shift.user.first_name,
            "user_last_name": shift.user.last_name
        }
        return json.dumps(return_object)
    else:
        return json.dumps({'error': "User does not exist"})


@app.route('/shifts', methods=["GET"])
def get_shifts():
    session = sh.Sqlite.get_session(url=SQLITE_URI)

    start_time = -2147483648
    end_time = 2147483647

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
                "start_time": shift_object.start_time,
                "end_time": shift_object.end_time,
                "user_first_name": shift_object.user.first_name,
                "user_last_name": shift_object.user.last_name
            }
            shift_list.append(shift_values)
        session.close()
        return json.dumps(shift_list)

    else:
        session.close()
        return json.dumps({'message': 'No Shifts were found'})


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
        return json.dumps({'message': 'Value Deleted'})
    else:
        session.close()
        return json.dumps({'error': "Shift does not exist"})


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)
