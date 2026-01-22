# What is Pellicule?

Pellicule is a Vue-native engine for rendering videos programmatically. Instead of using timeline-based video editors, you write Vue components that describe your video frame by frame.

## The Name

**Pellicule** (pronounced _peh-lee-KOOL_) comes from the French word for photographic film or film stock — the physical material that captures images in traditional cinema. We chose this name because Pellicule captures your Vue components frame by frame, much like how film stock captures light.

## How It Works

Pellicule uses a fundamentally different approach to video creation:

1. **You write a Vue component** — Your video is just a `.vue` file with a `frame` prop
2. **Pellicule renders each frame** — It sets `frame` to 0, captures a screenshot, sets it to 1, captures again, and so on
3. **FFmpeg encodes the video** — All those frames become an MP4 file

```vue
<script setup>
import { computed } from 'vue'
import { useFrame } from 'pellicule'

const frame = useFrame()
const opacity = computed(() => frame.value / 30)
</script>

<template>
  <div class="video">
    <h1 :style="{ opacity }">Hello, Video!</h1>
  </div>
</template>
```

The key insight is that your component is a **pure function of the frame number**. Given the same frame, you get the same pixels. Every time. This is what we mean by _deterministic rendering_.

## Vue's Reactivity is Perfect for This

When Pellicule updates the `frame` prop, Vue's reactivity system efficiently re-renders only what changed. There's no page reload between frames — just reactive updates. This is why Pellicule can render at 25+ frames per second.

## Pellicule vs Remotion

If you've heard of [Remotion](https://remotion.dev), you'll find Pellicule familiar. Here's how they compare:

|                  | Pellicule               | Remotion                 |
| ---------------- | ----------------------- | ------------------------ |
| **Framework**    | Vue 3                   | React                    |
| **Syntax**       | Single-file components  | JSX                      |
| **Frame access** | `useFrame()` composable | `useCurrentFrame()` hook |
| **Config**       | Zero config             | Requires configuration   |
| **Rendering**    | Playwright + FFmpeg     | Puppeteer + FFmpeg       |

### Philosophy

Both tools share the same core idea: **videos are functions of time**. Instead of thinking in keyframes and timelines, you think in terms of:

```
f(frame) → pixels
```

The main difference is the ecosystem. Remotion is for React developers. Pellicule is for Vue developers.

### Why Vue?

If you already know Vue, Pellicule feels natural:

- **Single-file components** — Template, script, and styles in one file
- **Reactive props** — Frame updates trigger efficient re-renders
- **Vue ecosystem** — Use any Vue library in your videos
- **No new concepts** — If you can build a Vue component, you can make a video

## When to Use Pellicule

Pellicule is great for:

- **Programmatic content** — Generate videos from data (charts, dashboards, reports)
- **Animated graphics** — Motion graphics, explainer videos, intros
- **Batch rendering** — Generate many variations from templates
- **Developer tools** — Automate video creation in your pipeline

Pellicule is _not_ for:

- **Live video editing** — Use a traditional NLE for that
- **Real-time playback** — Pellicule renders offline
- **Non-developers** — You need to write Vue code

## Architecture

Under the hood, Pellicule:

1. Starts a Vite dev server with your component
2. Opens the page in Playwright (headless Chromium)
3. For each frame, updates the `frame` prop and takes a screenshot
4. Pipes all frames to FFmpeg to encode the final video

The entire pipeline is automated. You just write the component and run the CLI.
