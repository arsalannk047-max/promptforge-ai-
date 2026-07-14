"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Flame } from "lucide-react";

const SESSION_KEY = "pf_intro_shown";

export function SplashIntro() {
  const [show, setShow] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Only play once per browser session, not on every navigation/refresh spam.
    const alreadyShown = sessionStorage.getItem(SESSION_KEY);
    if (!alreadyShown) {
      setShow(true);
      sessionStorage.setItem(SESSION_KEY, "1");
      const timer = setTimeout(() => setShow(false), 2200);
      return () => clearTimeout(timer);
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!show) setMounted(true);
  }, [show]);

  if (mounted && !show) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] grid place-items-center bg-forge-950"
        >
          <div className="flex flex-col items-center">
            <motion.span
              initial={{ scale: 0.4, opacity: 0, rotate: -15 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
              className="mb-5 grid h-16 w-16 place-items-center rounded-2xl bg-ember-500/15 text-ember-500"
            >
              <Flame className="h-8 w-8" strokeWidth={2.25} />
            </motion.span>

            <div className="flex overflow-hidden font-display text-3xl font-semibold text-forge-50 md:text-4xl">
              {"PromptForge AI".split("").map((char, i) => (
                <motion.span
                  key={i}
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: "0%", opacity: 1 }}
                  transition={{
                    delay: 0.4 + i * 0.035,
                    duration: 0.5,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="inline-block"
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
            </div>

            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ delay: 1.1, duration: 0.6, ease: "easeOut" }}
              className="mt-4 h-px w-40 origin-center bg-gradient-to-r from-transparent via-ember-500 to-transparent"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
