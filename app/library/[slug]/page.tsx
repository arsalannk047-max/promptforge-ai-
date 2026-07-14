import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { Badge, Card, CardContent } from "@/components/ui/primitives";
import { EngagementBar } from "@/components/library/engagement-bar";
import { CommentThread } from "@/components/library/comment-thread";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: prompt } = await supabase.from("prompts").select("title, description").eq("slug", slug).single();
  if (!prompt) return {};
  return { title: prompt.title, description: prompt.description || undefined };
}

export default async function PromptDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: prompt } = await supabase
    .from("prompts")
    .select("*, profiles!prompts_owner_id_fkey(username, display_name, avatar_url)")
    .eq("slug", slug)
    .eq("is_public", true)
    .single();

  if (!prompt) notFound();

  await supabase.rpc("increment_view_count", { prompt_id: prompt.id });

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-4xl px-6 py-12">
        <div className="mb-6 flex items-center gap-2">
          <Badge variant="ember">{prompt.ai_tool}</Badge>
          {prompt.difficulty && <Badge>{prompt.difficulty}</Badge>}
        </div>

        <h1 className="font-display text-3xl font-semibold text-forge-50">{prompt.title}</h1>
        {prompt.description && <p className="mt-3 text-forge-400">{prompt.description}</p>}

        <div className="mt-4 flex items-center gap-2 text-sm text-forge-500">
          by{" "}
          <Link href={`/u/${prompt.profiles?.username}`} className="text-forge-300 hover:text-forge-100">
            @{prompt.profiles?.username}
          </Link>
        </div>

        <div className="mt-6">
          <EngagementBar
            promptId={prompt.id}
            content={prompt.content}
            initialLikeCount={prompt.like_count}
            initialBookmarkCount={prompt.bookmark_count}
          />
        </div>

        <Card className="mt-8">
          <CardContent className="pt-6">
            <pre className="max-h-[36rem] overflow-auto whitespace-pre-wrap font-mono text-sm leading-relaxed text-forge-200">
              {prompt.content}
            </pre>
          </CardContent>
        </Card>

        <div className="mt-10">
          <h2 className="mb-4 font-display text-lg font-semibold text-forge-50">Comments</h2>
          <CommentThread promptId={prompt.id} />
        </div>
      </main>
      <Footer />
    </>
  );
}
