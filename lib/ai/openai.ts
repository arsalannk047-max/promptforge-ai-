import OpenAI from "openai";
import type { GeneratePromptInput, ImprovePromptInput, ConvertPromptInput } from "@/lib/validations/schemas";

/**
 * Provider selection: Groq exposes an OpenAI-compatible /v1 API, so the same
 * `openai` SDK works for both — we just point the base URL and key at whichever
 * provider is configured. Groq is checked first since it has a generous free tier.
 * Falls back to demo mode if neither key is present.
 */
const groqKey = process.env.GROQ_API_KEY;
const openaiKey = process.env.OPENAI_API_KEY;

const hasKey = Boolean(groqKey || openaiKey);

const client = groqKey
  ? new OpenAI({ apiKey: groqKey, baseURL: "https://api.groq.com/openai/v1" })
  : openaiKey
    ? new OpenAI({ apiKey: openaiKey })
    : null;

export const AI_MODEL =
  process.env.AI_MODEL ||
  (groqKey ? "llama-3.3-70b-versatile" : "gpt-4o-mini");

/** True when a real AI provider key is configured. UI reads this to show a "demo mode" banner. */
export const isAiConfigured = hasKey;

export interface StructuredPrompt {
  title: string;
  objective: string;
  context: string;
  requirements: string;
  constraints: string;
  outputFormat: string;
  bestPractices: string;
  examples: string;
  edgeCases: string;
  fullPrompt: string;
}

const SYSTEM_PROMPT = `You are PromptForge AI's prompt engineering core. You write elite, production-grade prompts
for AI models. Every prompt you produce must be structured, unambiguous, and immediately usable.
Always respond with strict JSON matching the requested schema — no markdown fences, no commentary.`;

function buildGenerateUserMessage(input: GeneratePromptInput): string {
  return `Generate a professional AI prompt with these parameters:
- Target AI tool: ${input.aiTool}
- Topic/goal: ${input.topic}
- Prompt type: ${input.promptType}
- Project type: ${input.projectType || "n/a"}
- Framework: ${input.framework || "n/a"}
- Programming language: ${input.programmingLanguage || "n/a"}
- Tone: ${input.tone || "neutral, professional"}
- Difficulty: ${input.difficulty}
- Output length: ${input.outputLength}
- Extra requirements: ${input.extraRequirements || "none"}

Return JSON with keys: title, objective, context, requirements, constraints, outputFormat,
bestPractices, examples, edgeCases, fullPrompt (the complete assembled prompt combining all sections
into one ready-to-paste block, with clear section headers).`;
}

/** Deterministic, clearly-labeled placeholder used until an OPENAI_API_KEY is configured. */
function mockStructuredPrompt(topic: string): StructuredPrompt {
  const title = topic.length > 60 ? `${topic.slice(0, 57)}...` : topic;
  return {
    title,
    objective: `[Demo mode — add OPENAI_API_KEY to generate real output] Clearly define what "${topic}" should accomplish.`,
    context: "Demo mode: background/context the model needs will appear here once AI generation is connected.",
    requirements: "Demo mode: concrete, numbered requirements will be generated here.",
    constraints: "Demo mode: things the output must avoid will be generated here.",
    outputFormat: "Demo mode: the expected structure/format of the AI's response will be generated here.",
    bestPractices: "Demo mode: prompting best practices relevant to this task will be generated here.",
    examples: "Demo mode: one or two illustrative examples will be generated here.",
    edgeCases: "Demo mode: edge cases the model should handle gracefully will be generated here.",
    fullPrompt: `# ${title}\n\n**[Demo mode]** This is placeholder output. Add OPENAI_API_KEY in your environment variables to generate real, model-written prompts for "${topic}".`,
  };
}

export async function generateStructuredPrompt(input: GeneratePromptInput): Promise<StructuredPrompt> {
  if (!client) return mockStructuredPrompt(input.topic);

  const completion = await client.chat.completions.create({
    model: AI_MODEL,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: buildGenerateUserMessage(input) },
    ],
  });

  const raw = completion.choices[0]?.message?.content;
  if (!raw) throw new Error("Empty response from model");
  return JSON.parse(raw) as StructuredPrompt;
}

export async function improvePrompt(input: ImprovePromptInput): Promise<{ improved: string }> {
  if (!client) {
    return {
      improved: `[Demo mode — add OPENAI_API_KEY]\n\nYour original prompt, rewritten in "${input.mode}" mode, will appear here once AI generation is connected.\n\n---\nOriginal:\n${input.originalPrompt}`,
    };
  }

  const completion = await client.chat.completions.create({
    model: AI_MODEL,
    messages: [
      {
        role: "system",
        content: `You rewrite prompts to be clearer and more effective, in "${input.mode}" style. Return only the rewritten prompt text, no preamble.`,
      },
      { role: "user", content: input.originalPrompt },
    ],
  });

  return { improved: completion.choices[0]?.message?.content || "" };
}

export async function convertPrompt(input: ConvertPromptInput): Promise<{ converted: string }> {
  if (!client) {
    return {
      converted: `[Demo mode — add OPENAI_API_KEY]\n\nYour prompt converted from ${input.sourceTool} to ${input.targetTool} conventions will appear here.\n\n---\nOriginal:\n${input.originalPrompt}`,
    };
  }

  const completion = await client.chat.completions.create({
    model: AI_MODEL,
    messages: [
      {
        role: "system",
        content: `You convert AI prompts between platform conventions. Rewrite the given prompt so it follows
best practices and idioms for ${input.targetTool}, preserving intent from its original ${input.sourceTool} form.
Return only the converted prompt text.`,
      },
      { role: "user", content: input.originalPrompt },
    ],
  });

  return { converted: completion.choices[0]?.message?.content || "" };
}