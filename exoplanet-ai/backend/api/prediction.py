"""
Prediction endpoints: predict-exoplanet, estimate-period, habitability-score.
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import numpy as np

from ml.preprocess import normalize_light_curve
from ml.period_estimation import estimate_period_lombscargle
from ml.habitabilty import compute_habitabilty_score
from ml.model import predict_exoplanet_proba, get_dip_indices

router = APIRouter()


class TimeFluxBody(BaseModel):
    time: list[float]
    flux: list[float]


class PeriodBody(BaseModel):
    time: list[float]
    flux: list[float]
    min_period: float | None = 0.5
    max_period: float | None = None


class HabitabilityBody(BaseModel):
    period_days: float
    stellar_temp_k: float | None = 5800.0
    planet_radius_earth: float | None = 1.0
    stellar_mass_sun: float | None = 1.0


@router.post("/predict-exoplanet")
def predict_exoplanet(body: TimeFluxBody):
    """Run ML detection; return probability and explanation."""
    if len(body.time) != len(body.flux) or len(body.time) < 10:
        raise HTTPException(400, "Need at least 10 (time, flux) points")
    time = np.array(body.time)
    flux = np.array(body.flux)
    out = predict_exoplanet_proba(time, flux, period=None)
    period = out.get("period_used", 1.0)
    dips = get_dip_indices(time, flux, period)
    return {
        "probability": out["probability"],
        "period_used": period,
        "explanation": out["explanation"],
        "transit_dips": dips,
        "features": out.get("features", {}),
    }


@router.post("/estimate-period")
def estimate_period(body: PeriodBody):
    """Lomb-Scargle period estimation."""
    if len(body.time) != len(body.flux) or len(body.time) < 20:
        raise HTTPException(400, "Need at least 20 points")
    time, flux = np.array(body.time), np.array(body.flux)
    time_n, flux_n = normalize_light_curve(time, flux)
    result = estimate_period_lombscargle(
        time_n, flux_n,
        min_period=body.min_period or 0.5,
        max_period=body.max_period,
    )
    return result


@router.post("/habitabilty-score")
def habitability_score(body: HabitabilityBody):
    """Compute habitability 0–100."""
    result = compute_habitabilty_score(
        period_days=body.period_days,
        stellar_temp_k=body.stellar_temp_k or 5800.0,
        planet_radius_earth=body.planet_radius_earth or 1.0,
        stellar_mass_sun=body.stellar_mass_sun or 1.0,
    )
    return result
