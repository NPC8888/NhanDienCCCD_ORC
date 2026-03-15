# API Authentication Documentation

## Danh Sách Endpoints

### 1. **POST /api/auth/register** - Đăng Ký
Đăng ký tài khoản mới

**Request:**
```json
{
  "username": "John_Doe",
  "email": "john@example.com",
  "password": "password123",
  "confirm_password": "password123"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Đăng ký thành công",
  "data": {
    "user": {
      "id": 1,
      "username": "John_Doe",
      "email": "john@example.com",
      "created_at": "2024-01-01T10:00:00",
      "is_active": true
    },
    "tokens": {
      "access_token": "eyJhbGc...",
      "refresh_token": "eyJhbGc...",
      "token_type": "Bearer"
    }
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Email đã được sử dụng"
}
```

---

### 2. **POST /api/auth/login** - Đăng Nhập
Đăng nhập bằng username/email và mật khẩu

**Request:**
```json
{
  "username": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Đăng nhập thành công",
  "data": {
    "user": {
      "id": 1,
      "username": "John_Doe",
      "email": "john@example.com",
      "created_at": "2024-01-01T10:00:00",
      "is_active": true
    },
    "tokens": {
      "access_token": "eyJhbGc...",
      "refresh_token": "eyJhbGc...",
      "token_type": "Bearer"
    }
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Username/Email hoặc mật khẩu không chính xác"
}
```

---

### 3. **POST /api/auth/change-password** - Thay Đổi Mật Khẩu
Thay đổi mật khẩu (yêu cầu xác thực)

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request:**
```json
{
  "old_password": "password123",
  "new_password": "newpassword456",
  "confirm_password": "newpassword456"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Thay đổi mật khẩu thành công",
  "data": {
    "user": {
      "id": 1,
      "username": "John_Doe",
      "email": "john@example.com",
      "created_at": "2024-01-01T10:00:00",
      "is_active": true
    }
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Mật khẩu cũ không chính xác"
}
```

---

### 4. **GET /api/auth/me** - Lấy Thông Tin User Hiện Tại
Lấy thông tin user đang đăng nhập (yêu cầu xác thực)

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "username": "John_Doe",
    "email": "john@example.com",
    "created_at": "2024-01-01T10:00:00",
    "is_active": true
  }
}
```

---

## Cách Sử Dụng

### 1. Đăng Ký Tài Khoản
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "password123",
    "confirm_password": "password123"
  }'
```

### 2. Đăng Nhập
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john@example.com",
    "password": "password123"
  }'
```

### 3. Sử Dụng Access Token (Lấy thông tin user)
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer <your_access_token>"
```

### 4. Thay Đổi Mật Khẩu
```bash
curl -X POST http://localhost:5000/api/auth/change-password \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_access_token>" \
  -d '{
    "old_password": "password123",
    "new_password": "newpassword456",
    "confirm_password": "newpassword456"
  }'
```

---

## Validation Rules

### Username
- Tối thiểu 3 ký tự
- Phải unique

### Email
- Phải là email hợp lệ
- Phải unique

### Password
- Tối thiểu 6 ký tự
- Phải khớp với confirm_password

---

## Thông Báo Lỗi

| Lỗi | Mã | Giải Pháp |
|-----|-----|----------|
| Email đã được sử dụng | 400 | Sử dụng email khác |
| Username đã được sử dụng | 400 | Sử dụng username khác |
| Mật khẩu phải có ít nhất 6 ký tự | 400 | Nhập mật khẩu dài hơn |
| Mật khẩu không khớp nhau | 400 | Kiểm tra lại confirm_password |
| Username/Email hoặc mật khẩu không chính xác | 401 | Kiểm tra lại credentials |
| Tài khoản đã bị vô hiệu hóa | 401 | Liên hệ admin |

---

## Token Information

- **Access Token**: Dùng để gọi API được bảo vệ, thời gian sống là 24 giờ
- **Refresh Token**: Dùng để lấy access token mới, thời gian sống là 30 ngày
