"use client";

import type { AnalyzedIngredient } from "@/lib/analyze";

const RATING_LABEL: Record<AnalyzedIngredient["rating"], string> = {
  good: "Beneficial",
  neutral: "Neutral",
  bad: "Concerning",
};

const RATING_DOT: Record<AnalyzedIngredient["rating"], string> = {
  good: "dot-good",
  neutral: "dot-neutral",
  bad: "dot-bad",
};

const RATING_ACCENT: Record<AnalyzedIngredient["rating"], string> = {
  good: "border-l-[3px] border-l-[#6B7F5C]",
  neutral: "border-l-[3px] border-l-[#C2934A]",
  bad: "border-l-[3px] border-l-[#B7715F]",
};

interface Props {
  ingredient: AnalyzedIngredient;
  index: number;
}

export function IngredientCard({ ingredient: ing, index }: Props) {
  return (
    <article
      className={`ing-card reveal bg-cream-50/60 backdrop-blur-sm rule border border-cream-200 rounded-lg p-5 ${RATING_ACCENT[ing.rating]}`}
      style={{ animationDelay: `${Math.min(index * 40, 600)}ms` }}
    >
      <header className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className={`dot ${RATING_DOT[ing.rating]}`} />
            <span className="eyebrow">{RATING_LABEL[ing.rating]}</span>
            {!ing.matched && (
              <span className="eyebrow text-ink-mute">
                · {ing.source === "ai" ? "AI-classified" : "estimated"}
              </span>
            )}
          </div>
          <h3 className="display text-2xl text-ink leading-tight">
            {ing.name}
          </h3>
        </div>
      </header>

      <p className="text-sm text-ink-soft leading-relaxed mb-4">
        {ing.description}
      </p>

      {ing.effects.length > 0 && (
        <ul className="space-y-1.5 mb-4">
          {ing.effects.map((effect, i) => (
            <li
              key={i}
              className="text-xs text-ink-mute flex gap-2 leading-relaxed"
            >
              <span className="text-sage-500 mt-1.5 shrink-0">—</span>
              <span>{effect}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="flex flex-wrap gap-1.5 pt-3 border-t border-cream-200/70">
        {ing.irritationRisk !== "low" && (
          <span className="pill" style={{ borderColor: "var(--rose)", color: "var(--rose)" }}>
            {ing.irritationRisk} irritation
          </span>
        )}
        {ing.comedogenicRating >= 3 && (
          <span className="pill" style={{ borderColor: "var(--rose)", color: "var(--rose)" }}>
            comedogenic {ing.comedogenicRating}/5
          </span>
        )}
        {ing.tags.slice(0, 3).map((t) => (
          <span key={t} className="pill">
            {t}
          </span>
        ))}
      </div>
    </article>
  );
}
