import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, Badge } from "@/components/ui/primitives";
import { PromptStatusActions } from "@/components/admin/prompt-status-actions";

export default async function AdminPromptsPage() {
  const supabase = await createClient();
  const { data: prompts } = await supabase
    .from("prompts")
    .select("*, profiles!prompts_owner_id_fkey(username)")
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="mb-6 font-display text-2xl font-semibold text-forge-50">Prompts</h1>
      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-forge-800 text-left text-forge-500">
                <th className="px-5 py-3 font-medium">Title</th>
                <th className="px-5 py-3 font-medium">Owner</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Visibility</th>
                <th className="px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {prompts?.map((p) => (
                <tr key={p.id} className="border-b border-forge-800/60">
                  <td className="max-w-xs truncate px-5 py-3 text-forge-200">{p.title}</td>
                  <td className="px-5 py-3 text-forge-400">@{p.profiles?.username}</td>
                  <td className="px-5 py-3">
                    <Badge variant={p.status === "flagged" ? "danger" : "default"}>{p.status}</Badge>
                  </td>
                  <td className="px-5 py-3 text-forge-400">{p.is_public ? "Public" : "Private"}</td>
                  <td className="px-5 py-3">
                    <PromptStatusActions promptId={p.id} currentStatus={p.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
