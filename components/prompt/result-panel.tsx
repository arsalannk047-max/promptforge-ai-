"use client";

import { useState } from "react";
import { Copy, Save, Share2, Download, Pencil, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/primitives";

export function ResultPanel({
  content,
  title = "untitled-prompt",
  onSave,
}: {
  content: string;
  title?: string;
  onSave?: (editedContent: string) => Promise<void> | void;
}) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(content);
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 1500);
  }

  function handleDownload() {
    const blob = new Blob([value], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.replace(/\s+/g, "-").toLowerCase()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleShare() {
    if (navigator.share) {
      await navigator.share({ title, text: value });
    } else {
      await handleCopy();
      toast.info("Sharing isn't supported here — copied instead");
    }
  }

  async function handleSave() {
    if (!onSave) return;
    setSaving(true);
    try {
      await onSave(value);
      toast.success("Saved to your prompts");
    } catch {
      toast.error("Couldn't save — try again");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant="secondary" onClick={handleCopy}>
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          Copy
        </Button>
        {onSave && (
          <Button size="sm" variant="secondary" onClick={handleSave} disabled={saving}>
            <Save className="h-4 w-4" />
            {saving ? "Saving..." : "Save"}
          </Button>
        )}
        <Button size="sm" variant="secondary" onClick={handleShare}>
          <Share2 className="h-4 w-4" /> Share
        </Button>
        <Button size="sm" variant="secondary" onClick={handleDownload}>
          <Download className="h-4 w-4" /> Download
        </Button>
        <Button size="sm" variant="secondary" onClick={() => setEditing((v) => !v)}>
          <Pencil className="h-4 w-4" /> {editing ? "Done" : "Edit"}
        </Button>
      </div>

      {editing ? (
        <Textarea value={value} onChange={(e) => setValue(e.target.value)} rows={16} className="font-mono text-sm" />
      ) : (
        <pre className="max-h-[32rem] overflow-auto whitespace-pre-wrap rounded-xl border border-forge-700 bg-forge-900/60 p-5 font-mono text-sm leading-relaxed text-forge-200">
          {value}
        </pre>
      )}
    </div>
  );
}
