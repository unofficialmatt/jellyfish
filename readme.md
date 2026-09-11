# 🎐 Jellyfish UI Framework

<p>
<img src="https://img.shields.io/github/stars/unofficialmatt/jellyfish.svg?style=flat-square&logo=github"/>
<img src="https://img.shields.io/github/issues/unofficialmatt/jellyfish.svg?style=flat-square&logo=github"/>
<img src="https://img.shields.io/github/commit-activity/y/unofficialmatt/jellyfish.svg?style=flat-square&logo=github"/>
<img src="https://img.shields.io/github/last-commit/unofficialmatt/jellyfish.svg?style=flat-square&logo=github"/>
<img src="https://img.shields.io/badge/license-MIT-yellow.svg?style=flat-square"/>
</p>

Jellyfish is an SCSS + vanilla-JS front-end framework for responsive, themeable web projects. It's built to be consumed as a dependency and compiled into your own stylesheet — typically a WordPress or Drupal theme — rather than dropped in as a finished CSS file.

### [View the documentation](https://jellyfish-ui.com/)

## What's in it

- **Semantic colour system.** Declare a palette family as a single seed colour and get a full 25–1000 ramp, semantic role aliases (`subtle` / `muted` / `emphasis` / `strong`), and WCAG-checked text companions for every shade.
- **Dark mode**, on by default. Follows `prefers-color-scheme`, with a class on `<html>` to force a choice and a small JS API to persist it.
- **Design tokens** for every axis — spacing, type, line-height, radius, border, elevation, motion — as CSS custom properties, so a project can retheme at runtime without recompiling.
- **Two layout engines** sharing one class API: a 12-column CSS Grid (`.grid`) and a flex row (`.row`), plus a fluid container, full-bleed helpers and section bands.
- **Native components.** Accordions are `<details>`, modals are `<dialog>` — the browser handles focus, keyboard and Esc, and the bundled JS only adds conveniences.
- **Accessible by default.** Visible focus states, `prefers-reduced-motion` honoured throughout, forced-colors support, and a build-time linter that fails loudly on any colour pair below WCAG AA.

Modern evergreen browsers only. IE is not supported.

## Installation

```bash
npm install jellyfish-ui
```

Import the framework's layers in order, each followed by your own matching layer, so your rules land after the framework's:

```scss
@charset "UTF-8";

@import "jellyfish-ui/src/scss/abstracts/__all";
@import "my-theme/abstracts/__all";

@import "jellyfish-ui/src/scss/base/__all";
@import "my-theme/base/__all";

@import "jellyfish-ui/src/scss/layout/__all";
@import "my-theme/layout/__all";

@import "jellyfish-ui/src/scss/components/__all";
@import "my-theme/components/__all";

@import "jellyfish-ui/src/scss/themes/__all";
@import "my-theme/themes/__all";

@import "jellyfish-ui/src/scss/utilities/__all";
@import "my-theme/utilities/__all";
```

Settings are Sass `!default` variables — override them in your own `abstracts/` layer, before the framework consumes them:

```scss
$colors: ("brand": #0b7);
$font-primary: "Inter", sans-serif;
$radius-scale: ("md": 12px);
```

Many settings are also emitted as `--jf-*` custom properties, so a lot can be retuned at runtime instead:

```css
:root { --jf-container-max: 1280px; --jf-link-color: var(--jf-color-brand-emphasis); }
```

For the JS (navbar, modals, theme toggle, text-size control), include `dist/js/jellyfish.min.js` or import from `src/js/` into your own bundle.

See [Getting started](https://jellyfish-ui.com/getting-started.html) for the full setup, including the pre-paint script that restores a visitor's dark-mode choice without a flash.

## Local development

Requires Node and npm. [Gulp](https://gulpjs.com/) compiles SCSS, bundles the JS and builds the documentation site; [BrowserSync](https://www.browsersync.io/) live-reloads it.

```bash
npm install          # install dependencies
npx gulp init        # build once, then serve with live reload
npx gulp build       # build only
npx gulp             # serve only
```

The documentation site doubles as the visual test suite — build it and check your change there. Source lives in `src/docs/`; `docs/` is generated and should never be edited by hand.

## Upgrading from v4

v5 is a major release with breaking changes — custom properties are namespaced `--jf-*`, the colour system is rebuilt around semantic roles, spacing and float utilities are renamed to logical axes, and the v4 class-based accordion is gone.

The [What's new](https://jellyfish-ui.com/whats-new.html) page carries the full migration table: every removed or renamed API with what to use instead.

## Acknowledgements

A special thanks to all of the developers whose existing frameworks have provided inspiration and pointers:

- [Skeleton CSS](http://getskeleton.com/)
- [Primitive UI](https://taniarascia.github.io/primitive/)
- [Shoelace](https://www.shoelace.style/)
- [Picnic CSS](https://picnicss.com/)
- [Bulma](https://bulma.io/)
- [Bootstrap](https://getbootstrap.com/)
- [Foundation](https://get.foundation/index.html)

## Contributing

Please feel free to fork, comment, critique, or submit a pull request.

## Author

- [Matt Weet](https://www.mattweet.com)

## License

This project is open source and available under the [MIT License](license.md).
