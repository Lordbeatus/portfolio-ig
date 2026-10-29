import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lordbeatus — Interactive Portfolio World",
  description:
    "Explore Daniel Thomas's interactive portfolio: AI systems, spatial computing, hardware, and full-stack projects in a playful 3D world.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body className="bg-[#f2f0e8] text-[#17272a] antialiased">{children}</body>
    </html>
  );
}
