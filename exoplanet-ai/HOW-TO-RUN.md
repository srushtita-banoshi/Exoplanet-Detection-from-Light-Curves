# How to Run Exoplanet AI (Fix "Connection Failed")

**"Connection failed"** usually means the **backend** (Python API) is not running. The frontend needs it for API calls. Follow one of the options below.

---

## Option A — Easiest: Use the run script (Windows)

1. Open **File Explorer** and go to the **exoplanet-ai** folder.
2. **Double-click `RUN-EVERYTHING.bat`**.
3. Two black windows will open (backend and frontend). **Do not close them.**
4. Your browser will open to **http://localhost:3000** after a few seconds. If it doesn’t, open that link yourself.

If you get errors in the backend window (e.g. "Python not found"), do **Option B** and install Python first.

---

## Option B — Step by step (any OS)

You must run **two** things: **backend first**, then **frontend**.

### Step 1: Start the backend (Terminal 1)

1. Open **Command Prompt** or **PowerShell**.
2. Go to the backend folder:
   ```bash
   cd path\to\exoplanet-ai\backend
   ```
   (Replace `path\to` with your real path, e.g. `C:\Users\YourName\Desktop\ambedkar clg\exoplanet-ai\backend`.)

3. Create a virtual environment (only first time):
   ```bash
   python -m venv venv
   ```

4. Activate it:
   - **Windows (CMD):** `venv\Scripts\activate`
   - **Windows (PowerShell):** `venv\Scripts\Activate.ps1`
   - **Mac/Linux:** `source venv/bin/activate`

5. Install dependencies (only first time):
   ```bash
   pip install -r requirements.txt
   ```

6. Start the API server:
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```
   Keep this window open. You should see something like: `Uvicorn running on http://0.0.0.0:8000`.

### Step 2: Start the frontend (Terminal 2)

1. Open a **second** Command Prompt or PowerShell.
2. Go to the frontend folder:
   ```bash
   cd path\to\exoplanet-ai\frontend
   ```

3. Install dependencies (only first time):
   ```bash
   npm install
   ```

4. Start the frontend:
   ```bash
   npm run dev
   ```
   Keep this window open. You should see: `Ready on http://localhost:3000`.

### Step 3: Open the app

In your browser go to: **http://localhost:3000**

---

## If you still see "Connection failed"

| Check | What to do |
|-------|------------|
| Backend not running | Make sure the first terminal is still open and shows "Uvicorn running on http://0.0.0.0:8000". If you closed it, run Step 1 again. |
| Frontend not running | Make sure the second terminal shows "Ready on http://localhost:3000". If not, run Step 2 again. |
| Wrong URL | Use **http://localhost:3000** (frontend), not http://localhost:8000 (that’s only the API). |
| Port in use | If 8000 or 3000 is busy, close the other app using that port, or change the port in the commands. |
| Python not found | Install Python 3.10+ from [python.org](https://www.python.org/downloads/) and make sure "Add Python to PATH" is checked. |
| Node/npm not found | Install Node.js from [nodejs.org](https://nodejs.org/). |

---

## Quick test: Is the backend running?

Open in browser: **http://localhost:8000/docs**  
If you see the API documentation page, the backend is running. Then use **http://localhost:3000** for the app.
