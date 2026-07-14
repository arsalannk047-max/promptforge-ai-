import { Hammer, Wand2, Repeat, Library, Users, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/primitives";

const features = [
  {
    icon: Hammer,
    title: "Structured generation",
    body: "Every prompt ships with objective, context, requirements, constraints, output format, and edge cases — not a single wall of text.",
  },
  {
    icon: Wand2,
    title: "Prompt Improver",
    body: "Paste anything you already have. Choose beginner, professional, expert, detailed, or short — get back something sharper.",
  },
  {
    icon: Repeat,
    title: "Cross-model converter",
    body: "Written for ChatGPT but need it for Claude or Cursor? Convert between eight tools without losing intent.",
  },
  {
    icon: Library,
    title: "Public prompt library",
    body: "Search, filter, and fork prompts other builders have already battle-tested — sorted by trending, latest, or most-liked.",
  },
  {
    icon: Users,
    title: "Built for teams",
    body: "Collections, follows, and comments make it easy to build a shared prompt playbook instead of a personal notes doc.",
  },
  {
    icon: ShieldCheck,
    title: "Your data, governed",
    body: "Row-level security on every table means your private prompts stay private, even from other authenticated users.",
  },
];

export function Features() {
  return (
    <section id="features" className="mx-auto max-w-7xl px-6 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-display text-3xl font-semibold text-forge-50 md:text-4xl">
          One forge, every stage of a prompt's life
        </h2>
        <p className="mt-4 text-forge-400">
          From first draft to shared library entry, PromptForge AI covers the whole arc.
        </p>
      </div>

      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <Card key={f.title} className="transition hover:border-ember-500/40">
            <CardContent className="pt-6">
              <div className="mb-4 grid h-10 w-10 place-items-center rounded-lg bg-ember-500/10 text-ember-500">
                <f.icon className="h-5 w-5" strokeWidth={2} />
              </div>
              <h3 className="font-display text-base font-semibold text-forge-50">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-forge-400">{f.body}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
