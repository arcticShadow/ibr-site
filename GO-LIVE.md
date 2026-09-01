# Before this goes live

This site was built **without IBR's involvement**. Every fact on it came from
crawling their existing site (a 2013 copy of a 2004 site), the NZ Companies
Office, or reasonable assumption. Assume nothing here is confirmed until someone
at IBR confirms it.

Two rules while it stays a proposal:

- It must not be indexed. It carries IBR's real name, phone number and address,
  and must never compete with or be mistaken for their actual listing.
- The enquiry form must not deliver to `info@ibr.co.nz`. Nobody at IBR is
  expecting enquiries from it.

---

## 1. Verify with IBR

Nothing below is confirmed. Anything still unconfirmed at launch should be cut,
not guessed.

### Business facts

- [ ] **Years established.** The site says *"established over 25 years"*. The
      Companies Office shows Inflatable Boat Repairs Ltd incorporated
      **25 June 1997** (NZBN 9429038056680), so 25+ is defensible. But the 2004
      site already claimed *"20 years"*, which would put the start around 1984 and
      make it **40+ years** today. If that's right, say so everywhere — it is the
      single strongest claim they have and it is currently understated by a
      decade and a half.
- [ ] **Owner / director.** Companies Office lists Barry Stephen Pentecost,
      appointed Oct 1999. Is he still running it? Should he be named on the site?
      A named person materially outperforms an anonymous workshop — every
      competitor does it.
- [ ] **Phone.** `021 759 223` is taken from the old site. Confirm it's current.
      **Is there a landline?** A mobile-only number reads as a one-man operation
      to commercial and institutional buyers.
- [ ] **Email.** Confirm `info@ibr.co.nz` is monitored.
- [ ] **Opening hours.** Currently states **Mon–Fri 9am–5pm** — this was assumed,
      not confirmed. Competitors open earlier (Seafarer 7:00) and some open
      Saturdays (Dolphin). Saturday hours are worth having in season.
- [ ] **Address.** Site says *Glenfield*; the Companies Office register says
      *Wairau Valley 0627*. Confirmed as the same place — check which they'd
      rather be found under.

### Services — are these all still offered?

Every one of these is on the 2004 site and may have lapsed.

- [ ] Retubing in Hypalon and PVC. **TPU is an assumption** — the page lists it
      because competitors offer it. Remove it if IBR doesn't do it.
- [ ] Aluminium hull welding and riveting
- [ ] Fibreglass and gelcoat repair
- [ ] **Outboard servicing** — still offered?
- [ ] **Marine electronics** installation and fault-finding — still offered?
- [ ] **Trailer repairs and warrant of fitness.** Highest risk item on the site.
      A WOF requires a current NZTA vehicle-inspector appointment. **If that has
      lapsed, the trailer WOF claim must come off immediately** — it is a
      regulated activity, not a marketing line.
- [ ] **Drysuit servicing**, and specifically whether they are still service
      agents for **Musto UK/NZ** and **Line 7 NZ**. Named accreditation is a
      strong claim and must not be stale.
- [ ] Hovercraft skirts, and the AIAL rescue hovercraft air fingers
- [ ] **Project Jonah whale rescue pontoons** — still being manufactured and
      exported? Also: does Project Jonah consent to being named?
- [ ] Surf life saving IRB work — is SLSNZ happy to be referenced?
- [ ] Mobile service and collection/delivery — still running, and what's the
      coverage area?

### Claims that need an owner

- [ ] **Warranty.** The site currently makes *no* warranty claim. Seafarer
      publishes 6-year and 10-year transferable warranties and a 20-point
      pressure-test process — that is the sharpest weapon in this market and IBR
      has no answer to it. Cole's position is *Consumer Guarantees Act as the
      minimum*. Decide whether to state anything stronger; if there is a real
      workmanship guarantee, it belongs on the retubing page in bold.
- [ ] **Turnaround times.** Deliberately not stated anywhere, because guessing
      would be worse than silence. Even "most repairs inside two weeks, retubes
      three to four" would beat saying nothing.
- [ ] **Hypalon ~30 years / PVC ~7 years.** Taken verbatim from IBR's own
      existing copy. Confirm they still stand behind those figures.
- [ ] **Pricing.** No prices anywhere. Even an indicative retube range would
      qualify a lot of enquiries before they reach the phone.

## 2. Photography

