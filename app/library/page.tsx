import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { PromptCard } from "@/components/prompt/prompt-card";
import { LibraryFilters } from "@/components/library/library-filters";
import { Card, CardContent } from "@/components/ui/primitives";

export default async function LibraryPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; sort?: string }>;
}) {
  const { q, category, sort = "latest" } = await searchParams;
  const supabase = await createClient();

  const { data: categories } = await supabase.from("categories").select("*").order("sort_order");

  let query = supabase
    .from("prompts")
    .select("*, profiles!prompts_owner_id_fkey(username), categories!inner(name, slug)")
    .eq("is_public", true)
    .eq("status", "published");

  if (q) query = query.ilike("title", `%${q}%`);
  if (category) query = query.eq("categories.slug", category);
  if (sort === "popular") query = query.order("like_count", { ascending: false });
  else if (sort === "trending") query = query.order("view_count", { ascending: false });
  else query = query.order("created_at", { ascending: false });

  const { data: prompts } = await query.limit(24);

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-semibold text-forge-50">Prompt library</h1>
          <p className="mt-2 text-forge-400">Search, filter, and fork prompts the community has published.</p>
        </div>

        <LibraryFilters categories={categories || []} />

        {!prompts?.length ? (
          <Card className="mt-8">
            <CardContent className="py-16 text-center text-sm text-forge-500">
              No public prompts match yet — be the first to publish one for this filter.
            </CardContent>
          </Card>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {prompts.map((p) => (
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              <PromptCard key={p.id} prompt={p as any} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
