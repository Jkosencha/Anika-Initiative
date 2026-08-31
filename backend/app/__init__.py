import os
import logging
from logging.handlers import RotatingFileHandler

from flask import Flask, jsonify

from config import Config, BASE_DIR
from app.extensions import db, cors, swagger

SWAGGER_TEMPLATE = {
    "swagger": "2.0",
    "info": {
        "title": "ANIKA API",
        "description": (
            "Backend for the ANIKA dashboard, public donation form, stories, and (later) the "
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

    app.config["SWAGGER"] = SWAGGER_CONFIG
    swagger.template = SWAGGER_TEMPLATE
    swagger.init_app(app)

    # LOGGING CONFIGURATION 
    if not app.debug:
        app.logger.setLevel(logging.INFO)
        log_dir = os.path.join(BASE_DIR, "logs")
        os.makedirs(log_dir, exist_ok=True)
        log_file = os.path.join(log_dir, "anika.log")

        file_handler = RotatingFileHandler(log_file, maxBytes=10*1024*1024, backupCount=5)
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

    # IMPORT MODELS 
    from app.models.donation import Donation  # ensure table creation
    from app.models.story import Story  # ensure table creation

    from app.routes import health_bp, donations_bp, stories_bp

    app.register_blueprint(health_bp)
    app.register_blueprint(donations_bp)
    app.register_blueprint(stories_bp)

    with app.app_context():
        db.create_all()

    @app.errorhandler(404)
    def not_found(_err):
        return jsonify({"error": "Not found"}), 404

    @app.errorhandler(500)
    def server_error(_err):
        return jsonify({"error": "Internal server error"}), 500

    return app
