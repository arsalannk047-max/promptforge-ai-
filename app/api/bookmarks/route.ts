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
    .from("prompt_bookmarks")
    .select("*")
    .eq("user_id", user.id)
    .eq("prompt_id", promptId)
    .maybeSingle();

  if (existing) {
    await supabase.from("prompt_bookmarks").delete().eq("user_id", user.id).eq("prompt_id", promptId);
    return NextResponse.json({ bookmarked: false });
  }

  await supabase.from("prompt_bookmarks").insert({ user_id: user.id, prompt_id: promptId });
  return NextResponse.json({ bookmarked: true });
}
