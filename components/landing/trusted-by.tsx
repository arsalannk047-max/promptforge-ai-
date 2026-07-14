const tools = ["ChatGPT", "Claude", "Gemini", "Cursor", "GitHub Copilot", "Meta AI", "Midjourney"];

export function TrustedBy() {
  return (
    <section className="border-y border-forge-800/80 bg-forge-900/40 py-8">
      <div className="mx-auto max-w-7xl px-6">
        <p className="mb-5 text-center text-xs uppercase tracking-widest text-forge-500">
          Prompts forged for every major model
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
          {tools.map((t) => (
            <span key={t} className="font-display text-sm font-medium text-forge-500 transition hover:text-forge-300">
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
