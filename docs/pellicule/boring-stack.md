---
prev:
  text: Vite
  link: /pellicule/vite
next:
  text: Rsbuild
  link: /pellicule/rsbuild
---

# The Boring Stack

If your app uses the [boring stack](https://docs.sailscasts.com/boring-stack) with Shipwright, Pellicule detects `config/shipwright.js` and reads your Rsbuild config from the `build` key. Your `@` and `~` aliases, your Vue plugin, your entire Shipwright config — Pellicule uses all of it.

## Setup

There is no setup. Pellicule reads your `config/shipwright.js`.

A typical Shipwright config:

```js
// config/shipwright.js
const { pluginVue } = require('@rsbuild/plugin-vue')
module.exports.shipwright = {
  build: {
    plugins: [pluginVue()]
  }
}
```

Pellicule reads the `build` key — which is standard Rsbuild config — and uses the Rsbuild adapter to serve your video components with the same aliases and plugins your app uses.

## Project Structure

Create a `videos/` directory inside `assets/js/`, right next to your pages and components:

```
my-app/
├── assets/
│   ├── js/
│   │   ├── app.js
│   │   ├── pages/
│   │   │   └── invoices/
│   │   │       └── index.vue
│   │   ├── components/
│   │   │   ├── InvoiceCard.vue
│   │   │   └── PriceTag.vue
│   │   └── videos/              ← your video components
│   │       ├── InvoiceDemo.vue
│   │       └── AppIntro.vue
│   └── css/
│       └── app.css
├── config/
│   └── shipwright.js
└── package.json
```

This follows the same convention as the rest of your boring stack app. Pages live in `pages/`, components in `components/`, videos in `videos/`.

## Rendering

```bash
# Pellicule finds assets/js/videos/InvoiceDemo.vue automatically
pellicule InvoiceDemo

# Or pass the full path
pellicule assets/js/videos/InvoiceDemo.vue

# With options
pellicule AppIntro -o marketing-intro.mp4
```

## Example Video Component

```vue
<script setup>
import { computed } from 'vue'
import { useFrame, useVideoConfig, interpolate, Easing } from 'pellicule'
import InvoiceCard from '@/components/InvoiceCard.vue'
import PriceTag from '@/components/PriceTag.vue'

defineVideoConfig({
  durationInSeconds: 8,
  width: 1920,
  height: 1080
})

const frame = useFrame()
const { fps } = useVideoConfig()

const cardOpacity = computed(() => interpolate(frame.value, [0, fps], [0, 1]))

const priceSlide = computed(() =>
  interpolate(frame.value, [fps * 0.5, fps * 1.5], [40, 0], {
    easing: Easing.easeOut
  })
)
</script>

<template>
  <div class="video">
    <InvoiceCard :style="{ opacity: cardOpacity }">
      <PriceTag
        amount="2,400"
        currency="USD"
        :style="{ transform: `translateY(${priceSlide}px)` }"
      />
    </InvoiceCard>
  </div>
</template>

<style scoped>
.video {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
}
</style>
```

`InvoiceCard` and `PriceTag` are your real app components — the same ones your users see. The `@` alias resolves because Shipwright already maps it to `assets/js/`. When you update the component in your app, the video updates too.

## Using Composables and Layouts

Your `assets/js/composables/` are available too:

```vue
<script setup>
import { useFrame, interpolate } from 'pellicule'
import { useCurrencyFormatter } from '@/composables/currency'

const frame = useFrame()
const { format } = useCurrencyFormatter('USD')

const amount = computed(() => {
  const raw = interpolate(frame.value, [0, 60], [0, 2400])
  return format(Math.round(raw))
})
</script>

<template>
  <div class="video">
    <span class="counter">{{ amount }}</span>
  </div>
</template>
```

Your formatting logic, your utility functions, your design tokens — all reusable in videos without duplication.
