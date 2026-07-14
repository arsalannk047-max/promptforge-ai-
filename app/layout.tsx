import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import { Providers } from "@/providers/providers";
import "./globals.css";

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
});
const sans = Inter({ subsets: ["latin"], variable: "--font-sans" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "PromptForge AI — Forge better AI prompts",
    template: "%s · PromptForge AI",
  },
  description:
    "Generate, improve, convert, and discover professional AI prompts for ChatGPT, Claude, Gemini, Cursor, and more.",
  openGraph: {
    title: "PromptForge AI",
    description: "Forge better AI prompts. Generate, improve, and share prompts that actually work.",
    type: "website",
    siteName: "PromptForge AI",
  },
  twitter: {
    card: "summary_large_image",
    title: "PromptForge AI",
    description: "Forge better AI prompts. Generate, improve, and share prompts that actually work.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
