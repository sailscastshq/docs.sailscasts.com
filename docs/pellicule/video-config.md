---
prev:
  text: Frames
  link: /pellicule/frames
next:
  text: Sequences
  link: /pellicule/sequences
---

# Video Config

The video config defines the dimensions and timing of your video. Understanding these properties helps you create properly sized and timed animations.

## The Four Properties

| Property           | Description            | Default | CLI Flag |
| ------------------ | ---------------------- | ------- | -------- |
| `fps`              | Frames per second      | 30      | `-f`     |
| `durationInFrames` | Total frame count      | 90      | `-d`     |
| `width`            | Video width in pixels  | 1920    | `-w`     |
| `height`           | Video height in pixels | 1080    | `-h`     |

## FPS (Frames Per Second)

FPS determines smoothness and file size.

| FPS | Use Case                   | Character                |
| --- | -------------------------- | ------------------------ |
| 24  | Cinematic, film-like       | Classic, slightly dreamy |
| 30  | Web standard, social media | Smooth, universal        |
| 60  | High motion, gaming        | Ultra-smooth, modern     |

Higher FPS = more frames to render = longer render time and larger files.

## Duration in Frames

Duration is specified in frames, not seconds:

```
seconds = durationInFrames / fps
```

| Desired Duration | 30fps      | 60fps       |
| ---------------- | ---------- | ----------- |
| 3 seconds        | 90 frames  | 180 frames  |
| 5 seconds        | 150 frames | 300 frames  |
| 10 seconds       | 300 frames | 600 frames  |
| 30 seconds       | 900 frames | 1800 frames |

```bash
# 10 second video at 30fps
npx pellicule -d 300 -f 30
```

## Resolution (Width × Height)

Common video resolutions:

| Name     | Resolution | Aspect Ratio | Use Case               |
| -------- | ---------- | ------------ | ---------------------- |
| 720p     | 1280×720   | 16:9         | Web, fast renders      |
| 1080p    | 1920×1080  | 16:9         | Standard HD            |
| 4K       | 3840×2160  | 16:9         | YouTube, high quality  |
| Square   | 1080×1080  | 1:1          | Instagram feed         |
| Vertical | 1080×1920  | 9:16         | TikTok, Reels, Stories |

```bash
# 4K video
npx pellicule -w 3840 -h 2160

# Instagram square
npx pellicule -w 1080 -h 1080

# TikTok vertical
npx pellicule -w 1080 -h 1920
```

## Accessing Config in Components

Use `useVideoConfig()` to access these values:

```vue
<script setup>
import { computed } from 'vue'
import { useFrame, useVideoConfig } from 'pellicule'

const frame = useFrame()
const { fps, durationInFrames, width, height } = useVideoConfig()

// Calculate progress (0 to 1)
const progress = computed(() => frame.value / durationInFrames)

// Time in seconds
const seconds = computed(() => (frame.value / fps).toFixed(2))

// Responsive font size (5% of width)
const fontSize = computed(() => width * 0.05)
</script>
```

## Duration-Aware Animations

Make animations adapt to any video length:

```js
const { durationInFrames } = useVideoConfig()

// Fade in during first 10% of video
const fadeInFrames = Math.floor(durationInFrames * 0.1)
const opacity = interpolate(frame.value, [0, fadeInFrames], [0, 1])

// Fade out during last 10%
const fadeOutStart = Math.floor(durationInFrames * 0.9)
const exitOpacity = interpolate(
  frame.value,
  [fadeOutStart, durationInFrames],
  [1, 0]
)
```

## Responsive Design

Scale elements based on video dimensions:

```js
const { width, height } = useVideoConfig()

// Font scales with video width
const titleSize = width * 0.08 // 8% of width

// Padding scales with smaller dimension
const padding = Math.min(width, height) * 0.05

// Center position
const centerX = width / 2
const centerY = height / 2
```

## Related

- [useVideoConfig](/pellicule/use-video-config) — The composable for accessing config
- [CLI](/pellicule/cli) — Command-line options for setting config
