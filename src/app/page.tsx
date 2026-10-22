"use client";

import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SplineScene from "@/components/SplineScene";
import Jarvis, { speakJarvis } from "@/components/Jarvis";
import SpatialWindow, { type SpatialWindowState } from "@/components/SpatialWindow";
import { useVisionCV, type HandSide } from "@/components/VisionCV";
import {
  profile,
  type GarageStation,
  type JarvisTarget,
  type ProjectItem,
  type StationId,
} from "@/data/profile";

const INITIAL_WINDOWS: SpatialWindowState[] = [
  {
    id: "inspector",
    title: "Arc Reactor Pedestal · Identity & Core",
    subtitle: "STATION TELEMETRY // PINCH OR DRAG TO MOVE",
    accent: "#00d8ff",
    x: 28,
    y: 78,
    width: 430,
    zIndex: 31,
    open: true,
  },
  {
    id: "projects",
    title: "Active Bay Blueprints & Repositories",
    subtitle: "ENGINEERING SCHEMATICS // REAL GITHUB DATA",
    accent: "#fbbf24",
    x: 478,
    y: 78,
    width: 440,
    zIndex: 30,
    open: false,
  },
  {
    id: "cv-guide",
    title: "Vision Pro Spatial Hand Controller",
    subtitle: "OPENVISION CV // MEDIAPIPE 21-LANDMARK RIG",
    accent: "#a855f7",
    x: 490,
    y: 120,
    width: 390,
    zIndex: 32,
    open: false,
  },
];

