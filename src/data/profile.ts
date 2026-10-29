export type StationId =
  | "overview"
  | "reactor"
  | "gauntlet"
  | "helmet"
  | "server"
  | "trading"
  | "workbench"
  | "comms";

export type JarvisTarget = StationId | "recruiter" | "vision" | "spline";

export interface GarageStation {
  id: Exclude<StationId, "overview">;
  code: string;
  name: string;
  subtitle: string;
  category: string;
  color: string;
  position: [number, number, number];
  cameraPos: [number, number, number];
  lookAt: [number, number, number];
  summary: string;
  specs: { label: string; value: string }[];
  relatedProjects: string[];
  jarvisLine: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  codename: string;
  station: Exclude<StationId, "overview">;
  visibility: "Public" | "Private" | "Organization";
  description: string;
  highlights: string[];
  tags: string[];
  link: string;
  liveUrl?: string;
}

export const profile = {
  name: "Daniel Thomas",
  alias: "Lordbeatus",
  title: "Full-Stack & Spatial Systems Engineer",
  location: "Los Angeles, California",
  tagline:
    "Inside the Malibu Workshop: AI agents, spatial CV interfaces, hardware-software audio systems, and full-stack platforms.",
  bio: "Full-stack engineer and builder based in Los Angeles. Co-creating hardware/firmware systems at Mythos and real-time ASL computer vision at Spoken Signs, while shipping microservices, AI agent evaluation frameworks, quantitative trading engines, and WebGL/spatial interfaces.",
  hireable: true,
  contact: {
    github: "https://github.com/Lordbeatus",
    linkedin: "https://www.linkedin.com/in/daniel-thomas-792867422/",
    discord: "smiling0705",
  },
  splinePresets: [
    {
      id: "workshop",
      label: "Procedural Stark Garage (Three.js)",
      url: "",
      note: "Interactive 7-station 3D workshop with real-time camera flight & CV hand controls",
    },
    {
      id: "spline-bot",
      label: "Spline 3D Interactive Droid",
      url: "https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode",
      note: "Live interactive `.splinecode` scene rendered via @splinetool/react-spline",
    },
  ],
  stations: [
    {
      id: "reactor",
      code: "MK-I CORE",
      name: "Arc Reactor Pedestal",
      subtitle: "Identity, Bio & Core Architecture",
      category: "Bio & Mission",
      color: "#00d8ff",
      position: [0, 1.35, 0],
      cameraPos: [0, 2.3, 4.2],
      lookAt: [0, 1.3, 0],
      summary:
        "The central power core of the workshop. Daniel Thomas (Lordbeatus) builds across full-stack web, autonomous AI agents, computer vision, and embedded hardware.",
      specs: [
        { label: "OPERATOR", value: "Daniel Thomas (Lordbeatus)" },
        { label: "BASE", value: "Los Angeles, CA" },
        { label: "PRIMARY STACK", value: "Next.js · TypeScript · Python · Three.js" },
        { label: "R&D FOCUS", value: "Spatial CV · AI Agents · Rust & Web3 · Embedded" },
      ],
      relatedProjects: ["jarvis", "portfolio-ig"],
      jarvisLine:
        "Focusing on the central Arc Reactor, sir. Operator profile: Daniel Thomas — full-stack architect, spatial computing builder, and AI systems engineer.",
    },
    {
      id: "gauntlet",
      code: "CV-OPTICS",
      name: "Mark XLII Gauntlet Rig",
      subtitle: "Computer Vision, ASL & Spatial Computing",
      category: "CV & Spatial UI",
      color: "#a855f7",
      position: [-4.4, 1.4, -1.6],
      cameraPos: [-2.4, 2.2, 1.5],
      lookAt: [-4.4, 1.3, -1.6],
      summary:
        "Optical hand-tracking and gesture lab. Powers Spoken Signs (live ASL-to-English CV + TTS translation) and OpenVision (Apple Vision Pro-style MediaPipe hand tracking, pinch-drag panels, and two-hand zoom in the browser).",
      specs: [
        { label: "TRACKING", value: "MediaPipe 21-Landmark Hand Rig @ 30fps+" },
        { label: "GESTURES", value: "Pinch Drag · Two-Hand Zoom/Orbit · Open Palm" },
        { label: "ASL PIPELINE", value: "CV Sign Detection → Grammar LLM → Real-time TTS" },
        { label: "PRIVACY", value: "100% On-Device WebAssembly & WebGL" },
      ],
      relatedProjects: ["spoken-signs", "openvision"],
      jarvisLine:
        "Approaching the Mark XLII Gauntlet Rig, sir. This station houses your Spoken Signs ASL translator and the OpenVision spatial hand-tracking engine.",
    },
    {
      id: "helmet",
      code: "MYTHOS-OS",
      name: "Acoustic HUD Helmet Bay",
      subtitle: "Mythos Dream Hardware, Firmware & Audio DSP",
      category: "Hardware & Audio",
      color: "#f59e0b",
      position: [4.4, 1.45, -1.6],
      cameraPos: [2.4, 2.2, 1.5],
      lookAt: [4.4, 1.35, -1.6],
      summary:
        "Hardware-software lab for Mythos Official. Engineering Mythos Dream — psychoacoustic headphones with active noise cancellation, cooling cushions, firmware signaling, CAD enclosures, and hearing-safety algorithms.",
      specs: [
        { label: "ORGANIZATION", value: "Mythos-Official" },
        { label: "MODULES", value: "Mythos-Firmware · Mythos-CADS · Mythos-App · Simulations" },
        { label: "INNOVATION", value: "Psychoacoustic Safety + Active Thermal Cooling" },
        { label: "VOICE / AGENT", value: "JARVIS Meeting-Prep & Hotword Voice Assistant" },
      ],
      relatedProjects: ["mythos", "jarvis"],
      jarvisLine:
        "Inspecting the Acoustic Helmet Bay, sir. Your Mythos Dream headphone firmware, CAD simulations, and JARVIS voice systems are online.",
    },
    {
      id: "server",
      code: "AI-CORE",
      name: "Toasty Neural Server Rack",
      subtitle: "AI Microservices, Meta-Learning & Agent Tooling",
      category: "AI & Distributed Systems",
      color: "#10b981",
      position: [-3.2, 1.8, -4.6],
      cameraPos: [-1.8, 2.3, -1.4],
      lookAt: [-3.2, 1.6, -4.6],
      summary:
        "High-density AI compute rack running Toasty-Analytics (CodeBERT neural code grading, federated meta-learning, Kafka, Istio, OpenTelemetry) and Chewbacca (unified skills, rules, and memory sync across coding agents).",
      specs: [
        { label: "ARCHITECTURE", value: "4 Microservices + API Gateway + Istio Mesh" },
        { label: "ML ENGINE", value: "CodeBERT Graders + Federated Meta-Learning" },
        { label: "OBSERVABILITY", value: "OpenTelemetry · Jaeger · Prometheus · Grafana" },
        { label: "AGENT INFRA", value: "Chewbacca Multi-Agent Dotfiles & MCP Sync" },
      ],
      relatedProjects: ["toasty-analytics", "chewbacca"],
      jarvisLine:
        "Routing to the Neural Server Rack, sir. Toasty-Analytics microservices, CodeBERT graders, and Chewbacca agent infrastructure are running at peak efficiency.",
    },
    {
      id: "trading",
      code: "QUANT-HUD",
      name: "Starboard Finance Table",
      subtitle: "Finance, Strategy Games & Quant Systems",
      category: "Quant & Full-Stack",
      color: "#38bdf8",
      position: [3.2, 1.25, -4.6],
      cameraPos: [1.8, 2.3, -1.4],
      lookAt: [3.2, 1.2, -4.6],
      summary:
        "The Starboard is the finance and strategy corner of the Malibu garage: Starwatcher quantitative research, backtesting and market analytics, plus a playful board-game miniworld for exploring the ideas and experiences behind the builder.",
      specs: [
        { label: "QUANT ENGINE", value: "Automated Backtesting, Bots & Alpha Scrapers" },
        { label: "PRODUCTIVITY", value: "Toastimer Full-Stack App + Browser Extension" },
        { label: "EXPERIMENTAL", value: "Toastchain Session Proof & Anti-Bot Minigames" },
        { label: "LIVE APP", value: "app.toastimer.me" },
      ],
      relatedProjects: ["starwatcher", "toastimer"],
      jarvisLine:
        "Pulling up the Starwatcher Holo-Table, sir. Quantitative backtesting feeds and Toastimer productivity telemetry are live.",
    },
    {
      id: "workbench",
      code: "EDTECH-BAY",
      name: "Fabrication Workbench",
      subtitle: "FastScribe, Classroom Genie & Student Platforms",
      category: "Full-Stack Products",
      color: "#ec4899",
      position: [-4.6, 1.15, 2.4],
      cameraPos: [-2.1, 2.1, 4.4],
      lookAt: [-4.6, 1.1, 2.4],
      summary:
        "Rapid prototyping bench where student and community tools are forged: FastScribe (zero-cost YouTube-to-Anki flashcard pipeline with Whisper + GPT-4), Classroom Genie, Olympiad Trainer, and USC Trojan Tech Solutions.",
      specs: [
        { label: "AUDIO → ANKI", value: "yt-dlp + Whisper + GPT-4 / Copilot Free Mode" },
        { label: "CLASSROOM", value: "Flask + HuggingFace + React Render Deployment" },
        { label: "COMPETITIVE", value: "Olympiad-Trainer (Olympiadsarefun.com)" },
        { label: "COMMUNITY", value: "USCTTS (usctts.com) & TypeRip Font Extractor" },
      ],
      relatedProjects: ["fastscribe", "classroom-genie", "olympiad-trainer", "usctts"],
      jarvisLine:
        "At the Fabrication Workbench, sir. FastScribe, Classroom Genie, Olympiad Trainer, and USCTTS are ready for inspection.",
    },
    {
      id: "comms",
      code: "COMMS-ARRAY",
      name: "Stark Comms Terminal",
      subtitle: "Direct Uplink, Links & Recruiter Dossier",
      category: "Contact & Hiring",
      color: "#fbbf24",
      position: [4.6, 1.3, 2.4],
      cameraPos: [2.1, 2.1, 4.4],
      lookAt: [4.6, 1.2, 2.4],
      summary:
        "Encrypted communications uplink. Connect with Daniel via GitHub, LinkedIn, or Discord — or launch the clean printable Recruiter Dossier for a 30-second executive scan.",
      specs: [
        { label: "GITHUB", value: "github.com/Lordbeatus" },
        { label: "LINKEDIN", value: "daniel-thomas-792867422" },
        { label: "DISCORD", value: "smiling0705" },
        { label: "STATUS", value: "OPEN TO ROLES & COLLABORATIONS" },
      ],
      relatedProjects: ["portfolio-ig"],
      jarvisLine:
        "Opening a secure frequency on the Comms Terminal, sir. All hiring channels and the printable Recruiter Dossier are standing by.",
    },
  ] satisfies GarageStation[],
  skills: [
    {
      group: "Frontend & Spatial 3D",
      items: [
        "React 19",
        "Next.js (App Router)",
        "TypeScript",
        "Three.js / React Three Fiber",
        "Spline 3D",
        "Tailwind CSS",
        "MediaPipe Hands CV",
        "WebGL / Canvas 2D",
      ],
    },
    {
      group: "AI, ML & Computer Vision",
      items: [
        "PyTorch / CodeBERT",
        "OpenAI Whisper & GPT-4",
        "Hermes / LLM Tool Calling",
        "ASL Sign Detection (CV)",
        "Federated & Meta-Learning",
        "Vosk Offline Speech",
        "HuggingFace",
      ],
    },
    {
      group: "Backend & Distributed Systems",
      items: [
        "Python (FastAPI, Flask)",
        "Node.js",
        "PostgreSQL & Redis",
        "Kafka & RabbitMQ",
        "GraphQL & REST",
        "Appwrite",
        "JWT / RBAC Security",
      ],
    },
    {
      group: "Cloud, DevOps & Hardware",
      items: [
        "Docker & Kubernetes / Istio",
        "OpenTelemetry / Prometheus / Grafana",
        "Embedded Firmware & Audio DSP",
        "Rust & Blockchain (Learning)",
        "Vercel / Render / Railway",
      ],
    },
  ],
  projects: [
    {
      id: "toasty-analytics",
      name: "Toasty-Analytics",
      codename: "PROJECT NEURAL-GRADE",
      station: "server",
      visibility: "Private",
      description:
        "Enterprise AI-powered code grading and agent evaluation framework with 4 microservices, CodeBERT neural graders, federated meta-learning, Kafka event streaming, and Istio service mesh.",
      highlights: [
        "Multi-dimensional code evaluation using CodeBERT neural graders and adaptive meta-learning thresholds",
        "Microservices architecture with per-service PostgreSQL, Redis tiered rate limiting, and GraphQL + REST APIs",
        "Full observability stack with OpenTelemetry distributed tracing, Jaeger, Prometheus, and Grafana",
      ],
      tags: ["Python", "FastAPI", "CodeBERT", "Kafka", "Docker", "OpenTelemetry"],
      link: "https://github.com/Lordbeatus/Toasty-Analytics",
    },
    {
      id: "mythos",
      name: "Mythos Dream OS & Hardware",
      codename: "PROJECT MYTHOS",
      station: "helmet",
      visibility: "Organization",
      description:
        "Signaling, embedded firmware, CAD enclosures, acoustic simulations, and companion app for Mythos Dream — psychoacoustic headphones with active cooling cushions engineered to prevent hearing loss.",
      highlights: [
        "Co-architected across 4 modules: Mythos-Firmware, Mythos-CADS, Mythos-Simulations, and Mythos-App",
        "Combines psychoacoustic audio safety algorithms with active noise cancellation and thermal ear-cushion cooling",
      ],
      tags: ["Firmware", "Psychoacoustics", "CAD", "Signal Processing", "Mobile App"],
      link: "https://github.com/Mythos-Official",
    },
    {
      id: "spoken-signs",
      name: "Spoken Signs (ASL Live Translator)",
      codename: "PROJECT GESTURE-VOICE",
      station: "gauntlet",
      visibility: "Organization",
      description:
        "Real-time computer vision pipeline and wearable/device prototype that detects American Sign Language (ASL) alphabet and signs live, restructures grammar into natural English, and speaks aloud via TTS.",
      highlights: [
        "End-to-end bidirectional pipeline: Camera CV model → SEE text → grammar/semantic reorganization → low-latency TTS",
        "Reverse speech-to-text transcription path for two-way deaf/hard-of-hearing conversations",
      ],
      tags: ["Python", "Computer Vision", "ASL", "NLP", "TTS"],
      link: "https://github.com/Spoken-Signs/Spoken-Signs-Detection-Model-Alphabet",
    },
    {
      id: "openvision",
      name: "OpenVision Spatial Computing",
      codename: "PROJECT VISION-PRO",
      station: "gauntlet",
      visibility: "Public",
      description:
        "Apple Vision Pro-style spatial computing running 100% in the browser via webcam. Features MediaPipe 21-landmark hand tracking, hysteresis PinchDetector, two-hand zoom/rotate, and WebGazer eye tracking.",
      highlights: [
        "Zero-dependency core gesture engine classifying 9 hand poses plus palm-normalized pinch state machine",
        "Spatial floating glass panels with pinch-to-drag, two-hand scale/rotation, and Kalman-smoothed gaze dwell",
      ],
      tags: ["Next.js", "TypeScript", "MediaPipe", "WebGL", "Spatial Computing"],
      link: "https://github.com/calebnewtonusc/OpenVision",
      liveUrl: "https://openvision.vercel.app",
    },
    {
      id: "toastimer",
      name: "Toastimer & Toastchain",
      codename: "PROJECT CHRONO-FORGE",
      station: "trading",
      visibility: "Private",
      description:
        "Gamified full-stack productivity ecosystem with a React client, Chrome/browser extension, Appwrite backend, AI session analytics, and experimental Toastchain proof-of-focus rewards.",
      highlights: [
        "Synchronized study timers, browser-extension site blocking ('This site is TOAST'), and custom pixel art icons",
        "Designed anti-bot focus verification minigames and AI attention-heatmap analytics suite",
      ],
      tags: ["JavaScript", "React", "Appwrite", "Browser Extension", "Web3"],
      link: "https://github.com/Lordbeatus/Toastimer",
      liveUrl: "https://app.toastimer.me",
    },
    {
      id: "fastscribe",
      name: "FastScribe (YouTube → Anki AI)",
      codename: "PROJECT FASTSCRIBE",
      station: "workbench",
      visibility: "Private",
      description:
        "Automated study pipeline that converts any YouTube lecture into ready-to-import Anki CSV flashcards using local Whisper transcription and GPT-4 / GitHub Copilot ($0/month student mode).",
      highlights: [
        "Dual-engine architecture: $0/mo local Whisper + Copilot token mode or high-speed OpenAI Whisper + GPT-4 API mode",
        "Includes API key cycler, YouTube audio scraper (yt-dlp), and React + Tailwind web interface",
      ],
      tags: ["Python", "Flask", "Whisper", "GPT-4", "React", "Tailwind"],
      link: "https://github.com/Lordbeatus/FastScribe",
    },
    {
      id: "starwatcher",
      name: "Starwatcher Quant System",
      codename: "PROJECT STARWATCHER",
      station: "trading",
      visibility: "Private",
      description:
        "Quantitative trading and market analytics platform featuring multi-strategy backtesting engines, automated trading bots, financial web scrapers, and portfolio risk telemetry.",
      highlights: [
        "Built modular backtesting pipelines and live market data scrapers for algorithmic strategy evaluation",
      ],
      tags: ["Python", "Quantitative Finance", "Backtesting", "Trading Bots", "Analytics"],
      link: "https://github.com/Lordbeatus/Starwatcher",
    },
    {
      id: "jarvis",
      name: "JARVIS Meeting-Prep & Voice Agent",
      codename: "PROJECT JARVIS-V0",
      station: "helmet",
      visibility: "Private",
      description:
        "Always-on voice and meeting-prep agent powered by Hermes 4.3 36B, Granola webhooks, and offline Vosk wake-word detection ('Hey Jarvis') with browser + native PC listeners.",
      highlights: [
        "Auto-drafts pre-meeting agendas and post-meeting follow-ups/tedious-task flags via FastAPI + Hermes LLM",
        "Dual voice stack: Chrome Web Speech HUD + offline Vosk hotword daemon",
      ],
      tags: ["Python", "FastAPI", "Hermes LLM", "Vosk Voice", "Automation"],
      link: "https://github.com/Lordbeatus",
    },
    {
      id: "classroom-genie",
      name: "Classroom Genie & Olympiad Trainer",
      codename: "PROJECT ED-GENIE",
      station: "workbench",
      visibility: "Private",
      description:
        "AI-assisted classroom platform built with Flask, HuggingFace models, and React, alongside Olympiad-Trainer (Olympiadsarefun.com) for competitive STEM practice.",
      highlights: [
        "Full cloud deployment pipeline on Render with Gunicorn, Flask REST APIs, and React static client",
      ],
      tags: ["React", "Flask", "HuggingFace", "Python", "Render"],
      link: "https://github.com/Lordbeatus/Classroom-Genie",
      liveUrl: "https://Olympiadsarefun.com",
    },
    {
      id: "chewbacca",
      name: "Chewbacca & USCTTS",
      codename: "PROJECT COLLAB-OPS",
      station: "server",
      visibility: "Private",
      description:
        "Collaborative engineering builds: Chewbacca (5-second CLI that gives Claude Code, Codex, Cursor, and Gemini CLI unified skills and memory) and the USC Trojan Tech Solutions platform.",
      highlights: [
        "Contributed across USC builder ecosystems including OpenVision, Chewbacca, and USCTTS (usctts.com)",
      ],
      tags: ["TypeScript", "Next.js", "AI Agents", "CLI", "MCP"],
      link: "https://usctts.com",
      liveUrl: "https://usctts.com",
    },
  ] satisfies ProjectItem[],
  experience: [
    {
      role: "Co-Creator & Systems Engineer",
      org: "Mythos Official (Mythos Dream)",
      period: "2025 — Present",
      points: [
        "Developing Mythos Dream psychoacoustic headphones with active cooling cushions and hearing-safety DSP algorithms.",
        "Working across Mythos-Firmware, Mythos-CADS hardware enclosures, acoustic simulations, and the companion app.",
      ],
    },
    {
      role: "Computer Vision & AI Lead",
      org: "Spoken Signs",
      period: "2025 — Present",
      points: [
        "Built real-time ASL alphabet and sign detection models in Python/CV with grammar reorganization and TTS output.",
        "Designed two-way sign-to-speech and speech-to-text hardware/software pipeline for accessible communication.",
      ],
    },
    {
      role: "Full-Stack & AI Systems Developer",
      org: "Independent / USC Builder Collaborations",
      period: "2023 — Present",
      points: [
        "Architected Toasty-Analytics (CodeBERT grading microservices), Toastimer (app.toastimer.me), FastScribe, and Starwatcher quant engine.",
        "Collaborated on OpenVision (Vision Pro browser spatial computing), Chewbacca agent CLI, and USC Trojan Tech Solutions.",
      ],
    },
  ],
};
