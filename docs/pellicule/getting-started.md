---
prev:
  text: How It Works
  link: /pellicule/how-it-works
next:
  text: Frames
  link: /pellicule/frames
---

# Getting Started

Get up and running with Pellicule in under a minute.

## Prerequisites

- **Node.js 18+** — Pellicule uses modern JavaScript features
- **FFmpeg** — Required for encoding videos ([install guide](https://ffmpeg.org/download.html))

## Create a New Project

The fastest way to start is with `create-pellicule`:

```bash
npm create pellicule my-video
cd my-video
npm install
```

This scaffolds a new project with a starter `Video.vue`:

```
my-video/
├── package.json
└── Video.vue
```

## Render Your First Video

```bash
npx pellicule
```

That's it! Pellicule will:

1. Start a dev server with your component
2. Render 90 frames (3 seconds at 30fps)
3. Encode them into `output.mp4`

## What's in Video.vue?

The scaffolded `Video.vue` demonstrates the basics:

```vue
<script setup>
import { computed } from 'vue'
import { useFrame, useVideoConfig, interpolate, Easing } from 'pellicule'

const frame = useFrame()
const { durationInFrames } = useVideoConfig()

// Fade in over 30 frames
const opacity = computed(() => interpolate(frame.value, [0, 30], [0, 1]))

// Scale up with easing
const scale = computed(() =>
  interpolate(frame.value, [0, 30], [0.8, 1], { easing: Easing.easeOut })
)
</script>

<template>
  <div class="video">
    <h1 :style="{ opacity, transform: `scale(${scale})` }">
      Hello, Pellicule!
    </h1>
  </div>
</template>

<style scoped>
.video {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  color: white;
}
</style>
```

Key points:

- `useFrame()` gives you the current frame number (0, 1, 2, ...)
- `useVideoConfig()` gives you fps, duration, width, height
- `interpolate()` maps frame numbers to animation values
- `Easing` provides smooth animation curves

## Customize Your Render

```bash
# Custom output filename
npx pellicule -o intro.mp4

# 5 seconds at 30fps (150 frames)
npx pellicule -d 150

# 4K resolution
npx pellicule -w 3840 -h 2160

# 60fps smooth video
npx pellicule -f 60

# Partial render for faster iteration
npx pellicule -d 150 -r 0:30
```

## Adding to an Existing Project

If you already have a project:

```bash
npm install pellicule vue
```

Create a `Video.vue` file and run:

```bash
npx pellicule Video.vue
```

Pellicule auto-detects your project type and reads your existing config. No extra configuration needed — if you have a `vite.config.js`, `config/shipwright.js`, or `nuxt.config.ts`, Pellicule picks it up automatically. Your aliases and plugins just work.

See [Integrations](/pellicule/integrations) for framework-specific guides.

## Next Steps

Learn the core concepts:

- [Frames](/pellicule/frames) — The fundamental unit of video
- [Video Config](/pellicule/video-config) — Understanding fps, duration, and dimensions
- [Sequences](/pellicule/sequences) — Organizing videos into scenes
- [Integrations](/pellicule/integrations) — Using Pellicule with Vite, Nuxt, Laravel, The Boring Stack, and Quasar
