---
title: Input
titleTemplate: Klean UI
description: A styled native Klean UI input with caller-owned form markup and Tailwind styling.
outline: [2, 3]
---

<script setup>
import { computed, ref } from 'vue'
import CopyCode from '../../.vitepress/theme/components/CopyCode.vue'
import KleanInstallation from '../../.vitepress/theme/components/KleanInstallation.vue'
import KleanPreview from '../../.vitepress/theme/components/KleanPreview.vue'
import KleanButton from '../../.vitepress/theme/components/klean/Button.vue'
import KleanInput from '../../.vitepress/theme/components/klean/input/Input.vue'
import inputSource from '../../.vitepress/theme/components/klean/input/Input.vue?raw'
import usageSource from '../snippets/input/usage.vue?raw'

const email = ref('kelvin@')
const submitted = ref(false)
const emailInvalid = computed(
  () => submitted.value && !/^\S+@\S+\.\S+$/.test(email.value)
)
</script>

# Input

Input is one styled native control. It forwards native attributes, supports framework-native value binding, exposes its element for explicit focus recovery, and merges caller Tailwind classes last.

Klean deliberately does not supply Field, Label, description, or error components. The browser's form model is the convention, so the application writes the real `<label>`, messages, IDs, and ARIA relationships where they remain visible.

<KleanPreview id="input-source" :source="inputSource" filename="Input.vue">
  <template #preview>
    <form
      class="grid w-full max-w-md gap-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950"
      novalidate
      @submit.prevent="submitted = true"
    >
      <div class="grid gap-2">
        <label for="input-demo-email" class="text-sm font-medium">
          Email address
        </label>
        <KleanInput
          id="input-demo-email"
          v-model="email"
          name="email"
          type="email"
          autocomplete="email"
          required
          :aria-invalid="emailInvalid"
          aria-describedby="input-demo-help input-demo-error"
        />
        <p id="input-demo-help" class="text-sm text-gray-600 dark:text-gray-400">
          We only use this for account messages.
        </p>
        <p
          id="input-demo-error"
          class="empty:hidden text-sm text-red-700 dark:text-red-400"
        >
          {{ emailInvalid ? 'Enter a complete email address.' : '' }}
        </p>
      </div>
      <KleanButton type="submit">Check form</KleanButton>
    </form>
  </template>
  <template #source>

<<< ../../.vitepress/theme/components/klean/input/Input.vue

  </template>
  <template #caption>
    Submit once to reveal the application-owned error.
  </template>
</KleanPreview>

## Installation

One command installs one framework-native source file. There is no initializer, configuration file, alias prompt, context provider, or Klean runtime.

<KleanInstallation
  id="input-installation"
  component="input"
  :source="inputSource"
  filename="Input.vue"
  destination="assets/js/components/ui/input/Input.vue"
/>

## Native form recipe

<CopyCode :code="usageSource" label="usage.vue" />

The application owns the visible label, deterministic IDs, help and error elements, validation timing, and submitted value. Help and error nodes keep stable IDs, so `aria-describedby` never needs conditional string building. `aria-invalid="false"` is valid, and `empty:hidden` collapses an empty error. When an error appears, the existing relationship becomes useful automatically.

This explicit repetition is smaller and clearer than a Field configuration language or accessibility helper. Extract an application-owned form composition only when your product repeats the same complete markup and policy.

## API

Input accepts native input attributes, framework-native value binding, and caller classes. It has no `variant`, `size`, `tone`, label, description, error, or validation props.

The default `type` is `text`. Native `name`, `required`, `disabled`, `autocomplete`, `aria-invalid`, and `aria-describedby` pass through unchanged.

## Styling

The neutral defaults are monochrome, touch-safe, dark-mode aware, and visibly focusable. The 16px text default avoids mobile browser zoom. Caller Tailwind wins:

```vue
<Input class="min-h-9 rounded-none border-2 py-1 text-sm shadow-none" />
```

If that dense treatment is a recurring product concept, create an application-owned `DenseInput.vue`; do not turn it into a Klean size prop.

## Accessibility contract

- Every input needs a visible associated label unless the application has a justified accessible-name alternative.
- Help and error text connect through `aria-describedby`.
- Invalid state uses `aria-invalid`; color is never the only signal.
- Stable empty errors remain unannounced until they contain useful text.
- Native required and disabled behavior stays native.
- Focus remains visible in light, dark, and high-contrast contexts.
- Validation waits for blur or submission instead of punishing untouched input.
- A failed submission that needs announcement uses one application-owned error summary and focus recovery, not `role="alert"` on every inline error.
