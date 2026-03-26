# How to Present: AI-Powered Exoplanet Detection & Habitability Analyzer

Use this as a cheat sheet when presenting the project to judges or an audience.

---

## 1. What We Used (Tech Stack)

### Frontend
| Technology | Purpose |
|------------|--------|
| **Next.js 14** | React framework, routing, server-side rendering |
| **React 18** | UI components and state |
| **TypeScript** | Type-safe JavaScript |
| **Tailwind CSS** | Styling (dark theme, neon-blue accents) |
| **Framer Motion** | Animations and transitions |
| **Recharts** | Light curve and data charts |
| **Three.js + React Three Fiber + Drei** | 3D visualizations (orbits, galaxy view, parameter space) |

### Backend
| Technology | Purpose |
|------------|--------|
| **FastAPI** | REST API, CORS, automatic docs |
| **Python 3.10+** | Backend logic |
| **NumPy, SciPy, Pandas** | Data processing and Lomb-Scargle period estimation |
| **Scikit-learn, LightGBM** | ML model for exoplanet detection (binary classification) |
| **Pydantic** | Request/response validation |

### Data & Science
- **Transit photometry**: brightness dips when a planet passes in front of the star
- **Lomb-Scargle**: period estimation from unevenly sampled time series
- **Habitability**: score from orbital distance (Kepler’s law), planet radius, and simple stellar flux

---

## 2. Project Structure (One-Liner for Judges)

*“We have a **Next.js frontend** for the UI and 3D viz, a **FastAPI backend** for uploads and ML inference, and an **ML pipeline** for detection, period estimation, and habitability scoring.”*

```
exoplanet-ai/
├── frontend/     → Next.js, 3D (Three.js), charts (Recharts), animations (Framer Motion)
├── backend/      → FastAPI, ML (LightGBM/scikit-learn), Lomb-Scargle, habitability
├── data/         → Sample light curves, datasets
├── docker/       → Container setup for deployment
└── README.md     → Setup and API docs
```

---

## 3. Features to Demo (In Order)

1. **Home** – Hero, tech stack, 3D parameter-space preview, CTAs.
2. **Dashboard** – List of demo exoplanets (Kepler-22b, TRAPPIST-1e, etc.), sorting, 3D viz.
3. **Planet detail (Results)** – Click a planet → orbit view, orbital parameters, 3D dataset viz, **Habitability Analysis**, **AI Planet Verdict**, simulated light curve, “More about habitability.”
4. **Light Curve Analyzer** – Upload CSV (time, flux) → run detection → see probability, period, habitability from the curve (works in demo mode if backend is offline).
5. **3D Explorer** – Toggle Galaxy vs Star System view; click planets for info panel; habitability and AI verdict.
6. **Compare** – Side-by-side comparison of selected planets.
7. **About** – Science background and glossary.

---

## 4. Talking Points for Judges

- **Problem**: “We detect exoplanets from stellar light curves using the transit method and score how habitable they might be.”
- **ML**: “We use a binary classifier (LightGBM) plus Lomb-Scargle for period; the frontend can run a demo when the backend is offline.”
- **Explainability**: “We show transit dips on the light curve, habitability breakdown (orbital zone + planet size), and an **AI Verdict** with gravity, temperature, water probability, and a short explanation.”
- **3D**: “We have a 3D parameter-space view (Period, Radius, Habitability), an orbit view (star + planet), and a full 3D Explorer with galaxy and star-system modes.”
- **UX**: “Dark theme, neon-blue accents, Framer Motion animations, keyboard shortcuts (e.g. Esc, ? for help), responsive layout.”

---

## 5. How to Run (Quick)

**Frontend only (demo mode):**
```bash
cd exoplanet-ai/frontend
npm install
npm run dev
```
→ Open **http://localhost:3000**

**With backend (full ML):**
```bash
# Terminal 1 – Backend
cd exoplanet-ai/backend
python -m venv venv
venv\Scripts\activate   # Windows
pip install -r requirements.txt
uvicorn main:app --reload --port 8000

# Terminal 2 – Frontend
cd exoplanet-ai/frontend
npm run dev
```
→ Frontend: **http://localhost:3000**  
→ API docs: **http://localhost:8000/docs**

---

## 6. One-Slide Summary (Copy-Paste)

**AI-Powered Exoplanet Detection & Habitability Analyzer**

- **Stack:** Next.js, TypeScript, Tailwind, Framer Motion, Recharts, Three.js (R3F) | FastAPI, Python, LightGBM, SciPy (Lomb-Scargle).
- **Features:** Light curve upload & visualization, ML-based transit detection, period estimation, habitability score (0–100), AI Verdict (gravity, temperature, water probability), 3D orbit and parameter-space views, 3D Explorer (galaxy/system), planet comparison, demo mode without backend.
- **Goal:** Production-ready MVP for detecting exoplanets from light curves and explaining habitability for a hackathon demo.

---

Good luck with your presentation.
