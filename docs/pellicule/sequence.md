---
prev:
  text: useSequence
  link: /pellicule/use-sequence
next:
  text: Interpolate
  link: /pellicule/interpolate
---

# Sequence

The `<Sequence>` component organizes your video into distinct scenes, each with its own timing and visibility.

## Usage

```vue
<script setup>
import { Sequence } from 'pellicule'
</script>

<template>
  <Sequence name="intro" :from="0" :durationInFrames="90">
    <IntroContent />
  </Sequence>

  <Sequence name="main" :from="90" :durationInFrames="120">
    <MainContent />
  </Sequence>
</template>
```

## Props

| Prop               | Type     | Required | Description                             |
| ------------------ | -------- | -------- | --------------------------------------- |
| `name`             | `string` | Yes      | Unique identifier for the sequence      |
| `from`             | `number` | Yes      | Frame number where this sequence starts |
| `durationInFrames` | `number` | Yes      | How many frames this sequence lasts     |

## Visibility

A sequence only renders when the global frame is within its range:

- **Visible when:** `from <= frame < from + durationInFrames`
- **Hidden otherwise:** Renders nothing

This means sequences automatically handle showing/hiding content.

## Example: Multi-Scene Video

```vue
<script setup>
import { computed } from 'vue'
import { Sequence, useSequence, interpolate, Easing } from 'pellicule'

const intro = useSequence()
const main = useSequence()
const outro = useSequence()

const introOpacity = computed(() =>
  interpolate(intro.localFrame.value, [0, 30], [0, 1])
)

const mainScale = computed(() =>
  interpolate(main.localFrame.value, [0, 20], [0.9, 1], {
    easing: Easing.easeOut
  })
)

const outroOpacity = computed(() =>
  interpolate(outro.localFrame.value, [0, 30], [1, 0])
)
</script>

<template>
  <div class="video">
    <!-- Scene 1: Intro (frames 0-89) -->
    <Sequence name="intro" :from="0" :durationInFrames="90">
      <div class="intro" :style="{ opacity: introOpacity }">
        <h1>Welcome</h1>
      </div>
    </Sequence>

    <!-- Scene 2: Main content (frames 90-209) -->
    <Sequence name="main" :from="90" :durationInFrames="120">
      <div class="main" :style="{ transform: `scale(${mainScale})` }">
        <p>Main content here</p>
      </div>
    </Sequence>

    <!-- Scene 3: Outro (frames 210-299) -->
    <Sequence name="outro" :from="210" :durationInFrames="90">
      <div class="outro" :style="{ opacity: outroOpacity }">
        <h2>Thanks for watching</h2>
      </div>
    </Sequence>
  </div>
</template>
```

## Planning Your Timeline

A typical 10-second video at 30fps (300 frames):

| Scene | Frames  | Duration | Description    |
| ----- | ------- | -------- | -------------- |
| Intro | 0-89    | 3s       | Logo animation |
| Main  | 90-239  | 5s       | Main content   |
| Outro | 240-299 | 2s       | Call to action |

```vue
<template>
  <Sequence name="intro" :from="0" :durationInFrames="90">...</Sequence>
  <Sequence name="main" :from="90" :durationInFrames="150">...</Sequence>
  <Sequence name="outro" :from="240" :durationInFrames="60">...</Sequence>
</template>
```

## Overlapping Sequences

Sequences can overlap for transitions:

```vue
<template>
  <!-- Scene A: frames 0-100 -->
  <Sequence name="sceneA" :from="0" :durationInFrames="100">
    <SceneA />
  </Sequence>

  <!-- Scene B: starts at frame 80, overlaps with A for 20 frames -->
  <Sequence name="sceneB" :from="80" :durationInFrames="100">
    <SceneB />
  </Sequence>
</template>
```

Use opacity or transforms to create crossfade effects during the overlap.

## Nested Sequences

Sequences can be nested for complex timelines:

```vue
<template>
  <Sequence name="main" :from="0" :durationInFrames="180">
    <!-- Sub-sequence within main -->
    <Sequence name="part1" :from="0" :durationInFrames="60">
      <Part1 />
    </Sequence>

    <Sequence name="part2" :from="60" :durationInFrames="60">
      <Part2 />
    </Sequence>

    <Sequence name="part3" :from="120" :durationInFrames="60">
      <Part3 />
    </Sequence>
  </Sequence>
</template>
```

::: warning
Nested sequences use frame numbers relative to their parent. Plan carefully!
:::

## Related

- [`useSequence`](/pellicule/use-sequence) — Access local frame and progress inside a sequence
