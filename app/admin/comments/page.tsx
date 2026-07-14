import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, Badge } from "@/components/ui/primitives";
import { HideCommentButton } from "@/components/admin/hide-comment-button";
import { formatDistanceToNow } from "date-fns";

export default async function AdminCommentsPage() {
  const supabase = await createClient();
  const { data: comments } = await supabase
    .from("comments")
    .select("*, profiles!comments_author_id_fkey(username)")
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="mb-6 font-display text-2xl font-semibold text-forge-50">Comments</h1>

      <div className="space-y-3">
        {comments?.map((c) => (
          <Card key={c.id}>
            <CardContent className="flex items-start justify-between gap-4 pt-6">
              <div>
                <div className="flex items-center gap-2 text-xs text-forge-500">
                  <span className="text-forge-300">@{c.profiles?.username}</span>
                  {formatDistanceToNow(new Date(c.created_at), { addSuffix: true })}
                  <Badge variant={c.status === "hidden" ? "danger" : "default"}>{c.status}</Badge>
                </div>
                <p className="mt-2 text-sm text-forge-200">{c.body}</p>
              </div>
              {c.status === "visible" && <HideCommentButton commentId={c.id} />}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
