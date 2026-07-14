"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/primitives";
import { cn } from "@/lib/utils/cn";
import type { Category } from "@/types/database";

const sorts = [
  { value: "latest", label: "Latest" },
  { value: "trending", label: "Trending" },
  { value: "popular", label: "Popular" },
];

export function LibraryFilters({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function updateParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="space-y-4">
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-forge-500" />
        <Input
          placeholder="Search prompts..."
          defaultValue={searchParams.get("q") || ""}
          onKeyDown={(e) => {
            if (e.key === "Enter") updateParam("q", (e.target as HTMLInputElement).value || null);
          }}
          className="pl-9"
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => updateParam("category", null)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs",
              !searchParams.get("category")
                ? "border-ember-500/50 bg-ember-500/10 text-ember-400"
                : "border-forge-700 text-forge-400 hover:text-forge-200"
            )}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => updateParam("category", c.slug)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs",
                searchParams.get("category") === c.slug
                  ? "border-ember-500/50 bg-ember-500/10 text-ember-400"
                  : "border-forge-700 text-forge-400 hover:text-forge-200"
              )}
            >
              {c.name}
            </button>
          ))}
        </div>

        <div className="flex gap-1 rounded-lg border border-forge-700 p-1">
          {sorts.map((s) => (
            <button
              key={s.value}
              onClick={() => updateParam("sort", s.value)}
              className={cn(
                "rounded-md px-3 py-1 text-xs",
                (searchParams.get("sort") || "latest") === s.value
                  ? "bg-forge-800 text-forge-50"
                  : "text-forge-500"
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
