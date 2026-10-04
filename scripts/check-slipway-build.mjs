import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { strict as assert } from 'node:assert'
const root = 'docs/.vitepress/dist/slipway'
const pages = new Map()
for (const file of readdirSync(root).filter((name) => name.endsWith('.html'))) {
  const html = readFileSync(join(root, file), 'utf8')
  const path = `/slipway/${file === 'index.html' ? '' : file.slice(0, -5)}`
  pages.set(path, {
    ids: new Set(
      [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1])
    ),
    links: [...html.matchAll(/<a\b[^>]*\bhref="(\/slipway\/[^"\s]*)"/g)].map(
      (match) => match[1]
    )
  })
}
let count = 0
const failures = []
for (const [page, data] of pages) {
  for (const href of data.links) {
    const [path, anchor] = href.split('#')
    const target = pages.get(path.replace(/\.html$/, ''))
    if (!target) failures.push(`${page}: missing ${href}`)
    else if (anchor && !target.ids.has(decodeURIComponent(anchor)))
      failures.push(`${page}: missing anchor ${href}`)
    count++
  }
}
assert.deepEqual(failures, [], failures.join('\n'))
console.log(
  `Rendered Slipway docs: ${pages.size} pages, ${count} links and anchors verified.`
)
