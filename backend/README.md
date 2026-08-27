# ANIKA Backend

Flask + Flask-SQLAlchemy + SQLite API for the ANIKA dashboard (and, later, the public
website's forms and the WhatsApp assistant).

## Setup

Dependencies are managed with [Pipenv](https://pipenv.pypa.io/), not pip/requirements.txt.

```bash
pip install --user pipenv   # skip if you already have it
cd backend
pipenv install               # creates a virtualenv and installs from Pipfile.lock
pipenv run python run.py     # starts the API on http://localhost:5000
```

`run.py` creates `instance/anika.db` (a SQLite file) automatically on first run — it's
git-ignored, so everyone gets their own local database.

Check it's working:

```bash
curl http://localhost:5000/api/health
```

Installing a new package? Use `pipenv install <package>` (or `pipenv install --dev
<package>` for dev-only tools) so it lands in `Pipfile`/`Pipfile.lock` — don't `pip
install` directly and don't add a `requirements.txt`.

## Adding your own routes/models

1. Add a model in `app/models/<name>.py`, export it from `app/models/__init__.py`.
2. Add a blueprint in `app/routes/<name>.py` (copy `health.py` as a starting pattern),
   export it from `app/routes/__init__.py`, and register it in `app/__init__.py`.
3. Prefix API routes with `/api/` (e.g. `/api/events`) so they're easy to tell apart
   from frontend routes once this is deployed behind the same domain as the site.

Stick to your own model/route files where possible — same "own your file" rule as the
frontend, to avoid stepping on someone else's work.
