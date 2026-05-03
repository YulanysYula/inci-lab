"use client";

import { useMemo, useState } from "react";
import { ScoreGauge } from "./components/ScoreGauge";
import { IngredientCard } from "./components/IngredientCard";
import { SkinTypeFilter } from "./components/SkinTypeFilter";
import { ScanButton } from "./components/ScanButton";
import { FlagBar } from "./components/FlagBar";
import { verdictFor, type SkinType } from "@/lib/scoring";
import type { AnalysisResult, AnalyzedIngredient } from "@/lib/analyze";

const SAMPLE = `Aqua, Glycerin, Niacinamide, Sodium Hyaluronate, Panthenol, Dimethicone, Tocopheryl Acetate, Alcohol Denat., Phenoxyethanol, Parfum, Linalool, Limonene`;

type Filter = "all" | "good" | "neutral" | "bad";

export default function HomePage() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [skin, setSkin] = useState<SkinType | "all">("all");

  async function handleAnalyze() {
    if (!input.trim()) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredients: input }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Something went wrong.");
      setResult(data);
      setFilter("all");
      // Smooth scroll to results.
      setTimeout(() => {
        document.getElementById("results")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
    } catch (e: any) {
      setError(e?.message || "Analysis failed.");
    } finally {
      setBusy(false);
    }
  }

  const displayedScore = useMemo(() => {
    if (!result) return 0;
    return skin === "all" ? result.score : result.skinTypeScores[skin];
  }, [result, skin]);
  const displayedVerdict = useMemo(() => verdictFor(displayedScore), [displayedScore]);

  const visibleIngredients: AnalyzedIngredient[] = useMemo(() => {
    if (!result) return [];
    if (filter === "all") return result.ingredients;
    return result.ingredients.filter((i) => i.rating === filter);
  }, [result, filter]);

  return (
    <main className="max-w-5xl mx-auto px-5 sm:px-8 py-10 sm:py-16">
      {/* ---------------- Header ---------------- */}
      <header className="reveal flex items-center justify-between mb-12 sm:mb-16">
        <div className="flex items-center gap-3">
          <Logo />
          <div>
            <div className="display text-xl leading-none">INCI Lab</div>
            <div className="eyebrow mt-1">Read what's on the label</div>
          </div>
        </div>
        <a
          href="https://en.wikipedia.org/wiki/International_Nomenclature_of_Cosmetic_Ingredients"
          target="_blank"
          rel="noreferrer"
          className="eyebrow hover:text-ink"
        >
          What is INCI?
        </a>
      </header>

      {/* ---------------- Hero ---------------- */}
      <section className="reveal mb-12 sm:mb-16" style={{ animationDelay: "100ms" }}>
        <div className="eyebrow mb-4">No. 01 / The analyser</div>
        <h1 className="display text-5xl sm:text-7xl text-ink leading-[0.95] tracking-tightish mb-6 max-w-3xl">
          Every cream, serum and balm <em className="text-sage-700">tells a story</em> — most of us just can't read it.
        </h1>
        <p className="text-base text-ink-soft max-w-xl leading-relaxed">
          Paste an ingredient list, or scan a label with your phone. We'll match every line against a curated database
          and explain — plainly, without the marketing — what each one does to your skin.
        </p>
      </section>

      {/* ---------------- Input panel ---------------- */}
      <section className="reveal mb-16" style={{ animationDelay: "200ms" }}>
        <div className="bg-cream-50/70 border border-cream-200 rounded-2xl p-5 sm:p-7 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-3">
            <label htmlFor="inci" className="eyebrow">
              Paste ingredients
            </label>
            <button
              onClick={() => setInput(SAMPLE)}
              className="eyebrow hover:text-ink"
              type="button"
            >
              Try sample
            </button>
          </div>
          <textarea
            id="inci"
            className="paper-input"
            rows={6}
            placeholder="Aqua, Glycerin, Niacinamide, Sodium Hyaluronate…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <ScanButton onText={(text) => setInput((prev) => (prev ? `${prev}, ${text}` : text))} />
              <span className="text-xs text-ink-mute">
                or upload a photo of the label
              </span>
            </div>
            <button
              type="button"
              onClick={handleAnalyze}
              disabled={busy || !input.trim()}
              className="btn-ink"
            >
              {busy ? "Analysing…" : "Analyse →"}
            </button>
          </div>
          {error && <p className="text-sm text-rose-700 mt-3">{error}</p>}
        </div>
      </section>

      {/* ---------------- Results ---------------- */}
      {result && result.ingredients.length > 0 && (
        <section id="results" className="reveal">
          {/* Score block */}
          <div className="grid grid-cols-1 lg:grid-cols-[auto,1fr] gap-10 lg:gap-16 items-center mb-12">
            <div className="flex justify-center">
              <ScoreGauge score={displayedScore} verdict={displayedVerdict} />
            </div>
            <div>
              <div className="eyebrow mb-3">No. 02 / The verdict</div>
              <h2 className="display text-4xl sm:text-5xl mb-5 leading-[1] tracking-tightish">
                {result.summary.good} beneficial · {result.summary.neutral} neutral · {result.summary.bad} concerning
              </h2>

              {/* Composition bar */}
              <CompositionBar summary={result.summary} total={result.ingredients.length} />

              <div className="mt-6 mb-3 eyebrow">Filter by your skin</div>
              <SkinTypeFilter value={skin} onChange={setSkin} scores={result.skinTypeScores} />

              <div className="mt-6 mb-3 eyebrow">Quick flags</div>
              <FlagBar flags={result.flags} />
            </div>
          </div>

          {/* Divider */}
          <div className="divider-ornament my-12">
            <span className="display italic text-lg">the breakdown</span>
          </div>

          {/* Filter chips */}
          <div className="flex flex-wrap gap-2 mb-6">
            {(["all", "good", "neutral", "bad"] as Filter[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="pill"
                style={
                  filter === f
                    ? { background: "var(--ink)", color: "var(--bg)", borderColor: "var(--ink)" }
                    : undefined
                }
              >
                {f === "all" ? "Everything" : f}
                <span className="ml-1 opacity-70">
                  {f === "all" ? result.ingredients.length : result.summary[f]}
                </span>
              </button>
            ))}
          </div>

          {/* Cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {visibleIngredients.map((ing, i) => (
              <IngredientCard key={`${ing.query}-${i}`} ingredient={ing} index={i} />
            ))}
          </div>

          <p className="text-xs text-ink-mute leading-relaxed mt-12 max-w-2xl">
            INCI Lab gives you context, not medical advice. Skin is personal — what's perfect for one person may
            irritate another. When in doubt, patch-test.
          </p>
        </section>
      )}

      <footer className="mt-24 pt-8 border-t border-cream-200 flex items-center justify-between">
        <p className="eyebrow">© {new Date().getFullYear()} INCI Lab</p>
        <p className="eyebrow">Built with care</p>
      </footer>
    </main>
  );
}

/* ---------------- Sub-components ---------------- */

function Logo() {
  return (
    <svg width="42" height="42" viewBox="0 0 42 42" className="text-ink" aria-hidden>
      <circle cx="21" cy="21" r="20" fill="none" stroke="currentColor" strokeWidth="1" />
      {/* Apothecary flask */}
      <path
        d="M16 11h10M18 11v6l-4 10c-0.6 1.5 0.5 3 2 3h10c1.5 0 2.6-1.5 2-3l-4-10v-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M15 24h12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="19" cy="27" r="0.9" fill="currentColor" />
      <circle cx="23" cy="29" r="0.7" fill="currentColor" />
    </svg>
  );
}

function CompositionBar({
  summary,
  total,
}: {
  summary: { good: number; neutral: number; bad: number; unknown: number };
  total: number;
}) {
  const seg = (n: number) => (total === 0 ? 0 : (n / total) * 100);
  return (
    <div>
      <div className="h-2 w-full rounded-full overflow-hidden flex border border-cream-200">
        <div style={{ width: `${seg(summary.good)}%`, background: "var(--sage)" }} />
        <div style={{ width: `${seg(summary.neutral)}%`, background: "var(--ochre)" }} />
        <div style={{ width: `${seg(summary.bad)}%`, background: "var(--rose)" }} />
      </div>
      <div className="flex gap-4 mt-2 text-xs text-ink-mute">
        <span><span className="dot dot-good mr-1.5" />{summary.good} good</span>
        <span><span className="dot dot-neutral mr-1.5" />{summary.neutral} neutral</span>
        <span><span className="dot dot-bad mr-1.5" />{summary.bad} concerning</span>
      </div>
    </div>
  );
}
