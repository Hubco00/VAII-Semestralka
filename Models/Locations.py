from db import db
class Locations(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    userId = db.Column(db.Integer, db.ForeignKey('user.id', ondelete='CASCADE'), nullable=False)
    locationName = db.Column(db.String(200), nullable=False)

    user_association = db.relationship('User', backref=db.backref('locations', cascade='all, delete-orphan'))
