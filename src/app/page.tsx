"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SplineScene from "@/components/SplineScene";
import Jarvis from "@/components/Jarvis";
import { profile, type JarvisTarget } from "@/data/profile";

const NAV: { id: string; label: string }[] = [
  { id: "about", label: "ABOUT" },
  { id: "skills", label: "SKILLS" },
  { id: "projects", label: "PROJECTS" },
  { id: "experience", label: "EXPERIENCE" },
  { id: "contact", label: "CONTACT" },
];

function scrollTo(target: JarvisTarget) {
  const el = target === "top" ? document.body : document.getElementById(target);
  if (!el && target === "top") {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  el?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Home() {
  const router = useRouter();
  const [recruiterMode, setRecruiterMode] = useState(false);
  const handleNavigate = useCallback(
    (t: JarvisTarget) => {
      if (t === "recruiter") {
        router.push("/recruiter");
        return;
      }
      scrollTo(t);
    },
    [router]
  );

  const clean = recruiterMode;

  return (
    <div className={clean ? "min-h-screen bg-white text-slate-900" : "min-h-screen bg-slate-950 text-slate-100"}>
      {/* NAV */}
      <header
        className={
          clean
            ? "sticky top-0 z-40 border-b bg-white/95 backdrop-blur"
            : "sticky top-0 z-40 border-b border-cyan-400/20 bg-slate-950/85 backdrop-blur"
        }
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
          <button onClick={() => scrollTo("top")} className="flex items-center gap-2">
            <span className={clean ? "text-xl" : "text-xl drop-shadow-[0_0_8px_rgba(0,216,255,.9)]"}>◉</span>
            <span className="text-sm font-bold tracking-[0.2em]">
              {profile.alias.toUpperCase()}{" "}<span className={clean ? "text-slate-400" : "text-cyan-300"}>{"// STARK OS"}</span>
            </span>
          </button>
          <nav className="hidden items-center gap-5 text-xs font-semibold tracking-widest md:flex">
            {NAV.map((n) => (
              <button key={n.id} onClick={() => scrollTo(n.id as JarvisTarget)} className="opacity-80 hover:opacity-100 hover:text-cyan-300">
                {n.label}
              </button>
            ))}
            <Link href="/recruiter" className="opacity-80 hover:opacity-100 hover:text-cyan-300">
              RECRUITER ↗
            </Link>
          </nav>
          <label className="flex cursor-pointer items-center gap-2 text-xs font-semibold tracking-wider">
            <span className={clean ? "text-slate-500" : "text-slate-400"}>RECRUITER MODE</span>
            <button
              role="switch"
              aria-checked={recruiterMode}
              onClick={() => setRecruiterMode((v) => !v)}
              className={`relative h-6 w-11 rounded-full transition ${recruiterMode ? "bg-emerald-500" : "bg-slate-700"}`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${recruiterMode ? "left-[22px]" : "left-0.5"}`}
              />
            </button>
          </label>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden">
        {!clean && <SplineScene />}
        <div className={`relative mx-auto max-w-6xl px-5 ${clean ? "py-16" : "py-28 md:py-36"}`}>
          <p className={`text-xs font-bold tracking-[0.3em] ${clean ? "text-slate-500" : "text-cyan-300"}`}>
            {profile.hireable ? "● AVAILABLE FOR WORK" : "STARK INDUSTRIES PORTFOLIO"}
          </p>
          <h1 className="mt-4 max-w-3xl text-5xl font-black leading-[1.02] md:text-7xl">
            {clean ? (
              <>
                {profile.name}
                <span className="block text-2xl font-semibold text-slate-500 md:text-3xl">{profile.title}</span>
              </>
            ) : (
              <>
                I AM
                <span className="block bg-gradient-to-r from-cyan-300 via-sky-400 to-amber-300 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(0,216,255,.35)]">
                  {profile.alias.toUpperCase()}
                </span>
              </>
            )}
          </h1>
          <p className={`mt-5 max-w-xl ${clean ? "text-slate-600" : "text-slate-300"}`}>
            {clean ? profile.bio : `${profile.tagline} ${profile.location} — ask JARVIS to give you the tour.`}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={() => scrollTo("projects")}
              className={`rounded-full px-6 py-3 text-sm font-bold tracking-widest ${clean ? "bg-slate-900 text-white" : "bg-cyan-400 text-slate-950 shadow-[0_0_25px_rgba(0,216,255,.5)] hover:bg-cyan-300"}`}
            >
              VIEW PROJECTS
            </button>
            <Link
              href="/recruiter"
              className={`rounded-full border px-6 py-3 text-sm font-bold tracking-widest ${clean ? "border-slate-300" : "border-cyan-400/50 text-cyan-200 hover:bg-cyan-400/10"}`}
            >
              RECRUITER BRIEF ↗
            </Link>
          </div>
          {!clean && (
            <div className="mt-10 flex gap-6 text-[11px] tracking-widest text-cyan-200/70">
              <span>PWR 100%</span>
              <span>SUIT v1.0</span>
              <span>JARVIS ● ONLINE</span>
            </div>
          )}
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className={`scroll-mt-20 border-t ${clean ? "border-slate-200" : "border-cyan-400/15"}`}>
        <div className="mx-auto max-w-6xl px-5 py-16">
          <SectionKicker clean={clean} index="01" label="ORIGIN STORY" />
          <div className="mt-4 grid gap-8 md:grid-cols-[2fr_1fr]">
            <p className={`text-lg leading-relaxed ${clean ? "text-slate-700" : "text-slate-300"}`}>
              {profile.bio} I&apos;m <strong>{profile.name}</strong> ({profile.alias}) — {profile.title.toLowerCase()}{" "}
              based in {profile.location}. Comfortable owning a feature end to end: Next.js UI, APIs, data, and
              deployment.
            </p>
            <div className={`rounded-2xl border p-5 text-sm ${clean ? "border-slate-200 bg-slate-50" : "border-cyan-400/25 bg-slate-900/60"}`}>
              <p className="font-bold tracking-widest text-xs opacity-70">BASE OF OPERATIONS</p>
              <p className="mt-1">{profile.location}</p>
              <p className="mt-3 font-bold tracking-widest text-xs opacity-70">STATUS</p>
              <p className="mt-1">{profile.hireable ? "Open to work 🟢" : "Not looking"}</p>
              <p className="mt-3 font-bold tracking-widest text-xs opacity-70">COMMS</p>
              <p className="mt-1">Discord: {profile.contact.discord}</p>
            </div>
          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills" className={`scroll-mt-20 border-t ${clean ? "border-slate-200 bg-slate-50" : "border-cyan-400/15 bg-slate-900/40"}`}>
        <div className="mx-auto max-w-6xl px-5 py-16">
          <SectionKicker clean={clean} index="02" label="ARMORY // SKILLS" />
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {profile.skills.map((g) => (
              <div
                key={g.group}
                className={`group rounded-2xl border p-5 transition duration-300 ${clean ? "border-slate-200 bg-white" : "border-cyan-400/20 bg-slate-950/70 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(0,216,255,.25)]"}`}
              >
                <p className={`text-xs font-bold tracking-[0.2em] ${clean ? "text-slate-500" : "text-amber-300"}`}>{g.group.toUpperCase()}</p>
                <ul className="mt-3 space-y-1.5 text-sm">
                  {g.items.map((s) => (
                    <li key={s} className={clean ? "text-slate-700" : "text-slate-200"}>
                      <span className={clean ? "text-emerald-600" : "text-cyan-300"}>▸ </span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects" className={`scroll-mt-20 border-t ${clean ? "border-slate-200" : "border-cyan-400/15"}`}>
        <div className="mx-auto max-w-6xl px-5 py-16">
          <SectionKicker clean={clean} index="03" label="PROJECT BAY" />
          <div className="mt-6 grid gap-5 md:grid-cols-3" style={!clean ? { perspective: "1200px" } : undefined}>
            {profile.projects.map((p) => (
              <a
                key={p.name}
                href={p.link}
                target="_blank"
                rel="noreferrer"
                className={`rounded-2xl border p-6 transition duration-300 ${clean ? "border-slate-200 bg-white hover:shadow-lg" : "border-cyan-400/20 bg-gradient-to-b from-slate-900 to-slate-950 hover:[transform:rotateX(4deg)_rotateY(-4deg)_translateY(-4px)] hover:shadow-[0_0_35px_rgba(0,216,255,.3)]"}`}
              >
                <p className={`text-xs font-bold tracking-[0.2em] ${clean ? "text-slate-400" : "text-cyan-300"}`}>MARK ▸ SUIT</p>
                <h3 className="mt-2 text-xl font-bold">{p.name}</h3>
                <p className={`mt-2 text-sm leading-relaxed ${clean ? "text-slate-600" : "text-slate-400"}`}>{p.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <span key={t} className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${clean ? "bg-slate-100 text-slate-600" : "bg-cyan-400/10 text-cyan-200"}`}>
                      {t}
                    </span>
                  ))}
                </div>
              </a>
            ))}
          </div>
          <p className={`mt-6 text-sm ${clean ? "text-slate-500" : "text-slate-500"}`}>
            Private repos hidden? Connect GitHub or edit <code>src/data/profile.ts</code> — every card renders from that one file.
          </p>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section id="experience" className={`scroll-mt-20 border-t ${clean ? "border-slate-200 bg-slate-50" : "border-cyan-400/15 bg-slate-900/40"}`}>
        <div className="mx-auto max-w-6xl px-5 py-16">
          <SectionKicker clean={clean} index="04" label="SERVICE RECORD" />
          <div className="mt-6 space-y-4">
            {profile.experience.map((e) => (
              <div key={e.role} className={`rounded-2xl border p-6 ${clean ? "border-slate-200 bg-white" : "border-cyan-400/20 bg-slate-950/70"}`}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-xl font-bold">{e.role} <span className="font-normal opacity-60">· {e.org}</span></h3>
                  <span className={`text-xs font-bold tracking-widest ${clean ? "text-slate-500" : "text-amber-300"}`}>{e.period}</span>
                </div>
                <ul className={`mt-3 list-disc space-y-1 pl-5 text-sm ${clean ? "text-slate-600" : "text-slate-300"}`}>
                  {e.points.map((pt) => (
                    <li key={pt}>{pt}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className={`scroll-mt-20 border-t ${clean ? "border-slate-200" : "border-cyan-400/15"}`}>
        <div className="mx-auto max-w-6xl px-5 py-16 text-center">
          <SectionKicker clean={clean} index="05" label="OPEN A CHANNEL" />
          <h2 className="mt-3 text-3xl font-black md:text-4xl">Ready to build the next suit?</h2>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a href={profile.contact.github} target="_blank" rel="noreferrer" className={`rounded-full px-6 py-3 text-sm font-bold ${clean ? "bg-slate-900 text-white" : "bg-cyan-400 text-slate-950 hover:bg-cyan-300"}`}>
              GITHUB ↗
            </a>
            <a href={profile.contact.linkedin} target="_blank" rel="noreferrer" className={`rounded-full border px-6 py-3 text-sm font-bold ${clean ? "border-slate-300" : "border-cyan-400/50 text-cyan-200 hover:bg-cyan-400/10"}`}>
              LINKEDIN ↗
            </a>
            <span className={`rounded-full border px-6 py-3 text-sm ${clean ? "border-slate-300 text-slate-600" : "border-slate-700 text-slate-300"}`}>
              Discord: {profile.contact.discord}
            </span>
          </div>
        </div>
      </section>

      <footer className={`border-t px-5 py-6 text-center text-xs tracking-widest ${clean ? "border-slate-200 text-slate-400" : "border-cyan-400/15 text-slate-500"}`}>
        {profile.name.toUpperCase()} · {profile.location.toUpperCase()} · PROOF THAT {profile.alias.toUpperCase()} HAS A HEART
      </footer>

      {!clean && <Jarvis onNavigate={handleNavigate} />}
      {clean && (
        <button
          onClick={() => setRecruiterMode(false)}
          className="fixed bottom-5 right-5 z-50 rounded-full bg-slate-900 px-5 py-3 text-sm font-bold tracking-widest text-white shadow-lg"
        >
          ← BACK TO STARK MODE
        </button>
      )}
    </div>
  );
}

function SectionKicker({ index, label, clean }: { index: string; label: string; clean: boolean }) {
  return (
    <p className={`text-xs font-bold tracking-[0.3em] ${clean ? "text-slate-500" : "text-cyan-300"}`}>
      <span className={clean ? "text-slate-300" : "text-amber-300"}>{index} ▸ </span>
      {label}
    </p>
  );
}
