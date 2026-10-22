"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { JarvisTarget } from "@/data/profile";

type Entry = { from: "you" | "jarvis"; text: string };

const HELP =
  'Try: "show projects", "take me to skills", "experience", "contact", "recruiter mode", or "hello".';

function interpret(raw: string): { target: JarvisTarget | null; reply: string } {
  const q = raw.toLowerCase();
  const go = (t: JarvisTarget | null, line: string) => ({ target: t, reply: line });

  if (/(recruit|resume|cv|simple)/.test(q))
    return go("recruiter", "Understood, sir. Switching to a clean recruiter briefing. No theatrics — just the facts.");
  if (/(project|work|portfolio|build)/.test(q))
    return go("projects", "Right away, sir. Pulling up the project bay — Mark I through your latest builds.");
  if (/(skill|stack|tech)/.test(q))
    return go("skills", "Scanning the armory, sir. These are the systems currently online.");
  if (/(experience|job|career|background|about)/.test(q))
    return go("experience", "Accessing service record, sir. Short version: full-stack, ships fast, learns faster.");
  if (/(contact|hire|email|reach|talk|discord|linkedin|github)/.test(q))
    return go("contact", "Opening a secure line, sir. All channels below — response time: impressively fast.");
  if (/(hello|hi|hey|jarvis|wake|status)/.test(q))
    return go(null, "At your service, sir. All systems nominal. Where shall we go first? " + HELP);
  if (/(thank|thanks)/.test(q)) return go(null, "Always a pleasure, sir.");
  if (/(top|home|start)/.test(q)) return go("top", "Returning to the launch pad, sir.");
  return go(null, "I didn't quite catch that, sir. " + HELP);
}

function speak(text: string) {
  try {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 1.02;
    u.pitch = 0.85;
    window.speechSynthesis.speak(u);
  } catch {
    /* audio is best-effort */
  }
}

export default function Jarvis({ onNavigate }: { onNavigate: (t: JarvisTarget) => void }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [log, setLog] = useState<Entry[]>([
    { from: "jarvis", text: "Good evening, sir. I'm JARVIS. Ask me to show you around — " + HELP },
  ]);
  const [listening, setListening] = useState(false);
  const recRef = useRef<{ stop: () => void } | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [log, open]);

  const send = useCallback(
    (raw: string) => {
      const text = raw.trim();
      if (!text) return;
      const { target, reply } = interpret(text);
      setLog((l) => [...l, { from: "you", text }, { from: "jarvis", text: reply }]);
      speak(reply);
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
      (window as unknown as { webkitSpeechRecognition?: new () => unknown; SpeechRecognition?: new () => unknown })
        .SpeechRecognition ??
      (window as unknown as { webkitSpeechRecognition?: new () => unknown }).webkitSpeechRecognition;
    if (!SR) {
      setLog((l) => [...l, { from: "jarvis", text: "Voice input isn't supported in this browser, sir — typing works just as well." }]);
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
        className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full border border-cyan-400/60 bg-slate-950/90 px-5 py-3 text-sm font-semibold tracking-widest text-cyan-300 shadow-[0_0_25px_rgba(0,216,255,.45)] backdrop-blur transition hover:bg-slate-900"
        aria-label="Talk to JARVIS"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-cyan-300" />
        </span>
        {open ? "CLOSE JARVIS" : "TALK TO JARVIS"}
      </button>

      {open && (
        <div className="fixed bottom-20 right-5 z-50 flex h-[420px] w-[min(92vw,360px)] flex-col overflow-hidden rounded-2xl border border-cyan-400/40 bg-slate-950/95 shadow-[0_0_40px_rgba(0,216,255,.3)] backdrop-blur">
          <div className="border-b border-cyan-400/25 px-4 py-3">
            <p className="text-xs font-bold tracking-[0.25em] text-cyan-300">J.A.R.V.I.S.</p>
            <p className="text-[11px] text-slate-400">Just A Rather Very Intelligent System · rule-based, offline</p>
          </div>
          <div className="flex-1 space-y-2 overflow-y-auto px-4 py-3 text-sm">
            {log.map((m, i) => (
              <div key={i} className={m.from === "you" ? "text-right" : "text-left"}>
                <span
                  className={
                    m.from === "you"
                      ? "inline-block rounded-xl rounded-br-sm bg-amber-400/90 px-3 py-1.5 text-slate-950"
                      : "inline-block rounded-xl rounded-bl-sm border border-cyan-400/30 bg-cyan-950/60 px-3 py-1.5 text-cyan-100"
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
              placeholder='Try "show projects"'
              className="min-w-0 flex-1 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
              aria-label="Ask JARVIS"
            />
            <button
              onClick={toggleVoice}
              className={`rounded-lg px-3 py-2 text-sm font-bold ${listening ? "bg-red-500 text-white" : "bg-slate-800 text-cyan-300"}`}
              aria-label="Voice input"
            >
              {listening ? "■" : "🎙"}
            </button>
            <button
              onClick={() => send(input)}
              className="rounded-lg bg-cyan-400 px-3 py-2 text-sm font-bold text-slate-950 hover:bg-cyan-300"
            >
              ▸
            </button>
          </div>
        </div>
      )}
    </>
  );
}
