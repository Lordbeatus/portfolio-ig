"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { profile } from "@/data/profile";

type Die = { value: number; held: boolean };
type BoardStop = { id: string; label: string; subtitle: string; detail: string; icon: string };

const board: BoardStop[] = [
  { id: "origin", label: "THE OPERATOR", subtitle: "START HERE", icon: "◉", detail: "Daniel Thomas — Lordbeatus. A builder who likes crossing disciplines: software, mathematics, visual design, and physical things you can actually hold." },
  { id: "quant", label: "STARWATCHER", subtitle: "QUANT BAY", icon: "✳", detail: "I like turning noisy markets into testable systems: strategy research, backtesting, data collection, and risk telemetry. The interesting part is making a hypothesis measurable." },
  { id: "mythos", label: "MYTHOS DREAM", subtitle: "HARDWARE BAY", icon: "⌁", detail: "Psychoacoustic headphones are a reminder that software doesn't have to stay on a screen. This work touches firmware, CAD, simulations, acoustic safety, and thermal comfort." },
  { id: "vision", label: "OPENVISION", subtitle: "SPATIAL LAB", icon: "◎", detail: "Browser-based spatial computing with MediaPipe hand landmarks, pinch detection, two-hand interactions, and floating panels. The interface becomes something you can reach into." },
  { id: "signs", label: "SPOKEN SIGNS", subtitle: "CV / ACCESSIBILITY", icon: "≋", detail: "A computer-vision pipeline for recognizing ASL, reorganizing meaning into natural English, and speaking it aloud. The goal is technology that helps people communicate." },
  { id: "ai", label: "TOASTY CORE", subtitle: "AI SYSTEMS", icon: "▦", detail: "AI infrastructure, evaluation pipelines, microservices, observability, and experiments with agent tooling. I enjoy the engineering behind making complex systems dependable." },
  { id: "build", label: "THE WORKBENCH", subtitle: "SIDE QUESTS", icon: "⚒", detail: "FastScribe, Classroom Genie, Olympiad Trainer, and other experiments sit at the intersection of education, productivity, and building tools that make hard things easier." },
  { id: "comms", label: "OPEN CHANNEL", subtitle: "LET'S CONNECT", icon: "↗", detail: "Want to build something strange and useful? Explore my repositories, connect on LinkedIn, or open the recruiter dossier for a compact overview of my work." },
];

const categories = ["Ones", "Twos", "Threes", "Fours", "Fives", "Sixes", "Three of a kind", "Four of a kind", "Full house", "Small straight", "Large straight", "Yahtzee", "Chance"] as const;
type Category = typeof categories[number];

function scoreFor(category: Category, values: number[]) {
  const counts = Array(7).fill(0) as number[];
  values.forEach((v) => counts[v]++);
  const total = values.reduce((a, b) => a + b, 0);
  const unique = [...new Set(values)].sort();
  const longestRun = unique.reduce((best, v, i) => i && v === unique[i - 1] + 1 ? best + 1 : 1, 1);
  switch (category) {
    case "Ones": return counts[1];
    case "Twos": return counts[2] * 2;
    case "Threes": return counts[3] * 3;
    case "Fours": return counts[4] * 4;
    case "Fives": return counts[5] * 5;
    case "Sixes": return counts[6] * 6;
    case "Three of a kind": return counts.some((n) => n >= 3) ? total : 0;
    case "Four of a kind": return counts.some((n) => n >= 4) ? total : 0;
    case "Full house": return counts.includes(3) && counts.includes(2) ? 25 : 0;
    case "Small straight": return /1234|2345|3456/.test(unique.join("")) || ["12345", "23456"].some((run) => unique.join("").includes(run.slice(0, 4))) ? 30 : 0;
    case "Large straight": return ["12345", "23456"].some((run) => unique.join("") === run) ? 40 : 0;
    case "Yahtzee": return counts.some((n) => n === 5) ? 50 : 0;
    case "Chance": return total;
  }
}

function DieFace({ value }: { value: number }) {
  const positions: Record<number, string[]> = {
    1: ["center"], 2: ["top-left", "bottom-right"], 3: ["top-left", "center", "bottom-right"],
    4: ["top-left", "top-right", "bottom-left", "bottom-right"],
    5: ["top-left", "top-right", "center", "bottom-left", "bottom-right"],
    6: ["top-left", "top-right", "middle-left", "middle-right", "bottom-left", "bottom-right"],
  };
  return <span className="star-die-pips">{positions[value].map((p) => <i key={p} className={p} />)}</span>;
}

