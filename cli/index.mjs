#!/usr/bin/env node
import chalk from 'chalk'
import ora from 'ora'
import inquirer from 'inquirer'
import fetch from 'node-fetch'

const GITHUB_USERNAME = 'knownquantity'
const REPO = 'side-effects'
const BUTTONDOWN_URL = 'https://buttondown.email/sideeffects'
const SUBSCRIBE_API = 'https://sideeffects-api.vercel.app/api/subscribe'

const RAW_BASE = `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${REPO}/main`
const FEED_URL = `${RAW_BASE}/feed.json`
const ARTICLE_URL = (slug) => `${RAW_BASE}/articles/${slug}.md`
const TAG_URL = (tag) => `${RAW_BASE}/tags/${tag}.json`

const accent = chalk.greenBright
const dim = chalk.dim
const white = chalk.white
const bold = chalk.bold
const indent = '  '

const out = (s = '') => process.stdout.write(`${indent}${s}\n`)
const divider = () => out(dim('─'.repeat(56)))
const blank = () => process.stdout.write('\n')

function header() {
  blank()
  out(`${accent('◈')} ${bold.white('SIDE EFFECTS')}`)
  out(dim('SFX of an agentic internet'))
  blank()
}

function help() {
  header()
  out(bold.white('Commands'))
  blank()
  out(`${accent('subscribe')} ${dim('[email]')}     subscribe to the newsletter`)
  out(`${accent('latest')}                  the 3 most recent issues`)
  out(`${accent('read')} ${dim('<id>')}              read an issue in the terminal`)
  out(`${accent('api')}                     show the JSON API endpoints`)
  out(`${accent('help')}                    show this message`)
  blank()
  divider()
  out(dim(`feed → ${FEED_URL}`))
  blank()
}

async function fetchFeed() {
  const spinner = ora({ text: dim('fetching feed…'), indent: 2, color: 'green' }).start()
  try {
    const res = await fetch(FEED_URL)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const feed = await res.json()
    spinner.stop()
    return feed
  } catch (err) {
    spinner.stop()
    blank()
    out(chalk.red('could not load feed.json'))
    out(dim(err.message))
    out(dim(FEED_URL))
    blank()
    process.exit(1)
  }
}

async function latest() {
  header()
  const feed = await fetchFeed()
  const articles = [...feed.articles].sort((a, b) => b.id - a.id).slice(0, 3)
  if (articles.length === 0) {
    out(dim('no articles yet.'))
    blank()
    return
  }
  for (const a of articles) {
    const id = String(a.id).padStart(3, '0')
    out(`${accent(id)}  ${bold.white(a.title)}`)
    out(`     ${dim(a.summary)}`)
    out(`     ${dim(`${a.published}  ·  ${a.read_time}  ·  ${a.tags.join(', ')}`)}`)
    out(`     ${dim(a.canonical_url)}`)
    blank()
  }
  divider()
  out(dim(`read an issue: ${accent('npx @knownquantity/side-effects read <id>')}`))
  blank()
}

function renderMarkdown(md) {
  const lines = md.split('\n')
  const inlineBold = (s) => s.replace(/\*\*(.+?)\*\*/g, (_, t) => white(t))
  const stripInline = (s) => s.replace(/`([^`]+)`/g, (_, t) => white(t))
  let inFence = false

  for (const raw of lines) {
    const line = raw.replace(/\r$/, '')

    if (line.trim().startsWith('```')) {
      inFence = !inFence
      blank()
      continue
    }
    if (inFence) {
      out(dim(`  ${line}`))
      continue
    }
    if (line.trim() === '---') {
      divider()
      continue
    }
    if (line.startsWith('# ')) {
      blank()
      out(bold.white(line.slice(2)))
      blank()
      continue
    }
    if (line.startsWith('## ')) {
      blank()
      out(accent(line.slice(3)))
      blank()
      continue
    }
    if (line.startsWith('### ')) {
      blank()
      out(white(line.slice(4)))
      continue
    }
    if (line.startsWith('> ')) {
      out(dim(`│ ${stripInline(inlineBold(line.slice(2)))}`))
      continue
    }
    if (/^\s*[-*]\s+/.test(line)) {
      const text = line.replace(/^\s*[-*]\s+/, '')
      out(`${dim('•')} ${dim(stripInline(inlineBold(text)))}`)
      continue
    }
    if (line.trim() === '') {
      blank()
      continue
    }
    out(dim(stripInline(inlineBold(line))))
  }
}

