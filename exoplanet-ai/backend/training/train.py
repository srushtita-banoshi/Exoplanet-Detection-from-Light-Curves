"""
Train LightGBM classifier on synthetic light curves for exoplanet detection.
Generates data with/without transit dips and trains to >95% AUC.
Run from backend/:  python -m training.train
"""
import sys
from pathlib import Path
# Ensure backend is on path so "ml" resolves
_backend = Path(__file__).resolve().parent.parent
if str(_backend) not in sys.path:
    sys.path.insert(0, str(_backend))

import numpy as np

# Optional
try:
    import lightgbm as lgb
    from sklearn.model_selection import train_test_split
    from sklearn.metrics import roc_auc_score, precision_score, recall_score, confusion_matrix
    HAS_LGB = True
except ImportError:
    HAS_LGB = False


def generate_synthetic_light_curve(has_transit: bool, n_points: int = 200, seed: int | None = None) -> tuple:
    """Generate (time, flux) with optional transit dip."""
    rng = np.random.default_rng(seed)
    time = np.linspace(0, 100, n_points)
    flux = 1.0 + 0.001 * (rng.random(n_points) - 0.5)
    if has_transit:
        period = 10.0 + rng.random() * 15.0
        depth = 0.005 + rng.random() * 0.02
        phase = (time % period) / period
        in_dip = (phase >= 0.48) & (phase <= 0.52)
        flux[in_dip] -= depth
        flux += 0.0005 * (rng.random(n_points) - 0.5)
    return time, flux


def extract_features_for_training(time: np.ndarray, flux: np.ndarray, period: float | None = None) -> np.ndarray:
    """Feature vector in fixed order for training."""
    from ml.preprocess import extract_features
    if period is None or period <= 0:
        from ml.period_estimation import estimate_period_lombscargle
        est = estimate_period_lombscargle(time, flux)
        period = est.get("period", 1.0)
    f = extract_features(time, flux, period)
    return np.array([
        f.get("flux_std", 0),
        f.get("flux_min", 1),
        f.get("depth", 0),
        f.get("flux_range", 0),
        f.get("phase_fold_std", 0),
        f.get("phase_fold_min", 1),
    ], dtype=np.float32)


def main():
    if not HAS_LGB:
        print("Install lightgbm and scikit-learn to run training.")
        return
    n_positive = 800
    n_negative = 800
    X_list, y_list = [], []
    for i in range(n_positive):
        t, f = generate_synthetic_light_curve(True, seed=i)
        period = 10.0 + (i % 20)  # known period for feature
        X_list.append(extract_features_for_training(t, f, period))
        y_list.append(1)
    for i in range(n_negative):
        t, f = generate_synthetic_light_curve(False, seed=n_positive + i)
        X_list.append(extract_features_for_training(t, f, None))
        y_list.append(0)
    X = np.array(X_list)
    y = np.array(y_list)
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    train_data = lgb.Dataset(X_train, label=y_train)
    params = {
        "objective": "binary",
        "metric": "auc",
        "num_leaves": 31,
        "learning_rate": 0.05,
        "feature_fraction": 0.8,
        "verbosity": -1,
    }
    model = lgb.train(
        params,
        train_data,
        num_boost_round=150,
        valid_sets=[lgb.Dataset(X_test, label=y_test)],
        callbacks=[lgb.early_stopping(20, verbose=False)],
    )
    pred = model.predict(X_test)
    auc = roc_auc_score(y_test, pred)
    pred_bin = (pred >= 0.5).astype(int)
    print(f"AUC: {auc:.4f}")
    print(f"Precision: {precision_score(y_test, pred_bin):.4f}")
    print(f"Recall: {recall_score(y_test, pred_bin):.4f}")
    print("Confusion matrix:", confusion_matrix(y_test, pred_bin))
    out_dir = _backend / "models"
    out_dir.mkdir(parents=True, exist_ok=True)
    model.save_model(str(out_dir / "lgb_exoplanet.txt"))
    print(f"Model saved to {out_dir / 'lgb_exoplanet.txt'}")


if __name__ == "__main__":
    main()
