// AI fallback for unknown ingredients
// -----------------------------------------------------------------------------
// When the database has no match for an ingredient, we either:
//   1) Ask OpenAI for a structured classification (if OPENAI_API_KEY is set),
//   2) Or fall back to a small heuristic so the app stays useful offline.
//
// We deliberately constrain the AI to JSON shape and a one-paragraph
// description — no marketing fluff, no medical claims.

import OpenAI from "openai";
import type { Rating, IrritationRisk } from "@prisma/client";

export interface ClassifiedIngredient {
  rating: Rating;
  description: string;
  effects: string[];
  irritationRisk: IrritationRisk;
  comedogenicRating: number;
  source: "ai" | "heuristic";
}

const SYSTEM_PROMPT = `You are a cosmetic chemist. For a given INCI ingredient, respond with STRICT JSON:
{
  "rating": "good" | "neutral" | "bad",
  "description": "<one short, factual paragraph, max 240 chars>",
  "effects": ["<3-5 short bullets describing what it does to skin>"],
  "irritationRisk": "low" | "medium" | "high",
  "comedogenicRating": <integer 0-5>
}
Be calibrated. Most ingredients are neutral. Reserve "bad" for known irritants, sensitisers, or commonly problematic compounds. Never make medical claims. Never invent ingredients.`;

export async function classifyUnknown(
  name: string
): Promise<ClassifiedIngredient> {
  const key = process.env.OPENAI_API_KEY;
  if (key) {
    try {
      return await classifyWithOpenAI(name, key);
    } catch (err) {
      console.warn(`AI classification failed for "${name}", falling back:`, err);
    }
  }
  return heuristicClassify(name);
}

async function classifyWithOpenAI(
  name: string,
  apiKey: string
): Promise<ClassifiedIngredient> {
  const client = new OpenAI({ apiKey });
  const completion = await client.chat.completions.create({
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    response_format: { type: "json_object" },
    temperature: 0.2,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: `Ingredient: ${name}` },
    ],
  });

  const raw = completion.choices[0]?.message?.content;
  if (!raw) throw new Error("Empty response from OpenAI");

  const parsed = JSON.parse(raw);
  return {
    rating: parsed.rating,
    description: parsed.description,
    effects: Array.isArray(parsed.effects) ? parsed.effects : [],
    irritationRisk: parsed.irritationRisk,
    comedogenicRating: Number(parsed.comedogenicRating) || 0,
    source: "ai",
  };
}

// ---------------------------------------------------------------------------
// Heuristic fallback. Pattern-matches common suffixes / keywords to give a
// reasonable guess when no AI is available. Honest about its limits via the
// "source" field.
// ---------------------------------------------------------------------------

const RED_FLAGS = [
  /paraben$/, /\bparfum\b/, /\bfragrance\b/,
  /\balcohol\b(?!.*(cetyl|stearyl|cetearyl|behenyl))/i, // simple alcohol, not fatty
  /sulfate$/, /sulphate$/,
  /formaldehyde/, /toluene/,
];
const GREEN_FLAGS = [
  /ceramide/, /panthenol/, /niacinamide/, /tocopher/, /squalane/,
  /hyaluron/, /allantoin/, /bisabolol/, /centella/,
];

function heuristicClassify(name: string): ClassifiedIngredient {
  const n = name.toLowerCase();

  if (RED_FLAGS.some((re) => re.test(n))) {
    return {
      rating: "bad",
      description: `"${name}" matches a pattern often associated with irritation or sensitisation. We don't have a verified entry for it — treat this as a flag, not a verdict.`,
      effects: ["Pattern-matched as potentially problematic", "Verification recommended"],
      irritationRisk: "medium",
      comedogenicRating: 0,
      source: "heuristic",
    };
  }
  if (GREEN_FLAGS.some((re) => re.test(n))) {
    return {
      rating: "good",
      description: `"${name}" matches a family of well-tolerated, beneficial ingredients. We don't have a verified entry for the specific compound — consider this an educated guess.`,
      effects: ["Pattern-matched as likely beneficial"],
      irritationRisk: "low",
      comedogenicRating: 0,
      source: "heuristic",
    };
  }
  return {
    rating: "neutral",
    description: `We don't have data on "${name}". Most cosmetic ingredients are well-tolerated by most people — but we can't confirm specifics without more information.`,
    effects: ["Unknown — no entry in our database"],
    irritationRisk: "low",
    comedogenicRating: 0,
    source: "heuristic",
  };
}