export default function Home() {
  const router = useRouter();
  const [recruiterMode, setRecruiterMode] = useState(false);
  const [activeStation, setActiveStation] = useState<StationId>("overview");
  const [selectedStationId, setSelectedStationId] =
    useState<Exclude<StationId, "overview">>("reactor");
  const [zoomDistance, setZoomDistance] = useState<number>(10.5);
  const [orbitYawOffset, setOrbitYawOffset] = useState<number>(0);

  // Spline integration state
  const [splineMode, setSplineMode] = useState<boolean>(false);
  const [splineConfigOpen, setSplineConfigOpen] = useState<boolean>(false);
  const [customSplineUrl, setCustomSplineUrl] = useState<string>(
    profile.splinePresets[1]?.url || ""
  );

  // JARVIS external announcement when user clicks 3D stations
  const [jarvisAnnouncement, setJarvisAnnouncement] = useState<string | null>(null);

  // Spatial draggable HUD windows
  const [windows, setWindows] = useState<SpatialWindowState[]>(INITIAL_WINDOWS);
  const zCounter = useRef(35);

  // Track which window is being pinched by left or right hand
  const pinchedWinByHand = useRef<{ left: string | null; right: string | null }>({
    left: null,
    right: null,
  });

  const bringToFront = useCallback((id: string) => {
    const nextZ = ++zCounter.current;
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, zIndex: nextZ } : w))
    );
  }, []);

  const moveWindow = useCallback((id: string, x: number, y: number) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, x, y } : w))
    );
  }, []);

  const closeWindow = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, open: false, pinched: false } : w))
    );
  }, []);

  const openWindow = useCallback((id: string) => {
    const nextZ = ++zCounter.current;
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, open: true, zIndex: nextZ } : w))
    );
  }, []);

  const selectStation = useCallback(
    (id: StationId, announce = true) => {
      setActiveStation(id);
      if (id === "overview") {
        setZoomDistance(11.2);
        return;
      }
      setSelectedStationId(id);
      setZoomDistance(10.5);
      const st = profile.stations.find((s) => s.id === id);
      if (!st) return;

      const nextZ = ++zCounter.current;
      setWindows((prev) =>
        prev.map((w) => {
          if (w.id === "inspector") {
            return {
              ...w,
              open: true,
              title: `${st.name} · ${st.subtitle}`,
              subtitle: `STATION [${st.code}] // PINCH OR DRAG TO MOVE`,
              accent: st.color,
              zIndex: nextZ + 1,
            };
          }
          if (w.id === "projects") {
            return {
              ...w,
              open: true,
              title: `${st.name} · Schematics & Repos`,
              subtitle: `${st.relatedProjects.length} LINKED BUILDS // PINCH OR DRAG`,
              accent: st.color,
              zIndex: nextZ,
            };
          }
          return w;
        })
      );

      if (announce) {
        setJarvisAnnouncement(st.jarvisLine);
        speakJarvis(st.jarvisLine);
      }
    },
    []
  );

  // Vision Pro CV gesture callbacks
  const handlePinchStart = useCallback(
    (sx: number, sy: number, side: HandSide) => {
      const els = document.elementsFromPoint(sx, sy);
      for (const el of els) {
        const winEl = (el as HTMLElement).closest?.("[data-spatial-win-id]") as HTMLElement | null;
        if (winEl) {
          const winId = winEl.getAttribute("data-spatial-win-id");
          if (winId) {
            pinchedWinByHand.current[side] = winId;
            const nextZ = ++zCounter.current;
            setWindows((prev) =>
              prev.map((w) =>
                w.id === winId ? { ...w, pinched: true, zIndex: nextZ } : w
              )
            );
            return;
          }
        }
        const stEl = (el as HTMLElement).closest?.("[data-station-id]") as HTMLElement | null;
        if (stEl) {
          const stId = stEl.getAttribute("data-station-id") as StationId | null;
          if (stId) {
            selectStation(stId);
            return;
          }
        }
      }
    },
    [selectStation]
  );

  const handlePinchMove = useCallback(
    (_sx: number, _sy: number, dx: number, dy: number, side: HandSide) => {
      const winId = pinchedWinByHand.current[side];
      if (!winId) return;
      setWindows((prev) =>
        prev.map((w) => {
          if (w.id !== winId) return w;
          const nx = Math.max(12, Math.min(window.innerWidth - 180, w.x + dx));
          const ny = Math.max(56, Math.min(window.innerHeight - 120, w.y + dy));
          return { ...w, x: nx, y: ny };
        })
      );
    },
    []
  );

  const handlePinchEnd = useCallback((_sx: number, _sy: number, side: HandSide) => {
    const winId = pinchedWinByHand.current[side];
    pinchedWinByHand.current[side] = null;
    if (!winId) return;
    setWindows((prev) =>
      prev.map((w) => (w.id === winId ? { ...w, pinched: false } : w))
    );
  }, []);

  const handleTwoHandZoomRotate = useCallback(
    (scaleDelta: number, rotationDelta: number, spreadRatio: number) => {
      // Spreading hands apart zooms out to see the whole garage or zooms in; rotating hands orbits camera
      setZoomDistance((prev) => {
        const next = prev / Math.pow(scaleDelta, 0.85);
        return Math.max(4.5, Math.min(16.5, next));
      });
      setOrbitYawOffset((prev) => prev - rotationDelta * 1.35);
      if (spreadRatio > 1.45) {
        setActiveStation("overview");
      }
    },
    []
  );

  const handleBothOpenZoomOut = useCallback(() => {
    setActiveStation("overview");
    setZoomDistance(12.8);
    setOrbitYawOffset(0);
    const msg = "Dual open-palm gesture detected, sir. Pulling back to full Malibu Workshop overview.";
    setJarvisAnnouncement(msg);
    speakJarvis(msg);
  }, []);

  const {
    videoRef: cvVideoRef,
    canvasRef: cvCanvasRef,
    enabled: cvEnabled,
    loading: cvLoading,
    error: cvError,
    fps: cvFps,
    handCount: cvHandCount,
    gestureText: cvGestureText,
    start: cvStart,
    stop: cvStop,
  } = useVisionCV({
    onPinchStart: handlePinchStart,
    onPinchMove: handlePinchMove,
    onPinchEnd: handlePinchEnd,
    onTwoHandZoomRotate: handleTwoHandZoomRotate,
    onBothOpenZoomOut: handleBothOpenZoomOut,
  });

  const handleJarvisNavigate = useCallback(
    (t: JarvisTarget) => {
      if (t === "recruiter") {
        router.push("/recruiter");
        return;
      }
      if (t === "vision") {
        openWindow("cv-guide");
        if (!cvEnabled) cvStart();
        return;
      }
      if (t === "spline") {
        setSplineMode((v) => !v);
        return;
      }
      selectStation(t, false);
    },
    [cvEnabled, cvStart, openWindow, router, selectStation]
  );

  const currentStation: GarageStation =
    profile.stations.find((s) => s.id === selectedStationId) || profile.stations[0];

  const stationProjects: ProjectItem[] = profile.projects.filter(
    (p) =>
      currentStation.relatedProjects.includes(p.id) ||
      p.station === currentStation.id
  );

  // Clean recruiter mode fallback view on the same route when toggled
  if (recruiterMode) {
    return (
      <div className="min-h-screen bg-white text-slate-900">
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3">
              <span className="font-mono text-sm font-black tracking-widest text-slate-900">
                {profile.name.toUpperCase()}
              </span>
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                RECRUITER DOSSIER MODE
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/recruiter"
                className="rounded-full border border-slate-300 px-4 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100"
              >
                Printable View / PDF ↗
              </Link>
              <button
                onClick={() => setRecruiterMode(false)}
                className="rounded-full bg-slate-900 px-4 py-1.5 text-xs font-bold text-white hover:bg-slate-800"
              >
                ← Return to 3D Stark Garage
              </button>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-5xl px-6 py-10">
          <div className="border-b border-slate-200 pb-8">
            <h1 className="text-4xl font-black">{profile.name}</h1>
            <p className="mt-1 text-lg font-medium text-slate-600">
              {profile.title} · {profile.location}
            </p>
            <p className="mt-3 max-w-3xl text-slate-700 leading-relaxed">{profile.bio}</p>
            <div className="mt-4 flex flex-wrap gap-4 text-sm font-semibold text-sky-700">
              <a href={profile.contact.github} target="_blank" rel="noreferrer" className="underline">
                GitHub (@{profile.alias})
              </a>
              <a href={profile.contact.linkedin} target="_blank" rel="noreferrer" className="underline">
                LinkedIn
              </a>
              <span className="text-slate-600">Discord: {profile.contact.discord}</span>
            </div>
          </div>

          <section className="mt-8">
            <h2 className="text-xs font-bold tracking-[0.22em] text-slate-500 uppercase">
              Engineering Arsenal
            </h2>
            <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {profile.skills.map((g) => (
                <div key={g.group} className="rounded-xl border border-slate-200 p-4">
                  <p className="text-xs font-bold text-slate-500 uppercase">{g.group}</p>
                  <p className="mt-2 text-sm text-slate-800">{g.items.join(" · ")}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-10">
            <h2 className="text-xs font-bold tracking-[0.22em] text-slate-500 uppercase">
              Complete Project Index (Public, Private & Org Builds)
            </h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {profile.projects.map((p) => (
                <div key={p.id} className="rounded-xl border border-slate-200 p-5">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-base font-bold text-slate-900">{p.name}</h3>
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600">
                      {p.visibility}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">{p.description}</p>
                  <ul className="mt-2.5 list-disc space-y-1 pl-4 text-xs text-slate-700">
                    {p.highlights.map((h) => (
                      <li key={h}>{h}</li>
                    ))}
                  </ul>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {p.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[#030712] text-slate-100 select-none">
      {/* 1. Interactive 3D Malibu Garage OR Live Spline Scene */}
      <SplineScene
        activeStation={activeStation}
        onSelectStation={(id) => selectStation(id, true)}
        zoomDistance={zoomDistance}
        orbitYawOffset={orbitYawOffset}
        splineMode={splineMode}
        customSplineUrl={customSplineUrl}
      />

      {/* 2. Hidden Webcam + Fullscreen Stark Hand-Tracking Skeleton & Reticle Canvas */}
      <video ref={cvVideoRef} className="hidden" playsInline muted />
      <canvas
        ref={cvCanvasRef}
        className="pointer-events-none fixed inset-0 z-40"
      />

      {/* 3. Top Stark Workshop HUD Bar */}
      <header className="fixed inset-x-0 top-0 z-30 flex flex-wrap items-center justify-between gap-3 border-b border-cyan-400/20 bg-slate-950/75 px-4 py-2.5 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => selectStation("overview", false)}
            className="flex items-center gap-2.5 text-left transition hover:opacity-90"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full border border-cyan-400/60 bg-cyan-500/10 text-cyan-300 shadow-[0_0_12px_rgba(0,216,255,.6)]">
              ◉
            </span>
            <div>
              <p className="font-mono text-xs font-black tracking-[0.2em] text-cyan-300">
                {profile.alias.toUpperCase()} {"//"} MALIBU WORKSHOP
              </p>
              <p className="text-[11px] text-slate-400">
                {profile.name} · Interactive 3D Engineering Garage
              </p>
            </div>
          </button>

          <span className="hidden rounded-full border border-emerald-400/40 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-emerald-300 xl:inline-block">
            ● {activeStation === "overview" ? "GARAGE OVERVIEW" : `STATION: ${currentStation.code}`}
          </span>
        </div>

        {/* Center Hardware Controls: Hand Tracking CV + Spline 3D + Zoom Out */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => selectStation("overview", false)}
            className={`rounded-full border px-3 py-1.5 font-mono text-[11px] font-bold tracking-wider transition ${
              activeStation === "overview"
                ? "border-cyan-400 bg-cyan-400/20 text-cyan-200 shadow-[0_0_16px_rgba(0,216,255,.35)]"
                : "border-slate-700 bg-slate-900/80 text-slate-300 hover:border-cyan-400/50"
            }`}
          >
            ⊞ ZOOM OUT (FULL SHOP)
          </button>

          <button
            onClick={() => {
              if (cvEnabled) {
                cvStop();
              } else {
                openWindow("cv-guide");
                cvStart();
              }
            }}
            className={`flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 font-mono text-[11px] font-bold tracking-wider transition ${
              cvEnabled
                ? "border-amber-400 bg-amber-400/20 text-amber-200 shadow-[0_0_20px_rgba(251,191,36,.45)]"
                : "border-purple-400/50 bg-purple-950/50 text-purple-200 hover:border-purple-300"
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-current animate-pulse" />
            {cvLoading
              ? "STARTING CV..."
              : cvEnabled
                ? `VISION CV ON (${cvFps} FPS)`
                : "✋ VISION PRO HAND CV"}
          </button>

          <div className="relative flex items-center">
            <button
              onClick={() => setSplineMode((v) => !v)}
              className={`rounded-l-full border px-3 py-1.5 font-mono text-[11px] font-bold tracking-wider transition ${
                splineMode
                  ? "border-cyan-400 bg-cyan-400 text-slate-950"
                  : "border-slate-700 bg-slate-900/80 text-slate-300 hover:border-cyan-400/50"
              }`}
            >
              {splineMode ? "◈ SPLINE: ON" : "◈ SPLINE 3D"}
            </button>
            <button
              onClick={() => setSplineConfigOpen((v) => !v)}
              className="rounded-r-full border border-l-0 border-slate-700 bg-slate-900/80 px-2 py-1.5 font-mono text-[11px] text-cyan-300 hover:bg-slate-800"
              title="Configure Spline .splinecode URL"
            >
              ⚙
            </button>
          </div>
        </div>

        {/* Right Controls: Recruiter Toggle + Printable Dossier */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              openWindow("inspector");
              openWindow("projects");
            }}
            className="hidden rounded-full border border-cyan-500/35 bg-slate-900/80 px-3 py-1.5 font-mono text-[11px] font-semibold text-cyan-200 hover:border-cyan-400 md:inline-block"
          >
            HUD WINDOWS
          </button>
          <button
            onClick={() => setRecruiterMode(true)}
            className="rounded-full border border-emerald-400/50 bg-emerald-500/15 px-3.5 py-1.5 font-mono text-[11px] font-bold tracking-wider text-emerald-200 transition hover:bg-emerald-500/25"
          >
            SIMPLE RECRUITER VIEW
          </button>
          <Link
            href="/recruiter"
            className="hidden rounded-full bg-cyan-400 px-3.5 py-1.5 font-mono text-[11px] font-bold tracking-wider text-slate-950 transition hover:bg-cyan-300 sm:inline-block"
          >
            PRINTABLE BRIEF ↗
          </Link>
        </div>
      </header>

      {/* Optional Spline Scene Config Popover */}
      {splineConfigOpen && (
        <div className="fixed top-16 left-1/2 z-50 w-[min(92vw,460px)] -translate-x-1/2 rounded-2xl border border-cyan-400/50 bg-slate-950/95 p-4 shadow-[0_0_40px_rgba(0,216,255,.35)] backdrop-blur-xl select-text">
          <div className="flex items-center justify-between">
            <p className="font-mono text-xs font-bold tracking-widest text-cyan-300">
              SPLINE 3D RUNTIME CONNECTION
            </p>
            <button
              onClick={() => setSplineConfigOpen(false)}
              className="text-xs text-slate-400 hover:text-white"
            >
              ✕
            </button>
          </div>
          <p className="mt-1.5 text-xs text-slate-300">
            Spline doesn&apos;t use OAuth account login — it connects directly to any public{" "}
            <code className="text-cyan-300">.splinecode</code> scene URL via{" "}
            <code className="text-cyan-300">@splinetool/react-spline</code>. Paste your own export URL or toggle the built-in interactive droid scene:
          </p>
          <input
            value={customSplineUrl}
            onChange={(e) => setCustomSplineUrl(e.target.value)}
            placeholder="https://prod.spline.design/.../scene.splinecode"
            className="mt-3 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 font-mono text-xs text-cyan-100 focus:border-cyan-400 focus:outline-none"
          />
          <div className="mt-3 flex justify-between gap-2">
            <button
              onClick={() => {
                setSplineMode(false);
                setSplineConfigOpen(false);
              }}
              className="rounded-lg border border-slate-700 px-3 py-1.5 font-mono text-xs text-slate-300 hover:border-cyan-400"
            >
              Use 3D Stark Garage
            </button>
            <button
              onClick={() => {
                setSplineMode(true);
                setSplineConfigOpen(false);
              }}
              className="rounded-lg bg-cyan-400 px-4 py-1.5 font-mono text-xs font-bold text-slate-950 hover:bg-cyan-300"
            >
              Activate Spline Scene
            </button>
          </div>
        </div>
      )}

      {/* CV Status Telemetry Pill when webcam hand tracking is active */}
      {(cvEnabled || cvError) && (
        <div className="fixed top-16 right-5 z-30 flex items-center gap-3 rounded-xl border border-amber-400/50 bg-slate-950/85 px-3.5 py-2 font-mono text-xs backdrop-blur-md">
          {cvError ? (
            <span className="text-red-400">CV ERROR: {cvError}</span>
          ) : (
            <>
              <span className="text-amber-300 font-bold">HANDS: {cvHandCount}</span>
              <span className="text-cyan-300">{cvGestureText}</span>
            </>
          )}
        </div>
      )}

      {/* 4. Draggable / Pinch-Manipulable Spatial HUD Windows */}
      {windows.map((win) => (
        <SpatialWindow
          key={win.id}
          win={win}
          onMove={moveWindow}
          onFocus={bringToFront}
          onClose={closeWindow}
        >
          {win.id === "inspector" && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span
                  className="rounded-full px-2.5 py-0.5 font-mono text-[10px] font-bold"
                  style={{
                    backgroundColor: `${currentStation.color}22`,
                    color: currentStation.color,
                    border: `1px solid ${currentStation.color}66`,
                  }}
                >
                  {currentStation.code} · {currentStation.category.toUpperCase()}
                </span>
                <button
                  onClick={() => openWindow("projects")}
                  className="font-mono text-[11px] font-bold text-amber-300 underline hover:text-amber-200"
                >
                  Open {stationProjects.length} Blueprints ↗
                </button>
              </div>

              <p className="text-xs leading-relaxed text-slate-300">
                {currentStation.summary}
              </p>

              {/* Hardware / Engineering Specs Grid */}
              <div className="grid grid-cols-2 gap-2">
                {currentStation.specs.map((sp) => (
                  <div
                    key={sp.label}
                    className="rounded-xl border border-slate-800 bg-slate-900/70 p-2.5"
                  >
                    <p className="font-mono text-[9px] tracking-widest text-slate-400">
                      {sp.label}
                    </p>
                    <p className="mt-0.5 text-xs font-semibold text-cyan-100">
                      {sp.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* If on Reactor or Overview, also show Core Skills pills */}
              {currentStation.id === "reactor" && (
                <div className="space-y-2 border-t border-slate-800 pt-3">
                  <p className="font-mono text-[10px] font-bold tracking-widest text-cyan-300">
                    FULL-STACK & SPATIAL ARSENAL
                  </p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {profile.skills.map((grp) => (
                      <div
                        key={grp.group}
                        className="rounded-lg border border-cyan-500/20 bg-slate-950/60 p-2"
                      >
                        <p className="font-mono text-[10px] font-bold text-amber-300">
                          {grp.group}
                        </p>
                        <p className="mt-1 text-[11px] text-slate-300">
                          {grp.items.join(" · ")}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* If on Comms station, show direct action links */}
              {currentStation.id === "comms" && (
                <div className="flex flex-wrap gap-2 border-t border-slate-800 pt-3">
                  <a
                    href={profile.contact.github}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-lg bg-cyan-400 px-3 py-1.5 font-mono text-xs font-bold text-slate-950 hover:bg-cyan-300"
                  >
                    GitHub (@Lordbeatus) ↗
                  </a>
                  <a
                    href={profile.contact.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-lg border border-cyan-400/50 px-3 py-1.5 font-mono text-xs font-bold text-cyan-200 hover:bg-cyan-400/10"
                  >
                    LinkedIn ↗
                  </a>
                  <Link
                    href="/recruiter"
                    className="rounded-lg border border-amber-400/50 px-3 py-1.5 font-mono text-xs font-bold text-amber-200 hover:bg-amber-400/10"
                  >
                    Printable Resume ↗
                  </Link>
                </div>
              )}
            </div>
          )}

          {win.id === "projects" && (
            <div className="space-y-3">
              {stationProjects.map((p) => (
                <div
                  key={p.id}
                  className="rounded-xl border border-cyan-400/25 bg-slate-900/75 p-3.5 transition hover:border-cyan-400/60"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="font-mono text-[10px] tracking-widest text-amber-300">
                        {p.codename}
                      </p>
                      <h4 className="text-sm font-bold text-white">{p.name}</h4>
                    </div>
                    <span className="rounded-full border border-cyan-400/30 bg-cyan-950/60 px-2 py-0.5 font-mono text-[10px] text-cyan-200">
                      {p.visibility} Repo
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-300">
                    {p.description}
                  </p>
                  <ul className="mt-2 list-disc space-y-1 pl-4 text-[11px] text-slate-300">
                    {p.highlights.map((h) => (
                      <li key={h}>{h}</li>
                    ))}
                  </ul>
                  <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap gap-1">
                      {p.tags.map((t) => (
                        <span
                          key={t}
                          className="rounded bg-slate-800 px-2 py-0.5 font-mono text-[10px] text-cyan-200"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      {p.liveUrl && (
                        <a
                          href={p.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="font-mono text-[11px] font-bold text-emerald-300 underline hover:text-emerald-200"
                        >
                          Live ↗
                        </a>
                      )}
                      <a
                        href={p.link}
                        target="_blank"
                        rel="noreferrer"
                        className="font-mono text-[11px] font-bold text-cyan-300 underline hover:text-cyan-200"
                      >
                        Repo ↗
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {win.id === "cv-guide" && (
            <div className="space-y-3 text-xs">
              <p className="text-slate-300">
                Powered by Daniel&apos;s <strong className="text-purple-300">OpenVision</strong> engine
                (MediaPipe 21-landmark hand tracking + hysteresis PinchDetector):
              </p>
              <div className="space-y-2 rounded-xl border border-purple-400/30 bg-purple-950/25 p-3">
                <p>
                  <strong className="text-amber-300">1. Pinch &amp; Drag Windows:</strong>{" "}
                  Pinch thumb + index finger over any floating HUD window to grab and move it in 3D space.
                </p>
                <p>
                  <strong className="text-cyan-300">2. Two-Hand Zoom &amp; Orbit:</strong>{" "}
                  Pinch with <em>both</em> hands simultaneously — move hands apart/together to zoom the garage camera, or twist to orbit around the shop.
                </p>
                <p>
                  <strong className="text-emerald-300">3. Dual Open Palms:</strong>{" "}
                  Hold both palms open for 1 second to immediately zoom out to the full Malibu Garage overview.
                </p>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="font-mono text-[11px] text-slate-400">
                  100% client-side WebGL · No video leaves your browser
                </span>
                <button
                  onClick={() => (cvEnabled ? cvStop() : cvStart())}
                  className={`rounded-lg px-3 py-1.5 font-mono text-xs font-bold ${
                    cvEnabled
                      ? "bg-red-500/80 text-white"
                      : "bg-purple-500 text-slate-950"
                  }`}
                >
                  {cvEnabled ? "Disable Camera" : "Start Camera CV"}
                </button>
              </div>
            </div>
          )}
        </SpatialWindow>
      ))}

      {/* 5. Bottom Interactive Workshop Station Dock (chrisp.design-style fast switcher) */}
      <nav
        aria-label="Workshop Stations"
        className="fixed bottom-4 left-1/2 z-30 flex max-w-[94vw] -translate-x-1/2 items-center gap-1.5 overflow-x-auto rounded-2xl border border-cyan-400/30 bg-slate-950/85 p-2 shadow-[0_0_35px_rgba(0,216,255,.25)] backdrop-blur-xl"
      >
        <button
          onClick={() => selectStation("overview", false)}
          className={`shrink-0 rounded-xl px-3 py-2 font-mono text-[11px] font-bold tracking-wider transition ${
            activeStation === "overview"
              ? "bg-cyan-400 text-slate-950 shadow-[0_0_15px_rgba(0,216,255,.5)]"
              : "text-slate-300 hover:bg-slate-900 hover:text-cyan-300"
          }`}
        >
          ⊞ ALL STATIONS
        </button>
        {profile.stations.map((st) => {
          const isSelected = activeStation === st.id;
          return (
            <button
              key={st.id}
              onClick={() => selectStation(st.id, true)}
              className={`flex shrink-0 items-center gap-2 rounded-xl border px-3 py-2 text-left transition ${
                isSelected
                  ? "border-cyan-300 bg-cyan-950/80 text-white shadow-[0_0_18px_rgba(0,216,255,.35)]"
                  : "border-transparent bg-slate-900/60 text-slate-300 hover:border-slate-700 hover:bg-slate-900"
              }`}
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: st.color }}
              />
              <div>
                <p className="font-mono text-[9px] tracking-widest opacity-70">
                  {st.code}
                </p>
                <p className="text-xs font-bold whitespace-nowrap">{st.name}</p>
              </div>
            </button>
          );
        })}
      </nav>

      {/* 6. JARVIS Voice & Text AI Navigator */}
      <Jarvis
        onNavigate={handleJarvisNavigate}
        externalAnnouncement={jarvisAnnouncement}
      />
    </div>
  );
}
