# Shima Teppanyaki — Design reference

Updated: 2026-11-18 (Asia/Makassar).

Scope: the static Shima website: `index.html`, `restaurant.html`, and `teppanyaki.html`.
Read this document before changing its UI. This is a project reference, not a global style guide.

## How to read this document

- **Approved preferences** record the user's revisions, approved with “write all to design.md” on 2026-11-18. Keep their scope narrow.
- **Current implementation** records the design observed in the source on the date above. These values are not additional user taste rules or a claim that every legacy detail is ideal.
- The reasons marked **inferred, approved** were proposed by the agent and accepted through “write all”; they were not originally stated by the user.
- Keep the implementation reference current when its corresponding UI changes. Do not turn a one-off bug fix into an unrelated universal design rule.

## Approved preferences — Spacing & layout

- **Food-menu card grids use two columns on mobile, including 320 px screens.** This applies to food-menu grids in this project, not every content section.
  Why: more food choices remain visible without a long single-column scroll (**inferred, approved**).
  Current selector: `.menu-photo-grid` in `typography.css`; use `repeat(2, minmax(0, 1fr))` at mobile widths.
  <!-- 2026-11-18: "buat menu di mobile view menjadi 2 grid kolom" -->

## Approved preferences — Interaction

- **The floating WhatsApp button, help label, and open chat panel sit above the fixed bottom action bar.** None may cover Directions or the other bottom actions. Apply this wherever that shared action bar appears.
  Why: the user explicitly requested that WhatsApp not cover Directions.
  Current selectors: `.wa__btn_popup`, `.wa__btn_popup_txt`, `.wa__popup_chat_box`, and `.action-nav`.
  <!-- 2026-11-18: "naikan posisi whatsappnya supaya tidak menutup menu direction" -->

## Approved preferences — Motion

- **The mobile navbar stays fixed and shrinks on downward scroll, with the logo and bar changing together.** The compact logo hides its lower descriptive lettering; the full presentation returns near the top. The menu trigger remains accessible.
  Why: retain the restaurant identity while giving content more space (**inferred, approved**).
  Current selectors: `#nav-menu`, `#logo`, and `.on`; behavior is shared across all three pages.
  <!-- 2026-11-18: "navbarnya fixed dengan animasi seperti di desktop ketika di scroll ke bawah akan mengecil dan menampilkan logo saja" -->

## Current implementation — Identity and composition

The site presents the restaurant through large photographs, a centered Shima logo, serif headings, sans-serif body copy, and blue/turquoise accents. Home uses a photographic slider; Restaurant and Teppanyaki use photographic banners. Introductory and menu-section headings are centered with short underline accents. Food cards place the photograph before the bilingual description and price.

The current interface is predominantly light, with white text over darkened photography, a white navigation bar, and a blue bottom action bar. It does not implement a separate dark theme.

## Current implementation — Sources and cascade

| Source | Responsibility |
| --- | --- |
| `assets/444f4b01bfa8.css` | Bootstrap containers, columns, forms, and base component styles |
| `assets/e04a720f7f3d.css` | Original theme: sections, colors, spacing utilities, heroes, buttons, and action bar |
| `assets/b245549114e2.css` | Original responsive overrides |
| `local-fixes.css` | Mobile fixed header, background fixes, WhatsApp clearance, and footer clearance |
| `typography.css` | Local fonts, navigation typography/layout, hero supporting copy, and food-card grid |
| `assets/dc8a1a7485b0.js` | Navbar state, slider, mobile navigation, and popup interactions |
| Page HTML | Content, image selection, local links, inline styles, and conditional Stellar initialization |

The HTML loads `local-fixes.css` before `typography.css`; page styles and inline declarations also participate in the cascade. Use the effective selector and breakpoint, not the first matching declaration. For example, menu images have an earlier 4:3 declaration but the later **1:1** rule is active. The original Open Sans/Vidaloka declarations are superseded by the local fonts below.

## Current implementation — Typography

