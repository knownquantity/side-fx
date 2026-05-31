/* Side Effects Magazine — front end.
 * The website is just another client of the JSON API: it reads feed.json,
 * builds one sticky color panel per issue, and renders article markdown in
 * the browser. No build step, no dependencies, no tracking. */

// Source of truth. Point these at the canonical raw URLs so the site works
// from anywhere (GitHub Pages, a fork, file:// behind a static server).
// For a same-repo deploy you can switch FEED_URL to "../feed.json".
const FEED_URL = "https://raw.githubusercontent.com/1999labs/side-effects-mag/main/feed.json";
const REPO_URL = "https://github.com/1999labs/side-effects-mag";

// Two-tint scheme. Panels alternate between two close light-cyan backgrounds;
// text is a near-black that carries the same cyan hue (tone-on-tone), like the
// darker-tint-of-itself text on the reference site.
const TWO = [
  { bg: "#adf7f7", fg: "#0b3a3a" },
  { bg: "#6af0f0", fg: "#093838" },
];
const colorAt = (i) => TWO[i % 2];

const stack = document.getElementById("stack");
const reader = document.getElementById("reader");
const readerBody = document.getElementById("reader-body");

let FEED = null;
let BY_SLUG = new Map();

// ── Boot ────────────────────────────────────────────────────────────────

init();

async function init() {
  try {
    const res = await fetch(FEED_URL, { cache: "no-cache" });
    if (!res.ok) throw new Error(`feed.json ${res.status}`);
    FEED = await res.json();
  } catch (err) {
    stack.innerHTML = "";
    stack.appendChild(
      panelEl(
        "panel panel--masthead",
        `<div class="panel__inner"><div class="state">Couldn't load feed.json — ${escapeHtml(
          String(err.message || err)
        )}</div></div>`
      )
    );
    return;
  }

  // newest first
  const issues = [...(FEED.articles || [])].sort(
    (a, b) => (b.id || 0) - (a.id || 0)
  );
  issues.forEach((a) => BY_SLUG.set(a.slug, a));

  render(issues);
  window.addEventListener("hashchange", route);
  route();
}

// ── Render the stack ──────────────────────────────────────────────────────

function render(issues) {
  stack.removeAttribute("aria-busy");
  stack.innerHTML = "";

  // One running index across every panel so the two colors strictly alternate.
  let idx = 0;
  stack.appendChild(masthead(colorAt(idx++)));
  issues.forEach((a) => stack.appendChild(issuePanel(a, colorAt(idx++))));
  stack.appendChild(footer(colorAt(idx++)));
}

function paint(el, color) {
  el.style.background = color.bg;
  el.style.color = color.fg;
  return el;
}

function masthead(color) {
  // First slide: just the wordmark (top-left) and the scroll-cue arrow.
  const inner = `
    <div class="panel__inner">
      <h1 class="masthead__title">Side Effects Magazine</h1>
      <span class="panel__arrow" aria-hidden="true">&darr;</span>
    </div>`;
  const el = paint(panelEl("panel panel--masthead", inner), color);
  el.id = "issues";
  return el;
}

function issuePanel(a, color) {
  const no = String(a.id).padStart(3, "0");
  const tags = (a.tags || [])
    .map((t) => `<span class="label">${escapeHtml(t)}</span>`)
    .join("");
  const inner = `
    <div class="panel__inner">
      <div class="issue__meta">
        <span class="label issue__no">Issue ${no}</span>
        <span class="label">${escapeHtml(a.published || "")}</span>
        <span class="issue__tags">${tags}</span>
      </div>
      <div class="issue__center">
        <h2 class="issue__title">${escapeHtml(a.title)}</h2>
        ${
          a.summary
            ? `<p class="issue__summary">${escapeHtml(a.summary)}</p>`
            : ""
        }
      </div>
      <div class="issue__cta">
        <span class="issue__read">${escapeHtml(a.read_time || "")}${
    a.read_time ? " read" : ""
  }</span>
        <span class="panel__arrow" aria-hidden="true">&rarr;</span>
      </div>
    </div>`;

  const el = document.createElement("a");
  el.className = "panel panel--issue";
  el.href = `#read/${encodeURIComponent(a.slug)}`;
  el.setAttribute("aria-label", `Read issue ${no}: ${a.title}`);
  el.innerHTML = inner;
  return paint(el, color);
}

function footer(color) {
  const cli = (FEED && FEED.cli) || "npx side-effects-mag";
  const inner = `
    <div class="footer__inner">
      <p class="footer__wordmark">Side Effects Magazine</p>
      <div class="footer__grid">
        <div class="footer__col">
          <h2>About</h2>
          <p class="footer__about">An open-source publication exploring frontier technologies and cultural n<sup>th</sup>-order side effects.</p>
        </div>
        <div class="footer__col">
          <h2>Subscribe</h2>
          <ul>
            <li><code>${escapeHtml(cli)} subscribe</code></li>
          </ul>
          <h2>Read</h2>
          <ul>
            <li><code>${escapeHtml(cli)} latest</code></li>
            <li><code>${escapeHtml(cli)} read 001</code></li>
          </ul>
        </div>
        <div class="footer__col">
          <h2>Inquiries</h2>
          <ul>
            <li><a href="mailto:noah@1999.wtf">noah@1999.wtf</a></li>
          </ul>
        </div>
      </div>
    </div>`;
  return paint(panelEl("panel panel--footer", inner), color);
}

function panelEl(className, html) {
  const el = document.createElement("section");
  el.className = className;
  el.innerHTML = html;
  return el;
}

// ── Reader (hash routing: #read/<slug>) ───────────────────────────────────

