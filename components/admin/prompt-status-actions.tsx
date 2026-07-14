"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { updatePromptStatusAction } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import type { PromptStatus } from "@/types/database";

export function PromptStatusActions({ promptId, currentStatus }: { promptId: string; currentStatus: PromptStatus }) {
  const [pending, startTransition] = useTransition();

  function update(status: "published" | "archived" | "flagged") {
    startTransition(async () => {
      try {
        await updatePromptStatusAction(promptId, status);
        toast.success(`Marked as ${status}`);
      } catch {
        toast.error("Action failed");
      }
    });
  }

  return (
    <div className="flex gap-1.5">
      {currentStatus !== "published" && (
        <Button size="sm" variant="secondary" disabled={pending} onClick={() => update("published")}>
          Publish
        </Button>
      )}
      {currentStatus !== "flagged" && (
        <Button size="sm" variant="destructive" disabled={pending} onClick={() => update("flagged")}>
          Flag
        </Button>
      )}
      {currentStatus !== "archived" && (
        <Button size="sm" variant="ghost" disabled={pending} onClick={() => update("archived")}>
          Archive
        </Button>
      )}
    </div>
  );
}
