# Website (`/docs`)

The Side Effects website. Static, no build step, no dependencies, no tracking —
it's another client of the JSON API: it reads `feed.json` and renders article
markdown in the browser.

- `index.html` — shell + `<noscript>` fallback
- `style.css` — sticky color-panel layout (ink/paper, one muted accent per issue)
- `app.js` — fetches the feed, builds one panel per issue, in-browser markdown reader

## Preview locally

```sh
cd docs
python3 -m http.server 8011
# open http://localhost:8011
```

Data is pulled from the canonical raw URLs (see `FEED_URL` in `app.js`), so the
local preview shows **published** content. To preview local edits instead, point
`FEED_URL` at `../feed.json` and serve from the repo root.

## Deploy (GitHub Pages)

Settings → Pages → Build and deployment → **Deploy from a branch** →
Branch `main`, folder **`/docs`**. No workflow, no secrets.

## Tuning the design

- **Palette** — `:root` vars in `style.css` (`--paper`, `--ink`, `--signal`) and
  the `ACCENTS` array in `app.js` (one `{bg, fg}` per issue; index 0 is the
  newest "headline" issue).
- **Type scale** — the `clamp()` values on `.masthead__title` / `.issue__title`.
- **Fonts** — pure system stacks (`--font-display`, `--font-serif`, `--font-mono`).
  Swap in a webfont here if you want a custom display face.
