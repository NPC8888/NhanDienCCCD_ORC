from app import db
from app.models.user_model import User
from werkzeug.security import generate_password_hash, check_password_hash
from app.utils.jwt_util import create_tokens
from sqlalchemy.exc import IntegrityError

class UserService:
    """Service cho các chức năng liên quan đến User"""
    
    @staticmethod
    def register(username, email, password, confirm_password):
        """
        Đăng ký user mới
        
        Args:
            username (str): Tên đăng nhập
            email (str): Email
            password (str): Mật khẩu
            confirm_password (str): Xác nhận mật khẩu
            
        Returns:
            tuple: (success: bool, message: str, data: dict)
        """
        # Kiểm tra các trường bắt buộc
        if not all([username, email, password, confirm_password]):
            return False, "Tất cả các trường là bắt buộc", None
        
        # Kiểm tra độ dài username
        if len(username) < 3:
            return False, "Username phải có ít nhất 3 ký tự", None
        
        # Kiểm tra độ dài mật khẩu
        if len(password) < 6:
            return False, "Mật khẩu phải có ít nhất 6 ký tự", None
        
        # Kiểm tra mật khẩu khớp nhau
        if password != confirm_password:
            return False, "Mật khẩu và xác nhận mật khẩu không khớp", None
        
        # Kiểm tra email tồn tại
        if User.query.filter_by(email=email).first():
            return False, "Email đã được sử dụng", None
        
        # Kiểm tra username tồn tại
        if User.query.filter_by(username=username).first():
            return False, "Username đã được sử dụng", None
        
        try:
            # Tạo user mới với mật khẩu được hash
            hashed_password = generate_password_hash(password)
            new_user = User(
                username=username,
                email=email,
                password=hashed_password
            )
            
            db.session.add(new_user)
            db.session.commit()
            
            # Tạo tokens
            tokens = create_tokens(new_user.id)
            
            return True, "Đăng ký thành công", {
                "user": new_user.to_dict(),
                "tokens": tokens
            }
        except IntegrityError:
            db.session.rollback()
            return False, "Lỗi: Email hoặc username đã tồn tại", None
        except Exception as e:
            db.session.rollback()
            return False, f"Lỗi khi tạo user: {str(e)}", None
    
    @staticmethod
    def login(username, password):
        """
        Đăng nhập user
        
        Args:
            username (str): Tên đăng nhập hoặc email
            password (str): Mật khẩu
            
        Returns:
            tuple: (success: bool, message: str, data: dict)
        """
        if not username or not password:
            return False, "Username/Email và mật khẩu không được để trống", None
        
        # Tìm user bằng username hoặc email
        user = User.query.filter(
            db.or_(
                User.username == username,
                User.email == username
            )
        ).first()
        
        if not user:
            return False, "Username/Email hoặc mật khẩu không chính xác", None
        
        if not user.is_active:
            return False, "Tài khoản của bạn đã bị vô hiệu hóa", None
        
        # Kiểm tra mật khẩu
        if not check_password_hash(user.password, password):
            return False, "Username/Email hoặc mật khẩu không chính xác", None
        
        try:
            # Tạo tokens
            tokens = create_tokens(user.id)
            
            return True, "Đăng nhập thành công", {
                "user": user.to_dict(),
                "tokens": tokens
            }
        except Exception as e:
            return False, f"Lỗi khi đăng nhập: {str(e)}", None
    
    @staticmethod
    def change_password(user_id, old_password, new_password, confirm_password):
        """
        Thay đổi mật khẩu user
        
        Args:
            user_id (int): ID của user
            old_password (str): Mật khẩu cũ
            new_password (str): Mật khẩu mới
            confirm_password (str): Xác nhận mật khẩu mới
            
        Returns:
            tuple: (success: bool, message: str, data: dict)
        """
        if not all([old_password, new_password, confirm_password]):
            return False, "Tất cả các trường là bắt buộc", None
        
        # Kiểm tra user có tồn tại
        user = User.query.get(user_id)
        if not user:
            return False, "Người dùng không tồn tại", None
        
        # Kiểm tra mật khẩu cũ
        if not check_password_hash(user.password, old_password):
            return False, "Mật khẩu cũ không chính xác", None
        
        # Kiểm tra độ dài mật khẩu mới
        if len(new_password) < 6:
            return False, "Mật khẩu mới phải có ít nhất 6 ký tự", None
        
        # Kiểm tra mật khẩu mới khớp nhau
        if new_password != confirm_password:
            return False, "Mật khẩu mới và xác nhận mật khẩu không khớp", None
        
        # Kiểm tra mật khẩu mới khác mật khẩu cũ
        if check_password_hash(user.password, new_password):
            return False, "Mật khẩu mới không được trùng với mật khẩu cũ", None
        
        try:
            # Cập nhật mật khẩu
            user.password = generate_password_hash(new_password)
            db.session.commit()
            
            return True, "Thay đổi mật khẩu thành công", {"user": user.to_dict()}
        except Exception as e:
            db.session.rollback()
            return False, f"Lỗi khi thay đổi mật khẩu: {str(e)}", None
    
    @staticmethod
    def get_user_by_id(user_id):
        """Lấy thông tin user bằng ID"""
        user = User.query.get(user_id)
        return user.to_dict() if user else None
    
    @staticmethod
    def get_user_by_email(email):
        """Lấy thông tin user bằng email"""
        user = User.query.filter_by(email=email).first()
        return user.to_dict() if user else None
    
    @staticmethod
    def get_user_by_username(username):
        """Lấy thông tin user bằng username"""
        user = User.query.filter_by(username=username).first()
        return user.to_dict() if user else None
