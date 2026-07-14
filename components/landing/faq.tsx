"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const faqs = [
  {
    q: "Which AI tools does PromptForge support?",
    a: "ChatGPT, Claude, Gemini, Cursor, GitHub Copilot, Meta AI, Canva AI, and Midjourney — both for generating new prompts and converting existing ones between tools.",
  },
  {
    q: "Do I need my own OpenAI API key?",
    a: "No. Generation runs on PromptForge's own backend. You never need to bring or manage an API key.",
  },
  {
    q: "Can I keep my prompts private?",
    a: "Yes. Every prompt defaults to private. You choose exactly which ones to publish to the public library, and can unpublish at any time.",
  },
  {
    q: "What happens if I go over my monthly generations?",
    a: "You'll be prompted to upgrade. Nothing you've already saved is ever locked or deleted — limits only apply to new generations.",
  },
  {
    q: "Can teams share a prompt library?",
    a: "Yes, on the Team plan. Teams get a shared library with role-based permissions, separate from each member's personal prompts.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="mx-auto max-w-3xl px-6 py-24">
      <h2 className="text-center font-display text-3xl font-semibold text-forge-50 md:text-4xl">
        Frequently asked
      </h2>
      <div className="mt-10 divide-y divide-forge-800 border-y border-forge-800">
        {faqs.map((f, i) => (
          <div key={f.q}>
            <button
              className="flex w-full items-center justify-between py-5 text-left"
              onClick={() => setOpen(open === i ? null : i)}
              aria-expanded={open === i}
            >
              <span className="font-medium text-forge-100">{f.q}</span>
              <ChevronDown
                className={cn("h-4 w-4 shrink-0 text-forge-500 transition-transform", open === i && "rotate-180")}
              />
            </button>
            {open === i && <p className="pb-5 text-sm leading-relaxed text-forge-400">{f.a}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}
