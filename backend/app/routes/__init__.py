from .health import health_bp
from app.routes.donations import donations_bp
from .applications import applications_bp
from app.routes.gallery import gallery_bp
from app.routes.stories import stories_bp
from .contacts import contacts_bp

__all__ = ["health_bp", "donations_bp", "applications_bp", "gallery_bp", "stories_bp","contacts_bp"]
