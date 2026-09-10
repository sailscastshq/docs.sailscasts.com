---
title: RichText
titleTemplate: Klean UI
description: Write formatted HTML or Markdown with one source-owned editor, native forms, caller-owned uploads, and framework-native Vue, React, and Svelte bindings.
outline: [2, 3]
---

<script setup>
import { ref } from 'vue'
import CopyCode from '../../.vitepress/theme/components/CopyCode.vue'
import KleanFrameworkCode from '../../.vitepress/theme/components/KleanFrameworkCode.vue'
import KleanInstallation from '../../.vitepress/theme/components/KleanInstallation.vue'
import KleanPreview from '../../.vitepress/theme/components/KleanPreview.vue'
import RichText from '../../.vitepress/theme/components/klean/rich-text/RichText.vue'
import vueSource from '../../.vitepress/theme/components/klean/rich-text/RichText.vue?raw'
import vueHelper from '../../.vitepress/theme/components/klean/rich-text/rich-text.js?raw'
import vuePopover from '../../.vitepress/theme/components/klean/popover/Popover.vue?raw'
import reactSource from '../sources/rich-text/RichText.jsx?raw'
import reactHelper from '../sources/rich-text/rich-text.react.js?raw'
import reactPopover from '../sources/popover/Popover.jsx?raw'
import svelteSource from '../sources/rich-text/RichText.svelte?raw'
import svelteHelper from '../sources/rich-text/rich-text.svelte.js?raw'
import sveltePopover from '../sources/popover/Popover.svelte?raw'
import { iconSource, icons } from '../../.vitepress/theme/components/klean/icons/icons.js'
import vueUsage from '../snippets/rich-text/usage.vue?raw'
import reactUsage from '../snippets/rich-text/usage.jsx?raw'
import svelteUsage from '../snippets/rich-text/usage.svelte?raw'
import vueMarkdown from '../snippets/rich-text/markdown.vue?raw'
import reactMarkdown from '../snippets/rich-text/markdown.jsx?raw'
import svelteMarkdown from '../snippets/rich-text/markdown.svelte?raw'
import vueToolbar from '../snippets/rich-text/toolbar.vue?raw'
import reactToolbar from '../snippets/rich-text/toolbar.jsx?raw'
import svelteToolbar from '../snippets/rich-text/toolbar.svelte?raw'
import draftExample from '../snippets/rich-text/draft.vue?raw'
import uploadExample from '../snippets/rich-text/upload.js?raw'

