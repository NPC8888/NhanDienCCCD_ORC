from app.models.user_model import db

class CCCDImage(db.Model):

    __tablename__ = "cccd_images"

    id = db.Column(db.Integer, primary_key=True)

    record_id = db.Column(db.Integer)

    field_name = db.Column(db.String(50))

    image_path = db.Column(db.String(255))