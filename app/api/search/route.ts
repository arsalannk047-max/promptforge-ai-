import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();

  if (!q) {
    return NextResponse.json({ prompts: [], history: [] });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [{ data: prompts }, { data: history }] = await Promise.all([
    supabase
      .from("prompts")
      .select("id, title, slug, ai_tool")
      .eq("owner_id", user.id)
      .ilike("title", `%${q}%`)
      .limit(5),
    supabase
      .from("generation_history")
      .select("id, input_params, mode, created_at")
      .eq("user_id", user.id)
      .ilike("input_params->>topic", `%${q}%`)
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  return NextResponse.json({
    prompts: prompts ?? [],
    history: history ?? [],
  });
}