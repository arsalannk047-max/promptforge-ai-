"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { hideCommentAction } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";

export function HideCommentButton({ commentId }: { commentId: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      size="sm"
      variant="destructive"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          try {
            await hideCommentAction(commentId);
            toast.success("Comment hidden");
          } catch {
            toast.error("Action failed");
          }
        })
      }
    >
      Hide
    </Button>
  );
}
