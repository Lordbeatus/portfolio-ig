"use client";

import Link from "next/link";
import { profile } from "@/data/profile";

export default function RecruiterPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto max-w-4xl px-6 py-10 print:py-2">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-4xl font-black tracking-tight">{profile.name}</h1>
              <span className="rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-bold text-emerald-800">
                OPEN TO WORK
              </span>
            </div>
            <p className="mt-1 text-lg font-medium text-slate-600">
              {profile.title} · {profile.location}
            </p>
            <p className="mt-2 text-sm text-slate-600">
              <a className="font-semibold text-sky-700 underline" href={profile.contact.github} target="_blank" rel="noreferrer">
                github.com/{profile.alias}
              </a>
              {" · "}
              <a className="font-semibold text-sky-700 underline" href={profile.contact.linkedin} target="_blank" rel="noreferrer">
                LinkedIn (daniel-thomas-792867422)
              </a>
              {" · "}Discord: <span className="font-mono font-semibold">{profile.contact.discord}</span>
            </p>
          </div>
          <div className="flex gap-2 print:hidden">
            <Link
              href="/"
              className="rounded-full border border-slate-300 px-4 py-2 text-xs font-bold text-slate-800 hover:bg-slate-100"
            >
              ← Interactive 3D Stark Garage
            </Link>
            <button
              onClick={() => window.print()}
              className="rounded-full bg-slate-900 px-5 py-2 text-xs font-bold text-white hover:bg-slate-800"
            >
              Print / Save PDF
            </button>
          </div>
        </div>

        <section className="mt-6">
          <h2 className="text-xs font-bold tracking-[0.22em] text-slate-500 uppercase">
            Executive Summary — 30-Second Read
          </h2>
          <p className="mt-2 leading-relaxed text-slate-700">{profile.bio}</p>
        </section>

        <section className="mt-7">
          <h2 className="text-xs font-bold tracking-[0.22em] text-slate-500 uppercase">
            Technical Stack & Systems
          </h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {profile.skills.map((g) => (
              <div key={g.group} className="rounded-xl border border-slate-200 p-3.5">
                <p className="text-xs font-bold tracking-wider text-slate-500 uppercase">{g.group}</p>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-800">{g.items.join(" · ")}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-7">
          <h2 className="text-xs font-bold tracking-[0.22em] text-slate-500 uppercase">
            Engineering Experience & Leadership
          </h2>
          <div className="mt-3 space-y-3">
            {profile.experience.map((e) => (
              <div key={e.role} className="rounded-xl border border-slate-200 p-4">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="font-bold text-slate-900">
                    {e.role} · <span className="font-normal text-slate-600">{e.org}</span>
                  </p>
                  <p className="text-xs font-semibold text-slate-500">{e.period}</p>
                </div>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-xs leading-relaxed text-slate-700">
                  {e.points.map((pt) => (
                    <li key={pt}>{pt}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-7">
          <h2 className="text-xs font-bold tracking-[0.22em] text-slate-500 uppercase">
            Selected Projects (Public, Private & Organization Repositories)
          </h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {profile.projects.map((p) => (
              <div key={p.id} className="rounded-xl border border-slate-200 p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-bold text-slate-900">{p.name}</p>
                  <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                    {p.visibility}
                  </span>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-slate-600">{p.description}</p>
                <ul className="mt-2 list-disc space-y-0.5 pl-4 text-[11px] text-slate-700">
                  {p.highlights.map((h) => (
                    <li key={h}>{h}</li>
                  ))}
                </ul>
                <p className="mt-2 text-[11px] font-medium text-slate-500">
                  {p.tags.join(" · ")}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
