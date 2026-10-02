---
title: Slide
titleTemplate: Klean UI
description: Accessible slide-to-confirm actions for Vue, React, and Svelte with caller-owned Tailwind.
outline: [2, 3]
---

<script setup>
import { onBeforeUnmount, ref } from 'vue'
import CopyCode from '../../.vitepress/theme/components/CopyCode.vue'
import KleanInstallation from '../../.vitepress/theme/components/KleanInstallation.vue'
import KleanPreview from '../../.vitepress/theme/components/KleanPreview.vue'
import KleanSlide from '../../.vitepress/theme/components/klean/slide/Slide.vue'
import slideSource from '../../.vitepress/theme/components/klean/slide/Slide.vue?raw'

import stylingUsage from '../snippets/slide/styling.vue?raw'

const pending = ref(false)
const message = ref('Ready to deploy.')
let resetTimer

const deploymentClasses = [
  'w-72 border-gray-200 bg-gray-100 text-gray-500 shadow-none',
  '**:data-[slot=slide-fill]:bg-amber-500/10',
  '**:data-[slot=slide-thumb]:bg-gray-950 **:data-[slot=slide-thumb]:text-white',
  '[&[data-progress=middle]_[data-slot=slide-thumb]]:bg-amber-500',
  '[&[data-progress=ready]_[data-slot=slide-thumb]]:bg-emerald-500',
  '[&[data-progress=complete]_[data-slot=slide-thumb]]:bg-emerald-500',
  '[&[data-progress=ready]_[data-slot=slide-fill]]:bg-emerald-500/10',
  '[&[data-progress=complete]_[data-slot=slide-fill]]:bg-emerald-500/10'
].join(' ')

function deploy() {
  pending.value = true
  message.value = 'Deployment started.'
  clearTimeout(resetTimer)
  resetTimer = setTimeout(() => {
    pending.value = false
    message.value = 'Ready to deploy again.'
  }, 1400)
}

onBeforeUnmount(() => clearTimeout(resetTimer))

import reactInstallSlidejsx from '../sources/slide/Slide.jsx?raw'
import svelteInstallSlidesvelte from '../sources/slide/Slide.svelte?raw'

const installationFrameworks = [
  {
    id: 'vue', label: 'Vue',
    dependencies: ["tailwind-merge"],
    files: [
      { filename: 'Slide.vue', destination: 'assets/js/components/ui/slide/Slide.vue', source: slideSource },
    ]
  },
  {
    id: 'react', label: 'React',
    dependencies: ["tailwind-merge"],
    files: [
      { filename: 'Slide.jsx', destination: 'assets/js/components/ui/slide/Slide.jsx', source: reactInstallSlidejsx },
    ]
  },
  {
    id: 'svelte', label: 'Svelte',
    dependencies: ["tailwind-merge"],
    files: [
      { filename: 'Slide.svelte', destination: 'assets/js/components/ui/slide/Slide.svelte', source: svelteInstallSlidesvelte },
    ]
  },
]
</script>

# Slide

Slide confirms an action while making accidental pointer activation difficult. Drag the thumb near the end and release, or focus the control and press Enter or Space.

<KleanPreview id="slide-source" :source="slideSource" filename="Slide.vue">
  <template #preview>
    <section class="grid min-h-64 w-full place-items-center rounded-xl bg-gray-950 p-6 text-white" aria-labelledby="slide-preview-title">
      <div class="grid justify-items-center gap-5 text-center">
        <div>
          <h2 id="slide-preview-title" class="font-semibold">Ship the current release</h2>
          <p class="mt-1 text-sm text-gray-400">Sliding prevents an accidental pointer click.</p>
        </div>
        <KleanSlide
          :pending="pending"
          :class="deploymentClasses"
          aria-describedby="slide-preview-status"
          @confirm="deploy"
        >
          {{ pending ? 'Sliding to production…' : 'Slide to production' }}
        </KleanSlide>
        <p id="slide-preview-status" class="text-sm text-gray-400" aria-live="polite">
          {{ message }}
        </p>
      </div>
    </section>
  </template>
  <template #usage>

::: code-group

<<< ../snippets/slide/usage.vue [Vue]

<<< ../snippets/slide/usage.jsx [React]

<<< ../snippets/slide/usage.svelte [Svelte]

:::

  </template>
  <template #source>

<<< ../../.vitepress/theme/components/klean/slide/Slide.vue

  </template>
</KleanPreview>

## Installation

One command detects Vue, React, or Svelte and installs the framework-native source:

<KleanInstallation
  id="slide-installation"
  component="slide"
  :frameworks="installationFrameworks"
/>

## Usage

