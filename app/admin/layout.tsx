import Link from "next/link";
import { redirect } from "next/navigation";
import { Users, FileText, FolderTree, Flag, MessageSquare, BarChart3, CreditCard, Settings, Flame } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

const nav = [
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/prompts", label: "Prompts", icon: FileText },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/reports", label: "Reports", icon: Flag },
  { href: "/admin/comments", label: "Comments", icon: MessageSquare },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/subscriptions", label: "Subscriptions", icon: CreditCard },
  { href: "/admin/settings", label: "Site settings", icon: Settings },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (!profile || !["admin", "moderator"].includes(profile.role)) redirect("/dashboard");

  return (
    <div className="flex min-h-screen bg-forge-950">
      <aside className="hidden w-64 shrink-0 border-r border-forge-800 md:flex md:flex-col">
        <div className="flex h-16 items-center gap-2 border-b border-forge-800 px-6">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-ember-500/15 text-ember-500">
            <Flame className="h-[1.125rem] w-[1.125rem]" />
          </span>
          <span className="font-display text-base font-semibold text-forge-50">Admin</span>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-forge-400 transition hover:bg-forge-800 hover:text-forge-100"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-forge-800 px-3 py-4">
          <Link href="/dashboard" className="block rounded-lg px-3 py-2 text-sm text-forge-500 hover:bg-forge-800">
            ← Back to app
          </Link>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto px-6 py-8">{children}</main>
    </div>
  );
}
