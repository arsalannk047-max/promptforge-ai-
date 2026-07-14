import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/primitives";
import { PromptCard } from "@/components/prompt/prompt-card";

export default async function SavedPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: prompts } = await supabase
    .from("prompts")
    .select("*, profiles!prompts_owner_id_fkey(username)")
    .eq("owner_id", user!.id)
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-semibold text-forge-50">Saved prompts</h1>
        <p className="mt-1 text-sm text-forge-400">Every prompt you've saved, public or private.</p>
      </div>

      {!prompts?.length ? (
        <Card>
          <CardContent className="py-16 text-center text-sm text-forge-500">
            No saved prompts yet — generate one and hit Save.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {prompts.map((p) => (
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            <PromptCard key={p.id} prompt={p as any} />
          ))}
        </div>
      )}
    </div>
  );
}
