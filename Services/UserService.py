from Models.User import User
from Models.Address import Address
from Models.Locations import Locations
from Models.Devices import Devices
from Models.Devices_Data import Devices_Data
from Models.Cities import Cities
from sqlalchemy.exc import IntegrityError
import hashlib, os, base64
from db import db


class UserService:

    def hash_password(password):
        salt = os.urandom(16)
        hashed = hashlib.scrypt(password.encode('utf-8'), salt=salt, n=16384, r=8, p=1)
        return base64.b64encode(salt + hashed).decode('utf-8')

    def check_password(hashed_password, user_password):
        decoded_hash = base64.b64decode(hashed_password)

        salt = decoded_hash[:16]
        actual_hash = decoded_hash[16:]


        new_hash = hashlib.scrypt(user_password.encode('utf-8'), salt=salt, n=16384, r=8, p=1)


        return new_hash == actual_hash

    @staticmethod
    def register_user(data):
        username = data['username']
        email = data['email']
        password_data = data['password']
        password = UserService.hash_password(password_data)

        if User.query.filter_by(username=username).first():
            return 'user-exists'
        if User.query.filter_by(email=email).first():
            return 'email-exists'

        new_user = User(
            username=username,
            email=email,
            password=password
        )
        try:
            db.session.add(new_user)
            db.session.commit()
            return 'Success'
        except IntegrityError:
            db.session.rollback()
            return 'database-error'
        except Exception as e:
            db.session.rollback()
            return str(e)
        finally:
            db.session.close()

    @staticmethod
    def delete_user(user_id):
        user = User.query.get(user_id)
        if user:
            db.session.delete(user)
            db.session.commit()

    @staticmethod
    def delete_location(locationId):
        loc = Locations.query.get(locationId)
        if loc:
            db.session.delete(loc)
            db.session.commit()
            return True
        else:
            return False

    @staticmethod
    def update_user(userId, data):
        user = User.query.get(userId)
        if user:
            user.username = data.get('username', user.username)
            user.fullName = data.get('fullName', user.fullName)
            user.gender = data.get('gender', user.gender)
            user.email = data.get('email', user.email)
            user.date_of_birth = data.get('date_of_birth', user.date_of_birth)
            user.phoneNumber = data.get('phoneNumber', user.phoneNumber)

            db.session.commit()



    @staticmethod
    def update_address(user_id, data):
        address = Address.query.filter_by(userId=user_id).first()
        if address:

            if 'street' in data:
                address.street = data['street']
            if 'flatNumber' in data:
                address.flatNumber = data['flatNumber']
            if 'postCode' in data:
                address.postCode = data['postCode']
            if 'city' in data:
                address.city = data['city']

            db.session.commit()
            return True
        else:
            user = User.query.get(user_id)

            if user:

                if 'street' in data:
                    street = data['street']
                    new_address = Address(userId=user.id, street=street)
                    db.session.add(new_address)

                if 'city' in data:
                    city = data['city']
                    new_address = Address(userId=user.id, city=city)
                    db.session.add(new_address)

                if 'postCode' in data:
                    postCode = data['postCode']
                    new_address = Address(userId=user.id, postCode=postCode)
                    db.session.add(new_address)

                db.session.commit()
                return True
            else:
                return False

    @staticmethod
    def add_location(userId, data):
        locationName = data.get('location')
        if locationName:
            new_location = Locations(userId=userId, locationName=locationName)
            db.session.add(new_location)
            db.session.commit()
            return True
        else:
            return False

    @staticmethod
    def add_device(id, data):
        device = data.get('device')
        city_data = data.get('city')
        deviceId = data.get('deviceId')

        city = Cities.query.filter_by(city=city_data).first()

        if city:
            city_id = city.id
        else:
            city_id = 0

        if city:
            new_device = Devices(userId=id, cityId=city_id, device_name=device, deviceId=deviceId)
            db.session.add(new_device)
            db.session.commit()
            return True
        return False

    @staticmethod
    def authenticate_user(username):
        user = User.query.filter_by(username=username).first()
        if user:
            return user
        return None

    @staticmethod
    def get_users_address_validation(userId):
        user = User.query.get(userId)
        if user:
            address = Address.query.filter_by(userId=user.id).first()
            if address:
                return True
        return False

    @staticmethod
    def get_locations(userId):
        locations = Locations.query.filter_by(userId=userId).all()
        locations_json = []

        for location in locations:
            location_data = {
                'id': location.id,
                'locationName': location.locationName,
            }
            locations_json.append(location_data)

        return locations_json

    @staticmethod
    def get_devices(userId):
        devices = Devices.query.filter_by(userId=userId).all()

        devices_json = []
        for device in devices:
            city = Cities.query.filter_by(id=device.cityId).first()
            device_data = {
                'type': device.device_name,
                'id': device.deviceId,
                'city': city.city
            }
            devices_json.append(device_data)
        return devices_json

    @staticmethod
    def get_user_info(username):
        user = User.query.filter_by(username=username).first()
        if user:
            address = Address.query.filter_by(userId=user.id).first()
            user_info = {
                'username': user.username,
                'email': user.email,
                'fullName': user.fullName,
                'gender': user.gender,
                'date_of_birth': str(user.date_of_birth) if user.date_of_birth else None,
                'phoneNumber': user.phoneNumber,
                'street': None,
                'flatNumber': None,
                'postCode': None,
                'city': None
            }
            if address:
                user_info['street'] = address.street
                user_info['flatNumber'] = address.flatNumber
                user_info['postCode'] = address.postCode
                user_info['city'] = address.city
            return user_info

        return None

    @staticmethod
    def getUser(userId):
        user = User.query.get(int(userId))
        if user:
            return user
        return None

    @staticmethod
    def get_count_devices(userId):
        count = Devices.query.filter_by(userId=userId).count()
        return count










