import { unsplash } from "@/lib/media";

export const siteConfig = {
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  /** Placeholder contact channel — replace before launch. */
  contactEmail: "hello@example.com",
  social: [
    { id: "x", href: "https://x.com" },
    { id: "instagram", href: "https://instagram.com" },
    { id: "linkedin", href: "https://linkedin.com" },
    { id: "youtube", href: "https://youtube.com" },
  ],
} as const;

/** Editorial photography used outside of listings. */
export const siteMedia = {
  hero: unsplash("1748063578185-3d68121b11ff", "Arthur BAUDRY"),
  ownerCta: unsplash("1757774698963-b23f4b273adc", "MO B.H"),
  aboutHeritage: unsplash("1590959914819-b767b9fe4cfb", "Abdulrhman Alkhnaifer"),
  aboutCraft: unsplash("1782220940402-9168f59b582a", "Ameer Albahouth"),
  auth: unsplash("1584183812211-df586f1fb0da", "Mishaal Zahed"),
} as const;

export const NAV_LINKS = [
  { href: "/", key: "home" },
  { href: "/properties", key: "properties" },
  { href: "/projects", key: "projects" },
  { href: "/about", key: "about" },
  { href: "/contact", key: "contact" },
] as const;
