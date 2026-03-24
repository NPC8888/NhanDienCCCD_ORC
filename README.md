# Hệ thống Nhận diện CCCD bằng OCR

[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://www.python.org/)
[![React](https://img.shields.io/badge/React-19-green.svg)](https://react.dev/)
[![YOLOv8](https://img.shields.io/badge/YOLOv8-orange.svg)](https://ultralytics.com/yolov8)
[![VietOCR](https://img.shields.io/badge/VietOCR-purple.svg)](https://github.com/pbcquoc/vietocr)
[![Accuracy](https://img.shields.io/badge/Accuracy-99.5%25-brightgreen.svg)](https://docs.ultralytics.com/)

## 🎯 Giới thiệu

**Hệ thống Nhận diện Căn cước công dân (CCCD) bằng OCR** là đồ án chuyên ngành 2 của sinh viên **Nguyễn Văn Điệp (226406)**, Khoa Công nghệ Thông tin, Trường Đại học Nam Cần Thơ. Giảng viên hướng dẫn: **TS. Trần Văn Thiện**.

Hệ thống sử dụng **AI tiên tiến** (YOLOv8 + VietOCR) để tự động quét ảnh CCCD, phát hiện & trích xuất 12 trường thông tin chính với độ chính xác **>99.5%** (mAP@0.5: 0.995, F1-Score: 0.99). 

### Tính năng chính
- 🖼️ **Quét OCR CCCD**: Upload ảnh → Crop tự động → Trích xuất text (ID, tên, DOB, địa chỉ,...)
- 📊 **Quản lý Storage**: Tạo/sửa/xóa kho lưu trữ records
- 🔍 **Tìm kiếm Records**: Search theo tên/số CCCD
- ✏️ **CRUD Records**: Xem chi tiết, chỉnh sửa, tạo thủ công
- 🔐 **Auth JWT**: Đăng ký/đăng nhập user
- 💾 **Database**: SQLite (models: User, Storage, Record, FieldRaw, Image)

**Demo Online**: [https://npc8888.github.io/NhanDienCCCD_ORC/](https://npc8888.github.io/NhanDienCCCD_ORC/)  
**Video Demo**: `videodemo.rar`

## 📁 Cấu trúc Project

```
NhanDienCCCD_ORC/
├── cccd_orc_api/          # Backend Python Flask
│   ├── app/
│   │   ├── models/        # DB Models (SQLAlchemy)
│   │   ├── routes/        # API: auth, scan, record, storage
│   │   ├── services/      # YOLO, OCR, preprocess
│   │   └── utils/
│   ├── models_yolo/       # YOLO weights (best.pt)
│   ├── uploads/           # Images & crops
│   ├── requirements.txt
│   └── main.py
├── FontEnd/               # Frontend React + Vite
│   ├── src/
│   │   ├── pages/         # Home, Scan, Storage, Records, Search,...
│   │   ├── services/      # API calls (auth, cccd)
│   │   └── components/
│   ├── package.json
│   └── vite.config.js
├── BaoCao/                # Báo cáo đồ án (.docx, .pdf)
├── dataset/               # YOLO training data
└── README.md
```

## 🛠️ Yêu cầu hệ thống & Cài đặt

### Backend (Python 3.8+)
```bash
cd cccd_orc_api
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
```

**Dependencies chính**:
```
Flask==3.1.3 | ultralytics==8.4.24 | vietocr==0.3.10
opencv-python==4.8.0 | torch==2.2.1 | numpy==1.24.3
```

### Frontend (Node 18+)
```bash
cd FontEnd
npm install
```

**Dependencies chính**:
```
react==19.2.0 | react-router-dom==7.13.1 | axios==1.13.6
```

## 🚀 Hướng dẫn chạy

### 1. Chạy Backend (port 8000)
```bash
cd cccd_orc_api
# Tạo DB (tự động qua models)
python main.py
```
API docs: [cccd_orc_api/SCAN_API_DOCUMENTATION.md](cccd_orc_api/SCAN_API_DOCUMENTATION.md)

### 2. Chạy Frontend (port 5173)
```bash
cd FontEnd
npm run dev
```
Mở `http://localhost:5173`

### 3. Test API (Swagger/Postman)
```
POST http://localhost:8000/api/scan/cccd
Form: image=@cccd.jpg, storage_id=1
Auth: Bearer <token>
```

## 📖 API Documentation (Tóm tắt)

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | `/api/scan/cccd` | Quét OCR CCCD → Trả fields + record_id |
| GET | `/api/record/storage/<id>` | Danh sách records trong storage |
| GET | `/api/record/<id>` | Chi tiết record + crops |
| GET | `/api/record/search?name=...&cccd=...` | Tìm kiếm |
| POST/PUT/DELETE | `/api/record/` `/api/storages/` | CRUD |

**Full docs**: [SCAN_API_DOCUMENTATION.md](cccd_orc_api/SCAN_API_DOCUMENTATION.md)

## 🖥️ Frontend Features
- **Auth**: Login/Register (JWT)
- **Dashboard**: Home/About/Navbar
- **Scan**: Upload & preview kết quả OCR
- **Storage**: Quản lý kho (list/create/edit/delete)
- **Records**: List/Detail/Create/Search/Edit
- **Responsive**: Mobile-friendly CSS

## 🔬 Công nghệ & Quy trình
1. **Preprocess**: Resize 640px, grayscale, denoise (OpenCV)
2. **Detection**: YOLOv8 → Crop 12 fields (ID, name, DOB, gender, nationality, places, dates, features, QR, fingerprint)
3. **OCR**: VietOCR → Text + confidence
4. **Post-process**: Normalize dates/text → Save DB + crops
5. **Metrics**: mAP@0.5=0.995, F1=0.99 (từ báo cáo)

**DB Schema** (SQLite):
- Users → Storages → Records → FieldRaw/Images

## 📚 Báo cáo & Tài liệu
- [Báo cáo đồ án](BaoCao/BaoCaoDoAn2_NguyenVanDiep_DH22KPM01.docx) (UML: UseCase, DFD, ERD, UI screenshots, evaluation)
- [API Auth](FontEnd/API_AUTH_DOCUMENTATION.md)
- [Dataset YOLO](dataset/)



link website online: https://npc8888.github.io/NhanDienCCCD_ORC/

Thưa thầy, do các thư viện YOLO và VietOCR quá nặng em đã thử nhiều lần vẫn chưa chạy onilne ổn định niếu sever bị crash(RAM không đủ)mong thầy thông cảm và xem giúp em video demo thay thế ạ, Em xin lỗi vì sự bất tiện này.

https://drive.google.com/file/d/14sjcneUTj_Zx-tALKBb8Q2LQBigBuNhe/view?usp=sharing
