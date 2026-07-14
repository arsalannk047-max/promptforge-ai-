import { createClient } from "@/lib/supabase/server";
import { AnalyticsCharts } from "@/components/dashboard/analytics-charts";

export default async function AnalyticsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: history } = await supabase
    .from("generation_history")
    .select("mode, created_at")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: true });

  const byDay = new Map<string, number>();
  const byMode = { generate: 0, improve: 0, convert: 0 } as Record<string, number>;

  for (const row of history || []) {
    const day = new Date(row.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" });
    byDay.set(day, (byDay.get(day) || 0) + 1);
    byMode[row.mode] = (byMode[row.mode] || 0) + 1;
  }

  const dailyData = Array.from(byDay.entries()).map(([date, count]) => ({ date, count }));
  const modeData = Object.entries(byMode).map(([mode, count]) => ({ mode, count }));

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-semibold text-forge-50">Usage analytics</h1>
        <p className="mt-1 text-sm text-forge-400">How you've been using PromptForge over time.</p>
      </div>

      <AnalyticsCharts dailyData={dailyData} modeData={modeData} />
    </div>
  );
}
