"""
Orbital period estimation using Lomb-Scargle periodogram.
"""
import numpy as np
from scipy.signal import find_peaks


def estimate_period_lombscargle(
    time: np.ndarray,
    flux: np.ndarray,
    min_period: float = 0.5,
    max_period: float | None = None,
    samples_per_peak: int = 10,
) -> dict:
    """
    Returns best period (days), periodogram power, and optional secondary peak.
    """
    try:
        from scipy.signal import lombscargle
    except ImportError:
        return {"period": 1.0, "power": 0.0, "error": "scipy required"}
    time = np.asarray(time)
    flux = np.asarray(flux)
    if len(time) < 20 or len(flux) < 20:
        return {"period": 1.0, "power": 0.0, "n_points": len(time)}
    t_span = float(np.ptp(time))
    if max_period is None:
        max_period = t_span / 2.0
    max_period = min(max_period, t_span / 1.5)
    min_f = 1.0 / max_period
    max_f = 1.0 / min_period
    n_f = max(100, int(samples_per_peak * (max_f - min_f) * t_span))
    freqs = np.linspace(min_f, max_f, n_f)
    angular = 2 * np.pi * freqs
    pgram = lombscargle(time, flux - np.mean(flux), angular)
    pgram = pgram / (len(time) / 4.0)
    peaks, props = find_peaks(pgram, height=np.percentile(pgram, 80), distance=max(5, n_f // 50))
    if len(peaks) == 0:
        best_idx = np.argmax(pgram)
        period = 1.0 / freqs[best_idx]
        power = float(pgram[best_idx])
        return {"period": float(period), "power": power, "n_points": len(time)}
    idx = peaks[np.argmax(pgram[peaks])]
    period = 1.0 / freqs[idx]
    power = float(pgram[idx])
    return {
        "period": float(period),
        "power": power,
        "n_points": len(time),
        "freqs": freqs.tolist(),
        "pgram": pgram.tolist(),
    }
