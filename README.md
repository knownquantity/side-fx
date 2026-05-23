## side-fx

> Side effects of an agentic internet.

A newsletter that lives as a GitHub repo, a public JSON API, and a CLI. No platform, no signup wall, no tracking. The repo is the product.

---

## Subscribe

```sh
npx @knownquantity/side-effects subscribe
```

Or via email: [buttondown.email/sideeffects](https://buttondown.email/sideeffects)

## Read

```sh
npx @knownquantity/side-effects latest        # the 3 most recent issues
npx @knownquantity/side-effects read 001      # read issue 001 in your terminal
```

Or browse [`/articles`](./articles) directly.

---

## API

Side Effects is a JSON API. Three endpoints, no auth, no rate limit beyond GitHub's.

```
GET  https://raw.githubusercontent.com/knownquantity/side-effects/main/feed.json
GET  https://raw.githubusercontent.com/knownquantity/side-effects/main/articles/{slug}.md
GET  https://raw.githubusercontent.com/knownquantity/side-effects/main/tags/{tag}.json
```

Inspect endpoints from the CLI:

```sh
npx @knownquantity/side-effects api
```

### Sample response

`GET /feed.json`:

```json
{
  "title": "Side Effects",
  "description": "SFX of an agentic internet",
  "author": "Side Effects",
  "canonical_url": "https://raw.githubusercontent.com/knownquantity/side-effects/main/feed.json",
  "subscribe_url": "https://buttondown.email/sideeffects",
  "cli": "npx @knownquantity/side-effects",
  "updated": "2026-05-23",
  "version": 1,
  "articles": [
    {
      "id": 1,
      "title": "This Newsletter Is an API",
      "slug": "001-this-newsletter-is-an-api",
      "published": "2026-05-23",
      "tags": ["meta", "agents", "infrastructure"],
      "summary": "Why Side Effects ships as a GitHub repo, a JSON API, and a CLI.",
      "read_time": "3 min",
      "version": 1,
      "canonical_url": "https://raw.githubusercontent.com/knownquantity/side-effects/main/articles/001-this-newsletter-is-an-api.md"
    }
  ]
}
```

### Schema — article

| field           | type     | notes                                            |
| --------------- | -------- | ------------------------------------------------ |
| `id`            | number   | monotonic, starts at 1                           |
| `title`         | string   |                                                  |
| `slug`          | string   | `{id-padded}-{kebab-title}`                      |
| `published`     | string   | ISO date (`YYYY-MM-DD`)                          |
| `tags`          | string[] |                                                  |
| `summary`       | string   | one sentence                                     |
| `read_time`     | string   | e.g. `"3 min"`                                   |
| `version`       | number   | bumped if an article is materially revised       |
| `canonical_url` | string   | raw markdown URL on GitHub                       |

---

## Archive

| #   | Title                                                                | Date       | Tags                            |
| --- | -------------------------------------------------------------------- | ---------- | ------------------------------- |
| 001 | [This Newsletter Is an API](./articles/001-this-newsletter-is-an-api.md) | 2026-05-23 | meta, agents, infrastructure    |

---

## License

Articles: CC BY 4.0. Code: MIT.
