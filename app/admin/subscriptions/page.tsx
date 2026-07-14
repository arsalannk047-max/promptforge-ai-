import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, Badge } from "@/components/ui/primitives";

export default async function AdminSubscriptionsPage() {
  const supabase = await createClient();
  const { data: subs } = await supabase
    .from("subscriptions")
    .select("*, profiles!subscriptions_user_id_fkey(username)")
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="mb-6 font-display text-2xl font-semibold text-forge-50">Subscriptions</h1>

      {!subs?.length ? (
        <Card>
          <CardContent className="py-16 text-center text-sm text-forge-500">
            No paid subscriptions yet — connect Stripe to start billing Pro/Team plans.
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-forge-800 text-left text-forge-500">
                  <th className="px-5 py-3 font-medium">User</th>
                  <th className="px-5 py-3 font-medium">Plan</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Renews</th>
                </tr>
              </thead>
              <tbody>
                {subs.map((s) => (
                  <tr key={s.id} className="border-b border-forge-800/60">
                    <td className="px-5 py-3 text-forge-200">@{s.profiles?.username}</td>
                    <td className="px-5 py-3">
                      <Badge variant="ember">{s.plan}</Badge>
                    </td>
                    <td className="px-5 py-3 text-forge-400">{s.status}</td>
                    <td className="px-5 py-3 text-forge-500">
                      {s.current_period_end ? new Date(s.current_period_end).toLocaleDateString() : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
