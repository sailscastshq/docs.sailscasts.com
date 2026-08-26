---
title: Textarea
titleTemplate: Klean UI
description: A styled native Klean UI textarea for Vue, React, and Svelte that grows from current content while caller Tailwind stays in control.
outline: [2, 3]
---

<script setup>
import { ref } from 'vue'
import KleanFrameworkCode from '../../.vitepress/theme/components/KleanFrameworkCode.vue'
import KleanInstallation from '../../.vitepress/theme/components/KleanInstallation.vue'
import KleanPreview from '../../.vitepress/theme/components/KleanPreview.vue'
import KleanTextarea from '../../.vitepress/theme/components/klean/textarea/Textarea.vue'
import textareaSource from '../../.vitepress/theme/components/klean/textarea/Textarea.vue?raw'
import reactSource from '../sources/textarea/Textarea.jsx?raw'
import svelteSource from '../sources/textarea/Textarea.svelte?raw'
import vueUsage from '../snippets/textarea/usage.vue?raw'
import reactUsage from '../snippets/textarea/usage.jsx?raw'
import svelteUsage from '../snippets/textarea/usage.svelte?raw'

const textareaFrameworks = [
  {
    id: 'vue',
    label: 'Vue',
    code: textareaSource,
    filename: 'Textarea.vue',
    destination: 'assets/js/components/ui/textarea/Textarea.vue'
  },
  {
    id: 'react',
    label: 'React',
    code: reactSource,
    filename: 'Textarea.jsx',
    destination: 'assets/js/components/ui/textarea/Textarea.jsx'
  },
  {
    id: 'svelte',
    label: 'Svelte',
    code: svelteSource,
    filename: 'Textarea.svelte',
    destination: 'assets/js/components/ui/textarea/Textarea.svelte'
  }
]

const textareaUsage = [
  { id: 'vue', label: 'Vue', code: vueUsage, filename: 'NoteField.vue' },
  { id: 'react', label: 'React', code: reactUsage, filename: 'NoteField.jsx' },
  { id: 'svelte', label: 'Svelte', code: svelteUsage, filename: 'NoteField.svelte' }
]

const note = ref(
  'This value represents a draft restored by the application.\n\nTextarea derives its height from the value already rendered.'
)
const noteError = ref('')
</script>

# Textarea

Textarea is a styled native control with one durable behavior: its presentation is derived from the value it currently renders and its responsive width. Restored and controlled values therefore receive the right height without a second persistence layer.

<KleanPreview id="textarea-source" :source="textareaSource" filename="Textarea.vue">
  <template #preview>
    <div class="grid w-full max-w-lg gap-2">
      <label for="textarea-demo-note" class="text-sm font-medium">
        Internal note
      </label>
      <KleanTextarea
        id="textarea-demo-note"
        v-model="note"
        name="note"
        rows="3"
        :aria-invalid="Boolean(noteError)"
        aria-describedby="textarea-demo-help textarea-demo-error"
      />
      <p id="textarea-demo-help" class="text-sm text-gray-600 dark:text-gray-400">
        Edit the restored draft and watch the control follow its content.
      </p>
      <p
        id="textarea-demo-error"
        class="empty:hidden text-sm text-red-700 dark:text-red-400"
      >
        {{ noteError }}
      </p>
    </div>
  </template>
  <template #source>

<<< ../../.vitepress/theme/components/klean/textarea/Textarea.vue

  </template>
</KleanPreview>

## Installation

<KleanInstallation
  id="textarea-installation"
  component="textarea"
  :frameworks="textareaFrameworks"
/>

## Native form recipe

<KleanFrameworkCode
  id="textarea-usage"
  :frameworks="textareaUsage"
  label="Textarea usage framework"
/>

The surrounding label, help, error, IDs, validation, and value source remain ordinary application markup. Keep help and error nodes stable, bind `aria-invalid` to the boolean error state, and hide an empty error with `empty:hidden`. There is no Field context, accessibility helper, or `autoGrow` switch.

## Durable resizing

Textarea measures after mount and after its current value changes. It also observes width changes because responsive wrapping changes content height. This covers server data, URL state, and application-owned restored drafts without writing localStorage itself.

Content-derived height is the default contract, not a feature flag. Caller Tailwind can still replace it:

```vue
<Textarea class="h-40 resize-y overflow-y-auto" />
```

Because caller classes merge last, this removes the derived height, hidden overflow, and fixed-resize defaults cleanly.

## API

Textarea accepts native textarea attributes, framework-native value binding, and caller classes. It exposes its native element for explicit focus recovery. It has no `variant`, `size`, `autoGrow`, label, description, error, or validation props.

## Accessibility contract

- Use a real associated label and connect help or error text explicitly.
- Keep description IDs stable instead of rebuilding them when an error changes.
- Keep the native `name`, `required`, `disabled`, and form behavior.
- Apply `aria-invalid` with useful visible error text.
- Do not use placeholder text as the label.
- Caller-owned fixed sizing must preserve usable content access and keyboard operation.
- Focus remains visible and decorative transitions respect reduced motion.

## Complete framework source

The live preview demonstrates the shared native and content-derived sizing contract. Copy the complete framework-native source for your application:

<KleanFrameworkCode
  id="textarea-complete-source"
  :frameworks="textareaFrameworks"
  label="Textarea source framework"
/>

## Related components

- [Input](/klean-ui/components/input) — single-line native input.
- [Button](/klean-ui/components/button) — submit or act on form data.
- [Toast](/klean-ui/components/toast) — announce the result after a draft is saved.
- [Dialog](/klean-ui/components/dialog) — compose a focused modal editing task when inline space is inappropriate.
