CREATE TABLE user (
    id INTEGER PRIMARY KEY,
    fullName VARCHAR(200),
    username VARCHAR(200) NOT NULL UNIQUE,
    gender VARCHAR(50),
    email VARCHAR(200) NOT NULL UNIQUE,
    password VARCHAR(200) NOT NULL,
    date_of_birth TIMESTAMP,
    phoneNumber VARCHAR(20),
    isAdmin INTEGER NOT NULL
);

CREATE TABLE address (
    id INTEGER PRIMARY KEY,
    userId INTEGER NOT NULL,
    street VARCHAR(200),
    flatNumber INTEGER,
    postCode VARCHAR(200),
    city VARCHAR(200),
    FOREIGN KEY (userId) REFERENCES user(id) ON DELETE CASCADE
);

CREATE TABLE cities (
    id INTEGER PRIMARY KEY,
    city VARCHAR(200)
);

CREATE TABLE devices (
    id INTEGER PRIMARY KEY,
    userId INTEGER NOT NULL,
    cityId INTEGER NOT NULL,
    device_name VARCHAR(200),
    deviceId VARCHAR(200),
    FOREIGN KEY (userId) REFERENCES user(id),
    FOREIGN KEY (cityId) REFERENCES cities(id)
);

CREATE TABLE locations (
    id INTEGER PRIMARY KEY,
    userId INTEGER NOT NULL,
    locationName VARCHAR(200) NOT NULL,
    FOREIGN KEY (userId) REFERENCES user(id) ON DELETE CASCADE
);
