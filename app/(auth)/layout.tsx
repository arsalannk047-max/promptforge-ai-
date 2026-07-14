import Link from "next/link";
import { Flame } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-forge-950 px-6 py-12">
      <div className="absolute inset-0 bg-forge-grid bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_0%,black,transparent)]" />
      <div className="relative w-full max-w-md">
        <Link href="/" className="mb-8 flex items-center justify-center gap-2 font-display text-lg font-semibold text-forge-50">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-ember-500/15 text-ember-500">
            <Flame className="h-[1.125rem] w-[1.125rem]" strokeWidth={2.25} />
          </span>
          PromptForge
        </Link>
        <div className="glass rounded-2xl p-8">{children}</div>
      </div>
    </div>
  );
}
