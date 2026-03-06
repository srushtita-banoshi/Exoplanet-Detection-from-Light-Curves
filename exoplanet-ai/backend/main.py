"""
FastAPI application for Exoplanet AI — detection & habitability.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api import lightcurve, prediction, demo

app = FastAPI(
    title="Exoplanet AI API",
    description="ML-powered exoplanet detection and habitability scoring",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(lightcurve.router, prefix="/api", tags=["lightcurve"])
app.include_router(prediction.router, prefix="/api", tags=["prediction"])
app.include_router(demo.router, prefix="/api", tags=["demo"])


@app.get("/")
def root():
    return {"message": "Exoplanet AI API", "docs": "/docs"}


@app.get("/health")
def health():
    return {"status": "ok"}
