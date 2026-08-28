from flask import Flask
from flask_cors import CORS

from config import Config

from .extensions import db
from .routes import health_bp


def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    db.init_app(app)
    CORS(app)

    app.register_blueprint(health_bp)

    with app.app_context():
        from . import models  # noqa: F401
        db.create_all()

    return app
