# What We Used to Build Exoplanet AI

A simple explanation of the technologies and tools used in this project.

---

## 1. **HTML (HyperText Markup Language)**

- **What it is:** The structure of the webpage — headings, paragraphs, buttons, links, sections.
- **What we used it for:** All the pages (Home, Dashboard, Light Curve Analyzer, Results, Explainable AI, About), navigation bar, forms, and the language picker.
- **Version:** HTML5 (modern web standard).

---

## 2. **CSS (Cascading Style Sheets)**

- **What it is:** The look and layout — colors, fonts, spacing, animations.
- **What we used it for:**
  - **Dark space theme** — dark background, cyan/teal accents, starfield effect.
  - **Layout** — Flexbox and CSS Grid for navigation and card grids.
  - **Animations** — fade-in, shimmer on title, floating orbit, smooth page transitions.
  - **Glassmorphism** — semi-transparent, blurred cards and nav bar.
  - **Responsive design** — works on different screen sizes (e.g. `clamp()` for font sizes).
- **Version:** CSS3 (variables, gradients, `backdrop-filter`, `@keyframes`).

---

## 3. **JavaScript (vanilla — no framework)**

- **What it is:** The behavior — what happens when you click buttons, change pages, or load data.
- **What we used it for:**
  - **Single-page app (SPA)** — switching between Home, Dashboard, Analyzer, etc. without reloading.
  - **Light curve charts** — drawing graphs from data (time vs brightness).
  - **Orbit animation** — elliptical orbit with a moving planet (Canvas).
  - **Multi-language (i18n)** — English, Hindi, Spanish via a simple translation object.
  - **Sample data** — different types of fake light curves (Hot Jupiter, Earth-like, etc.).
  - **Export & share** — download report as file, copy link to clipboard.
- **No React, Vue, or Angular** — plain JavaScript only.

---

## 4. **Canvas API (HTML5 Canvas)**

- **What it is:** A way to draw graphics (lines, shapes, animations) inside the browser.
- **What we used it for:**
  - **Light curve graphs** — drawing the flux (brightness) vs time line charts.
  - **Elliptical orbit** — star at one focus, planet moving along the ellipse on Home and Results pages.

---

## 5. **Google Fonts (from the web)**

- **What it is:** Free fonts loaded from Google’s servers.
- **What we used:**
  - **Orbitron** — for headings (sci-fi look).
  - **Exo 2** — for body text (clean, readable).
- **Note:** If you’re offline, the browser will use a fallback font (e.g. system sans-serif).

---

## 6. **Browser APIs (built into the browser)**

- **localStorage** — save the user’s language choice (English/Hindi/Spanish) so it persists on refresh.
- **Blob & URL.createObjectURL** — create and download the “Export report” text file.
- **navigator.share** — native share dialog on supported devices.
- **navigator.clipboard** — copy share text to clipboard when Share is used.

---

## What we did **not** use

- **No backend framework** — no Node.js, no Django, no FastAPI for the app itself. Everything runs in the browser.
- **No database** — planet and sample data are stored in JavaScript arrays in the code.
- **No external chart library** — charts are drawn with Canvas, not Chart.js or D3.
- **No build tool** — no Webpack, Vite, or npm build. Just one `index.html` file (and optional `RUN.bat`).

---

## Optional: how you run it

- **RUN.bat** — a Windows batch file that starts Python’s built-in **http.server** (so you can open the site as `http://127.0.0.1:8080`).
- **Python** — only needed if you use `RUN.bat`. The app itself does not use Python; you can also open `index.html` directly in the browser.

---

## Summary in one sentence

**Exoplanet AI is built with HTML (structure), CSS (styling and animations), and vanilla JavaScript (logic, charts, and orbits using the Canvas API), with optional Google Fonts and no backend or database.**
