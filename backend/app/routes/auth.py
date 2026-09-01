
from datetime import timedelta

from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token

from app.models.user import User

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    if not email or not password:
        return jsonify ({"error": "Email and Password are required"}), 400

    user = User.query.filter_by(email=email).first()

    if not user or not user.check_password(password) or not user.is_active:
        return jsonify({"error": "Invalid Credentials"}), 401

    # token
    access_token = create_access_token(
        identity=str(user.id),
        additional_claims={"role": user.role},
        expires_delta=timedelta(hours=8)
    )

    return jsonify({
        "access_token": access_token,
        "user": user.to_dict(),
    }), 200
