from flask import session
from Services.UserService import UserService


class AuthService:
    @staticmethod
    def authenticate_user(username, password):
        user = UserService.authenticate_user(username)
        if user:
            stored_password = user.password
            if stored_password == password:
                return user
        return None





