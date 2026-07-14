import { FolderKanban, Trash2, Globe, Lock } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/primitives";
import { Input } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { createCollectionAction, deleteCollectionAction } from "./actions";

export default async function CollectionsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: collections } = await supabase
    .from("collections")
    .select("*, collection_prompts(count)")
    .eq("owner_id", user!.id)
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-semibold text-forge-50">Collections</h1>
        <p className="mt-1 text-sm text-forge-400">Group prompts by project, client, or theme.</p>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <form action={createCollectionAction} className="flex flex-col gap-3 sm:flex-row">
            <Input name="name" placeholder="Collection name" required className="flex-1" />
            <label className="flex items-center gap-2 text-sm text-forge-400">
              <input type="checkbox" name="isPublic" className="h-4 w-4 rounded border-forge-600 bg-forge-800" />
              Public
            </label>
            <Button type="submit">Create</Button>
          </form>
        </CardContent>
      </Card>

      {!collections?.length ? (
        <Card>
          <CardContent className="py-16 text-center text-sm text-forge-500">No collections yet.</CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {collections.map((c) => (
            <Card key={c.id}>
              <CardContent className="flex items-start justify-between pt-6">
                <div className="flex items-start gap-3">
                  <div
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-lg text-forge-950"
                    style={{ backgroundColor: c.cover_color }}
                  >
                    <FolderKanban className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-sm font-semibold text-forge-50">{c.name}</h3>
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-forge-500">
                      {c.is_public ? <Globe className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                      {c.is_public ? "Public" : "Private"} · {c.collection_prompts?.[0]?.count ?? 0} prompts
                    </p>
                  </div>
                </div>
                <form action={deleteCollectionAction.bind(null, c.id)}>
                  <button className="text-forge-500 hover:text-danger">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </form>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
