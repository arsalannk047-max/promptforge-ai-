import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generatePromptSchema } from "@/lib/validations/schemas";
import { generateStructuredPrompt, AI_MODEL } from "@/lib/ai/openai";

const DAILY_GENERATION_LIMIT = 10;

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json().catch(() => null);
  const parsed = generatePromptSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid input" }, { status: 400 });
  }

  // Count how many prompts this user has generated today (resets every day at midnight, server time)
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const { count: todayCount } = await supabase
    .from("generation_history")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .gte("created_at", startOfToday.toISOString());

  if ((todayCount ?? 0) >= DAILY_GENERATION_LIMIT) {
    return NextResponse.json(
      { error: `Daily limit reached (${DAILY_GENERATION_LIMIT}/day on the Free plan). Try again tomorrow or upgrade your plan.` },
      { status: 429 }
    );
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("prompts_generated_count")
    .eq("id", user.id)
    .single();

  try {
    const result = await generateStructuredPrompt(parsed.data);
    await Promise.all([
      supabase.from("generation_history").insert({
        user_id: user.id,
        mode: "generate",
        input_params: parsed.data,
        raw_output: result.fullPrompt,
        model: AI_MODEL,
      }),
      supabase
        .from("profiles")
        .update({ prompts_generated_count: (profile?.prompts_generated_count ?? 0) + 1 })
        .eq("id", user.id),
    ]);
    return NextResponse.json({ result });
  } catch (err) {
    console.error("[generate] failed", err);
    return NextResponse.json({ error: "Generation failed. Please try again." }, { status: 500 });
  }
}