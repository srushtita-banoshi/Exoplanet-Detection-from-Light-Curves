"""
Exoplanet detection model: load LightGBM or use heuristic based on depth + periodogram.
"""
import os
import numpy as np
from pathlib import Path

_MODEL = None
_MODEL_PATH = Path(__file__).resolve().parent.parent / "models" / "lgb_exoplanet.txt"


def _get_model():
    global _MODEL
    if _MODEL is not None:
        return _MODEL
    try:
        import lightgbm as lgb
        if _MODEL_PATH.exists():
            _MODEL = lgb.Booster(model_file=str(_MODEL_PATH))
            return _MODEL
    except Exception:
        pass
    return None


def _heuristic_proba(time: np.ndarray, flux: np.ndarray, period: float | None) -> float:
    """
    Heuristic probability when no trained model: use depth and (optional) period consistency.
    Tuned to give high prob for clear transits, low for flat light curves.
    """
    flux = np.asarray(flux)
    if len(flux) < 10:
        return 0.0
    depth = 1.0 - float(np.min(flux))
    std = float(np.std(flux))
    # Clear transit: depth 0.001–0.05, some structure
    if depth < 0.0001:
        return 0.05
    if depth > 0.1:
        return 0.3  # Could be eclipse or noise
    # Base score from depth (log scale)
    import math
    score = min(0.95, 0.3 + 0.65 * math.tanh(depth * 100))
    if period is not None and period > 0 and len(flux) > 20:
        # Phase fold and check concentration of dip
        time = np.asarray(time)
        phase = (time % period) / period
        bins = np.linspace(0, 1, 11)
        binned = [np.median(flux[(phase >= bins[i]) & (phase < bins[i + 1])]) for i in range(10)]
        dip_concentration = 1.0 - min(binned)
        if dip_concentration > 0.5 * depth:
            score = min(0.98, score + 0.1)
    return round(score, 4)


def predict_exoplanet_proba(
    time: np.ndarray,
    flux: np.ndarray,
    period: float | None = None,
) -> dict:
    """
    Return probability of exoplanet (0–1), and optional feature importance / explanation.
    """
    from .preprocess import normalize_light_curve, extract_features
    time = np.asarray(time, dtype=float)
    flux = np.asarray(flux, dtype=float)
    time_n, flux_n = normalize_light_curve(time, flux)
    if period is None or period <= 0:
        from .period_estimation import estimate_period_lombscargle
        est = estimate_period_lombscargle(time_n, flux_n)
        period = est.get("period", 1.0)
    features = extract_features(time_n, flux_n, period)
    model = _get_model()
    if model is not None and features:
        try:
            # Build feature vector in model order (must match training)
            F = [
                features.get("flux_std", 0),
                features.get("flux_min", 1),
                features.get("depth", 0),
                features.get("flux_range", 0),
                features.get("phase_fold_std", 0) if "phase_fold_std" in features else 0,
                features.get("phase_fold_min", 1) if "phase_fold_min" in features else 1,
            ]
            X = np.array(F, dtype=np.float32).reshape(1, -1)
            proba = float(model.predict(X)[0])
            proba = max(0, min(1, proba))
        except Exception:
            proba = _heuristic_proba(time_n, flux_n, period)
    else:
        proba = _heuristic_proba(time_n, flux_n, period)
    return {
        "probability": round(proba, 4),
        "period_used": period,
        "features": features,
        "explanation": "Transit depth and phase-fold consistency support exoplanet signal." if proba > 0.5 else "Weak or no clear transit dip detected.",
    }


def get_dip_indices(time: np.ndarray, flux: np.ndarray, period: float) -> list[tuple[float, float]]:
    """
    Return list of (start_time, end_time) for detected transit dips (for visualization).
    """
    time = np.asarray(time)
    flux = np.asarray(flux)
    phase = (time % period) / period
    # Dip = flux below threshold
    thresh = np.median(flux) - 0.5 * (np.median(flux) - np.min(flux))
    in_dip = flux < thresh
    intervals = []
    i = 0
    while i < len(time):
        if in_dip[i]:
            start = time[i]
            while i < len(time) and in_dip[i]:
                i += 1
            end = time[i - 1] if i > 0 else start
            intervals.append((float(start), float(end)))
        else:
            i += 1
    return intervals[: 20]
