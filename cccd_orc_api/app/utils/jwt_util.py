from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity
from app.config import Config
from datetime import timedelta

def create_tokens(user_id):
    """
    Tạo access token và refresh token cho user
    
    Args:
        user_id: ID của user
        
    Returns:
        dict: Chứa access_token và refresh_token
    """
    access_token = create_access_token(
        identity=user_id,
        expires_delta=timedelta(hours=24)
    )
    refresh_token = create_refresh_token(
        identity=user_id,
        expires_delta=timedelta(days=30)
    )
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "Bearer"
    }

def get_current_user_id():
    """
    Lấy user_id từ JWT token trong request hiện tại
    
    Returns:
        int: User ID
    """
    return get_jwt_identity()
