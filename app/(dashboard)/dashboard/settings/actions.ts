"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function updateProfileAction(_prev: { error?: string; success?: string } | null, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { error } = await supabase
    .from("profiles")
    .update({
      display_name: String(formData.get("displayName") || ""),
      bio: String(formData.get("bio") || ""),
      website_url: String(formData.get("websiteUrl") || "") || null,
      twitter_url: String(formData.get("twitterUrl") || "") || null,
      github_url: String(formData.get("githubUrl") || "") || null,
      is_public: formData.get("isPublic") === "on",
    })
    .eq("id", user.id);

  if (error) return { error: error.message };
  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard/profile");
  return { success: "Profile updated" };
}