async function read(id) {
  if (!id) {
    blank()
    out(chalk.red('missing article id'))
    out(dim('usage: npx @knownquantity/side-effects read <id>'))
    blank()
    process.exit(1)
  }
  const numericId = parseInt(id, 10)
  if (Number.isNaN(numericId)) {
    blank()
    out(chalk.red(`invalid id: ${id}`))
    blank()
    process.exit(1)
  }

  header()
  const feed = await fetchFeed()
  const article = feed.articles.find((a) => a.id === numericId)
  if (!article) {
    out(chalk.red(`article ${numericId} not found.`))
    out(dim('try: npx @knownquantity/side-effects latest'))
    blank()
    process.exit(1)
  }

  const spinner = ora({ text: dim('fetching article…'), indent: 2, color: 'green' }).start()
  let md
  try {
    const res = await fetch(ARTICLE_URL(article.slug))
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    md = await res.text()
    spinner.stop()
  } catch (err) {
    spinner.stop()
    out(chalk.red('could not load article'))
    out(dim(err.message))
    blank()
    process.exit(1)
  }

  renderMarkdown(md)
  blank()
  divider()
  out(dim(`source: ${article.canonical_url}`))
  blank()
}

async function subscribe(emailArg) {
  header()
  let email = emailArg
  if (!email) {
    try {
      const answer = await inquirer.prompt([
        {
          type: 'input',
          name: 'email',
          message: `${accent('email')}`,
          prefix: ' ',
          validate: (v) => /.+@.+\..+/.test(v) || 'enter a valid email',
        },
      ])
      email = answer.email
    } catch {
      blank()
      out(dim('cancelled.'))
      blank()
      return
    }
  } else if (!/.+@.+\..+/.test(email)) {
    out(chalk.red(`invalid email: ${email}`))
    blank()
    process.exit(1)
  }

  const spinner = ora({ text: dim('subscribing…'), indent: 2, color: 'green' }).start()
  try {
    const res = await fetch(SUBSCRIBE_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, _hp: '' }),
    })
    spinner.stop()
    if (res.ok) {
      const body = await res.json().catch(() => ({}))
      if (body.ok) {
        blank()
        out(`${accent('subscribed.')} ${dim(email)}`)
        blank()
        return
      }
      blank()
      out(dim(body.message || 'already subscribed.'))
      out(dim(`also available: ${BUTTONDOWN_URL}`))
      blank()
      return
    }
    throw new Error(`HTTP ${res.status}`)
  } catch (err) {
    spinner.stop()
    blank()
    out(dim('could not reach subscribe endpoint.'))
    out(dim(err.message))
    out(`${dim('subscribe at:')} ${accent(BUTTONDOWN_URL)}`)
    blank()
  }
}

function api() {
  header()
  out(bold.white('Endpoints'))
  blank()
  out(`${accent('feed')}     ${dim(FEED_URL)}`)
  out(`${accent('article')}  ${dim(ARTICLE_URL('{slug}'))}`)
  out(`${accent('tag')}      ${dim(TAG_URL('{tag}'))}`)
  blank()
  divider()
  out(dim('no auth · no rate limit beyond GitHub · machine-readable by design'))
  blank()
}

const [, , cmd, ...rest] = process.argv

switch (cmd) {
  case undefined:
  case 'help':
  case '-h':
  case '--help':
    help()
    break
  case 'subscribe':
    await subscribe(rest[0])
    break
  case 'latest':
    await latest()
    break
  case 'read':
    await read(rest[0])
    break
  case 'api':
    api()
    break
  default:
    blank()
    out(chalk.red(`unknown command: ${cmd}`))
    out(dim('run `npx @knownquantity/side-effects help` for available commands'))
    blank()
    process.exit(1)
}
