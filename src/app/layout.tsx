import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Daniel Thomas (Lordbeatus) // Stark Malibu Garage 3D Portfolio",
  description:
    "Interactive 3D Tony Stark Workshop portfolio for Daniel Thomas — featuring JARVIS voice navigation, Apple Vision Pro webcam hand tracking (OpenVision), Spline 3D, and a printable recruiter dossier.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body className="bg-[#030712] text-slate-100 antialiased">{children}</body>
    </html>
  );
}
