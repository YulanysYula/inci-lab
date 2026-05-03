// INCI list parser
// -----------------------------------------------------------------------------
// Real-world INCI lists are messy: mixed separators (commas, semicolons, full
// stops at the end), parenthetical synonyms, line breaks from OCR, trade-name
// trademarks, and the occasional asterisk denoting organic origin. We handle
// the common cases without trying to be a full chemistry parser.

export function parseIngredients(raw: string): string[] {
  if (!raw) return [];

  const cleaned = raw
    // OCR sometimes joins lines with a hyphen at the wrap point — undo it.
    .replace(/-\s*\n\s*/g, "")
    // Newlines and tabs become commas so split below catches them.
    .replace(/[\n\r\t]+/g, ",")
    // Some labels use semicolons or middle dots.
    .replace(/[;·•]/g, ",")
    // "Ingredients:" prefix appears on most labels.
    .replace(/^\s*ingredients?\s*[:\-–]\s*/i, "")
    // Trailing period.
    .replace(/\.\s*$/, "")
    // Trademark / registered / asterisk markers.
    .replace(/[®™*†]/g, "");

  return cleaned
    .split(",")
    .map(normaliseToken)
    .filter((s) => s.length > 1 && s.length < 80); // drop noise
}

/**
 * Lowercase, trim, collapse whitespace, drop trailing parentheticals.
 *   "Aqua (Water/Eau)" -> "aqua"
 *   "Tocopheryl Acetate "  -> "tocopheryl acetate"
 */
export function normaliseToken(token: string): string {
  return token
    .toLowerCase()
    // Strip parenthetical synonyms — keep the canonical first form.
    .replace(/\(.*?\)/g, "")
    .replace(/\[.*?\]/g, "")
    // Slash-separated synonyms ("parfum/fragrance") — keep first form.
    .split("/")[0]
    // Common punctuation noise.
    .replace(/[.,;]+$/g, "")
    .replace(/\s+/g, " ")
    .trim();
}
