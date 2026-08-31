import os
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = os.path.abspath(os.path.dirname(__file__))


class Config:
    SECRET_KEY = os.environ.get("FLASK_SECRET_KEY", "dev-secret-change-me")
    DEBUG = os.environ.get("FLASK_DEBUG", "0") == "1"
    CONTACT_EMAIL = os.getenv("CONTACT_EMAIL", "info@anika.org")

    SQLALCHEMY_DATABASE_URI = os.environ.get(
        "DATABASE_URL"
    ) or "sqlite:///" + os.path.join(BASE_DIR, "instance", "anika.db")
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    PAYSTACK_SECRET_KEY = os.environ.get("PAYSTACK_SECRET_KEY", "")
    PAYSTACK_PUBLIC_KEY = os.environ.get("PAYSTACK_PUBLIC_KEY", "")
    PAYSTACK_BASE_URL = os.environ.get("PAYSTACK_BASE_URL", "https://api.paystack.co")

    DONATION_CALLBACK_URL = os.environ.get(
        "DONATION_CALLBACK_URL", "http://localhost:5173/donate/thank-you"
    )

    CORS_ORIGINS = [
        o.strip()
        for o in os.environ.get("CORS_ORIGINS", "http://localhost:5173").split(",")
        if o.strip()
    ]
