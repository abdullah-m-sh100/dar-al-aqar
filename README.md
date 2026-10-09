# دار العقار · DAR AL AQAR

A premium, bilingual (Arabic-first) Saudi real estate discovery platform, built as a production-quality **frontend prototype** with Next.js App Router, TypeScript and Tailwind CSS.

> All listings, projects, agents and dashboard figures are **demo data**. There is no backend, authentication, payment or property verification service. Mocked features are labelled as such in the UI.

---

## Tech stack

| Area          | Choice                                                                                                                  |
| ------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Framework     | Next.js 16 (App Router, Turbopack), React 19, TypeScript (strict)                                                       |
| Styling       | Tailwind CSS v4, CSS-variable design tokens (`src/app/globals.css`)                                                     |
| UI primitives | shadcn/ui conventions (`components.json`), Radix UI (Dialog, Slot), Class Variance Authority, `clsx` + `tailwind-merge` |
| Icons         | Lucide React (plus small inline SVGs for social brands, which Lucide v1 no longer ships)                                |
| Motion        | Motion for React (`motion/react`), with `prefers-reduced-motion` respected globally                                     |
| Forms         | React Hook Form + Zod (localized error messages)                                                                        |
| Client state  | Zustand (persisted guest favorites only)                                                                                |
| Maps          | Leaflet, loaded lazily on the client                                                                                    |
| Fonts         | `next/font`: IBM Plex Sans Arabic (body), Alexandria (Arabic display), Manrope (English)                                |
| Images        | `next/image` with a custom loader that resizes on the Unsplash CDN                                                      |
| Quality       | ESLint (next/core-web-vitals + TS), Prettier (+ Tailwind plugin), Vitest + Testing Library                              |

TanStack Query and `next-themes` were evaluated and intentionally **not** added: all data loads in Server Components, so there is no client-side async cache to manage, and dark mode is out of scope for this release.

## Getting started

Requirements: Node.js 20.9+ (developed on Node 24) and npm.

```bash
npm install
npm run dev        # http://localhost:3000
```

| Command                           | Purpose                         |
| --------------------------------- | ------------------------------- |
| `npm run dev`                     | Development server              |
| `npm run build`                   | Production build                |
| `npm start`                       | Serve the production build      |
| `npm run typecheck`               | `tsc --noEmit`                  |
| `npm run lint`                    | ESLint                          |
| `npm run format` / `format:check` | Prettier                        |
| `npm test`                        | Unit + component tests (Vitest) |
| `npm run check`                   | typecheck + lint + tests        |

Optional environment variable: `NEXT_PUBLIC_SITE_URL` (used for canonical URLs, sitemap and structured data; defaults to `http://localhost:3000`).

## Folder architecture

```
src/
  app/
    (public)/          home, properties, properties/[slug], projects, projects/[slug],
                       agents, about, contact, terms, privacy   (header + footer shell)
    (account)/         favorites, dashboard                       (same shell)
    (auth)/            login, register                            (split-screen layout)
    layout.tsx         <html lang dir> from the locale cookie, fonts, providers
    sitemap.ts robots.ts opengraph-image.tsx icon.svg not-found.tsx error.tsx
  components/
    ui/                button, form controls, badge, alert, sheet (Radix Dialog)
    layout/            header, mobile navigation, footer, logo, language switcher
    shared/            section heading, price, breadcrumbs, map, skeletons, CTA, reveal…
  features/
    properties/        schema, types, repository, cards, gallery, specs, contact card
    search/            URL param parsing, filtering/sorting, hero search, filters, pagination
    favorites/         Zustand store, favorite button, favorites view
    home/ projects/ agents/ contact/ auth/ dashboard/
  i18n/                config, cookie locale, server action, dictionaries, formatting
  data/                typed mock data (24 listings, projects, agents, dashboard)
  config/              cities & districts, site config, editorial media
  services/            mock submission endpoints
  lib/                 utils, metadata helper, validation schemas, image loader
  test/                Vitest setup and helpers
```

Server Components are the default. Client Components are limited to interactive islands: header (scroll state), language switcher, search/filter controls, favorites, gallery lightbox, map, forms and scroll reveals.

## Internationalization (no locale in the URL)

- Locales: `ar` (default, RTL) and `en` (LTR). URLs are identical in both languages — there is no `/ar` or `/en` anywhere.
- The selected locale is stored in the `dar_locale` cookie (1 year). `getLocale()` reads it on the server (`src/i18n/locale.ts`), so the first HTML response is already in the right language and direction — no hydration mismatch or flash.
- The root layout sets `<html lang dir>`; Arabic/English typography switches via `:lang()` CSS.
- Switching language calls a **Server Action** (`setLocaleAction`) inside a transition. Setting a cookie in a Server Action makes Next.js re-render the current route in place, so the **pathname, query string, filters and scroll position are preserved**.
- Dictionaries live in `src/i18n/dictionaries/{ar,en}.json`. Arabic is the source of truth; the English dictionary is type-checked against it, and a unit test asserts both have identical keys.
- Content data stores both languages side by side (`{ ar, en }`), keeping presentation components free of hardcoded strings.
- `Intl` handles numbers and dates. Arabic uses Latin digits (`ar-SA-u-nu-latn`) and the Gregorian calendar, matching Saudi digital conventions. Arabic pluralisation (six forms) uses `Intl.PluralRules`.
- Layout uses logical properties (`ms-*`, `pe-*`, `start-*`, `end-*`); directional icons mirror in RTL via the `flip-rtl` utility.

