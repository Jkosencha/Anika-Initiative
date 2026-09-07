import hashlib
import secrets
from datetime import datetime, timedelta

from ..extensions import db

TOKEN_TTL_MINUTES =20

class PasswordResetToken(db.Model):
    __tablename__ = "password_reset_tokens"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    token_hash = db.Column(db.String(64), nullable=False, index=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow())
    expires_at = db.Column(db.DateTime, nullable=False)
    used = db.Column(db.Boolean, nullable=False, default=False)

    user = db.relationship("User", backref="password_reset_tokens")

    @staticmethod
    def _hash(raw_token):
        return hashlib.sha256(raw_token.encode("utf-8")).hexdigest()

    @classmethod
    def create_for_user(cls, user):
        """Generates a raw token, stores only its hash, returns the raw token."""
        raw_token = secrets.token_urlsafe(32)
        instance = cls(
            user_id=user.id,
            token_hash=cls._hash(raw_token),
            expires_at=datetime.utcnow() + timedelta(minutes=TOKEN_TTL_MINUTES),
        )
        db.session.add(instance)
        return instance, raw_token

    @classmethod
    def find_valid(cls, raw_token):
        """Looks up a non-expired, unused token by its raw value."""
        token_hash = cls._hash(raw_token)
        candidate = cls.query.filter_by(token_hash=token_hash, used=False).first()
        if not candidate:
            return None
        if candidate.expires_at < datetime.utcnow():
            return None
        return candidate

    @classmethod
    def has_recent_unexpired(cls, user_id, within_minutes=2):
        """Used to throttle repeated forgot-password submissions for the same user."""
        cutoff = datetime.utcnow() - timedelta(minutes=within_minutes)
        return (
            cls.query.filter_by(user_id=user_id, used=False)
            .filter(cls.created_at >= cutoff)
            .filter(cls.expires_at >= datetime.utcnow())
            .first()
            is not None
        )