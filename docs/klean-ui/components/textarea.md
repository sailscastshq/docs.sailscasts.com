---
title: Textarea
titleTemplate: Klean UI
description: A styled native Klean UI textarea that grows from current content while caller Tailwind stays in control.
outline: [2, 3]
---

<script setup>
import { ref } from 'vue'
import CopyCode from '../../.vitepress/theme/components/CopyCode.vue'
import KleanInstallation from '../../.vitepress/theme/components/KleanInstallation.vue'
import KleanPreview from '../../.vitepress/theme/components/KleanPreview.vue'
import KleanTextarea from '../../.vitepress/theme/components/klean/textarea/Textarea.vue'
import textareaSource from '../../.vitepress/theme/components/klean/textarea/Textarea.vue?raw'
import usageSource from '../snippets/textarea/usage.vue?raw'

const note = ref(
  'This value represents a draft restored by the application.\n\nTextarea derives its height from the value already rendered.'
)
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
        aria-describedby="textarea-demo-help"
      />
      <p id="textarea-demo-help" class="text-sm text-gray-600 dark:text-gray-400">
        Edit the restored draft and watch the control follow its content.
      </p>
    </div>
  </template>
  <template #source>

<<< ../../.vitepress/theme/components/klean/textarea/Textarea.vue

  </template>
  <template #caption>
    Source shows the complete component, including its Tailwind defaults and
    content-derived resizing behavior.
  </template>
</KleanPreview>

## Installation

<KleanInstallation
  id="textarea-installation"
  component="textarea"
  :source="textareaSource"
  filename="Textarea.vue"
  destination="assets/js/components/ui/textarea/Textarea.vue"
/>

## Native form recipe

<CopyCode :code="usageSource" label="usage.vue" />

The surrounding label, help, error, IDs, validation, and value source remain ordinary application markup. There is no Field context or `autoGrow` switch.

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
- Keep the native `name`, `required`, `disabled`, and form behavior.
- Apply `aria-invalid` with useful visible error text.
- Do not use placeholder text as the label.
- Caller-owned fixed sizing must preserve usable content access and keyboard operation.
- Focus remains visible and decorative transitions respect reduced motion.
