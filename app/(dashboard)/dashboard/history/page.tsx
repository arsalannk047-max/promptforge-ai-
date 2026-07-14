import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/primitives";
import { Badge } from "@/components/ui/primitives";
import { formatDistanceToNow } from "date-fns";

const modeLabel: Record<string, string> = { generate: "Generated", improve: "Improved", convert: "Converted" };

export default async function HistoryPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: history } = await supabase
    .from("generation_history")
    .select("*")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-semibold text-forge-50">History</h1>
        <p className="mt-1 text-sm text-forge-400">Every generation, improvement, and conversion you've run.</p>
      </div>

      {!history?.length && (
        <Card>
          <CardContent className="py-16 text-center text-sm text-forge-500">
            Nothing here yet — head to Generate to forge your first prompt.
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {history?.map((h) => (
          <Card key={h.id}>
            <CardContent className="flex items-start justify-between gap-4 pt-6">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <Badge variant="ember">{modeLabel[h.mode]}</Badge>
                  <span className="text-xs text-forge-500">
                    {formatDistanceToNow(new Date(h.created_at), { addSuffix: true })}
                  </span>
                </div>
                <p className="mt-2 truncate text-sm text-forge-300">{h.raw_output?.slice(0, 160)}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
