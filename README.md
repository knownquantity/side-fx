# Side Effects Magazine

![side-fx-mag logo](side-effects-mag.png)

An open-source publication exploring frontier technologies and their cultural n^th-order side effects.

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
  "title": "Side Effects Magazine",
  "description": "",
  "author": "Side Effects Magazine",
  "canonical_url": "https://raw.githubusercontent.com/1999labs/side-effects-mag/main/feed.json",
  "subscribe_url": "https://buttondown.email/sideeffects",
  "cli": "npx side-effects-mag",
  "updated": "2026-05-23",
  "version": 1,
  "articles": [
    {
      "id": 1,
      "title": "An Open-Source Magazine",
      "slug": "001-an-open-source-magazine",
      "published": "2026-05-23",
      "tags": ["Technology", "Culture"],
      "summary": "A magazine about the fine print on technological progress, published as a public GitHub repo where the editorial process is part of the publication.",
      "read_time": "4 min",
      "version": 1,
      "canonical_url": "https://raw.githubusercontent.com/1999labs/side-effects-mag/main/articles/001-an-open-source-magazine.md"
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
| 001 | [An Open-Source Magazine](./articles/001-an-open-source-magazine.md) | 2026-05-23 | Technology, Culture |

## Contribute 

Anyone can contribute. The internet's fine print shouldn't have a single author.

Pitches are issues. Submissions are pull requests. Read [CONTRIBUTING.md](./CONTRIBUTING.md) before opening either.

---

## License

Articles: CC BY 4.0. Code: MIT.
