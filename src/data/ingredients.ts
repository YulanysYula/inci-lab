// Curated ingredient knowledge base.
// -----------------------------------------------------------------------------
// Sourced from public dermatology references (CIR, EWG, peer-reviewed reviews).
// Ratings are pragmatic, not absolute: "bad" usually means "frequently
// problematic" rather than "toxic." Comedogenic ratings follow the standard
// 0–5 scale. Irritation risk is a coarse low/medium/high.

import type { Prisma } from "@prisma/client";

type Seed = Omit<Prisma.IngredientCreateInput, "createdAt" | "updatedAt">;

export const ingredients: Seed[] = [
  // ---------- Humectants & hydrators ----------
  {
    name: "water",
    displayName: "Water (Aqua)",
    aliases: ["aqua", "eau"],
    rating: "neutral",
    description:
      "The solvent that carries everything else. Inert on its own — its quality only matters because it dilutes the active concentrations.",
    effects: ["Solvent base", "No direct skin effect"],
    comedogenicRating: 0,
    irritationRisk: "low",
    tags: ["solvent"],
    oilyScore: 0, dryScore: 0, sensitiveScore: 0, acneProneScore: 0,
  },
  {
    name: "glycerin",
    displayName: "Glycerin",
    aliases: ["glycerine", "glycerol"],
    rating: "good",
    description:
      "A small humectant that pulls water from the air and the lower epidermis into the stratum corneum. One of the most well-tolerated and effective hydrators in cosmetics.",
    effects: ["Draws moisture into skin", "Supports the skin barrier", "Reduces transepidermal water loss"],
    comedogenicRating: 0,
    irritationRisk: "low",
    tags: ["humectant", "hydrating"],
    oilyScore: 2, dryScore: 2, sensitiveScore: 2, acneProneScore: 2,
  },
  {
    name: "hyaluronic acid",
    displayName: "Hyaluronic Acid",
    aliases: ["sodium hyaluronate", "hydrolyzed hyaluronic acid"],
    rating: "good",
    description:
      "A sugar molecule that holds many times its weight in water. Low-molecular-weight forms penetrate deeper; high-molecular-weight forms sit on the surface and plump.",
    effects: ["Plumps skin with water", "Smooths fine lines temporarily", "Compatible with most actives"],
    comedogenicRating: 0,
    irritationRisk: "low",
    tags: ["humectant", "hydrating"],
    oilyScore: 2, dryScore: 2, sensitiveScore: 2, acneProneScore: 2,
  },
  {
    name: "panthenol",
    displayName: "Panthenol (Pro-Vitamin B5)",
    aliases: ["d-panthenol", "dexpanthenol", "provitamin b5"],
    rating: "good",
    description:
      "Converts to vitamin B5 in skin. Soothes, hydrates, and supports barrier repair — a workhorse in calming formulas.",
    effects: ["Calms irritation", "Hydrates", "Supports wound healing"],
    comedogenicRating: 0,
    irritationRisk: "low",
    tags: ["soothing", "hydrating"],
    oilyScore: 1, dryScore: 2, sensitiveScore: 2, acneProneScore: 1,
  },

  // ---------- Antioxidants & actives ----------
  {
    name: "niacinamide",
    displayName: "Niacinamide (Vitamin B3)",
    aliases: ["nicotinamide", "vitamin b3"],
    rating: "good",
    description:
      "Multi-tasker that regulates sebum, evens tone, strengthens the barrier, and reduces redness. Well-tolerated up to ~5%; some people flush at higher concentrations.",
    effects: ["Reduces oil production", "Fades hyperpigmentation", "Strengthens barrier", "Calms redness"],
    comedogenicRating: 0,
    irritationRisk: "low",
    tags: ["antioxidant", "brightening", "barrier"],
    oilyScore: 2, dryScore: 1, sensitiveScore: 2, acneProneScore: 2,
  },
  {
    name: "ascorbic acid",
    displayName: "L-Ascorbic Acid (Vitamin C)",
    aliases: ["l-ascorbic acid", "vitamin c"],
    rating: "good",
    description:
      "The gold-standard form of vitamin C. Brightens, neutralises free radicals, and boosts collagen — but it's unstable, low-pH, and can sting on compromised skin.",
    effects: ["Brightens", "Antioxidant protection", "Boosts collagen"],
    comedogenicRating: 0,
    irritationRisk: "medium",
    tags: ["antioxidant", "brightening", "active"],
    oilyScore: 1, dryScore: 1, sensitiveScore: -1, acneProneScore: 1,
  },
  {
    name: "retinol",
    displayName: "Retinol",
    aliases: [],
    rating: "good",
    description:
      "A vitamin A derivative that accelerates cell turnover, smooths texture, and softens fine lines. Highly effective but irritating during the adjustment period; not for use during pregnancy.",
    effects: ["Increases cell turnover", "Reduces fine lines", "Improves texture", "Can cause initial purging"],
    comedogenicRating: 1,
    irritationRisk: "high",
    tags: ["active", "anti-aging"],
    oilyScore: 1, dryScore: 0, sensitiveScore: -2, acneProneScore: 1,
  },
  {
    name: "salicylic acid",
    displayName: "Salicylic Acid (BHA)",
    aliases: ["bha"],
    rating: "good",
    description:
      "Oil-soluble exfoliant that dissolves into pores and clears dead-cell buildup. The single most useful active for blackheads and oily skin.",
    effects: ["Exfoliates inside pores", "Reduces blackheads", "Anti-inflammatory"],
    comedogenicRating: 0,
    irritationRisk: "medium",
    tags: ["exfoliant", "active", "acne"],
    oilyScore: 2, dryScore: -1, sensitiveScore: -1, acneProneScore: 2,
  },
  {
    name: "glycolic acid",
    displayName: "Glycolic Acid (AHA)",
    aliases: ["aha"],
    rating: "neutral",
    description:
      "The smallest alpha-hydroxy acid, so it penetrates fastest. Resurfaces and brightens — but irritation, sensitivity, and sun sensitivity scale with concentration.",
    effects: ["Surface exfoliation", "Brightens tone", "Increases sun sensitivity"],
    comedogenicRating: 0,
    irritationRisk: "medium",
    tags: ["exfoliant", "active"],
    oilyScore: 1, dryScore: 0, sensitiveScore: -2, acneProneScore: 1,
  },
  {
    name: "vitamin e",
    displayName: "Tocopherol (Vitamin E)",
    aliases: ["tocopherol", "tocopheryl acetate"],
    rating: "good",
    description:
      "Lipid-soluble antioxidant that stabilises oils in formula and supports the skin's own antioxidant system. Pairs synergistically with vitamin C.",
    effects: ["Antioxidant protection", "Stabilises formulas"],
    comedogenicRating: 2,
    irritationRisk: "low",
    tags: ["antioxidant"],
    oilyScore: 0, dryScore: 1, sensitiveScore: 1, acneProneScore: -1,
  },

  // ---------- Emollients, occlusives, lipids ----------
  {
    name: "squalane",
    displayName: "Squalane",
    aliases: [],
    rating: "good",
    description:
      "A stable, hydrogenated form of squalene (which the skin makes naturally). Light, non-greasy, biomimetic — rare combination.",
    effects: ["Softens skin", "Reinforces lipid barrier", "Non-comedogenic for most"],
    comedogenicRating: 1,
    irritationRisk: "low",
    tags: ["emollient", "barrier"],
    oilyScore: 1, dryScore: 2, sensitiveScore: 2, acneProneScore: 1,
  },
  {
    name: "ceramide np",
    displayName: "Ceramide NP",
    aliases: ["ceramide 3", "ceramide-3"],
    rating: "good",
    description:
      "One of the lipid molecules the skin uses to build its barrier. Topical ceramides genuinely help dryness and barrier dysfunction.",
    effects: ["Reinforces skin barrier", "Reduces water loss"],
    comedogenicRating: 0,
    irritationRisk: "low",
    tags: ["barrier", "lipid"],
    oilyScore: 1, dryScore: 2, sensitiveScore: 2, acneProneScore: 1,
  },
  {
    name: "shea butter",
    displayName: "Shea Butter (Butyrospermum Parkii)",
    aliases: ["butyrospermum parkii butter", "butyrospermum parkii"],
    rating: "good",
    description:
      "Rich plant butter loaded with fatty acids and a small amount of vitamin E. Excellent for dry skin; potentially heavy on oily/acne-prone skin.",
    effects: ["Deep emollient", "Soothes dryness"],
    comedogenicRating: 0,
    irritationRisk: "low",
    tags: ["emollient", "occlusive"],
    oilyScore: -1, dryScore: 2, sensitiveScore: 1, acneProneScore: -1,
  },
  {
    name: "coconut oil",
    displayName: "Coconut Oil (Cocos Nucifera)",
    aliases: ["cocos nucifera oil"],
    rating: "neutral",
    description:
      "Genuinely lovely on body and hair, but its high lauric acid content makes it one of the more clogging facial oils for many skin types.",
    effects: ["Heavy emollient", "Can clog pores"],
    comedogenicRating: 4,
    irritationRisk: "low",
    tags: ["emollient", "occlusive"],
    oilyScore: -2, dryScore: 1, sensitiveScore: 0, acneProneScore: -2,
  },
  {
    name: "petrolatum",
    displayName: "Petrolatum",
    aliases: ["petroleum jelly"],
    rating: "good",
    description:
      "The most effective occlusive in cosmetics — reduces transepidermal water loss by ~99%. Cosmetic-grade petrolatum is highly purified and safe.",
    effects: ["Locks in moisture", "Protects compromised skin"],
    comedogenicRating: 0,
    irritationRisk: "low",
    tags: ["occlusive", "barrier"],
    oilyScore: -1, dryScore: 2, sensitiveScore: 2, acneProneScore: 0,
  },
  {
    name: "dimethicone",
    displayName: "Dimethicone",
    aliases: [],
    rating: "good",
    description:
      "An inert silicone that creates a smooth, breathable film on the skin. Despite persistent rumours, it does not clog pores or 'suffocate' skin.",
    effects: ["Smooths skin surface", "Reduces water loss", "Improves product feel"],
    comedogenicRating: 0,
    irritationRisk: "low",
    tags: ["silicone", "emollient"],
    oilyScore: 1, dryScore: 1, sensitiveScore: 2, acneProneScore: 1,
  },

  // ---------- Risky / context-dependent ----------
  {
    name: "alcohol denat",
    displayName: "Alcohol Denat.",
    aliases: ["denatured alcohol", "sd alcohol", "ethanol"],
    rating: "bad",
    description:
      "Volatile alcohol used to thin formulas and give a 'quick-dry' feel. In high concentrations it strips lipids, disrupts the barrier, and increases sensitivity over time.",
    effects: ["Defatts and dries skin", "Disrupts barrier with regular use", "Can sting compromised skin"],
    comedogenicRating: 0,
    irritationRisk: "high",
    tags: ["alcohol", "drying"],
    oilyScore: -1, dryScore: -2, sensitiveScore: -2, acneProneScore: -1,
  },
  {
    name: "fragrance",
    displayName: "Fragrance / Parfum",
    aliases: ["parfum", "perfume"],
    rating: "bad",
    description:
      "An umbrella term covering dozens to hundreds of undisclosed compounds. The single most common cause of cosmetic contact dermatitis.",
    effects: ["Common allergen", "Risk of contact dermatitis", "May aggravate rosacea/eczema"],
    comedogenicRating: 0,
    irritationRisk: "high",
    tags: ["fragrance", "allergen"],
    oilyScore: -1, dryScore: -1, sensitiveScore: -2, acneProneScore: -1,
  },
  {
    name: "linalool",
    displayName: "Linalool",
    aliases: [],
    rating: "neutral",
    description:
      "A naturally occurring terpene in lavender, bergamot, and many essential oils. Pleasant scent, but oxidises in air into compounds flagged as EU-mandated allergens.",
    effects: ["Fragrance allergen (EU declarable)", "Can sensitise over time"],
    comedogenicRating: 0,
    irritationRisk: "medium",
    tags: ["fragrance", "allergen", "essential-oil"],
    oilyScore: 0, dryScore: 0, sensitiveScore: -2, acneProneScore: 0,
  },
  {
    name: "limonene",
    displayName: "Limonene",
    aliases: [],
    rating: "neutral",
    description:
      "Citrus-derived terpene. Same story as linalool: smells lovely fresh, oxidises into a known sensitiser. Listed as an EU declarable allergen.",
    effects: ["Fragrance allergen (EU declarable)", "Sensitiser when oxidised"],
    comedogenicRating: 0,
    irritationRisk: "medium",
    tags: ["fragrance", "allergen", "essential-oil"],
    oilyScore: 0, dryScore: 0, sensitiveScore: -2, acneProneScore: 0,
  },
  {
    name: "methylparaben",
    displayName: "Methylparaben",
    aliases: [],
    rating: "neutral",
    description:
      "A long-used preservative. Decades of safety data; concerns about endocrine activity exist but at exposures far above cosmetic use. Avoid if you prefer to err cautious.",
    effects: ["Preservative", "Trace endocrine-active in vitro"],
    comedogenicRating: 0,
    irritationRisk: "low",
    tags: ["preservative", "paraben"],
    oilyScore: 0, dryScore: 0, sensitiveScore: -1, acneProneScore: 0,
  },
  {
    name: "phenoxyethanol",
    displayName: "Phenoxyethanol",
    aliases: [],
    rating: "neutral",
    description:
      "Modern broad-spectrum preservative. Capped at 1% in the EU and well-tolerated, but a small fraction of users react to it.",
    effects: ["Preservative", "Mild irritant for some"],
    comedogenicRating: 0,
    irritationRisk: "low",
    tags: ["preservative"],
    oilyScore: 0, dryScore: 0, sensitiveScore: -1, acneProneScore: 0,
  },
  {
    name: "sodium lauryl sulfate",
    displayName: "Sodium Lauryl Sulfate (SLS)",
    aliases: ["sls"],
    rating: "bad",
    description:
      "Aggressive anionic surfactant. Effective cleaner, but strips the barrier and is the standard control irritant in dermatology research.",
    effects: ["Strips skin lipids", "Reference irritant in patch testing", "Disrupts barrier"],
    comedogenicRating: 0,
    irritationRisk: "high",
    tags: ["surfactant", "drying"],
    oilyScore: -2, dryScore: -2, sensitiveScore: -2, acneProneScore: -1,
  },
  {
    name: "sodium laureth sulfate",
    displayName: "Sodium Laureth Sulfate (SLES)",
    aliases: ["sles"],
    rating: "neutral",
    description:
      "SLS's gentler cousin — ethoxylation reduces (but doesn't eliminate) irritation. Fine in rinse-off products for most people.",
    effects: ["Cleansing surfactant", "Less irritating than SLS"],
    comedogenicRating: 0,
    irritationRisk: "medium",
    tags: ["surfactant"],
    oilyScore: -1, dryScore: -1, sensitiveScore: -1, acneProneScore: 0,
  },
  {
    name: "isopropyl myristate",
    displayName: "Isopropyl Myristate",
    aliases: [],
    rating: "bad",
    description:
      "Lightweight emollient that gives a fast-absorbing finish — but it's one of the most reliably comedogenic ingredients in modern cosmetics.",
    effects: ["Highly comedogenic", "Lightweight emollient"],
    comedogenicRating: 5,
    irritationRisk: "low",
    tags: ["emollient", "comedogenic"],
    oilyScore: -2, dryScore: 0, sensitiveScore: 0, acneProneScore: -2,
  },
  {
    name: "lanolin",
    displayName: "Lanolin",
    aliases: [],
    rating: "neutral",
    description:
      "Sheep-wool wax. Genuinely effective for very dry skin and chapped lips, but a known contact allergen for a meaningful minority.",
    effects: ["Heavy occlusive", "Contact allergen for some"],
    comedogenicRating: 2,
    irritationRisk: "medium",
    tags: ["occlusive", "allergen"],
    oilyScore: -1, dryScore: 2, sensitiveScore: -1, acneProneScore: -1,
  },

  // ---------- Sunscreen filters (a useful category to know) ----------
  {
    name: "zinc oxide",
    displayName: "Zinc Oxide",
    aliases: [],
    rating: "good",
    description:
      "Mineral broad-spectrum UV filter. Photostable, well-tolerated, and offers the broadest UVA coverage of any approved filter.",
    effects: ["Broad-spectrum sun protection", "Soothing", "Photostable"],
    comedogenicRating: 0,
    irritationRisk: "low",
    tags: ["sunscreen", "mineral"],
    oilyScore: 1, dryScore: 1, sensitiveScore: 2, acneProneScore: 1,
  },
  {
    name: "titanium dioxide",
    displayName: "Titanium Dioxide",
    aliases: [],
    rating: "good",
    description:
      "Mineral UV filter, especially strong against UVB. Often paired with zinc oxide for full-spectrum mineral protection.",
    effects: ["UVB-leaning sun protection", "Photostable"],
    comedogenicRating: 0,
    irritationRisk: "low",
    tags: ["sunscreen", "mineral"],
    oilyScore: 1, dryScore: 1, sensitiveScore: 2, acneProneScore: 1,
  },
  {
    name: "oxybenzone",
    displayName: "Oxybenzone",
    aliases: ["benzophenone-3"],
    rating: "bad",
    description:
      "Chemical UV filter under regulatory and ecological scrutiny — banned in some reef jurisdictions, with notable systemic absorption flagged by the FDA.",
    effects: ["UV protection", "Notable systemic absorption", "Reef-impact concerns"],
    comedogenicRating: 0,
    irritationRisk: "medium",
    tags: ["sunscreen", "chemical-filter"],
    oilyScore: 0, dryScore: 0, sensitiveScore: -2, acneProneScore: 0,
  },
];
