"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils/cn";

export async function createCollectionAction(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const name = String(formData.get("name") || "").trim();
  if (!name) return;

  await supabase.from("collections").insert({
    owner_id: user.id,
    name,
    slug: `${slugify(name)}-${Math.random().toString(36).slice(2, 6)}`,
    is_public: formData.get("isPublic") === "on",
  });

  revalidatePath("/dashboard/collections");
}

export async function deleteCollectionAction(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  await supabase.from("collections").delete().eq("id", id).eq("owner_id", user.id);
  revalidatePath("/dashboard/collections");
}
