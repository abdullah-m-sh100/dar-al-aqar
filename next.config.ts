import type { NextConfig } from "next";

/**
 * Locale is resolved from a cookie in the root layout so every route renders
 * request-time HTML (`lang`/`dir` included). Cache Components and Partial
 * Prefetching are therefore left disabled: they require request data such as
 * cookies to sit below a Suspense boundary, which is impossible for `<html>`.
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // Photography is served from the Unsplash (imgix) CDN, which resizes and
    // encodes on the edge. See src/lib/image-loader.ts.
    loader: "custom",
    loaderFile: "./src/lib/image-loader.ts",
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
