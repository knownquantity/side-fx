**Published:** 2026-05-23
**Tags:** Technology, Culture
**Read time:** 4 min

---

# An Open-Source Magazine

Every new technology generates two conversations. The first is what it can do. The second is what follows. This magazine is for the second one.

The premise is that technological progress generates a layer of consequences that's reliably underreported — not because the consequences are hidden, but because reporting on them requires a posture that's out of fashion. 

Progress is interesting. It is also, almost always, accompanied by displacement, friction, externalities, dependencies, and long-tail outcomes that fit neither celebration nor alarm. The publications that cover the first conversation well are abundant. The publications that take the second one seriously, on its own terms, without sliding into nostalgia or doomerism, are not.

That's the editorial bet. The structural bet is more unusual: this magazine is also a public GitHub repo.

## Why the repo is the magazine

Three claims that may sound separate but turn out to be the same claim.

**Editorial process should be observable.** A magazine is, in the end, a set of choices about what to publish, what to revise, and what to reject. Those choices are usually invisible. Here, they're commits. Issues are pitches. Pull requests are submissions. Code review is editorial review. Every revision is logged forever. The contributor graph is the masthead. None of this is metaphor; the substrate is the same as the editorial process because it *is* the editorial process.

**Publishing infrastructure should be commodity, not platform.** Substack renders a webpage. Beehiiv renders a webpage. Side Effects is a folder of markdown files, a single JSON file describing the archive, and a small CLI that reads both. The website you're reading right now is GitHub. The API is `feed.json`. The CDN is `raw.githubusercontent.com`. The whole stack is something a competent developer could rebuild in an afternoon — which is the point.

**Content should be machine-readable by default.** The fastest-growing class of internet reader is no longer a person scrolling, but a model fetching. Coding agents pull docs. Research agents pull articles. Personal agents pull whatever their owner asked them to track. A magazine published as plain markdown over a documented JSON schema is a magazine that survives whatever the agentic internet turns out to be — and gives the agents reading on someone's behalf the dignity of a real source rather than a scraped one.

## How to read it

In a browser: open the [/articles](./articles) directory of this repo.

In a terminal:

```sh
npx side-effects-mag latest
npx side-effects-mag read 001
```

By email: `npx side-effects-mag subscribe`, or the [signup page](https://buttondown.email/sideeffects).

By API: `https://raw.githubusercontent.com/1999labs/side-effects-mag/main/feed.json`. No auth, no rate limit beyond GitHub's, no tracking.

## How to write for it

Pitches are issues. Open one with the pitch template and we'll respond within seven days. Submissions are pull requests. Read [CONTRIBUTING.md](./CONTRIBUTING.md) before opening either — it's short.

## What's next

This is issue 001, which means the magazine exists and the rails are built. Issue 002 is the first article — something specific about a specific consequence of a specific technology. We're already reading pitches.

The repo is the product. Everything else follows from that.
