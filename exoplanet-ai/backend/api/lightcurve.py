"""
Light curve upload and parsing.
"""
import io
import csv
from fastapi import APIRouter, File, UploadFile, HTTPException
from pydantic import BaseModel
import numpy as np

router = APIRouter()


class LightCurveResponse(BaseModel):
    time: list[float]
    flux: list[float]
    n_points: int
    message: str


@router.post("/upload-lightcurve", response_model=LightCurveResponse)
async def upload_lightcurve(file: UploadFile = File(...)):
    """Parse uploaded CSV with columns time, flux (or time, FLUX)."""
    if not file.filename or not file.filename.lower().endswith((".csv", ".txt")):
        raise HTTPException(400, "File must be CSV or TXT")
    raw = await file.read()
    try:
        text = raw.decode("utf-8").strip()
    except Exception:
        raise HTTPException(400, "File must be UTF-8 text")
    reader = csv.DictReader(io.StringIO(text))
    rows = list(reader)
    if not rows:
        raise HTTPException(400, "CSV has no data rows")
    # Accept time/flux or TIME/FLUX
    keys = [k.strip().lower() for k in rows[0].keys()]
    time_key = "time" if "time" in keys else next((k for k in keys if "time" in k), None)
    flux_key = "flux" if "flux" in keys else next((k for k in keys if "flux" in k), None)
    if not time_key or not flux_key:
        time_key = list(rows[0].keys())[0].strip().lower()
        flux_key = list(rows[0].keys())[1].strip().lower() if len(rows[0]) >= 2 else None
    if not flux_key:
        raise HTTPException(400, "CSV must have time and flux columns")
    orig_keys = list(rows[0].keys())
    time_col = next((k for k in orig_keys if k.strip().lower() == time_key), orig_keys[0])
    flux_col = next((k for k in orig_keys if k.strip().lower() == flux_key), orig_keys[1] if len(orig_keys) > 1 else orig_keys[0])
    time, flux = [], []
    for r in rows:
        try:
            t = float(r[time_col].strip())
            f = float(r[flux_col].strip())
            time.append(t)
            flux.append(f)
        except (ValueError, KeyError):
            continue
    if len(time) < 10:
        raise HTTPException(400, "Need at least 10 valid (time, flux) points")
    return LightCurveResponse(time=time, flux=flux, n_points=len(time), message="OK")
