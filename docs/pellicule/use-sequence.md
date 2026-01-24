---
prev:
  text: useVideoConfig
  link: /pellicule/use-video-config
next:
  text: Sequence
  link: /pellicule/sequence
---

# useSequence

The `useSequence` composable provides access to the current sequence's local frame and progress. Use it inside a `<Sequence>` component.

## Usage

```vue
<script setup>
import { Sequence, useSequence } from 'pellicule'

const seq = useSequence()
// seq.localFrame.value - frame relative to sequence start
// seq.progress.value - 0 to 1 progress
</script>

<template>
  <Sequence name="intro" :from="0" :durationInFrames="90">
    <MyContent />
  </Sequence>
</template>
```

## Return Value

| Property           | Type          | Description                                          |
| ------------------ | ------------- | ---------------------------------------------------- |
| `localFrame`       | `Ref<number>` | Current frame relative to sequence start (0-indexed) |
| `progress`         | `Ref<number>` | Progress from 0 (start) to 1 (end)                   |
| `name`             | `string`      | Name of the current sequence                         |
| `durationInFrames` | `number`      | Duration of the sequence                             |

## Example

```vue
<script setup>
import { computed } from 'vue'
import { Sequence, useSequence, interpolate, Easing } from 'pellicule'

const intro = useSequence()

// Animate based on local frame (starts at 0 for this sequence)
const opacity = computed(() =>
  interpolate(intro.localFrame.value, [0, 30], [0, 1])
)

const scale = computed(() =>
  interpolate(intro.localFrame.value, [0, 30], [0.8, 1], {
    easing: Easing.easeOut
  })
)
</script>

<template>
  <Sequence name="intro" :from="0" :durationInFrames="90">
    <div :style="{ opacity, transform: `scale(${scale})` }">Welcome!</div>
  </Sequence>
</template>
```

## Why Local Frames?

Without sequences, you calculate animations from global frames:

```js
// Global frame approach - fragile
const introOpacity = interpolate(frame.value, [0, 30], [0, 1])
const mainOpacity = interpolate(frame.value, [90, 120], [0, 1]) // Magic numbers!
```

With `useSequence`, each section starts fresh at frame 0:

```js
// Local frame approach - clean
const intro = useSequence()
const opacity = interpolate(intro.localFrame.value, [0, 30], [0, 1])
```

If you later change when a sequence starts, the animations inside still work.

## Progress-Based Animations

The `progress` value (0 to 1) is useful for animations that should complete by the end:

```js
const seq = useSequence()

// Fade out by end of sequence
const opacity = computed(() => 1 - seq.progress.value)

// Linear movement across sequence
const x = computed(() => seq.progress.value * 500)

// Eased movement
const easedX = computed(() => Easing.easeInOut(seq.progress.value) * 500)
```

## Multiple Sequences

Call `useSequence()` once for each sequence you need to reference:

```vue
<script setup>
import { Sequence, useSequence, interpolate } from 'pellicule'

// Each useSequence() call gets the context of its nearest parent <Sequence>
const intro = useSequence()
const main = useSequence()

const introOpacity = computed(() =>
  interpolate(intro.localFrame.value, [0, 30], [0, 1])
)

const mainScale = computed(() =>
  interpolate(main.localFrame.value, [0, 20], [0.9, 1])
)
</script>

<template>
  <Sequence name="intro" :from="0" :durationInFrames="60">
    <div :style="{ opacity: introOpacity }">Intro</div>
  </Sequence>

  <Sequence name="main" :from="60" :durationInFrames="120">
    <div :style="{ transform: `scale(${mainScale})` }">Main</div>
  </Sequence>
</template>
```

## Related

- [`<Sequence>`](/pellicule/sequence) — The component that defines sequence boundaries
