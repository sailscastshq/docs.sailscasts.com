import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { strict as assert } from 'node:assert'
import { join } from 'node:path'
const root = 'docs/slipway'
const fixture = JSON.parse(
  readFileSync('scripts/fixtures/slipway-cli.json', 'utf8')
)
const failures = []
const seen = new Set()
for (const name of readdirSync(root).filter((name) => name.endsWith('.md'))) {
  const text = readFileSync(join(root, name), 'utf8')
  for (const match of text.matchAll(/```[^\n]*\n([\s\S]*?)```/g)) {
    for (const line of match[1].replace(/\\\n\s*/g, ' ').split('\n')) {
      const invocation = line.match(
        /(?:^\s*(?:run: |[-] )?|&&\s)(?:\$\s)?slipway\s+([\w:-]+)(.*)/
      )
      if (!invocation) continue
      const [, command, args] = invocation
      if (command.startsWith('--')) continue
      const primary = fixture.aliases[command] || command
      const definition = fixture.commands[primary]
      if (!definition) {
        failures.push(`${name}: unsupported command ${command}`)
        continue
      }
      seen.add(primary)
      for (const flag of args.matchAll(
        /(?:^|[\s\[])(--[\w-]+|-[A-Za-z])(?=[=\s\]\)]|$)/g
      )) {
        const value = flag[1]
        const valid = value.startsWith('--')
          ? ['--help', '--version'].includes(value) ||
            value.slice(2) in definition.options
          : ['-h'].includes(value) ||
            Object.values(definition.options).some(
              (option) => `-${option.short}` === value
            )
        if (!valid)
          failures.push(`${name}: ${command} unsupported flag ${value}`)
      }
    }
  }
  for (const link of text.matchAll(
    /\]\(\/slipway\/([^\s)#]*)(?:#[^\s)]*)?\)/g
  )) {
    if (/\.(png|svg|jpg|webp)$/.test(link[1])) continue
    if (link[1] && !existsSync(join(root, `${link[1]}.md`)))
      failures.push(`${name}: broken page ${link[1]}`)
  }
}
for (const command of Object.keys(fixture.commands)) {
  if (!seen.has(command)) failures.push(`Reference omits ${command}`)
}
for (const name of ['cli.md', 'cli-commands.md', 'quest.md', 'updates.md']) {
  assert.match(
    readFileSync(join(root, name), 'utf8'),
    /unreleased/i,
    `${name} must identify unreleased capabilities`
  )
}
assert.deepEqual(failures, [], failures.join('\n'))
console.log(
  `Slipway docs: ${seen.size} registered commands covered; examples, flags, links, and availability checks passed.`
)

// Optional exact-source check: never logs in or sends a server request.
if (process.env.SLIPWAY_CLI_SOURCE) {
  const { pathToFileURL } = await import('node:url')
  const { execFileSync } = await import('node:child_process')
  const source = process.env.SLIPWAY_CLI_SOURCE
  const actual = await import(
    pathToFileURL(join(source, 'src/lib/commands.js'))
  )
  assert.deepEqual(
    actual.commands,
    fixture.commands,
    'Refresh the pinned fixture after a source contract change'
  )
  assert.deepEqual(actual.aliases, fixture.aliases)
  const help = execFileSync(
    process.execPath,
    [join(source, 'src/index.js'), '--help'],
    { encoding: 'utf8' }
  )
  for (const command of Object.keys(actual.commands))
    assert.ok(help.includes(command), `Help omits ${command}`)
  console.log(
    'Exact-source registry and global help match all 29 documented commands.'
  )
}
