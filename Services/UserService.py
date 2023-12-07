from Models.User import User
from Models.Address import Address
from db import db


class UserService:
    @staticmethod
    def register_user(data):
        username = data['username']
        email = data['email']
        password = data['password']

        # Create a new user
        new_user = User(
            username=username,
            email=email,
            password=password
        )
        try:
            # Add the new user and address to the session
            db.session.add(new_user)
            db.session.commit()
            return True  # Indicate successful registration
        except Exception as e:
            # Rollback changes in case of error
            db.session.rollback()
            print(str(e))  # Log the error for debugging
            return False  # Indicate registration failure
        finally:
            db.session.close()

    @staticmethod
    def delete_user(user_id):
        user = User.query.get(user_id)
        if user:
            db.session.delete(user)
            db.session.commit()

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
            # Update address fields based on new_data
            if 'street' in data:
                address.street = data['street']
            if 'flatNumber' in data:
                address.flatNumber = data['flatNumber']
            if 'postCode' in data:
                address.postCode = data['postCode']
            if 'city' in data:
                address.city = data['city']

            db.session.commit()
            return True  # Return True to indicate successful update
        else:
            user = User.query.get(user_id)  # Fetch the logged-in user by their ID

            if user:
                # Create a new Address instance and associate it with the user
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

                # Commit changes to the database
                db.session.commit()
                return True
            else:
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
            if address:  # Check if the address exists
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
