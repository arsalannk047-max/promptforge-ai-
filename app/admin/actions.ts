"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient, createClient } from "@/lib/supabase/server";

async function assertAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (!profile || !["admin", "moderator"].includes(profile.role)) throw new Error("Forbidden");
  return supabase;
}

export async function updateUserRoleAction(userId: string, role: "user" | "admin" | "moderator") {
  await assertAdmin();
  const admin = createAdminClient();
  await admin.from("profiles").update({ role }).eq("id", userId);
  revalidatePath("/admin/users");
}

export async function updatePromptStatusAction(promptId: string, status: "published" | "archived" | "flagged") {
  await assertAdmin();
  const admin = createAdminClient();
  await admin.from("prompts").update({ status }).eq("id", promptId);
  revalidatePath("/admin/prompts");
}

export async function resolveReportAction(reportId: string, status: "resolved" | "dismissed") {
  await assertAdmin();
  const admin = createAdminClient();
  await admin.from("reports").update({ status, resolved_at: new Date().toISOString() }).eq("id", reportId);
  revalidatePath("/admin/reports");
}

export async function hideCommentAction(commentId: string) {
  await assertAdmin();
  const admin = createAdminClient();
  await admin.from("comments").update({ status: "hidden" }).eq("id", commentId);
  revalidatePath("/admin/comments");
}

export async function createCategoryAction(formData: FormData) {
  await assertAdmin();
  const admin = createAdminClient();
  const name = String(formData.get("name") || "").trim();
  const slug = name.toLowerCase().replace(/\s+/g, "-");
  if (!name) return;
  await admin.from("categories").insert({ name, slug });
  revalidatePath("/admin/categories");
}

export async function updateSiteSettingAction(key: string, value: string) {
  await assertAdmin();
  const admin = createAdminClient();
  let parsed: unknown = value;
  try {
    parsed = JSON.parse(value);
  } catch {
    // keep as raw string if not valid JSON
  }
  await admin.from("site_settings").update({ value: parsed, updated_at: new Date().toISOString() }).eq("key", key);
  revalidatePath("/admin/settings");
}
