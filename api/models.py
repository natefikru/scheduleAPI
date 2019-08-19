import os
from sqlalchemy import create_engine, Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from flask_sqlalchemy import SQLAlchemy
from flask import Flask


project_dir = os.path.dirname(os.path.abspath(__file__))
database_file = "sqlite:///{}".format(os.path.join(project_dir, "shift_database.db"))

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = database_file

db = SQLAlchemy(app)
Base = declarative_base()

class User(Base):

    __tablename__ = 'user'

    id = Column(Integer, primary_key=True)
    first_name = Column(String(1000))
    last_name = Column(String(1000))
    email = Column(String(1000))
    shifts = relationship("Shift", back_populates="user")
    is_manager = Column(Boolean)

class Shift(Base):

    __tablename__ = 'shift'

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('user.id'))
    user = relationship("User", back_populates="shifts")
    start_time = Column(Integer)
    end_time = Column(Integer)

Base.metadata.create_all(create_engine(database_file, echo=True))