| Role | Family / weight | Size and rhythm |
| --- | --- | --- |
| Body and form controls | Manrope; body 400 | Body 15 px; paragraphs 24 px line height, 20 px bottom margin |
| Headings | Marcellus 400 | General `h2`/`.h2`: 3.5 em, line height 1.1; 2.7 em at ≤640 px, 2.5 em at ≤480 px |
| General `h3` | Marcellus 400 | 24 px / 33 px; food cards override this |
| Desktop nav and submenus | Marcellus 400, uppercase | Main links: `clamp(10px, 1.15vw, 18px)`, tracking .045 em; submenu typography uses .06 em |
| Hero supporting sentence | Manrope 400 | `clamp(14px, 1.35vw, 18px)`, line height 1.6, tracking .01 em, max width 640 px |
| Food-card heading | Marcellus 400 | 20 px, line height 1.35; 18 px at ≤600 px |
| Food-card subheading | Manrope | 14 px / 1.5; 13 px at ≤600 px |
| Food-card description | Manrope | Line height 1.65; 13 px at ≤600 px; text may wrap anywhere |
| Food-card price `.menu-price` | Marcellus 400 | 24 px / 1.2; 20 px at ≤600 px |
| CTA `.btn` | Manrope 700, uppercase | 14 px / 19 px; large variant 16 px |
| WhatsApp plugin | Arial / Helvetica | Plugin-specific labels; help label 12 px |

Fonts are local: `assets/manrope-{400,500,600,700}.ttf` and `assets/marcellus-400.ttf`, with `font-display: swap`. Strong text uses weight 600. `.font-3x` introductory prose uses 18 px / 30 px.

Hero display titles use `.slides h3` and `.parallax .h2`: default slide heading 57/60 px, responsive 54/58 at ≤1366, 50/54 at ≤1280, 4vw/45 at ≤1024, 35/40 at ≤640, 30/35 at ≤360, and 5vw/25 at ≤320. These legacy breakpoints describe existing behavior rather than a new universal type scale.

## Current implementation — Color system

There is no centralized palette-token layer. The role names below document existing literal values; they are not CSS custom properties.

| Role | Current value | Usage |
| --- | --- | --- |
| Primary blue | `#0e4870` | Headings, food prices, bottom action backgrounds |
| Navigation / filled CTA teal | `#199aa3` | Original nav links and `.btn-green` |
| Heading accent | `#33c8d2` | Short underlines beneath section headings |
| Link hover teal | `#54b6b8` | General hovered/focused links |
| Page surface | `#f5f5f5` | Body background |
| Navigation surface | `#f9f9f9` → `#fff` | Expanded → compact navbar |
| White | `#fff` | Logo backing, surfaces, text over photos, outlined CTA borders |
| Body text | `#555` | Default copy |
| Dark neutral | `#000`, `#333` | Dark menu surfaces, button hover, dividers |
| Light neutral | `#ddd` | Rules and light heading underlines |
| WhatsApp green | `#2db742` | Floating WhatsApp button and chat header |
| WhatsApp label | `#f5f7f9` / `#43474e` | Help-label background / text |

Photographic `.bg-overlay` and `.parallax` overlays use black at .35 opacity. The light underline variant uses `#ddd`. These overlays support text contrast while retaining the photograph.

## Current implementation — Spacing and responsive layout

| Area | Current values |
| --- | --- |
| Content container | 15 px side gutters; 750 px at ≥768, 970 px at ≥992, 1170 px at ≥1200; mobile header container is full width |
| Desktop navigation container | Full width, max 1480 px, side padding `clamp(20px, 4vw, 64px)` |
| Desktop nav layout | `minmax(0, 1fr) 150px minmax(0, 1fr)`; centered logo; side link gaps `clamp(8px, 1.2vw, 20px)` |
| General sections | Original theme default: 90 px vertical padding; page classes override individual sections |
| Utility spacing | Existing fixed utilities generally use 10–60 px; fluid utilities use 1–5 vw; this is not a single enforced spacing-token scale |
| Menu grid | Three columns at ≥992; two at ≤991, including mobile; `minmax(0, 1fr)` and `min-width: 0` cards |
| Menu-grid spacing | Row/column gaps 48/28 px; at ≤600, 28/14 px; padding `0 15px 50px` |
| Food-card rhythm | Image bottom margin 20 px; heading bottom margin 10 px; price top margin 16 px |
| Hero supporting copy | 24 px bottom margin, 16 px side padding |
| Heading underline | 70 px wide, 2 px thick; centered margin `20px auto 10px` |
| Mobile footer clearance | At ≤1024, bottom padding `calc(160px + env(safe-area-inset-bottom, 0px))` |

