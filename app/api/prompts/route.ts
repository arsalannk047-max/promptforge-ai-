import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { savePromptSchema } from "@/lib/validations/schemas";
import { slugify } from "@/lib/utils/cn";

export async function GET(request: Request) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);

  const q = searchParams.get("q");
  const category = searchParams.get("category");
  const sort = searchParams.get("sort") || "latest"; // latest | trending | popular
  const page = Number(searchParams.get("page") || "1");
  const pageSize = 20;

  let query = supabase
    .from("prompts")
    .select("*, profiles!prompts_owner_id_fkey(username, avatar_url), categories(name, slug)", { count: "exact" })
    .eq("is_public", true)
    .eq("status", "published");

  if (q) query = query.textSearch("title", q, { type: "websearch" });
  if (category) query = query.eq("categories.slug", category);

  if (sort === "popular") query = query.order("like_count", { ascending: false });
  else if (sort === "trending") query = query.order("view_count", { ascending: false });
  else query = query.order("created_at", { ascending: false });

  query = query.range((page - 1) * pageSize, page * pageSize - 1);

  const { data, count, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ data, count, page, pageSize });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parsed = savePromptSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid input" }, { status: 400 });
  }

  const baseSlug = slugify(parsed.data.title);
  const slug = `${baseSlug}-${Math.random().toString(36).slice(2, 7)}`;

  const { data, error } = await supabase
    .from("prompts")
    .insert({
      owner_id: user.id,
      title: parsed.data.title,
      slug,
      description: parsed.data.description,
      content: parsed.data.content,
      category_id: parsed.data.categoryId,
      is_public: parsed.data.isPublic,
      status: "published",
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (parsed.data.tags?.length) {
    for (const tagName of parsed.data.tags) {
      const tagSlug = slugify(tagName);
      const { data: tag } = await supabase
        .from("tags")
        .upsert({ name: tagName, slug: tagSlug }, { onConflict: "slug" })
        .select()
        .single();
      if (tag) {
        await supabase.from("prompt_tags").insert({ prompt_id: data.id, tag_id: tag.id });
      }
    }
  }

  return NextResponse.json({ data }, { status: 201 });
}
