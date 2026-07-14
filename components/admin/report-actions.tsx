"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { resolveReportAction } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";

export function ReportActions({ reportId }: { reportId: string }) {
  const [pending, startTransition] = useTransition();

  function resolve(status: "resolved" | "dismissed") {
    startTransition(async () => {
      try {
        await resolveReportAction(reportId, status);
        toast.success(`Report ${status}`);
      } catch {
        toast.error("Action failed");
      }
    });
  }

  return (
    <div className="flex shrink-0 gap-1.5">
      <Button size="sm" variant="secondary" disabled={pending} onClick={() => resolve("resolved")}>
        Resolve
      </Button>
      <Button size="sm" variant="ghost" disabled={pending} onClick={() => resolve("dismissed")}>
        Dismiss
      </Button>
    </div>
  );
}
