USERS (tài khoản)
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(100),
    email VARCHAR(150) UNIQUE,
    password_hash VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

STORAGES (kho lưu trữ)
Một user có nhiều kho.
Ví dụ:
-Kho CCCD khách hàng
-Kho CCCD nhân viên
CREATE TABLE storages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    name VARCHAR(255),
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id)
);

CCCD_RECORDS (thông tin CCCD)
CREATE TABLE cccd_records (

    id INT PRIMARY KEY AUTO_INCREMENT,

    storage_id INT,

    -- thông tin chính
    id_number VARCHAR(20),   -- số CCCD
    name VARCHAR(255),
    gender VARCHAR(10),
    dob DATE,
    nationality VARCHAR(50),

    origin_place TEXT,      -- quê quán
    current_place TEXT,     -- nơi thường trú

    issue_date DATE,
    expire_date DATE,

    features TEXT,          -- đặc điểm nhận dạng


    qr_text TEXT,
    fingerprint_detected BOOLEAN,

    -- metadata
    image_path VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (storage_id) REFERENCES storages(id)
);

FIELD_RAW_DATA (Lưu text OCR thô của từng field.)
CREATE TABLE cccd_field_raw (

    id INT PRIMARY KEY AUTO_INCREMENT,

    record_id INT,

    field_name VARCHAR(50),

    raw_text TEXT,

    confidence FLOAT,

    FOREIGN KEY (record_id) REFERENCES cccd_records(id)
);

IMAGES (lưu crop từng field - nếu cần)
CREATE TABLE cccd_images (

    id INT PRIMARY KEY AUTO_INCREMENT,

    record_id INT,

    field_name VARCHAR(50),

    image_path VARCHAR(255),

    FOREIGN KEY (record_id) REFERENCES cccd_records(id)
);

Index(search nhanh)
CREATE INDEX idx_cccd_number ON cccd_records(id_number);
CREATE INDEX idx_name ON cccd_records(name);
CREATE INDEX idx_dob ON cccd_records(dob);
