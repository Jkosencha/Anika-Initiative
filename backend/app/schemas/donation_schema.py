from marshmallow import Schema, fields, validate, validates_schema, ValidationError

from app.models.donation import Donation


class CreateDonationSchema(Schema):
    """
    POST /api/donations -- handles two cases with one shape:

    1. A donor paying through Paystack: method = 'mpesa' or 'card'.
       Creates a Pending row and kicks off a Paystack transaction;
       the response includes `authorization_url` to redirect to.

    2. An admin logging an offline/cash gift: method = 'manual'.
       Creates the row directly with whatever `status` is given --
       no Paystack call.
    """

    donor_name = fields.Str(load_default="Anonymous", validate=validate.Length(max=160))
    email = fields.Email(load_default=None, allow_none=True)
    amount = fields.Float(required=True, validate=validate.Range(min=1))
    method = fields.Str(
        load_default="manual", validate=validate.OneOf(["mpesa", "card", "manual"])
    )
    phone = fields.Str(load_default=None, allow_none=True, validate=validate.Length(max=32))
    currency = fields.Str(load_default=None, allow_none=True, validate=validate.OneOf(["KES", "USD"]))
    status = fields.Str(load_default="Completed", validate=validate.OneOf(Donation.STATUSES))
    send_whatsapp_receipt = fields.Bool(load_default=False)

    @validates_schema
    def phone_required_for_mpesa(self, data, **kwargs):
        if data.get("method") == "mpesa" and not (data.get("phone") or "").strip():
            raise ValidationError({"phone": ["phone is required for M-Pesa donations"]})


class UpdateDonationSchema(Schema):
    """PATCH /api/donations/<id> -- every field optional, only given ones are changed."""

    donor_name = fields.Str(validate=validate.Length(min=1, max=160))
    phone = fields.Str(allow_none=True, validate=validate.Length(max=32))
    amount = fields.Float(validate=validate.Range(min=1))
    status = fields.Str(validate=validate.OneOf(Donation.STATUSES))


create_donation_schema = CreateDonationSchema()
update_donation_schema = UpdateDonationSchema(partial=True)
