---
prev:
  text: Easing
  link: /pellicule/easing
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

## Options

| Option       | Short | Default        | Description                       |
| ------------ | ----- | -------------- | --------------------------------- |
| `--output`   | `-o`  | `./output.mp4` | Output file path                  |
| `--duration` | `-d`  | `90`           | Duration in frames                |
| `--fps`      | `-f`  | `30`           | Frames per second                 |
| `--width`    | `-w`  | `1920`         | Video width in pixels             |
| `--height`   | `-h`  | `1080`         | Video height in pixels            |
| `--range`    | `-r`  |                | Frame range to render (start:end) |
| `--help`     |       |                | Show help message                 |
| `--version`  |       |                | Show version number               |

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
  PELLICULE  v0.0.0

  Input      Video.vue
  Output     output.mp4
  Resolution 1920x1080
  Duration   90 frames @ 30fps (3.0s)

  █████████████████░░░░░░░░░░░░░ 57% (51/90 @ 28.3 fps)
```

## Error Handling

### File Not Found

```bash
$ npx pellicule NotAFile

Error: File not found: NotAFile
```

Make sure the `.vue` file exists in your current directory.

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
