import logging
import os
from logging.handlers import RotatingFileHandler

from flask import Flask, jsonify
from flask_migrate import Migrate  # <-- ADDED for Alembic

from config import BASE_DIR, Config
from app.extensions import cors, db, jwt, mail, swagger
from app.utils.cloudinary_config import init_cloudinary

SWAGGER_TEMPLATE = {
    "swagger": "2.0",
    "info": {
        "title": "ANIKA API",
        "description": (
            "Backend for the ANIKA dashboard, public donation form, and (later) the "
            "WhatsApp assistant. Donations are processed through Paystack. "
            "Auth is not implemented yet -- all routes are currently open."
        ),
        "version": "1.0.0",
    },
}

SWAGGER_CONFIG = {
    "headers": [],
    "specs": [{"endpoint": "apispec", "route": "/apispec.json", "rule_filter": lambda rule: True}],
    "static_url_path": "/flasgger_static",
    "swagger_ui": True,
    "specs_route": "/api/docs/",
}


def create_app(config_class=Config):
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_object(config_class)

    os.makedirs(os.path.join(BASE_DIR, "instance"), exist_ok=True)

    db.init_app(app)
    cors.init_app(app, resources={r"/api/*": {"origins": app.config["CORS_ORIGINS"]}})
    jwt.init_app(app)
    mail.init_app(app)

    # --- Initialize Flask-Migrate (Alembic) ---
    migrate = Migrate(app, db)  # <-- ADDED

    app.config["SWAGGER"] = SWAGGER_CONFIG
    swagger.template = SWAGGER_TEMPLATE
    swagger.init_app(app)

    init_cloudinary(app)

    if not app.debug:
        app.logger.setLevel(logging.INFO)
        log_dir = os.path.join(BASE_DIR, "logs")
        os.makedirs(log_dir, exist_ok=True)
        log_file = os.path.join(log_dir, "anika.log")

        file_handler = RotatingFileHandler(log_file, maxBytes=10 * 1024 * 1024, backupCount=5)
        file_handler.setLevel(logging.INFO)

        console_handler = logging.StreamHandler()
        console_handler.setLevel(logging.INFO)

        formatter = logging.Formatter(
            '[%(asctime)s] %(levelname)s in %(module)s: %(message)s'
        )
        file_handler.setFormatter(formatter)
        console_handler.setFormatter(formatter)

        app.logger.addHandler(file_handler)
        app.logger.addHandler(console_handler)

    # Import all models (so Alembic can detect them)
    from app.models.annual_report import AnnualReport
    from app.models.application import Application
    from app.models.contact import Contact
    from app.models.donation import Donation
    from app.models.event import Event
    from app.models.gallery import GalleryImage
    from app.models.registration import Registration
    from app.models.report_schedule import ReportSchedule
    from app.models.settings import Settings
    from app.models.story import Story
    from app.models.user import User
    from app.models.whatsapp_broadcast import WhatsAppBroadcast
    from app.models.whatsapp_conversation import WhatsAppConversation
    from app.models.whatsapp_settings import WhatsAppSettings
    from app.models.newsletter import NewsletterSubscriber
    from app.models.export_log import ExportLog
    from app.models.impact_stat import ImpactStat

    from app.routes import (
        applications_bp,
        auth_bp,
        contacts_bp,
        donations_bp,
        events_bp,
        gallery_bp,
        health_bp,
        impact_bp,
        metrics_bp,
        registrations_bp,
        reports_bp,
        team_bp,
        settings_bp,
        stories_bp,
        whatsapp_bp,
    )
    from app.routes.newsletter import newsletter_bp

    # Register blueprints
    app.register_blueprint(health_bp)
    app.register_blueprint(donations_bp)
    app.register_blueprint(applications_bp)
    app.register_blueprint(gallery_bp)
    app.register_blueprint(stories_bp)
    app.register_blueprint(contacts_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(events_bp)
    app.register_blueprint(registrations_bp)
    app.register_blueprint(whatsapp_bp)
    app.register_blueprint(metrics_bp)
    app.register_blueprint(team_bp)
    app.register_blueprint(settings_bp)
    app.register_blueprint(reports_bp)
    app.register_blueprint(newsletter_bp)
    app.register_blueprint(impact_bp)

    # --- REMOVED db.create_all() and _apply_pending_migrations() ---
    # Migrations are now managed via Alembic (flask db upgrade)
    with app.app_context():
        app.logger.info("Database migrations should be run with 'flask db upgrade'")

    @app.errorhandler(404)
    def not_found(_err):
        return jsonify({"error": "Not found"}), 404

    @app.errorhandler(500)
    def server_error(_err):
        return jsonify({"error": "Internal server error"}), 500

    return app