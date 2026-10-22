# LORD BEATUS // Stark OS Portfolio

Tony Stark-themed developer portfolio for **Daniel Thomas (Lordbeatus)** — Next.js + Tailwind + Three.js, with an optional Spline scene, a rule-based JARVIS navigator, and a clean recruiter briefing.

## Quick start

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # verify before pushing
```

## Edit your content (one file)

All copy renders from **`src/data/profile.ts`** — name, bio, skills, projects, experience, contact links. Replace the placeholder project card with your private-repo highlights once GitHub is connected.

## JARVIS (no API key)

Rule-based + fully offline: typed commands and browser voice input (Chrome/Edge) scroll to sections and reply with speech synthesis:

- `show projects` · `take me to skills` · `experience` · `contact` · `recruiter mode` · `hello`

Lives in `src/components/Jarvis.tsx`. No backend, no costs.

## 3D

- Default hero: built-in Three.js arc reactor (`src/components/ArcReactor.tsx`)
- Optional Spline: set `NEXT_PUBLIC_SPLINE_SCENE_URL` in `.env.local` (see `.env.example`) — `src/components/SplineScene.tsx` swaps it in automatically.

## Recruiter version

- Toggle **RECRUITER MODE** in the nav for a clean light theme (hides the 3D + JARVIS).
- Printable route: **`/recruiter`** — summary, skills, projects, experience, contact + Print/PDF button.

## Push to GitHub

This folder is already cloned from `https://github.com/Lordbeatus/portfolio-ig.git`. When ready:

```bash
git add -A
git commit -m "Stark OS portfolio v1"
git push -u origin main
```

(If push asks for auth, use GitHub Desktop or `gh auth login` — I can't push with your credentials from here.)
