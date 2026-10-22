"use client";

import { useEffect, useRef } from "react";

export interface SpatialWindowState {
  id: string;
  title: string;
  subtitle?: string;
  accent?: string;
  x: number;
  y: number;
  width: number;
  zIndex: number;
  open: boolean;
  pinched?: boolean;
}

interface SpatialWindowProps {
  win: SpatialWindowState;
  onMove: (id: string, x: number, y: number) => void;
  onFocus: (id: string) => void;
  onClose: (id: string) => void;
  children: React.ReactNode;
}

/**
 * Vision Pro + Stark HUD floating spatial panel.
 * Supports both mouse dragging AND webcam CV pinch-and-drag (via data-spatial-win-id).
 */
export default function SpatialWindow({
  win,
  onMove,
  onFocus,
  onClose,
  children,
}: SpatialWindowProps) {
  const dragRef = useRef<{ dragging: boolean; offX: number; offY: number }>({
    dragging: false,
    offX: 0,
    offY: 0,
  });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragRef.current.dragging) return;
      const nx = Math.max(12, Math.min(window.innerWidth - 140, e.clientX - dragRef.current.offX));
      const ny = Math.max(56, Math.min(window.innerHeight - 100, e.clientY - dragRef.current.offY));
      onMove(win.id, nx, ny);
    };
    const handleMouseUp = () => {
      dragRef.current.dragging = false;
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [onMove, win.id]);

  if (!win.open) return null;

  const accent = win.accent || "#00d8ff";

  return (
    <div
      data-spatial-win-id={win.id}
      onMouseDown={() => onFocus(win.id)}
      className="fixed flex flex-col overflow-hidden rounded-2xl transition-shadow duration-150 select-none"
      style={{
        left: 0,
        top: 0,
        width: `min(92vw, ${win.width}px)`,
        maxHeight: "calc(100vh - 150px)",
        transform: `translate3d(${win.x}px, ${win.y}px, 0)`,
        zIndex: win.zIndex,
        background: "rgba(6, 12, 26, 0.82)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        border: win.pinched
          ? "1.5px solid #fbbf24"
          : `1px solid ${accent}66`,
        boxShadow: win.pinched
          ? "0 24px 60px rgba(0,0,0,0.75), 0 0 38px rgba(251, 191, 36, 0.45)"
          : `0 24px 60px rgba(0,0,0,0.72), 0 0 28px ${accent}26`,
      }}
    >
      {/* Top Vision Pro / Stark Grab Handle Bar */}
      <div
        data-spatial-handle={win.id}
        onMouseDown={(e) => {
          if ((e.target as HTMLElement).closest("button, a, input")) return;
          onFocus(win.id);
          dragRef.current = {
            dragging: true,
            offX: e.clientX - win.x,
            offY: e.clientY - win.y,
          };
          e.preventDefault();
        }}
        className="flex cursor-grab items-center justify-between border-b border-cyan-400/20 bg-slate-950/70 px-4 py-3 active:cursor-grabbing"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <span
            className="h-2.5 w-2.5 shrink-0 rounded-full"
            style={{
              backgroundColor: win.pinched ? "#fbbf24" : accent,
              boxShadow: `0 0 10px ${win.pinched ? "#fbbf24" : accent}`,
            }}
          />
          <div className="truncate">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] tracking-[0.22em] text-cyan-300/80 uppercase">
                {win.subtitle || "SPATIAL HUD"}
              </span>
              {win.pinched && (
                <span className="rounded bg-amber-400/20 px-1.5 py-0.5 font-mono text-[9px] font-bold text-amber-300">
                  CV PINCH LOCKED
                </span>
              )}
            </div>
            <h3 className="truncate text-sm font-bold tracking-wide text-slate-100">
              {win.title}
            </h3>
          </div>
        </div>

        {/* Center Vision Pro grabber pill */}
        <div className="mx-3 hidden h-1 w-10 rounded-full bg-white/25 sm:block" title="Pinch or drag to move" />

        <button
          onClick={() => onClose(win.id)}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-slate-700/80 bg-slate-900/80 text-xs font-bold text-slate-300 transition hover:border-cyan-400 hover:text-white"
          aria-label={`Close ${win.title}`}
        >
          ✕
        </button>
      </div>

      {/* Scrollable window body */}
      <div className="overflow-y-auto p-4 text-sm text-slate-200 select-text">
        {children}
      </div>
    </div>
  );
}
