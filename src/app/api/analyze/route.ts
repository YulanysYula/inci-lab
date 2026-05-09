// POST /api/analyze
// -----------------------------------------------------------------------------
// Body: { "ingredients": "string" }
// Returns: AnalysisResult (see src/lib/analyze.ts)

import { NextResponse } from "next/server";
import { analyzeIngredients } from "@/lib/analyze";
import { getPostHogClient } from "@/lib/posthog-server";

export const runtime = "nodejs"; // Prisma needs Node, not Edge.

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const raw = typeof body?.ingredients === "string" ? body.ingredients : "";

    if (!raw.trim()) {
      return NextResponse.json(
        { error: "Provide an `ingredients` string." },
        { status: 400 }
      );
    }
    if (raw.length > 10_000) {
      return NextResponse.json(
        { error: "Input too long (max 10,000 chars)." },
        { status: 413 }
      );
    }

    const result = await analyzeIngredients(raw);

    const posthog = getPostHogClient();
    posthog.capture({
      distinctId: "server",
      event: "server_analysis_completed",
      properties: {
        ingredient_count: result.ingredients.length,
        score: result.score,
        verdict: result.verdict,
        good_count: result.summary.good,
        neutral_count: result.summary.neutral,
        bad_count: result.summary.bad,
        has_fragrance: result.flags.fragrance,
        has_parabens: result.flags.parabens,
      },
    });
    await posthog.flush();

    return NextResponse.json(result);
  } catch (err) {
    console.error("/api/analyze failed:", err);

    const posthog = getPostHogClient();
    posthog.capture({
      distinctId: "server",
      event: "server_analysis_failed",
      properties: {
        error_message: err instanceof Error ? err.message : String(err),
      },
    });
    await posthog.flush();

    return NextResponse.json(
      { error: "Analysis failed. Please try again." },
      { status: 500 }
    );
  }
}
