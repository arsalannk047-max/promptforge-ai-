import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, Badge } from "@/components/ui/primitives";
import { RoleSelect } from "@/components/admin/role-select";

export default async function AdminUsersPage() {
  const supabase = await createClient();
  const { data: users } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="mb-6 font-display text-2xl font-semibold text-forge-50">Users</h1>
      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-forge-800 text-left text-forge-500">
                <th className="px-5 py-3 font-medium">User</th>
                <th className="px-5 py-3 font-medium">Plan</th>
                <th className="px-5 py-3 font-medium">Generations</th>
                <th className="px-5 py-3 font-medium">Role</th>
                <th className="px-5 py-3 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users?.map((u) => (
                <tr key={u.id} className="border-b border-forge-800/60">
                  <td className="px-5 py-3">
                    <div className="text-forge-200">@{u.username}</div>
                    <div className="text-xs text-forge-500">{u.display_name}</div>
                  </td>
                  <td className="px-5 py-3">
                    <Badge variant="ember">{u.plan}</Badge>
                  </td>
                  <td className="px-5 py-3 text-forge-300">
                    {u.prompts_generated_count}/{u.monthly_generation_quota}
                  </td>
                  <td className="px-5 py-3">
                    <RoleSelect userId={u.id} currentRole={u.role} />
                  </td>
                  <td className="px-5 py-3 text-forge-500">{new Date(u.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
