---
title: Spinner
titleTemplate: Klean UI
description: A calm, accessible loading wrapper for Vue, React, and Svelte with a neutral fallback and product-owned marks.
outline: [2, 3]
---

<script setup>
import { onBeforeUnmount, ref } from 'vue'
import CopyCode from '../../.vitepress/theme/components/CopyCode.vue'
import KleanInstallation from '../../.vitepress/theme/components/KleanInstallation.vue'
import KleanPreview from '../../.vitepress/theme/components/KleanPreview.vue'
import KleanButton from '../../.vitepress/theme/components/klean/Button.vue'
import ProductLoader from '../../.vitepress/theme/components/klean/spinner/ProductLoader.vue'
import KleanSpinner from '../../.vitepress/theme/components/klean/spinner/Spinner.vue'
import spinnerSource from '../../.vitepress/theme/components/klean/spinner/Spinner.vue?raw'
import reactSource from '../sources/spinner/Spinner.jsx?raw'
import svelteSource from '../sources/spinner/Spinner.svelte?raw'
import vueUsage from '../snippets/spinner/usage.vue?raw'
import reactUsage from '../snippets/spinner/usage.jsx?raw'
import svelteUsage from '../snippets/spinner/usage.svelte?raw'
import customUsage from '../snippets/spinner/custom.vue?raw'
import stylingUsage from '../snippets/spinner/styling.vue?raw'

const loading = ref(false)
const message = ref('Ready to refresh.')
let finishTimer

function refresh() {
  if (loading.value) return

  loading.value = true
  message.value = 'Refreshing deployments…'
  clearTimeout(finishTimer)
  finishTimer = setTimeout(() => {
    loading.value = false
    message.value = 'Deployments are up to date.'
  }, 2400)
}

onBeforeUnmount(() => clearTimeout(finishTimer))
</script>

# Spinner

Spinner is a small decorative wrapper for indeterminate work. It includes a neutral fallback ring, accepts an application-owned loading mark, inherits the caller's text color, and leaves loading state and meaningful language with the application.

<KleanPreview id="spinner-source" :source="spinnerSource" filename="Spinner.vue">
  <template #preview>
    <section
      class="grid min-h-64 w-full place-items-center rounded-xl bg-gray-950 p-6 text-white"
      :aria-busy="loading"
      aria-describedby="spinner-preview-status"
    >
      <div class="grid justify-items-center gap-5 text-center">
        <div>
          <h2 class="font-semibold">Recent deployments</h2>
          <p class="mt-1 text-sm text-gray-400">The region remains understandable while it refreshes.</p>
        </div>
        <KleanButton
          type="button"
          :disabled="loading"
          :aria-busy="loading"
          class="min-h-10 min-w-0 bg-white px-4 py-2 text-gray-950 disabled:opacity-70 dark:bg-white dark:text-gray-950"
          @click="refresh"
        >
          <KleanSpinner v-if="loading">
            <ProductLoader />
          </KleanSpinner>
          {{ loading ? 'Refreshing…' : 'Refresh deployments' }}
        </KleanButton>
        <p id="spinner-preview-status" role="status" aria-live="polite" aria-atomic="true" class="min-h-5 text-sm text-gray-400">
          {{ message }}
        </p>
      </div>
    </section>
  </template>
  <template #source>

<<< ../../.vitepress/theme/components/klean/spinner/Spinner.vue

  </template>
</KleanPreview>

## Installation

One command detects Vue, React, or Svelte and installs the framework-native source:

<KleanInstallation
  id="spinner-installation"
  component="spinner"
  :source="spinnerSource"
  filename="Spinner.vue"
  destination="assets/js/components/ui/spinner/Spinner.vue"
  :dependencies="['tailwind-merge']"
/>

The installed file belongs to the application. There is no initializer, Klean runtime, configuration file, provider, alias prompt, generated helper, or animation package.

## Usage

Keep the status surface mounted before its contents change. Spinner is decorative, so the useful status is announced once rather than as an unnamed image and again as text.

### Vue

<CopyCode :code="vueUsage" label="DeploymentStatus.vue" />

### React

<CopyCode :code="reactUsage" label="DeploymentStatus.jsx" />

### Svelte

<CopyCode :code="svelteUsage" label="DeploymentStatus.svelte" />

## Loading semantics

