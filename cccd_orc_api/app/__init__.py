from flask import Flask , jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from app.config import Config

db = SQLAlchemy()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    
    # Cấu hình ứng dụng
    app.config.from_object(Config)
    
    # Khởi tạo JWT
    jwt.init_app(app)

    # enable CORS for all routes (adjust origins as needed)
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    
    @app.route("/", methods=["GET"])
    def health_check():
        return jsonify({
            "status": "ok",
            "service": "CCCD OCR API",
            "message": "server is running"
        }), 200

    db.init_app(app)

    from .routes.scan_routes import scan_bp
    from .routes.record_routes import record_bp
    from .routes.storage_routes import storage_bp
    from .routes.auth_routes import auth_bp
  
    app.register_blueprint(record_bp, url_prefix="/api/records")
    app.register_blueprint(storage_bp, url_prefix="/api/storages")
    app.register_blueprint(scan_bp, url_prefix="/api/scan")
    app.register_blueprint(auth_bp, url_prefix="/api/auth")

    return app