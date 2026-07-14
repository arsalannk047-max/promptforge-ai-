import Link from "next/link";
import { Flame, Github, Twitter } from "lucide-react";

const columns = [
  {
    title: "Product",
    links: [
      { label: "Generator", href: "/dashboard/generate" },
      { label: "Improver", href: "/dashboard/improve" },
      { label: "Converter", href: "/dashboard/convert" },
      { label: "Library", href: "/library" },
      { label: "Pricing", href: "#pricing" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Blog", href: "/blog" },
      { label: "Careers", href: "/careers" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Docs", href: "/docs" },
      { label: "Changelog", href: "/changelog" },
      { label: "Status", href: "/status" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "Security", href: "/security" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-forge-800/80 bg-forge-950 py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-10 md:grid-cols-6">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 font-display text-lg font-semibold text-forge-50">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-ember-500/15 text-ember-500">
                <Flame className="h-[1.125rem] w-[1.125rem]" strokeWidth={2.25} />
              </span>
              PromptForge
            </Link>
            <p className="mt-4 max-w-xs text-sm text-forge-500">
              Generate, improve, convert, and share prompts that actually work — for every major AI model.
            </p>
            <div className="mt-5 flex gap-3">
              <Link href="https://twitter.com" className="text-forge-500 hover:text-forge-200">
                <Twitter className="h-[1.125rem] w-[1.125rem]" />
              </Link>
              <Link href="https://github.com" className="text-forge-500 hover:text-forge-200">
                <Github className="h-[1.125rem] w-[1.125rem]" />
              </Link>
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="font-display text-sm font-semibold text-forge-200">{col.title}</h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-sm text-forge-500 hover:text-forge-200">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-forge-800 pt-8 text-xs text-forge-600 md:flex-row">
          <p>© {new Date().getFullYear()} PromptForge AI. All rights reserved.</p>
          <p>Built with Next.js, Supabase, and a lot of forged prompts.</p>
        </div>
      </div>
    </footer>
  );
}
