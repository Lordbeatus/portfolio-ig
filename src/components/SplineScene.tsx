"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import StarkGarage3D, { type StarkGarage3DProps } from "./StarkGarage3D";
import { profile } from "@/data/profile";

const Spline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 z-0 flex items-center justify-center bg-[#030712] font-mono text-xs tracking-widest text-cyan-300">
      INITIALIZING SPLINE 3D RUNTIME...
    </div>
  ),
});

export interface SplineSceneProps extends StarkGarage3DProps {
  splineMode: boolean;
  customSplineUrl: string;
}

export default function SplineScene({
  activeStation,
  onSelectStation,
  zoomDistance,
  orbitYawOffset,
  splineMode,
  customSplineUrl,
}: SplineSceneProps) {
  const [splineError, setSplineError] = useState(false);

  const envUrl = process.env.NEXT_PUBLIC_SPLINE_SCENE_URL;
  const defaultSplineUrl = profile.splinePresets[1]?.url || "";
  const activeUrl = customSplineUrl.trim() || envUrl || defaultSplineUrl;

  if (!splineMode || !activeUrl || splineError) {
    return (
      <StarkGarage3D
        activeStation={activeStation}
        onSelectStation={onSelectStation}
        zoomDistance={zoomDistance}
        orbitYawOffset={orbitYawOffset}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-0 bg-[#030712]">
      <Spline
        scene={activeUrl}
        onError={() => setSplineError(true)}
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-20 flex justify-center">
        <span className="rounded-full border border-cyan-400/30 bg-slate-950/80 px-4 py-1 font-mono text-[11px] tracking-widest text-cyan-300 backdrop-blur">
          SPLINE LIVE SCENE · INTERACT DIRECTLY OR SWITCH TO 3D GARAGE BAY
        </span>
      </div>
    </div>
  );
}
