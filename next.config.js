/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Tesseract loads workers from CDN by default; we let the browser handle it.
  // No special webpack config needed — but if you self-host tesseract workers,
  // configure `workerPath` and `corePath` in the client component.
  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://eu-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/array/:path*",
        destination: "https://eu-assets.i.posthog.com/array/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://eu.i.posthog.com/:path*",
      },
    ];
  },
  skipTrailingSlashRedirect: true,
};

module.exports = nextConfig;
