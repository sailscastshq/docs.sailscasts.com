---
prev:
  text: Sequences
  link: /pellicule/sequences
next:
  text: useVideoConfig
  link: /pellicule/use-video-config
---

# useFrame

The `useFrame` composable provides access to the current frame number. This is the foundation of all animations in Pellicule.

## Usage

```vue
<script setup>
import { useFrame } from 'pellicule'

const frame = useFrame()
// frame.value is 0, 1, 2, 3...
</script>
```

## Return Value

Returns a `Ref<number>` containing the current frame number, starting at 0.

| Property | Type     | Description               |
| -------- | -------- | ------------------------- |
| `value`  | `number` | Current frame (0-indexed) |

## Example

```vue
<script setup>
import { computed } from 'vue'
import { useFrame } from 'pellicule'

const frame = useFrame()

// Simple fade in over 30 frames
const opacity = computed(() => Math.min(1, frame.value / 30))

// Pulse every 60 frames
const scale = computed(() => {
  const cycle = frame.value % 60
  return 1 + Math.sin((cycle / 60) * Math.PI * 2) * 0.1
})
</script>

<template>
  <div class="video">
    <div :style="{ opacity, transform: `scale(${scale})` }">
      Frame {{ frame }}
    </div>
  </div>
</template>
```

## How It Works

Pellicule's renderer:

1. Sets `frame` to 0
2. Captures a screenshot
3. Increments `frame` to 1
4. Captures another screenshot
5. Repeats until `durationInFrames` is reached

Vue's reactivity ensures your component re-renders efficiently when `frame` changes.

## Tips

### Convert Frames to Time

```js
const { fps } = useVideoConfig()
const frame = useFrame()

// Current time in seconds
const seconds = computed(() => frame.value / fps)

// Current time in milliseconds
const ms = computed(() => (frame.value / fps) * 1000)
```

### Frame-Based vs Time-Based Animations

Frame-based thinking is more precise for video:

```js
// Frame-based (preferred) - exactly 30 frames
const opacity = computed(() => interpolate(frame.value, [0, 30], [0, 1]))

// Time-based - depends on fps setting
const opacity = computed(() => interpolate(frame.value / fps, [0, 1], [0, 1]))
```

Use frame-based animations for predictable, deterministic output.
