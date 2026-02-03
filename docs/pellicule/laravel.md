---
prev:
  text: Rsbuild
  link: /pellicule/rsbuild
next:
  text: Nuxt
  link: /pellicule/nuxt
---

# Laravel

If your app uses Laravel + Inertia + Vue, Pellicule detects your `vite.config.js` — which includes `laravel-vite-plugin` — and loads it automatically. Your aliases, your plugins, everything resolves.

## Setup

There is no setup. Pellicule reads your `vite.config.js`.

A typical Laravel Vite config:

```js
// vite.config.js
import { defineConfig } from 'vite'
import laravel from 'laravel-vite-plugin'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [
    laravel({
      input: ['resources/css/app.css', 'resources/js/app.js'],
      refresh: true
    }),
    vue()
  ]
})
```

Pellicule loads this config and merges it with its own requirements. Your Laravel paths resolve correctly.

## Project Structure

Create a `Videos/` directory inside `resources/js/`, right next to your Pages:

```
my-laravel-app/
├── resources/
│   ├── js/
│   │   ├── app.js
│   │   ├── Pages/
│   │   │   ├── Dashboard.vue
│   │   │   └── Invoices/
│   │   │       └── Index.vue
│   │   ├── Components/
│   │   │   ├── AppLogo.vue
│   │   │   └── DataTable.vue
│   │   └── Videos/              ← your video components
│   │       ├── ProductDemo.vue
│   │       └── Onboarding.vue
│   └── css/
│       └── app.css
├── vite.config.js
└── package.json
```

This matches Laravel's conventions. Pages live in `Pages/`, components in `Components/`, videos in `Videos/`.

## Rendering

```bash
# Pellicule finds resources/js/Videos/ProductDemo.vue automatically
pellicule ProductDemo

# Or pass the full path
pellicule resources/js/Videos/ProductDemo.vue

# With options
pellicule Onboarding -o onboarding-video.mp4 -f 60
```

## Example Video Component

```vue
<script setup>
import { computed } from 'vue'
import { useFrame, useVideoConfig, interpolate, Easing } from 'pellicule'
import AppLogo from '@/Components/AppLogo.vue'
import DataTable from '@/Components/DataTable.vue'

defineVideoConfig({
  durationInSeconds: 6,
  width: 1920,
  height: 1080
})

const frame = useFrame()
const { fps } = useVideoConfig()

const logoOpacity = computed(() =>
  interpolate(frame.value, [0, fps * 0.5], [0, 1])
)

const tableSlide = computed(() =>
  interpolate(frame.value, [fps, fps * 2], [100, 0], {
    easing: Easing.easeOut
  })
)
</script>

<template>
  <div class="video">
    <AppLogo :style="{ opacity: logoOpacity }" />
    <DataTable
      :rows="sampleData"
      :style="{ transform: `translateY(${tableSlide}px)` }"
    />
  </div>
</template>

<style scoped>
.video {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  background: white;
}
</style>
```

`AppLogo` and `DataTable` are your real Laravel app components. Design changes in your app automatically show up in your videos.
