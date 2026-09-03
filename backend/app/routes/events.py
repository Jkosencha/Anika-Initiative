from flask import Blueprint, current_app, jsonify, request

from app.extensions import db
from app.models.event import Event, EVENT_STATUSES

events_bp = Blueprint("events", __name__, url_prefix="/api/events")


@events_bp.get("")
def list_events():
    """
    List events. Pass `public=1` to only return Live/Full events in the
    public-facing shape (used by the public Events page).
    ---
    tags:
      - Events
    summary: List events
    parameters:
      - name: status
        in: query
        type: string
        enum: [Live, Draft, Full, Ended]
      - name: public
        in: query
        type: integer
        enum: [0, 1]
    responses:
      200:
        description: List of events
    """
    status = request.args.get("status")
    public = request.args.get("public") == "1"
    query = Event.query
    if status and status != "All":
        query = query.filter_by(status=status)
    if public:
        query = query.filter(Event.status.in_(["Live", "Full"]))
    events = query.order_by(Event.created_at.desc()).all()
    if public:
        return jsonify([e.to_public_dict() for e in events])
    return jsonify([e.to_dict() for e in events])


@events_bp.post("")
def create_event():
    """
    Create an event (admin).
    ---
    tags:
      - Events
    summary: Create an event
    parameters:
      - name: body
        in: body
        required: true
        schema:
          type: object
          required: [title]
          properties:
            title: {type: string}
            date: {type: string}
            time: {type: string}
            location: {type: string}
            pillar: {type: string}
            capacity: {type: integer}
            registered: {type: integer}
            status: {type: string, enum: [Live, Draft, Full, Ended]}
            image: {type: string}
            imageAlt: {type: string}
            description: {type: string}
    responses:
      201:
        description: Event created
      400:
        description: Validation error
    """
    data = request.get_json(silent=True) or {}
    title = (data.get("title") or "").strip()
    if not title:
        return jsonify({"error": "title is required"}), 400
    status = data.get("status", "Live")
    if status not in EVENT_STATUSES:
        return jsonify({"error": f"Invalid status. Must be one of {EVENT_STATUSES}"}), 400

    event = Event(
        title=title,
        date=data.get("date"),
        time=data.get("time"),
        location=data.get("location"),
        pillar=data.get("pillar"),
        capacity=int(data.get("capacity") or 0),
        registered=int(data.get("registered") or 0),
        status=status,
        image=data.get("image"),
        image_alt=data.get("imageAlt"),
        description=data.get("description"),
    )
    db.session.add(event)
    db.session.commit()
    current_app.logger.info("Event created: id=%s title=%r", event.id, event.title)
    return jsonify(event.to_dict()), 201


@events_bp.patch("/<int:event_id>")
@events_bp.put("/<int:event_id>")
def update_event(event_id):
    """
    Update an event (admin) - e.g. change status or registered count.
    ---
    tags:
      - Events
    summary: Update an event
    parameters:
      - name: event_id
        in: path
        type: integer
        required: true
      - name: body
        in: body
        required: true
        schema:
          type: object
          properties:
            title: {type: string}
            date: {type: string}
            time: {type: string}
            location: {type: string}
            pillar: {type: string}
            capacity: {type: integer}
            registered: {type: integer}
            status: {type: string, enum: [Live, Draft, Full, Ended]}
            image: {type: string}
            imageAlt: {type: string}
            description: {type: string}
    responses:
      200:
        description: Updated event
      400:
        description: Invalid status
      404:
        description: Event not found
    """
    event = Event.query.get_or_404(event_id)
    data = request.get_json(silent=True) or {}
    if "status" in data and data["status"] not in EVENT_STATUSES:
        return jsonify({"error": f"Invalid status. Must be one of {EVENT_STATUSES}"}), 400

    allowed = [
        "title", "date", "time", "location", "pillar",
        "capacity", "registered", "status", "image", "imageAlt", "description",
    ]
    for field in allowed:
        if field in data:
            setattr(event, field, data[field])
    db.session.commit()
    current_app.logger.info("Event updated: id=%s", event.id)
    return jsonify(event.to_dict())

@events_bp.delete("/<int:event_id>")
def delete_event(event_id):
    """
    Delete an event (admin).
    ---
    tags:
      - Events
    summary: Delete an event
    parameters:
      - name: event_id
        in: path
        type: integer
        required: true
    responses:
      200:
        description: Deleted
      404:
        description: Event not found
    """
    event = Event.query.get_or_404(event_id)
    db.session.delete(event)
    db.session.commit()
    current_app.logger.info("Event deleted: id=%s", event_id)
    return jsonify({"message": "Event deleted", "id": event_id})
