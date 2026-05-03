"use client";

import type { SkinType } from "@/lib/scoring";

const TYPES: { value: SkinType | "all"; label: string }[] = [
  { value: "all", label: "All skin" },
  { value: "oily", label: "Oily" },
  { value: "dry", label: "Dry" },
  { value: "sensitive", label: "Sensitive" },
  { value: "acneProne", label: "Acne-prone" },
];

interface Props {
  value: SkinType | "all";
  onChange: (value: SkinType | "all") => void;
  scores?: Record<SkinType, number>;
}

export function SkinTypeFilter({ value, onChange, scores }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {TYPES.map((t) => {
        const active = value === t.value;
        const subscore = t.value !== "all" && scores ? scores[t.value] : null;
        return (
          <button
            key={t.value}
            onClick={() => onChange(t.value)}
            className={`pill transition-all ${
              active
                ? "!bg-ink !text-cream-50 !border-ink"
                : "hover:border-ink"
            }`}
            style={active ? { background: "var(--ink)", color: "var(--bg)" } : undefined}
          >
            {t.label}
            {subscore !== null && (
              <span className="ml-1 opacity-70">{subscore}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
