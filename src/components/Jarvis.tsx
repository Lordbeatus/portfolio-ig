"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { profile, type JarvisTarget } from "@/data/profile";

type Entry = { from: "you" | "jarvis"; text: string };

const HELP =
  'Try: "zoom out to garage", "go to gauntlet", "show neural server", "mythos helmet", "trading table", "workbench", "enable hand tracking", or "recruiter mode".';

export function interpretJarvis(raw: string): { target: JarvisTarget | null; reply: string } {
  const q = raw.toLowerCase();
  const go = (t: JarvisTarget | null, line: string) => ({ target: t, reply: line });

  if (/(recruit|resume|cv|dossier|simple|print)/.test(q)) {
    return go(
      "recruiter",
      "Understood, sir. Switching to the clean Recruiter Dossier — full project breakdown, zero theatrics."
    );
  }
  if (/(hand|camera|vision|pinch|gesture|webcam)/.test(q)) {
    return go(
      "vision",
      "Engaging OpenVision optical hand tracking, sir. Pinch thumb and index to drag HUD windows, or pinch both hands to zoom and rotate the workshop."
    );
  }
  if (/(spline)/.test(q)) {
    return go(
      "spline",
      "Toggling the Spline 3D runtime bay, sir."
    );
  }
  if (/(overview|garage|shop|zoom out|whole|all|reset|home|top)/.test(q)) {
    return go(
      "overview",
      "Pulling camera back to full Malibu Garage overview, sir. All seven engineering stations are online."
    );
  }
  if (/(gauntlet|asl|spoken|sign|openvision|cv)/.test(q)) {
    return go("gauntlet", profile.stations.find((s) => s.id === "gauntlet")!.jarvisLine);
  }
  if (/(helmet|mythos|headphone|audio|jarvis|voice)/.test(q)) {
    return go("helmet", profile.stations.find((s) => s.id === "helmet")!.jarvisLine);
  }
  if (/(server|toasty|analytics|codebert|ai|chewbacca|rack)/.test(q)) {
    return go("server", profile.stations.find((s) => s.id === "server")!.jarvisLine);
  }
  if (/(trad|quant|starwatcher|toastimer|crypto|blockchain|table)/.test(q)) {
    return go("trading", profile.stations.find((s) => s.id === "trading")!.jarvisLine);
  }
  if (/(workbench|bench|fastscribe|anki|youtube|classroom|olympiad|usc)/.test(q)) {
    return go("workbench", profile.stations.find((s) => s.id === "workbench")!.jarvisLine);
  }
  if (/(comm|contact|hire|email|discord|linkedin|github|reach)/.test(q)) {
    return go("comms", profile.stations.find((s) => s.id === "comms")!.jarvisLine);
  }
  if (/(reactor|core|about|who|bio|daniel|skill|stack)/.test(q)) {
    return go("reactor", profile.stations.find((s) => s.id === "reactor")!.jarvisLine);
  }
  if (/(project|work|build|repo|private)/.test(q)) {
    return go(
      "server",
      "Routing to your private & org engineering bays, sir — starting with Toasty-Analytics on the Neural Server Rack."
    );
  }
  if (/(hello|hi|hey|wake|status)/.test(q)) {
    return go(
      null,
      "At your service, sir. Workshop power at 100%, all 7 stations and optical hand-tracking ready. " + HELP
    );
  }
  return go(null, "I didn't quite catch that frequency, sir. " + HELP);
}

export function speakJarvis(text: string) {
  try {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 1.04;
    u.pitch = 0.86;
    window.speechSynthesis.speak(u);
  } catch {
    /* best-effort speech */
  }
}

const QUICK_CHIPS: { label: string; command: string }[] = [
  { label: "Full Garage", command: "zoom out to garage" },
  { label: "Arc Core", command: "go to arc reactor" },
  { label: "CV Gauntlet", command: "go to gauntlet" },
  { label: "Mythos Helmet", command: "mythos helmet" },
  { label: "AI Server Rack", command: "show neural server" },
  { label: "Quant Table", command: "trading table" },
  { label: "Workbench", command: "workbench" },
  { label: "Hand Tracking", command: "enable hand tracking" },
];

