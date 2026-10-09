"use client";

type LoaderArgs = { src: string; width: number; quality?: number };

const UNSPLASH_HOST = "https://images.unsplash.com/";

/**
 * Global next/image loader. Unsplash URLs are resized by the Unsplash CDN;
 * any other source is returned untouched.
 */
export default function imageLoader({ src, width, quality }: LoaderArgs): string {
  if (!src.startsWith(UNSPLASH_HOST)) return src;

  const url = new URL(src);
  url.searchParams.set("auto", "format");
  url.searchParams.set("fit", "crop");
  url.searchParams.set("w", String(width));
  url.searchParams.set("q", String(quality ?? 72));
  return url.toString();
}
