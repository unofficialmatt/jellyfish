# Roadmap for v5.0

What shipped in the v5 modernisation, what's still open, and what was deliberately left for later.

---

## Done

### Design tokens & colour system

- All custom properties namespaced `--jf-*` via `$token-prefix`; `v()` renamed `token()`, no alias (`cc979a9`)
- Semantic step-role aliases — `--jf-color-{family}-{subtle,muted,emphasis,strong}` + `get-color-role()` (`e9834aa`)
- Contextual surface/text tokens — `--jf-color-surface` / `-text` / `-headings` / `-text-muted` / `-text-subtle`, `@property`-registered (`e9834aa`)
- `.bg-*` rewritten onto the semantic layer for every palette family plus raw `$background-colors` entries (`e7d7572`)
- Build-generated `--jf-color-on-{family}-{shade}` text companions, consumed by buttons, chips, tables and callouts (`e7d7572`, `9801a09`)
- Non-colour axes added: spacing, radius, border-width, elevation, motion, line-height, font-weight; font-size scale renamed to named steps (`ef9ce5e`, `be021ad`, `b6b96cb`, `ece0662`)
- Role ladder consolidated into one `$color-role-shades` map + `role-shade()`; per-component shade knobs removed in favour of roles (`8be080e`)
- Component custom properties moved off `:root` onto their own selector (`.card`, `.chip`, `dialog.modal`, `table`) (`41dd593`)
- `$color-role-shades` and `$dark-color-role-shades` take a partial override without dropping the roles you leave out; an unrecognised role name fails the build
- Colour pairs are linted against WCAG 2.x AA (4.5:1) at build time. APCA was built first and reverted — it proved stricter than the standard this project is held to (`3acacaa` → `90cba8a`)
- A palette family is declared as a bare seed colour — `$colors: ("brand": #0b7)` — and its 25–1000 ramp is generated at build. An explicit map of shades is still accepted for a hand-tuned ramp; anything else stops the build naming the family
- Palette generator tool for previewing and exporting a custom `$colors` family

### Dark mode

- `.jf-dark` / `.jf-light` on `<html>` rather than `light-dark()`, so a consumer can override a single dark value at runtime; `prefers-color-scheme` fallback; `window.JellyfishTheme` + `theme.js` (`f2a96ed`)
- Three-surface model — base / `.bg-soft` / `.bg-inverse`; `.bg-white` and all `.white` modifiers removed in favour of `.soft` (`8bb83d3`)
- `.callout` promoted to a full surface; navbar colours wired to the semantic layer, structure unchanged (`f66036d`)
- `--jf-color-on-{family}-{role}` companions keep a role and its paired text flipping together

### Grid & layout

- New `.grid` (CSS Grid) engine alongside the kept `.row` (flex), sharing one `.col` / breakpoint / ordering API; offsets and push/pull removed (`7eb1519`)
- `.container` / `.page` / bleed helpers rebuilt on custom properties — `--jf-container-max`, `--jf-grid-gutter`, `--jf-page-max`, `--jf-bleed-space`; breakpoints locked to fixed constants (`7eb1519`)
- `.section` band — padding-only, seam-collapsing between same-surface siblings
- Debug overlay removed outright

### Components

- Accordion converted to native `<details>` / `<summary>`; JS cut from a 154-line controller to a ~55-line enhancement layer for tracking events and fragment deep-linking (`bf8f0c1`)
- Modal: `@starting-style` open/close animation, `closedby="any"`, CSP-safe `data-modal-target`, scroll-lock via `body:has(dialog.modal[open])`, forced-colors fixups (`74c0a06`)
- Forms: `:user-invalid` / `[aria-invalid]` styling, `.form-hint` / `.form-error`, `fieldset.is-plain`, `field-sizing: content` (`3d7f2ff`, `83cb6ec`, `69cf98f`, `04088f6`)
- Card padding is per-axis at runtime — `--jf-card-padding-x` / `-y`, both taking `$card-padding` at build
- Chip text no longer shrinks below its own size inside a heading or paragraph; the optical lift applies to headings only
- `$chip-border-style` removed — it only ever reached `.chip.outline`, and the base border is always `solid`
- `.icon` + `icon()` mixin, `object-fit` utilities and `.ratio-*` on images, from recurring patterns in real consumer projects (`41dd593`)
- `.button-list` spacing moved from negative margins to `gap`

### Reset, logical properties & typography

- Meyer reset replaced with a modern one — `box-sizing` set directly, `* { margin: 0 }`, opt-in list markers, block media (`49a7587`)
- Full logical-properties sweep across base, components, layout, themes and pages; nav deferred with the rest of the navbar work (`c27a50d`)
- Floats auto-contained — a block with a directly-floated `.align-*` child gets `display: flow-root` at zero specificity, so any explicit `display` still wins (`c473973`)
- Fluid `clamp()` rem type scale, `text-wrap: balance` / `pretty`, aspect-ratio padding hacks removed (`729a442`)
- Dead Sass helpers dropped, `_resolve-bp()` extracted, IE and vendor-prefix sweep, `.clearfix` removed (`c27a50d`)

