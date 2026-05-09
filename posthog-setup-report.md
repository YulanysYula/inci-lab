<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into INCI Lab, a Next.js 14 App Router cosmetic ingredient analyzer. PostHog is initialized client-side via a `PostHogProvider` component (wrapping the app in `layout.tsx`), and server-side via a singleton `posthog-node` client in `src/lib/posthog-server.ts`. A reverse proxy is configured in `next.config.js` so all tracking requests route through `/ingest` on your own domain, reducing ad-blocker interference.

| Event | Description | File |
|---|---|---|
| `ingredient_analysis_submitted` | User clicks Analyse to start an ingredient analysis | `src/app/page.tsx` |
| `ingredient_analysis_completed` | Analysis API call returned a successful result (with score, verdict, ingredient counts, flag presence) | `src/app/page.tsx` |
| `ingredient_analysis_failed` | Analysis API call failed or returned an error | `src/app/page.tsx` |
| `sample_loaded` | User clicked "Try sample" to load the pre-filled sample ingredient list | `src/app/page.tsx` |
| `label_scan_completed` | OCR scan of a product label image completed successfully | `src/app/components/ScanButton.tsx` |
| `label_scan_failed` | OCR scan of a product label image failed | `src/app/components/ScanButton.tsx` |
| `ingredient_filter_changed` | User changed the rating filter (all/good/neutral/bad) on results | `src/app/page.tsx` |
| `skin_type_filter_changed` | User changed the skin type filter on analysis results | `src/app/page.tsx` |
| `server_analysis_completed` | Server-side: ingredient analysis API returned a result successfully | `src/app/api/analyze/route.ts` |
| `server_analysis_failed` | Server-side: ingredient analysis API encountered an error | `src/app/api/analyze/route.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics dashboard](/dashboard/670379)
- [Ingredient analyses over time](/insights/0cHumWYS)
- [Analysis success vs failure rate](/insights/a3X8G7Cf)
- [Scan to analysis conversion funnel](/insights/7SbeS6ya)
- [Average ingredient score per analysis](/insights/XSHMQvD8)
- [Result filter usage by type](/insights/MroM4xOw)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
