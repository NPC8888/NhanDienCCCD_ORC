from flask import Blueprint, request, jsonify

from app.models.storage_model import Storage
from app.models.user_model import db


storage_bp = Blueprint("storages", __name__)

@storage_bp.route("/", methods=["GET"])
def get_storages():
    """Lấy tất cả kho lưu trữ"""
    storages = Storage.query.all()
    result = []
    for s in storages:
        result.append({
            "id": s.id,
            "user_id": s.user_id,
            "name": s.name
        })
    return jsonify(result)


@storage_bp.route("/", methods=["POST"])
def create_storage():
    """Tạo kho lưu trữ mới"""
    data = request.json
    
    # Validate required fields
    if not data or not data.get("name") or not data.get("user_id"):
        return jsonify({"error": "Missing required fields: name, user_id"}), 400
    
    try:
        # Create new storage
        new_storage = Storage(
            user_id=data.get("user_id"),
            name=data.get("name")
        )
        
        db.session.add(new_storage)
        db.session.commit()
        
        return jsonify({
            "id": new_storage.id,
            "user_id": new_storage.user_id,
            "name": new_storage.name,
            "message": "Storage created successfully"
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@storage_bp.route("/<int:storage_id>", methods=["GET"])
def get_storage(storage_id):
    """Lấy thông tin kho lưu trữ cụ thể"""
    storage = Storage.query.get(storage_id)
    
    if not storage:
        return jsonify({"error": "Storage not found"}), 404
    
    return jsonify({
        "id": storage.id,
        "user_id": storage.user_id,
        "name": storage.name
    })


@storage_bp.route("/<int:storage_id>", methods=["PUT"])
def update_storage(storage_id):
    """Cập nhật kho lưu trữ"""
    storage = Storage.query.get(storage_id)
    
    if not storage:
        return jsonify({"error": "Storage not found"}), 404
    
    data = request.json
    
    try:
        if "name" in data:
            storage.name = data["name"]
        
        db.session.commit()
        
        return jsonify({
            "id": storage.id,
            "user_id": storage.user_id,
            "name": storage.name,
            "message": "Storage updated successfully"
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@storage_bp.route("/<int:storage_id>", methods=["DELETE"])
def delete_storage(storage_id):
    """Xóa kho lưu trữ"""
    storage = Storage.query.get(storage_id)
    
    if not storage:
        return jsonify({"error": "Storage not found"}), 404
    
    try:
        db.session.delete(storage)
        db.session.commit()
        
        return jsonify({"message": "Storage deleted successfully"})
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500