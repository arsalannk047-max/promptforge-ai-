import Link from "next/link";
import { Flame } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center bg-forge-950 px-6 text-center">
      <div>
        <span className="mx-auto mb-6 grid h-14 w-14 place-items-center rounded-2xl bg-ember-500/15 text-ember-500">
          <Flame className="h-7 w-7" />
        </span>
        <h1 className="font-display text-4xl font-semibold text-forge-50">404</h1>
        <p className="mt-2 text-forge-400">This prompt burned out. The page you&apos;re looking for doesn&apos;t exist.</p>
        <Button className="mt-6" asChild>
          <Link href="/">Back to the forge</Link>
        </Button>
      </div>
    </div>
  );
}
