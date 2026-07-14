import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/primitives";
import { cn } from "@/lib/utils/cn";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    tagline: "For trying the forge",
    features: ["20 generations / month", "Public library access", "3 collections", "Community support"],
    cta: "Start free",
    href: "/signup",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$19",
    period: "/ month",
    tagline: "For builders shipping weekly",
    features: [
      "500 generations / month",
      "Prompt Improver + Converter",
      "Unlimited collections",
      "Priority queueing",
      "Private prompts",
    ],
    cta: "Start Pro trial",
    href: "/signup?plan=pro",
    highlighted: true,
  },
  {
    name: "Team",
    price: "$49",
    period: "/ month",
    tagline: "For teams sharing a playbook",
    features: [
      "Unlimited generations",
      "Shared team library",
      "Role-based access",
      "Usage analytics",
      "SSO (on request)",
    ],
    cta: "Talk to us",
    href: "/signup?plan=team",
    highlighted: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="border-t border-forge-800/80 bg-forge-900/30 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-semibold text-forge-50 md:text-4xl">Simple, honest pricing</h2>
          <p className="mt-4 text-forge-400">Start free. Upgrade when the forge earns it.</p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {plans.map((p) => (
            <Card
              key={p.name}
              className={cn(
                "relative flex flex-col",
                p.highlighted && "border-ember-500/60 shadow-[0_0_0_1px_rgba(242,169,59,0.3)]"
              )}
            >
              {p.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-ember-500 px-3 py-1 text-xs font-semibold text-forge-950">
                  Most popular
                </span>
              )}
              <CardContent className="flex flex-1 flex-col pt-8">
                <h3 className="font-display text-lg font-semibold text-forge-50">{p.name}</h3>
                <p className="mt-1 text-sm text-forge-400">{p.tagline}</p>
                <div className="mt-5 flex items-baseline gap-1">
                  <span className="font-display text-4xl font-semibold text-forge-50">{p.price}</span>
                  <span className="text-sm text-forge-500">{p.period}</span>
                </div>
                <ul className="mt-6 flex-1 space-y-3">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-forge-300">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-ember-500" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button variant={p.highlighted ? "primary" : "secondary"} className="mt-8" asChild>
                  <Link href={p.href}>{p.cta}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
