import type { LocalizedText } from "@/i18n/format";

/**
 * Demo owner workspace. Figures are illustrative only and do not come from
 * analytics. A real implementation would load them for the signed-in owner.
 */
export type OwnerListing = {
  propertyId: string;
  status: "active" | "paused";
  views: number;
  saves: number;
};

export type Inquiry = {
  id: string;
  from: LocalizedText;
  propertyId: string;
  message: LocalizedText;
  date: string;
  status: "new" | "replied";
};

export const demoOwner = {
  name: { ar: "مستخدم تجريبي", en: "Demo user" },
  email: "owner@example.com",
  phone: "0500000000",
};

export const ownerListings: OwnerListing[] = [
  { propertyId: "DA-1001", status: "active", views: 1840, saves: 96 },
  { propertyId: "DA-1004", status: "active", views: 1325, saves: 71 },
  { propertyId: "DA-1008", status: "active", views: 612, saves: 24 },
  { propertyId: "DA-1005", status: "paused", views: 389, saves: 12 },
];

export const inquiries: Inquiry[] = [
  {
    id: "INQ-301",
    from: { ar: "عميل تجريبي (أ)", en: "Demo client (A)" },
    propertyId: "DA-1001",
    message: {
      ar: "هل يمكن ترتيب معاينة نهاية الأسبوع؟",
      en: "Could we arrange a viewing this weekend?",
    },
    date: "2026-10-06",
    status: "new",
  },
  {
    id: "INQ-302",
    from: { ar: "عميل تجريبي (ب)", en: "Demo client (B)" },
    propertyId: "DA-1004",
    message: { ar: "هل الإيجار يشمل الكهرباء والماء؟", en: "Does the rent include utilities?" },
    date: "2026-10-05",
    status: "new",
  },
  {
    id: "INQ-303",
    from: { ar: "عميل تجريبي (ج)", en: "Demo client (C)" },
    propertyId: "DA-1008",
    message: { ar: "ما هي مدة العقد المتاحة؟", en: "What contract lengths are available?" },
    date: "2026-10-02",
    status: "replied",
  },
  {
    id: "INQ-304",
    from: { ar: "عميل تجريبي (د)", en: "Demo client (D)" },
    propertyId: "DA-1001",
    message: { ar: "هل السعر قابل للتفاوض؟", en: "Is the price negotiable?" },
    date: "2026-09-29",
    status: "replied",
  },
];