export default function Jarvis({
  onNavigate,
  externalAnnouncement,
}: {
  onNavigate: (t: JarvisTarget) => void;
  externalAnnouncement?: string | null;
}) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [log, setLog] = useState<Entry[]>([
    {
      from: "jarvis",
      text: "Welcome to the Malibu Workshop, sir. Click any 3D station, use Vision Pro hand gestures, or tell me where to fly the camera. " + HELP,
    },
  ]);
  const [listening, setListening] = useState(false);
  const recRef = useRef<{ stop: () => void } | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const lastAnnounced = useRef<string | null>(null);

  useEffect(() => {
    if (externalAnnouncement && externalAnnouncement !== lastAnnounced.current) {
      lastAnnounced.current = externalAnnouncement;
      setLog((l) => [...l, { from: "jarvis", text: externalAnnouncement }]);
    }
  }, [externalAnnouncement]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [log, open]);

  const send = useCallback(
    (raw: string) => {
      const text = raw.trim();
      if (!text) return;
      const { target, reply } = interpretJarvis(text);
      setLog((l) => [...l, { from: "you", text }, { from: "jarvis", text: reply }]);
      speakJarvis(reply);
      if (target) onNavigate(target);
      setInput("");
    },
    [onNavigate]
  );

  const toggleVoice = useCallback(() => {
    if (listening) {
      recRef.current?.stop();
      setListening(false);
      return;
    }
    const SR =
      (
        window as unknown as {
          webkitSpeechRecognition?: new () => unknown;
          SpeechRecognition?: new () => unknown;
        }
      ).SpeechRecognition ??
      (window as unknown as { webkitSpeechRecognition?: new () => unknown }).webkitSpeechRecognition;

    if (!SR) {
      setLog((l) => [
        ...l,
        {
          from: "jarvis",
          text: "Browser speech recognition isn't available in this tab, sir — use the command line or quick-bay chips below.",
        },
      ]);
      return;
    }
    try {
      const rec = new (SR as new () => {
        lang: string;
        interimResults: boolean;
        onresult: ((e: { results: { [i: number]: { [j: number]: { transcript: string } } } }) => void) | null;
        onend: (() => void) | null;
        start: () => void;
        stop: () => void;
      })();
      rec.lang = "en-US";
      rec.interimResults = false;
      rec.onresult = (e) => {
        const heard = e.results[0]?.[0]?.transcript ?? "";
        if (heard) send(heard);
      };
      rec.onend = () => setListening(false);
      recRef.current = rec;
      rec.start();
      setListening(true);
    } catch {
      setListening(false);
    }
  }, [listening, send]);

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed right-5 bottom-5 z-50 flex items-center gap-2.5 rounded-full border border-cyan-400/70 bg-slate-950/90 px-5 py-3 text-xs font-bold tracking-[0.2em] text-cyan-300 shadow-[0_0_30px_rgba(0,216,255,.45)] backdrop-blur-md transition hover:border-amber-400 hover:text-amber-300"
        aria-label="Talk to JARVIS"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-cyan-300" />
        </span>
        {open ? "HIDE J.A.R.V.I.S." : "TALK TO J.A.R.V.I.S."}
      </button>

      {open && (
        <div className="fixed right-5 bottom-20 z-50 flex h-[470px] w-[min(92vw,390px)] flex-col overflow-hidden rounded-2xl border border-cyan-400/45 bg-slate-950/92 shadow-[0_0_50px_rgba(0,216,255,.32)] backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-cyan-400/25 px-4 py-3">
            <div>
              <p className="font-mono text-xs font-bold tracking-[0.25em] text-cyan-300">
                J.A.R.V.I.S. WORKSHOP OS
              </p>
              <p className="text-[11px] text-slate-400">
                Voice + Text 3D Camera & Spatial Bay Navigator
              </p>
            </div>
            <span className="rounded border border-emerald-400/40 bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] text-emerald-300">
              ONLINE
            </span>
          </div>

          {/* Quick command chips */}
          <div className="flex flex-wrap gap-1.5 border-b border-slate-800/80 bg-slate-900/50 px-3 py-2">
            {QUICK_CHIPS.map((c) => (
              <button
                key={c.label}
                onClick={() => send(c.command)}
                className="rounded-md border border-cyan-500/30 bg-cyan-950/40 px-2 py-1 font-mono text-[10px] text-cyan-200 transition hover:border-amber-400/60 hover:bg-amber-500/20 hover:text-amber-200"
              >
                {c.label}
              </button>
            ))}
          </div>

          <div className="flex-1 space-y-2.5 overflow-y-auto px-4 py-3 text-xs leading-relaxed">
            {log.map((m, i) => (
              <div key={i} className={m.from === "you" ? "text-right" : "text-left"}>
                <span
                  className={
                    m.from === "you"
                      ? "inline-block rounded-xl rounded-br-sm bg-amber-400 px-3 py-1.5 font-semibold text-slate-950"
                      : "inline-block rounded-xl rounded-bl-sm border border-cyan-400/30 bg-cyan-950/60 px-3 py-2 text-cyan-100"
                  }
                >
                  {m.text}
                </span>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          <div className="flex gap-2 border-t border-cyan-400/25 p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send(input)}
              placeholder='Ask JARVIS ("go to gauntlet", "zoom out")'
              className="min-w-0 flex-1 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
              aria-label="Ask JARVIS"
            />
            <button
              onClick={toggleVoice}
              className={`rounded-lg px-3 py-2 text-xs font-bold transition ${
                listening
                  ? "animate-pulse bg-red-500 text-white"
                  : "border border-cyan-500/30 bg-slate-900 text-cyan-300 hover:border-cyan-400"
              }`}
              aria-label="Voice input"
              title="Speak to JARVIS"
            >
              {listening ? "■" : "🎙"}
            </button>
            <button
              onClick={() => send(input)}
              className="rounded-lg bg-cyan-400 px-3.5 py-2 text-xs font-bold text-slate-950 hover:bg-cyan-300"
            >
              ▸
            </button>
          </div>
        </div>
      )}
    </>
  );
}