Every photo on the site was recovered from the old one. They max out at
**400×267**, scanned from film, and are shown at native size in an explicitly
labelled archive gallery so they read as history rather than as current
marketing.

- [ ] Shoot current work. The priority is **before/after pairs on retubes** — it
      is the highest-value job and the one buyers most want proof of.
- [ ] Shoot the workshop and the people in it.
- [ ] Replace the archive shots on `index.html`, `retubing.html`, `repairs.html`,
      `servicing.html` and `drysuits.html` with current photography. Keep
      `work.html` as the archive.
- [ ] Add an `og:image` (1200×630) — social shares currently have no picture.

## 3. Switch it on

Do these together, at the moment of launch.

- [ ] **Remove the noindex.** It is in every page in `site/`:
      ```bash
      grep -rl 'noindex' site/ | xargs sed -i '' '/name="robots" content="noindex/d'
      grep -rl 'PRE-LAUNCH' site/*.html | xargs sed -i '' '/PRE-LAUNCH: remove this line/d'
      ```
- [ ] **Open `robots.txt`** — replace the disallow block with the two commented
      lines at the bottom of the file.
- [ ] **Connect the form.** Follow [`apps-script/README.md`](apps-script/README.md),
      then paste the `/exec` URL into `ENDPOINT` in `site/assets/js/site.js`.
      Test it end to end before announcing anything.
- [ ] **Decide on photo uploads.** The form asks people to attach photos to a
      reply rather than uploading in-form. If damage assessment by photo matters,
      that's the next thing to build.

## 4. Domain cutover

The site currently lives at `https://arcticshadow.github.io/ibr-site/`.

**Worth knowing: `ibr.co.nz` has no HTTPS at all.** Port 443 is closed — not
redirecting, closed — so `https://ibr.co.nz` times out completely and every
visitor who does get through sees "Not secure". Moving to Pages fixes this for
free.

To cut over:

1. Add a `CNAME` file containing `ibr.co.nz` to `site/`.
2. At the DNS host, replace the existing `A` record for `ibr.co.nz` with GitHub's
   four apex addresses:
   ```
   185.199.108.153
   185.199.109.153
   185.199.110.153
   185.199.111.153
   ```
   and add `AAAA` records for `2606:50c0:8000::153`, `:8001::153`, `:8002::153`,
   `:8003::153`.
3. Point `www.ibr.co.nz` at `arcticshadow.github.io` with a `CNAME` record.
   (`www` currently doesn't resolve at all.)
4. In the repo's **Settings → Pages**, set the custom domain and wait for the
   certificate, then tick **Enforce HTTPS**.
5. Update the absolute URLs in `site/sitemap.xml` and the Lighthouse URLs in
   `.github/workflows/deploy.yml`:
   ```bash
   grep -rl 'arcticshadow.github.io/ibr-site' . | xargs sed -i '' 's|https://arcticshadow.github.io/ibr-site|https://ibr.co.nz|g'
   ```
6. Keep the old host alive on HTTP with redirects for a while — `/index.html`,
   `/contact.html`, `/trailer.html`, `/repairs.html`, `/drysuit.html`,
   `/manufact.html`, `/research.html`, `/hulls.html`, `/electronics.html`,
   `/outboard.html` and `/gallery_0*.html` all currently exist and are indexed.

### Old URL → new URL

| Old | New |
|---|---|
| `/index.html`, `/index-2.html` | `/` |
| `/repairs.html` | `/repairs.html` (also covers `#hypalon`, `#pvc` → `/retubing.html`) |
| `/hulls.html` | `/repairs.html#hulls` |
| `/electronics.html` | `/servicing.html#electronics` |
| `/outboard.html` | `/servicing.html#outboards` |
| `/trailer.html` | `/servicing.html#trailers` |
| `/drysuit.html` | `/drysuits.html` |
| `/manufact.html`, `/research.html` | `/custom.html` |
| `/gallery_0*.html` | `/work.html` |
| `/contact.html` | `/contact.html` |

## 5. After launch

- [ ] Claim / update the **Google Business Profile** — for a local trade this
      drives more enquiries than the website does. Hours, photos, and reviews.
- [ ] Ask recent customers for **reviews**. RT Inflatables publishes named
      five-star testimonials and it is doing a lot of work for them.
- [ ] Update the **"current booking status"** line on the homepage as the season
      turns. It's marked `<!-- EDIT ME -->` and it's the one piece of content
      that should never go stale.
