import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/primitives";
import { PromptCard } from "@/components/prompt/prompt-card";

export default async function FavoritesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: likes } = await supabase
    .from("prompt_likes")
    .select("prompts(*, profiles!prompts_owner_id_fkey(username))")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });

  const prompts = (likes || []).map((l) => l.prompts).filter(Boolean);

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-semibold text-forge-50">Favorites</h1>
        <p className="mt-1 text-sm text-forge-400">Prompts you've liked from the community.</p>
      </div>

      {!prompts.length ? (
        <Card>
          <CardContent className="py-16 text-center text-sm text-forge-500">
            Nothing liked yet — browse the library and tap the heart on a prompt.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {prompts.map((p: any) => (
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            <PromptCard key={p.id} prompt={p} />
          ))}
        </div>
      )}
    </div>
  );
}
