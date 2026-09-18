from ..extensions import db


class RolePermission(db.Model):
    """Which resources a non-leadership role can access. Leadership always
    has full access and is never stored here -- see role_has_access()."""

    __tablename__ = "role_permissions"

    id = db.Column(db.Integer, primary_key=True)
    role = db.Column(db.String(20), unique=True, nullable=False)
    resources = db.Column(db.JSON, nullable=False, default=list)

    def to_dict(self):
        return {"role": self.role, "resources": self.resources or []}

    def __repr__(self):
        return f"<RolePermission {self.role}: {self.resources}>"
