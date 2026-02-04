---
prev:
  text: Nuxt
  link: /pellicule/nuxt
---

# Quasar

Pellicule provides a Vite plugin for Quasar projects. Add the plugin to your `quasar.config.js`, start your dev server, and render — Quasar UI components, aliases, and your project's full environment are available inside video components.

## Setup

### 1. Install Pellicule

```bash
npm install pellicule
```

### 2. Add the Plugin

Add `pellicule/quasar` to `vitePlugins` in your `quasar.config.js`:

```js
build: {
  vitePlugins: [['pellicule/quasar']]
}
```

### 3. ESLint Global

`defineVideoConfig` is a compile-time macro — the plugin strips it during the build. Add it as a global in your `eslint.config.js` so ESLint doesn't flag it as undefined:

```js
globals: {
  defineVideoConfig: 'readonly'
}
```

### 4. Start Your Dev Server and Render

```bash
# Start your Quasar dev server
quasar dev

# In another terminal — just works
pellicule ProductShowcase
```

Pellicule detects `quasar.config.js`, connects to `localhost:9000`, and renders your video through a `/pellicule` page injected by the plugin.

::: tip
Your Quasar dev server must be running before you run Pellicule. Pellicule doesn't start Quasar for you — it connects to the server you already have.
:::

### Custom Server URL

If your Quasar dev server runs on a different port, set it in `package.json`:

```json
{
  "pellicule": {
    "serverUrl": "http://localhost:8080"
  }
}
```

Or pass it as a CLI flag:

```bash
pellicule ProductShowcase --server-url http://localhost:8080
```

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
    <q-card dark class="my-card" :style="{ transform: `scale(${cardScale})` }">
      <q-card-section>
        <div class="text-h4">Premium Plan</div>
        <div class="text-subtitle1">$49/mo</div>
      </q-card-section>
      <q-card-actions>
        <q-btn color="primary" label="Get Started" />
      </q-card-actions>
    </q-card>
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

Quasar UI components (`QBtn`, `QCard`, `QTable`, etc.) work in your video components. The plugin installs Quasar into the render page, so all components are globally registered just like in your app.

## How It Works

When you run `pellicule ProductShowcase`:

1. Pellicule detects `quasar.config.js` and enters BYOS (Bring Your Own Server) mode
2. It constructs the URL `http://localhost:9000/pellicule?component=ProductShowcase&fps=30&duration=120&width=1920&height=1080`
3. The `/pellicule` page (served by the Vite plugin) creates a Vue app with Quasar installed, dynamically imports your video component, and sets up Pellicule's frame injection
4. Playwright screenshots each frame, advancing the frame counter between shots
5. Frames are encoded to MP4 with FFmpeg

## Webpack Mode

If your Quasar project uses Webpack instead of Vite, use the `--server-url` approach. Run your Quasar dev server and point Pellicule at it:

```bash
# Start Quasar dev server
quasar dev

# Render with Pellicule
pellicule ProductShowcase --server-url http://localhost:9000
```
