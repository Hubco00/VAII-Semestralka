from flask import Flask, request, jsonify, redirect, render_template, session, url_for
from db import db
from Services.UserService import UserService
from Authentication.AuthService import AuthService
from flask_cors import CORS
import secrets
from flask_login import LoginManager, login_user, login_required, current_user,logout_user
from werkzeug.security import check_password_hash
from flask import session

login_manager = LoginManager()

app = Flask(__name__)
app.secret_key = secrets.token_hex(16)

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:201022.Idk@localhost/users'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

CORS(app, supports_credentials=True)


db.init_app(app)
login_manager.init_app(app)


@login_manager.user_loader
def load_user(user_id):
    user_data = UserService.getUser(user_id)
    return user_data

def is_user_authenticated():
    return session.get('user_id') is not None

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')

        if username and password:
            user = AuthService.authenticate_user(username, password)

            if user:
                login_user(user, remember=True)
                if user.is_authenticated:
                    login_user(user)
                    session['logged_in'] = True
                    session['user_id'] = user.id
                    return jsonify({'message': 'true'})
                else:
                    return jsonify({'message': 'false'})

        return jsonify({'success': False}), 401

@app.route('/getUsersAddressValidation', methods=['GET'])
@login_required
def get_users_address_validation():
    if UserService.get_users_address_validation(current_user.id):
        return jsonify({'success': 'true'})
    else:
        return jsonify({'success': 'false'})

@app.route('/logout', methods=['GET'])
def logout():
    logout_user()
    return redirect(url_for('home'))


@app.route('/getLoggedInUser', methods=['GET'])
@login_required
def get_logged_user():
    if is_user_authenticated():
        user_info = UserService.get_user_info(current_user.username)
        return jsonify({'user': user_info}), 201
    else:
        return jsonify({'success': 'false'}), 402



@app.route('/registerUser', methods=['POST'])
def register_user():
    if request.method == 'POST':
        data = request.get_json()
        if len(data['password']) > 5:
            if UserService.register_user(data):
                return jsonify({'message': 'true'}), 201
            else:
                return jsonify({'message': 'false'}), 401
        else:
            return jsonify({'message': 'false'}), 400


@app.route('/deleteUser/<int:user_id>', methods=['DELETE'])
@login_required
def delete_user(user_id):
    UserService.delete_user(user_id)
    return redirect(url_for('home'))

@app.route('/deleteLocation/<int:locationId>', methods=['DELETE'])
@login_required
def delete_location(locationId):
    if UserService.delete_location(locationId):
        return jsonify({'success': 'true'}), 201
    else:
        return jsonify({'success': 'false'}), 401


@app.route('/updateUser', methods=['POST'])
@login_required
def update_user():
    data = request.get_json()
    if current_user.is_authenticated:
        UserService.update_user(current_user.id, data)
        return jsonify({'success': 'true'}), 200
    else:
        return jsonify({'success': 'false'}), 401




@app.route('/addAddress', methods=['POST'])
@login_required
def add_address():
    if request.method == 'POST':
        data = request.get_json()
        if current_user.is_authenticated:

            UserService.add_address(current_user.id, data)

            return jsonify({'success': 'true'}), 201
        else:
            return jsonify({'success': 'false'}), 401

@app.route('/getUsersLocations', methods=['GET'])
@login_required
def get_locations():
    locations = UserService.get_locations(current_user.id)
    print(locations)
    return jsonify({'data': locations}), 201

@app.route('/addLocation', methods=['POST'])
@login_required
def add_location():
    if request.method == 'POST':
        data = request.get_json()
        if current_user.is_authenticated:

            if UserService.add_location(current_user.id, data):
                return jsonify({'success': 'true'}), 201
            else:
                return jsonify({'success': 'false'}), 401
        else:
            return jsonify({'success': 'false'}), 401



@app.route('/updateAddress', methods=['POST'])
@login_required
def update_address():
    if request.method == 'POST':

        data = request.get_json()
        if current_user.is_authenticated:
            UserService.update_address(current_user.id, data)
            return jsonify({'success': 'true'}), 200
        else:
            return jsonify({'success': 'false'}), 401

@app.route('/getUserId', methods=['GET'])
@login_required
def get_user_id():
    return jsonify({'data':current_user.id})

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/devices')
def devices():
    return render_template('devices.html')

@app.route('/loginPage')
def loginPage():
    return render_template('login.html')

@app.route('/profile')
def profile():
    return render_template('profile-edit.html')

@app.route('/registration')
def registration():
    return render_template('registration.html')

@app.route('/monthlyWeather')
def monthlyWeather():
    return render_template('monthlyWeather.html')

@app.route('/currentWeather')
def currentWeather():
    return render_template('currentWeather.html')

@app.route('/hourlyWeather')
def hourlyWeather():
    return render_template('hourlyWeather.html')

if __name__ == '__main__':
    app.run()
