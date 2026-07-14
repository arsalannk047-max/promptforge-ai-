"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { updateSiteSettingAction } from "@/app/admin/actions";
import { Input } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";

export function SiteSettingRow({ settingKey, value }: { settingKey: string; value: unknown }) {
  const [draft, setDraft] = useState(JSON.stringify(value));
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex items-center justify-between gap-3 px-5 py-4">
      <div className="flex-1">
        <p className="text-sm font-medium text-forge-200">{settingKey.replace(/_/g, " ")}</p>
        <Input value={draft} onChange={(e) => setDraft(e.target.value)} className="mt-1.5 h-9 font-mono text-xs" />
      </div>
      <Button
        size="sm"
        variant="secondary"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            try {
              await updateSiteSettingAction(settingKey, draft);
              toast.success("Setting updated");
            } catch {
              toast.error("Update failed");
            }
          })
        }
      >
        Save
      </Button>
    </div>
  );
}
