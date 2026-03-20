import json
import os
import uuid
from concurrent.futures import ThreadPoolExecutor
from flask import Blueprint, request, jsonify

# Các services và models của bạn
from app.services.yolo_service import detect_fields, detect_cccd
from app.services.orc_service import read_text
from app.models.record_model import CCCDRecord
from app.models.image_model import CCCDImage
from app.models.field_raw_model import CCCDFieldRaw
from app.models.user_model import db
from app.services.text_utils import fix_date, normalize_text, read_qr, convert_date_mysql

scan_bp = Blueprint("scan", __name__)

UPLOAD_FOLDER = "uploads/images"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs("uploads/crops", exist_ok=True)

# DANH SÁCH CÁC FIELD CẦN OCR (Bỏ qua finger_print để tiết kiệm thời gian)
TEXT_FIELDS = [
    'id', 'name', 'dob', 'gender', 'nationality', 
    'origin_place', 'current_place', 'issue_date', 
    'expire_date', 'features'
]

def process_field_parallel(det):
    """
    Hàm xử lý OCR song song cho từng field
    """
    field_name = det.get("field")
    crop_path = det.get("crop_path")
    print(f"--- Đang xử lý Field: {field_name} tại {crop_path} ---") # Thêm dòng này
    if not crop_path or not os.path.exists(crop_path):
        return None

    # 1. Phân loại: QR, Văn bản, hoặc Ảnh thuần (Vân tay/Chân dung)
    if field_name == "qr":
        ocr_text = read_qr(crop_path)
    elif field_name in TEXT_FIELDS:
        # Chỉ chạy OCR nếu field nằm trong danh sách có chữ
        ocr_text = read_text(crop_path)
    else:
        # Nếu là vân tay hoặc field khác: Trả về rỗng, không chạy OCR tốn sức
        return {
            "field_name": field_name,
            "text": "",
            "crop_path": crop_path,
            "confidence": 1.0
        }

    # 2. Hậu xử lý text
    if field_name in ["dob", "expire_date", "issue_date"]:
        ocr_text = fix_date(ocr_text)
    
    ocr_text = normalize_text(ocr_text)
    
    return {
        "field_name": field_name,
        "text": ocr_text,
        "crop_path": crop_path,
        "confidence": 1.0 
    }

@scan_bp.route("/cccd", methods=["POST"])
def scan_cccd():
    # 1. Nhận file từ request
    front_image = request.files.get("front_image") or request.files.get("image")
    back_image = request.files.get("back_image")
    storage_id = request.form.get("storage_id")

    if not front_image or not back_image or not storage_id:
        return jsonify({"error": "Thiếu dữ liệu đầu vào"}), 400

    # 2. Lưu ảnh gốc
    f_uid = str(uuid.uuid4())
    b_uid = str(uuid.uuid4())
    front_path = os.path.join(UPLOAD_FOLDER, f"{f_uid}.jpg")
    back_path = os.path.join(UPLOAD_FOLDER, f"{b_uid}.jpg")
    front_image.save(front_path)
    back_image.save(back_path)

    # 3. YOLO Detect vị trí CCCD
    front_cccd_path = detect_cccd(front_path)
    back_cccd_path = detect_cccd(back_path)

    if not front_cccd_path or not back_cccd_path:
        return jsonify({"error": "Không tìm thấy CCCD trong ảnh"}), 400

    # 4. YOLO Detect các field
    detections = []
    f_dets = detect_fields(front_cccd_path)
    b_dets = detect_fields(back_cccd_path)
    
    if isinstance(f_dets, list): detections.extend(f_dets)
    if isinstance(b_dets, list): detections.extend(b_dets)

    # 5. XỬ LÝ SONG SONG (ThreadPoolExecutor)
    field_results = {}
    # Sử dụng 4 workers để tối ưu cho chip i5 đời mới
    with ThreadPoolExecutor(max_workers=1) as executor:
        results = list(executor.map(process_field_parallel, detections))

    # Tổng hợp kết quả
    for res in results:
        if res is None: continue
        
        fname = res["field_name"]
        if fname not in field_results:
            field_results[fname] = {"text_list": [], "image_path": [], "confidence": res["confidence"]}
        
        field_results[fname]["text_list"].append(res["text"])
        field_results[fname]["image_path"].append(res["crop_path"])

    # Gộp text (ví dụ địa chỉ nhiều dòng)
    for fname in field_results:
        field_results[fname]["text"] = " ".join(field_results[fname]["text_list"]).strip()

    # 6. Lưu vào Database
    try:
        # Lấy danh sách ảnh vân tay để lưu riêng (nếu cần)
        fingerprint_paths = []
        for k, v in field_results.items():
            if "finger" in k.lower():
                fingerprint_paths.extend(v["image_path"])

        record = CCCDRecord(
            storage_id=storage_id,
            id_number=field_results.get("id", {}).get("text"),
            name=field_results.get("name", {}).get("text"),
            gender=field_results.get("gender", {}).get("text"),
            dob=convert_date_mysql(field_results.get("dob", {}).get("text")),
            nationality=field_results.get("nationality", {}).get("text"),
            origin_place=field_results.get("origin_place", {}).get("text"),
            current_place=field_results.get("current_place", {}).get("text"),
            issue_date=convert_date_mysql(field_results.get("issue_date", {}).get("text")),
            expire_date=convert_date_mysql(field_results.get("expire_date", {}).get("text")),
            features=field_results.get("features", {}).get("text"),
            qr_text=field_results.get("qr", {}).get("text"),
            fingerprint_detected=json.dumps(fingerprint_paths) if fingerprint_paths else None,
            image_path=front_cccd_path
        )
        db.session.add(record)
        db.session.commit()

        # Lưu ảnh con và raw text
        for fname, val in field_results.items():
            for img_p in val["image_path"]:
                db.session.add(CCCDImage(record_id=record.id, field_name=fname, image_path=img_p))
            db.session.add(CCCDFieldRaw(record_id=record.id, field_name=fname, raw_text=val["text"], confidence=val.get("confidence", 1.0)))
        
        db.session.commit()

        return jsonify({
            "message": "scan success",
            "record_id": record.id,
            "fields": field_results
        })

    except Exception as e:
        db.session.rollback()
        print(f"Database Error: {e}")
        return jsonify({"error": str(e)}), 500