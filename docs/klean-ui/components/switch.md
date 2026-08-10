---
title: Switch
titleTemplate: Klean UI
description: A native-first Klean UI boolean switch for immediate settings across Vue, React, and Svelte.
outline: [2, 3]
---

<script setup>
import { onBeforeUnmount, ref } from 'vue'
import CopyCode from '../../.vitepress/theme/components/CopyCode.vue'
import KleanInstallation from '../../.vitepress/theme/components/KleanInstallation.vue'
import KleanPreview from '../../.vitepress/theme/components/KleanPreview.vue'
import KleanSwitch from '../../.vitepress/theme/components/klean/switch/Switch.vue'
import switchSource from '../../.vitepress/theme/components/klean/switch/Switch.vue?raw'
import reactSource from '../sources/switch/Switch.jsx?raw'
import svelteSource from '../sources/switch/Switch.svelte?raw'
import vueUsage from '../snippets/switch/usage.vue?raw'
import reactUsage from '../snippets/switch/usage.jsx?raw'
import svelteUsage from '../snippets/switch/usage.svelte?raw'

const publicRoadmap = ref(true)
const automaticDeploys = ref(false)
const saving = ref(false)
const saveError = ref('')
let rollbackTimer

function demonstrateRollback(event) {
  const next = Boolean(event.currentTarget.checked)
  const previous = !next
  saving.value = true
  saveError.value = ''

  clearTimeout(rollbackTimer)
  rollbackTimer = window.setTimeout(() => {
    automaticDeploys.value = previous
    saving.value = false
    saveError.value = 'Could not save. The previous setting was restored.'
  }, 650)
}

onBeforeUnmount(() => clearTimeout(rollbackTimer))
</script>

# Switch

Switch represents one boolean setting that takes effect immediately. It is a
real checkbox with switch semantics, so the browser keeps focus, Space and
label activation, form submission, required validation, disabled behavior, and
reset semantics in agreement with the visible state.

The common path is one Switch at the end of one labelled setting row. The
application keeps the label, description, persistence, pending state, and error
feedback in ordinary markup. There is no track, thumb, size, or colour API to
configure.

<KleanPreview id="switch-source" :source="switchSource" filename="Switch.vue">
  <template #preview>
    <div class="w-full max-w-md overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950">
      <label class="flex min-h-20 cursor-pointer items-center justify-between gap-6 px-5 py-4">
        <span>
          <span class="block text-sm font-medium">Public roadmap</span>
          <span class="mt-1 block text-sm leading-5 text-gray-500 dark:text-gray-400">
            Show planned work to customers.
          </span>
        </span>
        <KleanSwitch v-model="publicRoadmap" name="publicRoadmap" />
      </label>
      <div class="border-t border-gray-100 px-5 py-3 text-xs text-gray-500 dark:border-gray-900 dark:text-gray-400">
        Current state:
        <strong class="font-medium text-gray-950 dark:text-white">
          {{ publicRoadmap ? 'On' : 'Off' }}
        </strong>
      </div>
    </div>
  </template>
  <template #source>

<<< ../../.vitepress/theme/components/klean/switch/Switch.vue

  </template>
  <template #caption>
    The whole setting row is the label and the native checked state is the visible state.
  </template>
</KleanPreview>

## Installation

One command detects Vue, React, or Svelte and installs one framework-native
source file:

<KleanInstallation
  id="switch-installation"
  component="switch"
  :source="switchSource"
  filename="Switch.vue"
  destination="assets/js/components/ui/switch/Switch.vue"
/>

The installation creates no initializer, provider, `klean-ui.json`, alias
questionnaire, generated class helper, or Klean runtime dependency.

## Usage

### Vue

<CopyCode :code="vueUsage" label="PublicRoadmapSetting.vue" />

### React

<CopyCode :code="reactUsage" label="PublicRoadmapSetting.jsx" />

### Svelte

<CopyCode :code="svelteUsage" label="PublicRoadmapSetting.svelte" />

The binding syntax is idiomatic to each framework. Every version produces the
same native boolean control and keeps the visible setting row in application
markup.

## Switch or Checkbox?

Use Switch when changing one boolean takes effect immediately: publish a
roadmap, enable a notification channel, show a widget, or turn a release flag
on. The new state is the action and should be saved as soon as it changes.

Use [Checkbox](/klean-ui/components/checkbox) when the value belongs to a form
that is submitted later, when zero or many items may be selected, or when a
parent needs an indeterminate state. Use [Radio](/klean-ui/components/radio) for exactly one choice
from a small visible set when it becomes available.

Switch is deliberately not a Checkbox variant. The two controls share a native
checked value, but communicate different timing and intent.

## Labels and state

Give every Switch a stable visible label. Do not change “Public roadmap” to
“Hide public roadmap” when it turns on; the control already communicates on or
off. A description may explain the consequence without becoming component
configuration.

Wrapping the complete row is the tersest API and provides a generous touch
target:

