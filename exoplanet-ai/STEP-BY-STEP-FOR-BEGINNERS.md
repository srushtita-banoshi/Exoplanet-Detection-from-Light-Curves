# Exoplanet AI — Step-by-Step Guide (Complete Beginner)

Follow these steps **in order**. Do not skip any step.

---

## PART 1: Install Python (do this only if you don’t have Python)

### Step 1.1 — Check if Python is installed

1. Press the **Windows key** on your keyboard.
2. Type **cmd** and press **Enter**. A black window (Command Prompt) will open.
3. Type exactly: **python --version** and press **Enter**.
4. If you see something like **Python 3.10** or **Python 3.11** → Python is installed. Go to **PART 2**.
5. If you see **"python is not recognized"** or an error → you need to install Python. Continue to Step 1.2.

### Step 1.2 — Download Python

1. Open your browser (Chrome, Edge, etc.).
2. Go to: **https://www.python.org/downloads/**
3. Click the big yellow button that says **"Download Python 3.x.x"**.
4. When the file is downloaded, open it (double-click the downloaded file).

### Step 1.3 — Install Python

1. On the first screen, **check the box** that says **"Add python.exe to PATH"** (at the bottom). This is important.
2. Click **"Install Now"**.
3. Wait until it says **"Setup was successful"**, then click **"Close"**.
4. **Close the black Command Prompt window** and open a **new** one (Windows key → type **cmd** → Enter). Then go to **PART 2**.

---

## PART 2: Install Node.js (do this only if you don’t have Node)

### Step 2.1 — Check if Node is installed

1. Open Command Prompt (Windows key → type **cmd** → Enter).
2. Type exactly: **node --version** and press **Enter**.
3. If you see something like **v20.x.x** → Node is installed. Go to **PART 3**.
4. If you see **"node is not recognized"** or an error → you need to install Node. Continue to Step 2.2.

### Step 2.2 — Download and install Node.js

1. Open your browser.
2. Go to: **https://nodejs.org/**
3. Download the **LTS** version (green button).
4. Run the downloaded file and click **Next** through the installer. You can leave all options as default.
5. When it finishes, click **Finish**.
6. **Close Command Prompt** and open a **new** one. Then go to **PART 3**.

---

## PART 3: Find your Exoplanet AI folder

### Step 3.1 — Open the folder

1. Press the **Windows key** and type **File Explorer** (or click the folder icon on the taskbar).
2. Go to where you saved the project. For example:
   - **Desktop** → then open the folder **ambedkar clg** → then open **exoplanet-ai**
   - Or wherever your **exoplanet-ai** folder is.
3. You must see inside it:
   - a folder named **backend**
   - a folder named **frontend**
   - a file named **FIRST-TIME-SETUP.bat**
   - a file named **RUN-EVERYTHING.bat**

If you see these, you are in the right place.

---

## PART 4: First-time setup (do this only ONCE)

### Step 4.1 — Run the setup file

1. Stay in the **exoplanet-ai** folder in File Explorer.
2. Find the file **FIRST-TIME-SETUP.bat**.
3. **Double-click** **FIRST-TIME-SETUP.bat**.
4. A black window will open and text will scroll. This is normal. It is installing everything the project needs.
5. Wait until it says **"Backend setup done"** and **"Frontend setup done"** and then **"Now double-click RUN-EVERYTHING.bat"**.
6. If it says **"Press any key to continue"**, press any key. The window will close.
7. If you see an error like **"Python not found"** → go back to **PART 1** and install Python, then run **FIRST-TIME-SETUP.bat** again.
8. If you see **"Node not found"** → go back to **PART 2** and install Node.js, then run **FIRST-TIME-SETUP.bat** again.

You only need to do **PART 4** once. Next time you can start from **PART 5**.

---

## PART 5: Run the app (do this every time you want to use it)

### Step 5.1 — Start the app

1. Open the **exoplanet-ai** folder in File Explorer (same as in Part 3).
2. **Double-click** **RUN-EVERYTHING.bat**.
3. **Two black windows** will open:
   - One is called **"Backend (port 8000)"**.
   - One is called **"Frontend (port 3000)"**.
4. **Do not close these two windows.** If you close them, the app will stop.
5. Wait about 10–15 seconds. You will see text moving in both windows. Wait until the frontend window shows something like **"Ready on http://localhost:3000"**.

### Step 5.2 — If it says "Run FIRST-TIME-SETUP.bat first"

- You skipped Part 4. Go back to **PART 4** and double-click **FIRST-TIME-SETUP.bat**. When it finishes, try **RUN-EVERYTHING.bat** again.

### Step 5.3 — Open the website in your browser

1. Open your browser (Chrome, Edge, Firefox, etc.).
2. Click the address bar at the top (where you type website addresses).
3. Type exactly: **http://localhost:3000**
4. Press **Enter**.
5. You should see the **Exoplanet AI** website (dark background, "AI-Powered Exoplanet" text).

**If the browser did not open by itself:**  
After RUN-EVERYTHING.bat runs, it may try to open the browser. If it doesn’t, do Step 5.3 yourself: open the browser and go to **http://localhost:3000**.

---

## PART 6: Use the website

1. **Home** — You are here when you first open http://localhost:3000. You can click **Dashboard** or **Light Curve Analyzer**.
2. **Dashboard** — Shows a list of planets. Click any planet to see its details.
3. **Light Curve Analyzer** — Lets you upload a file and run detection. You can try the sample file in the **data** folder: **exoplanet-ai → data → sample_lightcurve.csv**.
4. **About** — Short explanation of the project.

When you are done, you can close the browser. To **stop the app**, close the **two black windows** (Backend and Frontend).

---

## Quick summary

| When | What to do |
|------|------------|
| **First time ever** | 1) Install Python (Part 1) and Node (Part 2) if needed. 2) Double-click **FIRST-TIME-SETUP.bat** (Part 4). |
| **Every time you want to use the app** | 1) Double-click **RUN-EVERYTHING.bat** (Part 5). 2) Keep both black windows open. 3) Open browser and go to **http://localhost:3000**. |

---

## If something goes wrong

| Problem | What to do |
|--------|------------|
| "python is not recognized" | Install Python (Part 1). Tick **"Add python.exe to PATH"** when installing. |
| "node is not recognized" | Install Node.js (Part 2). |
| "Run FIRST-TIME-SETUP.bat first" | Do Part 4: double-click **FIRST-TIME-SETUP.bat** and wait until it finishes. |
| "Connection failed" on the website | Make sure you ran **RUN-EVERYTHING.bat** and that **both** black windows are still open. Then open **http://localhost:3000** (with 3000, not 8000). |
| Page doesn’t load | Wait 10–15 seconds after RUN-EVERYTHING.bat, then try **http://localhost:3000** again. |
| I don’t see the exoplanet-ai folder | Remember where you saved or downloaded the project (e.g. Desktop → ambedkar clg → exoplanet-ai). |

If you follow these steps in order, the app should run. If you get a new error, copy the exact message and ask for help with that message.
