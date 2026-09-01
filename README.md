# ibr.co.nz — Inflatable Boat Repairs

A replacement website for [Inflatable Boat Repairs Ltd](http://ibr.co.nz),
Glenfield, Auckland.

> **This is a proposal, not a commissioned site.** IBR have not signed it off. It
> is blocked from search engines, and the enquiry form does not deliver to their
> inbox. Read [`GO-LIVE.md`](GO-LIVE.md) before publishing any of it.

**Live preview:** <https://arcticshadow.github.io/ibr-site/>

---

## What this is

Hand-authored static HTML, CSS and JavaScript. There is **no build step, no
framework, no bundler and no `node_modules`**. What is in `site/` is exactly what
gets served — you can open `site/index.html` straight off disk and it works.

```
site/                      everything that ships
  index.html               home
  retubing.html            Hypalon / PVC / TPU, process, timing
  repairs.html             tubes, seams, valves, hulls, insurance work
  servicing.html           outboards, electronics, trailers & WOF
  custom.html              one-off builds, manufacturing, development
  drysuits.html            drysuit servicing
  work.html                photo gallery
  contact.html             phone, address, hours, enquiry form
  404.html
  robots.txt  sitemap.xml
  assets/css/site.css      the whole stylesheet
  assets/js/site.js        nav, lightbox, form  (progressive enhancement only)
  assets/img/brand/        logo + favicon (SVG)
  assets/img/archive/      photographs recovered from the old site
apps-script/               the enquiry form backend, and how to deploy it
.github/workflows/         deploy + checks
```

## Editing content

Everything is plain HTML — open the file, change the words, save.

**The header and footer are duplicated in every page.** That is the trade for
having no build system. If you change a nav link, the phone number or anything in
the footer, change it in all nine files. The quickest safe way:

```bash
grep -rl '021 759 223' site/ | xargs sed -i '' 's/021 759 223/NEW NUMBER/g'
```

Note the phone number also appears in `tel:+6421759223` links and in
`assets/js/site.js`, so search for both forms.

### Things you'll want to change often

| What | Where |
|---|---|
| Current booking / season message | `index.html`, the block marked `<!-- EDIT ME -->` |
| Opening hours | `.callbar` in every page, plus `contact.html` and the footer |
| Adding a photo | drop it in `assets/img/archive/`, copy an existing `<figure class="shot">` |
| Form questions | `contact.html`, and add the field name to `FIELDS` in `apps-script/Code.gs` |

### Adding a page

Copy the closest existing page, change the `<title>`, the `<meta name="description">`,
the `<h1>` and the body. Then move `aria-current="page"` onto the matching nav
link, and add the page to `site/sitemap.xml`.

## How deploys work

Push to `main` and it publishes. [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)
runs three jobs:

1. **check** — validates every HTML file (and the CSS) with the Nu HTML checker,
   then link-checks the site with lychee. This gates the deploy: broken markup or
   a dead link means nothing ships. It also runs on pull requests.
2. **deploy** — uploads `site/` to GitHub Pages verbatim. No compilation, no
   minification, no transformation of any kind.
3. **lighthouse** — audits the deployed pages for performance, accessibility and
   best practices. Advisory: it reports but never blocks.

Pages is configured with `build_type: workflow`, so GitHub's own Jekyll build is
not involved.

### Running it locally

```bash
python3 -m http.server 8000 --directory site
```

Then open <http://localhost:8000>. Or just double-click `site/index.html` — every
path is relative, so it works from the filesystem too.

## Browser support

Targets current evergreen browsers and leans on the platform rather than
tooling: CSS nesting, custom properties, container queries, `:has()`,
cross-document view transitions, `<dialog>`, native lazy loading and ES modules.

Degradation is deliberate rather than polyfilled:

- **No JavaScript** — every page still works. The nav renders in full (the
  collapse only engages once the script reveals the toggle), the gallery shows
  all photos inline, and the form falls back to a pre-filled `mailto:`.
- **No `:has()` or container queries** — layout falls back to the single-column
  flow rather than breaking.
- **No view transitions** — pages just navigate normally.

## Accessibility

Semantic landmarks, one `h1` per page and no skipped heading levels, a skip
link, visible focus rings on everything interactive, `aria-current` on the
active nav item, form labels wired to inputs with real error messages,
`prefers-reduced-motion` honoured, and full light/dark support. Tap targets meet
44px. The Lighthouse accessibility budget is set to fail below 95.
