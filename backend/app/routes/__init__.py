from app.routes.donations import donations_bp
from app.routes.gallery import gallery_bp
from app.routes.stories import stories_bp

from .applications import applications_bp
from .auth import auth_bp
from .contacts import contacts_bp
from .health import health_bp

__all__ = ["applications_bp", "auth_bp", "contacts_bp", "donations_bp", "gallery_bp", "health_bp", "stories_bp"]
