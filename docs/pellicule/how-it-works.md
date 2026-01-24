---
prev:
  text: What is Pellicule?
  link: /pellicule/what-is-pellicule
next:
  text: Getting Started
  link: /pellicule/getting-started
---

# How Pellicule Works

This page explains what happens when you run `npx pellicule` and how the rendering pipeline works under the hood.

## The Rendering Pipeline

When you render a video, Pellicule executes these steps:

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  Vite Dev   │ -> │  Playwright │ -> │  Screenshot │ -> │   FFmpeg    │
│   Server    │    │  (Browser)  │    │   Capture   │    │   Encode    │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

### 1. Vite Dev Server

Pellicule starts a Vite dev server that serves your Vue component. This gives you:

- Hot module replacement during development
- Full Vue 3 support with single-file components
- Access to the entire npm ecosystem

### 2. Playwright Browser

A headless Chromium browser (via Playwright) loads your component. The browser provides:

- Accurate CSS rendering
- Web font support
- Canvas and SVG support
- The same rendering you see in development

### 3. Frame-by-Frame Capture

Here's where the actual rendering happens:

```js
for (let frame = 0; frame < durationInFrames; frame++) {
  // Update the frame number in the Vue app
  await page.evaluate((f) => (window.__PELLICULE_FRAME__ = f), frame)

  // Wait for Vue to re-render
  await page.waitForTimeout(0)

  // Capture screenshot as raw PNG
  const screenshot = await page.screenshot()

  // Send to FFmpeg
  ffmpeg.stdin.write(screenshot)
}
```

Each frame is captured sequentially. The `useFrame()` composable reads from `window.__PELLICULE_FRAME__`, and Vue's reactivity system re-renders your component.

### 4. FFmpeg Encoding

All captured frames are piped directly to FFmpeg, which encodes them into the final MP4:

```bash
ffmpeg -framerate 30 -f image2pipe -i - -c:v libx264 -pix_fmt yuv420p output.mp4
```

## Performance Characteristics

### Current Approach: Sequential Capture

Pellicule captures frames one at a time. For a 10-second video at 30fps (300 frames), this means:

1. Render frame 0, screenshot, send to FFmpeg
2. Render frame 1, screenshot, send to FFmpeg
3. ... repeat 300 times

This approach is:

- **Simple and reliable** - Easy to debug, predictable behavior
- **Memory efficient** - Only one frame in memory at a time
- **Not parallelized** - Frames are processed sequentially

### Rendering Speed

Typical rendering speeds on modern hardware:

| Resolution | Complexity        | Speed      |
| ---------- | ----------------- | ---------- |
| 1080p      | Simple animations | ~25 fps    |
| 1080p      | Complex scenes    | ~10-15 fps |
| 4K         | Simple animations | ~8-12 fps  |
| 4K         | Complex scenes    | ~3-5 fps   |

A 30-second video at 1080p typically renders in 30-60 seconds.

### Future Optimizations

Areas we're exploring for future versions:

- **Frame batching** - Capture multiple frames before encoding
- **Parallel rendering** - Use multiple browser instances
- **Incremental rendering** - Only re-render changed portions

## Audio Support

Audio is not currently supported. Pellicule focuses on visual rendering.

If you need audio, you can add it post-render with FFmpeg:

```bash
# Render video with Pellicule
npx pellicule -d 300 -o video.mp4

# Add audio track with FFmpeg
ffmpeg -i video.mp4 -i audio.mp3 -c:v copy -c:a aac -shortest final.mp4
```

Audio sync is on the roadmap for future versions.

## Rendering Environment

### Browser Context (Not SSR)

Pellicule renders in a real browser, not via server-side rendering. This means:

- Full DOM and CSSOM available
- Web APIs work (Canvas, requestAnimationFrame, etc.)
- Browser fonts render correctly
- No SSR hydration issues

Your component runs in Chromium, exactly like it would in a user's browser.

### Deterministic Output

The key principle is that your component is a **pure function of the frame number**:

```
f(frame) → pixels
```

Given frame 42, your component always produces identical output. This enables:

- **Reproducible renders** - Same input, same output
- **Partial rendering** - Re-render just frames 100-200 with `-r 100:200`
- **Debugging** - Jump to any frame in isolation

Avoid these in your components:

- `Date.now()` or `new Date()`
- `Math.random()`
- Network requests that may return different data
- Any time-based APIs

Instead, derive everything from the frame number.

## File Formats

### Input

Pellicule accepts `.vue` single-file components:

```bash
npx pellicule Video.vue
npx pellicule src/intro.vue -o intro.mp4
```

### Output

Currently supports MP4 with H.264 encoding. The output is web-optimized and plays in all modern browsers and video players.

## Dependencies

Pellicule requires:

- **Node.js 18+** - For modern JavaScript features
- **FFmpeg** - For video encoding (must be in PATH)
- **Vue 3** - As a peer dependency

Playwright downloads its own Chromium binary automatically.
