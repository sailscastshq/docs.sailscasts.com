import assert from 'node:assert/strict'
import { readdir } from 'node:fs/promises'
import { test } from 'node:test'
import {
  componentGroups,
  components,
  filterComponents
} from '../../../kleanNavigation.mjs'

test('navigation and directory cover every published component exactly once', async () => {
  const directory = new URL('../../../../klean-ui/components/', import.meta.url)
  const pages = (await readdir(directory))
    .filter((name) => name.endsWith('.md') && name !== 'index.md')
    .map((name) => name.slice(0, -3))
  assert.deepEqual(components.map(({ slug }) => slug).sort(), pages.sort())
  assert.equal(
    new Set(components.map(({ slug }) => slug)).size,
    components.length
  )
  assert.ok(components.every(({ name, description }) => name && description))
})

test('directory search is case-insensitive, trims whitespace, and searches purpose', () => {
  assert.deepEqual(
    filterComponents('  bUtToN  ').map(({ slug }) => slug),
    ['button']
  )
  assert.ok(filterComponents('keyboard').some(({ slug }) => slug === 'tabs'))
  assert.equal(filterComponents('').length, components.length)
})

test('category filtering composes with text search and supports no results', () => {
  for (const group of componentGroups) {
    assert.equal(filterComponents('', group.title).length, group.items.length)
  }
  assert.deepEqual(filterComponents('button', 'Dates and time'), [])
  assert.deepEqual(filterComponents('does-not-exist'), [])
  assert.equal(filterComponents('date', 'Dates and time').length, 4)
})
