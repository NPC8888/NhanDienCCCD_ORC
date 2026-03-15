from flask import Blueprint, request, jsonify

from app.models.record_model import CCCDRecord
from app.models.image_model import CCCDImage
from app.models.field_raw_model import CCCDFieldRaw
from app.models.user_model import db


record_bp = Blueprint("record", __name__)


# ================================
# GET RECORDS IN STORAGE
# ================================

@record_bp.route("/storage/<int:storage_id>", methods=["GET"])
def get_records(storage_id):

    records = CCCDRecord.query.filter_by(storage_id=storage_id).all()

    result = []

    for r in records:

        result.append({

            "id": r.id,
            "cccd_number": r.id_number,
            "name": r.name,
            "dob": str(r.dob),
            "gender": r.gender

        })

    return jsonify(result)


# ================================
# GET RECORD DETAIL
# ================================

@record_bp.route("/<int:record_id>", methods=["GET"])
def get_record_detail(record_id):

    record = CCCDRecord.query.get(record_id)

    if not record:

        return jsonify({"error": "record not found"}), 404


    images = CCCDImage.query.filter_by(record_id=record_id).all()

    raw_fields = CCCDFieldRaw.query.filter_by(record_id=record_id).all()


    image_list = []

    for img in images:

        image_list.append({

            "field": img.field_name,
            "image_path": img.image_path

        })


    raw_list = []

    for raw in raw_fields:

        raw_list.append({

            "field": raw.field_name,
            "raw_text": raw.raw_text,
            "confidence": raw.confidence

        })


    return jsonify({

        "record": {

            "id": record.id,
            "storage_id": record.storage_id,

            "cccd_number": record.id_number,
            "name": record.name,
            "gender": record.gender,
            "dob": str(record.dob),

            "nationality": record.nationality,

            "origin_place": record.origin_place,
            "current_place": record.current_place,

            "issue_date": str(record.issue_date),
            "expire_date": str(record.expire_date),

            "features": record.features,

            "qr_text": record.qr_text,

            "fingerprint_detected": record.fingerprint_detected,

            "image_path": record.image_path

        },

        "images": image_list,

        "raw_fields": raw_list

    })


# ================================
# SEARCH RECORD
# ================================

@record_bp.route("/search", methods=["GET"])
def search_record():

    name = request.args.get("name")

    cccd = request.args.get("cccd")

    query = CCCDRecord.query


    if name:

        query = query.filter(CCCDRecord.name.like(f"%{name}%"))


    if cccd:

        query = query.filter(CCCDRecord.id_number.like(f"%{cccd}%"))


    results = query.all()


    data = []

    for r in results:

        data.append({

            "id": r.id,
            "name": r.name,
            "cccd": r.id_number,
            "dob": str(r.dob)

        })


    return jsonify(data)


# ================================
# CREATE RECORD MANUALLY
# ================================

@record_bp.route("/", methods=["POST"])
def create_record():

    data = request.json

    record = CCCDRecord(

        storage_id=data["storage_id"],

        id_number=data.get("id_number"),

        name=data.get("name"),

        gender=data.get("gender"),

        dob=data.get("dob"),

        nationality=data.get("nationality"),

        origin_place=data.get("origin_place"),

        current_place=data.get("current_place"),

        issue_date=data.get("issue_date"),

        expire_date=data.get("expire_date"),

        features=data.get("features"),

        qr_text=data.get("qr_text"),

        fingerprint_detected=data.get("fingerprint_detected")

    )


    db.session.add(record)

    db.session.commit()


    return jsonify({

        "message": "record created",

        "record_id": record.id

    })


# ================================
# UPDATE RECORD
# ================================

@record_bp.route("/<int:record_id>", methods=["PUT"])
def update_record(record_id):

    record = CCCDRecord.query.get(record_id)

    if not record:

        return jsonify({"error": "record not found"}), 404


    data = request.json


    for key in data:

        if hasattr(record, key):

            setattr(record, key, data[key])


    db.session.commit()


    return jsonify({

        "message": "record updated"

    })


# ================================
# DELETE RECORD
# ================================

@record_bp.route("/<int:record_id>", methods=["DELETE"])
def delete_record(record_id):

    record = CCCDRecord.query.get(record_id)

    if not record:

        return jsonify({"error": "record not found"}), 404


    # delete related images

    CCCDImage.query.filter_by(record_id=record_id).delete()


    # delete raw OCR fields

    CCCDFieldRaw.query.filter_by(record_id=record_id).delete()


    db.session.delete(record)

    db.session.commit()


    return jsonify({

        "message": "record deleted"

    })