import json
from flask import Flask, request
from sqlalchemy import  and_, desc
from sqlalchemy.orm import sessionmaker
from models import User, Shift, app, database_file
import sqlite_helper as sh

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
    is_manager = False
    if request_body.get('first_name'):
        first_name = request_body['first_name']
    if request_body.get('last_name'):
        last_name = request_body['last_name']
    if request_body.get('is_manager'):
        is_manager = request_body['is_manager']
    user = User(first_name=first_name, last_name=last_name, is_manager=is_manager)
    session.add(user)
    session.commit()
    session.close()
    return json.dumps({'message' : "User Created"})

@app.route('/user/<int:user_id>', methods=["GET"])
def get_user(user_id):
    session = sh.Sqlite.get_session(url=SQLITE_URI)
    user = session.query(User).filter(
        User.id == user_id
    ).first()
    session.close()
    if user:
        return_object = {
            "id" : user.id,
            "first_name" : user.first_name,
            "last_name" : user.last_name
        }
        return json.dumps(return_object)
    else:
        return json.dumps({'error' : "User ID does not exist"})


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
        return json.dumps({'message' : 'Shift was not created, No start time or end time was provided'})
    else:
        session.add(shift)
        session.commit()
        session.close()
        return json.dumps({'message' : "Shift Created"})


@app.route('/shift/<int:shift_id>', methods=["GET"])
def get_shift(shift_id):
    session = sh.Sqlite.get_session(url=SQLITE_URI)
    session.close()
    shift = session.query(Shift).filter(
        Shift.id == shift_id
    ).first()
    if shift:
        return_object = {
            "id" : shift.id,
            "user_id" : shift.user_id,
            "start_time" : shift.start_time,
            "end_time" : shift.end_time
        }
        return json.dumps(return_object)
    else:
        return json.dumps({'error' : "User does not exist"})

@app.route('/shift', methods=["GET"])
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

    session.close()

    shift_list = []
    if shift_object_list :
        for shift_object in shift_object_list:
            shift_values = {
                "id" : shift_object.id,
                "user_id" : shift_object.user_id,
                "start_time" : shift_object.start_time,
                "end_time" : shift_object.end_time
            }
            shift_list.append(shift_values)
        return json.dumps(shift_list)
    else:
        return json.dumps({'message' : 'No Shifts were found'})



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
        return json.dumps({'message' : 'Value Deleted'})
    else:
        session.close()
        return json.dumps({'error' : "Shift does not exist"})


if __name__=="__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)