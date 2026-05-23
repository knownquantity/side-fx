# Side Effects Magazine

An open-source magazine about the fine print on technological progress. Progress is interesting. So is everything in its wake.

---

## Subscribe

```sh
npx side-effects-mag subscribe
```

Or via email: [buttondown.email/sideeffects](https://buttondown.email/sideeffects)

## Read

```sh
npx side-effects-mag latest        # the 3 most recent issues
npx side-effects-mag read 001      # read issue 001 in your terminal
```

Or browse [`/articles`](./articles) directly.

---

## API

Side Effects is a JSON API. Three endpoints, no auth, no rate limit beyond GitHub's.

```
GET  https://raw.githubusercontent.com/1999labs/side-effects-mag/main/feed.json
GET  https://raw.githubusercontent.com/1999labs/side-effects-mag/main/articles/{slug}.md
GET  https://raw.githubusercontent.com/1999labs/side-effects-mag/main/tags/{tag}.json
```

Inspect endpoints from the CLI:

```sh
npx side-effects-mag api
```

### Sample response

`GET /feed.json`:

```json
{
  "title": "Side Effects",
  "description": "SFX of an agentic internet",
  "author": "Side Effects",
  "canonical_url": "https://raw.githubusercontent.com/1999labs/side-effects-mag/main/feed.json",
  "subscribe_url": "https://buttondown.email/sideeffects",
  "cli": "npx side-effects-mag",
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
      "canonical_url": "https://raw.githubusercontent.com/1999labs/side-effects-mag/main/articles/001-this-newsletter-is-an-api.md"
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
| 001 | [An Open-Source Magazine](./articles/001-an-open-source-magazine.md) | 2026-05-23 | meta, editorial, infrastructure |

## Contribute 

Anyone can contribute. The internet's fine print shouldn't have a single author.

Pitches are issues. Submissions are pull requests. Read [CONTRIBUTING.md](./CONTRIBUTING.md) before opening either.

---

## License

Articles: CC BY 4.0. Code: MIT.