Spinner's wrapper renders `aria-hidden="true"`; its fallback SVG is also non-focusable. The surrounding application describes the work:

- put `aria-busy="true"` on the button or region whose content is changing;
- keep specific visible text such as “Saving invoice…” or “Deploying service…”;
- use a persistent `role="status"` surface when a dynamic change should be announced;
- keep existing content readable when refreshing it is safer than replacing the whole region;
- disable a submitting button when a second activation would duplicate the request.

Do not put `role="status"` or an accessible label on Spinner itself. One page can contain several visual marks while exposing one useful status message.

## Product-owned marks

The neutral ring works without setup. When an application's identity belongs in the loading moment, put its own component inside Spinner:

<CopyCode :code="customUsage" label="SlippySpinner.vue" />

The wrapper owns one size class and makes its direct child fill that space. A supplied mark keeps its own animation; Spinner does not rotate it a second time. This is how Slipway retains the animated Slippy mascot while adopting Klean's shared loading contract. Slippy remains Slipway source—it does not become a `mascot`, `icon`, or `variant` prop.

## Buttons and regions

The button owns its native state:

```vue
<Button type="submit" :disabled="form.processing" :aria-busy="form.processing">
  <Spinner v-if="form.processing" class="size-4">
    <SlippyLoader />
  </Spinner>
  {{ form.processing ? 'Saving changes…' : 'Save changes' }}
</Button>
```

For a refreshed surface, put busy state on the surface and connect it to useful status text:

```vue
<section :aria-busy="refreshing" aria-describedby="deployment-status">
  <p id="deployment-status" role="status">
    <template v-if="refreshing">
      <Spinner /> Refreshing deployments…
    </template>
  </p>

  <!-- Existing deployment rows -->
</section>
```

Spinner represents indeterminate work. When progress can be measured and that measurement helps someone decide whether to wait, use visible progress text or the native `<progress>` element.

## Styling with Tailwind

The wrapper and its mark use `currentColor`. Size and color are ordinary caller classes:

<CopyCode :code="stylingUsage" label="loading-styles.vue" />

The fallback is a small neutral ring. There are no `size`, `color`, `speed`, `stroke`, `variant`, `tone`, `mascot`, or `loading` props. Repeated product treatment belongs in an application component. Brand characters and product-specific loaders remain product-owned.

## API

| Concern        | Vue                                      | React                                    | Svelte                                   |
| -------------- | ---------------------------------------- | ---------------------------------------- | ---------------------------------------- |
| Styling        | `class`                                  | `className`                              | `class`                                  |
| Element access | template ref                             | forwarded `ref`                          | component binding                        |
| Wrapper attrs  | non-conflicting native `span` attributes | non-conflicting native `span` attributes | non-conflicting native `span` attributes |
| Custom mark    | default slot                             | `children`                               | default snippet                          |
| Semantics      | fixed decorative wrapper                 | fixed decorative wrapper                 | fixed decorative wrapper                 |

`data-slot="spinner"` is stable for inspection and nearby selectors. The caller owns loading state, status text, `aria-busy`, cancellation, progress, retry, and persistence.

## Motion

The default ring follows `prefers-reduced-motion` without JavaScript. A custom mark supplies its own normal animation; Spinner's reduced-motion guard stops CSS animation inside the wrapper. With motion reduced, the mark remains visible and adjacent text continues communicating the state.

Avoid bounce, wobble, dramatic entrances, and long exits. Loading is already an interruption; its utility indicator should be calm.

## Durable behavior

Loading state is ephemeral and should be derived from the real request, navigation, or job. Spinner never writes it to local storage, the URL, or a component timer.

Long-running server work is different from an in-flight browser request. Restore its true state from the server after navigation or reload, then render Spinner from that state. This keeps the interface honest after refreshes and reconnects.

## Complete framework source

Copy, inspect, and change the complete source for your framework.

### Vue source

<CopyCode :code="spinnerSource" label="Spinner.vue" />

### React source

<CopyCode :code="reactSource" label="Spinner.jsx" />

### Svelte source

<CopyCode :code="svelteSource" label="Spinner.svelte" />

## Related components

- [Button](/klean-ui/components/button) — owns a command's disabled, busy, and truthful pending states.
- [Toast](/klean-ui/components/toast) — announces a completed background outcome without blocking the current task.
- [Slide](/klean-ui/components/slide) — may expose pending state after a consequential action is confirmed.
