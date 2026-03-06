# Demo Walkthrough

## 1. Start the backend

```bash
cd exoplanet-ai/backend
python -m venv venv
# Windows: venv\Scripts\activate
# Mac/Linux: source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Leave this terminal open. API docs: http://127.0.0.1:8000/docs

## 2. (Optional) Train the ML model for >95% AUC

In another terminal, from `exoplanet-ai/backend`:

```bash
# with venv activated
python -m training.train
```

This generates synthetic light curves, trains a LightGBM classifier, and saves `models/lgb_exoplanet.txt`. The predictor will use this model when available.

## 3. Start the frontend

```bash
cd exoplanet-ai/frontend
npm install
npm run dev
```

Open http://localhost:3000

## 4. Walkthrough

- **Home**: Landing page with links to Dashboard and Light Curve Analyzer.
- **Dashboard**: Lists demo exoplanets (Kepler-22b, TRAPPIST-1e, etc.) from `GET /api/get-demo-data`. Click a planet to see its details and a simulated light curve on the Results page.
- **Light Curve Analyzer**:
  - Click **Upload CSV** and select a file with `time,flux` columns (e.g. `data/sample_lightcurve.csv`).
  - The chart shows the light curve.
  - Click **Detect exoplanet**. The app calls:
    - `POST /api/predict-exoplanet` — ML probability and explanation
    - `POST /api/estimate-period` — Lomb-Scargle period
    - `POST /api/habitabilty-score` — 0–100 score
  - Results appear below the chart.
- **About**: Short description of transit photometry, habitability, and explainable AI.

## 5. Docker (optional)

From project root:

```bash
docker-compose -f docker/docker-compose.yml up --build
```

Frontend: http://localhost:3000  
Backend: http://localhost:8000
