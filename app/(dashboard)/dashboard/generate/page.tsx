"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { generatePromptSchema, type GeneratePromptInput, aiTools } from "@/lib/validations/schemas";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/primitives";
import { Input, Label, Textarea } from "@/components/ui/primitives";
import { Select } from "@/components/ui/select-native";
import { ResultPanel } from "@/components/prompt/result-panel";
import type { StructuredPrompt } from "@/lib/ai/openai";

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

export default function GeneratePage() {
  const searchParams = useSearchParams();
  const [result, setResult] = useState<StructuredPrompt | null>(null);
  const [loading, setLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<GeneratePromptInput>({
    resolver: zodResolver(generatePromptSchema),
    defaultValues: {
      aiTool: "chatgpt",
      difficulty: "intermediate",
      outputLength: "medium",
      promptType: "task",
    },
  });

  useEffect(() => {
    const topic = searchParams.get("topic");
    const framework = searchParams.get("framework");
    const projectType = searchParams.get("projectType");
    if (topic) setValue("topic", topic);
    if (framework) {
      setValue("framework", framework);
      setShowAdvanced(true);
    }
    if (projectType) {
      setValue("projectType", projectType);
      setShowAdvanced(true);
    }
  }, [searchParams, setValue]);

  async function onSubmit(values: GeneratePromptInput) {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/prompts/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Something went wrong");
      setResult(json.result);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleSavePrompt(content: string) {
    if (!result) return;
    const res = await fetch("/api/prompts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: result.title, content, isPublic: false }),
    });
    if (!res.ok) throw new Error("Save failed");
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-semibold text-forge-50">Generate a prompt</h1>
        <p className="mt-1 text-sm text-forge-400">
          Fill in what you&apos;re building. The forge assembles a complete, structured prompt.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="topic">What is this prompt for?</Label>
                <Textarea
                  id="topic"
                  rows={3}
                  placeholder="e.g. Reviewing pull requests for a Next.js + TypeScript codebase"
                  {...register("topic")}
                />
                {errors.topic && <p className="text-xs text-danger">{errors.topic.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="aiTool">AI tool</Label>
                  <Select id="aiTool" {...register("aiTool")}>
                    {aiTools.map((t) => (
                      <option key={t} value={t}>
                        {toolLabels[t]}
                      </option>
                    ))}
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="promptType">Prompt type</Label>
                  <Select id="promptType" {...register("promptType")}>
                    <option value="task">Task</option>
                    <option value="role">Role-based</option>
                    <option value="chain-of-thought">Chain of thought</option>
                    <option value="few-shot">Few-shot</option>
                    <option value="system">System prompt</option>
                  </Select>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowAdvanced((v) => !v)}
                className="flex w-full items-center justify-between rounded-lg border border-forge-800 bg-forge-900/40 px-4 py-2.5 text-sm font-medium text-forge-300 transition hover:border-forge-700 hover:text-forge-100"
              >
                <span>{showAdvanced ? "Hide advanced options" : "Show advanced options"}</span>
                <svg
                  viewBox="0 0 24 24"
                  className={`h-4 w-4 transition-transform duration-200 ${showAdvanced ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>

              {showAdvanced && (
                <div className="space-y-5 border-l-2 border-forge-800 pl-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="projectType">Project type</Label>
                      <Input id="projectType" placeholder="Web app, mobile, API..." {...register("projectType")} />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="framework">Framework</Label>
                      <Input id="framework" placeholder="Next.js, Django..." {...register("framework")} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="programmingLanguage">Language</Label>
                      <Input id="programmingLanguage" placeholder="TypeScript, Python..." {...register("programmingLanguage")} />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="tone">Tone</Label>
                      <Input id="tone" placeholder="Professional, casual..." {...register("tone")} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="difficulty">Difficulty</Label>
                      <Select id="difficulty" {...register("difficulty")}>
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                        <option value="expert">Expert</option>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="outputLength">Output length</Label>
                      <Select id="outputLength" {...register("outputLength")}>
                        <option value="short">Short</option>
                        <option value="medium">Medium</option>
                        <option value="long">Long</option>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="extraRequirements">Extra requirements</Label>
                    <Textarea
                      id="extraRequirements"
                      rows={3}
                      placeholder="Anything else the prompt must account for..."
                      {...register("extraRequirements")}
                    />
                  </div>
                </div>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Forging..." : "Generate prompt"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            {!result && !loading && (
              <div className="grid h-full min-h-[20rem] place-items-center text-center text-sm text-forge-500">
                Your forged prompt will appear here.
              </div>
            )}
            {loading && (
              <div className="space-y-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-4 w-full animate-pulse rounded bg-forge-800" style={{ width: `${70 + (i % 3) * 10}%` }} />
                ))}
              </div>
            )}
            {result && !loading && (
              <ResultPanel key={result.title} content={result.fullPrompt} title={result.title} onSave={handleSavePrompt} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}