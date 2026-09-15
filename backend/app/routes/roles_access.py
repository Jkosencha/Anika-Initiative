from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required

from ..extensions import db
from ..models.role_permission import RolePermission
from ..utils.decorators import ALL_RESOURCES, DEFAULT_RESOURCE_ACCESS, require_role

roles_access_bp = Blueprint("roles_access", __name__, url_prefix="/api/roles-access")

# Leadership is always full-access and isn't stored as a row -- keep it out
# of what a PUT can target.
EDITABLE_ROLES = ("comms", "programs", "mel")


@roles_access_bp.get("")
@jwt_required()
def get_roles_access():
    """
    The current resource map for every role. Any authenticated user can
    read this -- the frontend needs it to know what to show in its own
    nav, not just leadership.
    ---
    tags:
      - Roles & Access
    summary: Get the current role -> resource map
    responses:
      200:
        description: One entry per role
    """
    result = {"leadership": sorted(ALL_RESOURCES)}
    for role in EDITABLE_ROLES:
        row = RolePermission.query.filter_by(role=role).first()
        if row is not None:
            result[role] = row.resources or []
        else:
            result[role] = sorted(DEFAULT_RESOURCE_ACCESS.get(role, set()))
    return jsonify(result), 200


@roles_access_bp.put("/<role>")
@require_role("leadership")
def update_role_access(role):
    """
    Replace a role's resource list. Leadership-only.
    ---
    tags:
      - Roles & Access
    summary: Update what a role can access
    parameters:
      - in: path
        name: role
        required: true
      - in: body
        name: body
        required: true
        schema:
          type: object
          required: [resources]
          properties:
            resources:
              type: array
              items: {type: string}
    responses:
      200:
        description: Updated
      400:
        description: Validation error
    """
    if role not in EDITABLE_ROLES:
        return jsonify({"error": f"'{role}' access can't be edited here"}), 400

    data = request.get_json(silent=True) or {}
    resources = data.get("resources")
    if not isinstance(resources, list) or not all(isinstance(r, str) for r in resources):
        return jsonify({"error": "resources must be a list of strings"}), 400

    invalid = set(resources) - ALL_RESOURCES
    if invalid:
        return jsonify({"error": f"Unknown resource(s): {sorted(invalid)}"}), 400

    row = RolePermission.query.filter_by(role=role).first()
    if row is None:
        row = RolePermission(role=role, resources=resources)
        db.session.add(row)
    else:
        row.resources = resources
    db.session.commit()

    return jsonify(row.to_dict()), 200
