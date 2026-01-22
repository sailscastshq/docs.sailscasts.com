# Getting Started

Create your first video with Pellicule in under a minute.

## Prerequisites

- **Node.js 18+** — Pellicule uses modern JavaScript features
- **FFmpeg** — Required for encoding videos ([install guide](https://ffmpeg.org/download.html))

## Quick Start

### 1. Create a Video Component

Create a file called `Video.vue`:

```vue
<script setup>
import { useFrame, useVideoConfig } from 'pellicule'

const frame = useFrame()
const { fps, durationInFrames, width, height } = useVideoConfig()

// Calculate current time in seconds
const currentSecond = frame.value / fps
</script>

<template>
  <div class="video">
    <h1>Frame {{ frame }}</h1>
    <p>{{ currentSecond.toFixed(2) }}s</p>
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-family: system-ui, sans-serif;
}

h1 {
  font-size: 72px;
  margin: 0;
}

p {
  font-size: 24px;
  opacity: 0.8;
}
</style>
```

### 2. Render It

```bash
npx pellicule Video
```

That's it. Pellicule will:

1. Start a dev server with your component
2. Render 90 frames (3 seconds at 30fps)
3. Encode them into `output.mp4`

## Composables

Pellicule provides two composables to access frame and video information:

### `useFrame()`

Returns a reactive ref containing the current frame number (starts at 0).

```vue
<script setup>
import { useFrame } from 'pellicule'

const frame = useFrame()
// frame.value is 0, 1, 2, 3...
</script>
```

### `useVideoConfig()`

Returns the video configuration object:

| Property           | Type     | Description            |
| ------------------ | -------- | ---------------------- |
| `fps`              | `number` | Frames per second      |
| `durationInFrames` | `number` | Total number of frames |
| `width`            | `number` | Video width in pixels  |
| `height`           | `number` | Video height in pixels |

```vue
<script setup>
import { useVideoConfig } from 'pellicule'

const { fps, durationInFrames, width, height } = useVideoConfig()
</script>
```

## Customizing Output

```bash
# Custom output filename
npx pellicule Video -o intro.mp4

# 5 seconds at 30fps (150 frames)
npx pellicule Video -d 150

# 4K resolution
npx pellicule Video -w 3840 -h 2160

# 60fps video
npx pellicule Video -f 60
```

## Animating with Frames

The `frame` ref is your animation driver. Here's how to create smooth animations:

```vue
<script setup>
import { computed } from 'vue'
import { useFrame, useVideoConfig } from 'pellicule'

const frame = useFrame()
const { fps } = useVideoConfig()

// Fade in over the first second
const opacity = computed(() => Math.min(1, frame.value / fps))

// Slide in from left (0 to 100px over 30 frames)
const translateX = computed(() => Math.min(100, (frame.value / 30) * 100))

// Loop every 60 frames
const rotation = computed(() => (frame.value % 60) * 6) // 360° / 60 = 6° per frame
</script>

<template>
  <div class="video">
    <div
      class="box"
      :style="{
        opacity,
        transform: `translateX(${translateX}px) rotate(${rotation}deg)`
      }"
    />
  </div>
</template>
```

## Using Easing Functions

For smoother animations, use easing functions:

```vue
<script setup>
import { computed } from 'vue'
import { useFrame, Easing, interpolate } from 'pellicule'

const frame = useFrame()

// Using Pellicule's built-in interpolate with easing
const scale = computed(() =>
  interpolate(frame.value, [0, 60], [0.5, 1], {
    easing: Easing.out(Easing.cubic)
  })
)

// Or manually with custom easing
function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3)
}

const progress = computed(() => Math.min(1, frame.value / 60))
const easedScale = computed(() => 0.5 + easeOutCubic(progress.value) * 0.5)
</script>
```

## Next Steps

- [CLI Reference](/pellicule/cli) — All command-line options
- [What is Pellicule?](/pellicule/what-is-pellicule) — How it works under the hood
