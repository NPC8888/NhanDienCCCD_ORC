from flask import Blueprint, request, jsonify
from app.services.user_service import UserService
from app.utils.jwt_util import get_current_user_id
from flask_jwt_extended import jwt_required

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/login", methods=["POST"])
def login():
    """
    Endpoint đăng nhập
    
    Request body:
    {
        "username": "user@example.com hoặc username",
        "password": "mặt khẩu"
    }
    """
    try:
        data = request.json
        
        if not data:
            return jsonify({"success": False, "message": "Request body không được để trống"}), 400
        
        username = data.get("username", "").strip()
        password = data.get("password", "")
        
        success, message, response_data = UserService.login(username, password)
        
        if success:
            return jsonify({
                "success": True,
                "message": message,
                "data": response_data
            }), 200
        else:
            return jsonify({
                "success": False,
                "message": message
            }), 401
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Lỗi server: {str(e)}"
        }), 500


@auth_bp.route("/register", methods=["POST"])
def register():
    """
    Endpoint đăng ký
    
    Request body:
    {
        "username": "tên người dùng",
        "email": "email@example.com",
        "password": "mật khẩu",
        "confirm_password": "xác nhận mật khẩu"
    }
    """
    try:
        data = request.json
        
        if not data:
            return jsonify({"success": False, "message": "Request body không được để trống"}), 400
        
        username = data.get("username", "").strip()
        email = data.get("email", "").strip()
        password = data.get("password", "")
        confirm_password = data.get("confirm_password", "")
        
        success, message, response_data = UserService.register(
            username,
            email,
            password,
            confirm_password
        )
        
        if success:
            return jsonify({
                "success": True,
                "message": message,
                "data": response_data
            }), 201
        else:
            return jsonify({
                "success": False,
                "message": message
            }), 400
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Lỗi server: {str(e)}"
        }), 500


@auth_bp.route("/change-password", methods=["POST"])
@jwt_required()
def change_password():
    """
    Endpoint thay đổi mật khẩu (yêu cầu xác thực)
    
    Request body:
    {
        "old_password": "mật khẩu cũ",
        "new_password": "mật khẩu mới",
        "confirm_password": "xác nhận mật khẩu mới"
    }
    
    Headers:
    Authorization: Bearer <access_token>
    """
    try:
        user_id = get_current_user_id()
        data = request.json
        
        if not data:
            return jsonify({"success": False, "message": "Request body không được để trống"}), 400
        
        old_password = data.get("old_password", "")
        new_password = data.get("new_password", "")
        confirm_password = data.get("confirm_password", "")
        
        success, message, response_data = UserService.change_password(
            user_id,
            old_password,
            new_password,
            confirm_password
        )
        
        if success:
            return jsonify({
                "success": True,
                "message": message,
                "data": response_data
            }), 200
        else:
            return jsonify({
                "success": False,
                "message": message
            }), 400
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Lỗi server: {str(e)}"
        }), 500


@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def get_current_user():
    """
    Endpoint lấy thông tin user hiện tại (yêu cầu xác thực)
    
    Headers:
    Authorization: Bearer <access_token>
    """
    try:
        user_id = get_current_user_id()
        user_data = UserService.get_user_by_id(user_id)
        
        if user_data:
            return jsonify({
                "success": True,
                "data": user_data
            }), 200
        else:
            return jsonify({
                "success": False,
                "message": "Người dùng không tồn tại"
            }), 404
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Lỗi server: {str(e)}"
        }), 500