# Krishna Bahadur Thapa — portfolio

Static site: plain HTML, CSS and JavaScript. No build step, no backend.

## Run locally
Open `index.html` in a browser, or serve the folder:
```
python3 -m http.server 8000   # then visit http://localhost:8000
```

## Deploy
Upload the whole folder (keep the structure) to any static host:
- Netlify: drag the folder onto app.netlify.com/drop
- GitHub Pages: push to a repo, enable Pages on the main branch
- Vercel / Cloudflare Pages / any shared hosting: upload as-is

`index.html` must sit at the root.

## Structure
```
index.html                 page markup (section shells; content is filled in by JS)
assets/
  icons/favicon.svg
  images/                  photos: name.jpg (full) + name-sm.jpg (~720px thumbnail)
css/
  main.css                 entry file: imports everything below, in order
  base/
    tokens.css             colours, fonts, spacing, easing (change the look here)
    base.css               reset, body, shared .h2 heading
    motion.css             reduced-motion overrides (imported last)
  components/              reusable pieces: loader, nav, cursor, button,
                           lightbox, film-effects (grain + progress), split-heading
  sections/                one file per page section: hero, about, quotes, strip,
                           films, gallery, recognition, contact, footer
js/
  data/site.js             ALL editable content (text, films, photos, awards, contact)
  core/app.js              App namespace, DOM helpers, shared scroll loop
  modules/                 one file per feature: hero, loader, about, quotes, strip,
                           films, gallery (+ lightbox), recognition, contact,
                           reveal, nav, cursor
  main.js                  boots the modules in order
```

## Edit content
Everything editable lives in `js/data/site.js`:
- `contact` — add email, phone, WhatsApp, Facebook, Instagram. Empty fields stay hidden.
- `gallery` — to add a photo, put it in `assets/images/` and add one line.
  A smaller `-sm.jpg` thumbnail (about 720px) is optional but makes the page faster.
- `films` — titles, notes, years, poster images and optional `tags` (chips on each card).
- `awards`, `quotes`, `path`, `hero` slides.

## Change the look
- Colours and fonts: `css/base/tokens.css`.
- One section's layout: its file in `css/sections/`.

## Add a new section
1. Markup: add a `<section class="name" id="name">` shell to `index.html`
   (and a nav link if it should appear in the menu).
2. Style: create `css/sections/name.css` and add an `@import` line to `css/main.css`
   (before `base/motion.css`).
3. Content: add a `name: [...]` list to `js/data/site.js` if it is data-driven.
4. Behaviour: create `js/modules/name.js` following the existing pattern:
   ```js
   (function (App) {
     "use strict";
     App.modules.name = function () {
       // read App.data.name, build DOM with App.el / App.esc,
       // use App.onScroll(fn) for scroll effects
     };
   })(window.App);
   ```
   Add its `<script>` tag in `index.html` (before `js/main.js`) and call
   `M.name();` in `js/main.js` with the other content modules.
   Add `.reveal-up` / `.split` classes to get the scroll-in animations for free.

## Notes
- Scripts are plain (non-module) files so the site also works when `index.html`
  is opened directly from disk. Load order in `index.html` matters:
  data -> core -> modules -> main.
- Fonts load from Google Fonts (Big Shoulders Display, Newsreader).
- Animations switch off automatically for visitors who prefer reduced motion.