const abstract = ref('<h2>The work behind the demo</h2><p>Building a feature is one thing. Keeping it useful when a request fails, a tab closes, or a connection drops is another.</p><p>In this session, we will build a small application and make its most important interactions <strong>resilient by design</strong>.</p><ul><li>Recover a draft without losing the author’s work.</li><li>Keep navigation useful after a refresh.</li><li>Make failure visible and recovery straightforward.</li></ul>')
const outline = ref('## A feature that survives the real world\n\n1. Build the happy path.\n2. Interrupt it deliberately.\n3. Add recovery and prove it works.\n')
const submitted = ref('')
const reviewNote = ref('<p>A concise note with a <strong>smaller toolbar</strong>.</p>')
const commonDependencies = ['@tiptap/core', '@tiptap/pm', '@tiptap/starter-kit', '@tiptap/markdown', '@tiptap/extension-image', '@tiptap/extension-file-handler', '@tiptap/extension-placeholder', 'dompurify', 'marked', '@floating-ui/dom', 'tailwind-merge']
const frameworkSources = [
  { id: 'vue', label: 'Vue', extension: 'vue', code: vueSource, helper: vueHelper, popover: vuePopover, adapter: '@tiptap/vue-3' },
  { id: 'react', label: 'React', extension: 'jsx', code: reactSource, helper: reactHelper, popover: reactPopover, adapter: '@tiptap/react' },
  { id: 'svelte', label: 'Svelte', extension: 'svelte', code: svelteSource, helper: svelteHelper, popover: sveltePopover }
].map((framework) => ({
  ...framework,
  filename: `RichText.${framework.extension}`,
  dependencies: [...commonDependencies, ...(framework.adapter ? [framework.adapter] : [])],
  files: [
    { filename: `RichText.${framework.extension}`, destination: `assets/js/components/ui/rich-text/RichText.${framework.extension}`, source: framework.code },
    { filename: 'rich-text.js', destination: 'assets/js/components/ui/rich-text/rich-text.js', source: framework.helper },
    { filename: `Popover.${framework.extension}`, destination: `assets/js/components/ui/popover/Popover.${framework.extension}`, source: framework.popover },
    ...['link', 'image'].map((slug) => {
      const icon = icons.find((entry) => entry.slug === slug)
      const name = slug === 'link' ? 'Link' : 'Image'
      return { filename: `${name}.${framework.extension}`, destination: `assets/js/components/ui/icons/${name}.${framework.extension}`, source: iconSource(icon, framework.id) }
    })
  ]
}))
const examples = (vue, react, svelte, name) => [
  { id: 'vue', label: 'Vue', code: vue, filename: `${name}.vue` },
  { id: 'react', label: 'React', code: react, filename: `${name}.jsx` },
  { id: 'svelte', label: 'Svelte', code: svelte, filename: `${name}.svelte` }
]
const usageFrameworks = examples(vueUsage, reactUsage, svelteUsage, 'TalkAbstract')
const markdownFrameworks = examples(vueMarkdown, reactMarkdown, svelteMarkdown, 'TalkOutline')
const toolbarFrameworks = examples(vueToolbar, reactToolbar, svelteToolbar, 'ReviewNote')

function inspectSubmission(event) {
  submitted.value = String(new FormData(event.currentTarget).get('abstract') || '')
}
</script>

# RichText

Write formatted content without leaving the form. RichText gives you a compact
toolbar, visual editing, and direct access to the source. Store HTML by default,
or choose Markdown for a Markdown-backed workflow.

<KleanPreview id="rich-text-proposal" :source="vueUsage" filename="TalkAbstract.vue">
  <template #preview>
    <form class="grid w-full min-w-0 gap-3" @submit.prevent="inspectSubmission">
      <div>
        <label for="docs-talk-abstract" class="text-base font-semibold">Talk abstract</label>
        <p id="docs-talk-abstract-help" class="mt-1 text-sm text-gray-600 dark:text-gray-400">The problem, your approach, and what attendees will take away.</p>
      </div>
      <RichText id="docs-talk-abstract" v-model="abstract" name="abstract" required aria-describedby="docs-talk-abstract-help" placeholder="Start with an idea worth sharing…" />
      <button type="submit" class="min-h-11 cursor-pointer justify-self-start rounded-md bg-gray-950 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 focus-visible:outline-2 focus-visible:outline-offset-2 dark:bg-white dark:text-gray-950">Inspect form value</button>
      <details v-if="submitted" class="min-w-0 text-sm">
        <summary class="cursor-pointer font-medium">Submitted HTML</summary>
        <pre class="mt-2 max-h-48 overflow-auto whitespace-pre-wrap wrap-break-word rounded-md bg-gray-100 p-3 text-xs dark:bg-gray-900">{{ submitted }}</pre>
      </details>
    </form>
  </template>
  <template #caption>Try formatting a sentence, adding a link, or switching to Source. The form keeps one value.</template>
</KleanPreview>

## When to use

Use RichText for conference proposals, editorial descriptions, announcements,
help articles, or notes that benefit from headings, lists, links, and images.

Use [Textarea](/klean-ui/components/textarea) for plain text, code, logs, or a
short note where formatting adds no value. RichText is an authoring field, not
a page builder, collaborative document service, or code editor.

## Installation

<KleanInstallation id="rich-text-installation" component="rich-text" :frameworks="frameworkSources" />

The command installs the matching framework source and its dependencies. The
manual tab includes the editor, its helper, Popover, and the two toolbar icons.

## Usage

