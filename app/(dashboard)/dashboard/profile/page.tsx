import Link from "next/link";
import { Globe, Twitter, Github } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, Badge } from "@/components/ui/primitives";
import { PromptCard } from "@/components/prompt/prompt-card";
import { formatNumber } from "@/lib/utils/cn";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: profile }, { data: prompts }, { count: followerCount }, { count: followingCount }] =
    await Promise.all([
      supabase.from("profiles").select("*").eq("id", user!.id).single(),
      supabase
        .from("prompts")
        .select("*, profiles!prompts_owner_id_fkey(username)")
        .eq("owner_id", user!.id)
        .eq("is_public", true)
        .order("created_at", { ascending: false }),
      supabase.from("follows").select("follower_id", { count: "exact", head: true }).eq("following_id", user!.id),
      supabase.from("follows").select("following_id", { count: "exact", head: true }).eq("follower_id", user!.id),
    ]);

  return (
    <div className="mx-auto max-w-5xl">
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
            <div className="grid h-20 w-20 shrink-0 place-items-center rounded-full bg-ember-500/15 font-display text-2xl text-ember-500">
              {profile?.username?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h1 className="font-display text-xl font-semibold text-forge-50">
                  {profile?.display_name || profile?.username}
                </h1>
                <Badge variant="ember">{profile?.plan}</Badge>
              </div>
              <p className="text-sm text-forge-500">@{profile?.username}</p>
              {profile?.bio && <p className="mt-2 max-w-xl text-sm text-forge-300">{profile.bio}</p>}
              <div className="mt-3 flex items-center gap-4 text-sm text-forge-500">
                <span>
                  <strong className="text-forge-200">{formatNumber(followerCount ?? 0)}</strong> followers
                </span>
                <span>
                  <strong className="text-forge-200">{formatNumber(followingCount ?? 0)}</strong> following
                </span>
                <span>
                  <strong className="text-forge-200">{prompts?.length ?? 0}</strong> public prompts
                </span>
              </div>
              <div className="mt-3 flex gap-3">
                {profile?.website_url && (
                  <Link href={profile.website_url} className="text-forge-500 hover:text-forge-200">
                    <Globe className="h-4 w-4" />
                  </Link>
                )}
                {profile?.twitter_url && (
                  <Link href={profile.twitter_url} className="text-forge-500 hover:text-forge-200">
                    <Twitter className="h-4 w-4" />
                  </Link>
                )}
                {profile?.github_url && (
                  <Link href={profile.github_url} className="text-forge-500 hover:text-forge-200">
                    <Github className="h-4 w-4" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <h2 className="mb-4 font-display text-lg font-semibold text-forge-50">Public prompts</h2>
      {!prompts?.length ? (
        <Card>
          <CardContent className="py-12 text-center text-sm text-forge-500">
            Nothing published yet. Publish a prompt to show it here.
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
