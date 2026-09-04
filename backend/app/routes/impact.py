from flask import Blueprint, request, jsonify

from ..extensions import db
from ..models.impact_stat import ImpactStat
from ..utils.decorators import require_permission

impact_bp = Blueprint("impact", __name__, url_prefix="/api/impact")

VALID_COLORS = {"red", "green", "orange", "blue"}


def _validate_payload(data):
    if not data.get("label", "").strip():
        return "label is required"
    if not data.get("value", "").strip():
        return "value is required"
    if data.get("colorKey") not in VALID_COLORS:
        return f"colorKey must be one of {sorted(VALID_COLORS)}"
    return None


@impact_bp.get("")
def list_impact_stats():
    """Public -- no auth. This is what both the admin dashboard and the
    (future) public Impact page call to read the current stats."""
    stats = ImpactStat.query.order_by(ImpactStat.id.asc()).all()
    return jsonify([s.to_dict() for s in stats]), 200


@impact_bp.post("")
@require_permission("impact")
def create_impact_stat():
    data = request.get_json(silent=True) or {}
    error = _validate_payload(data)
    if error:
        return jsonify({"error": error}), 400

    stat = ImpactStat(
        label=data["label"].strip(),
        value=data["value"].strip(),
        color_key=data["colorKey"],
    )
    db.session.add(stat)
    db.session.commit()
    return jsonify(stat.to_dict()), 201


@impact_bp.patch("/<int:stat_id>")
@require_permission("impact")
def update_impact_stat(stat_id):
    stat = ImpactStat.query.get_or_404(stat_id)
    data = request.get_json(silent=True) or {}
    error = _validate_payload(data)
    if error:
        return jsonify({"error": error}), 400

    stat.label = data["label"].strip()
    stat.value = data["value"].strip()
    stat.color_key = data["colorKey"]

    db.session.commit()
    return jsonify(stat.to_dict()), 200


@impact_bp.delete("/<int:stat_id>")
@require_permission("impact")
def delete_impact_stat(stat_id):
    stat = ImpactStat.query.get_or_404(stat_id)
    db.session.delete(stat)
    db.session.commit()
    return jsonify({"deleted": True, "id": stat_id}), 200