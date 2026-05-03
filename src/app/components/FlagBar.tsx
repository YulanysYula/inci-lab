"use client";

import type { AnalysisResult } from "@/lib/analyze";

interface Props {
  flags: AnalysisResult["flags"];
}

export function FlagBar({ flags }: Props) {
  const items: { label: string; on: boolean; tone: "warn" | "info" }[] = [
    { label: "Fragrance", on: flags.fragrance, tone: "warn" },
    { label: "Drying alcohol", on: flags.drying, tone: "warn" },
    { label: "Parabens", on: flags.parabens, tone: "info" },
    { label: `${flags.allergens.length} allergen${flags.allergens.length === 1 ? "" : "s"}`, on: flags.allergens.length > 0, tone: "warn" },
    { label: `${flags.comedogenic.length} comedogenic`, on: flags.comedogenic.length > 0, tone: "warn" },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((it) => (
        <span
          key={it.label}
          className="pill"
          style={
            it.on
              ? {
                  borderColor: it.tone === "warn" ? "var(--rose)" : "var(--ochre)",
                  color: it.tone === "warn" ? "var(--rose)" : "var(--ochre)",
                  background: "rgba(255,255,255,0.5)",
                }
              : { opacity: 0.4 }
          }
        >
          <span
            className="dot"
            style={{
              background: it.on
                ? it.tone === "warn"
                  ? "var(--rose)"
                  : "var(--ochre)"
                : "var(--ink-mute)",
            }}
          />
          {it.label}
          <span className="ml-1 opacity-70">{it.on ? "detected" : "—"}</span>
        </span>
      ))}
    </div>
  );
}
