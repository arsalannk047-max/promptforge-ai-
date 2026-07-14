import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const { targetUserId } = await request.json();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (user.id === targetUserId) {
    return NextResponse.json({ error: "You can't follow yourself" }, { status: 400 });
  }

  const { data: existing } = await supabase
    .from("follows")
    .select("*")
    .eq("follower_id", user.id)
    .eq("following_id", targetUserId)
    .maybeSingle();

  if (existing) {
    await supabase.from("follows").delete().eq("follower_id", user.id).eq("following_id", targetUserId);
    return NextResponse.json({ following: false });
  }

  await supabase.from("follows").insert({ follower_id: user.id, following_id: targetUserId });
  return NextResponse.json({ following: true });
}
