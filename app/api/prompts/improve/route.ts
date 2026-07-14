import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { improvePromptSchema } from "@/lib/validations/schemas";
import { improvePrompt, AI_MODEL } from "@/lib/ai/openai";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parsed = improvePromptSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid input" }, { status: 400 });
  }

  try {
    const result = await improvePrompt(parsed.data);
    await supabase.from("generation_history").insert({
      user_id: user.id,
      mode: "improve",
      input_params: parsed.data,
      raw_output: result.improved,
      model: AI_MODEL,
    });
    return NextResponse.json({ result });
  } catch (err) {
    console.error("[improve] failed", err);
    return NextResponse.json({ error: "Improvement failed. Please try again." }, { status: 500 });
  }
}
