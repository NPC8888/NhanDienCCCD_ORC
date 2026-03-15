from app.models.user_model import db

class CCCDFieldRaw(db.Model):

    __tablename__ = "cccd_field_raw"

    id = db.Column(db.Integer, primary_key=True)

    record_id = db.Column(db.Integer)

    field_name = db.Column(db.String(50))

    raw_text = db.Column(db.Text)

    confidence = db.Column(db.Float)