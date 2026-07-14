import { Card, CardContent } from "@/components/ui/primitives";

const testimonials = [
  {
    quote:
      "We replaced a shared Notion doc of half-finished prompts with a library everyone actually maintains. Onboarding a new engineer used to take a week; now it's an afternoon.",
    name: "Priya Nataraj",
    role: "Staff Engineer, fintech startup",
  },
  {
    quote:
      "The converter is the feature I didn't know I needed — I write once and hand teammates the Claude or Cursor version without redoing the thinking.",
    name: "Marco Ferretti",
    role: "Freelance product designer",
  },
  {
    quote:
      "Edge cases used to be the thing I forgot until production. Now they're a section I fill in before I ship the prompt at all.",
    name: "Aiko Tanaka",
    role: "ML Platform Lead",
  },
];

export function Testimonials() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-display text-3xl font-semibold text-forge-50 md:text-4xl">Builders trust the forge</h2>
      </div>
      <div className="mt-14 grid gap-5 md:grid-cols-3">
        {testimonials.map((t) => (
          <Card key={t.name}>
            <CardContent className="pt-6">
              <p className="text-sm leading-relaxed text-forge-300">&ldquo;{t.quote}&rdquo;</p>
              <div className="mt-5 flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-ember-500/15 font-display text-sm text-ember-500">
                  {t.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <div className="text-sm font-medium text-forge-50">{t.name}</div>
                  <div className="text-xs text-forge-500">{t.role}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
