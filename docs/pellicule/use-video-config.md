---
prev:
  text: useFrame
  link: /pellicule/use-frame
next:
  text: useSequence
  link: /pellicule/use-sequence
---

# useVideoConfig

The `useVideoConfig` composable provides access to the video's configuration settings.

## Usage

```vue
<script setup>
import { useVideoConfig } from 'pellicule'

const { fps, durationInFrames, width, height } = useVideoConfig()
</script>
```

## Return Value

Returns an object with the video configuration:

| Property           | Type     | Description            |
| ------------------ | -------- | ---------------------- |
| `fps`              | `number` | Frames per second      |
| `durationInFrames` | `number` | Total number of frames |
| `width`            | `number` | Video width in pixels  |
| `height`           | `number` | Video height in pixels |

## Example

```vue
<script setup>
import { computed } from 'vue'
import { useFrame, useVideoConfig } from 'pellicule'

const frame = useFrame()
const { fps, durationInFrames, width, height } = useVideoConfig()

// Calculate progress through the video (0 to 1)
const progress = computed(() => frame.value / durationInFrames)

// Current time in seconds
const currentTime = computed(() => (frame.value / fps).toFixed(2))

// Total duration in seconds
const totalDuration = computed(() => (durationInFrames / fps).toFixed(1))
</script>

<template>
  <div class="video">
    <p>{{ currentTime }}s / {{ totalDuration }}s</p>
    <p>{{ width }}×{{ height }} @ {{ fps }}fps</p>

    <!-- Progress bar -->
    <div class="progress-bar">
      <div class="fill" :style="{ width: `${progress * 100}%` }" />
    </div>
  </div>
</template>
```

## Common Patterns

### Responsive Sizing

Scale elements based on video dimensions:

```js
const { width, height } = useVideoConfig()

// Font size relative to video width
const fontSize = computed(() => width * 0.05) // 5% of width

// Padding relative to smaller dimension
const padding = computed(() => Math.min(width, height) * 0.1)
```

### Duration-Aware Animations

Make animations adapt to video length:

```js
const frame = useFrame()
const { durationInFrames } = useVideoConfig()

// Fade in during first 10% of video
const fadeInEnd = Math.floor(durationInFrames * 0.1)
const opacity = computed(() => interpolate(frame.value, [0, fadeInEnd], [0, 1]))

// Fade out during last 10%
const fadeOutStart = Math.floor(durationInFrames * 0.9)
const exitOpacity = computed(() =>
  interpolate(frame.value, [fadeOutStart, durationInFrames], [1, 0])
)
```

### Frame Rate Calculations

```js
const { fps, durationInFrames } = useVideoConfig()

// Video duration in seconds
const seconds = durationInFrames / fps

// Frames for a 2-second animation
const twoSecondFrames = fps * 2 // 60 frames at 30fps

// Frames for a specific time
const framesFor = (seconds) => Math.floor(seconds * fps)
```

## CLI Integration

The config values come from CLI arguments:

```bash
npx pellicule Video -f 60 -d 300 -w 1920 -h 1080
```

| CLI Flag         | Config Property    |
| ---------------- | ------------------ |
| `-f, --fps`      | `fps`              |
| `-d, --duration` | `durationInFrames` |
| `-w, --width`    | `width`            |
| `-h, --height`   | `height`           |
