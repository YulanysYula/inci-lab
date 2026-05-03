// Scoring engine
// -----------------------------------------------------------------------------
// Two layers:
//   1) A simple weighted sum across the whole product (good +2, neutral 0,
//      bad -2), normalised to a 0-100 score.
//   2) A per-skin-type adjustment so the same product can be "great for dry,
//      avoid for acne-prone."
//
// The math is deliberately simple — INCI ordering hints at concentration but
// real percentages are proprietary, so over-engineering the score would create
// false precision. What users actually want is a quick, honest signal.

import type { Rating } from "@prisma/client";

export type SkinType = "oily" | "dry" | "sensitive" | "acneProne";

export interface ScoredIngredient {
  rating: Rating;
  // Optional per-skin-type scores in the range [-2, 2].
  oilyScore?: number;
  dryScore?: number;
  sensitiveScore?: number;
  acneProneScore?: number;
}

const RATING_WEIGHT: Record<Rating, number> = {
  good: 2,
  neutral: 0,
  bad: -2,
};

/**
 * Overall score on 0–100. 50 = perfectly average; 100 = every ingredient great.
 */
export function computeScore(ingredients: ScoredIngredient[]): number {
  if (ingredients.length === 0) return 0;

  // Sum / max possible -> normalise into [-1, 1] -> map to [0, 100].
  const sum = ingredients.reduce((acc, i) => acc + RATING_WEIGHT[i.rating], 0);
  const maxPossible = ingredients.length * 2;
  const ratio = sum / maxPossible; // -1 … 1
  return Math.round(((ratio + 1) / 2) * 100);
}

/**
 * Skin-type-aware score. Falls back to 0 for ingredients that don't have
 * per-skin-type data (so AI-classified unknowns don't dominate the result).
 */
export function computeScoreForSkinType(
  ingredients: ScoredIngredient[],
  skinType: SkinType
): number {
  if (ingredients.length === 0) return 0;
  const key = `${skinType}Score` as const;
  const sum = ingredients.reduce((acc, i) => acc + (i[key] ?? 0), 0);
  const maxPossible = ingredients.length * 2;
  const ratio = sum / maxPossible;
  return Math.round(((ratio + 1) / 2) * 100);
}

/**
 * A short, honest verdict to display next to the score.
 */
export function verdictFor(score: number): string {
  if (score >= 80) return "Excellent formula";
  if (score >= 65) return "Mostly good";
  if (score >= 45) return "Mixed bag";
  if (score >= 30) return "Several concerns";
  return "Reconsider this one";
}
