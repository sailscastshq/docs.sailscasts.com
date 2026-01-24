---
prev:
  text: Sequence
  link: /pellicule/sequence
next:
  text: Easing
  link: /pellicule/easing
---

# Interpolate

The `interpolate` function maps a value from one range to another. It's the primary tool for creating smooth animations in Pellicule.

## Usage

```js
import { interpolate } from 'pellicule'

// Map frame 0-30 to opacity 0-1
const opacity = interpolate(frame.value, [0, 30], [0, 1])
```

## Syntax

```js
interpolate(value, inputRange, outputRange, options?)
```

| Parameter     | Type               | Description                    |
| ------------- | ------------------ | ------------------------------ |
| `value`       | `number`           | The input value to interpolate |
| `inputRange`  | `[number, number]` | The input range [min, max]     |
| `outputRange` | `[number, number]` | The output range [min, max]    |
| `options`     | `object`           | Optional configuration         |

### Options

| Option   | Type       | Default | Description                      |
| -------- | ---------- | ------- | -------------------------------- |
| `easing` | `function` | linear  | Easing function to apply         |
| `clamp`  | `boolean`  | `true`  | Clamp output to the output range |

## Examples

### Basic Animation

```vue
<script setup>
import { computed } from 'vue'
import { useFrame, interpolate } from 'pellicule'

const frame = useFrame()

// Fade in over frames 0-30
const opacity = computed(() => interpolate(frame.value, [0, 30], [0, 1]))

// Move from x=0 to x=500 over frames 0-60
const x = computed(() => interpolate(frame.value, [0, 60], [0, 500]))
</script>

<template>
  <div :style="{ opacity, transform: `translateX(${x}px)` }">Animated!</div>
</template>
```

### With Easing

```js
import { interpolate, Easing } from 'pellicule'

// Smooth deceleration
const scale = interpolate(frame.value, [0, 30], [0.5, 1], {
  easing: Easing.easeOut
})

// Smooth acceleration and deceleration
const x = interpolate(frame.value, [0, 60], [0, 500], {
  easing: Easing.easeInOut
})
```

### Reverse Animation

Swap the output range to animate in reverse:

```js
// Fade out (1 → 0)
const opacity = interpolate(frame.value, [0, 30], [1, 0])

// Move left (500 → 0)
const x = interpolate(frame.value, [0, 60], [500, 0])
```

### Clamping

By default, output is clamped to the output range:

```js
// frame = 50, but output is clamped to 1
interpolate(50, [0, 30], [0, 1]) // Returns 1

// Disable clamping to extrapolate beyond the range
interpolate(50, [0, 30], [0, 1], { clamp: false }) // Returns 1.67
```

### Multi-Step Animations

Chain multiple interpolations for sequenced effects:

```js
const frame = useFrame()

// Phase 1: frames 0-30 (fade in)
const fadeIn = computed(() => interpolate(frame.value, [0, 30], [0, 1]))

// Phase 2: frames 30-60 (stay visible, move right)
const moveX = computed(() => interpolate(frame.value, [30, 60], [0, 200]))

// Phase 3: frames 60-90 (fade out)
const fadeOut = computed(() => interpolate(frame.value, [60, 90], [1, 0]))

// Combine phases
const opacity = computed(() => {
  if (frame.value < 60) return fadeIn.value
  return fadeOut.value
})
```

## Common Patterns

### Percentage Progress

```js
const { durationInFrames } = useVideoConfig()

// Progress from 0 to 100%
const progress = interpolate(frame.value, [0, durationInFrames], [0, 100])
```

### Color Interpolation

For colors, interpolate individual RGB values:

```js
// Red (255,0,0) to Blue (0,0,255)
const r = interpolate(frame.value, [0, 60], [255, 0])
const g = 0
const b = interpolate(frame.value, [0, 60], [0, 255])

const color = `rgb(${r}, ${g}, ${b})`
```

### Scale with Overshoot

```js
// Scale up slightly past 1, then settle
const scale = interpolate(frame.value, [0, 20, 30], [0, 1.1, 1])
```

::: tip
For complex multi-step animations, consider using the [`<Sequence>`](/pellicule/sequence) component to organize your video into scenes.
:::

## Related

- [Easing](/pellicule/easing) — Easing functions for smoother animations