```vue
<label class="flex min-h-11 cursor-pointer items-center justify-between gap-6">
  <span>
    <span class="block font-medium">Webhook delivery</span>
    <span id="webhook-help" class="text-sm text-gray-500">
      Send deployment events to the configured endpoint.
    </span>
  </span>
  <Switch
    v-model="form.webhookEnabled"
    name="webhookEnabled"
    aria-describedby="webhook-help"
  />
</label>
```

For a standalone control, target its `id` with a real `<label>`. Use
`aria-label` only when no visible text can label it.

## Saving and rollback

Switch updates the boolean immediately. The application decides whether that
value belongs in a form, local preference, URL, or server record. For an
optimistic server update:

1. Keep the previous value.
2. Show the next value immediately.
3. Prevent competing requests while the save is pending.
4. On failure, restore the previous value and explain what happened.

Try the failure path below. It intentionally restores the previous setting so
the interface never claims a value the server rejected.

<div class="my-6 overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
  <label class="flex min-h-20 cursor-pointer items-center justify-between gap-6 px-5 py-4 has-[:disabled]:cursor-not-allowed">
    <span>
      <span class="block text-sm font-medium">Automatic deploys</span>
      <span class="mt-1 block text-sm leading-5 text-gray-500 dark:text-gray-400">
        Deploy the main branch after every successful build.
      </span>
    </span>
    <KleanSwitch
      v-model="automaticDeploys"
      :disabled="saving"
      aria-describedby="automatic-deploy-status"
      @change="demonstrateRollback"
    />
  </label>
  <div id="automatic-deploy-status" class="min-h-11 border-t border-gray-100 px-5 py-3 text-sm dark:border-gray-900">
    <p v-if="saving" role="status" class="text-gray-500 dark:text-gray-400">
      Saving…
    </p>
    <p v-else-if="saveError" role="alert" class="text-red-600 dark:text-red-400">
      {{ saveError }}
    </p>
    <p v-else class="text-gray-500 dark:text-gray-400">
      Toggle to test an honest failed save.
    </p>
  </div>
</div>

Do not use optimistic state for payments, irreversible actions, or settings the
server commonly rejects. Keep the Switch disabled during a confirmed save and
show success only after the server actually accepts the change.

## Native behavior

- Tab focuses the switch and Space toggles it.
- Activating an associated label toggles it.
- A checked switch submits its `name` and `value`; an unchecked switch submits nothing.
- `required` participates in native constraint validation.
- `disabled` prevents interaction and submission.
- Form reset restores the initial checked state.
- The native `checked` state supplies switch accessibility state; do not add a separate `aria-checked` value.

Klean does not replace these behaviors with custom keyboard handlers or a
second state machine.

## API

| Purpose       | Vue                     | React                 | Svelte            |
| ------------- | ----------------------- | --------------------- | ----------------- |
| Current value | boolean `v-model`       | `checked`, `onChange` | `bind:checked`    |
| Initial value | initial model           | `defaultChecked`      | initial state     |
| Form          | native input attributes | native input props    | native attributes |
| Styling       | `class`                 | `className`           | `class`           |

The component exposes its native element for explicit focus recovery and stable
`data-slot="switch"`, `data-state`, `data-disabled`, and `data-invalid` styling
or test hooks. It has no collection values, mixed state, truthy-value mapping,
`variant`, `tone`, `size`, label, description, saving, track, thumb, or
part-class props.

## Styling

The neutral default is monochrome. Caller Tailwind merges last, including
standard `checked:*` and `after:*` utilities:

```vue
<!-- Compact operational setting -->
<Switch
  class="h-5 w-9 after:size-4 checked:after:[transform:translate(1rem,-50%)]"
/>

<!-- Product colour without a component prop -->
<Switch
  class="bg-stone-300 checked:bg-emerald-600 dark:checked:bg-emerald-400"
/>
```

When changing track height or width, adjust the thumb size and checked
translation in the same caller-owned recipe. Motion is brief by default and
becomes quicker when the user prefers reduced motion.

## Durable state

The primitive keeps native checked and reset state synchronized. Persistence
remains an application decision:

- component state for a temporary preview;
- local storage for a personal browser preference;
- the URL only when another person should reproduce the setting from a link;
- the database for a product setting that must follow the account or team.

For network-backed settings, prevent request races and pair every optimistic
change with rollback and visible error feedback.

## Related components

- [Radio](/klean-ui/components/radio) — one mutually exclusive choice rather than an immediate boolean setting.
- [Checkbox](/klean-ui/components/checkbox) — submitted choices, collections, and indeterminate selection.
- [Input](/klean-ui/components/input) — a value the user must enter rather than turn on or off.
- [Button](/klean-ui/components/button) — a command rather than persistent boolean state.
- [Toast](/klean-ui/components/toast) — brief save confirmation or rollback feedback when inline context is not better.
- [Dialog](/klean-ui/components/dialog) — confirm a consequential task; do not disguise a destructive command as a Switch.

## Complete framework source

### Vue

<CopyCode :code="switchSource" label="Switch.vue" />

### React

<CopyCode :code="reactSource" label="Switch.jsx" />

### Svelte

<CopyCode :code="svelteSource" label="Switch.svelte" />
