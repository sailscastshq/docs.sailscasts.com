import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'

test('Klean keeps the shared theme, native navigation, and original introduction composition', async () => {
  const theme = await readFile(
    new URL('../../index.js', import.meta.url),
    'utf8'
  )
  const config = await readFile(
    new URL('../../../config.mjs', import.meta.url),
    'utf8'
  )
  const introduction = await readFile(
    new URL('../../../../klean-ui/index.md', import.meta.url),
    'utf8'
  )
  const overview = await readFile(
    new URL('../../../../klean-ui/components/index.md', import.meta.url),
    'utf8'
  )
  assert.match(theme, /extends: DefaultTheme/)
  assert.doesNotMatch(theme, /KleanLayout|klean-docs\.css|Layout:/)
  assert.match(config, /search: \{ provider: 'local' \}/)
  assert.doesNotMatch(config, /kleanNavigation|componentGroups/)
  assert.match(introduction, /^# Klean UI$/m)
  for (const section of [
    'Installation',
    'The contract',
    'Start with Button',
    'Make it yours'
  ]) {
    assert.ok(introduction.includes(`## ${section}`))
  }
  assert.doesNotMatch(
    introduction,
    /KleanWelcome|class="klean-intro|klean-start-grid|<style/
  )
  assert.doesNotMatch(overview, /KleanCatalog|klean-catalog|type="search"/)
})
