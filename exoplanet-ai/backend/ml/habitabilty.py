"""
Habitability scoring (0–100) from orbital distance, stellar temp, planet size.
Uses simplified formulas for demo; can be replaced with more detailed models.
"""
import math
from typing import Optional


def compute_habitabilty_score(
    period_days: float,
    stellar_temp_k: float = 5800.0,
    planet_radius_earth: float = 1.0,
    stellar_mass_sun: float = 1.0,
) -> dict:
    """
    Compute 0–100 habitability score.
    - period_days: orbital period in days
    - stellar_temp_k: stellar effective temperature (K)
    - planet_radius_earth: planet radius in Earth radii
    - stellar_mass_sun: stellar mass in solar masses
    """
    # Simplified: assume Kepler's 3rd law for semi-major axis
    # a^3 = G*M*T^2 / (4*pi^2) -> a ∝ (M * T^2)^(1/3)
    # For Sun: a_earth ~ 1 AU, T ~ 365 d
    au_per_day_sq = (1.0 / (365.25 ** 2)) * (stellar_mass_sun ** (1.0 / 3.0))
    a_au = (period_days ** 2 * stellar_mass_sun) ** (1.0 / 3.0) * (1.0 / 365.25 ** (2.0 / 3.0))
    # Habitable zone (simplified): 0.95–1.37 AU for Sun-like; scale by sqrt(L) ~ (T/5800)^2
    l_ratio = (stellar_temp_k / 5800.0) ** 4
    inner = 0.95 * (l_ratio ** 0.5)
    outer = 1.37 * (l_ratio ** 0.5)
    in_zone = inner <= a_au <= outer
    # Distance score: 100 at center of zone, 0 at edges
    mid = (inner + outer) / 2
    half_width = (outer - inner) / 2
    dist_score = 100.0 * max(0, 1.0 - abs(a_au - mid) / half_width)
    # Size penalty: prefer 0.8–1.5 R_earth
    if planet_radius_earth <= 0:
        planet_radius_earth = 1.0
    size_score = 100.0 * max(0, 1.0 - 0.5 * abs(planet_radius_earth - 1.1))
    # Combine
    hab = 0.6 * dist_score + 0.4 * size_score
    if not in_zone:
        hab *= 0.5
    hab = max(0, min(100, round(hab, 1)))
    return {
        "habitabilty_score": hab,
        "semi_major_axis_au": round(a_au, 4),
        "in_habitable_zone": in_zone,
        "distance_score": round(dist_score, 1),
        "size_score": round(size_score, 1),
    }
