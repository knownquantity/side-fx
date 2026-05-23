**Published:** 2026-05-23
**Tags:** meta, agents, infrastructure
**Read time:** 3 min

---

# This Newsletter Is an API

Most newsletters are designed for one reader: a human with an inbox. Side Effects is designed for two — humans, and the agents reading on their behalf.

That distinction matters more every month. The fastest-growing class of internet consumer is no longer a person scrolling, but a model fetching. Coding agents pull docs. Research agents pull articles. Personal agents pull whatever their owner asked them to track. The publishing tools we have were not built for that audience. Substack renders a webpage. Beehiiv renders a webpage. Even RSS, the most agent-friendly format we have, was retrofitted onto a format built for browsers.

So Side Effects starts somewhere else: the repo is the product.

## Why GitHub

A newsletter is, mechanically, a list of posts with metadata. That is a thing git already stores well. Articles live in `/articles` as plain markdown. Metadata lives in `feed.json`. Tags live in `/tags`. History lives in commits. There is no CMS, no database, no dashboard. If you can read a directory, you can read the publication. If you can `git clone`, you have a full backup.

GitHub also gives us a free CDN. Every article has a raw URL anyone can `curl`. Every change is versioned. Every issue and PR is a comment thread. The platform we already use to ship software turns out to be a pretty good platform to ship writing, too.

## Why the JSON API

`feed.json` is the index. It looks like this:

```
GET /feed.json          → the full archive
GET /articles/{slug}.md → the raw markdown
GET /tags/{tag}.json    → posts tagged X
```

No auth. No rate limit beyond GitHub's. No tracking pixels. An agent can subscribe by polling `feed.json` and diffing the `updated` timestamp. A reader can build their own client in an afternoon. A researcher can train on the whole corpus with one `wget`.

The bet is that machine-readable content becomes table stakes. The websites that thrive in an agentic internet will be the ones whose content survives being parsed, summarized, and re-rendered by something other than a browser. Plain markdown over a documented JSON schema is the cheapest way to be that website.

## Why the CLI

There is a sub-bet, too: that some readers will prefer to read in the terminal where they already spend the day.

```
npx @knownquantity/side-effects subscribe
npx @knownquantity/side-effects latest
npx @knownquantity/side-effects read 001
```

The CLI is thin — it just talks to the same JSON API anyone else can hit. But it makes the publication feel like a tool, not a destination. You don't go to Side Effects. You call it.

## What's next

Future issues will cover the side effects of the shift already underway: what changes when agents are the dominant readers, the dominant writers, the dominant buyers. What new primitives that pulls into existence. What old ones it strands.

Subscribe however you like. The repo is the product.
