import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const { promptId } = await request.json();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: existing } = await supabase
    .from("prompt_likes")
    .select("*")
    .eq("user_id", user.id)
    .eq("prompt_id", promptId)
    .maybeSingle();

  if (existing) {
    await supabase.from("prompt_likes").delete().eq("user_id", user.id).eq("prompt_id", promptId);
    return NextResponse.json({ liked: false });
  }

  await supabase.from("prompt_likes").insert({ user_id: user.id, prompt_id: promptId });
  return NextResponse.json({ liked: true });
}
