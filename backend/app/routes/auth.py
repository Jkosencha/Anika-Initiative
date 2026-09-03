
from datetime import timedelta

from flask import Blueprint, jsonify, request
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    get_jwt,
    get_jwt_identity,
    jwt_required,
)

from app.models.user import User

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")

ACCESS_TOKEN_EXPIRY = timedelta(hours=8)
REFRESH_TOKEN_EXPIRY = timedelta(days=30)

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

    additional_claims = {"role": user.role}

    access_token = create_access_token(
        identity=str(user.id),
        additional_claims=additional_claims,
        expires_delta=ACCESS_TOKEN_EXPIRY,
    )

    # refresh token for expired access token
    refresh_token = create_refresh_token(
        identity=str(user.id),
        additional_claims=additional_claims,
        expires_delta=REFRESH_TOKEN_EXPIRY
    )

    return jsonify({
        "access_token": access_token,
        "refresh_token": refresh_token,
        "user": user.to_dict(),
    }), 200

@auth_bp.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)

def refresh():
    identity = get_jwt_identity()
    role = get_jwt().get("role")
 
    new_access_token = create_access_token(
        identity=identity,
        additional_claims={"role": role},
        expires_delta=ACCESS_TOKEN_EXPIRY,
    )
    return jsonify({"access_token": new_access_token}), 200