<KleanFrameworkCode id="rich-text-usage" :frameworks="usageFrameworks" label="RichText usage framework" />

Keep the label, help text, error message, and surrounding layout in your form.
The bound value is a string—not an editor instance or a document object.

## HTML or Markdown

`format="html"` is the default. Use `format="markdown"` when your application
stores Markdown:

<KleanPreview id="rich-text-markdown" :source="vueMarkdown" filename="TalkOutline.vue">
  <template #preview>
    <div class="grid w-full min-w-0 gap-2">
      <label for="docs-talk-outline" class="text-sm font-medium">Talk outline</label>
      <RichText id="docs-talk-outline" v-model="outline" format="markdown" name="outline" />
    </div>
  </template>
</KleanPreview>

<KleanFrameworkCode id="rich-text-markdown-usage" :frameworks="markdownFrameworks" label="Markdown framework" />

Choose the format to match the stored field. Switching between Write and Source
changes how you edit that field; it does not change its storage format.

Opening existing Markdown or switching modes does not rewrite the original
string. A genuine visual edit can normalize Markdown syntax while preserving
the supported content. If exact source syntax matters, continue in Source.

Content that the visual editor cannot preserve stays in Source with an
explanation. This includes richer Markdown extensions or HTML outside the
supported document structure. Your source is not silently reduced to fit the
toolbar.

## Forms and validation

Use ordinary `id`, `name`, `form`, `required`, `disabled`, `readonly`, and
`aria-*` attributes. React uses `readOnly`; Vue and Svelte use `readonly`.
An associated label focuses the editing surface. Native form submission includes
the current HTML or Markdown string under `name`.

```vue
<form action="/proposals" method="post">
  <label for="abstract">Talk abstract</label>
  <RichText id="abstract" v-model="abstract" name="abstract" required />
  <button type="submit">Submit proposal</button>
</form>
```

Apply your application's usual authentication and CSRF handling. Disabled
fields are not submitted; read-only fields remain part of the form.

The length limit (`maxlength`, or `maxLength` in React) counts the stored string, including HTML markup or Markdown syntax,
using the browser's UTF-16 string length. It is not a word limit or a count of
visible characters. Keep this limit consistent with the backend field and
validate it again on the server.

Connect a visible server error with `aria-describedby` and set `aria-invalid`
when that error applies. Do not use the placeholder as the label.

## Links and images

The Link control edits a selected link or creates one from the current
selection. Image insertion accepts a URL and descriptive alternative text.
Use meaningful link text and an empty image alternative only when the image
is genuinely decorative.

To upload images, pass your application's async `upload` function. It receives
`(file, { signal })` and returns `{ src, alt?, title? }`:

<CopyCode :code="uploadExample" label="uploadImage.js" language="js" />

```vue
<RichText v-model="body" :upload="uploadImage" />
```

```jsx
<RichText value={body} onValueChange={setBody} upload={uploadImage} />
```

```svelte
<RichText bind:value={body} upload={uploadImage} />
```

Honor the supplied abort signal and return a durable, server-owned image URL.
The example endpoint and file policy are application choices. Repeat file
type, size, authorization, and content checks on the server; client checks are
only feedback. Do not persist a temporary blob URL as an uploaded image.

## A toolbar that fits your application

Use the compact default toolbar for ordinary authoring. Replace it when a
workflow needs fewer actions or an application-specific arrangement:

