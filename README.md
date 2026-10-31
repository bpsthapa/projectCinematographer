# Krishna Bahadur Thapa — portfolio

Static site: plain HTML, CSS and JavaScript. No build step, no backend.

## Deploy
Upload the whole folder (keep the structure) to any static host:
- Netlify: drag the folder onto app.netlify.com/drop
- GitHub Pages: push to a repo, enable Pages on the main branch
- Vercel / Cloudflare Pages / any shared hosting: upload as-is

`index.html` must sit at the root.

## Edit content
Everything editable lives in `js/data.js`:
- `contact` — add email, phone, WhatsApp, Facebook, Instagram. Empty fields stay hidden.
- `gallery` — to add a photo, put it in `assets/img/` and add one line.
  A smaller `-sm.jpg` thumbnail (about 720px) is optional but makes the page faster.
- `films` — titles, notes, years and poster images.
- `awards`, `quotes`, `path`, `hero` slides.

## Structure
```
index.html
css/style.css
js/data.js     <- content
js/main.js     <- behaviour and animation
assets/img/    <- photos (full + -sm thumbnails)
assets/favicon.svg
```

Fonts load from Google Fonts (Big Shoulders Display, Newsreader).
Animations switch off automatically for visitors who prefer reduced motion.
