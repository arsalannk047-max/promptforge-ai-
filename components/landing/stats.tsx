const stats = [
  { value: "1.2M+", label: "Prompts forged" },
  { value: "48K", label: "Builders" },
  { value: "8", label: "AI tools supported" },
  { value: "4.9/5", label: "Average rating" },
];

export function Stats() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="grid grid-cols-2 gap-8 rounded-2xl border border-forge-700 bg-forge-900/60 p-10 md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <div className="font-display text-3xl font-semibold text-ember-500 md:text-4xl">{s.value}</div>
            <div className="mt-1 text-sm text-forge-400">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
