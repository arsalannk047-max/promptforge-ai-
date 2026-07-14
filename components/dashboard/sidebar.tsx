"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Hammer,
  Wand2,
  Repeat,
  History,
  Bookmark,
  Heart,
  FolderKanban,
  Bell,
  BarChart3,
  Settings,
  UserCircle,
  Flame,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

const nav = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/generate", label: "Generate", icon: Hammer },
  { href: "/dashboard/improve", label: "Improve", icon: Wand2 },
  { href: "/dashboard/convert", label: "Convert", icon: Repeat },
  { href: "/dashboard/history", label: "History", icon: History },
  { href: "/dashboard/saved", label: "Saved", icon: Bookmark },
  { href: "/dashboard/favorites", label: "Favorites", icon: Heart },
  { href: "/dashboard/collections", label: "Collections", icon: FolderKanban },
  { href: "/dashboard/notifications", label: "Notifications", icon: Bell },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
];

const bottomNav = [
  { href: "/dashboard/profile", label: "Profile", icon: UserCircle },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <aside className="hidden w-64 shrink-0 border-r border-forge-800 bg-forge-950 md:flex md:flex-col">
      <div className="flex h-16 items-center gap-2 border-b border-forge-800 px-6">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-ember-500/15 text-ember-500">
          <Flame className="h-[1.125rem] w-[1.125rem]" strokeWidth={2.25} />
        </span>
        <span className="font-display text-base font-semibold text-forge-50">PromptForge</span>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition",
              isActive(item.href, item.exact)
                ? "bg-ember-500/10 text-ember-500"
                : "text-forge-400 hover:bg-forge-800 hover:text-forge-100"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="space-y-1 border-t border-forge-800 px-3 py-4">
        {bottomNav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition",
              isActive(item.href)
                ? "bg-ember-500/10 text-ember-500"
                : "text-forge-400 hover:bg-forge-800 hover:text-forge-100"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </div>
    </aside>
  );
}
