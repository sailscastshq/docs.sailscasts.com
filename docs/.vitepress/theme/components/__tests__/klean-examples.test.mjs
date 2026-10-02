import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'
import { build } from 'esbuild'
import { parse, compileScript } from 'vue/compiler-sfc'
import { createSSRApp, h } from 'vue'
import { renderToString } from '@vue/server-renderer'

const directory = path.dirname(fileURLToPath(import.meta.url))
const componentsDirectory = path.resolve(directory, '..')

// Exercise the actual SFCs in Vue's server renderer without a browser or a
// second test framework. Styles are checked by the documentation build.
const result = await build({
  stdin: {
    contents: ['KleanPreview', 'KleanInstallation', 'CopyCode']
      .map((name) => `export { default as ${name} } from './${name}.vue'`)
      .join('\n'),
    resolveDir: componentsDirectory
  },
  bundle: true,
  write: false,
  format: 'cjs',
  platform: 'node',
  external: ['vue', '@vue/server-renderer', 'shiki'],
  plugins: [
    {
      name: 'compile-vue-for-tests',
      setup(builder) {
        builder.onLoad({ filter: /\.vue$/ }, async ({ path: filename }) => {
          const { descriptor, errors } = parse(
            await readFile(filename, 'utf8'),
            {
              filename
            }
          )
          assert.deepEqual(errors, [])
          const compiled = compileScript(descriptor, {
            id: path.basename(filename, '.vue'),
            inlineTemplate: true,
            templateOptions: { ssr: true }
          })
          return {
            contents: compiled.content,
            resolveDir: path.dirname(filename)
          }
        })
        builder.onResolve(
          { filter: /\.css\?inline$/ },
          ({ path: filename }) => ({
            path: filename,
            namespace: 'inline-css'
          })
        )
        builder.onLoad({ filter: /.*/, namespace: 'inline-css' }, () => ({
          contents: 'export default ""'
        }))
      }
    }
  ]
})

const module = { exports: {} }
new Function('module', 'exports', 'require', result.outputFiles[0].text)(
  module,
  module.exports,
  createRequire(import.meta.url)
)
const { KleanPreview, KleanInstallation, CopyCode } = module.exports

function render(component, props, slots) {
  return renderToString(
    createSSRApp({ render: () => h(component, props, slots) })
  )
}

test('legacy preview retains source and caption behind a closed disclosure', async () => {
  const html = await render(
    KleanPreview,
    {
      id: 'legacy-preview',
      source: '<button>Continue</button>',
      filename: 'Button.vue'
    },
    { caption: () => 'Application-owned styling.' }
  )
  assert.match(html, /Live · Vue/)
  assert.match(html, /<details class="klean-preview__source"[^>]*>/)
  assert.doesNotMatch(html, /<details[^>]*\bopen(?:[ =>])/)
  assert.match(html, /&lt;button&gt;Continue&lt;\/button&gt;/)
  assert.match(html, /Application-owned styling\./)
  assert.match(html, /aria-controls="legacy-preview-source-code"/)
  assert.doesNotMatch(html, /class="klean-preview__usage"/)
})

test('usage and pre-highlighted source slots preserve native markup', async () => {
  const html = await render(
    KleanPreview,
    { id: 'usage-preview', source: 'canonical source', filename: 'Button.vue' },
    {
      usage: () =>
        h('div', { class: 'vp-code-group' }, 'Native framework code group'),
      source: () =>
        h('pre', { class: 'vp-code' }, 'Highlighted canonical source')
    }
  )
  assert.match(html, /class="klean-preview__usage"/)
  assert.match(html, /class="klean-preview__usage-label"[^>]*>Usage</)
  assert.match(html, /class="vp-code-group"/)
  assert.match(html, /Highlighted canonical source/)
  assert.equal((html.match(/aria-label="Copy Button\.vue"/g) ?? []).length, 1)
  assert.ok(
    html.indexOf('klean-preview__canvas') < html.indexOf('vp-code-group')
  )
  assert.ok(
    html.indexOf('vp-code-group') < html.indexOf('klean-preview__source"')
  )
})

