from datetime import datetime, timezone

from ..extensions import db


class ImpactStat(db.Model):
    __tablename__ = "impact_stats"

    id = db.Column(db.Integer, primary_key=True)
    label = db.Column(db.String(120), nullable=False)

    # Kept as a string, not a number for values like "100+", "24M+",
    value = db.Column(db.String(30), nullable=False)

    color_key = db.Column(db.String(20), nullable=False, default="red")  # red | green | orange | blue

    updated_at = db.Column(
        db.DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    def to_dict(self):
        return {
            "id": self.id,
            "label": self.label,
            "value": self.value,
            "colorKey": self.color_key,
        }

    def __repr__(self):
        return f"<ImpactStat {self.label}: {self.value}>"