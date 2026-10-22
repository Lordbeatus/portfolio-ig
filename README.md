# LORDBEATUS // Stark Malibu Workshop (3D Interactive Portfolio)

An interactive 3D engineering workshop portfolio for **Daniel Thomas (`Lordbeatus`)**, inspired by **Tony Stark's Malibu Garage** and spatial game-like portfolios such as [chrisp.design](https://www.chrisp.design/).

Built with **Next.js (App Router)**, **Three.js / React Three Fiber**, **Spline 3D (`@splinetool/react-spline`)**, **Tailwind CSS**, and **OpenVision-style MediaPipe Computer Vision Hand Tracking**.

## Key Features

### 1. Game-Like 3D Malibu Garage (`src/components/StarkGarage3D.tsx`)
Instead of a traditional scrolling page, the site opens inside an interactive 3D workshop with **7 clickable engineering stations** and smooth camera fly-to transitions:
- **MK-I CORE (`reactor`)** — Arc Reactor Pedestal: Identity, bio, and full-stack + spatial engineering arsenal
- **CV-OPTICS (`gauntlet`)** — Mark XLII Gauntlet Rig: **Spoken Signs** (real-time ASL-to-English CV & TTS) & **OpenVision** (browser Vision Pro spatial computing)
- **MYTHOS-OS (`helmet`)** — Acoustic HUD Helmet Bay: **Mythos Dream** psychoacoustic headphones (firmware, CAD enclosures, thermal cooling, simulations) & **JARVIS** voice agent
- **AI-CORE (`server`)** — Toasty Neural Server Rack: **Toasty-Analytics** (4 microservices, CodeBERT neural code grading, federated meta-learning, Kafka, Istio, OpenTelemetry) & **Chewbacca** multi-agent CLI
- **QUANT-HUD (`trading`)** — Starwatcher Holo-Table: **Starwatcher** quantitative trading/backtesting engine & **Toastimer / Toastchain** (`app.toastimer.me`)
- **EDTECH-BAY (`workbench`)** — Fabrication Workbench: **FastScribe** (YouTube-to-Anki Whisper + GPT-4 pipeline), **Classroom Genie**, **Olympiad Trainer** (`Olympiadsarefun.com`), and **USCTTS** (`usctts.com`)
- **COMMS-ARRAY (`comms`)** — Stark Comms Terminal: GitHub, LinkedIn, Discord, and one-click Recruiter Dossier

### 2. Apple Vision Pro Computer Vision Hand Tracking (`src/components/VisionCV.tsx`)
Adapted from Daniel's **OpenVision** spatial computing engine:
- **21-Landmark MediaPipe Hand Rig** rendered with a Stark holographic HUD skeleton & repulsor pinch reticle
- **Pinch & Drag Spatial Windows**: Pinch thumb + index finger over any floating HUD window (`src/components/SpatialWindow.tsx`) to grab and move it across the screen
- **Two-Hand Spatial Zoom & Orbit**: Pinch with **both hands** and spread/bring them together to zoom out to see the entire workshop or twist to orbit the 3D garage camera
- **Dual Open Palms**: Hold both palms open briefly to immediately zoom out to the full Malibu Garage overview

### 3. Live Spline 3D Runtime (`src/components/SplineScene.tsx`)
- Toggle **◈ SPLINE 3D** in the top HUD bar to switch between the procedural Three.js Stark Garage and a live interactive `.splinecode` scene powered by `@splinetool/react-spline`
- Click the **⚙** button next to the Spline toggle (or set `NEXT_PUBLIC_SPLINE_SCENE_URL` in `.env.local`) to load any custom Spline export URL on the fly

### 4. J.A.R.V.I.S. 3D Workshop Navigator (`src/components/Jarvis.tsx`)
- Voice (Web Speech API) + text command console with synthesized spoken telemetry
- Flies the 3D camera directly to any station, toggles Vision Pro hand tracking, zooms out to the full garage, or opens the Recruiter Dossier

### 5. Simplified Recruiter Mode & Printable Dossier
- Click **SIMPLE RECRUITER VIEW** in the top bar for an instant clean light-mode overview, or visit **`/recruiter`** (`src/app/recruiter/page.tsx`) for a printable one-page executive dossier.

## Quick Start

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build + TypeScript verification
```
