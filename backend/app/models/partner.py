from datetime import datetime

from app.extensions import db


class Partner(db.Model):
    __tablename__ = "partners"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    category = db.Column(db.String(120), nullable=False, default="Partner")
    logo_url = db.Column(db.String(500), nullable=True)
    public_id = db.Column(db.String(300), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    def to_dict(self):
        """Shaped to match what both Partners.jsx (public marquee) and
        Partners.jsx (admin) already expect: `logo` (not `logo_url`)."""
        return {
            "id": self.id,
            "name": self.name,
            "category": self.category,
            "logo": self.logo_url,
        }

    def __repr__(self):
        return f"<Partner id={self.id} name={self.name!r}>"
