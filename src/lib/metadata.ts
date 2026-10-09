import type { Metadata } from "next";

import { localeSettings, type Locale } from "@/i18n/config";

type PageMetadataInput = {
  title: string;
  description: string;
  /** Canonical, locale-free path, e.g. "/properties". */
  path: string;
  locale: Locale;
  image?: { url: string; alt: string };
};

/** Localized metadata for a page that shares one URL across languages. */
export function pageMetadata({
  title,
  description,
  path,
  locale,
  image,
}: PageMetadataInput): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      locale: localeSettings[locale].og,
      ...(image ? { images: [{ url: image.url, alt: image.alt, width: 1200, height: 630 }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(image ? { images: [image.url] } : {}),
    },
  };
}

/** Absolute, sized Unsplash URL for social cards (bypasses next/image). */
export function socialImageUrl(src: string): string {
  return `${src}?auto=format&fit=crop&w=1200&h=630&q=75`;
}
