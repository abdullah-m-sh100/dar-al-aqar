import type { MetadataRoute } from "next";

import { CITY_SLUGS } from "@/config/locations";
import { siteConfig } from "@/config/site";
import { rawProperties } from "@/data/properties";
import { projects } from "@/data/projects";
import { propertiesHref } from "@/features/search/search-params";

/** One entry per URL — languages share URLs, so no per-locale duplicates. */
export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => new URL(path, siteConfig.url).toString();
  const staticPaths = [
    "/",
    "/properties",
    "/projects",
    "/agents",
    "/about",
    "/contact",
    "/terms",
    "/privacy",
  ];

  return [
    ...staticPaths.map((path) => ({
      url: url(path),
      changeFrequency: "weekly" as const,
      priority: path === "/" ? 1 : 0.7,
    })),
    ...CITY_SLUGS.map((city) => ({
      url: url(propertiesHref({ city })),
      changeFrequency: "daily" as const,
      priority: 0.6,
    })),
    ...rawProperties.map((property) => ({
      url: url(`/properties/${property.slug}`),
      lastModified: property.createdAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...projects.map((project) => ({
      url: url(`/projects/${project.slug}`),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
