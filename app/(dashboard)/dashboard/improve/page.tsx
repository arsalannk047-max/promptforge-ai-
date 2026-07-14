"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/primitives";
import { Label, Textarea } from "@/components/ui/primitives";
import { Select } from "@/components/ui/select-native";
import { ResultPanel } from "@/components/prompt/result-panel";
import type { ImprovePromptInput } from "@/lib/validations/schemas";

const modes: { value: ImprovePromptInput["mode"]; label: string }[] = [
  { value: "beginner", label: "Beginner" },
  { value: "professional", label: "Professional" },
  { value: "expert", label: "Expert" },
  { value: "detailed", label: "Detailed" },
  { value: "short", label: "Short" },
];

export default function ImprovePage() {
  const [original, setOriginal] = useState("");
  const [mode, setMode] = useState<ImprovePromptInput["mode"]>("professional");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleImprove() {
    if (original.trim().length < 10) {
      toast.error("Paste a bit more of your prompt first");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/prompts/improve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ originalPrompt: original, mode }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Something went wrong");
      setResult(json.result.improved);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Improvement failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-semibold text-forge-50">Improve a prompt</h1>
        <p className="mt-1 text-sm text-forge-400">Paste any prompt. The forge rewrites it sharper.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardContent className="space-y-5 pt-6">
            <div className="space-y-1.5">
              <Label htmlFor="original">Your prompt</Label>
              <Textarea
                id="original"
                rows={12}
                placeholder="Paste the prompt you want improved..."
                value={original}
                onChange={(e) => setOriginal(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="mode">Mode</Label>
              <Select id="mode" value={mode} onChange={(e) => setMode(e.target.value as ImprovePromptInput["mode"])}>
                {modes.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </Select>
            </div>
            <Button className="w-full" onClick={handleImprove} disabled={loading}>
              {loading ? "Improving..." : "Improve prompt"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            {!result && !loading && (
              <div className="grid h-full min-h-[20rem] place-items-center text-center text-sm text-forge-500">
                Your improved prompt will appear here.
              </div>
            )}
            {loading && <div className="h-64 animate-pulse rounded-xl bg-forge-800" />}
            {result && !loading && <ResultPanel key={result.slice(0, 20)} content={result} title="improved-prompt" />}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
