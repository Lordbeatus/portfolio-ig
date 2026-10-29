"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface Landmark {
  x: number;
  y: number;
  z: number;
}

export type HandSide = "left" | "right";

export interface HandData {
  lm: Landmark[];
  side: HandSide;
}

export type GestureName =
  | "none"
  | "fist"
  | "open"
  | "point"
  | "peace"
  | "thumbs_up"
  | "pinch"
  | "custom";

export interface PinchResult {
  state: "idle" | "pinching" | "holding" | "dragging" | "released";
  changed: boolean;
  center: { x: number; y: number; z: number } | null;
  delta: { x: number; y: number; z: number };
  ratio: number;
  isPinched: boolean;
}

const HAND_CONNECTIONS: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4],
  [0, 5], [5, 6], [6, 7], [7, 8],
  [5, 9], [9, 10], [10, 11], [11, 12],
  [9, 13], [13, 14], [14, 15], [15, 16],
  [13, 17], [0, 17], [17, 18], [18, 19], [19, 20],
];

function dist2D(a: { x: number; y: number }, b: { x: number; y: number }) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export function classifyGesture(lm: Landmark[] | null | undefined): GestureName {
  if (!lm || lm.length < 21) return "none";
  const extended = [
    dist2D(lm[4], lm[0]) > dist2D(lm[3], lm[0]),
    lm[8].y < lm[6].y,
    lm[12].y < lm[10].y,
    lm[16].y < lm[14].y,
    lm[20].y < lm[18].y,
  ];
  const [thumb, index, middle, ring, pinky] = extended;
  const count = extended.filter(Boolean).length;
  const pinchRatio = dist2D(lm[4], lm[8]) / Math.max(dist2D(lm[0], lm[9]), 0.001);

  if (pinchRatio < 0.4) return "pinch";
  if (!thumb && !index && !middle && !ring && !pinky) return "fist";
  if (count >= 4) return "open";
  if (index && !middle && !ring && !pinky) return "point";
  if (index && middle && !ring && !pinky) return "peace";
  if (thumb && !index && !middle && !ring && !pinky) return "thumbs_up";
  return "custom";
}

export class PinchDetector {
  enterRatio = 0.4;
  exitRatio = 0.55;
  holdMs = 200;
  dragDeadzone = 0.01;
  alpha = 0.42;
  state: PinchResult["state"] = "idle";
  startedAt = 0;
  center: { x: number; y: number; z: number } | null = null;
  startCenter: { x: number; y: number; z: number } | null = null;
  lastCenter: { x: number; y: number; z: number } | null = null;
  smoothedCenter: { x: number; y: number; z: number } | null = null;

  private handScale(lm: Landmark[]) {
    const palmH = dist2D(lm[0], lm[9]);
    const palmW = dist2D(lm[5], lm[17]);
    return Math.max((palmH + palmW) * 0.5, 0.0001);
  }