Breakpoints differ by component: mobile navigation ≤768, bottom action bar ≤1024, menu-grid collapse ≤991, food-card text/gap adjustment ≤600. Do not assume one shared mobile breakpoint.

## Current implementation — Navigation and motion

- Desktop navigation is fixed with full link groups. Link vertical padding changes from 48 px to 25 px in `.on`; logo box changes from 110×147 px to 65×65 px.
- Mobile navigation (≤768) is fixed at the viewport top. The page's `header` always reserves **147 px** independently of the animated navbar, preventing a content jump.
- Mobile bar height changes **147 → 72 px**. Logo starts at 110×147 px; compact transform is `translateY(4px) scale(0.590909)` with `clip-path: inset(0 0 37px 0)` to hide lower lettering. It remains centered.
- Bar height, logo transform, and logo clipping begin together: **240 ms**, `cubic-bezier(0.22, 1, 0.36, 1)`, with no stagger. These are current implementation values, not permanent user-specified numbers.
- Scroll state uses hysteresis: mobile collapses above 120 px and expands at ≤48 px; desktop collapses above 147 px and expands at ≤70 px. Updates are batched through `requestAnimationFrame` with a passive scroll listener.
- The mobile menu trigger has a 44×44 px minimum target, `role="button"`, focusability, `aria-expanded`, and `aria-controls`. Enter/Space activate it; Escape closes the menu and returns focus.
- The dropdown is positioned below the current bar (`top: 100%`). Its scrollable height is `100dvh - 147px`, or `100dvh - 72px` when compact; vertical overscroll is contained.
- Mobile dropdown open/close uses a 200 ms slide with items appearing together. Reduced motion disables navbar transitions and sets the dropdown duration to zero.
- Logo/bar motion leaves the page content and menu trigger stationary. Existing slider behavior uses a fade with a 5000 ms slideshow interval.

## Current implementation — Bottom actions and WhatsApp

- `.action-nav` appears at ≤1024 px, fixed to the bottom with four equal-width actions: Book Now, WhatsApp, Email, Directions. Links use 10 px vertical padding; labels are 12 px at ≤640, and icons are 18 px.
- On these widths, `.wa__btn_popup` sits `80px + safe-area-inset-bottom` above the viewport bottom. The help label is positioned relative to the button, so it moves with it.
- The open chat panel sits `152px + safe-area-inset-bottom` above the bottom; max width is `100vw - 50px`, max height is `100dvh - 168px - safe-area-inset-bottom`, with internal vertical scrolling.
- Desktop plugin defaults: button bottom 30 px, right 30 px, icon 56×56 px; panel bottom 102 px, right 25 px, width 351 px. Mobile offsets change placement, not the icon size.
- Stacking is legacy/component-specific: action bar z-index 18, nav/button 999, chat panel 998, and mobile trigger 1000 inside navigation. Do not interpret these numbers as a newly standardized z-index scale.

## Current implementation — Images, banners, and surfaces

