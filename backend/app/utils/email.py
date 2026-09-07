import logging
import requests
from flask import current_app
from flask_mail import Message
from ..extensions import mail

logger = logging.getLogger(__name__)


def _send_email(to_email, subject, body, sender_override=None, sender_name=None):
    """
    Send an email using Brevo API if configured, otherwise fallback to Flask-Mail (SMTP).

    Args:
        to_email (str): Recipient email address
        subject (str): Email subject
        body (str): Plain text body
        sender_override (str, optional): Override the sender email address
        sender_name (str, optional): Display name for the sender (e.g., "ANIKA Newsletter")
    """
    api_key = current_app.config.get("BREVO_API_KEY")
    sender = sender_override or current_app.config.get("MAIL_DEFAULT_SENDER", "noreply@anika.org")
    display_name = sender_name or "ANIKA Initiative"

    # If Brevo API key is present, use it
    if api_key:
        url = "https://api.brevo.com/v3/smtp/email"
        headers = {
            "api-key": api_key,
            "Content-Type": "application/json",
        }
        payload = {
            "sender": {"name": display_name, "email": sender},
            "to": [{"email": to_email}],
            "subject": subject,
            "textContent": body,
        }
        try:
            response = requests.post(url, json=payload, headers=headers, timeout=15)
            if response.status_code in (200, 201, 202):
                logger.info("Email sent via Brevo API to %s", to_email)
                return True
            else:
                logger.error("Brevo API error %s: %s", response.status_code, response.text)
                # fallback to SMTP if API fails
        except requests.RequestException as e:
            logger.error("Brevo API request failed: %s", e)
            # fallback to SMTP

    # Fallback to Flask-Mail (SMTP)
    try:
        msg = Message(
            subject=subject,
            recipients=[to_email],
            body=body,
            sender=(display_name, sender) if display_name else sender,
        )
        mail.send(msg)
        logger.info("Email sent via SMTP to %s", to_email)
        return True
    except Exception as e:
        logger.error("SMTP send failed to %s: %s", to_email, e)
        return False


def send_org_notification(application):
    """
    Send an email to the organisation admin when a new application is submitted.
    """
    subject = f"New Application: {application.subject} from {application.name}"
    body = (
        f"New application #{application.id}\n"
        f"Name: {application.name}\n"
        f"Email: {application.email}\n"
        f"Phone: {application.phone or 'N/A'}\n"
        f"Organisation: {application.organisation or 'N/A'}\n"
        f"Country: {application.country or 'N/A'}\n"
        f"Subject: {application.subject}\n"
        f"Message:\n{application.message or 'No message provided'}\n"
        f"WhatsApp opt‑in: {'Yes' if application.whatsapp_opt_in else 'No'}"
    )
    admin_email = current_app.config.get("ORG_NOTIFICATION_EMAIL") or \
                  current_app.config.get("ADMIN_EMAIL", "admin@example.com")
    _send_email(admin_email, subject, body)
    logger.info("Organisation notification sent for application #%s", application.id)


def send_user_confirmation(application):
    """
    Send a confirmation email to the user who submitted the form.
    """
    subject = "Thank you for your interest – Anika Initiative"
    body = (
        f"Dear {application.name},\n\n"
        f"Thank you for reaching out to us through the '{application.subject}' form.\n"
        f"We have received your application and will review it shortly.\n\n"
        f"Here is a summary of your submission:\n"
        f"Name: {application.name}\n"
        f"Email: {application.email}\n"
        f"Phone: {application.phone or 'N/A'}\n"
        f"Organisation: {application.organisation or 'N/A'}\n"
        f"Country: {application.country or 'N/A'}\n"
        f"Subject: {application.subject}\n"
        f"Message: {application.message or 'No message provided'}\n\n"
        f"Best regards,\nThe Anika Initiative Team"
    )
    _send_email(application.email, subject, body)
    logger.info("Confirmation email sent to %s for application #%s", application.email, application.id)


def send_team_invite_email(user, password):
    """
    Email a newly-invited team member their login credentials.
    """
    subject = "You've been added to the ANIKA dashboard"
    origins = current_app.config.get("CORS_ORIGINS") or []
    frontend_url = origins[0] if origins else "http://localhost:5173"
    body = (
        f"Hi {user.name},\n\n"
        f"An account has been created for you on the ANIKA admin dashboard as {user.role}.\n\n"
        f"Log in at: {frontend_url}/admin/login\n"
        f"Email: {user.email}\n"
        f"Temporary password: {password}\n\n"
        f"Please log in and change your password as soon as possible.\n\n"
        f"Best regards,\nThe Anika Initiative Team"
    )
    _send_email(user.email, subject, body)
    logger.info("Invite email sent to %s (role=%s)", user.email, user.role)


def send_status_update_email(application, new_status):
    """
    Send an email to the applicant when their application status changes.
    """
    subject = f"Your application status has been updated – Anika Initiative"
    body = (
        f"Dear {application.name},\n\n"
        f"Your application for '{application.subject}' has been updated.\n"
        f"New status: **{new_status}**\n\n"
        f"Thank you for your interest in Anika Initiative.\n"
        f"Best regards,\nThe Anika Initiative Team"
    )
    if new_status == "Shortlisted":
        body += "\n\nWe are pleased to inform you that you have been shortlisted. We will contact you shortly with next steps."
    elif new_status == "Accepted":
        body += "\n\nCongratulations! We are happy to accept your application. More information will follow."
    elif new_status == "Rejected":
        body += "\n\nWe appreciate your interest, but we are unable to offer you a place at this time. Thank you for your understanding."
    _send_email(application.email, subject, body)
    logger.info("Status update email sent to %s for application #%s (status: %s)",
                application.email, application.id, new_status)


def send_password_reset_email(user, raw_token):
    """
    Email a team member a link to reset their password.
    """
    subject = "Reset your ANIKA dashboard password"
    origins = current_app.config.get("CORS_ORIGINS") or []
    frontend_url = origins[0] if origins else "http://localhost:5173"
    reset_link = f"{frontend_url}/admin/reset-password?token={raw_token}"
    body = (
        f"Hi {user.name},\n\n"
        f"We received a request to reset your ANIKA dashboard password.\n\n"
        f"Reset your password here: {reset_link}\n\n"
        f"This link expires in 20 minutes. If you didn't request this, you can safely ignore this email.\n\n"
        f"Best regards,\nThe Anika Initiative Team"
    )
    _send_email(user.email, subject, body)
    logger.info("Password reset email sent to %s", user.email)