The HTML and behavior stay the same in every framework. Only binding and event syntax change.

Copy the [example above](#slide-source) for your framework.

## Why this is a button

Slide confirms an action; it does not choose a value. It therefore renders a real `<button type="button">`, never an `<input type="range">` and never `role="slider"`.

That semantic choice gives Enter, Space, focus, disabled behavior, and assistive-technology activation their native meaning. The horizontal slide is a pointer enhancement for mouse, touch, and pen. It is not the only way to complete the action.

Use [Slider](/klean-ui/components/slider) to choose a numeric value or range. Slide confirms an action; Slider chooses a value.

## API

| Input        | Vue          | React       | Svelte          | Purpose                                                                   |
| ------------ | ------------ | ----------- | --------------- | ------------------------------------------------------------------------- |
| Disabled     | `:disabled`  | `disabled`  | `disabled`      | Native disabled state; no confirmation can fire.                          |
| Pending      | `:pending`   | `pending`   | `pending`       | Caller-owned in-progress truth; blocks duplicates without dropping focus. |
| Confirmation | `@confirm`   | `onConfirm` | `onconfirm`     | Called once after a valid slide or native button activation.              |
| Styling      | `class`      | `className` | `class`         | Ordinary Tailwind merged after neutral defaults.                          |
| Content      | default slot | `children`  | default snippet | Visible, product-owned action language.                                   |
| Thumb        | `#thumb`     | `thumb`     | `thumb` snippet | Optional product-owned decorative content; the arrow remains the default. |

Native `aria-describedby`, `name`, `value`, `form`, data attributes, and other ordinary button attributes pass through. The confirmation threshold is the one conventional 85% behavior, not an application setting.

Keep `pending` truthful. Set it before starting asynchronous work, then return it to `false` on success or failure. That reset is declarative; there is no imperative `reset()` method.

Pending is temporary application state, so Slide reports `aria-busy="true"` and `aria-disabled="true"` while retaining focus. The explicit `disabled` input remains a real native disabled state for controls that cannot currently be used.

The custom thumb receives `pending` and `progress`, where progress is `start`, `middle`, `ready`, or `complete`. Use those truthful states for content, not a second source of interaction state.

## Custom thumb content

The default arrow needs no configuration. When a product has a meaningful mark—such as an application mascot—place it in the thumb with the framework-native content hook.

::: code-group

<<< ../snippets/slide/thumb.vue [Vue]

<<< ../snippets/slide/thumb.jsx [React]

<<< ../snippets/slide/thumb.svelte [Svelte]

:::

The entire thumb is decorative. Keep the image `alt` empty and communicate pending work through the visible action label and the surrounding application status, not through the moving artwork alone.

## Styling progress

Slide is neutral monochrome by default. Products may change color as the thumb moves using ordinary Tailwind selectors:

<CopyCode :code="stylingUsage" label="deployment-action.vue" />

The root exposes `data-progress="start|middle|ready|complete"`. The fill and thumb expose `data-slot="slide-fill"` and `data-slot="slide-thumb"`. These are styling hooks, not extra component objects or part-class props.

There are no variants, tones, color props, `fillClass`, `thumbClass`, or theme provider. When a treatment repeats within an application, extract an application component around Slide and keep the product name there.

## Durable behavior

- Releasing before the threshold returns to idle without confirming.
- Escape, an interrupted pointer gesture, or lost capture cancels cleanly.
- Focus stays on the button after cancellation, confirmation, failure, and reset.
- Pending and disabled states cannot emit duplicate confirmation.
- Track and thumb geometry are measured from the rendered control, including responsive resizing.
- Logical direction keeps the interaction correct in RTL.
- Reduced-motion preferences remove movement transitions without hiding progress.
- Progress is ephemeral and is never written to storage, the URL, cookies, or server state.

Color is never the only progress signal: the thumb position moves, the visible label changes to “Release to confirm” near completion, and a polite status region announces meaningful state changes.

## Complete framework source

Copy, inspect, and change the complete source for your framework.

::: code-group

<<< ../../.vitepress/theme/components/klean/slide/Slide.vue [Vue]

<<< ../sources/slide/Slide.jsx [React]

<<< ../sources/slide/Slide.svelte [Svelte]

:::

## Related components

- [Slider](/klean-ui/components/slider) — choose a numeric value or range rather than confirm an action.
- [Button](/klean-ui/components/button) — the ordinary choice for actions that do not need extra friction.
- [Spinner](/klean-ui/components/spinner) — a decorative pending mark after confirmation starts real work.
- [Toast](/klean-ui/components/toast) — announce the result after confirmation.
- [Dialog](/klean-ui/components/dialog) — gather context or explicit choices before a consequential action.