### SEO with shared, cookie-based URLs

Because both languages share one URL, search engines will generally index the **default (Arabic)** rendering, since crawlers do not send the locale cookie. Consequently:

- Metadata (`title`, `description`, Open Graph) is localized per request, and every page declares a canonical, locale-free path.
- No `hreflang` alternates are emitted — there are no separate language URLs to point to, and inventing `/ar` or `/en` alternates would be incorrect.
- The sitemap lists each URL once.
- If English pages must be indexed independently in the future, the standard solution is distinct URLs (e.g. an `en.` subdomain) with reciprocal `hreflang` — a deliberate product decision outside this release.

## Design system

Tokens are defined once in `@theme` (`src/app/globals.css`) and consumed as Tailwind utilities:

- **Colours**: `ink` #102D35, `primary` #1B555C, `mint` #BAE7D4, `canvas` #F6F7F3, `sand` #D2A77E (sparingly), `fg` #172B30, `fg-muted` #5C6E70 (the brand #66787A darkened slightly to meet WCAG AA on ivory), `line` #E4EAE7, `success` #24856C, `danger` #DC5555 with an AA-safe text tone `danger-fg`.
- **Type scale**: fluid `text-display` and `text-title`; locale-specific font stacks.
- **Radii / elevation / motion**: `rounded-card`, `rounded-panel`, `shadow-soft|lift|float`, `ease-out-expo`.
- **Components** use CVA variants (Button, Badge, Alert) so one component covers every style.
- **Logo**: an original SVG mark — a Najdi-inspired doorway (arch + door + keystone) — with light and dark variants and a bilingual wordmark (`src/components/layout/logo.tsx`).

## Data architecture

- `propertySchema` (Zod) is the single contract for listings; types are inferred from it. Mock data is validated once when the repository module loads.
- Repositories (`features/*/services/*-repository.ts`) are `async` and `server-only`. Swapping the mock arrays for an API or database client does not affect any UI.
- Search state lives in the URL. `parseSearchParams` validates each parameter independently and falls back silently, so hand-edited links never break the page. `filterAndSort` and `paginate` are pure, unit-tested functions. Arabic keyword search normalizes hamza, taa marbuta and diacritics.
- Rent prices are annual (SAR / year), as is customary in Saudi Arabia. Coordinates are approximate, at district level.

## Implemented features

- Premium homepage: cinematic hero, integrated search, featured listings, city bento grid with live counts, property-type categories, luxury editorial section, "Why us", "How it works", owner CTA.
- `/properties`: keyword, buy/rent, city → district, type, price, beds, baths, area and luxury filters; four sort orders; grid / list / map views; active filter chips; pagination; result count; empty and loading states; mobile bottom-sheet filters. Everything is reflected in a shareable URL.
- `/properties/[slug]`: mosaic gallery with a keyboard-navigable fullscreen lightbox, specs (façade, street width, age, furnishing…), highlights, amenities, location map, representative card with demo call/WhatsApp state, viewing request form, share (Web Share API / clipboard), favorites, similar listings, `RealEstateListing` structured data and a mobile action bar.
- `/projects` and `/projects/[slug]`, `/agents`, `/about`, `/contact`, `/terms`, `/privacy`.
- `/favorites`: guest favorites persisted in `localStorage`, synced across tabs.
- `/login`, `/register`: validated forms, password visibility toggle, loading and error states.
- `/dashboard`: overview, my properties, add property (validated form), inquiries, account settings — explicitly labelled demo.
- Technical SEO: Metadata API, canonical URLs, Open Graph/Twitter, generated OG image, sitemap, robots, JSON-LD (Organization, WebSite, BreadcrumbList, RealEstateListing).

## Demo limitations

- No backend: viewing requests, contact messages, listings and settings go to mock handlers in `src/services/mock-submissions.ts` and are never stored.
- Authentication is UI-only; submission always reports that accounts are not enabled. The dashboard is not protected.
- Agents, projects and developers are fictional; no licensing or accreditation is implied, and no real contact details are shown.
- Photography comes from Unsplash under the [Unsplash License](https://unsplash.com/license), with credits shown in the UI. Images are representative and do not depict the listed units.
- Map tiles use the keyless Esri Light Gray Canvas service, suitable for a demo; production traffic should use a provider and plan with an agreed usage policy.

## Backend integration guide

1. **Listings** — implement the functions in `features/properties/services/property-repository.ts` against your API/DB (keep `propertySchema` as the validation boundary). Add `use cache` / revalidation as appropriate.
2. **Search** — move `filterAndSort` into the query layer (SQL / search engine) while keeping `parseSearchParams` for URL validation.
3. **Forms** — replace the functions in `services/mock-submissions.ts` with Server Actions or Route Handlers; the `SubmissionResult` contract is already used by every form.
4. **Auth** — plug a provider (e.g. Auth.js or Clerk) into `authenticate`, protect `(account)` routes with a layout check or `proxy.ts`, and load the dashboard workspace per session in `dashboard-repository.ts`.
5. **Favorites** — keep the Zustand store as the guest cache and sync its `toggle` / `remove` / `clear` actions to an API for signed-in users; pass only saved properties to `FavoritesView`.
6. **Media** — upload listing photos to object storage and extend `src/lib/image-loader.ts` for your CDN.