- Food photos fill square frames with `object-fit: cover` and 4 px corner radius. Cards sit directly on the section background rather than on separately boxed, shadowed surfaces.
- Teppanyaki banner uses `assets/optimized/33463e65333c-26a450c6e6473084-960.webp` at ≤960 px and `assets/optimized/33463e65333c-93cfc2f536bde00a-1600.webp` above that width.
- Home's “Highest Quality Ingredients” background is `assets/3de3f6a190a7.jpg`. The section has one combined `class` attribute: `featured-intro bg-overlay parallax`.
- At ≤768 px, `.parallax`, `.bg-fixed`, `#contact-parallax`, and slider backgrounds use `background-attachment: scroll` and centered positioning. Body background attachment also becomes `scroll`.
- Stellar parallax initializes only at ≥769 px with `prefers-reduced-motion: no-preference`. The mobile background override addresses the Safari/iOS fixed-background cropping issue; it is a compatibility behavior, not a blanket ban on desktop parallax.
- Buttons have a 3 px radius. Photo-overlay CTAs use a transparent background, 2 px white border, white uppercase text, and 12×30 px padding. Their hover state becomes white with black text. Large buttons use 15×30 px padding.

## Current implementation — Content and interaction boundaries

- Public copy uses English with Japanese food names/descriptions; the menu retains its existing IDR prices and supporting weights/quantities.
- Home's **View Menu** CTA links to `teppanyaki.html`. The three static pages use local links for their shared navigation.
- Booking, WhatsApp, email, and directions remain separate actions. Some navigation entries are intentionally unlinked in the static copy; not every original WordPress page or backend behavior is implemented here.
- No new copywriting voice, color preference, or typeface preference was explicitly selected by the user in this chat. The corresponding sections above describe the current site.

## Verification reference

Approved preferences can be checked with browser assertions; these are documented checks, not newly installed tests:

1. At widths 320, 390, and 600 px, `.menu-photo-grid` resolves to two columns and creates no horizontal overflow.
2. At widths where `.action-nav` is visible, the WhatsApp button, label, and open panel end above that bar; the center of Directions hit-tests to its own link/descendant.
3. At mobile widths, navbar top remains zero after scroll, its height decreases, and the content's document position stays constant. Reverse direction mid-transition, then confirm full expansion near the top.
4. Open/close mobile navigation in both header states; check Enter, Space, Escape, internal menu scrolling, and reduced motion.
5. Check Safari on an actual iPhone for photographic crop and interrupted navbar motion. Chrome device emulation alone does not establish Safari parity.

Prior checks in this chat passed on Chromium across the three pages at 320, 390, 768, and 1440 px for navbar behavior, including sampled interruption frames and reduced motion. WhatsApp checks also covered 1024 px. Automated WebKit verification could not complete because the installed browser and driver versions were incompatible; actual iPhone parity remains unverified.

Documentation-only update: this file does not introduce new lint rules, browser tests, or component changes. The earlier proposal to create an `AGENTS.md` pointer has not been applied because the user requested this write in `design.md`.

## Approved mobile navigation update — 2026-11-18

Ivory was selected for the live mobile navigation: warm surface `#faf9f5`, blue Marcellus 25 px links, subtle row dividers, and Manrope submenu text. Do not include “Welcome to Shima”, “Japanese dining · Teppanyaki”, or their decorative accent rule. Preserve the existing navigation structure and fixed/shrinking header.

Menu opening uses one panel transition (opacity and 6 px translation, 200 ms); closing uses 150 ms. Menu rows travel with the panel, without stagger. The hamburger changes to a close icon together with the panel. Keyboard and reduced-motion interactions are immediate. The prototype was promoted and its isolated files removed. This update is local only; no Vercel deployment was requested.

Mobile motion refinements: hamburger transforms and opacity now use 200 ms on opening and 150 ms on closing, matching the panel. Mobile anchors override the legacy all-property transition; only fine-pointer hover color uses 150 ms. Keyboard focus and reduced motion have no link transitions. Focus outlines explicitly override the legacy important reset, and keyboard/reduced-motion submenu presses do not scale.

Submenu refinement: after the user reported abrupt submenu opening/closing, pointer activation now expands measured height in 240 ms and collapses it in 180 ms, using `cubic-bezier(.23, 1, .32, 1)`. The plus icon's vertical stroke folds on the same timeline. No row stagger or independent content entrance. Interrupted transitions retarget from current height; fully open height returns to auto for wrapping and resizing. Keyboard and reduced-motion submenu changes stay immediate. Collapsed content is inert and aria-hidden.
