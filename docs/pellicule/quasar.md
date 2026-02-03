---
prev:
  text: Nuxt
  link: /pellicule/nuxt
---

# Quasar

If your app uses the Quasar Framework, Pellicule detects `quasar.config.js` and determines whether you're running in Vite mode or Webpack mode.

## Setup

There is no setup. Pellicule reads your `quasar.config.js`.

Quasar projects created with the CLI default to Vite mode. Pellicule loads the Vite configuration that Quasar generates and merges it with its own requirements.

## Project Structure

Create a `videos/` directory inside `src/`, next to your existing directories:

```
my-quasar-app/
├── src/
│   ├── components/
│   │   └── ProductCard.vue
│   ├── pages/
│   │   └── IndexPage.vue
│   ├── layouts/
│   │   └── MainLayout.vue
│   └── videos/              ← your video components
│       ├── ProductShowcase.vue
│       └── AppWalkthrough.vue
├── quasar.config.js
└── package.json
```

## Rendering

```bash
# Pellicule finds src/videos/ProductShowcase.vue automatically
pellicule ProductShowcase

# Or pass the full path
pellicule src/videos/ProductShowcase.vue
```

## Example Video Component

```vue
<script setup>
import { computed } from 'vue'
import { useFrame, useVideoConfig, interpolate, Easing } from 'pellicule'
import ProductCard from 'src/components/ProductCard.vue'

defineVideoConfig({
  durationInSeconds: 4,
  width: 1920,
  height: 1080
})

const frame = useFrame()
const { fps } = useVideoConfig()

const cardScale = computed(() =>
  interpolate(frame.value, [0, fps * 0.5], [0.8, 1], {
    easing: Easing.easeOut
  })
)
</script>

<template>
  <div class="video">
    <ProductCard
      title="Premium Plan"
      price="$49/mo"
      :style="{ transform: `scale(${cardScale})` }"
    />
  </div>
</template>

<style scoped>
.video {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #1d1d1d;
}
</style>
```

## Quasar Components

Quasar's UI components (`QBtn`, `QCard`, `QTable`, etc.) are available in your video components since Pellicule renders through Quasar's build pipeline. If you've configured specific Quasar plugins in your `quasar.config.js`, those are loaded too.

## Webpack Mode

If your Quasar project uses Webpack instead of Vite, Pellicule detects this from your config and uses the `--server-url` approach, similar to [Nuxt](/pellicule/nuxt). Run your Quasar dev server and point Pellicule at it:

```bash
# Start Quasar dev server
quasar dev

# Render with Pellicule
pellicule ProductShowcase --server-url http://localhost:9000
```
