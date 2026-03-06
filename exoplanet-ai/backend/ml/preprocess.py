"""
Light curve preprocessing: normalize, detrend, feature extraction.
"""
import numpy as np
from typing import Tuple


def normalize_light_curve(time: np.ndarray, flux: np.ndarray) -> Tuple[np.ndarray, np.ndarray]:
    """Normalize time to start at 0 and flux to median 1, remove NaNs."""
    time = np.asarray(time, dtype=float)
    flux = np.asarray(flux, dtype=float)
    mask = np.isfinite(time) & np.isfinite(flux)
    time, flux = time[mask], flux[mask]
    if len(time) < 2:
        return time, flux
    time = time - time.min()
    med = np.median(flux)
    if med > 0:
        flux = flux / med
    return time, flux


def detrend_simple(flux: np.ndarray, window: int = 50) -> np.ndarray:
    """Simple rolling median detrend."""
    if len(flux) < window:
        return flux
    from scipy.ndimage import uniform_filter1d
    trend = uniform_filter1d(flux, size=min(window, len(flux)), mode="nearest")
    return flux / np.maximum(trend, 1e-10)


def extract_features(time: np.ndarray, flux: np.ndarray, period: float | None = None) -> dict:
    """
    Extract features for ML: statistics, depth, periodogram-related.
    Used by the classifier for exoplanet vs no-planet.
    """
    time = np.asarray(time)
    flux = np.asarray(flux)
    if len(flux) < 10:
        return {}
    f_std = float(np.std(flux))
    f_min = float(np.min(flux))
    f_max = float(np.max(flux))
    f_mean = float(np.mean(flux))
    depth = 1.0 - f_min if f_min > 0 else 0.0
    features = {
        "flux_std": f_std,
        "flux_min": f_min,
        "flux_max": f_max,
        "flux_mean": f_mean,
        "depth": depth,
        "flux_range": f_max - f_min,
    }
    if period is not None and period > 0 and len(time) >= 20:
        # Phase-fold and compute dip concentration
        phase = (time % period) / period
        bins = np.linspace(0, 1, 21)
        binned = np.array([np.median(flux[(phase >= bins[i]) & (phase < bins[i + 1])]) for i in range(20)])
        features["phase_fold_std"] = float(np.std(binned))
        features["phase_fold_min"] = float(np.min(binned))
    return features
