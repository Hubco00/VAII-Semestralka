from db import db
class Devices(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    userId = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    cityId = db.Column(db.Integer, db.ForeignKey('cities.id'), nullable=False)
    device_name = db.Column(db.String(200))
    deviceId = db.Column(db.String(200))

    user_association = db.relationship('User', backref='devices')
    city_association = db.relationship('Cities', backref='devices')
