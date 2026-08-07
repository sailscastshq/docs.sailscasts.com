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
import reactSource from '../sources/slide/Slide.jsx?raw'
import svelteSource from '../sources/slide/Slide.svelte?raw'
import vueUsage from '../snippets/slide/usage.vue?raw'
import reactUsage from '../snippets/slide/usage.jsx?raw'
import svelteUsage from '../snippets/slide/usage.svelte?raw'
import stylingUsage from '../snippets/slide/styling.vue?raw'

const pending = ref(false)
const message = ref('Ready to deploy.')
let resetTimer

const deploymentClasses = [
  'w-72 border-gray-200 bg-gray-100 text-gray-500 shadow-none',
  '[&_[data-slot=slide-fill]]:bg-amber-500/10',
  '[&_[data-slot=slide-thumb]]:bg-gray-950 [&_[data-slot=slide-thumb]]:text-white',
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
  <template #source>

<<< ../../.vitepress/theme/components/klean/slide/Slide.vue

  </template>
</KleanPreview>

## Installation

One command detects Vue, React, or Svelte and installs the framework-native source:

<KleanInstallation
  id="slide-installation"
  component="slide"
  :source="slideSource"
  filename="Slide.vue"
  destination="assets/js/components/ui/slide/Slide.vue"
  :dependencies="['tailwind-merge']"
/>

The installed file belongs to the application. There is no initializer, Klean runtime, configuration file, provider, alias prompt, or generated class helper.

## Usage

The HTML and behavior stay the same in every framework. Only binding and event syntax change.

### Vue

<CopyCode :code="vueUsage" label="DeployAction.vue" />

### React

<CopyCode :code="reactUsage" label="DeployAction.jsx" />

### Svelte

<CopyCode :code="svelteUsage" label="DeployAction.svelte" />

## Why this is a button

Slide confirms an action; it does not choose a value. It therefore renders a real `<button type="button">`, never an `<input type="range">` and never `role="slider"`.

That semantic choice gives Enter, Space, focus, disabled behavior, and assistive-technology activation their native meaning. The horizontal slide is a pointer enhancement for mouse, touch, and pen. It is not the only way to complete the action.

A future range-value control would be named Slider and would use native slider semantics. Combining the two contracts would make both harder to understand.

## API

| Input        | Vue          | React       | Svelte          | Purpose                                                                   |
| ------------ | ------------ | ----------- | --------------- | ------------------------------------------------------------------------- |
| Disabled     | `:disabled`  | `disabled`  | `disabled`      | Native disabled state; no confirmation can fire.                          |
| Pending      | `:pending`   | `pending`   | `pending`       | Caller-owned in-progress truth; disables duplicates and sets `aria-busy`. |
| Confirmation | `@confirm`   | `onConfirm` | `onconfirm`     | Called once after a valid slide or native button activation.              |
| Styling      | `class`      | `className` | `class`         | Ordinary Tailwind merged after neutral defaults.                          |
| Content      | default slot | `children`  | default snippet | Visible, product-owned action language.                                   |

Native `aria-describedby`, `name`, `value`, `form`, data attributes, and other ordinary button attributes pass through. The confirmation threshold is the one conventional 85% behavior, not an application setting.

Keep `pending` truthful. Set it before starting asynchronous work, then return it to `false` on success or failure. That reset is declarative; there is no imperative `reset()` method.

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

### Vue source

<CopyCode :code="slideSource" label="Slide.vue" />

### React source

<CopyCode :code="reactSource" label="Slide.jsx" />

### Svelte source

<CopyCode :code="svelteSource" label="Slide.svelte" />
