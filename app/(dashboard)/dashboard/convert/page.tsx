"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/primitives";
import { Label, Textarea } from "@/components/ui/primitives";
import { Select } from "@/components/ui/select-native";
import { ResultPanel } from "@/components/prompt/result-panel";
import { aiTools } from "@/lib/validations/schemas";

const toolLabels: Record<(typeof aiTools)[number], string> = {
  chatgpt: "ChatGPT",
  claude: "Claude",
  gemini: "Gemini",
  cursor: "Cursor",
  github_copilot: "GitHub Copilot",
  meta_ai: "Meta AI",
  canva_ai: "Canva AI",
  midjourney: "Midjourney",
};

export default function ConvertPage() {
  const [original, setOriginal] = useState("");
  const [sourceTool, setSourceTool] = useState<(typeof aiTools)[number]>("chatgpt");
  const [targetTool, setTargetTool] = useState<(typeof aiTools)[number]>("claude");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleConvert() {
    if (original.trim().length < 10) {
      toast.error("Paste a bit more of your prompt first");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/prompts/convert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ originalPrompt: original, sourceTool, targetTool }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Something went wrong");
      setResult(json.result.converted);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Conversion failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-semibold text-forge-50">Convert a prompt</h1>
        <p className="mt-1 text-sm text-forge-400">Move a prompt between platforms without losing intent.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardContent className="space-y-5 pt-6">
            <div className="flex items-center gap-3">
              <div className="flex-1 space-y-1.5">
                <Label>From</Label>
                <Select value={sourceTool} onChange={(e) => setSourceTool(e.target.value as typeof sourceTool)}>
                  {aiTools.map((t) => (
                    <option key={t} value={t}>
                      {toolLabels[t]}
                    </option>
                  ))}
                </Select>
              </div>
              <ArrowRight className="mt-6 h-4 w-4 shrink-0 text-forge-500" />
              <div className="flex-1 space-y-1.5">
                <Label>To</Label>
                <Select value={targetTool} onChange={(e) => setTargetTool(e.target.value as typeof targetTool)}>
                  {aiTools.map((t) => (
                    <option key={t} value={t}>
                      {toolLabels[t]}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="original">Original prompt</Label>
              <Textarea
                id="original"
                rows={12}
                placeholder="Paste the prompt you want to convert..."
                value={original}
                onChange={(e) => setOriginal(e.target.value)}
              />
            </div>

            <Button className="w-full" onClick={handleConvert} disabled={loading}>
              {loading ? "Converting..." : "Convert prompt"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            {!result && !loading && (
              <div className="grid h-full min-h-[20rem] place-items-center text-center text-sm text-forge-500">
                Your converted prompt will appear here.
              </div>
            )}
            {loading && <div className="h-64 animate-pulse rounded-xl bg-forge-800" />}
            {result && !loading && <ResultPanel key={result.slice(0, 20)} content={result} title="converted-prompt" />}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
