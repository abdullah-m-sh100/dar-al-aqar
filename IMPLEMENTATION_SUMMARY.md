# Implementation Summary

## What was completed

A bilingual (Arabic default, English secondary) Saudi real estate platform frontend with 17 routes: home, properties, property details, projects, project details, agents, about, contact, favorites, dashboard (5 sections), login, register, terms, privacy, plus 404, error, sitemap, robots and a generated OG image.

Research: live references were reviewed in the browser before design. **Aqar** (sa.aqar.fm), **Bayto** (bayto.sa) and **Aqora** (aqora.sa) were inspected. **Bayut** (bayut.sa) returned a bot-verification page and was not inspected. Takeaways applied: annual rent pricing, Saudi terms (دور, صك, واجهة, عرض الشارع), city-first discovery with live counts, and the "featured" badge. Patterns avoided: long uncurated city lists, crowded listing rows, and category tiles that show "0 available".

## Fully functional

- Cookie-based locale with no URL prefix. The server renders `lang`/`dir` on the first response. Switching language keeps the path, query string, filters and scroll position. The choice persists across refreshes.
- Search, filtering, sorting, pagination and grid/list/map views, all driven by shareable URL parameters.
- Property details with gallery, keyboard lightbox, map, sharing and similar listings.
- Guest favorites stored in localStorage, synced across tabs, with a count in the header.
- Client-side validation (Zod, localized messages) on every form: viewing request, contact, login, register, add property, settings.
- Responsive layouts from 375 px to wide desktop. Mobile filter sheet and mobile navigation drawer.
- Motion respects `prefers-reduced-motion`.

## Uses mock data

- 24 listings, 6 projects, 6 agents, and dashboard listings, views and inquiries (`src/data`).
- Form submissions resolve through `src/services/mock-submissions.ts` after simulated latency. Nothing is sent or stored, and the UI says so.
- Agent call/WhatsApp buttons show a demo notice instead of fake `tel:` or WhatsApp links.

## Requires backend integration

Persistent listings and search, authentication and session protection for `/dashboard`, inquiry delivery, listing creation with photo upload, account-synced favorites, and real analytics. Integration points are documented in `README.md` under "Backend integration guide".

## Tests and checks executed

| Check                                                                                                                                                                                                                    | Result                                                  |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------- |
| `tsc --noEmit` (strict)                                                                                                                                                                                                  | Passed                                                  |
| ESLint                                                                                                                                                                                                                   | Passed, 0 warnings                                      |
| Prettier `--check`                                                                                                                                                                                                       | Passed                                                  |
| Vitest, 8 files / 51 tests: URL params, filter/sort/paginate, Arabic search normalization, i18n key parity, Arabic plurals, number formatting, validation schemas, repository, FavoriteButton, PropertyCard, ContactForm | All passed                                              |
| `next build`                                                                                                                                                                                                             | Succeeded                                               |
| Image URLs: all 117 Unsplash photos requested over HTTP                                                                                                                                                                  | All returned 200; no photo is reused across listings    |
| Manual browser QA, Arabic and English: home, listing filters/sort, language switch preserving the URL, details page, lightbox keyboard navigation, mobile drawer                                                         | Passed; no console errors                               |
| Automated 375 px overflow scan across 18 routes                                                                                                                                                                          | No horizontal scroll (after fixing the dashboard table) |

Not run: end-to-end tests (Playwright was not installed, to avoid a large browser download). Key flows were exercised manually in the in-app browser instead. No Lighthouse or axe audit was run.

## Known limitations

- Shared URLs mean crawlers index the Arabic rendering. There are deliberately no hreflang alternates (see README → SEO).
- Images are representative Unsplash photographs, credited in the UI, and do not show the listed units. Coordinates are approximate, at district level.
- Map tiles come from the keyless Esri Light Gray Canvas service, which is fine for a demo but needs a production plan for real traffic.
- Cache Components / Partial Prefetching are disabled, because the root layout reads the locale cookie and every page renders dynamically.
- No dark mode. The Saudi Riyal is shown as "ر.س" / "SAR" rather than the new Riyal glyph, which many fonts cannot yet render.
