import os

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "secret")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "jwt-super-secret-key")

    SQLALCHEMY_DATABASE_URI = "mysql+pymysql://root:@localhost/cccd_orc_db"
    #SQLALCHEMY_DATABASE_URI = "sqlite:///database.db"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    UPLOAD_FOLDER = "uploads"