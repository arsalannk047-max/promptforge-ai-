"use client";

import { useState } from "react";
import { Heart, Bookmark, Copy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function EngagementBar({
  promptId,
  content,
  initialLikeCount,
  initialBookmarkCount,
}: {
  promptId: string;
  content: string;
  initialLikeCount: number;
  initialBookmarkCount: number;
}) {
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [bookmarkCount, setBookmarkCount] = useState(initialBookmarkCount);

  async function toggleLike() {
    const res = await fetch("/api/likes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ promptId }),
    });
    if (res.status === 401) return toast.error("Log in to like prompts");
    const { liked: nowLiked } = await res.json();
    setLiked(nowLiked);
    setLikeCount((c) => c + (nowLiked ? 1 : -1));
  }

  async function toggleBookmark() {
    const res = await fetch("/api/bookmarks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ promptId }),
    });
    if (res.status === 401) return toast.error("Log in to bookmark prompts");
    const { bookmarked: nowBookmarked } = await res.json();
    setBookmarked(nowBookmarked);
    setBookmarkCount((c) => c + (nowBookmarked ? 1 : -1));
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button variant={liked ? "primary" : "secondary"} size="sm" onClick={toggleLike}>
        <Heart className="h-4 w-4" /> {likeCount}
      </Button>
      <Button variant={bookmarked ? "primary" : "secondary"} size="sm" onClick={toggleBookmark}>
        <Bookmark className="h-4 w-4" /> {bookmarkCount}
      </Button>
      <Button
        variant="secondary"
        size="sm"
        onClick={async () => {
          await navigator.clipboard.writeText(content);
          toast.success("Copied to clipboard");
        }}
      >
        <Copy className="h-4 w-4" /> Copy
      </Button>
    </div>
  );
}
