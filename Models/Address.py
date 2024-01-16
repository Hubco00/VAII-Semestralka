from db import db

class Address(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    userId = db.Column(db.Integer, db.ForeignKey('user.id', ondelete='CASCADE'), nullable=False)
    street = db.Column(db.String(200), nullable=True)
    flatNumber = db.Column(db.Integer, nullable=True)
    postCode = db.Column(db.String(200), nullable=True)
    city = db.Column(db.String(200), nullable=True)

    # Define the relationship to access the user associated with this address
    user_association = db.relationship('User', backref=db.backref('addresses', cascade='all, delete-orphan'))

