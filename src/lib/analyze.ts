// The analysis engine
// -----------------------------------------------------------------------------
// Single entry point: takes a raw INCI string, returns a fully-scored result.
// Strategy:
//   1) Parse the raw string into normalised tokens.
//   2) Try to match each token against the DB (name OR aliases).
//   3) For unmatched tokens, classify with the AI/heuristic fallback.
//   4) Compute overall + per-skin-type scores and detect special flags.

import { prisma } from "./prisma";
import { parseIngredients } from "./parser";
import { classifyUnknown } from "./ai";
import {
  computeScore,
  computeScoreForSkinType,
  verdictFor,
  type SkinType,
} from "./scoring";
import type { Rating, IrritationRisk } from "@prisma/client";

export interface AnalyzedIngredient {
  name: string;            // canonical/displayed name
  query: string;           // the raw token we matched against
  rating: Rating;
  description: string;
  effects: string[];
  irritationRisk: IrritationRisk;
  comedogenicRating: number;
  tags: string[];
  matched: boolean;        // true if found in DB, false if AI/heuristic
  source: "database" | "ai" | "heuristic";
  // Per-skin-type scores -2..2 (only populated for DB matches)
  oilyScore?: number;
  dryScore?: number;
  sensitiveScore?: number;
  acneProneScore?: number;
}

export interface AnalysisResult {
  score: number;
  verdict: string;
  ingredients: AnalyzedIngredient[];
  summary: {
    good: number;
    neutral: number;
    bad: number;
    unknown: number;
  };
  flags: {
    fragrance: boolean;
    drying: boolean;
    parabens: boolean;
    allergens: string[];
    comedogenic: string[];
  };
  skinTypeScores: Record<SkinType, number>;
}

export async function analyzeIngredients(rawInput: string): Promise<AnalysisResult> {
  const tokens = parseIngredients(rawInput);
  if (tokens.length === 0) {
    return emptyResult();
  }

  // Pull every ingredient referenced in the input in a single query.
  // Match either by canonical name OR by any alias.
  const dbMatches = await prisma.ingredient.findMany({
    where: {
      OR: [
        { name: { in: tokens } },
        { aliases: { hasSome: tokens } },
      ],
    },
  });

  // Build a quick lookup: every key (name + aliases) -> ingredient row.
  const lookup = new Map<string, (typeof dbMatches)[number]>();
  for (const ing of dbMatches) {
    lookup.set(ing.name, ing);
    for (const alias of ing.aliases) lookup.set(alias, ing);
  }

  const analyzed: AnalyzedIngredient[] = [];
  for (const token of tokens) {
    const match = lookup.get(token);
    if (match) {
      analyzed.push({
        name: match.displayName,
        query: token,
        rating: match.rating,
        description: match.description,
        effects: Array.isArray(match.effects) ? (match.effects as string[]) : [],
        irritationRisk: match.irritationRisk,
        comedogenicRating: match.comedogenicRating,
        tags: match.tags,
        matched: true,
        source: "database",
        oilyScore: match.oilyScore,
        dryScore: match.dryScore,
        sensitiveScore: match.sensitiveScore,
        acneProneScore: match.acneProneScore,
      });
    } else {
      const ai = await classifyUnknown(token);
      analyzed.push({
        name: titleCase(token),
        query: token,
        rating: ai.rating,
        description: ai.description,
        effects: ai.effects,
        irritationRisk: ai.irritationRisk,
        comedogenicRating: ai.comedogenicRating,
        tags: [],
        matched: false,
        source: ai.source,
      });
    }
  }

  // Aggregate counts
  const summary = analyzed.reduce(
    (acc, i) => {
      if (!i.matched) acc.unknown++;
      acc[i.rating]++;
      return acc;
    },
    { good: 0, neutral: 0, bad: 0, unknown: 0 }
  );

  // Flag detection — surfaces the things people most often want to know.
  const flags = {
    fragrance: analyzed.some(
      (i) => i.tags.includes("fragrance") || /fragrance|parfum/i.test(i.query)
    ),
    drying: analyzed.some(
      (i) => i.tags.includes("drying") || i.tags.includes("alcohol")
    ),
    parabens: analyzed.some((i) => i.tags.includes("paraben")),
    allergens: analyzed
      .filter((i) => i.tags.includes("allergen"))
      .map((i) => i.name),
    comedogenic: analyzed
      .filter((i) => i.comedogenicRating >= 3)
      .map((i) => i.name),
  };

  const score = computeScore(analyzed);
  const skinTypeScores: Record<SkinType, number> = {
    oily: computeScoreForSkinType(analyzed, "oily"),
    dry: computeScoreForSkinType(analyzed, "dry"),
    sensitive: computeScoreForSkinType(analyzed, "sensitive"),
    acneProne: computeScoreForSkinType(analyzed, "acneProne"),
  };

  return {
    score,
    verdict: verdictFor(score),
    ingredients: analyzed,
    summary,
    flags,
    skinTypeScores,
  };
}

function emptyResult(): AnalysisResult {
  return {
    score: 0,
    verdict: "Nothing to analyse",
    ingredients: [],
    summary: { good: 0, neutral: 0, bad: 0, unknown: 0 },
    flags: { fragrance: false, drying: false, parabens: false, allergens: [], comedogenic: [] },
    skinTypeScores: { oily: 0, dry: 0, sensitive: 0, acneProne: 0 },
  };
}

function titleCase(s: string): string {
  return s.replace(/\b\w/g, (c) => c.toUpperCase());
}
