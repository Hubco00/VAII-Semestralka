from flask import session
from Services.UserService import UserService


class AuthService:
    @staticmethod
    def authenticate_user(username, password):
        user = UserService.authenticate_user(username)
        if user:

            if UserService.check_password(user.password, password):
                return user
        return None