function route() {
  const m = location.hash.match(/^#read\/(.+)$/);
  if (m) openReader(decodeURIComponent(m[1]));
  else closeReader();
}

async function openReader(slug) {
  const a = BY_SLUG.get(slug);
  if (!a) {
    closeReader();
    return;
  }

  document.body.classList.add("is-reading");
  reader.hidden = false;
  reader.setAttribute("aria-hidden", "false");
  reader.scrollTop = 0;
  readerBody.innerHTML = `<div class="state">Loading issue ${String(
    a.id
  ).padStart(3, "0")}…</div>`;

  try {
    const url =
      a.canonical_url ||
      `${REPO_URL}/raw/main/articles/${a.slug}.md`;
    const res = await fetch(url, { cache: "no-cache" });
    if (!res.ok) throw new Error(`${res.status}`);
    const md = stripFrontMatter(await res.text());
    readerBody.innerHTML = metaHeader(a) + renderMarkdown(md);
    document.title = `${a.title} — Side Effects`;
  } catch (err) {
    readerBody.innerHTML = `<div class="state">Couldn't load this issue (${escapeHtml(
      String(err.message || err)
    )})</div>`;
  }
}

function closeReader() {
  reader.hidden = true;
  reader.setAttribute("aria-hidden", "true");
  document.body.classList.remove("is-reading");
  document.title = "Side Effects Magazine";
}

function metaHeader(a) {
  const bits = [
    a.published,
    (a.tags || []).join(" · "),
    a.read_time ? `${a.read_time} read` : "",
  ].filter(Boolean);
  return `<div class="doc-meta">${bits
    .map((b) => `<span>${escapeHtml(b)}</span>`)
    .join("")}</div>`;
}

// Articles open with a metadata block (**Published:** … then a `---` rule).
// feed.json already carries that data, so drop everything up to the first rule.
function stripFrontMatter(md) {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const head = lines.slice(0, 8).findIndex((l) => /^---+\s*$/.test(l));
  return head === -1 ? md : lines.slice(head + 1).join("\n").trim();
}

// ── Minimal, self-contained Markdown → HTML ───────────────────────────────
// Supports: headings, paragraphs, bold/italic, inline code, links, fenced
// code, ordered/unordered (loose) lists, horizontal rules. That's every
// construct the articles use — no external parser, no runtime dependency.

function renderMarkdown(md) {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  let html = "";
  let i = 0;

  const blankThen = (j, re) => {
    while (j < lines.length && /^\s*$/.test(lines[j])) j++;
    return j < lines.length && re.test(lines[j]);
  };

  while (i < lines.length) {
    const line = lines[i];

    if (/^```/.test(line)) {
      i++;
      let code = "";
      while (i < lines.length && !/^```/.test(lines[i])) code += lines[i++] + "\n";
      i++; // closing fence
      html += `<pre><code>${escapeHtml(code.replace(/\n$/, ""))}</code></pre>`;
      continue;
    }

    if (/^---+\s*$/.test(line)) { html += "<hr>"; i++; continue; }

    const h = line.match(/^(#{1,6})\s+(.*)$/);
    if (h) {
      const lvl = h[1].length;
      html += `<h${lvl}>${inline(escapeHtml(h[2].trim()))}</h${lvl}>`;
      i++;
      continue;
    }

    const ulRe = /^\s*[-*]\s+/;
    if (ulRe.test(line)) {
      html += "<ul>";
      while (i < lines.length) {
        if (ulRe.test(lines[i])) {
          html += `<li>${inline(escapeHtml(lines[i].replace(ulRe, "")))}</li>`;
          i++;
        } else if (/^\s*$/.test(lines[i]) && blankThen(i, ulRe)) {
          i++;
        } else break;
      }
      html += "</ul>";
      continue;
    }

    const olRe = /^\s*\d+\.\s+/;
    if (olRe.test(line)) {
      html += "<ol>";
      while (i < lines.length) {
        if (olRe.test(lines[i])) {
          html += `<li>${inline(escapeHtml(lines[i].replace(olRe, "")))}</li>`;
          i++;
        } else if (/^\s*$/.test(lines[i]) && blankThen(i, olRe)) {
          i++;
        } else break;
      }
      html += "</ol>";
      continue;
    }

    if (/^\s*$/.test(line)) { i++; continue; }

    // paragraph — gather following non-blank, non-block lines
    let para = line;
    i++;
    const isBlockStart = (l) =>
      /^(#{1,6}\s|```|---+\s*$)/.test(l) || ulRe.test(l) || olRe.test(l);
    while (i < lines.length && !/^\s*$/.test(lines[i]) && !isBlockStart(lines[i])) {
      para += " " + lines[i++];
    }
    html += `<p>${inline(escapeHtml(para))}</p>`;
  }

  return html;
}

// Inline spans on already-escaped text. Code first (placeholdered) so its
// contents aren't touched by bold/italic/link passes.
function inline(text) {
  const codes = [];
  text = text.replace(/`([^`]+)`/g, (_, c) => {
    codes.push(c);
    return `${codes.length - 1}`;
  });
  text = text.replace(
    /\[([^\]]+)\]\(([^)\s]+)\)/g,
    (_, t, u) => `<a href="${u}" target="_blank" rel="noopener">${t}</a>`
  );
  text = text.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  text = text.replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>");
  text = text.replace(/_([^_\n]+)_/g, "<em>$1</em>");
  text = text.replace(/(\d+)/g, (_, n) => `<code>${codes[+n]}</code>`);
  return text;
}

// ── Escaping ──────────────────────────────────────────────────────────────

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
function escapeAttr(s) {
  return escapeHtml(s).replace(/"/g, "&quot;");
}
