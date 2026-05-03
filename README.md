# INCI Lab

A cosmetic ingredient analyzer. Paste or scan (OCR) an INCI list, get a clean, honest breakdown of what each ingredient does to your skin — colour-coded, scored, and filterable by skin type.

> Editorial / apothecary aesthetic — warm cream paper, deep ink, botanical sage. Cormorant Garamond for display, Inter Tight for body. Designed to feel like a beauty journal, not a tech dashboard.

---

## Features

- **Manual paste** *or* **OCR scan** of a product label (Tesseract.js, browser-side)
- **Curated database** of 25+ ingredients with rating, description, effects, comedogenic & irritation data, and per-skin-type scores
- **AI fallback** for ingredients not in the DB (OpenAI), with a heuristic fallback for offline/no-key use so the app always works
- **0–100 score** + animated gauge
- **Per-skin-type scoring**: oily / dry / sensitive / acne-prone
- **Flag detection**: fragrance, drying alcohols, parabens, allergens, comedogenic ingredients
- **Filterable results** by rating
- Clean REST endpoint: `POST /api/analyze`

---

## Tech stack

| Layer | Tech |
|-|-|
| Frontend | Next.js 14 (App Router), React 18, TailwindCSS |
| Backend | Next.js API routes (Node runtime) |
| Database | PostgreSQL via Prisma ORM |
| OCR | Tesseract.js (client-side, no server work) |
| AI fallback | OpenAI (optional) + heuristic backup |

---

## Quick start

```bash
# 1. Install
npm install

# 2. Configure
cp .env.example .env
# edit .env: set DATABASE_URL (and optionally OPENAI_API_KEY)

# 3. Database
npx prisma db push     # create tables
npm run db:seed        # load 25+ curated ingredients

# 4. Run
npm run dev            # http://localhost:3000
```

No OpenAI key? The app still works — unknown ingredients fall back to a pattern-matching heuristic that's honest about being an estimate.

---

## Project structure

```
inci-lab/
├── prisma/
│   ├── schema.prisma          # Ingredient + User + Scan models
│   └── seed.ts                # Idempotent seed runner
├── src/
│   ├── app/
│   │   ├── api/analyze/route.ts   # POST /api/analyze
│   │   ├── components/
│   │   │   ├── ScoreGauge.tsx     # Animated SVG dial
│   │   │   ├── IngredientCard.tsx # One ingredient, colour-coded
│   │   │   ├── SkinTypeFilter.tsx # Skin-type chip group
│   │   │   ├── ScanButton.tsx     # OCR upload (Tesseract.js, lazy)
│   │   │   └── FlagBar.tsx        # Fragrance / alcohol / paraben pills
│   │   ├── globals.css            # Apothecary theme tokens
│   │   ├── layout.tsx
│   │   └── page.tsx               # Main analyser UI
│   ├── data/
│   │   └── ingredients.ts         # 25+ curated entries — single source of truth
│   └── lib/
│       ├── prisma.ts              # Singleton client
│       ├── parser.ts              # Raw INCI string → tokens
│       ├── scoring.ts             # 0–100 + per-skin-type math
│       ├── ai.ts                  # OpenAI + heuristic fallback
│       └── analyze.ts             # Engine — ties it all together
├── tailwind.config.js
├── next.config.js
└── package.json
```

---

## How it works

1. **Parse.** The user's raw string is normalised by `src/lib/parser.ts` — strip "Ingredients:" prefix, handle OCR line breaks, drop trademark glyphs, split on commas/semicolons, lowercase, drop parenthetical synonyms.
2. **Match.** All tokens are resolved against the DB in a single query — by canonical `name` *or* by any entry in `aliases`. This is how `"alcohol denat"`, `"denatured alcohol"`, and `"sd alcohol"` all resolve to the same record.
3. **Fall back.** Unmatched tokens go to `classifyUnknown()`. If `OPENAI_API_KEY` is set, we ask GPT-4o-mini for a constrained JSON classification. If not, a small pattern-matching heuristic gives a flagged, "we're guessing" answer.
4. **Score.** Two scores are computed: an overall 0–100, and per-skin-type variants using each ingredient's `oilyScore`, `dryScore`, `sensitiveScore`, `acneProneScore`.
5. **Flag.** The engine surfaces the things people most often want to know — fragrance, drying alcohols, parabens, EU-declarable allergens, comedogenic ingredients ≥3.

### `POST /api/analyze`

```jsonc
// request
{ "ingredients": "Aqua, Glycerin, Niacinamide, Alcohol Denat., Parfum" }

// response (abridged)
{
  "score": 64,
  "verdict": "Mostly good",
  "ingredients": [
    {
      "name": "Glycerin",
      "rating": "good",
      "description": "A small humectant that pulls water into the stratum corneum…",
      "effects": ["Draws moisture into skin", "Supports the skin barrier"],
      "irritationRisk": "low",
      "comedogenicRating": 0,
      "tags": ["humectant", "hydrating"],
      "matched": true,
      "source": "database"
    }
    // …
  ],
  "summary": { "good": 3, "neutral": 0, "bad": 2, "unknown": 0 },
  "flags": {
    "fragrance": true,
    "drying": true,
    "parabens": false,
    "allergens": [],
    "comedogenic": []
  },
  "skinTypeScores": { "oily": 60, "dry": 40, "sensitive": 30, "acneProne": 55 }
}
```

---

## Bonus features included

- **User & Scan models** in `schema.prisma` so you can wire up auth (NextAuth, Clerk) and history without schema changes.
- **Idempotent seeds** — re-running `db:seed` updates rather than duplicates.
- **Heuristic offline mode** — works without OpenAI.

### Easy to extend

- Add ingredients: edit `src/data/ingredients.ts`, re-run `npm run db:seed`.
- Add skin types: add a column to `Ingredient`, extend the `SkinType` union in `src/lib/scoring.ts`.
- Cache results: drop in Redis around `analyzeIngredients()` keyed by a hash of the input.

---

## Notes on accuracy

The seed data is curated from public dermatology references (CIR, peer-reviewed literature, EU CosIng). Ratings are pragmatic — `bad` means "frequently problematic," not "toxic." Comedogenic ratings follow the standard 0–5 scale. Always patch-test; skin is personal.
