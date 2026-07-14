import Link from "next/link";
import { Heart, Bookmark, Eye, MessageSquare } from "lucide-react";
import { Card, CardContent, Badge } from "@/components/ui/primitives";
import { formatNumber } from "@/lib/utils/cn";
import type { Prompt } from "@/types/database";

export function PromptCard({ prompt }: { prompt: Prompt & { profiles?: { username: string } | null } }) {
  return (
    <Link href={`/library/${prompt.slug}`}>
      <Card className="h-full transition hover:border-ember-500/40">
        <CardContent className="flex h-full flex-col pt-6">
          <div className="flex items-center gap-2">
            <Badge variant="ember">{prompt.ai_tool}</Badge>
            {prompt.difficulty && <Badge>{prompt.difficulty}</Badge>}
          </div>
          <h3 className="mt-3 line-clamp-2 font-display text-base font-semibold text-forge-50">{prompt.title}</h3>
          {prompt.description && (
            <p className="mt-2 line-clamp-2 flex-1 text-sm text-forge-400">{prompt.description}</p>
          )}
          <div className="mt-4 flex items-center justify-between border-t border-forge-700 pt-3 text-xs text-forge-500">
            <span>@{prompt.profiles?.username || "unknown"}</span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Heart className="h-3.5 w-3.5" /> {formatNumber(prompt.like_count)}
              </span>
              <span className="flex items-center gap-1">
                <Bookmark className="h-3.5 w-3.5" /> {formatNumber(prompt.bookmark_count)}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="h-3.5 w-3.5" /> {formatNumber(prompt.view_count)}
              </span>
              <span className="flex items-center gap-1">
                <MessageSquare className="h-3.5 w-3.5" /> {formatNumber(prompt.comment_count)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
