import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { commentSchema } from "@/lib/validations/schemas";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const promptId = searchParams.get("promptId");
  if (!promptId) return NextResponse.json({ error: "promptId required" }, { status: 400 });

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("comments")
    .select("*, profiles!comments_author_id_fkey(username, avatar_url)")
    .eq("prompt_id", promptId)
    .eq("status", "visible")
    .order("created_at", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parsed = commentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid input" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("comments")
    .insert({
      prompt_id: parsed.data.promptId,
      author_id: user.id,
      body: parsed.data.body,
      parent_id: parsed.data.parentId,
    })
    .select("*, profiles!comments_author_id_fkey(username, avatar_url)")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data }, { status: 201 });
}
