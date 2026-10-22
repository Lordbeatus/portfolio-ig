import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lordbeatus // Stark OS Portfolio",
  description:
    "Daniel Thomas (Lordbeatus) — full-stack developer portfolio with a Tony Stark theme, Three.js arc reactor, and a JARVIS navigator. Includes a clean recruiter briefing.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
