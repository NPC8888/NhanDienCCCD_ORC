import json
import os
import uuid

from app.services.image_preprocess import resize_to_640 

from attrs import fields
from flask import Blueprint, request, jsonify

from app.services.yolo_service import detect_fields
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

# ======================================
# SCAN CCCD
# ======================================

@scan_bp.route("/cccd", methods=["POST"])
def scan_cccd():

    # Expect two images: front and back of the CCCD
    front_image = request.files.get("front_image") or request.files.get("image")
    back_image = request.files.get("back_image")

    if not front_image or not back_image:
        return jsonify({"error": "front_image and back_image are required"}), 400

    storage_id = request.form.get("storage_id")

    if not storage_id:
        return jsonify({"error": "storage_id required"}), 400


    # ======================================
    # SAVE ORIGINAL IMAGES
    # ======================================

    front_filename = str(uuid.uuid4()) + ".jpg"
    back_filename = str(uuid.uuid4()) + ".jpg"

    front_path = os.path.join(UPLOAD_FOLDER, front_filename)
    back_path = os.path.join(UPLOAD_FOLDER, back_filename)

    front_image.save(front_path)
    back_image.save(back_path)


    # ======================================
    # RESIZE IMAGES TO 640
    # ======================================
    front_path = resize_to_640(front_path)
    back_path = resize_to_640(back_path)


    # ======================================
    # YOLO DETECT FIELDS
    # ======================================

    detections = []
    detections.extend(detect_fields(front_path))
    detections.extend(detect_fields(back_path))


    field_results = {}


    # ======================================
    # OCR EACH FIELD
    # ======================================

    for det in detections:

        field_name = det["field"]

        crop_path = det["crop_path"]
        if not os.path.exists(crop_path):
         print("Crop not found:", crop_path)
         continue

        # OCR
        ocr_text = read_text(crop_path)
        if field_name == "dob": 
         ocr_text = fix_date(ocr_text)
        if field_name == "expire_date":
         ocr_text = fix_date(ocr_text) 
        if field_name == "issue_date":
         ocr_text = fix_date(ocr_text) 
        if field_name == "qr":
         ocr_text = read_qr(crop_path) 
        ocr_text = normalize_text(ocr_text) 
        
       # field_results[field_name] = {
        #    "text": ocr_text,
         #   "confidence": 1.0,  # nếu OCR bạn chưa trả confidence
          #  "image_path": crop_path
        #}
        if field_name not in field_results:
            field_results[field_name] = {
            "text": [],
            "confidence": 1.0,
            "image_path": []
        }

        field_results[field_name]["text"].append(ocr_text)
        field_results[field_name]["image_path"].append(crop_path)
    for field in field_results:
        field_results[field]["text"] = " ".join(field_results[field]["text"])

    # ======================================
    # EXTRACT SPECIAL IMAGE PATHS (QR + FINGERPRINTS)
    # ======================================

    fingerprint_paths = []
    for f_name, f_val in field_results.items():
        if "finger" in f_name.lower():  # Match "finger_print" or "fingerprint"
            fingerprint_paths.extend(f_val.get("image_path", []))

    qr_image_paths = field_results.get("qr", {}).get("image_path", [])

    fingerprint_detected = json.dumps(fingerprint_paths) if fingerprint_paths else None
    qr_text = qr_image_paths[0] if qr_image_paths else None

    # ======================================
    # NORMALIZE DATA
    # ======================================

    id_number = field_results.get("id", {}).get("text")
    name = field_results.get("name", {}).get("text")
    gender = field_results.get("gender", {}).get("text")
    dob = field_results.get("dob", {}).get("text")
    nationality = field_results.get("nationality", {}).get("text")
    origin_place = field_results.get("origin_place", {}).get("text")
    current_place = field_results.get("current_place", {}).get("text")
    issue_date = field_results.get("issue_date", {}).get("text")
    expire_date = field_results.get("expire_date", {}).get("text")
    features = field_results.get("features", {}).get("text")

    dob = convert_date_mysql(dob)
    expire_date = convert_date_mysql(expire_date)
    issue_date = convert_date_mysql(issue_date)
    # ======================================
    # SAVE MAIN RECORD
    # ======================================

    record = CCCDRecord(

        storage_id=storage_id,

        id_number=id_number,
        name=name,
        gender=gender,
        dob=dob,
        nationality=nationality,
        origin_place=origin_place,
        current_place=current_place,
        issue_date=issue_date,
        expire_date=expire_date,
        features=features,
        qr_text=qr_text,
        fingerprint_detected=fingerprint_detected,

        # Keep the front-side image for reference
        image_path=front_path

    )

    db.session.add(record)
    db.session.commit()


    # ======================================
    # SAVE FIELD IMAGES
    # ======================================

    for field_name, value in field_results.items():

     for img_path in value["image_path"]:

        image_model = CCCDImage(

            record_id=record.id,
            field_name=field_name,
            image_path=img_path

        )

        db.session.add(image_model)


    # ======================================
    # SAVE RAW OCR TEXT
    # ======================================

    for field_name, value in field_results.items():

        raw_model = CCCDFieldRaw(

            record_id=record.id,
            field_name=field_name,
            raw_text=value["text"],
            confidence=value["confidence"]

        )

        db.session.add(raw_model)


    db.session.commit()


    # ======================================
    # RESPONSE
    # ======================================

    return jsonify({

        "message": "scan success",
        "record_id": record.id,
        "fields": field_results

    })