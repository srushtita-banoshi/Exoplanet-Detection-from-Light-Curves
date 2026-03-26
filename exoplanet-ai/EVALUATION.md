# Project Evaluation & Accuracy

This document describes how we evaluate the **entire project** and what metrics we use for each component.

---

## 1. What “entire accuracy” means here

The project has **three main parts** that can be evaluated:

| Component | Type | Evaluation metric(s) |
|-----------|------|----------------------|
| **Exoplanet detection** | ML (binary classifier) | AUC, Precision, Recall, F1, Confusion matrix |
| **Period estimation** | Signal processing (Lomb–Scargle) | Period error vs ground truth (when labels exist) |
| **Habitability scoring** | Deterministic formula | No accuracy; validated by physics (orbital distance, size) |

There is **no single number** that is “the entire accuracy of the project.” We report **metrics per component** and, optionally, a **pipeline-level** summary.

---

## 2. Exoplanet detection (primary ML metric)

**Metric:** Binary classification — “Does this light curve contain a transit?”

| Metric | Meaning | Target |
|--------|--------|--------|
| **AUC** | Area Under ROC Curve; overall ranking quality | **> 0.95** |
| **Precision** | Of predicted positives, how many are correct | High |
| **Recall** | Of true positives, how many we detect | High |
| **F1** | Harmonic mean of precision and recall | High |
| **Confusion matrix** | TP, TN, FP, FN counts | — |

**How to get the numbers:** Run training (uses 80/20 train/test split on synthetic data):

```bash
cd exoplanet-ai/backend
python -m training.train
```

Example output:

```
AUC: 0.97xx
Precision: 0.9xxx
Recall: 0.9xxx
Confusion matrix: [[...] [...]]
```

**Reported “detection accuracy”:** Use **AUC** as the main number (e.g. “Detection AUC: 97%”). You can also say “Precision and Recall ~95%” if your run shows that.

---

## 3. Period estimation

**Metric:** Error between estimated period and ground-truth period (when available).

- **No train/test** in the codebase; Lomb–Scargle is a standard method.
- For a **single curve** with known period:  
  **Relative period error** = `|period_estimated - period_true| / period_true`  
  (e.g. 0.05 = 5% error.)
- For **whole project** we could report mean absolute relative error (MARE) or RMSE over a labeled test set if we had one.

**Current status:** Period is used inside the pipeline; we don’t yet log period error on a dataset. So “entire project” period accuracy is **not yet a single number** unless you evaluate on labeled data and aggregate (e.g. mean MARE).

---

## 4. Habitability scoring

**Metric:** None in the ML sense.

- Habitability is a **deterministic formula** (orbital distance + planet size, no learning).
- It’s “accurate” in the sense that the **physics is correct** (Kepler’s law, habitable zone, etc.), not in the sense of “model accuracy vs labels.”

So we **do not** report an “accuracy” for habitability; we describe the **method** (formula and inputs).

---

## 5. Entire project — summary metrics (what to report)

Use these to describe **“entire accuracy of the whole project”**:

1. **Detection (main):**  
   **AUC** (e.g. “**Detection AUC: 97%**”) and optionally **Precision / Recall** from `python -m training.train`.

2. **Period (if you add evaluation):**  
   **Mean relative period error** or **RMSE** on a test set with known periods.

3. **Habitability:**  
   **No accuracy metric** — “Habitability is a physics-based score (0–100), not a trained model.”

**One-sentence summary:**  
*“We evaluate the project with **detection AUC** (target >95%) and **precision/recall** for the ML component; **period estimation** can be evaluated by relative error on labeled data; **habitability** is a deterministic score, so we don’t report an accuracy for it.”*

---

## 6. Optional: single “pipeline” metric

If judges want **one number** for the whole pipeline:

- **Option A:** Use **Detection AUC** as the main “project accuracy” (e.g. “Our project’s primary accuracy metric is **detection AUC ~97%**”).
- **Option B:** If you have a labeled test set with **known planet / period**:
  - Run: detection → period estimation → habitability.
  - Define **pipeline accuracy** = fraction of test curves where (detection correct AND period within e.g. 10% of truth). Then report that as “end-to-end accuracy.”

---

## 7. How to get your numbers (quick)

```bash
cd exoplanet-ai/backend
python -m training.train
```

Use the printed **AUC**, **Precision**, and **Recall** as your **evaluation metrics** for the project. For “entire accuracy,” lead with **AUC** and add precision/recall as supporting metrics.
