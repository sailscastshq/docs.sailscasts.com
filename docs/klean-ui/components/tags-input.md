---
title: Tags Input
titleTemplate: Klean UI
description: A pragmatic, durable tags field for Vue, React, and Svelte with native form values, bulk paste, validation, and predictable keyboard focus.
outline: [2, 3]
---

<script setup>
import { ref } from 'vue'
import CopyCode from '../../.vitepress/theme/components/CopyCode.vue'
import KleanInstallation from '../../.vitepress/theme/components/KleanInstallation.vue'
import KleanPreview from '../../.vitepress/theme/components/KleanPreview.vue'
import KleanTagsInput from '../../.vitepress/theme/components/klean/tags-input/TagsInput.vue'
import tagsInputSource from '../../.vitepress/theme/components/klean/tags-input/TagsInput.vue?raw'
import reactSource from '../sources/tags-input/TagsInput.jsx?raw'
import svelteSource from '../sources/tags-input/TagsInput.svelte?raw'
import vueUsage from '../snippets/tags-input/usage.vue?raw'
import reactUsage from '../snippets/tags-input/usage.jsx?raw'
import svelteUsage from '../snippets/tags-input/usage.svelte?raw'
import durableUsage from '../snippets/tags-input/durable.vue?raw'

const tags = ref(['billing', 'invoice'])
const pendingTag = ref('')
const rejection = ref('')

function validateTag(tag) {
  return tag.length <= 24 || 'Keep tags to 24 characters or fewer.'
}
</script>

# Tags Input

Tags Input turns short free-form labels into one caller-owned `string[]`. It is
for expense tags, customer labels, filters, and other places where people add
several compact values rather than choose from a fixed list.

The API remains one component. Adding, removal, bulk paste, validation, form
submission, announcements, and keyboard focus do not require item, list,
remove, or input subcomponents.

<KleanPreview id="tags-input-source" :source="tagsInputSource" filename="TagsInput.vue">
  <template #preview>
    <div class="grid w-full max-w-lg gap-2">
      <label for="docs-tags" class="text-sm font-medium">Expense tags</label>
      <KleanTagsInput
        id="docs-tags"
        v-model="tags"
        v-model:draft="pendingTag"
        name="tags"
        :max="6"
        :validate="validateTag"
        aria-describedby="docs-tags-help docs-tags-rejection"
        @reject="rejection = $event.message"
      />
      <p id="docs-tags-help" class="text-sm text-gray-600 dark:text-gray-400">
        Press Enter or comma to add. Paste a comma-separated list.
      </p>
      <p
        id="docs-tags-rejection"
        class="empty:hidden text-sm text-red-700 dark:text-red-400"
      >
        {{ rejection }}
      </p>
      <output class="font-mono text-xs text-gray-500 dark:text-gray-400">
        {{ JSON.stringify(tags) }}
      </output>
    </div>
  </template>
  <template #source>

<<< ../../.vitepress/theme/components/klean/tags-input/TagsInput.vue

  </template>
  <template #caption>
    Try Enter, comma, blur, Backspace on an empty field, or a comma-separated paste.
  </template>
</KleanPreview>

## Installation

One command detects Vue, React, or Svelte and copies the framework-native
source into the application:

<KleanInstallation
  id="tags-input-installation"
  component="tags-input"
  :source="tagsInputSource"
  filename="TagsInput.vue"
  destination="assets/js/components/ui/tags-input/TagsInput.vue"
  :dependencies="['tailwind-merge']"
/>

There is no initializer, provider, `klean-ui.json`, generated class helper, or
Durable UI runtime package.

## Usage

### Vue

<CopyCode :code="vueUsage" label="ExpenseTags.vue" />

### React

<CopyCode :code="reactUsage" label="ExpenseTags.jsx" />

### Svelte

<CopyCode :code="svelteUsage" label="ExpenseTags.svelte" />

The syntax changes with the framework; the committed tags, pending draft,
native form, and interaction contract do not.

## API

