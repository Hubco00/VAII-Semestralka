from db import db
from datetime import datetime
from flask_login import  UserMixin
class User(UserMixin, db.Model):

    id = db.Column(db.Integer, primary_key=True)
    fullName = db.Column(db.String(200), nullable=True)
    username = db.Column(db.String(200), nullable=False, unique=True)
    gender = db.Column(db.String(50), nullable=True)
    email = db.Column(db.String(200), nullable=False, unique=True)
    password = db.Column(db.String(200), nullable=False)
    date_of_birth = db.Column(db.DateTime, nullable=True)
    phoneNumber = db.Column(db.String(20), nullable=True)




