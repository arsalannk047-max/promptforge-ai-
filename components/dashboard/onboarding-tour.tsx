"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Hammer, Volume2, Search, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "promptforge_onboarding_complete";

const STEPS = [
  {
    icon: Sparkles,
    title: "Welcome to PromptForge 🔥",
    body: "Let's take a quick 30-second look at what you can do here — feel free to skip anytime.",
  },
  {
    icon: Hammer,
    title: "Generate, Improve & Convert",
    body: "Describe what you're building and the forge assembles a complete, structured prompt for ChatGPT, Claude, Gemini, and more.",
  },
  {
    icon: Volume2,
    title: "Text to Voice & Video",
    body: "Turn any text into real, downloadable narrated audio — or a colorful captioned video. Both are free to use.",
  },
  {
    icon: Search,
    title: "Search everything (⌘K)",
    body: "Click the search bar or press Ctrl/Cmd+K anytime to find trending ideas or jump back into your own history.",
  },
];

export function OnboardingTour() {
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const done = typeof window !== "undefined" && window.localStorage.getItem(STORAGE_KEY);
    if (!done) setVisible(true);
  }, []);

  function finish(goToGenerate?: boolean) {
    window.localStorage.setItem(STORAGE_KEY, "true");
    setVisible(false);
    if (goToGenerate) router.push("/dashboard/generate");
  }

  if (!visible) return null;

  const safeStep = Math.min(step, STEPS.length - 1);
  const isLast = safeStep === STEPS.length - 1;
  const current = STEPS[safeStep] ?? STEPS[0]!;
  const Icon = current.icon;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center px-4">
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" aria-hidden="true" />
      <div className="relative w-full max-w-sm rounded-2xl border border-forge-700 bg-forge-900 p-6 shadow-2xl">
        <button
          onClick={() => finish(false)}
          className="absolute right-4 top-4 rounded-lg p-1 text-forge-500 hover:bg-forge-800 hover:text-forge-200"
          aria-label="Skip tour"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="grid h-12 w-12 place-items-center rounded-xl bg-ember-500/15 text-ember-500">
          <Icon className="h-6 w-6" />
        </div>

        <h2 className="mt-4 font-display text-lg font-semibold text-forge-50">{current.title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-forge-400">{current.body}</p>

        <div className="mt-6 flex items-center justify-between">
          <div className="flex gap-1.5">
            {STEPS.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 w-1.5 rounded-full transition ${
                  i === safeStep ? "w-4 bg-ember-500" : "bg-forge-700"
                }`}
              />
            ))}
          </div>

          <div className="flex gap-2">
            {safeStep > 0 && (
              <Button variant="secondary" onClick={() => setStep((s) => s - 1)}>
                Back
              </Button>
            )}
            {!isLast && <Button onClick={() => setStep((s) => s + 1)}>Next</Button>}
            {isLast && <Button onClick={() => finish(true)}>Forge my first prompt</Button>}
          </div>
        </div>

        {!isLast && (
          <button
            onClick={() => finish(false)}
            className="mt-4 w-full text-center text-xs text-forge-500 hover:text-forge-300"
          >
            Skip tour
          </button>
        )}
      </div>
    </div>
  );
}