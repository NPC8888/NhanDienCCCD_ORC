from flask import Blueprint, request, jsonify,Request

from services.yolo_service import detect_fields
#from services.ocr_service import read_text
from app.services.orc_service import read_text
from models.record_model import CCCDRecord
from models.image_model import CCCDImage
from models.field_raw_model import CCCDFieldRaw
from models.user_model import db

scan_bp = Blueprint("scan", __name__)


@scan_bp.route("/cccd", methods=["POST"])
def scan_cccd():
    
    storage_id = request.form["storage_id"]

    image = request.files["image"]

    path = "uploads/" + image.filename

    image.save(path)

    result = detect_fields(path)

    fields = result["fields"]

    record = CCCDRecord(

        storage_id=storage_id,

        id_number=fields["id_number"],

        name=fields["name"],

        gender=fields["gender"],

        dob=fields["dob"],

        nationality=fields["nationality"],

        origin_place=fields["origin_place"],

        current_place=fields["current_place"],

        issue_date=fields["issue_date"],

        expire_date=fields["expire_date"],

        features=fields["features"],

        qr_text=fields["qr"],

        image_path=path

    )

    db.session.add(record)

    db.session.commit()

    # save crop images

    for crop in result["crops"]:

        img = CCCDImage(

            record_id=record.id,

            field_name=crop["field"],

            image_path=crop["path"]

        )

        db.session.add(img)

    # save raw OCR

    for field, value in fields.items():

        raw = CCCDFieldRaw(

            record_id=record.id,

            field_name=field,

            raw_text=value,

            confidence=0.95

        )

        db.session.add(raw)

    db.session.commit()

    return jsonify({

        "record_id": record.id,

        "message": "scan saved"

    })