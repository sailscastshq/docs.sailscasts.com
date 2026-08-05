---
title: Field
titleTemplate: Klean UI
description: A native Klean UI form foundation that wires labels, controls, descriptions, and errors together by convention.
outline: [2, 3]
---

<script setup>
import { computed, ref } from 'vue'
import CopyCode from '../../.vitepress/theme/components/CopyCode.vue'
import KleanInstallation from '../../.vitepress/theme/components/KleanInstallation.vue'
import KleanPreview from '../../.vitepress/theme/components/KleanPreview.vue'
import KleanButton from '../../.vitepress/theme/components/klean/Button.vue'
import KleanField from '../../.vitepress/theme/components/klean/field/Field.vue'
import KleanInput from '../../.vitepress/theme/components/klean/input/Input.vue'
import KleanTextarea from '../../.vitepress/theme/components/klean/textarea/Textarea.vue'
import fieldContextSource from '../../.vitepress/theme/components/klean/field/field-context.js?raw'
import fieldSource from '../../.vitepress/theme/components/klean/field/Field.vue?raw'
import inputSource from '../../.vitepress/theme/components/klean/input/Input.vue?raw'
import labelSource from '../../.vitepress/theme/components/klean/label/Label.vue?raw'
import textareaSource from '../../.vitepress/theme/components/klean/textarea/Textarea.vue?raw'
import usageSource from '../snippets/field/usage.vue?raw'

const email = ref('kelvin@')
const note = ref('')
const submitted = ref(false)
const emailInvalid = computed(
  () => submitted.value && !/^\S+@\S+\.\S+$/.test(email.value)
)

const fieldFiles = [
  {
    filename: 'field-context.js',
    destination: 'assets/js/components/ui/field/field-context.js',
    source: fieldContextSource
  },
  {
    filename: 'Label.vue',
    destination: 'assets/js/components/ui/label/Label.vue',
    source: labelSource
  },
  {
    filename: 'Input.vue',
    destination: 'assets/js/components/ui/input/Input.vue',
    source: inputSource
  },
  {
    filename: 'Textarea.vue',
    destination: 'assets/js/components/ui/textarea/Textarea.vue',
    source: textareaSource
  },
  {
    filename: 'Field.vue',
    destination: 'assets/js/components/ui/field/Field.vue',
    source: fieldSource
  }
]
</script>

# Field

Field is Klean UI's native form convention. One component renders the real label and messages, generates their IDs before render, and shares the native control relationship. Input and Textarea remain real controls. Label, Input, and Textarea also remain independent primitives for forms that do not use Field.

There are intentionally no `variant`, `size`, `tone`, `orientation`, floating-label, validation-rule, or theme props.

<KleanPreview id="field-usage" :source="usageSource" filename="usage.vue">
  <template #preview>
    <form
      class="grid w-full max-w-md gap-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950"
      novalidate
      @submit.prevent="submitted = true"
    >
      <KleanField
        name="email"
        label="Email address"
        description="We only use this for account messages."
        :error="emailInvalid ? 'Enter a complete email address.' : undefined"
        required
      >
        <KleanInput v-model="email" type="email" autocomplete="email" />
      </KleanField>
      <KleanField name="note" label="Internal note">
        <KleanTextarea v-model="note" rows="3" placeholder="Optional context…" />
      </KleanField>
      <KleanButton type="submit">Check form</KleanButton>
    </form>

  </template>
  <template #source>

<<< ../snippets/field/usage.vue

  </template>
  <template #caption>
    Submit once to reveal the server-style error state. Editing, validation, and
    submission remain application concerns; Field owns only the relationship.
  </template>
</KleanPreview>

## Installation

Run one command. Klean detects Vue, React, or Svelte and installs Field, Label, Input, Textarea, and their small framework context in dependency order. There is no initializer, configuration file, alias prompt, or provider.

<KleanInstallation
  id="field-installation"
  component="field"
  :source="fieldSource"
  filename="Field.vue"
  :files="fieldFiles"
/>

The command is transactional. One conflicting destination stops the complete install before mutation; a later dependency failure restores every controlled file and removes atomic-write temporary files.

## Usage

<CopyCode :code="usageSource" label="usage.vue" />

Set an explicit control ID on Field when you need one. Inside Field, the convention owns that relationship so you do not repeat matching `id` and `for` values across children.

Label, Input, and Textarea also work independently with ordinary native attributes:

```vue
<Label for="search">Search</Label>
<Input id="search" name="query" autocomplete="off" />
```

## API

| Primitive  | Behavioral inputs                                                                              |
| ---------- | ---------------------------------------------------------------------------------------------- |
| `Field`    | `id`, `name`, `label`, `description`, `error`, `invalid`, `disabled`, `required`, native attrs |
| `Label`    | native `for` when standalone, native attrs, default slot                                       |
| `Input`    | native input attrs, framework-native value binding, caller class                               |
| `Textarea` | native textarea attrs, framework-native binding, caller class                                  |

The generated relationships append caller-provided `aria-describedby` IDs rather than erasing them. Input and Textarea expose their native elements for imperative focus when recovery requires it.

## Validation ownership

The server and application own validation. Klean does not hide rules, touched state, formatting, debouncing, or submission inside the primitive.

- validate after blur or submit rather than punishing untouched fields;
- clear stale errors as soon as editing makes them obsolete;
- keep `aria-invalid` synchronized through Field's `invalid` input;
- use one form-level error summary when a failed submission needs announcement and recovery;
- do not turn every inline error into an assertive live region.

## Durable behavior

These primitives implement [Durable UI](/klean-ui/durable-ui) without creating a second form store. The application restores authoritative server data, URL state, or a local draft through the framework's normal value binding. Field reconstructs its native label, invalid state, description, and error relationships from those current inputs. Clearing an error removes its stale `aria-describedby` ID immediately.

Textarea derives its height from the current value on mount and after every value or responsive-width change. A restored draft therefore restores its presentation without Klean writing another localStorage record. Input and Textarea expose their native elements for explicit focus recovery after a failed submission.

## Styling and density

The defaults are neutral, monochrome, touch-safe, and visibly focusable. Input uses a 16px font to avoid mobile zoom. Textarea grows from its current value instead of showing the native resize handle, and recalculates when restored content or responsive width changes. Caller `h-*`, `max-h-*`, `overflow-y-auto`, or `resize-y` classes can take ownership without an `autoGrow` prop. Everything else is ordinary caller Tailwind:

```vue
<Input class="min-h-9 rounded-none border-2 py-1 text-sm shadow-none" />
```

Field exposes stable `data-slot` anatomy when its internal label or messages need application-owned styling:

```vue
<Field
  label="Email"
  :error="form.errors.email"
  class="[&_[data-slot=label]]:sr-only [&_[data-slot=field-error]]:text-amber-700"
>
  <Input v-model="form.email" type="email" />
</Field>
```

If the dense treatment repeats, create an application-owned component such as `DenseInput.vue`. Klean does not turn that product decision into a `size` prop or theme configuration.

## Accessibility contract

- Every control has a real associated Label.
- Description and error IDs are deduplicated and connected with `aria-describedby`.
- Caller ARIA and native attributes survive composition.
- Disabled and required behavior stays native.
- Error styling never replaces `aria-invalid`.
- Field's error text is descriptive, not a separate live-region announcement.
- Focus remains visible in light and dark contexts.
- Motion-reduction preferences remove decorative transitions.
