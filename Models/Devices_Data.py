from db import db
class Devices_Data(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    device = db.Column(db.Integer, db.ForeignKey('devices.id', ondelete='CASCADE'), nullable=False)
    data_info = db.Column(db.String(200))

    # Define the relationship to access the device associated with this data
    device_association = db.relationship('Devices', backref=db.backref('devices_data', cascade='all, delete-orphan'))