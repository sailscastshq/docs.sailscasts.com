---
prev:
  text: Interpolate
  link: /pellicule/interpolate
next:
  text: CLI
  link: /pellicule/cli
---

# Easing

Easing functions control the rate of change in animations. Instead of linear movement, easing creates natural-feeling motion.

## Usage

```js
import { interpolate, Easing } from 'pellicule'

const scale = interpolate(frame.value, [0, 30], [0, 1], {
  easing: Easing.easeOut
})
```

## Available Easings

| Easing             | Description              | Use Case                         |
| ------------------ | ------------------------ | -------------------------------- |
| `Easing.linear`    | Constant speed           | Mechanical motion                |
| `Easing.easeIn`    | Starts slow, accelerates | Objects falling, starting motion |
| `Easing.easeOut`   | Starts fast, decelerates | Objects landing, stopping motion |
| `Easing.easeInOut` | Slow start and end       | Natural movement, UI transitions |

## Visual Reference

```
linear:     ─────────────────  Constant speed
easeIn:     ╭──────────────    Slow → Fast
easeOut:    ──────────────╮    Fast → Slow
easeInOut:  ╭────────────╮     Slow → Fast → Slow
```

## Examples

### Entrance Animation

```vue
<script setup>
import { computed } from 'vue'
import { useFrame, interpolate, Easing } from 'pellicule'

const frame = useFrame()

// Slide in from left with deceleration
const x = computed(() =>
  interpolate(frame.value, [0, 30], [-200, 0], {
    easing: Easing.easeOut
  })
)

// Scale up with bounce feel
const scale = computed(() =>
  interpolate(frame.value, [0, 25], [0.5, 1], {
    easing: Easing.easeOut
  })
)
</script>

<template>
  <div :style="{ transform: `translateX(${x}px) scale(${scale})` }">Hello!</div>
</template>
```

### Exit Animation

```js
// Fade out with acceleration (starts slow, ends fast)
const opacity = interpolate(frame.value, [0, 30], [1, 0], {
  easing: Easing.easeIn
})

// Slide out accelerating
const x = interpolate(frame.value, [0, 30], [0, 200], {
  easing: Easing.easeIn
})
```

### Smooth UI Motion

```js
// easeInOut is great for elements that move and stop
const x = interpolate(frame.value, [0, 60], [0, 400], {
  easing: Easing.easeInOut
})
```

## Using Progress Value

Apply easing directly to a progress value (0-1):

```js
const seq = useSequence()

// Linear progress
const linearX = seq.progress.value * 500

// Eased progress
const easedX = Easing.easeOut(seq.progress.value) * 500

// Eased opacity
const opacity = Easing.easeInOut(seq.progress.value)
```

## Choosing the Right Easing

| Animation Type     | Recommended Easing |
| ------------------ | ------------------ |
| Elements entering  | `easeOut`          |
| Elements exiting   | `easeIn`           |
| Movement A → B     | `easeInOut`        |
| Looping/repeating  | `linear`           |
| Attention-grabbing | `easeOut`          |

### Why?

- **easeOut** for entrances: Fast start grabs attention, smooth stop feels natural
- **easeIn** for exits: Natural acceleration as element leaves
- **easeInOut** for repositioning: Feels deliberate and polished
- **linear** for loops: Consistent speed for continuous motion

## Combining Easings

Different properties can use different easings:

```js
// Position eases out (decelerates)
const x = interpolate(frame.value, [0, 30], [-100, 0], {
  easing: Easing.easeOut
})

// Opacity is linear
const opacity = interpolate(frame.value, [0, 30], [0, 1])

// Scale has a bounce (easeOut)
const scale = interpolate(frame.value, [0, 30], [0.8, 1], {
  easing: Easing.easeOut
})
```

## Custom Easing Functions

An easing function takes a number 0-1 and returns a number 0-1:

```js
// Custom cubic easing
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3)

// Use with interpolate
const x = interpolate(frame.value, [0, 30], [0, 500], {
  easing: easeOutCubic
})

// Or apply directly
const progress = frame.value / 30
const easedProgress = easeOutCubic(Math.min(1, progress))
const x = easedProgress * 500
```

## Related

- [Interpolate](/pellicule/interpolate) — The `interpolate` function that uses easing
