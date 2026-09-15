from functools import wraps

from flask import jsonify, request
from flask_jwt_extended import get_jwt, verify_jwt_in_request

# Every resource the Roles & Access screen can actually toggle. Kept as one
# list so the API can reject typos/unknown resource names on save.
ALL_RESOURCES = {
    "contacts", "stories", "gallery", "events", "applications",
    "donations", "newsletter", "impact", "reports", "registrations",
    "whatsapp_inbox", "whatsapp_broadcast", "whatsapp_assistant",
}

# Seed values and fallback for a role that hasn't been saved to the database
# yet (e.g. right after this migration runs, before anyone opens the Roles &
# Access screen). Once a RolePermission row exists for a role, it wins.
DEFAULT_RESOURCE_ACCESS = {
    "comms": {
        "contacts", "stories", "gallery", "impact", "newsletter",
        "whatsapp_inbox", "whatsapp_broadcast", "whatsapp_assistant",
    },
    "programs": {
        "contacts", "events", "registrations", "applications",
    },
    "mel": {
        "donations", "impact", "reports",
    },
}


def role_has_access(role: str, resource: str) -> bool:
    if role == "leadership":
        return True

    # Imported here, not at module level, to avoid a circular import between
    # decorators (used by routes) and models (which import extensions).
    from ..models.role_permission import RolePermission

    row = RolePermission.query.filter_by(role=role).first()
    if row is not None:
        return resource in (row.resources or [])
    return resource in DEFAULT_RESOURCE_ACCESS.get(role, set())


def require_permission(resource: str):
    """
    Guards a route by resource name, e.g.:

        @donations_bp.route("/api/donations", methods=["GET"])
        @require_permission("donations")
        def list_donations():
            ...

    Checks (in order): is there a valid JWT at all, and does the role in
    that JWT have access to this resource -- checked against the
    role_permissions table, not a hardcoded map, so it reflects whatever
    was last saved from the Roles & Access screen. Returns 401 if the
    token is missing/invalid, 403 if the role just isn't allowed here.
    """
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):

            if request.method == "OPTIONS":
                return fn(*args, **kwargs)
            verify_jwt_in_request()
            claims = get_jwt()
            role = claims.get("role")
            if not role_has_access(role, resource):
                return jsonify({
                    "error": "forbidden",
                    "message": f"Role '{role}' does not have access to '{resource}'",
                }), 403
            return fn(*args, **kwargs)
        return wrapper
    return decorator

def require_role(*roles: str):
    """
    For the rarer case where you want to check role identity directly
    rather than a mapped resource (e.g. leadership-only account creation).

        @team_bp.route("/api/team", methods=["POST"])
        @require_role("leadership")
        def create_team_member():
            ...
    """
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            if request.method == "OPTIONS":
                return fn(*args, **kwargs)
            verify_jwt_in_request()
            claims = get_jwt()
            role = claims.get("role")
            if role not in roles:
                return jsonify({
                    "error": "forbidden",
                    "message": f"Role '{role}' is not permitted to perform this action",
                }), 403
            return fn(*args, **kwargs)
        return wrapper
    return decorator
