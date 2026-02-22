---
prev:
  text: Easing
  link: /pellicule/easing
next:
  text: Dev Preview
  link: /pellicule/dev-preview
---

# CLI Reference

The Pellicule CLI is the primary way to render videos. It takes a Vue component and outputs an MP4 file.

## Basic Usage

```bash
npx pellicule <input.vue> [options]
```

The `.vue` extension is optional — Pellicule will add it automatically if the file isn't found:

```bash
npx pellicule Video        # Looks for Video.vue
npx pellicule Video.vue    # Same result
```

Pellicule also checks your project's default video directory based on the detected framework. In a boring stack app, `pellicule InvoiceDemo` finds `assets/js/videos/InvoiceDemo.vue`. In a Laravel app, it finds `resources/js/Videos/InvoiceDemo.vue`. See [Integrations](/pellicule/integrations) for details.

## Options

| Option         | Short | Default        | Description                                      |
| -------------- | ----- | -------------- | ------------------------------------------------ |
| `--output`     | `-o`  | `./output.mp4` | Output file path                                 |
| `--duration`   | `-d`  | `90`           | Duration in frames                               |
| `--fps`        | `-f`  | `30`           | Frames per second                                |
| `--width`      | `-w`  | `1920`         | Video width in pixels                            |
| `--height`     | `-h`  | `1080`         | Video height in pixels                           |
| `--range`      | `-r`  |                | Frame range to render (start:end)                |
| `--audio`      | `-a`  |                | Audio file to include (mp3, wav, etc.)           |
| `--server-url` |       |                | Use a running dev server instead of starting one |
| `--bundler`    |       |                | Force a specific bundler (`vite` or `rsbuild`)   |
| `--config`     |       |                | Path to a specific config file                   |
| `--videos-dir` |       |                | Override the default video directory             |
| `--out-dir`    |       |                | Directory for rendered video output              |
| `--help`       |       |                | Show help message                                |
| `--version`    |       |                | Show version number                              |

### Project Config (package.json)

Instead of passing integration flags on every command, set them once in your `package.json`:

```json
{
  "pellicule": {
    "serverUrl": "http://localhost:3000",
    "videosDir": "app/videos",
    "outDir": "./renders",
    "bundler": "rsbuild"
  }
}
```

| Key         | Type   | Description                                           |
| ----------- | ------ | ----------------------------------------------------- |
| `serverUrl` | string | URL of a running dev server (BYOS mode)               |
| `videosDir` | string | Custom directory for video components (relative path) |
| `outDir`    | string | Directory for rendered video output (relative path)   |
| `bundler`   | string | Force `vite` or `rsbuild`                             |

When `outDir` is set and no `-o` flag is passed, the output filename is derived from the component name. For example, `pellicule InvoiceDemo` with `outDir` set to `./renders` writes to `./renders/InvoiceDemo.mp4`.

Resolution order: **CLI flags > package.json > auto-detected > defaults**.

### Integration Options

Most projects never need these — Pellicule auto-detects your project type and config, and the package.json `pellicule` key handles project-wide settings. These CLI flags are escape hatches for one-off overrides.

```bash
# Override the default Nuxt server URL (defaults to localhost:3000)
pellicule AppDemo --server-url http://localhost:4000

# Force Rsbuild adapter
pellicule Video --bundler rsbuild

# Point at a specific config file
pellicule Video --config ./custom/vite.config.js

# Override where Pellicule looks for video files
pellicule InvoiceDemo --videos-dir ./my/videos
```

## Examples

### Render with Defaults

```bash
npx pellicule Video
```

Renders `Video.vue` to `output.mp4` at 1920×1080, 30fps, for 90 frames (3 seconds).

### Custom Output Path

```bash
npx pellicule Video -o intro.mp4
npx pellicule Video --output ./renders/my-video.mp4
```

### Duration

Duration is specified in **frames**, not seconds. To calculate frames:

```
frames = seconds × fps
```

```bash
# 5 seconds at 30fps = 150 frames
npx pellicule Video -d 150

# 10 seconds at 60fps = 600 frames
npx pellicule Video -d 600 -f 60
```

#### Quick Reference

