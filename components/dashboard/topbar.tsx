"use client";

import { Search, Bell } from "lucide-react";
import Link from "next/link";
import { signOutAction } from "@/app/(auth)/actions";
import type { Profile } from "@/types/database";

export function Topbar({ profile }: { profile: Profile | null }) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-forge-800 bg-forge-950/80 px-6 backdrop-blur-xl">
      <button className="flex w-72 items-center gap-2 rounded-lg border border-forge-700 bg-forge-900 px-3 py-2 text-sm text-forge-500 transition hover:border-forge-600">
        <Search className="h-4 w-4" />
        Search prompts...
        <kbd className="ml-auto rounded border border-forge-700 bg-forge-800 px-1.5 py-0.5 font-mono text-[10px] text-forge-500">
          ⌘K
        </kbd>
      </button>

      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/notifications"
          className="grid h-9 w-9 place-items-center rounded-lg text-forge-400 hover:bg-forge-800 hover:text-forge-100"
        >
          <Bell className="h-[1.125rem] w-[1.125rem]" />
        </Link>

        <div className="group relative">
          <button className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-forge-800">
            <div className="grid h-8 w-8 place-items-center rounded-full bg-ember-500/15 font-display text-sm text-ember-500">
              {profile?.username?.[0]?.toUpperCase() || "?"}
            </div>
            <span className="hidden text-sm text-forge-200 sm:block">{profile?.username || "Account"}</span>
          </button>

          <div className="invisible absolute right-0 top-full mt-2 w-48 rounded-xl border border-forge-700 bg-forge-900 py-1 opacity-0 shadow-xl transition group-hover:visible group-hover:opacity-100">
            <Link href="/dashboard/profile" className="block px-4 py-2 text-sm text-forge-300 hover:bg-forge-800">
              Profile
            </Link>
            <Link href="/dashboard/settings" className="block px-4 py-2 text-sm text-forge-300 hover:bg-forge-800">
              Settings
            </Link>
            <form action={signOutAction}>
              <button type="submit" className="w-full px-4 py-2 text-left text-sm text-danger hover:bg-forge-800">
                Log out
              </button>
            </form>
          </div>
        </div>
      </div>
    </header>
  );
}
