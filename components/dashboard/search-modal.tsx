"use client";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X, TrendingUp, Clock, FileText } from "lucide-react";

const TRENDING_SUGGESTIONS = [
  "TikTok video script",
  "Cold outreach email",
  "Code review checklist",
  "Landing page copy",
  "SQL query for reporting",
  "Interview prep questions",
  "Instagram caption ideas",
  "Product description",
];

interface SearchResult {
  id: string;
  title: string;
  href: string;
  type: "prompt" | "history";
}

export function SearchModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setResults([]);
    }
  }, [open]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const json = await res.json();
        const prompts: SearchResult[] = (json.prompts ?? []).map(
          (p: { id: string; title: string; slug: string }) => ({
            id: p.id,
            title: p.title,
            href: `/library/${p.slug}`,
            type: "prompt" as const,
          })
        );
        const history: SearchResult[] = (json.history ?? []).map(
          (h: { id: string; input_params?: { topic?: string } }) => ({
            id: h.id,
            title: h.input_params?.topic || "Untitled generation",
            href: `/dashboard/history`,
            type: "history" as const,
          })
        );
        setResults([...prompts, ...history]);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [query]);

  const goToSuggestion = useCallback(
    (text: string) => {
      onClose();
      router.push(`/dashboard/generate?topic=${encodeURIComponent(text)}`);
    },
    [router, onClose]
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center px-4 pt-24">
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-forge-700 bg-forge-900 shadow-2xl">
        <div className="flex items-center gap-3 border-b border-forge-800 px-4 py-3">
          <Search className="h-4 w-4 text-forge-500" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search your prompts, or try a trending idea..."
            className="flex-1 bg-transparent text-sm text-forge-100 placeholder:text-forge-500 focus:outline-none"
          />
          <button onClick={onClose} className="rounded-lg p-1 text-forge-500 hover:bg-forge-800 hover:text-forge-200">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto p-2">
          {!query.trim() && (
            <div>
              <p className="flex items-center gap-1.5 px-2 py-1.5 text-xs font-medium uppercase tracking-wide text-forge-500">
                <TrendingUp className="h-3.5 w-3.5" /> Trending ideas
              </p>
              {TRENDING_SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => goToSuggestion(s)}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-forge-200 hover:bg-forge-800"
                >
                  <Search className="h-3.5 w-3.5 text-forge-600" />
                  {s}
                </button>
              ))}
            </div>
          )}

          {query.trim() && loading && <p className="px-3 py-4 text-center text-sm text-forge-500">Searching...</p>}

          {query.trim() && !loading && results.length === 0 && (
            <div className="px-3 py-4 text-center text-sm text-forge-500">
              No matches yet.{" "}
              <button onClick={() => goToSuggestion(query)} className="text-ember-500 underline">
                Generate a prompt about &quot;{query}&quot;
              </button>
            </div>
          )}

          {query.trim() && !loading && results.length > 0 && (
            <div>
              {results.map((r) => (
                <button
                  key={`${r.type}-${r.id}`}
                  onClick={() => {
                    onClose();
                    router.push(r.href);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-forge-200 hover:bg-forge-800"
                >
                  {r.type === "prompt" ? (
                    <FileText className="h-3.5 w-3.5 text-forge-600" />
                  ) : (
                    <Clock className="h-3.5 w-3.5 text-forge-600" />
                  )}
                  {r.title}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}