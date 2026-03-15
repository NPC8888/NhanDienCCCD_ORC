import requests
import json

BASE_URL = "http://localhost:5000/api/auth"

# Màu sắc cho output
GREEN = '\033[92m'
RED = '\033[91m'
BLUE = '\033[94m'
YELLOW = '\033[93m'
RESET = '\033[0m'

def print_success(message):
    print(f"{GREEN}✓ {message}{RESET}")

def print_error(message):
    print(f"{RED}✗ {message}{RESET}")

def print_info(message):
    print(f"{BLUE}ℹ {message}{RESET}")

def print_header(message):
    print(f"\n{YELLOW}{'='*50}{RESET}")
    print(f"{YELLOW}{message}{RESET}")
    print(f"{YELLOW}{'='*50}{RESET}\n")

# Test data
test_username = "testuser123"
test_email = "testuser@example.com"
test_password = "password123"

access_token = None

def test_register():
    """Test đăng ký"""
    print_header("TEST 1: ĐĂNG KÝ NGƯỜI DÙNG")
    
    data = {
        "username": test_username,
        "email": test_email,
        "password": test_password,
        "confirm_password": test_password
    }
    
    try:
        response = requests.post(f"{BASE_URL}/register", json=data)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")
        
        if response.status_code == 201:
            print_success("Đăng ký thành công!")
            return response.json()["data"]["tokens"]["access_token"]
        else:
            print_error(f"Đăng ký thất bại: {response.json()['message']}")
            return None
    except Exception as e:
        print_error(f"Lỗi kết nối: {str(e)}")
        return None

def test_register_fail():
    """Test đăng ký thất bại - email đã tồn tại"""
    print_header("TEST: ĐĂNG KÝ THẤT BẠI (Email đã tồn tại)")
    
    data = {
        "username": "anotheruser",
        "email": test_email,  # Email đã được sử dụng
        "password": test_password,
        "confirm_password": test_password
    }
    
    try:
        response = requests.post(f"{BASE_URL}/register", json=data)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")
        
        if response.status_code != 201:
            print_success("Kiểm tra email duplicate thành công")
        else:
            print_error("Không phát hiện được email duplicate")
    except Exception as e:
        print_error(f"Lỗi kết nối: {str(e)}")

def test_login():
    """Test đăng nhập"""
    print_header("TEST 2: ĐĂNG NHẬP")
    
    data = {
        "username": test_email,
        "password": test_password
    }
    
    try:
        response = requests.post(f"{BASE_URL}/login", json=data)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")
        
        if response.status_code == 200:
            print_success("Đăng nhập thành công!")
            return response.json()["data"]["tokens"]["access_token"]
        else:
            print_error(f"Đăng nhập thất bại: {response.json()['message']}")
            return None
    except Exception as e:
        print_error(f"Lỗi kết nối: {str(e)}")
        return None

def test_login_fail():
    """Test đăng nhập thất bại"""
    print_header("TEST: ĐĂNG NHẬP THẤT BẠI (Mật khẩu sai)")
    
    data = {
        "username": test_email,
        "password": "wrongpassword"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/login", json=data)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")
        
        if response.status_code != 200:
            print_success("Kiểm tra mật khẩu sai thành công")
        else:
            print_error("Không phát hiện được mật khẩu sai")
    except Exception as e:
        print_error(f"Lỗi kết nối: {str(e)}")

def test_get_current_user(token):
    """Test lấy thông tin user hiện tại"""
    print_header("TEST 3: LẤY THÔNG TIN USER HIỆN TẠI")
    
    headers = {
        "Authorization": f"Bearer {token}"
    }
    
    try:
        response = requests.get(f"{BASE_URL}/me", headers=headers)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")
        
        if response.status_code == 200:
            print_success("Lấy thông tin user thành công!")
        else:
            print_error(f"Lấy thông tin thất bại: {response.json()['message']}")
    except Exception as e:
        print_error(f"Lỗi kết nối: {str(e)}")

def test_get_current_user_invalid_token():
    """Test lấy thông tin user với token không hợp lệ"""
    print_header("TEST: INVALID TOKEN")
    
    headers = {
        "Authorization": "Bearer invalid_token_here"
    }
    
    try:
        response = requests.get(f"{BASE_URL}/me", headers=headers)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")
        
        if response.status_code != 200:
            print_success("Kiểm tra token không hợp lệ thành công")
        else:
            print_error("Token không hợp lệ không được phát hiện")
    except Exception as e:
        print_error(f"Lỗi kết nối: {str(e)}")

def test_change_password(token):
    """Test thay đổi mật khẩu"""
    print_header("TEST 4: THAY ĐỔI MẬT KHẨU")
    
    new_password = "newpassword456"
    
    data = {
        "old_password": test_password,
        "new_password": new_password,
        "confirm_password": new_password
    }
    
    headers = {
        "Authorization": f"Bearer {token}"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/change-password", json=data, headers=headers)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")
        
        if response.status_code == 200:
            print_success("Thay đổi mật khẩu thành công!")
        else:
            print_error(f"Thay đổi mật khẩu thất bại: {response.json()['message']}")
    except Exception as e:
        print_error(f"Lỗi kết nối: {str(e)}")

def test_change_password_fail(token):
    """Test thay đổi mật khẩu thất bại - mật khẩu cũ sai"""
    print_header("TEST: THAY ĐỔI MẬT KHẨU THẤT BẠI (Mật khẩu cũ sai)")
    
    data = {
        "old_password": "wrongoldpassword",
        "new_password": "newpassword789",
        "confirm_password": "newpassword789"
    }
    
    headers = {
        "Authorization": f"Bearer {token}"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/change-password", json=data, headers=headers)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")
        
        if response.status_code != 200:
            print_success("Kiểm tra mật khẩu cũ sai thành công")
        else:
            print_error("Không phát hiện được mật khẩu cũ sai")
    except Exception as e:
        print_error(f"Lỗi kết nối: {str(e)}")

if __name__ == "__main__":
    print_info("Bắt đầu test API Authentication")
    print_info(f"Base URL: {BASE_URL}\n")
    
    # Test chính
    token = test_register()
    
    if token:
        test_register_fail()
        test_login()
        test_login_fail()
        test_get_current_user(token)
        test_get_current_user_invalid_token()
        test_change_password(token)
        test_change_password_fail(token)
    else:
        print_error("Không thể tiếp tục test vì đăng ký thất bại\n")
    
    print_header("KẾT THÚC TEST")
    print_success("Hoàn tất test API Authentication")
