from db import db

class Cities(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    city = db.Column(db.String(200))