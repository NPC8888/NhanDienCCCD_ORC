# CCCD OCR API Documentation

## Tổng Quan
API này cung cấp các chức năng quét và quản lý thông tin CCCD Việt Nam sử dụng công nghệ AI (YOLO + OCR).

## Danh Sách Endpoints

### SCAN ENDPOINTS

#### 1. **POST /api/scan/cccd** - Quét và OCR CCCD
Quét ảnh CCCD, phát hiện các trường thông tin bằng YOLO, thực hiện OCR và lưu kết quả vào database

**Headers:**
```
Content-Type: multipart/form-data
Authorization: Bearer <access_token> (nếu cần xác thực)
```

**Form Data:**
- `image`: File ảnh CCCD (required)
- `storage_id`: ID của storage để lưu kết quả (required)

**Request Example:**
```bash
curl -X POST "http://localhost:8000/api/scan/cccd" \
  -H "Authorization: Bearer <your_token>" \
  -F "image=@cccd_image.jpg" \
  -F "storage_id=123"
```

**Response (200):**
```json
{
  "message": "scan success",
  "record_id": 1,
  "fields": {
    "id": {
      "text": "123456789012",
      "confidence": 1.0,
      "image_path": ["uploads/crops/id_crop_1.jpg"]
    },
    "name": {
      "text": "NGUYEN VAN A",
      "confidence": 1.0,
      "image_path": ["uploads/crops/name_crop_1.jpg"]
    },
    "gender": {
      "text": "NAM",
      "confidence": 1.0,
      "image_path": ["uploads/crops/gender_crop_1.jpg"]
    },
    "dob": {
      "text": "01/01/1990",
      "confidence": 1.0,
      "image_path": ["uploads/crops/dob_crop_1.jpg"]
    },
    "nationality": {
      "text": "VIET NAM",
      "confidence": 1.0,
      "image_path": ["uploads/crops/nationality_crop_1.jpg"]
    },
    "origin_place": {
      "text": "HA NOI",
      "confidence": 1.0,
      "image_path": ["uploads/crops/origin_place_crop_1.jpg"]
    },
    "current_place": {
      "text": "HA NOI",
      "confidence": 1.0,
      "image_path": ["uploads/crops/current_place_crop_1.jpg"]
    },
    "issue_date": {
      "text": "01/01/2020",
      "confidence": 1.0,
      "image_path": ["uploads/crops/issue_date_crop_1.jpg"]
    },
    "expire_date": {
      "text": "01/01/2030",
      "confidence": 1.0,
      "image_path": ["uploads/crops/expire_date_crop_1.jpg"]
    },
    "features": {
      "text": "Đặc điểm nhận dạng",
      "confidence": 1.0,
      "image_path": ["uploads/crops/features_crop_1.jpg"]
    },
    "qr": {
      "text": "QR_CODE_DATA",
      "confidence": 1.0,
      "image_path": ["uploads/crops/qr_crop_1.jpg"]
    }
  }
}
```

**Error Response (400):**
```json
{
  "error": "image required"
}
```

**Error Response (400):**
```json
{
  "error": "storage_id required"
}
```

---

### RECORD ENDPOINTS

#### 2. **GET /api/record/storage/<storage_id>** - Lấy danh sách records trong storage
Lấy tất cả records CCCD trong một storage cụ thể

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
[
  {
    "id": 1,
    "cccd_number": "123456789012",
    "name": "NGUYEN VAN A",
    "dob": "1990-01-01",
    "gender": "NAM"
  },
  {
    "id": 2,
    "cccd_number": "987654321098",
    "name": "TRAN THI B",
    "dob": "1992-05-15",
    "gender": "NU"
  }
]
```

#### 3. **GET /api/record/<record_id>** - Lấy chi tiết record
Lấy thông tin chi tiết của một record CCCD bao gồm ảnh crop và text thô

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "record": {
    "id": 1,
    "storage_id": 123,
    "cccd_number": "123456789012",
    "name": "NGUYEN VAN A",
    "gender": "NAM",
    "dob": "1990-01-01",
    "nationality": "VIET NAM",
    "origin_place": "HA NOI",
    "current_place": "HA NOI",
    "issue_date": "2020-01-01",
    "expire_date": "2030-01-01",
    "features": "Đặc điểm nhận dạng",
    "qr_text": "QR_CODE_DATA",
    "fingerprint_detected": false,
    "image_path": "uploads/images/uuid.jpg"
  },
  "images": [
    {
      "field": "id",
      "image_path": "uploads/crops/id_crop_1.jpg"
    },
    {
      "field": "name",
      "image_path": "uploads/crops/name_crop_1.jpg"
    }
  ],
  "raw_fields": [
    {
      "field": "id",
      "raw_text": "123456789012",
      "confidence": 1.0
    },
    {
      "field": "name",
      "raw_text": "NGUYEN VAN A",
      "confidence": 1.0
    }
  ]
}
```

**Error Response (404):**
```json
{
  "error": "record not found"
}
```

#### 4. **GET /api/record/search** - Tìm kiếm records
Tìm kiếm records theo tên hoặc số CCCD

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `name`: Tên cần tìm (partial match)
- `cccd`: Số CCCD cần tìm (partial match)