export default function StarboardPage() {
  const [dice, setDice] = useState<Die[]>([2, 3, 4, 5, 1].map((value) => ({ value, held: false })));
  const [rollsLeft, setRollsLeft] = useState(3);
  const [shaking, setShaking] = useState(false);
  const [selectedStop, setSelectedStop] = useState(board[0]);
  const [scores, setScores] = useState<Partial<Record<Category, number>>>({});
  const [scoreCategory, setScoreCategory] = useState<Category>("Chance");
  const [turnMessage, setTurnMessage] = useState("Cup loaded. Lock any dice you want to keep, then shake.");
  const totalScore = useMemo(() => Object.values(scores).reduce((sum, n) => sum + (n || 0), 0), [scores]);
  const values = dice.map((d) => d.value);
  const previewScore = scoreFor(scoreCategory, values);

  function shakeCup() {
    if (rollsLeft <= 0 || shaking) return;
    setShaking(true);
    window.setTimeout(() => {
      setDice((previous) => previous.map((die) => die.held ? die : ({ ...die, value: 1 + Math.floor(Math.random() * 6) })));
      setRollsLeft((n) => n - 1);
      setShaking(false);
      setTurnMessage("Roll settled. Hold the keepers, or score a category before your next turn.");
    }, 700);
  }

  function scoreTurn() {
    if (scores[scoreCategory] !== undefined) {
      setTurnMessage("That category is already scored. Pick another open row.");
      return;
    }
    setScores((prev) => ({ ...prev, [scoreCategory]: scoreFor(scoreCategory, values) }));
    setTurnMessage(`${scoreCategory} locked in for ${scoreFor(scoreCategory, values)} points. Reset the cup for another turn.`);
    setRollsLeft(0);
  }

  function nextTurn() {
    setDice((prev) => prev.map((die) => ({ ...die, held: false })));
    setRollsLeft(3);
    setTurnMessage("Fresh turn. Three shakes. Make them count.");
  }

  return (
    <main className="starboard-shell">
      <header className="starboard-topbar">
        <Link href="/" className="starboard-back">← MALIBU GARAGE</Link>
        <div className="starboard-brand"><span className="starboard-reactor">✳</span><div><strong>STARK INDUSTRIES</strong><small>STARBOARD / FINANCE & PERSONAL INTEL</small></div></div>
        <span className="starboard-live"><i /> SIMULATION ONLINE</span>
      </header>

      <section className="starboard-hero">
        <div className="starboard-kicker">STATION 05 // PERSONAL FINANCE & FIELD NOTES</div>
        <h1>Welcome to the <em>Starboard.</em></h1>
        <p>A little board-game detour through my world. Shake the cup, roll the dice, and move around the board to discover the projects, ideas, and odd combinations that make me tick.</p>
        <div className="starboard-stats"><span><b>08</b> BOARD SPACES</span><span><b>05</b> DICE IN THE CUP</span><span><b>{totalScore}</b> POINTS BANKED</span></div>
      </section>

      <section className="starboard-game-grid">
        <div className="starboard-board-panel">
          <div className="starboard-panel-heading"><span><i className="tiny-reactor" /> THE BOARD</span><small>SELECT A SPACE TO EXPLORE</small></div>
          <div className="starboard-board">
            <div className="starboard-board-center"><span className="center-reactor">✳</span><strong>STARK<br />MALIBU</strong><small>FIELD NOTES / VOL. 01</small><div className="center-line" /><span className="center-tag">BUILT DIFFERENTLY</span></div>
            {board.map((stop, index) => <button key={stop.id} onClick={() => setSelectedStop(stop)} className={`board-space board-space-${index + 1} ${selectedStop.id === stop.id ? "selected" : ""}`} aria-pressed={selectedStop.id === stop.id}><span className="board-space-icon">{stop.icon}</span><span className="board-space-copy"><strong>{stop.label}</strong><small>{stop.subtitle}</small></span><span className="board-space-index">0{index + 1}</span></button>)}
            <div className="board-path path-a" /><div className="board-path path-b" />
          </div>
          <div className="starboard-board-footer"><span>CLICK ANY STATION</span><span>NO PURCHASE NECESSARY // JUST CURIOSITY</span></div>
        </div>

        <aside className="starboard-side-stack">
          <section className="starboard-panel about-stop-panel">
            <div className="starboard-panel-heading"><span><i className="tiny-reactor" /> OPEN FIELD NOTE</span><small>{selectedStop.subtitle}</small></div>
            <div className="field-note"><span className="field-note-index">FIELD NOTE / {String(board.findIndex((s) => s.id === selectedStop.id) + 1).padStart(2, "0")}</span><h2>{selectedStop.label}</h2><p>{selectedStop.detail}</p>
              {selectedStop.id === "comms" && <div className="starboard-contact-links"><a href={profile.contact.github} target="_blank" rel="noreferrer">GITHUB ↗</a><a href={profile.contact.linkedin} target="_blank" rel="noreferrer">LINKEDIN ↗</a><Link href="/recruiter">RECRUITER BRIEF ↗</Link></div>}
              {selectedStop.id === "quant" && <a className="starboard-inline-link" href="https://github.com/Lordbeatus/Starwatcher" target="_blank" rel="noreferrer">OPEN STARWATCHER REPO ↗</a>}
              {selectedStop.id === "vision" && <a className="starboard-inline-link" href="https://openvision.vercel.app" target="_blank" rel="noreferrer">TRY OPENVISION ↗</a>}
            </div>
          </section>

          <section className="starboard-panel dice-panel">
            <div className="starboard-panel-heading"><span><i className="tiny-reactor" /> SHAKE TO ROLL</span><small>YAHTZEE-INSPIRED / 5 DICE</small></div>
            <div className={`shaker-stage ${shaking ? "shaking" : ""}`}>
              <div className="cup-shadow" />
              <div className="shaker-cup"><div className="cup-lid" /><div className="cup-logo">S<span>✳</span></div><div className="cup-label">STARK<br />ATHLETICS</div><div className="cup-measure measure-one" /><div className="cup-measure measure-two" /></div>
              <div className="cup-rattle">RATTLE / SHAKE / ROLL</div>
            </div>
            <div className="dice-row">{dice.map((die, index) => <button key={index} onClick={() => setDice((prev) => prev.map((d, i) => i === index ? { ...d, held: !d.held } : d))} className={`star-die ${die.held ? "held" : ""}`} aria-label={`Die ${index + 1}: ${die.value}, ${die.held ? "held" : "not held"}`}><DieFace value={die.value} /><small>{die.held ? "LOCKED" : "HOLD?"}</small></button>)}</div>
            <div className="dice-controls"><button className="shake-button" onClick={shakeCup} disabled={rollsLeft === 0 || shaking}>{shaking ? "SHAKING..." : "↻ SHAKE THE CUP"}</button><button className="reset-button" onClick={nextTurn}>NEW TURN</button></div>
            <div className="dice-status"><span>{rollsLeft} / 3 SHAKES LEFT</span><span>{dice.filter((d) => d.held).length} DICE LOCKED</span></div>
            <p className="turn-message" aria-live="polite">{turnMessage}</p>
            <div className="score-select-row"><label htmlFor="score-category">SCORE AS</label><select id="score-category" value={scoreCategory} onChange={(e) => setScoreCategory(e.target.value as Category)}>{categories.filter((category) => scores[category] === undefined).map((category) => <option key={category} value={category}>{category}</option>)}</select><strong>{previewScore} PTS</strong></div>
            <button className="score-button" onClick={scoreTurn} disabled={rollsLeft === 3 || scores[scoreCategory] !== undefined}>LOCK SCORE / {scoreCategory.toUpperCase()}</button>
            <div className="scorecard"><div className="scorecard-head"><span>PERSONAL HIGH SCORE TABLE</span><strong>{totalScore} PTS</strong></div>{categories.map((category) => <button key={category} className={`score-row ${scores[category] !== undefined ? "scored" : ""}`} onClick={() => scores[category] === undefined && setScoreCategory(category)}><span>{category}</span><strong>{scores[category] === undefined ? "—" : scores[category]}</strong></button>)}</div>
          </section>
        </aside>
      </section>

      <footer className="starboard-footer"><span>STARK MALIBU WORKSHOP / STARBOARD MODULE</span><Link href="/">RETURN TO THE GARAGE ↗</Link><span>{profile.name.toUpperCase()} // {profile.alias.toUpperCase()}</span></footer>
    </main>
  );
}
