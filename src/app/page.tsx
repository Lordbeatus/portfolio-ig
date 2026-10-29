"use client";

import { useState } from "react";
import Link from "next/link";
import Spline from "@splinetool/react-spline";
import GameWorld3D from "@/components/GameWorld3D";
import { profile } from "@/data/profile";

const splineScene = "https://my.spline.design/portfoliogameworld-oj5yNeTSx4zYr1Kac3ayQFlv/";

export default function Home() {
  const [filter, setFilter] = useState("All");
  const categories = ["All", "AI & ML", "Spatial", "Hardware", "Systems"];
  const projectCategory = (tags: string[]) => {
    if (tags.some((tag) => /vision|mediapipe|webgl|spatial|asl|computer vision/i.test(tag))) return "Spatial";
    if (tags.some((tag) => /firmware|cad|audio|psychoacoustics|signal processing/i.test(tag))) return "Hardware";
    if (tags.some((tag) => /python|codebert|kafka|fastapi|llm|ai|machine learning/i.test(tag))) return "AI & ML";
    return "Systems";
  };
  const projects = profile.projects.filter((project) => filter === "All" || projectCategory(project.tags) === filter);

  return (
    <main className="portfolio-shell">
      <div className="grain" aria-hidden="true" />
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Lordbeatus home">
          <span className="brand-mark">L<span>·</span></span>
          <span><strong>LORDBEATUS</strong><small>INDEPENDENT BUILDER / LA</small></span>
        </a>
        <nav className="nav-links" aria-label="Main navigation">
          <a href="#world">World</a><a href="#projects">Projects</a><a href="#about">About</a>
        </nav>
        <Link className="nav-cta" href="/recruiter">Recruiter brief <span>↗</span></Link>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <div className="eyebrow"><span className="status-pulse" /> PORTFOLIO / BUILD 001 <span className="eyebrow-line" /></div>
          <h1>Ideas become<br /><em>playable worlds.</em></h1>
          <p className="hero-intro">I’m Daniel — a full-stack engineer and creative technologist building at the intersection of AI, spatial computing, hardware, and the web.</p>
          <div className="hero-actions">
            <a className="button button-primary" href="#world">Explore the world <span>↓</span></a>
            <a className="button button-quiet" href="#projects">Browse projects <span>↗</span></a>
          </div>
          <div className="hero-meta">
            <div><span className="meta-label">CURRENT MODE</span><strong><i className="tiny-dot" /> BUILDING THINGS</strong></div>
            <div><span className="meta-label">BASE</span><strong>LOS ANGELES, CA</strong></div>
          </div>
        </div>
        <div className="hero-scene">
          <div className="scene-topline"><span>LIVE ENVIRONMENT</span><span>01 / 03</span></div>
          <div className="spline-frame">
            <Spline scene={splineScene} />
            <div className="scene-gradient" />
            <div className="scene-label"><span className="scene-label-icon">✳</span><div><strong>THE PORTFOLIO ISLAND</strong><small>Interactive 3D environment · Spline</small></div></div>
            <div className="scene-crosshair">+</div>
          </div>
          <div className="scene-bottomline"><span>DRAG TO EXPLORE</span><span>DESIGNED / ENGINEERED / ITERATED</span></div>
        </div>
        <div className="hero-index">01 <span>—</span> INTRODUCTION</div>
      </section>

      <section className="ticker" aria-label="Areas of work">
        <span>THINGS I BUILD</span><b>✳</b><span>AI SYSTEMS</span><b>✳</b><span>SPATIAL INTERFACES</span><b>✳</b><span>HARDWARE + FIRMWARE</span><b>✳</b><span>FULL-STACK PRODUCTS</span>
      </section>

      <section className="world-section section-pad" id="world">
        <div className="section-heading">
          <div><div className="eyebrow">02 / INTERACTIVE MAP</div><h2>A little world<br /><em>of things I make.</em></h2></div>
          <p>Not another wall of cards. Orbit the map, explore the project stations, and get a feel for the different systems I like to bring to life.</p>
        </div>
        <div className="world-panel">
          <div className="world-panel-head"><span><i className="tiny-dot" /> WORLD SIMULATION / ONLINE</span><span>LOW-POLY FIELD NOTES</span></div>
          <GameWorld3D />
          <div className="world-panel-foot"><span>01 — THE AI LAB</span><span>02 — VISION STUDIO</span><span>03 — MYTHOS WORKSHOP</span><span>04 — QUANT ARCADE</span></div>
        </div>
        <p className="world-caption">A small interactive Three.js environment built as a readable game space: a central path, clear landmarks, project stations, and a calmer visual hierarchy.</p>
      </section>

      <section className="projects-section section-pad" id="projects">
        <div className="section-heading projects-heading">
          <div><div className="eyebrow">03 / SELECTED BUILDS</div><h2>Different tools.<br /><em>Same curiosity.</em></h2></div>
          <p>From real-time computer vision to firmware and AI infrastructure, these are the experiments and systems behind the world.</p>
        </div>
        <div className="filter-row" role="group" aria-label="Filter projects">
          {categories.map((category) => <button key={category} className={filter === category ? "filter-chip active" : "filter-chip"} onClick={() => setFilter(category)}>{category}</button>)}
          <span className="project-count">{projects.length.toString().padStart(2, "0")} PROJECTS</span>
        </div>
        <div className="project-grid">
          {projects.map((project, index) => (
            <article className="project-card" key={project.id}>
              <div className={"project-art art-" + (index % 5)}>
                <span className="project-number">{String(index + 1).padStart(2, "0")}</span>
                <span className="art-orbit orbit-one" /><span className="art-orbit orbit-two" />
                <span className="art-core">{["✳", "◉", "⌘", "⌁", "◇"][index % 5]}</span>
                <span className="project-category">{projectCategory(project.tags)}</span>
              </div>
              <div className="project-card-content">
                <div className="project-title-row"><h3>{project.name}</h3><span className="visibility">{project.visibility}</span></div>
                <p>{project.description}</p>
                <div className="tag-list">{project.tags.slice(0, 4).map((tag) => <span key={tag}>{tag}</span>)}</div>
                <a className="project-link" href={project.liveUrl || project.link} target="_blank" rel="noreferrer">Explore build <span>↗</span></a>
              </div>
            </article>
          ))}
        </div>
        <div className="all-projects-note"><span>MORE EXPERIMENTS LIVE IN THE REPOSITORIES</span><a href={profile.contact.github} target="_blank" rel="noreferrer">Visit GitHub ↗</a></div>
      </section>

      <section className="about-section section-pad" id="about">
        <div className="about-left"><div className="eyebrow">04 / THE BUILDER</div><h2>Curiosity is<br /><em>the common thread.</em></h2><p>{profile.bio}</p><div className="about-links"><a href={profile.contact.github} target="_blank" rel="noreferrer">GitHub ↗</a><a href={profile.contact.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a><a href={profile.contact.linkedin} target="_blank" rel="noreferrer">Say hello ↗</a></div></div>
        <div className="skills-panel"><div className="skills-panel-head"><span>TOOLKIT / LOADOUT</span><span>SELECTED SKILLS</span></div>
          {profile.skills.map((group, index) => <div className="skill-row" key={group.group}><span className="skill-index">0{index + 1}</span><div><h3>{group.group}</h3><p>{group.items.join(" · ")}</p></div><span className="skill-arrow">↗</span></div>)}
        </div>
      </section>

      <footer className="footer">
        <a className="brand" href="#top"><span className="brand-mark">L<span>·</span></span><span><strong>LORDBEATUS</strong><small>MADE WITH INTENT.</small></span></a>
        <p>Built to be explored, not just scrolled.</p>
        <a href="#top">BACK TO TOP ↑</a>
        <span className="footer-year">© {new Date().getFullYear()}</span>
      </footer>
    </main>
  );
}
