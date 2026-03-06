# AI-Powered Exoplanet Detection and Habitability Analyzer

A hackathon-ready MVP that detects exoplanets from stellar light curve data using transit photometry and scores habitability.

## Architecture

```
exoplanet-ai/
├── frontend/          # Next.js + Tailwind + ShadCN + Recharts
├── backend/           # FastAPI + ML pipeline
│   ├── main.py
│   ├── api/
│   ├── ml/
│   ├── models/
│   └── training/
├── data/              # Datasets, sample light curves
├── notebooks/         # EDA, experiments
├── docker/            # Dockerfiles, compose
└── README.md
```

## Features

- **Light Curve Visualizer** — Upload or load light curves, visualize brightness over time
- **Exoplanet Detector** — ML model predicts transit probability (>95% AUC target)
- **Period Estimation** — Lomb-Scargle for orbital period
- **Habitability Scoring** — 0–100 score from orbit, stellar temp, planet size
- **Explainable AI** — Highlight transit dips, confidence, attention
- **Dashboard** — Detected planets, probability, period, habitability
- **Demo Mode** — Instant visualization of famous exoplanets (Kepler-22b, TRAPPIST-1e, etc.)

## Quick Start

### Backend (FastAPI)

```bash
cd exoplanet-ai/backend
python -m venv venv
# Windows: venv\Scripts\activate
# Mac/Linux: source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

API docs: http://127.0.0.1:8000/docs

### Frontend (Next.js)

```bash
cd exoplanet-ai/frontend
npm install
npm run dev
```

Open http://localhost:3000 (frontend proxies `/api/*` to backend on port 8000).

### Train ML model (optional, for >95% AUC)

```bash
cd exoplanet-ai/backend && python -m training.train
```

### Docker

From repo root:

```bash
docker-compose -f docker/docker-compose.yml up --build
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/upload-lightcurve` | Upload light curve CSV/JSON |
| POST | `/predict-exoplanet` | Run ML detection on light curve |
| POST | `/estimate-period` | Lomb-Scargle period estimation |
| POST | `/habitabilty-score` | Compute habitability 0–100 |
| GET | `/get-demo-data` | Get demo planets (Kepler-22b, etc.) |

## ML Pipeline

- **Preprocessing**: Normalize flux, detrend, optional noise reduction
- **Features**: Statistical (std, min, depth), periodogram peak, phase-folded stats
- **Model**: LightGBM classifier (baseline); optional CNN/LSTM for time-series
- **Evaluation**: AUC, precision, recall, confusion matrix
- **Explainability**: Feature importance, transit dip highlighting

## Tech Stack

- **Frontend**: Next.js 14, Tailwind CSS, ShadCN UI, Recharts
- **Backend**: FastAPI, Python 3.10+
- **ML**: Scikit-learn, LightGBM, SciPy (Lomb-Scargle)
- **Database**: SQLite (optional PostgreSQL)
- **Deploy**: Docker, AWS/GCP-ready

## License

MIT. Built for hackathon demo.
