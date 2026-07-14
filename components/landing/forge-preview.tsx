"use client";

import { motion } from "framer-motion";

const sections = [
  { label: "OBJECTIVE", text: "Refactor a legacy checkout flow into modular, testable React components." },
  { label: "CONTEXT", text: "Next.js 15 app, TypeScript, existing Stripe integration, 40k monthly users." },
  { label: "REQUIREMENTS", text: "Preserve existing API contracts. Add unit tests. Keep bundle size flat." },
  { label: "CONSTRAINTS", text: "No new dependencies. Must ship behind a feature flag." },
  { label: "OUTPUT FORMAT", text: "File-by-file diff with a short rationale per change." },
];

export function ForgePreview() {
  return (
    <div className="relative mx-auto w-full max-w-2xl">
      <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-ember-glow blur-2xl" aria-hidden />
      <div className="glass overflow-hidden rounded-2xl">
        <div className="flex items-center justify-between border-b border-forge-700/60 px-5 py-3">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-danger/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-warning/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-success/70" />
          </div>
          <span className="font-mono text-xs text-forge-500">forge://new-prompt</span>
        </div>

        <div className="space-y-4 p-6 font-mono text-[13px] leading-relaxed">
          {sections.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 * i + 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="text-ember-500">{s.label}</span>
              <span className="text-forge-600"> · </span>
              <span className="text-forge-200">{s.text}</span>
            </motion.div>
          ))}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.4 }}
            className="flex items-center gap-2 pt-2 text-forge-500"
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ember-500" />
            forged in 2.1s · ready to paste into ChatGPT, Claude, Gemini
          </motion.div>
        </div>
      </div>
    </div>
  );
}
