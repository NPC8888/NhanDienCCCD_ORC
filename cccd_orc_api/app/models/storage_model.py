from app.models.user_model import db

class Storage(db.Model):

    __tablename__ = "storages"

    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(db.Integer)

    name = db.Column(db.String(255))