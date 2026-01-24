---
prev:
  text: Video Config
  link: /pellicule/video-config
next:
  text: useFrame
  link: /pellicule/use-frame
---

# Sequences

Sequences let you organize your video into distinct scenes, each with its own local timeline. This is essential for any video longer than a few seconds.

## The Problem

Without sequences, a 10-second video becomes hard to manage:

```js
// Scene 1: frames 0-89
const introOpacity = interpolate(frame.value, [0, 30], [0, 1])

// Scene 2: frames 90-209
const mainOpacity = interpolate(frame.value, [90, 120], [0, 1]) // Magic numbers!

// Scene 3: frames 210-299
const outroOpacity = interpolate(frame.value, [210, 240], [0, 1]) // More magic numbers!
```

If you change Scene 1's duration, you have to update every number in Scenes 2 and 3.

## The Solution

Sequences give each scene its own local frame counter that starts at 0:

```vue
<template>
  <Sequence name="intro" :from="0" :durationInFrames="90">
    <!-- localFrame is 0-89 -->
  </Sequence>

  <Sequence name="main" :from="90" :durationInFrames="120">
    <!-- localFrame is 0-119 (resets to 0!) -->
  </Sequence>

  <Sequence name="outro" :from="210" :durationInFrames="90">
    <!-- localFrame is 0-89 (resets again!) -->
  </Sequence>
</template>
```

Inside each sequence, you animate from frame 0:

```js
const intro = useSequence()
const opacity = interpolate(intro.localFrame.value, [0, 30], [0, 1])
```

## How Sequences Work

A sequence has three properties:

| Property           | Description                  |
| ------------------ | ---------------------------- |
| `name`             | Unique identifier            |
| `from`             | Global frame where it starts |
| `durationInFrames` | How many frames it lasts     |

The sequence is **only visible** when the global frame is within its range:

```
Global frame 50  → Intro visible (localFrame = 50)
Global frame 100 → Main visible (localFrame = 10)
Global frame 250 → Outro visible (localFrame = 40)
```

## Planning Your Timeline

For a 10-second video at 30fps (300 frames):

| Scene | Global Frames | Duration | Local Frames |
| ----- | ------------- | -------- | ------------ |
| Intro | 0-89          | 3s       | 0-89         |
| Main  | 90-239        | 5s       | 0-149        |
| Outro | 240-299       | 2s       | 0-59         |

```vue
<Sequence name="intro" :from="0" :durationInFrames="90" />
<Sequence name="main" :from="90" :durationInFrames="150" />
<Sequence name="outro" :from="240" :durationInFrames="60" />
```

## Benefits

### 1. No Magic Numbers

Animations always start from 0:

```js
// Before: What does 90 mean? Why 120?
const opacity = interpolate(frame.value, [90, 120], [0, 1])

// After: Clear intent
const main = useSequence()
const opacity = interpolate(main.localFrame.value, [0, 30], [0, 1])
```

### 2. Easy Reorganization

Change a sequence's timing without touching its animations:

```vue
<!-- Changed intro from 90 to 120 frames? Just update `from` on main -->
<Sequence name="intro" :from="0" :durationInFrames="120" />
<Sequence name="main" :from="120" :durationInFrames="150" />
```

All animations inside `main` still work—they use localFrame.

### 3. Progress Tracking

`useSequence()` gives you progress (0 to 1) through the sequence:

```js
const seq = useSequence()

// Fade out by end of sequence
const opacity = 1 - seq.progress.value
```

## Related

- [`<Sequence>`](/pellicule/sequence) — The component reference
- [`useSequence`](/pellicule/use-sequence) — The composable reference
