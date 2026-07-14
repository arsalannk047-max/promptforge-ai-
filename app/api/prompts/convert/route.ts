import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { convertPromptSchema } from "@/lib/validations/schemas";
import { convertPrompt, AI_MODEL } from "@/lib/ai/openai";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parsed = convertPromptSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid input" }, { status: 400 });
  }

  try {
    const result = await convertPrompt(parsed.data);
    await supabase.from("generation_history").insert({
      user_id: user.id,
      mode: "convert",
      input_params: parsed.data,
      raw_output: result.converted,
      model: AI_MODEL,
    });
    return NextResponse.json({ result });
  } catch (err) {
    console.error("[convert] failed", err);
    return NextResponse.json({ error: "Conversion failed. Please try again." }, { status: 500 });
  }
}