**Request Example:**
```
GET /api/record/search?name=Nguyen&cccd=123
```

**Response (200):**
```json
[
  {
    "id": 1,
    "name": "NGUYEN VAN A",
    "cccd": "123456789012",
    "dob": "1990-01-01"
  }
]
```

#### 5. **POST /api/record/** - Tạo record thủ công
Tạo record CCCD mới thủ công (không qua scan)

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "storage_id": 123,
  "id_number": "123456789012",
  "name": "NGUYEN VAN A",
  "gender": "NAM",
  "dob": "1990-01-01",
  "nationality": "VIET NAM",
  "origin_place": "HA NOI",
  "current_place": "HA NOI",
  "issue_date": "2020-01-01",
  "expire_date": "2030-01-01",
  "features": "Đặc điểm nhận dạng",
  "qr_text": "QR_CODE_DATA",
  "fingerprint_detected": false
}
```

**Response (200):**
```json
{
  "message": "record created",
  "record_id": 1
}
```

#### 6. **PUT /api/record/<record_id>** - Cập nhật record
Cập nhật thông tin record CCCD

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "name": "NGUYEN VAN B",
  "gender": "NU"
}
```

**Response (200):**
```json
{
  "message": "record updated"
}
```

**Error Response (404):**
```json
{
  "error": "record not found"
}
```

---

### STORAGE ENDPOINTS

#### 7. **GET /api/storages/** - Lấy danh sách storages
Lấy tất cả kho lưu trữ

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
[
  {
    "id": 1,
    "user_id": 1,
    "name": "Kho CCCD 2024"
  },
  {
    "id": 2,
    "user_id": 1,
    "name": "Kho CCCD Tháng 1"
  }
]
```

#### 8. **POST /api/storages/** - Tạo storage mới
Tạo kho lưu trữ mới

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "user_id": 1,
  "name": "Kho CCCD Mới"
}
```

**Response (201):**
```json
{
  "id": 3,
  "user_id": 1,
  "name": "Kho CCCD Mới",
  "message": "Storage created successfully"
}
```

**Error Response (400):**
```json
{
  "error": "Missing required fields: name, user_id"
}
```

#### 9. **GET /api/storages/<storage_id>** - Lấy thông tin storage
Lấy thông tin của một storage cụ thể

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "id": 1,
  "user_id": 1,
  "name": "Kho CCCD 2024"
}
```

**Error Response (404):**
```json
{
  "error": "Storage not found"
}
```

#### 10. **PUT /api/storages/<storage_id>** - Cập nhật storage
Cập nhật thông tin storage

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "name": "Kho CCCD 2024 - Cập nhật"
}
```

**Response (200):**
```json
{
  "id": 1,
  "user_id": 1,
  "name": "Kho CCCD 2024 - Cập nhật",
  "message": "Storage updated successfully"
}
```

**Error Response (404):**
```json
{
  "error": "Storage not found"
}
```

#### 11. **DELETE /api/storages/<storage_id>** - Xóa storage
Xóa một storage (có thể cần kiểm tra ràng buộc dữ liệu)

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "message": "Storage deleted successfully"
}
```

**Error Response (404):**
```json
{
  "error": "Storage not found"
}
```

---

## Các Trường Thông Tin CCCD

Hệ thống phát hiện và trích xuất các trường sau từ ảnh CCCD:

- **id**: Số CCCD (12 chữ số)
- **name**: Họ và tên
- **gender**: Giới tính (NAM/NU)
- **dob**: Ngày sinh (định dạng dd/mm/yyyy)
- **nationality**: Quốc tịch
- **origin_place**: Nguyên quán
- **current_place**: Nơi thường trú
- **issue_date**: Ngày cấp (định dạng dd/mm/yyyy)
- **expire_date**: Ngày hết hạn (định dạng dd/mm/yyyy)
- **features**: Đặc điểm nhận dạng
- **qr**: Dữ liệu mã QR

## Quy Trình Xử Lý Scan

1. **Upload Ảnh**: Lưu ảnh gốc vào `uploads/images/`
2. **Resize**: Thay đổi kích thước ảnh về 640px để tối ưu cho YOLO
3. **Phát Hiện Trường**: Sử dụng YOLO để detect các vùng chứa thông tin
4. **OCR**: Thực hiện nhận dạng văn bản trên từng vùng crop
5. **Chuẩn Hóa**: Xử lý đặc biệt cho ngày tháng và text
6. **Lưu Database**: Lưu record chính, ảnh crop và text thô vào database
7. **Trả Kết Quả**: Trả về record_id và dữ liệu các trường đã trích xuất

## Lưu Ý

- Ảnh đầu vào nên là ảnh rõ nét, không bị mờ hoặc nghiêng quá nhiều
- Hỗ trợ định dạng ảnh phổ biến (JPG, PNG, JPEG)
- Kết quả OCR có thể cần kiểm tra thủ công trong một số trường hợp
- Confidence hiện tại được set cố định là 1.0, có thể cải thiện sau
- Một số endpoints có thể yêu cầu xác thực JWT token