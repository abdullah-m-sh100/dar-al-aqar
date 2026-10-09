import type { LocalizedText } from "@/i18n/format";
import { unsplash, type Photo } from "@/lib/media";

export const CITY_SLUGS = [
  "riyadh",
  "jeddah",
  "dammam",
  "khobar",
  "makkah",
  "madinah",
  "taif",
  "abha",
] as const;

export type CitySlug = (typeof CITY_SLUGS)[number];

export type District = { slug: string; name: LocalizedText };

export type City = {
  slug: CitySlug;
  name: LocalizedText;
  region: LocalizedText;
  center: { lat: number; lng: number };
  photo: Photo;
  districts: District[];
};

/** Cities featured on the "Explore by city" section, in display order. */
export const FEATURED_CITY_SLUGS: CitySlug[] = [
  "riyadh",
  "jeddah",
  "dammam",
  "khobar",
  "makkah",
  "madinah",
];

export const CITIES: City[] = [
  {
    slug: "riyadh",
    name: { ar: "الرياض", en: "Riyadh" },
    region: { ar: "منطقة الرياض", en: "Riyadh Region" },
    center: { lat: 24.7136, lng: 46.6753 },
    photo: unsplash("1694018359679-49465b4c0d61", "Ibrahim Abdullah"),
    districts: [
      { slug: "al-malqa", name: { ar: "الملقا", en: "Al Malqa" } },
      { slug: "hittin", name: { ar: "حطين", en: "Hittin" } },
      { slug: "al-narjis", name: { ar: "النرجس", en: "Al Narjis" } },
      { slug: "al-yasmin", name: { ar: "الياسمين", en: "Al Yasmin" } },
      { slug: "al-olaya", name: { ar: "العليا", en: "Al Olaya" } },
      { slug: "al-sahafa", name: { ar: "الصحافة", en: "Al Sahafa" } },
      { slug: "al-qirawan", name: { ar: "القيروان", en: "Al Qirawan" } },
    ],
  },
  {
    slug: "jeddah",
    name: { ar: "جدة", en: "Jeddah" },
    region: { ar: "منطقة مكة المكرمة", en: "Makkah Region" },
    center: { lat: 21.5433, lng: 39.1728 },
    photo: unsplash("1649225561842-5de2d85320b9", "Yasser Mutwakil"),
    districts: [
      { slug: "ash-shati", name: { ar: "الشاطئ", en: "Ash Shati" } },
      { slug: "obhur-north", name: { ar: "أبحر الشمالية", en: "North Obhur" } },
      { slug: "ar-rawdah", name: { ar: "الروضة", en: "Ar Rawdah" } },
      { slug: "al-hamra", name: { ar: "الحمراء", en: "Al Hamra" } },
      { slug: "az-zahra", name: { ar: "الزهراء", en: "Az Zahra" } },
      { slug: "as-salamah", name: { ar: "السلامة", en: "As Salamah" } },
    ],
  },
  {
    slug: "dammam",
    name: { ar: "الدمام", en: "Dammam" },
    region: { ar: "المنطقة الشرقية", en: "Eastern Province" },
    center: { lat: 26.4207, lng: 50.0888 },
    photo: unsplash("1654416419250-7f1f998b4616", "Usama Fakhry"),
    districts: [
      { slug: "ash-shati-al-gharbi", name: { ar: "الشاطئ الغربي", en: "Ash Shati Al Gharbi" } },
      { slug: "al-faisaliyah", name: { ar: "الفيصلية", en: "Al Faisaliyah" } },
      { slug: "an-nur", name: { ar: "النور", en: "An Nur" } },
    ],
  },
  {
    slug: "khobar",
    name: { ar: "الخبر", en: "Khobar" },
    region: { ar: "المنطقة الشرقية", en: "Eastern Province" },
    center: { lat: 26.2794, lng: 50.2083 },
    photo: unsplash("1731323772756-896b8e1b3867", "Haider AlMarri"),
    districts: [
      { slug: "al-aziziyah", name: { ar: "العزيزية", en: "Al Aziziyah" } },
      { slug: "al-hizam-al-dhahabi", name: { ar: "الحزام الذهبي", en: "Al Hizam Al Dhahabi" } },
      { slug: "ar-rakah", name: { ar: "الراكة", en: "Ar Rakah" } },
    ],
  },
  {
    slug: "makkah",
    name: { ar: "مكة المكرمة", en: "Makkah" },
    region: { ar: "منطقة مكة المكرمة", en: "Makkah Region" },
    center: { lat: 21.3891, lng: 39.8579 },
    photo: unsplash("1704104501136-8f35402af395", "Haythem Gataa"),
    districts: [
      { slug: "al-aziziyah", name: { ar: "العزيزية", en: "Al Aziziyah" } },
      { slug: "ash-shawqiyah", name: { ar: "الشوقية", en: "Ash Shawqiyah" } },
    ],
  },
  {
    slug: "madinah",
    name: { ar: "المدينة المنورة", en: "Madinah" },
    region: { ar: "منطقة المدينة المنورة", en: "Madinah Region" },
    center: { lat: 24.4672, lng: 39.6111 },
    photo: unsplash("1591604129939-f1efa4d9f7fa", "Sulthan Auliya"),
    districts: [
      { slug: "quba", name: { ar: "قباء", en: "Quba" } },
      { slug: "al-aziziyah", name: { ar: "العزيزية", en: "Al Aziziyah" } },
    ],
  },
  {
    slug: "taif",
    name: { ar: "الطائف", en: "Taif" },
    region: { ar: "منطقة مكة المكرمة", en: "Makkah Region" },
    center: { lat: 21.2703, lng: 40.4158 },
    photo: unsplash("1708991872571-c5f7db8ea2da", "Asep Rendi"),
    districts: [
      { slug: "al-hawiyah", name: { ar: "الحوية", en: "Al Hawiyah" } },
      { slug: "ash-shafa", name: { ar: "الشفا", en: "Ash Shafa" } },
    ],
  },
  {
    slug: "abha",
    name: { ar: "أبها", en: "Abha" },
    region: { ar: "منطقة عسير", en: "Asir Region" },
    center: { lat: 18.2164, lng: 42.5053 },
    photo: unsplash("1781562234709-26e1779b153f", "Ben Latif"),
    districts: [
      { slug: "al-mansak", name: { ar: "المنسك", en: "Al Mansak" } },
      { slug: "al-khalidiyah", name: { ar: "الخالدية", en: "Al Khalidiyah" } },
    ],
  },
];

export function isCitySlug(value: unknown): value is CitySlug {
  return typeof value === "string" && (CITY_SLUGS as readonly string[]).includes(value);
}

export function getCity(slug: CitySlug): City {
  const city = CITIES.find((c) => c.slug === slug);
  if (!city) throw new Error(`Unknown city: ${slug}`);
  return city;
}

export function getDistrict(citySlug: CitySlug, districtSlug: string): District | undefined {
  return getCity(citySlug).districts.find((d) => d.slug === districtSlug);
}
