import uuid

import cloudinary.uploader
from flask import Blueprint, current_app, jsonify, request

from app.extensions import db
from app.models.partner import Partner
from app.utils.decorators import require_permission

partners_bp = Blueprint("partners", __name__, url_prefix="/api/partners")

ALLOWED_LOGO_EXTENSIONS = {"jpg", "jpeg", "png", "gif", "webp", "svg"}
MAX_LOGO_SIZE_BYTES = 2 * 1024 * 1024  # 2 MB, matching the admin form's own limit


def _extension_of(filename):
    if "." not in filename:
        return None
    return filename.rsplit(".", 1)[1].lower()


def _upload_logo(file):
    """Validates and uploads a logo file to Cloudinary. Returns
    (secure_url, public_id) or raises a (message, status) tuple via
    ValueError for the route to turn into a JSON error response."""
    if file.filename == "":
        raise ValueError(("No file selected", 400))

    extension = _extension_of(file.filename)
    if extension not in ALLOWED_LOGO_EXTENSIONS:
        raise ValueError((
            f"Unsupported file type '.{extension}'. Allowed: {sorted(ALLOWED_LOGO_EXTENSIONS)}",
            400,
        ))

    file.seek(0, 2)
    size = file.tell()
    file.seek(0)
    if size > MAX_LOGO_SIZE_BYTES:
        raise ValueError(("Logo must be less than 2MB", 400))

    try:
        result = cloudinary.uploader.upload(
            file,
            folder="anika_partners",
            public_id=str(uuid.uuid4()),
            resource_type="image",
        )
    except Exception as exc:  # cloudinary raises assorted exception types
        current_app.logger.error("Cloudinary upload failed: %s", exc)
        raise ValueError(("Logo upload to storage provider failed", 502))

    return result["secure_url"], result["public_id"]


@partners_bp.get("")
def list_partners():
    """
    List all partners, newest first. Public -- both the admin dashboard and
    the public About page's partner marquee call this.
    ---
    tags:
      - Partners
    summary: List partners
    responses:
      200:
        description: Array of partners
    """
    rows = Partner.query.order_by(Partner.created_at.desc()).all()
    return jsonify([p.to_dict() for p in rows]), 200


@partners_bp.post("")
@require_permission("partners")
def create_partner():
    """
    Add a partner (admin). Logo is optional; send as multipart/form-data.
    ---
    tags:
      - Partners
    consumes:
      - multipart/form-data
    parameters:
      - name: name
        in: formData
        type: string
        required: true
      - name: category
        in: formData
        type: string
        required: false
      - name: logo
        in: formData
        type: file
        required: false
    responses:
      201:
        description: Partner created
      400:
        description: Validation error
    """
    name = (request.form.get("name") or "").strip()
    if len(name) < 2:
        return jsonify({"error": "Partner name must be at least 2 characters"}), 400
    category = (request.form.get("category") or "").strip() or "Partner"

    logo_url = None
    public_id = None
    logo_file = request.files.get("logo")
    if logo_file:
        try:
            logo_url, public_id = _upload_logo(logo_file)
        except ValueError as err:
            message, status = err.args[0]
            return jsonify({"error": message}), status

    partner = Partner(name=name, category=category, logo_url=logo_url, public_id=public_id)
    db.session.add(partner)
    db.session.commit()
    return jsonify(partner.to_dict()), 201


@partners_bp.patch("/<int:partner_id>")
@require_permission("partners")
def update_partner(partner_id):
    """
    Edit a partner (admin). Send a new logo file to replace the existing
    one, or omit it to leave the current logo untouched.
    ---
    tags:
      - Partners
    consumes:
      - multipart/form-data
    parameters:
      - name: partner_id
        in: path
        type: integer
        required: true
      - name: name
        in: formData
        type: string
        required: false
      - name: category
        in: formData
        type: string
        required: false
      - name: logo
        in: formData
        type: file
        required: false
    responses:
      200:
        description: Updated partner
      400:
        description: Validation error
      404:
        description: Partner not found
    """
    partner = Partner.query.get_or_404(partner_id)

    if "name" in request.form:
        name = request.form.get("name", "").strip()
        if len(name) < 2:
            return jsonify({"error": "Partner name must be at least 2 characters"}), 400
        partner.name = name
    if "category" in request.form:
        partner.category = request.form.get("category", "").strip() or "Partner"

    logo_file = request.files.get("logo")
    if logo_file:
        try:
            new_url, new_public_id = _upload_logo(logo_file)
        except ValueError as err:
            message, status = err.args[0]
            return jsonify({"error": message}), status
        old_public_id = partner.public_id
        partner.logo_url = new_url
        partner.public_id = new_public_id
        if old_public_id:
            try:
                cloudinary.uploader.destroy(old_public_id)
            except Exception as exc:
                current_app.logger.error(
                    "Cloudinary delete failed for public_id=%s: %s", old_public_id, exc
                )

    db.session.commit()
    return jsonify(partner.to_dict()), 200


@partners_bp.delete("/<int:partner_id>")
@require_permission("partners")
def delete_partner(partner_id):
    """
    Remove a partner (admin).
    ---
    tags:
      - Partners
    summary: Delete a partner
    parameters:
      - name: partner_id
        in: path
        type: integer
        required: true
    responses:
      200:
        description: Deleted
      404:
        description: Partner not found
    """
    partner = Partner.query.get_or_404(partner_id)

    if partner.public_id:
        try:
            cloudinary.uploader.destroy(partner.public_id)
        except Exception as exc:
            current_app.logger.error(
                "Cloudinary delete failed for public_id=%s: %s", partner.public_id, exc
            )

    db.session.delete(partner)
    db.session.commit()
    return jsonify({"deleted": True, "id": partner_id}), 200