| Seconds | 30fps | 60fps |
| ------- | ----- | ----- |
| 1s      | 30    | 60    |
| 3s      | 90    | 180   |
| 5s      | 150   | 300   |
| 10s     | 300   | 600   |
| 30s     | 900   | 1800  |
| 60s     | 1800  | 3600  |

### Resolution

```bash
# 720p
npx pellicule Video -w 1280 -h 720

# 1080p (default)
npx pellicule Video -w 1920 -h 1080

# 4K
npx pellicule Video -w 3840 -h 2160

# Square (Instagram)
npx pellicule Video -w 1080 -h 1080

# Vertical (TikTok/Reels)
npx pellicule Video -w 1080 -h 1920
```

### Frame Rate

```bash
# 24fps (cinematic)
npx pellicule Video -f 24

# 30fps (default, web standard)
npx pellicule Video -f 30

# 60fps (smooth motion)
npx pellicule Video -f 60
```

### Partial Rendering

Use `--range` (or `-r`) to render only a subset of frames. This is useful for faster iteration when working on a specific section of a longer video.

```bash
# Render only frames 100-200
npx pellicule Video -d 300 -r 100:200

# Render frames 0-50 (the beginning)
npx pellicule Video -d 300 -r 0:50

# Long form
npx pellicule Video -d 300 --range 150:250
```

The range format is `start:end` where:

- `start` is the first frame to render (inclusive)
- `end` is the last frame to render (exclusive)

::: tip
Partial rendering keeps `durationInFrames` unchanged so your animations calculate correctly. Only the specified frames are actually rendered and encoded.
:::

### Audio

Add background music or sound effects to your video with the `--audio` flag:

```bash
# Add background music
npx pellicule Video -a background.mp3

# With other options
npx pellicule Video -o intro.mp4 --audio music.wav
```

Supported formats include MP3, WAV, AAC, and any format FFmpeg supports. The audio is re-encoded to AAC for universal MP4 compatibility.

#### Audio Behavior

- **Video duration is the source of truth** — audio does not affect video length
- If audio is **shorter** than video: audio ends, video continues (silent for remainder)
- If audio is **longer** than video: audio is truncated to match video duration

#### Audio in defineVideoConfig

You can also specify audio directly in your component:

```vue
<script setup>
defineVideoConfig({
  durationInSeconds: 10,
  audio: './background.mp3'
})
</script>
```

The path is resolved relative to the component file. CLI flags override component config.

### Combined Example

A 10-second 4K video at 60fps for YouTube:

```bash
npx pellicule Video \
  -o youtube-intro.mp4 \
  -w 3840 \
  -h 2160 \
  -f 60 \
  -d 600
```

## Progress Output

While rendering, Pellicule shows a progress bar:

```
  PELLICULE  v0.0.3

  Input      Video.vue
  Output     output.mp4
  Resolution 1920x1080
  Duration   90 frames @ 30fps (3.0s)
  Audio      background.mp3

  █████████████████░░░░░░░░░░░░░ 57% (51/90 @ 28.3 fps)
```

The `Audio` line only appears when an audio file is specified.

## Error Handling

### File Not Found

```bash
$ npx pellicule NotAFile

Error: File not found: NotAFile
```

Make sure the `.vue` file exists in your current directory.

### Audio File Not Found

```bash
$ npx pellicule Video --audio missing.mp3

Error: Audio file not found: missing.mp3
```

Make sure the audio file exists. Paths in `defineVideoConfig` are resolved relative to the component file.

### FFmpeg Not Installed

```bash
Error: ffmpeg exited with code 127

Hint: Make sure FFmpeg is installed and available in your PATH
Install: https://ffmpeg.org/download.html
```

Install FFmpeg before using Pellicule:

- **macOS**: `brew install ffmpeg`
- **Ubuntu/Debian**: `sudo apt install ffmpeg`
- **Windows**: Download from [ffmpeg.org](https://ffmpeg.org/download.html)

### Invalid Vue Component

If your component has syntax errors or doesn't mount properly, you'll see the error in the output. Check your component renders correctly in a normal Vue app first.

## Exit Codes

| Code | Meaning                                     |
| ---- | ------------------------------------------- |
| 0    | Success                                     |
| 1    | Error (file not found, render failed, etc.) |

## Environment

Pellicule uses Playwright with Chromium for rendering. The first run may download the browser binary automatically.
