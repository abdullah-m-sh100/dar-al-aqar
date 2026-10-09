import type { Agent } from "@/features/agents/types";

/**
 * Demonstration representatives. These are fictional people: no licence
 * numbers or accreditation are implied, and contact details are withheld.
 */
export const agents: Agent[] = [
  {
    id: "ag-01",
    name: { ar: "نورة السبيعي", en: "Noura Al-Subaie" },
    role: { ar: "مستشارة عقارات سكنية", en: "Residential Property Advisor" },
    specialties: [
      { ar: "فلل شمال الرياض", en: "North Riyadh villas" },
      { ar: "شقق مفروشة", en: "Furnished apartments" },
    ],
    cities: ["riyadh"],
    languages: ["ar", "en"],
    bio: {
      ar: "تساعد العائلات على مقارنة الأحياء والمخططات في شمال الرياض واختيار ما يناسب احتياجاتها وميزانيتها.",
      en: "Helps families compare districts and floor plans across north Riyadh to find the right fit for their needs and budget.",
    },
  },
  {
    id: "ag-02",
    name: { ar: "فيصل الغامدي", en: "Faisal Al-Ghamdi" },
    role: { ar: "مستشار عقارات ساحلية", en: "Coastal Property Advisor" },
    specialties: [
      { ar: "شقق بإطلالة بحرية", en: "Sea-view apartments" },
      { ar: "فلل أبحر", en: "Obhur villas" },
    ],
    cities: ["jeddah"],
    languages: ["ar", "en"],
    bio: {
      ar: "يركّز على العقارات السكنية في شمال جدة والواجهة البحرية، ويرافق العملاء في المعاينات من البداية حتى القرار.",
      en: "Focuses on residential property along Jeddah's northern waterfront, guiding clients from first viewing to final decision.",
    },
  },
  {
    id: "ag-03",
    name: { ar: "عبدالله الدوسري", en: "Abdullah Al-Dosari" },
    role: { ar: "مستشار عقاري – المنطقة الشرقية", en: "Property Advisor – Eastern Province" },
    specialties: [
      { ar: "الخبر والدمام", en: "Khobar & Dammam" },
      { ar: "الإيجار للمهنيين", en: "Rentals for professionals" },
    ],
    cities: ["khobar", "dammam"],
    languages: ["ar", "en"],
    bio: {
      ar: "يعرف أحياء الخبر والدمام جيداً، ويساعد المستأجرين والمشترين على الموازنة بين القرب من العمل والبحر والخدمات.",
      en: "Knows Khobar and Dammam neighbourhoods well, helping tenants and buyers balance commute, sea access and services.",
    },
  },
  {
    id: "ag-04",
    name: { ar: "ريم الحربي", en: "Reem Al-Harbi" },
    role: { ar: "مستشارة عقارية – مكة والمدينة", en: "Property Advisor – Makkah & Madinah" },
    specialties: [
      { ar: "سكن عائلي", en: "Family homes" },
      { ar: "استثمار موسمي", en: "Seasonal investment" },
    ],
    cities: ["makkah", "madinah"],
    languages: ["ar"],
    bio: {
      ar: "تعمل مع العائلات والمستثمرين في مكة المكرمة والمدينة المنورة، مع اهتمام خاص بسهولة الوصول والخدمات القريبة.",
      en: "Works with families and investors in Makkah and Madinah, with particular attention to access and nearby services.",
    },
  },
  {
    id: "ag-05",
    name: { ar: "خالد الشهري", en: "Khalid Al-Shehri" },
    role: { ar: "مستشار عقاري – المصايف", en: "Property Advisor – Summer Destinations" },
    specialties: [
      { ar: "أبها والطائف", en: "Abha & Taif" },
      { ar: "منازل بإطلالات جبلية", en: "Mountain-view homes" },
    ],
    cities: ["abha", "taif"],
    languages: ["ar", "en"],
    bio: {
      ar: "متخصص في عقارات المناطق الجبلية ذات الأجواء المعتدلة، للسكن الدائم أو الإقامة الصيفية.",
      en: "Specialises in homes across the cooler highland cities, for year-round living or summer stays.",
    },
  },
  {
    id: "ag-06",
    name: { ar: "لمى القحطاني", en: "Lama Al-Qahtani" },
    role: { ar: "مستشارة عقارات تجارية", en: "Commercial Property Advisor" },
    specialties: [
      { ar: "مكاتب ومعارض", en: "Offices & showrooms" },
      { ar: "أراضٍ تجارية وسكنية", en: "Commercial & residential land" },
    ],
    cities: ["riyadh", "jeddah", "dammam"],
    languages: ["ar", "en"],
    bio: {
      ar: "تساعد الشركات والمستثمرين على تقييم المواقع التجارية والأراضي وفق الواجهة وعرض الشارع وحركة المرور.",
      en: "Helps businesses and investors assess commercial sites and land by frontage, street width and footfall.",
    },
  },
];
