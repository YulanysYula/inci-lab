import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

export const metadata: Metadata = {
  title: "INCI Lab — Read what's on the label",
  description:
    "Paste or scan a cosmetic ingredient list and learn what each ingredient actually does to your skin.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="relative min-h-screen">
        <div className="relative z-10">{children}</div>
        <Analytics />
      </body>
    </html>
  );
}