test('CLI provides all package managers without rendering manual source by default', async () => {
  const html = await render(KleanInstallation, {
    id: 'cli-installation',
    component: 'button',
    source: 'private-manual-render-marker'
  })
  for (const command of [
    'npx klean-ui add button',
    'pnpm dlx klean-ui add button',
    'yarn dlx klean-ui add button',
    'bunx klean-ui add button'
  ]) {
    assert.ok(html.includes(command))
  }
  assert.match(html, /Source you own/)
  assert.match(html, /id="cli-installation-manual-panel"/)
  assert.doesNotMatch(html, /private-manual-render-marker/)
  assert.match(
    html,
    /aria-selected="true"[^>]*aria-controls="cli-installation-command-panel"[^>]*tabindex="0"/
  )
})

test('manual installation honors framework-specific empty dependencies', async () => {
  const html = await render(KleanInstallation, {
    id: 'manual-installation',
    commandAvailable: false,
    dependencies: ['tailwind-merge'],
    frameworks: [
      {
        id: 'react',
        label: 'React',
        filename: 'Icon.jsx',
        destination: 'assets/js/components/ui/Icon.jsx',
        code: 'export default Icon',
        dependencies: []
      }
    ]
  })
  assert.doesNotMatch(html, /Install direct dependencies/)
  assert.doesNotMatch(html, /npm install/)
  assert.match(html, /assets\/js\/components\/ui\/Icon\.jsx/)
  assert.match(html, /export default Icon/)
  assert.match(html, /View and copy source/)
  assert.doesNotMatch(html, /id="manual-installation-command-tab"/)
})

test('manual installation honors framework dependencies when default is empty', async () => {
  const html = await render(KleanInstallation, {
    id: 'framework-dependencies',
    commandAvailable: false,
    dependencies: [],
    frameworks: [
      {
        id: 'vue',
        label: 'Vue',
        files: [
          {
            filename: 'Editor.vue',
            destination: 'ui/Editor.vue',
            source: '<template />'
          }
        ],
        dependencies: ['@tiptap/vue-3']
      }
    ]
  })
  assert.match(html, /npm install @tiptap\/vue-3/)
  assert.match(html, /Add Editor\.vue/)
})

test('CopyCode escapes raw source and exposes a named, keyboard-accessible copy action', async () => {
  const html = await render(CopyCode, {
    label: 'Example.vue',
    code: '<script>alert("example")</script>'
  })
  assert.match(html, /&lt;script&gt;/)
  assert.doesNotMatch(html, /<script>/)
  assert.match(
    html,
    /<button type="button" class="copy-code__button" aria-label="Copy Example\.vue"/
  )
  assert.match(html, /<pre tabindex="0" aria-label="Example\.vue code"/)
  assert.match(html, /role="status" aria-live="polite"/)
})

test('all installation tab controls reference present panels with unique ids', async () => {
  for (const commandAvailable of [true, false]) {
    const html = await render(KleanInstallation, {
      id: commandAvailable ? 'cli-tabs' : 'manual-tabs',
      commandAvailable,
      frameworks: ['vue', 'react', 'svelte'].map((id) => ({
        id,
        label: id,
        filename: `${id}.txt`,
        destination: `ui/${id}.txt`,
        source: `${id} source`
      }))
    })
    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1])
    assert.equal(new Set(ids).size, ids.length)
    for (const [, target] of html.matchAll(/aria-controls="([^"]+)"/g)) {
      assert.ok(ids.includes(target), `Missing target panel: ${target}`)
    }
  }
})

test('framework and method selectors retain their keyboard and persisted-selection contracts', async () => {
  const source = await readFile(
    path.join(componentsDirectory, 'KleanInstallation.vue'),
    'utf8'
  )
  assert.match(source, /useKleanFramework\(frameworkOptions\)/)
  for (const key of ['ArrowRight', 'ArrowLeft', 'Home', 'End']) {
    assert.ok(source.includes(`event.key === '${key}'`))
  }
  assert.match(source, /event\.preventDefault\(\)/)
  assert.match(source, /await nextTick\(\)/)
  assert.match(source, /\?\.focus\(\)/)
  assert.match(
    source,
    /@keydown="handleTabKeydown\(\$event, index, methods, selectMethod\)"/
  )
})
