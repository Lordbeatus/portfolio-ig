"use client";

import Link from "next/link";
import { profile } from "@/data/profile";

export default function RecruiterPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto max-w-3xl px-6 py-10 print:py-0">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black">{profile.name}</h1>
            <p className="mt-1 text-lg text-slate-600">{profile.title} · {profile.location}</p>
            <p className="mt-2 text-sm text-slate-600">
              <a className="underline" href={profile.contact.github}>{profile.contact.github}</a>
              {" · "}
              <a className="underline" href={profile.contact.linkedin}>LinkedIn</a>
              {" · "}Discord: {profile.contact.discord}
            </p>
          </div>
          <button
            onClick={() => window.print()}
            className="shrink-0 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-bold text-white print:hidden"
          >
            Print / PDF
          </button>
        </div>

        <section className="mt-8">
          <h2 className="text-xs font-bold tracking-[0.25em] text-slate-500">SUMMARY — 30 SECONDS</h2>
          <p className="mt-2 leading-relaxed text-slate-700">{profile.bio}</p>
          <p className="mt-2 text-sm font-semibold text-emerald-700">
            {profile.hireable ? "● Open to work — happy to share private-repo walkthroughs on request." : ""}
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xs font-bold tracking-[0.25em] text-slate-500">CORE SKILLS</h2>
          <div className="mt-2 grid gap-3 sm:grid-cols-2">
            {profile.skills.map((g) => (
              <div key={g.group} className="rounded-xl border border-slate-200 p-4">
                <p className="text-xs font-bold tracking-widest text-slate-500">{g.group.toUpperCase()}</p>
                <p className="mt-1 text-sm text-slate-700">{g.items.join(" · ")}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-xs font-bold tracking-[0.25em] text-slate-500">SELECTED PROJECTS</h2>
          <div className="mt-2 space-y-3">
            {profile.projects.map((p) => (
              <div key={p.name} className="rounded-xl border border-slate-200 p-4">
                <p className="font-bold">{p.name} <span className="font-normal text-slate-500">— {p.tags.join(", ")}</span></p>
                <p className="mt-1 text-sm text-slate-600">{p.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-xs font-bold tracking-[0.25em] text-slate-500">EXPERIENCE</h2>
          {profile.experience.map((e) => (
            <div key={e.role} className="mt-2 rounded-xl border border-slate-200 p-4">
              <p className="font-bold">{e.role} · <span className="font-normal">{e.org}</span></p>
              <p className="text-sm text-slate-500">{e.period}</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                {e.points.map((pt) => <li key={pt}>{pt}</li>)}
              </ul>
            </div>
          ))}
        </section>

        <div className="mt-10 flex gap-3 print:hidden">
          <Link href="/" className="rounded-full border border-slate-300 px-6 py-3 text-sm font-bold">
            ← Back to Stark mode
          </Link>
        </div>
      </div>
    </main>
  );
}
