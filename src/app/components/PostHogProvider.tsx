"use client";

import posthog from "posthog-js";
import { useEffect } from "react";

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const projectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
    const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;
    const proxyPath = process.env.NEXT_PUBLIC_POSTHOG_PROXY_PATH;

    if (!projectToken || !posthogHost) {
      console.warn(
        "[PostHog] Missing NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN or NEXT_PUBLIC_POSTHOG_HOST. Analytics disabled."
      );
      return;
    }

    // Use reverse proxy when configured; otherwise send events directly to PostHog.
    const apiHost = proxyPath || posthogHost;

    posthog.init(projectToken, {
      api_host: apiHost,
      ui_host: posthogHost,
      defaults: "2026-01-30",
      capture_exceptions: true,
      debug: process.env.NODE_ENV === "development",
    });
  }, []);

  return <>{children}</>;
}
