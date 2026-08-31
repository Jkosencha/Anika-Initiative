from .health import health_bp
from app.routes.donations import donations_bp
from .applications import applications_bp

__all__ = ["health_bp","donations_bp","applications_bp"]
