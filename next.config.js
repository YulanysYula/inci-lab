/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Tesseract loads workers from CDN by default; we let the browser handle it.
  // No special webpack config needed — but if you self-host tesseract workers,
  // configure `workerPath` and `corePath` in the client component.
};

module.exports = nextConfig;
