"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ForgePreview } from "./forge-preview";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.15 * i, duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  }),
};

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-forge-950">
      <div className="absolute inset-0 bg-forge-grid bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]" />
      <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-20 md:pt-28">
        <motion.div
          initial="hidden"
          animate="show"
          custom={0}
          variants={fadeUp}
          className="mx-auto mb-6 flex w-fit items-center gap-2 rounded-full border border-forge-700 bg-forge-900/80 px-4 py-1.5 text-xs text-forge-300"
        >
          <Sparkles className="h-3.5 w-3.5 text-ember-500" />
          Now supporting 8 AI tools, one forge
        </motion.div>

        <motion.h1
          initial="hidden"
          animate="show"
          custom={1}
          variants={fadeUp}
          className="mx-auto max-w-3xl text-balance text-center font-display text-4xl font-semibold tracking-tight text-forge-50 md:text-6xl"
        >
          Stop writing prompts.
          <br />
          <span className="text-ember-500">Start forging them.</span>
        </motion.h1>

        <motion.p
          initial="hidden"
          animate="show"
          custom={2}
          variants={fadeUp}
          className="mx-auto mt-6 max-w-xl text-balance text-center text-base text-forge-400 md:text-lg"
        >
          PromptForge AI turns a rough idea into a structured, production-grade prompt —
          objective, context, constraints, and edge cases included — for whichever AI
          model you&apos;re pointing it at.
        </motion.p>

        <motion.div
          initial="hidden"
          animate="show"
          custom={3}
          variants={fadeUp}
          className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Button size="lg" asChild>
            <Link href="/signup">
              Forge your first prompt <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/library">Browse the library</Link>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16"
        >
          <ForgePreview />
        </motion.div>
      </div>
    </section>
  );
}
