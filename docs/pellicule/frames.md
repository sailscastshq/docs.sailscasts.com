---
prev:
  text: Getting Started
  link: /pellicule/getting-started
next:
  text: Video Config
  link: /pellicule/video-config
---

# Frames

In Pellicule, the **frame** is the fundamental unit of video. Understanding frames is key to creating animations.

## What is a Frame?

A video is a sequence of still images (frames) displayed rapidly. At 30fps, 30 images flash by every second, creating the illusion of motion.

```
Frame 0 → Frame 1 → Frame 2 → ... → Frame 89
   ↓         ↓         ↓              ↓
 0.00s     0.03s     0.06s    ...   2.97s
```

In Pellicule, you don't think in seconds—you think in frames.

## Frame-Based Thinking

Traditional animation tools use timelines measured in seconds. Pellicule uses frames because:

1. **Precision** — Frame 15 is always frame 15. No floating-point timing issues.
2. **Determinism** — Same frame number = same pixels. Every time.
3. **Simplicity** — Math is easier with integers.

### Converting Time to Frames

```
frames = seconds × fps
```

| Duration   | 30fps      | 60fps      |
| ---------- | ---------- | ---------- |
| 1 second   | 30 frames  | 60 frames  |
| 3 seconds  | 90 frames  | 180 frames |
| 5 seconds  | 150 frames | 300 frames |
| 10 seconds | 300 frames | 600 frames |

## The Frame as Animation Driver

Your component receives a frame number (0, 1, 2, ...) and renders the corresponding state:

```vue
<script setup>
import { computed } from 'vue'
import { useFrame } from 'pellicule'

const frame = useFrame()

// Frame 0: opacity = 0
// Frame 15: opacity = 0.5
// Frame 30: opacity = 1
const opacity = computed(() => Math.min(1, frame.value / 30))
</script>

<template>
  <div :style="{ opacity }">Fading in...</div>
</template>
```

The renderer:

1. Sets frame to 0, captures a screenshot
2. Sets frame to 1, captures a screenshot
3. Repeats until done

Vue's reactivity ensures efficient re-renders between frames.

## Deterministic Rendering

This is the core principle: **your component is a pure function of the frame number**.

```
f(frame) → pixels
```

Given frame 42, your component always produces the exact same output. No randomness, no clock-based timing, no external state.

This means:

- Renders are reproducible
- You can re-render any frame in isolation
- Partial rendering (`-r 100:200`) works correctly

## Frame Patterns

### Linear Animation

```js
// 0 to 100 over 60 frames
const x = (frame.value / 60) * 100
```

### Looping

```js
// Loop every 30 frames
const loopFrame = frame.value % 30
const rotation = (loopFrame / 30) * 360
```

### Delayed Start

```js
// Start animation at frame 30
const delayedFrame = Math.max(0, frame.value - 30)
const opacity = Math.min(1, delayedFrame / 30)
```

### Staggered Elements

```js
// Element 0 starts at frame 0, element 1 at frame 5, etc.
const staggerDelay = index * 5
const elementFrame = Math.max(0, frame.value - staggerDelay)
```

## Using interpolate()

For most animations, use `interpolate()` instead of manual math:

```js
import { interpolate } from 'pellicule'

// Cleaner than: Math.min(1, frame.value / 30)
const opacity = interpolate(frame.value, [0, 30], [0, 1])

// Supports easing
const scale = interpolate(frame.value, [0, 30], [0.5, 1], {
  easing: Easing.easeOut
})
```

## Related

- [useFrame](/pellicule/use-frame) — The composable for accessing the current frame
- [Interpolate](/pellicule/interpolate) — Mapping frames to values
