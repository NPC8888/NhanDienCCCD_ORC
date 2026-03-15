from app.models.user_model import db

class CCCDRecord(db.Model):

    __tablename__ = "cccd_records"

    id = db.Column(db.Integer, primary_key=True)

    storage_id = db.Column(db.Integer)

    id_number = db.Column(db.String(20))

    name = db.Column(db.String(255))

    gender = db.Column(db.String(10))

    dob = db.Column(db.Date)

    nationality = db.Column(db.String(50))

    origin_place = db.Column(db.Text)

    current_place = db.Column(db.Text)

    issue_date = db.Column(db.Date)

    expire_date = db.Column(db.Date)

    features = db.Column(db.Text)

    qr_text = db.Column(db.Text)

    fingerprint_detected = db.Column(db.Boolean)

    image_path = db.Column(db.String(255))