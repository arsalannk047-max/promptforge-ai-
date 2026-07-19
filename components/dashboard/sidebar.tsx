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
  X,
  Volume2,
  Video,
  LayoutTemplate,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

const nav = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/templates", label: "Templates", icon: LayoutTemplate },
  { href: "/dashboard/generate", label: "Generate", icon: Hammer },
  { href: "/dashboard/improve", label: "Improve", icon: Wand2 },
  { href: "/dashboard/convert", label: "Convert", icon: Repeat },
  { href: "/dashboard/voice", label: "Text to Voice", icon: Volume2 },
  { href: "/dashboard/video", label: "Text to Video", icon: Video },
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

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function Sidebar({ mobileOpen = false, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const navContent = (
    <>
      <div className="flex h-16 items-center gap-2 border-b border-forge-800 px-6">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-ember-500/15 text-ember-500">
          <Flame className="h-[1.125rem] w-[1.125rem]" strokeWidth={2.25} />
        </span>
        <span className="font-display text-base font-semibold text-forge-50">PromptForge</span>
        {onMobileClose && (
          <button
            onClick={onMobileClose}
            className="ml-auto rounded-lg p-1.5 text-forge-400 hover:bg-forge-800 hover:text-forge-100 md:hidden"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onMobileClose}
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
            onClick={onMobileClose}
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
    </>
  );

  return (
    <>
      <aside className="hidden w-64 shrink-0 border-r border-forge-800 bg-forge-950 md:flex md:flex-col">
        {navContent}
      </aside>

      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity md:hidden",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onMobileClose}
        aria-hidden="true"
      />

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-forge-800 bg-forge-950 transition-transform duration-200 md:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {navContent}
      </aside>
    </>
  );
}