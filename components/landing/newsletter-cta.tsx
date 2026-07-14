import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/primitives";

export function NewsletterCTA() {
  return (
    <section className="border-t border-forge-800/80 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="relative overflow-hidden rounded-3xl border border-forge-700 bg-forge-900 px-8 py-16 text-center">
          <div className="absolute inset-0 bg-ember-glow" aria-hidden />
          <div className="relative">
            <h2 className="font-display text-3xl font-semibold text-forge-50 md:text-4xl">
              Your next good prompt is one forge away
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-forge-400">
              Join free. No credit card, no API key, no waitlist.
            </p>
            <div className="mt-8 flex justify-center">
              <Button size="lg" asChild>
                <Link href="/signup">
                  Start forging <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="mx-auto mt-14 max-w-md border-t border-forge-700 pt-10">
              <p className="text-sm font-medium text-forge-200">Get one sharp prompt in your inbox, weekly</p>
              <form className="mt-4 flex gap-2">
                <Input type="email" placeholder="you@company.com" className="bg-forge-800" />
                <Button type="submit" variant="secondary">
                  Subscribe
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
