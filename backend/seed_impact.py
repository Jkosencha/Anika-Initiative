"""
One-off script to seed the impact_stats table with the current values
already shown on the admin dashboard / public site, so switching from
mock data to the real backend doesn't leave things looking empty.

Run from the project root:

    python seed_impact.py

Safe to run multiple times -- skips seeding if the table already has rows,
so it won't create duplicates or wipe out edits made through the admin UI.
"""
from app import create_app
from app.extensions import db
from app.models.impact_stat import ImpactStat

SEED_STATS = [
    { "label": "Events held", "value": "100+", "colorKey": "red" },
    { "label": "Forum participants", "value": "2,500+", "colorKey": "green" },
    { "label": "Artists engaged", "value": "150", "colorKey": "orange" },
    { "label": "Online impressions", "value": "11.4M+", "colorKey": "blue" },
    { "label": "Refugees engaged", "value": "200+", "colorKey": "red" },
    { "label": "Scripts received", "value": "160", "colorKey": "green" },
    { "label": "Young leaders", "value": "80", "colorKey": "orange" },
    { "label": "African countries", "value": "14", "colorKey": "blue" },
]

app = create_app()

with app.app_context():
    if ImpactStat.query.first():
        print("impact_stats already has data -- skipping seed.")
    else:
        for entry in SEED_STATS:
            stat = ImpactStat(label=entry["label"], value=entry["value"], color_key=entry["colorKey"])
            db.session.add(stat)
        db.session.commit()
        print(f"Seeded {len(SEED_STATS)} impact stats.")