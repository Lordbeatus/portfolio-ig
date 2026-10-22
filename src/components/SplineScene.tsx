"use client";

import dynamic from "next/dynamic";
import ArcReactor from "./ArcReactor";

const Spline = dynamic(() => import("@splinetool/react-spline"), { ssr: false });

/**
 * Set NEXT_PUBLIC_SPLINE_SCENE_URL to a public Spline scene URL to use it.
 * Falls back to the built-in Three.js arc reactor when unset.
 */
export default function SplineScene() {
  const url = process.env.NEXT_PUBLIC_SPLINE_SCENE_URL;
  if (!url) return <ArcReactor />;
  return (
    <div className="absolute inset-0" aria-hidden>
      <Spline scene={url} />
    </div>
  );
}
