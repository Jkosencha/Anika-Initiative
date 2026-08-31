from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.contact import Contact
from datetime import datetime

contacts_bp = Blueprint('contacts', __name__, url_prefix='/api/contacts')

@contacts_bp.route('', methods=['POST'])
def create_contact():
    
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No JSON data provided'}), 400

    required = ['name', 'email', 'source']
    for field in required:
        if field not in data:
            return jsonify({'error': f'Missing required field: {field}'}), 400

    if data['source'] not in ('donation', 'getinvolved'):
        return jsonify({'error': 'Invalid source.'}), 400

    contact = Contact(
        name=data['name'],
        email=data['email'],
        phone=data.get('phone'),
        message=data.get('message'),
        source=data['source'],
        subject=data.get('subject'),
        country=data.get('country'),
        status=data.get('status', 'new')
    )
    db.session.add(contact)
    db.session.commit()
    return jsonify(contact.to_dict()), 201

@contacts_bp.route('', methods=['GET'])
def list_contacts():
   
    page = request.args.get('page', 1, type=int)
    per_page = min(request.args.get('per_page', 20, type=int), 100)
    source = request.args.get('source')
    status = request.args.get('status')

    query = Contact.query
    if source:
        query = query.filter_by(source=source)
    if status:
        query = query.filter_by(status=status)

    query = query.order_by(Contact.created_at.desc())
    paginated = query.paginate(page=page, per_page=per_page, error_out=False)

    return jsonify({
        'contacts': [c.to_dict() for c in paginated.items],
        'total': paginated.total,
        'page': page,
        'per_page': per_page,
        'pages': paginated.pages,
    }), 200

@contacts_bp.route('/<int:contact_id>', methods=['GET'])
def get_contact(contact_id):
   
    contact = Contact.query.get_or_404(contact_id)
    return jsonify(contact.to_dict()), 200

@contacts_bp.route('/<int:contact_id>', methods=['PUT'])
def update_contact(contact_id):
    
    contact = Contact.query.get_or_404(contact_id)
    data = request.get_json() or {}
    allowed = ['name', 'email', 'phone', 'message', 'status']
    for field in allowed:
        if field in data:
            setattr(contact, field, data[field])
    contact.updated_at = datetime.utcnow()
    db.session.commit()
    return jsonify(contact.to_dict()), 200

@contacts_bp.route('/<int:contact_id>', methods=['DELETE'])
def delete_contact(contact_id):
    
    contact = Contact.query.get_or_404(contact_id)
    db.session.delete(contact)
    db.session.commit()
    return jsonify({'message': 'Contact deleted'}), 200