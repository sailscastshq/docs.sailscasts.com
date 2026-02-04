---
prev:
  text: The Boring Stack
  link: /pellicule/boring-stack
next:
  text: Laravel
  link: /pellicule/laravel
---

# Rsbuild

If your project uses Rsbuild directly (not through Shipwright), Pellicule detects your `rsbuild.config.js` or `rsbuild.config.ts` and loads it automatically — aliases, plugins, and all.

::: tip
Using the [boring stack](https://docs.sailscasts.com/boring-stack) with Shipwright? See [The Boring Stack](/pellicule/boring-stack) instead — Pellicule reads `config/shipwright.js` directly.
:::

## Setup

There is no setup. Pellicule reads your `rsbuild.config.js`.

A typical Rsbuild config with Vue:

```js
// rsbuild.config.js
import { defineConfig } from '@rsbuild/core'
import { pluginVue } from '@rsbuild/plugin-vue'

export default defineConfig({
  plugins: [pluginVue()],
  resolve: {
    alias: {
      '@': './src'
    }
  }
})
```

Pellicule loads this config and uses the Rsbuild adapter. Your aliases and plugins work in your video components without any extra configuration.

## Project Structure

Create a `videos/` directory next to your existing component directories:

```
my-rsbuild-app/
├── src/
│   ├── components/
│   │   └── Dashboard.vue
│   ├── pages/
│   │   └── Home.vue
│   └── videos/              ← your video components
│       ├── AppShowcase.vue
│       └── FeatureHighlight.vue
├── rsbuild.config.js
└── package.json
```

## Rendering

```bash
# Pellicule finds src/videos/AppShowcase.vue automatically
pellicule AppShowcase

# Or pass the full path
pellicule src/videos/AppShowcase.vue

# With options
pellicule FeatureHighlight -o feature-video.mp4
```

## Example Video Component

```vue
<script setup>
import { computed } from 'vue'
import { useFrame, useVideoConfig, interpolate, Easing } from 'pellicule'
import Dashboard from '@/components/Dashboard.vue'

defineVideoConfig({
  durationInSeconds: 6,
  width: 1920,
  height: 1080
})

const frame = useFrame()
const { fps } = useVideoConfig()

const dashboardOpacity = computed(() =>
  interpolate(frame.value, [0, fps], [0, 1])
)
</script>

<template>
  <div class="video">
    <Dashboard :style="{ opacity: dashboardOpacity }" :data="sampleMetrics" />
  </div>
</template>

<style scoped>
.video {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0f172a;
}
</style>
```

The `@` alias resolves because Pellicule loaded your `rsbuild.config.js`. The `Dashboard` component is your real app component — same code, same styling.
