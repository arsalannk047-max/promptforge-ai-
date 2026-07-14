"use client";

import { useActionState } from "react";
import { updateProfileAction } from "@/app/(dashboard)/dashboard/settings/actions";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/primitives";
import type { Profile } from "@/types/database";

export function SettingsForm({ profile }: { profile: Profile }) {
  const [state, formAction, pending] = useActionState(updateProfileAction, null);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="displayName">Display name</Label>
        <Input id="displayName" name="displayName" defaultValue={profile.display_name || ""} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="bio">Bio</Label>
        <Textarea id="bio" name="bio" rows={3} defaultValue={profile.bio || ""} />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="websiteUrl">Website</Label>
          <Input id="websiteUrl" name="websiteUrl" defaultValue={profile.website_url || ""} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="twitterUrl">Twitter/X</Label>
          <Input id="twitterUrl" name="twitterUrl" defaultValue={profile.twitter_url || ""} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="githubUrl">GitHub</Label>
          <Input id="githubUrl" name="githubUrl" defaultValue={profile.github_url || ""} />
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm text-forge-400">
        <input type="checkbox" name="isPublic" defaultChecked={profile.is_public} className="h-4 w-4 rounded border-forge-600 bg-forge-800" />
        Make my profile public
      </label>

      {state?.error && <p className="text-sm text-danger">{state.error}</p>}
      {state?.success && <p className="text-sm text-success">{state.success}</p>}

      <Button type="submit" disabled={pending}>
        {pending ? "Saving..." : "Save changes"}
      </Button>
    </form>
  );
}
