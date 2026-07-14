import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/primitives";

export default async function AdminAnalyticsPage() {
  const supabase = await createClient();

  const [{ count: userCount }, { count: promptCount }, { count: publicPromptCount }, { count: commentCount }, { count: generationCount }] =
    await Promise.all([
      supabase.from("profiles").select("id", { count: "exact", head: true }),
      supabase.from("prompts").select("id", { count: "exact", head: true }),
      supabase.from("prompts").select("id", { count: "exact", head: true }).eq("is_public", true),
      supabase.from("comments").select("id", { count: "exact", head: true }),
      supabase.from("generation_history").select("id", { count: "exact", head: true }),
    ]);

  const stats = [
    { label: "Total users", value: userCount ?? 0 },
    { label: "Total prompts", value: promptCount ?? 0 },
    { label: "Public prompts", value: publicPromptCount ?? 0 },
    { label: "Comments", value: commentCount ?? 0 },
    { label: "AI generations", value: generationCount ?? 0 },
  ];

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="mb-6 font-display text-2xl font-semibold text-forge-50">Platform analytics</h1>
      <div className="grid gap-5 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="pt-6">
              <p className="text-sm text-forge-400">{s.label}</p>
              <p className="mt-1 font-display text-3xl font-semibold text-forge-50">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
