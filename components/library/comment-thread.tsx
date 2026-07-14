"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/primitives";

interface CommentRow {
  id: string;
  body: string;
  created_at: string;
  profiles: { username: string } | null;
}

export function CommentThread({ promptId }: { promptId: string }) {
  const [comments, setComments] = useState<CommentRow[]>([]);
  const [body, setBody] = useState("");
  const [posting, setPosting] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch(`/api/comments?promptId=${promptId}`);
    const json = await res.json();
    if (res.ok) setComments(json.data);
  }, [promptId]);

  useEffect(() => {
    load();
  }, [load]);

  async function submit() {
    if (!body.trim()) return;
    setPosting(true);
    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ promptId, body }),
    });
    setPosting(false);
    if (res.status === 401) return toast.error("Log in to comment");
    if (!res.ok) return toast.error("Couldn't post comment");
    setBody("");
    load();
  }

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Textarea
          rows={3}
          placeholder="Share feedback on this prompt..."
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        <Button size="sm" onClick={submit} disabled={posting}>
          {posting ? "Posting..." : "Post comment"}
        </Button>
      </div>

      <div className="space-y-4">
        {comments.length === 0 && <p className="text-sm text-forge-500">No comments yet — be the first.</p>}
        {comments.map((c) => (
          <div key={c.id} className="flex gap-3">
            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-ember-500/15 text-xs text-ember-500">
              {c.profiles?.username?.[0]?.toUpperCase() || "?"}
            </div>
            <div>
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium text-forge-200">@{c.profiles?.username || "unknown"}</span>
                <span className="text-xs text-forge-500">
                  {formatDistanceToNow(new Date(c.created_at), { addSuffix: true })}
                </span>
              </div>
              <p className="mt-1 text-sm text-forge-300">{c.body}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
