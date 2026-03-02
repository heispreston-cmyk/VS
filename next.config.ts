import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ── Capacitor requires a fully static export ──────────────────────────────
  output: "export",

  // Required: Next.js Image Optimization doesn't work in static export
  // (no server to run the optimizer). Capacitor/WebView loads images directly.
  images: {
    unoptimized: true,
  },

  // Required for Capacitor WebView: ensures every page has its own folder
  // e.g. /venues/123 → out/venues/123/index.html
  trailingSlash: true,

  // ── Optional performance tweaks ───────────────────────────────────────────
  // Inline small SVGs/fonts into the bundle instead of separate fetches
  // (reduces round-trips in a WebView where network latency matters)
  experimental: {
    // Keep this off: turbopack doesn't yet support all static-export edge cases
    // turbo: {},
  },

  // ── Environment variables exposed to the WebView/client ──────────────────
  // These are baked into the static JS bundle at build time.
  // Never put secrets here — only NEXT_PUBLIC_ vars.
  env: {
    NEXT_PUBLIC_APP_PLATFORM: process.env.CAPACITOR_PLATFORM ?? "web",
  },

  // ── Headers (no-op in static export, but kept for web deploy parity) ──────
  // async headers() {
  //   return [...];
  // },
};

export default nextConfig;
