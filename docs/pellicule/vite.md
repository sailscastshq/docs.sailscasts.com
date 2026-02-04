---
prev:
  text: Integrations
  link: /pellicule/integrations
next:
  text: The Boring Stack
  link: /pellicule/boring-stack
---

# Vite

If your project has a `vite.config.js` or `vite.config.ts`, Pellicule detects it automatically and loads your config — aliases, plugins, and all.

## Setup

There is no setup. Pellicule reads your `vite.config.js`.

If your Vite config has custom aliases or plugins:

```js
// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})
```

Then `@/components/MyComponent.vue` resolves correctly in your video components. You configured this once for your app — Pellicule respects it.

## Project Structure

Create a `videos/` directory next to your existing component directories:

```
my-app/
├── src/
│   ├── components/
│   │   └── AppLogo.vue
│   ├── pages/
│   │   └── Home.vue
│   └── videos/              ← your video components
│       ├── Intro.vue
│       └── ProductDemo.vue
├── vite.config.js
└── package.json
```

## Rendering

```bash
# Pellicule finds src/videos/Intro.vue automatically
pellicule Intro

# Or pass the full path
pellicule src/videos/Intro.vue

# With options
pellicule ProductDemo -o demo.mp4 -f 60
```

## Example Video Component

```vue
<script setup>
import { computed } from 'vue'
import { useFrame, interpolate, Easing } from 'pellicule'
import AppLogo from '@/components/AppLogo.vue'

defineVideoConfig({
  durationInSeconds: 5,
  fps: 30,
  width: 1920,
  height: 1080
})

const frame = useFrame()

const logoScale = computed(() =>
  interpolate(frame.value, [0, 30], [0, 1], { easing: Easing.easeOut })
)
</script>

<template>
  <div class="video">
    <AppLogo :style="{ transform: `scale(${logoScale})` }" />
  </div>
</template>

<style scoped>
.video {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #1a1a2e;
}
</style>
```

The `AppLogo` component is your real app component. It renders in the video exactly as it renders in your app.