<KleanPreview id="rich-text-custom-toolbar" :source="vueToolbar" filename="ReviewNote.vue">
  <template #preview>
    <div class="grid w-full min-w-0 gap-2">
      <label for="docs-review-note" class="text-sm font-medium">Review note</label>
      <RichText id="docs-review-note" v-model="reviewNote">
        <template #toolbar="{ editor, mode, setMode, openLink }">
          <div role="group" aria-label="Review note formatting" class="flex flex-wrap gap-1 rounded-t-xl border-b border-gray-200 p-2 *:min-h-9 *:cursor-pointer *:rounded-md *:px-3 *:text-sm *:font-medium dark:border-gray-800">
            <button type="button" :disabled="!editor?.isEditable || mode !== 'visual'" :aria-pressed="editor?.isActive('bold') || false" class="hover:bg-gray-100 aria-pressed:bg-gray-100 focus-visible:outline-2 dark:hover:bg-gray-800 dark:aria-pressed:bg-gray-800" @click="editor?.chain().focus().toggleBold().run()">Bold</button>
            <button type="button" :disabled="!editor?.isEditable || mode !== 'visual'" class="hover:bg-gray-100 focus-visible:outline-2 dark:hover:bg-gray-800" @click="openLink">Link</button>
            <button type="button" :aria-pressed="mode === 'source'" class="ms-auto hover:bg-gray-100 aria-pressed:bg-gray-100 focus-visible:outline-2 dark:hover:bg-gray-800 dark:aria-pressed:bg-gray-800" @click="setMode(mode === 'source' ? 'visual' : 'source')">Source</button>
          </div>
        </template>
      </RichText>
    </div>
  </template>
</KleanPreview>

<KleanFrameworkCode id="rich-text-toolbar" :frameworks="toolbarFrameworks" label="Custom toolbar framework" />

Vue's `toolbar` slot, React's `renderToolbar`, and Svelte's `toolbar` snippet
receive `{ editor, mode, setMode, openLink, openImage }`. `editor` is the Tiptap
editor instance. `mode` is `'visual'` (Write) or `'source'`. Use editor commands for supported document actions;
`openLink()` and `openImage()` reuse the editor's insertion controls.

Use real `button type="button"` actions, expose toggle state with
`aria-pressed`, and keep commands unavailable when the document is not editable.
If you add a floating toolbar, its placement and presentation belong to your
application's composition.

## Recoverable drafts

RichText keeps its value in your form. It does not choose a storage key, save
to a server, or silently enable browser persistence.

For substantial, non-sensitive authoring work, compose it with the existing
[Durable UI form-draft utility](/klean-ui/durable-ui#a-recoverable-form):

```bash
npx klean-ui add durable-ui
```

<CopyCode :code="draftExample" label="RecoverableProposal.vue" language="vue" />

Scope the draft key to the account, event, and record. Offer restore or discard,
retain the draft when saving fails, and clear it only after confirmed success.
Use server drafts when content is sensitive or must follow the author across
devices. Do not store private authoring content in a shareable URL.

## Styling

Use ordinary classes on the root and target named inner parts when needed:

```vue
<RichText
  v-model="abstract"
  class="rounded-xl border-dashed **:data-[slot=rich-text-content]:min-h-64 **:data-[slot=rich-text-toolbar]:bg-gray-50"
/>
```

The inner hooks are `rich-text-toolbar`, `rich-text-content`,
`rich-text-source`, `rich-text-status`, and `rich-text-tool`. React accepts
`className`; Vue and Svelte accept `class`. Keep visible focus, readable
contrast, wrapping controls, and access to long content when customizing.

## Content safety

Visual content is sanitized before it is displayed. That does not turn an
authored source string into trusted HTML, nor does viewing a value silently
replace what your application stores.

Validate and sanitize authored content on the server according to your
application's rendering policy. Render untrusted HTML or Markdown only through
that policy; do not pass the raw stored string directly to an HTML insertion
API and assume the editor has made it safe.

## Complete framework source

<KleanFrameworkCode id="rich-text-source" :frameworks="frameworkSources" label="RichText source framework" />

The installation section's manual tab includes every companion file.

## Related components

- [Textarea](/klean-ui/components/textarea) — plain multiline text without formatting.
- [Input](/klean-ui/components/input) — titles and other single-line fields.
- [FileUpload](/klean-ui/components/file-upload) — attachments that live outside the document body.
- [Popover](/klean-ui/components/popover) — focused non-modal controls alongside an editing surface.
- [Dialog](/klean-ui/components/dialog) — a separate, focused editing task when an inline form is inappropriate.
- [Toast](/klean-ui/components/toast) — report a confirmed save or upload result.
