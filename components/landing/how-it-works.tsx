const steps = [
  {
    mark: "0x1",
    title: "Describe the outcome",
    body: "Tell PromptForge what you're building — tool, category, tone, difficulty, and any constraints that matter.",
  },
  {
    mark: "0x2",
    title: "The forge assembles it",
    body: "Objective, context, requirements, constraints, output format, best practices, examples, and edge cases — generated together, not bolted on.",
  },
  {
    mark: "0x3",
    title: "Copy, save, or publish",
    body: "Use it immediately, save it to a collection, or publish it to the library so other builders can fork it.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-t border-forge-800/80 bg-forge-900/30 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-semibold text-forge-50 md:text-4xl">How it works</h2>
          <p className="mt-4 text-forge-400">Three steps, because a real workflow shouldn't need more.</p>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.mark} className="relative border-l border-forge-700 pl-6">
              <span className="font-mono text-xs text-ember-500">{s.mark}</span>
              <h3 className="mt-2 font-display text-lg font-semibold text-forge-50">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-forge-400">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
