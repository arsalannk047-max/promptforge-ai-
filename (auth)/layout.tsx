"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Flame } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-forge-950 px-6 py-12">
      <div className="absolute inset-0 bg-forge-grid bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_0%,black,transparent)]" />
      <div className="relative w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <Link
            href="/"
            className="mb-8 flex items-center justify-center gap-2 font-display text-lg font-semibold text-forge-50"
          >
            <motion.span
              initial={{ scale: 0.6, rotate: -20, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
              className="grid h-8 w-8 place-items-center rounded-lg bg-ember-500/15 text-ember-500"
            >
              <Flame className="h-4.5 w-4.5" strokeWidth={2.25} />
            </motion.span>
            PromptForge
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.15, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="glass rounded-2xl p-8"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}