  update(landmarks: Landmark[] | null, now = performance.now()): PinchResult {
    if (!landmarks || landmarks.length < 21) {
      const prev = this.state;
      this.state = "idle";
      this.smoothedCenter = null;
      return {
        state: "idle",
        changed: prev !== "idle",
        center: null,
        delta: { x: 0, y: 0, z: 0 },
        ratio: 1,
        isPinched: false,
      };
    }

    const thumb = landmarks[4];
    const index = landmarks[8];
    const rawDist = dist2D(thumb, index);
    const scale = this.handScale(landmarks);
    const ratio = rawDist / scale;
    const rawCenter = {
      x: (thumb.x + index.x) / 2,
      y: (thumb.y + index.y) / 2,
      z: ((thumb.z ?? 0) + (index.z ?? 0)) / 2,
    };

    if (!this.smoothedCenter) this.smoothedCenter = rawCenter;
    this.smoothedCenter = {
      x: this.smoothedCenter.x + this.alpha * (rawCenter.x - this.smoothedCenter.x),
      y: this.smoothedCenter.y + this.alpha * (rawCenter.y - this.smoothedCenter.y),
      z: this.smoothedCenter.z + this.alpha * (rawCenter.z - this.smoothedCenter.z),
    };
    this.center = this.smoothedCenter;

    const wasPinched = ["pinching", "holding", "dragging"].includes(this.state);
    const isPinched = wasPinched ? ratio < this.exitRatio : ratio < this.enterRatio;
    let changed = false;

    if (!wasPinched && isPinched) {
      this.state = "pinching";
      this.startedAt = now;
      this.startCenter = { ...this.center };
      changed = true;
    } else if (wasPinched && !isPinched) {
      this.state = "released";
      changed = true;
    } else if (wasPinched && isPinched) {
      const heldMs = now - this.startedAt;
      const move = this.startCenter ? dist2D(this.center, this.startCenter) : 0;
      this.state =
        move > this.dragDeadzone
          ? "dragging"
          : heldMs >= this.holdMs
            ? "holding"
            : "pinching";
    } else if (this.state === "released") {
      this.state = "idle";
      changed = true;
    }

    const delta =
      this.lastCenter && this.center
        ? {
            x: this.center.x - this.lastCenter.x,
            y: this.center.y - this.lastCenter.y,
            z: this.center.z - this.lastCenter.z,
          }
        : { x: 0, y: 0, z: 0 };

    this.lastCenter = this.center ? { ...this.center } : null;

    return {
      state: this.state,
      changed,
      center: this.center,
      delta,
      ratio,
      isPinched,
    };
  }
}

export interface CVGestureCallbacks {
  onPinchStart?: (screenX: number, screenY: number, side: HandSide) => void;
  onPinchMove?: (screenX: number, screenY: number, dx: number, dy: number, side: HandSide) => void;
  onPinchEnd?: (screenX: number, screenY: number, side: HandSide) => void;
  onTwoHandZoomRotate?: (scaleDelta: number, rotationDelta: number, spreadRatio: number) => void;
  onBothOpenZoomOut?: () => void;
}

const DEFAULT_CDN = "https://cdn.jsdelivr.net/npm/@mediapipe/hands";

async function loadMediaPipeHands(cdn = DEFAULT_CDN): Promise<void> {
  if (typeof window === "undefined") return;
  if ((window as unknown as { Hands?: unknown }).Hands) return;
  await new Promise<void>((resolve, reject) => {
    const s = document.createElement("script");
    s.src = `${cdn}/hands.js`;
    s.crossOrigin = "anonymous";
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Failed to load @mediapipe/hands from CDN"));
    document.head.appendChild(s);
  });
}

type RawResults = {
  multiHandLandmarks?: Landmark[][];
  multiHandedness?: { label: string; score: number }[];
};

type HandsInstance = {
  setOptions: (o: Record<string, unknown>) => void;
  onResults: (cb: (r: RawResults) => void) => void;
  send: (i: { image: HTMLVideoElement }) => Promise<void>;
  close: () => void;
};

