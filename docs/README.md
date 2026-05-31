# Website (`/docs`)

The Side Effects website. Static, no build step, no dependencies, no tracking —
it's another client of the JSON API: it reads `feed.json` and renders article
markdown in the browser.

The site **is a terminal** — the same surface as `npx side-effects-mag`. Type or
click commands (`latest`, `ls`, `read 003`, `subscribe`, `api`) and output streams
in below.

- `index.html` — the terminal site (self-contained: inline CSS + JS, system mono)
- `lab/panels.html` — the alternate "sticky color-panel" layout (uses the files below)
- `style.css` · `app.js` — styles + logic for the panels layout
- `assets/fonts/` — Space Grotesk (SIL OFL), used only by the panels layout

## Preview locally

```sh
cd docs
python3 -m http.server 8011
# terminal site:  http://localhost:8011
# panels layout:  http://localhost:8011/lab/panels.html
```

Data is pulled from the canonical raw `feed.json` URL (see `FEED_URL` at the top
of each page's script), so a local preview shows **published** content.

## Deploy (GitHub Pages)

Settings → Pages → Build and deployment → **Deploy from a branch** →
Branch `main`, folder **`/docs`**. No workflow, no secrets.

## Tuning

- **Terminal** (`index.html`) — palette is the `:root` vars (`--bg`, `--fg`,
  `--accent`); commands live in the `run()` switch; article formatting is in
  `renderArticle()`.
- **Panels** (`lab/panels.html` + `style.css`/`app.js`) — palette is the `TWO`
  array in `app.js` and the `:root` vars in `style.css`.
