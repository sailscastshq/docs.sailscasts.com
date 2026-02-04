---
prev:
  text: Rsbuild
  link: /pellicule/rsbuild
next:
  text: Nuxt
  link: /pellicule/nuxt
---

# Laravel

If your app uses Laravel + Inertia + Vue, Pellicule detects your `vite.config.ts` — which includes `laravel-vite-plugin` — and loads it automatically. Your aliases, your plugins, everything resolves.

## Setup

There is no setup. Pellicule reads your `vite.config.ts`.

A typical Laravel Vite config:

```ts
// vite.config.ts
import vue from '@vitejs/plugin-vue'
import laravel from 'laravel-vite-plugin'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    laravel({
      input: ['resources/js/app.ts'],
      refresh: true
    }),
    vue()
  ]
})
```

Pellicule loads this config and merges it with its own requirements. Your Laravel paths resolve correctly.

## Project Structure

Create a `videos/` directory inside `resources/js/`, right next to your pages:

```
my-laravel-app/
├── resources/
│   ├── js/
│   │   ├── app.ts
│   │   ├── pages/
│   │   │   ├── Dashboard.vue
│   │   │   └── Welcome.vue
│   │   ├── components/
│   │   │   ├── AppLogo.vue
│   │   │   └── DataTable.vue
│   │   └── videos/              ← your video components
│   │       ├── ProductDemo.vue
│   │       └── Onboarding.vue
│   └── css/
│       └── app.css
├── vite.config.ts
└── package.json
```

This matches Laravel's conventions. Pages live in `pages/`, components in `components/`, videos in `videos/`.

## Rendering

```bash
# Pellicule finds resources/js/videos/ProductDemo.vue automatically
pellicule ProductDemo

# Or pass the full path
pellicule resources/js/videos/ProductDemo.vue

# With options
pellicule Onboarding -o onboarding-video.mp4 -f 60
```

## Example Video Component

```vue
<script setup>
import { computed } from 'vue'
import { useFrame, useVideoConfig, interpolate, Easing } from 'pellicule'
import AppLogo from '@/components/AppLogo.vue'
import DataTable from '@/components/DataTable.vue'

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
