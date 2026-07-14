import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, Badge } from "@/components/ui/primitives";
import { ReportActions } from "@/components/admin/report-actions";
import { formatDistanceToNow } from "date-fns";

export default async function AdminReportsPage() {
  const supabase = await createClient();
  const { data: reports } = await supabase
    .from("reports")
    .select("*, profiles!reports_reporter_id_fkey(username)")
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="mb-6 font-display text-2xl font-semibold text-forge-50">Reports</h1>

      {!reports?.length ? (
        <Card>
          <CardContent className="py-16 text-center text-sm text-forge-500">No reports filed.</CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {reports.map((r) => (
            <Card key={r.id}>
              <CardContent className="flex items-start justify-between gap-4 pt-6">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant={r.status === "open" ? "danger" : "default"}>{r.status}</Badge>
                    <span className="text-xs text-forge-500">{r.target_type}</span>
                    <span className="text-xs text-forge-500">
                      {formatDistanceToNow(new Date(r.created_at), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-forge-200">{r.reason}</p>
                  {r.details && <p className="mt-1 text-sm text-forge-400">{r.details}</p>}
                  <p className="mt-2 text-xs text-forge-500">Reported by @{r.profiles?.username}</p>
                </div>
                {r.status === "open" && <ReportActions reportId={r.id} />}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