| Purpose        | Vue                                                | React                          | Svelte            |
| -------------- | -------------------------------------------------- | ------------------------------ | ----------------- |
| Committed tags | `v-model`                                          | `value`, `onChange`            | `bind:value`      |
| Pending text   | `v-model:draft`                                    | `draft`, `onDraftChange`       | `bind:draft`      |
| Initial state  | model defaults                                     | `defaultValue`, `defaultDraft` | bindable defaults |
| Form           | `name`, `form`, `required`, `disabled`, `readonly` | same names; `readOnly`         | same native names |
| Policy         | `max`, `normalize`, `validate`                     | same                           | same              |
| Rejection      | `@reject`                                          | `onReject`                     | `onreject`        |
| Styling        | `class`                                            | `className`                    | `class`           |

`value` is always an array of strings. `normalize(tag)` returns the stored
string. `validate(tag, currentTags)` returns `true`, `false`, or a useful error
message. Duplicate normalized tags are rejected. `max` limits the committed
array.

Paste and blur are conventions, not configuration. A comma- or newline-separated
paste adds every valid tag in one action. Blur commits useful pending text.
Rejected, duplicate, or over-limit text remains in the editable draft so it can
be corrected instead of disappearing.

## Native form behavior

When `name` is present, each committed tag becomes one repeated form value. A
field with `name="tags"` produces `formData.getAll('tags')`. The unfinished
draft is never submitted as if it were committed.

`required` stays on the real text field until one tag exists. `disabled`
removes the field from submission. `readonly` keeps committed tags visible and
submittable while removing edit controls. A native form reset restores both the
initial tags and initial draft.

For Inertia or JSON requests, submit the caller-owned array directly. There is
no need to serialize it through a hidden comma string unless the server contract
specifically requires that shape.

## Durable form drafts

Committed tags are not the whole form state. Someone may type a useful tag,
navigate away before pressing Enter, then return. Bind the pending draft when
the application promises form restoration:

<CopyCode :code="durableUsage" label="NewExpense.vue" />

Persist the tags and draft together under the application's versioned, expiring
form-draft key. Exclude the draft from the request payload and clear it after a
successful submission. Sensitive data still does not belong in browser
storage.

Klean UI implements the applicable Durable UI behavior inside the component:
caller-owned state, correction-safe rejection, native reset, predictable focus
after removal, and clean teardown. Durable UI remains the doctrine; it is not a
second component package that applications must install.

## Keyboard and accessibility

- Give the real text field a visible associated `<label>`.
- Enter and comma commit pending text. IME composition is never committed early.
- Backspace in an empty field removes the final tag and keeps focus in the input.
- Arrow Left at the start of the input reaches the final remove button.
- Arrow keys move between remove buttons; Home reaches the first and End returns to the input.
- Delete or Backspace on a focused remove button removes that tag, then focuses the next tag, previous tag, or input.
- Every remove control is a real `type="button"` with the tag in its accessible name.
- Additions, removals, duplicates, limits, and validation failures are announced politely.
- Help and application validation messages connect through ordinary `aria-describedby` and `aria-invalid`.

The component does not invent a composite ARIA widget. It keeps a real text
input and real buttons because the browser already provides their semantics.

## Styling

`class` or `className` merges onto the field root. Klean supplies a neutral
monochrome default; caller Tailwind wins. Stable `data-part` hooks expose
`list`, `tag`, `tag-label`, `remove`, and `input` without adding part-class
props:

```vue
<TagsInput
  v-model="tags"
  class="rounded-none border-2 **:data-[part=tag]:rounded-none **:data-[part=tag]:bg-amber-100"
/>
```

There are no `variant`, `tone`, `size`, `tagClass`, `removeClass`,
`addOnBlur`, `addOnPaste`, or `allowDuplicates` props. Repeated product
treatments belong in an application-owned component, and the copied source is
the final escape hatch.

## Related components

- [Input](/klean-ui/components/input) — one arbitrary text value.
- [Select](/klean-ui/components/select) — one value from a known fixed list.
- [Combobox](/klean-ui/components/combobox) — one searchable value from suggestions.
- [Badge](/klean-ui/components/badge) — read-only status or compact metadata, not editable tags.
- [Button](/klean-ui/components/button) — form submission and ordinary actions.

## Complete framework source

### Vue

<CopyCode :code="tagsInputSource" label="TagsInput.vue" />

### React

<CopyCode :code="reactSource" label="TagsInput.jsx" />

### Svelte

<CopyCode :code="svelteSource" label="TagsInput.svelte" />