### Utilities

- Spacing, border and float utilities renamed to logical axes; physical names kept as deprecated aliases
- `.hide-xl` fixed — it was emitted outside any media query and hid at every width; `.hide-xs` added, so the band classes now cover `xs`–`xl` with no gaps

### Reduced motion

- All framework transitions run through `--jf-transition` / `--jf-duration-*`, zeroed under `prefers-reduced-motion: reduce` (`ef9ce5e`, `ece0662`)
- Accordion, off-canvas nav and indeterminate progress moved onto the tokens; the progress sweep is clamped slow rather than stopped, since it has to keep signalling activity
- `scroll-behavior: smooth` scoped to `html:focus-within`, so `scrollTo()` is untouched

### Accessibility

- `forced-colors: active` fixups consolidated into one block — chevron, progress, modal buttons, `.icon` (`69cf98f`)
- Navbar and hamburger `aria-expanded` moved onto the interactive element, focus-visible restored, every inline `onclick` replaced with a delegated listener (`35d6b01`, `98a6beb`)
- Dead `.radio-control` / `.checkbox-control` focus rules removed — the component they styled was replaced by native `accent-color` in 4.x
- Static and live accessibility passes both complete: focus rings, native trap/Esc/restore on `<dialog>` and `<details>`, motion tokens, forced-colors coverage, no unlabelled injected controls

### Documentation

- Full rewrite of all 24 pages, roughly halved in length (`4af73ae`). `whats-new.html` rebuilt as a 5.0 release page — what's new, what changed, a breaking-changes migration table, and an also-changed list
- Component variables live in a panel at the bottom of each component's page, split into Sass variables and custom properties; global axes stay on the variables page with an index linking out
- Every public setting and every emitted token is documented on its own row, with its default and what it does
- Keyboard-interaction tables on modals, accordions and navbar
- Canonical semantic markup throughout — `<article class="card">`, `<figure>`, `<table><caption>`, `<search>`, `<details>`, `<dialog>`
- Docs semantics: `<main id="content">`, skip link, `<nav aria-label>`, heading hierarchy audited on every page (`36d9e84`)
- Examples consolidated onto reusable demo classes; inline styles kept only where the declaration is itself the example
- Bugs found while writing the docs were fixed as they surfaced, including `.callout-heading` never setting its own colour

### Build

- `stickybits` and `es6-promise` dropped — native `position: sticky`, no polyfill needed. `lazyload-bg.js` kept, as there's no native equivalent for its LQIP pattern (`f100d74`)
- `gulp-uglify` → `gulp-terser` for ES2020+ safety
- Lightning CSS evaluated as a replacement for autoprefixer + cssnano + pxtorem, and not adopted — revisit alongside any future Sass entry-point change

---

## Outstanding for 5.0

- **Docs SEO** — per-page canonical and Open Graph meta, JSON-LD (`TechArticle`, `BreadcrumbList`) and an `llms.txt` index. Not started. The head partial also still carries an `x-ua-compatible` meta that can go.
- **Migration audit against real projects** — grep the consumer themes for removed APIs (`offset-*`, re-keyed `$breakpoints`, `$cols`, `$base-*`, per-breakpoint `root-font-size`, `$element-margin`, `$global-transition`, `.white` modifiers, `v()`) and confirm the grid page's migration table covers every hit. Needs the real repos.

---

## Future developments

Decided against for now, with the reasoning, so each can be picked up cold.

### Navbar structural rewrite (5.1)

Considerable work, parked to hit the 5.0 deadline. The navbar keeps its bug fixes and token wiring; the structure is unchanged from v4.

- New markup contract: a link plus a sibling `<button aria-expanded aria-controls>` for every submenu trigger. Disclosure pattern only — no `role="menu"` in site navigation.
- A ~15-line toggle script: toggle `aria-expanded`, close sibling submenus, Esc closes and restores focus to the trigger. Deletes the current width-sniffing logic, `.clicked` and `.drop-active`.
- Submenu panels become `popover`, for native light-dismiss and top-layer escape from overflow and stacking contexts; plain absolute positioning as the fallback; anchor positioning with `position-try-fallbacks` as progressive enhancement, replacing the JS dropdown-flip logic.
- Below the nav breakpoint the same panels render inline, accordion-style, rather than a second markup and behaviour path.
- The off-canvas drawer becomes a real `<dialog>` with `showModal()`, deleting `has-active-nav`, the body-overlay pseudo-element, the click-outside handler, the z-index stack, and the `.closing` dance currently driven by a hardcoded `setTimeout(…, 550)` loosely coupled to a CSS transition. Add `env(safe-area-inset-*)` padding and `overscroll-behavior: contain`.
- Replace the `hamburgers` vendor library with one native icon: a `<span>` inside the toggle button whose middle line is its own background, with `::before` and `::after` as the outer lines. Active state rotates them ±45° and fades the middle, in `currentColor` so it survives forced-colors. One animation instead of 25 variants.
- Drop the `hamburgers` dependency, its ~30 vendored files, the `copyLibs` gulp task, and `$hamburger-types` / `$primary-hamburger-type`; keep the size and colour settings as custom properties.
- Mega menu: the same disclosure component plus `.is-mega` — a full-width panel positioned against the navbar, a grid interior, a container query for column count.
- Retires the dropdown cloning pattern: the top layer escapes overflow and stacking, and navbar-relative positioning gives full width without it.
- Small UX fix to fold in: on a link with children, only the arrow should open the dropdown, not the whole link.

