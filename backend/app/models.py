from datetime import datetime, timezone

from werkzeug.security import check_password_hash, generate_password_hash

from .extensions import db


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    query_history = db.relationship("QueryHistory", back_populates="user", lazy=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "created_at": self.created_at.isoformat(),
        }


class QueryHistory(db.Model):
    __tablename__ = "query_history"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False, index=True)
    query_text = db.Column(db.String(255), nullable=False)
    query_type = db.Column(db.String(50), nullable=False, default="ipc_bns_lookup")
    result_count = db.Column(db.Integer, nullable=False, default=0)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    user = db.relationship("User", back_populates="query_history")

    def to_dict(self):
        return {
            "id": self.id,
            "query_text": self.query_text,
            "query_type": self.query_type,
            "result_count": self.result_count,
            "created_at": self.created_at.isoformat(),
        }


class IPCBNSMap(db.Model):
    __tablename__ = "ipc_bns_maps"

    id = db.Column(db.Integer, primary_key=True)
    ipc_section = db.Column(db.String(50), nullable=False, index=True)
    ipc_title = db.Column(db.String(255), nullable=False)
    bns_section = db.Column(db.String(50), nullable=False, index=True)
    bns_title = db.Column(db.String(255), nullable=False)
    notes = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "ipc_section": self.ipc_section,
            "ipc_title": self.ipc_title,
            "bns_section": self.bns_section,
            "bns_title": self.bns_title,
            "notes": self.notes,
        }
