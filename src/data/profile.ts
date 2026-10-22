export const profile = {
  name: "Daniel Thomas",
  alias: "Lordbeatus",
  title: "Full-Stack Web Developer",
  location: "Los Angeles, California",
  tagline: "Building suits of code — web apps with a Stark-grade finish.",
  bio: "Most comfortable with full-stack web development. Currently learning blockchain development and Rust, plus mobile apps and ML. Past experience with game and cloud dev.",
  hireable: true,
  contact: {
    github: "https://github.com/Lordbeatus",
    linkedin: "https://www.linkedin.com/in/daniel-thomas-792867422/",
    discord: "smiling0705",
  },
  // TODO: replace with your real projects (including private repos once
  // GitHub is connected). Edit this one file — everything renders from it.
  skills: [
    { group: "Frontend", items: ["React", "Next.js", "Tailwind CSS", "Three.js", "TypeScript"] },
    { group: "Backend", items: ["Node.js", "Python", "REST APIs", "PostgreSQL", "Cloudflare Workers"] },
    { group: "Learning", items: ["Rust", "Blockchain / Solidity", "React Native", "Machine Learning"] },
    { group: "Game & Cloud", items: ["Game Dev", "Cloud Deployments", "CI/CD", "Docker"] },
  ],
  projects: [
    {
      name: "JARVIS Personal Assistant",
      description:
        "Always-on desktop assistant with voice hotword, system tray, notifications, and automation skills (see local jarvis/ project).",
      tags: ["Python", "Voice", "Automation"],
      link: "https://github.com/Lordbeatus",
    },
    {
      name: "Portfolio Mark I (this suit)",
      description:
        "Tony Stark-themed portfolio with Three.js arc reactor, Spline scene support, and a rule-based JARVIS navigator.",
      tags: ["Next.js", "Three.js", "Tailwind"],
      link: "https://github.com/Lordbeatus/portfolio-ig",
    },
    {
      name: "Your project here",
      description:
        "Private repos aren't visible until GitHub is connected — replace this card with your best private-repo project.",
      tags: ["TBD"],
      link: "https://github.com/Lordbeatus",
    },
  ],
  experience: [
    {
      role: "Full-Stack Web Developer",
      org: "Independent / Open to roles",
      period: "2023 — Present",
      points: [
        "Comfortable across the stack: Next.js frontends, Node/Python backends, deployed cloud apps.",
        "Shipped game and cloud side projects; now going deep on blockchain, mobile, and ML.",
        "Currently OPEN TO WORK — see the Recruiter Mode for a 60-second scan.",
      ],
    },
  ],
};

export type JarvisTarget = "about" | "skills" | "projects" | "experience" | "contact" | "recruiter" | "top";
