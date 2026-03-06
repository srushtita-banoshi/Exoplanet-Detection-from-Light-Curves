"""
Demo data: famous exoplanets for instant visualization.
"""
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()


DEMO_PLANETS = [
    {
        "id": "kepler-22b",
        "name": "Kepler-22b",
        "period_days": 289.9,
        "radius_earth": 2.4,
        "habitabilty_score": 72,
        "discovery": "Kepler (2011)",
        "description": "First Kepler planet in the habitable zone of a Sun-like star.",
    },
    {
        "id": "trappist-1e",
        "name": "TRAPPIST-1e",
        "period_days": 6.1,
        "radius_earth": 0.92,
        "habitabilty_score": 85,
        "discovery": "Spitzer/Kepler",
        "description": "Potentially rocky, in habitable zone of ultracool dwarf.",
    },
    {
        "id": "toi-700-d",
        "name": "TOI-700 d",
        "period_days": 37.4,
        "radius_earth": 1.14,
        "habitabilty_score": 82,
        "discovery": "TESS (2020)",
        "description": "First Earth-sized planet in habitable zone by TESS.",
    },
    {
        "id": "kepler-186f",
        "name": "Kepler-186f",
        "period_days": 129.9,
        "radius_earth": 1.11,
        "habitabilty_score": 80,
        "discovery": "Kepler (2014)",
        "description": "First Earth-size planet in habitable zone.",
    },
    {
        "id": "kepler-452b",
        "name": "Kepler-452b",
        "period_days": 384.8,
        "radius_earth": 1.63,
        "habitabilty_score": 78,
        "discovery": "Kepler (2015)",
        "description": "Earth cousin orbiting a Sun-like star.",
    },
]


@router.get("/get-demo-data")
def get_demo_data():
    """Return list of demo exoplanets for dashboard and instant visualization."""
    return {"planets": DEMO_PLANETS}