export function useVisionCV(callbacks: CVGestureCallbacks) {
  const cbRef = useRef(callbacks);
  useEffect(() => {
    cbRef.current = callbacks;
  }, [callbacks]);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const handsRef = useRef<HandsInstance | null>(null);
  const rafRef = useRef<number>(0);
  const sendingRef = useRef(false);

  const pinchL = useRef(new PinchDetector());
  const pinchR = useRef(new PinchDetector());
  const twoHandLastDist = useRef<number | null>(null);
  const twoHandLastAngle = useRef<number | null>(null);
  const twoHandStartDist = useRef<number | null>(null);
  const openPalmFrames = useRef(0);
  const lastOpenTrigger = useRef(0);
  const pointTarget = useRef<HTMLElement | null>(null);
  const pointStartedAt = useRef(0);
  const pointTriggered = useRef(false);

  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fps, setFps] = useState(0);
  const [handCount, setHandCount] = useState(0);
  const [gestureText, setGestureText] = useState<string>("STANDBY");

  const fpsCount = useRef(0);
  const fpsLast = useRef(0);

  const drawHUD = useCallback(
    (
      hands: HandData[],
      pl: PinchResult,
      pr: PinchResult,
      gl: GestureName,
      gr: GestureName,
      twoHandActive: boolean,
      point: { x: number; y: number; progress: number } | null
    ) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const W = (canvas.width = window.innerWidth);
      const H = (canvas.height = window.innerHeight);
      ctx.clearRect(0, 0, W, H);

      const mx = (x: number) => (1 - x) * W;
      const my = (y: number) => y * H;

      for (const hand of hands) {
        const isLeft = hand.side === "left";
        const pinch = isLeft ? pl : pr;
        const gesture = isLeft ? gl : gr;
        const mainColor = pinch.isPinched
          ? "#fbbf24"
          : isLeft
            ? "#00d8ff"
            : "#a855f7";

        // Draw skeletal wireframe
        ctx.save();
        ctx.strokeStyle = mainColor;
        ctx.lineWidth = pinch.isPinched ? 2.5 : 1.6;
        ctx.shadowBlur = 12;
        ctx.shadowColor = mainColor;
        ctx.globalAlpha = 0.82;

        for (const [a, b] of HAND_CONNECTIONS) {
          const p1 = hand.lm[a];
          const p2 = hand.lm[b];
          if (!p1 || !p2) continue;
          ctx.beginPath();
          ctx.moveTo(mx(p1.x), my(p1.y));
          ctx.lineTo(mx(p2.x), my(p2.y));
          ctx.stroke();
        }

        // Draw joints
        hand.lm.forEach((pt, idx) => {
          const isTip = [4, 8, 12, 16, 20].includes(idx);
          ctx.beginPath();
          ctx.fillStyle = isTip ? "#ffffff" : mainColor;
          ctx.arc(mx(pt.x), my(pt.y), isTip ? 4.5 : 2.5, 0, Math.PI * 2);
          ctx.fill();
        });

        // Draw Stark repulsor / pinch reticle at pinch center
        if (pinch.center) {
          const cx = mx(pinch.center.x);
          const cy = my(pinch.center.y);
          ctx.beginPath();
          ctx.strokeStyle = pinch.isPinched ? "#fbbf24" : "#00d8ff";
          ctx.lineWidth = pinch.isPinched ? 2.5 : 1.2;
          ctx.arc(cx, cy, pinch.isPinched ? 18 : 26, 0, Math.PI * 2);
          ctx.stroke();

          if (pinch.isPinched) {
            ctx.beginPath();
            ctx.fillStyle = "rgba(251, 191, 36, 0.35)";
            ctx.arc(cx, cy, 10, 0, Math.PI * 2);
            ctx.fill();
          }

          // Label next to wrist
          const wrist = hand.lm[0];
          ctx.font = "bold 11px monospace";
          ctx.fillStyle = mainColor;
          ctx.fillText(
            `${hand.side.toUpperCase()} · ${pinch.isPinched ? "PINCH LOCK" : gesture.toUpperCase()}`,
            mx(wrist.x) - 36,
            my(wrist.y) + 24
          );
        }
        ctx.restore();
      }

      // Pointing uses a dwell ring so selection progress is visible without a mouse cursor.
      if (point) {
        const px = mx(point.x);
        const py = my(point.y);
        ctx.save();
        ctx.strokeStyle = "rgba(0, 216, 255, 0.35)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(px, py, 22, 0, Math.PI * 2);
        ctx.stroke();
        ctx.strokeStyle = "#fbbf24";
        ctx.shadowBlur = 12;
        ctx.shadowColor = "#fbbf24";
        ctx.beginPath();
        ctx.arc(px, py, 22, -Math.PI / 2, -Math.PI / 2 + point.progress * Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Draw two-hand energy beam when zooming/rotating
      if (twoHandActive && pl.center && pr.center) {
        const x1 = mx(pl.center.x);
        const y1 = my(pl.center.y);
        const x2 = mx(pr.center.x);
        const y2 = my(pr.center.y);
        ctx.save();
        ctx.strokeStyle = "#fbbf24";
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 4]);
        ctx.shadowBlur = 15;
        ctx.shadowColor = "#fbbf24";
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2;
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.arc(midX, midY, 22, 0, Math.PI * 2);
        ctx.stroke();
        ctx.font = "bold 11px monospace";
        ctx.fillStyle = "#fbbf24";
        ctx.textAlign = "center";
        ctx.fillText("SPATIAL ZOOM / ORBIT", midX, midY - 28);
        ctx.restore();
      }
    },
    []
  );

  const stop = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    handsRef.current?.close();
    handsRef.current = null;
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }
    setEnabled(false);
    setLoading(false);
    setHandCount(0);
    setGestureText("STANDBY");
  }, []);

  const start = useCallback(async () => {
    if (enabled || loading) return;
    setLoading(true);
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: "user" },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      await loadMediaPipeHands();
      const HandsCtor = (
        window as unknown as {
          Hands: new (o: Record<string, unknown>) => HandsInstance;
        }
      ).Hands;

      const hi = new HandsCtor({
        locateFile: (f: string) => `${DEFAULT_CDN}/${f}`,
      });
      hi.setOptions({
        maxNumHands: 2,
        modelComplexity: 1,
        minDetectionConfidence: 0.68,
        minTrackingConfidence: 0.6,
      });

      hi.onResults((results) => {
        const now = performance.now();
        fpsCount.current++;
        if (now - fpsLast.current >= 1000) {
          setFps(fpsCount.current);
          fpsCount.current = 0;
          fpsLast.current = now;
        }

        const hands: HandData[] = [];
        let gl: GestureName = "none";
        let gr: GestureName = "none";
        let lmLeft: Landmark[] | null = null;
        let lmRight: Landmark[] | null = null;

        const multiLandmarks = results.multiHandLandmarks ?? [];
        for (let i = 0; i < multiLandmarks.length; i++) {
          const lm = multiLandmarks[i];
          const rawLabel = results.multiHandedness?.[i]?.label?.toLowerCase();
          const side: HandSide = rawLabel === "left" ? "left" : "right";
          hands.push({ lm, side });
          const g = classifyGesture(lm);
          if (side === "left") {
            gl = g;
            lmLeft = lm;
          } else {
            gr = g;
            lmRight = lm;
          }
        }

        const pl = pinchL.current.update(lmLeft, now);
        const pr = pinchR.current.update(lmRight, now);

        const W = window.innerWidth;
        const H = window.innerHeight;

        const bothPinched = pl.isPinched && pr.isPinched && pl.center && pr.center;
        let pointIndicator: { x: number; y: number; progress: number } | null = null;
        const pointingHand = hands.find((hand) =>
          (hand.side === "left" ? gl : gr) === "point"
        );

        if (pointingHand && !pl.isPinched && !pr.isPinched && !bothPinched) {
          const tip = pointingHand.lm[8];
          const screenX = (1 - tip.x) * W;
          const screenY = tip.y * H;
          const target = document
            .elementsFromPoint(screenX, screenY)
            .map((element) => element.closest("button, a, [role='button'], [data-station-id]"))
            .find((element): element is HTMLElement =>
              element instanceof HTMLElement && !element.hasAttribute("disabled")
            ) ?? null;

          if (target !== pointTarget.current) {
            pointTarget.current = target;
            pointStartedAt.current = now;
            pointTriggered.current = false;
          }

          if (target) {
            const progress = Math.min(1, (now - pointStartedAt.current) / 750);
            pointIndicator = { x: tip.x, y: tip.y, progress };
            if (progress >= 1 && !pointTriggered.current) {
              pointTriggered.current = true;
              target.click();
              setGestureText("TARGET SELECTED");
            } else if (!pointTriggered.current) {
              setGestureText("POINTING · DWELL TO SELECT");
            }
          } else {
            pointTarget.current = null;
            pointTriggered.current = false;
            setGestureText("POINTING · AIM AT A CONTROL OR STATION");
          }
        } else {
          pointTarget.current = null;
          pointTriggered.current = false;
        }

        if (bothPinched && pl.center && pr.center) {
          // Two-hand zoom / orbit mode
          const lx = (1 - pl.center.x) * W;
          const ly = pl.center.y * H;
          const rx = (1 - pr.center.x) * W;
          const ry = pr.center.y * H;
          const dist = Math.hypot(rx - lx, ry - ly);
          const angle = Math.atan2(ry - ly, rx - lx);

          if (twoHandLastDist.current !== null && twoHandLastAngle.current !== null && twoHandStartDist.current !== null) {
            const scaleDelta = dist / Math.max(twoHandLastDist.current, 1);
            let rotDelta = angle - twoHandLastAngle.current;
            while (rotDelta > Math.PI) rotDelta -= Math.PI * 2;
            while (rotDelta < -Math.PI) rotDelta += Math.PI * 2;
            const spreadRatio = dist / Math.max(twoHandStartDist.current, 1);
            cbRef.current.onTwoHandZoomRotate?.(scaleDelta, rotDelta, spreadRatio);
          } else {
            twoHandStartDist.current = dist;
          }
          twoHandLastDist.current = dist;
          twoHandLastAngle.current = angle;
          setGestureText("TWO-HAND SPATIAL ZOOM / ORBIT");
        } else {
          twoHandLastDist.current = null;
          twoHandLastAngle.current = null;
          twoHandStartDist.current = null;

          // Single-hand pinch-to-drag windows or interact
          (["left", "right"] as const).forEach((side) => {
            const p = side === "left" ? pl : pr;
            if (!p.center) return;
            const sx = (1 - p.center.x) * W;
            const sy = p.center.y * H;
            const dx = -p.delta.x * W;
            const dy = p.delta.y * H;

            if (p.changed && p.state === "pinching") {
              cbRef.current.onPinchStart?.(sx, sy, side);
            } else if (p.isPinched && (p.state === "dragging" || p.state === "holding" || p.state === "pinching")) {
              cbRef.current.onPinchMove?.(sx, sy, dx, dy, side);
            } else if (p.changed && p.state === "released") {
              cbRef.current.onPinchEnd?.(sx, sy, side);
            }
          });

          // Both palms open held for ~18 frames -> zoom out to full garage overview
          if (gl === "open" && gr === "open") {
            openPalmFrames.current++;
            if (openPalmFrames.current > 16 && now - lastOpenTrigger.current > 2500) {
              lastOpenTrigger.current = now;
              openPalmFrames.current = 0;
              cbRef.current.onBothOpenZoomOut?.();
              setGestureText("DUAL OPEN PALM · FULL GARAGE OVERVIEW");
            }
          } else {
            openPalmFrames.current = 0;
          }

          if (pl.isPinched || pr.isPinched) {
            setGestureText("PINCH LOCK · DRAG WINDOW OR SELECT");
          } else if (pointingHand) {
            // Point/dwell status was set above.
          } else if (hands.length > 0) {
            const activeG = [gl !== "none" ? `L:${gl}` : "", gr !== "none" ? `R:${gr}` : ""]
              .filter(Boolean)
              .join(" · ");
            setGestureText(activeG.toUpperCase() || "TRACKING HANDS");
          } else {
            setGestureText("SCANNING FOR HANDS...");
          }
        }

        setHandCount(hands.length);
        drawHUD(hands, pl, pr, gl, gr, Boolean(bothPinched), pointIndicator);
      });

      handsRef.current = hi;
      setEnabled(true);
      setLoading(false);

      const loop = () => {
        rafRef.current = requestAnimationFrame(loop);
        const v = videoRef.current;
        if (!v || v.readyState < 2 || sendingRef.current) return;
        sendingRef.current = true;
        hi.send({ image: v })
          .then(() => {
            sendingRef.current = false;
          })
          .catch(() => {
            sendingRef.current = false;
          });
      };
      loop();
    } catch (e) {
      setLoading(false);
      setEnabled(false);
      setError(e instanceof Error ? e.message : "Camera permission denied or unavailable");
    }
  }, [drawHUD, enabled, loading]);

  useEffect(() => {
    return () => {
      cancelAnimationFrame(rafRef.current);
      handsRef.current?.close();
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  return {
    videoRef,
    canvasRef,
    enabled,
    loading,
    error,
    fps,
    handCount,
    gestureText,
    start,
    stop,
  };
}
