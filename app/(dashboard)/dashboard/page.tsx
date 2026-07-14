import Link from "next/link";
import { Hammer, Bookmark, Heart, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";

export default async function OverviewPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ count: promptCount }, { count: savedCount }, { count: likedCount }, { data: profile }] =
    await Promise.all([
      supabase.from("prompts").select("id", { count: "exact", head: true }).eq("owner_id", user!.id),
      supabase.from("prompt_bookmarks").select("prompt_id", { count: "exact", head: true }).eq("user_id", user!.id),
      supabase.from("prompt_likes").select("prompt_id", { count: "exact", head: true }).eq("user_id", user!.id),
      supabase.from("profiles").select("*").eq("id", user!.id).single(),
    ]);

  const quota = profile?.monthly_generation_quota ?? 20;
  const used = profile?.prompts_generated_count ?? 0;
  const pct = Math.min(100, Math.round((used / quota) * 100));

  const stats = [
    { label: "Prompts forged", value: promptCount ?? 0, icon: Hammer },
    { label: "Saved", value: savedCount ?? 0, icon: Bookmark },
    { label: "Liked", value: likedCount ?? 0, icon: Heart },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-2xl font-semibold text-forge-50">
            Welcome back, {profile?.display_name || profile?.username}
          </h1>
          <p className="mt-1 text-sm text-forge-400">Here's what's happening at the forge.</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/generate">
            <Sparkles className="h-4 w-4" /> New prompt
          </Link>
        </Button>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="flex items-center justify-between pt-6">
              <div>
                <p className="text-sm text-forge-400">{s.label}</p>
                <p className="mt-1 font-display text-3xl font-semibold text-forge-50">{s.value}</p>
              </div>
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-ember-500/10 text-ember-500">
                <s.icon className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-forge-200">Monthly generation quota</p>
            <p className="text-sm text-forge-400">
              {used} / {quota} · {profile?.plan || "free"} plan
            </p>
          </div>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-forge-800">
            <div className="h-full rounded-full bg-ember-500 transition-all" style={{ width: `${pct}%` }} />
          </div>
          {pct >= 80 && (
            <p className="mt-3 text-sm text-warning">
              You&apos;re close to your monthly limit.{" "}
              <Link href="/dashboard/settings" className="underline">
                Upgrade to Pro
              </Link>{" "}
              for more headroom.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
