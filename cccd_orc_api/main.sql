CREATE DATABASE cccd_orc_db;
USE cccd_orc_db;
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(100),
    email VARCHAR(150) UNIQUE,
    password VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE storages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    name VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE cccd_records (
    id INT PRIMARY KEY AUTO_INCREMENT,
    storage_id INT,

    id_number VARCHAR(20),
    name VARCHAR(255),
    gender VARCHAR(10),
    dob DATE,

    nationality VARCHAR(50),

    origin_place TEXT,
    current_place TEXT,

    issue_date DATE,
    expire_date DATE,

    features TEXT,

    qr_text TEXT,

    fingerprint_detected BOOLEAN,

    image_path VARCHAR(255),

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (storage_id) REFERENCES storages(id)
);

CREATE TABLE cccd_images (

    id INT PRIMARY KEY AUTO_INCREMENT,

    record_id INT,

    field_name VARCHAR(50),

    image_path VARCHAR(255),

    FOREIGN KEY (record_id) REFERENCES cccd_records(id)

);

CREATE TABLE cccd_field_raw (

    id INT PRIMARY KEY AUTO_INCREMENT,

    record_id INT,

    field_name VARCHAR(50),

    raw_text TEXT,

    confidence FLOAT,

    FOREIGN KEY (record_id) REFERENCES cccd_records(id)

);