---
prev:
  text: Laravel
  link: /pellicule/laravel
next:
  text: Quasar
  link: /pellicule/quasar
---

# Nuxt

Pellicule provides a Nuxt module that integrates video rendering into your Nuxt app. Add the module, create video components, and render — your full Nuxt environment is available.

## Why a Nuxt Module?

Nuxt wraps Vite with layers of runtime machinery:

- **Auto-imports** — `ref`, `computed`, `watch` work without import statements
- **Module composables** — `useFetch`, `useRoute`, `useRuntimeConfig` are injected at build time
- **Generated aliases** — `#components`, `#imports` are created dynamically
- **Nuxt modules** — `@nuxtjs/tailwindcss`, `@pinia/nuxt`, etc. inject plugins and config

None of this exists in a static `vite.config.js`. Nuxt's Vite config is constructed at runtime. So instead of Pellicule creating its own server, it renders inside your running Nuxt app where all auto-imports, modules, and aliases already work.

The `pellicule/nuxt` module handles this by injecting a hidden `/pellicule` render page into your app that Pellicule's renderer navigates to.

## Setup

### 1. Install Pellicule

```bash
npm install pellicule
```

### 2. Add the Module

Add `pellicule/nuxt` to your `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  modules: ['pellicule/nuxt']
})
```

This does three things automatically:

- Adds a `/pellicule` render page (used by Pellicule's Playwright renderer)
- Registers the `defineVideoConfig()` macro so it compiles cleanly
- Discovers video components in your `app/videos/` directory

If you use ESLint, add `defineVideoConfig` as a global so it doesn't flag the macro as undefined:

```js
// eslint.config.js (or .eslintrc)
globals: {
  defineVideoConfig: 'readonly'
}
```

### 3. Start Your Dev Server and Render

```bash
# Start your Nuxt dev server
npx nuxt dev

# In another terminal — just works
pellicule AppDemo
```

Pellicule detects `nuxt.config.ts`, connects to `localhost:3000`, and renders your video through the injected `/pellicule` page.

::: tip
Your Nuxt dev server must be running before you run Pellicule. Pellicule doesn't start Nuxt for you — it connects to the server you already have.
:::

### Custom Server URL

If your Nuxt dev server runs on a different port, set it once in `package.json`:

```json
{
  "pellicule": {
    "serverUrl": "http://localhost:4000"
  }
}
```

Or pass it as a CLI flag for a one-off override:

```bash
pellicule AppDemo --server-url http://localhost:4000
```

Resolution order: **CLI flags > package.json > default (`http://localhost:3000`)**.

### Custom Videos Directory

By default, the module looks for video components in `app/videos/`. To change this, configure it in `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  modules: ['pellicule/nuxt'],
  pellicule: {
    videosDir: '~/my-videos' // ~ resolves to your srcDir
  }
})
```

## Project Structure

Create a `videos/` directory inside `app/`, next to your components and pages:

```
my-nuxt-app/
├── app/
│   ├── components/
│   │   ├── AppHeader.vue
│   │   └── FeatureCard.vue
│   ├── pages/
│   │   └── index.vue
│   ├── composables/
│   │   └── useAnalytics.ts
│   └── videos/              ← your video components
│       ├── AppDemo.vue
│       └── FeatureShowcase.vue
├── nuxt.config.ts
└── package.json
```

## Example Video Component

Because Pellicule renders inside your Nuxt app, auto-imports and your project's components work:

```vue
<script setup>
import { useFrame, useVideoConfig, interpolate, Easing } from 'pellicule'

defineVideoConfig({
  durationInSeconds: 5,
  width: 1920,
  height: 1080
})

// useFrame and useVideoConfig are from Pellicule
const frame = useFrame()
const { fps } = useVideoConfig()

// ref and computed are auto-imported by Nuxt — no import needed
const opacity = computed(() => interpolate(frame.value, [0, fps], [0, 1]))
</script>

<template>
  <div class="video" :style="{ opacity }">
    <!-- These are your real Nuxt app components -->
    <AppHeader />
    <FeatureCard title="Lightning Fast" description="Built for speed" />
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
  background: #0f172a;
  color: white;
}
</style>
```

`AppHeader` and `FeatureCard` are auto-imported from `app/components/` — no import statement needed, just like in the rest of your Nuxt app.

## Using Nuxt Composables

Your custom composables from `app/composables/` work too:

```vue
<script setup>
import { useFrame, interpolate } from 'pellicule'

const frame = useFrame()
const { data } = await useFetch('/api/stats')

const counterValue = computed(() => {
  const progress = interpolate(frame.value, [0, 60], [0, 1])
  return Math.round(progress * (data.value?.totalUsers || 0))
})
</script>

<template>
  <div class="video">
    <h1>{{ counterValue }} users and counting</h1>
  </div>
</template>
```

::: warning
Be mindful of non-deterministic data. If `useFetch` returns different data between renders, your video won't be reproducible. For deterministic output, consider using hardcoded sample data or mocking API responses for video rendering.
:::

## Nuxt Modules

Any Nuxt module you've installed works in your video components. If you're using `@nuxtjs/tailwindcss`, your Tailwind classes render. If you're using `@pinia/nuxt`, your stores are available. The video renders inside your full Nuxt environment.

## How It Works

When you run `pellicule AppDemo`:

1. Pellicule detects `nuxt.config.ts` and enters BYOS (Bring Your Own Server) mode
2. It constructs the URL `http://localhost:3000/pellicule?component=AppDemo&fps=30&duration=150&width=1920&height=1080`
3. The `/pellicule` page (injected by the module) loads `AppDemo.vue` from your `app/videos/` directory
4. The page sets up Pellicule's frame injection (`useFrame`, `useVideoConfig`) and signals readiness
5. Playwright screenshots each frame, advancing the frame counter between shots
6. Frames are encoded to MP4 with FFmpeg