### Sass module migration (`@use` / `@forward`) — not doing

Staying on flat `@import`. Jellyfish ships as one stylesheet among many into WordPress and Drupal themes, where the consumer controls neither load order nor the Sass entry point; module isolation only pays off when a framework owns the whole cascade. Converting the manifests to `@forward` makes every partial an isolated module: cross-module variable and mixin references fail loudly, but cross-module *function* calls fail **silently** — Sass emits something like `em(32px)` as literal dead text. Fixing that means adding explicit `@use` to every file touching a helper, across the whole tree at once. Revisit only if Dart Sass 3.0 actually removes `@import`, likely alongside a build-tool change.

### Blanket `:where()` on base selectors — tried, reverted

Zeroing the specificity of base element selectors lets themes override them without `!important`, but in environments with uncontrolled load order it also lets *any* unrelated bare-element rule win on a source-order tie. Two failures found in practice: a generic `body { font-size: … }` from plugin boilerplate silently rescaling the em-based type system, and `html { box-sizing: … }` tying with `* { box-sizing: inherit }` and flipping every border-box layout to content-box. A class always outranks a bare element anyway. `:where()` stays reserved for structural inner parts of a component and for individual rules that need an `!important` removed — case by case.

### `contrast-color()` + container style queries — revisit ~2027

`contrast-color()` reached Baseline newly-available in April 2026. Used correctly it removes the need to generate a text companion per palette shade — `color: contrast-color(var(--bg))` is correct for any background, including one a consumer adds that was never in `$colors`. Direction: every component already sets its own background custom property, so apply it once in one shared place, `@supports`-gated, with the current `--jf-color-on-*` system as the fallback tier. A later layer could register `--contrast-color` via `@property` and use `@container style()` to branch into a tinted palette rather than stark black or white. Explicitly not branching on the background value itself — that relocates the per-shade combinatorial problem into CSS without solving it.

### Form input-group / addon components

A field-group container, input groups, and input addons. Shoelace's and Bootstrap's input groups are the shape to aim for. No markup contract or token plan yet.

### New components (5.x, all additive)

Each behind its own `$generate-*` flag, semantic-token-driven, logical properties, vanilla JS only where behaviour is needed, its own docs page with a keyboard table, and WCAG-clean colour pairs.

- **Pagination** — `<nav aria-label>` plus a list of page links, `aria-current="page"`, prev/next, `…` truncation. CSS only.
- **Breadcrumb** — `<nav aria-label="Breadcrumb">` plus an ordered list, separators via `::before`, last crumb `aria-current="page"`. CSS only.
- **Tabs** — the WAI-ARIA APG pattern: `<button>` tablist and panels, roving tabindex, Arrow/Home/End, Tab moves focus into the panel.
- **Dismissible callouts** — a close button plus session-scoped state keyed by the callout's `id`, so it stays gone across in-session navigation and returns next visit.
- **Tooltip** — on the popover API, with anchor positioning where available. Supplementary content only, hover and focus parity, dismissible.
- **Runtime-customisable responsive-table breakpoint** — `$table-responsive-breakpoint` is baked into media queries at build. A container-query stack switch would make it a runtime property, contingent on a custom property being usable in a container-query condition.

### `em` vs `rem` for component sizing — parked

A few component values are deliberately in `em` so they compound with their context: chip and table cell padding, and the chip font-size ratio inside a heading. Converting them wholesale to `rem` was tried and reverted — the compounding is sometimes the point, and sometimes not. Needs a per-case decision rather than a sweep.

### `%accessible-focus` as a parameterised mixin

Currently a placeholder consumed via `@extend`. Converting it to a mixin trades `@extend`'s single generated rule for per-site `@include` output — larger CSS, but immune to an unexpected minifier re-merge. Because this is the focus-ring rule, that tradeoff needs a deliberate call.

### Dark-mode polish

- `::selection` contrast on `mark` and on dark emphasis/strong sections. Already mitigated — `mark` exposes its own surface and text tokens, and the selection mix moved 15% → 20% — but worth a second look.
- Dark elevation reads soft even with the alpha boost applied. A real fix is a hairline border or larger shadow geometry, not more alpha.
- The `warning` family's `muted` role sits close to black text in dark mode. The dark role map is one flat map shared by every family. Needs a decision: move `muted` globally, add a per-family override, or accept it.
