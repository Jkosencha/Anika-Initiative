from app.routes.donations import donations_bp
from app.routes.gallery import gallery_bp
from app.routes.stories import stories_bp

from .applications import applications_bp
from .auth import auth_bp
from .contacts import contacts_bp
from .health import health_bp
from .events import events_bp
from .registrations import registrations_bp
from .whatsapp import whatsapp_bp
from .metrics import metrics_bp

__all__ = [
    "health_bp",
    "donations_bp",
    "applications_bp",
    "auth_bp",
    "gallery_bp",
    "stories_bp",
    "contacts_bp",
    "events_bp",
    "registrations_bp",
    "whatsapp_bp",
    "metrics_bp",
]
