import os

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key-123")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "jwt-dev-secret-key")

    # Railway sẽ cung cấp biến MYSQL_URL hoặc DATABASE_URL khi bạn tạo Database
    # Nếu không có (chạy local), nó sẽ dùng cái mặc định phía sau
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", "mysql+pymysql://root:@localhost/cccd_orc_db")
    
    # Lưu ý: Railway đôi khi trả về url bắt đầu bằng 'mysql://', 
    # bạn cần đảm bảo nó là 'mysql+pymysql://' để tránh lỗi thiếu driver
    if SQLALCHEMY_DATABASE_URI.startswith("mysql://"):
        SQLALCHEMY_DATABASE_URI = SQLALCHEMY_DATABASE_URI.replace("mysql://", "mysql+pymysql://", 1)

    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Trên Server nên dùng đường dẫn tuyệt đối để tránh lỗi quyền ghi file
    BASE_DIR = os.path.abspath(os.path.dirname(__file__))
    UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
    