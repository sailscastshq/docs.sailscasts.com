---
prev:
  text: CLI
  link: /pellicule/cli
next:
  text: Agent Skills
  link: /pellicule/agent-skills
---

# Dev Preview

The `pellicule dev` command starts a live preview server that lets you see your video composition in the browser as you work. Changes are hot-reloaded instantly — no need to render a full video just to check an animation.

## Usage

```bash
npx pellicule dev
```

This starts a dev server and opens your browser with an interactive preview of `Video.vue`.

### Preview a Specific Component

```bash
npx pellicule dev MyVideo
```

### Override Resolution

```bash
npx pellicule dev MyVideo -w 1280 -h 720
```

All standard [CLI options](/pellicule/cli) work with `pellicule dev` — resolution, fps, duration, bundler, server-url, etc.

## Preview Controls

The preview overlay appears at the bottom of the browser window with playback controls:

| Control               | Action                       |
| --------------------- | ---------------------------- |
| Play / Pause button   | Start or stop auto-playback  |
| Previous frame button | Step back one frame          |
| Next frame button     | Step forward one frame       |
| Timeline scrubber     | Seek to any frame            |
| Frame counter         | Shows current frame and time |

### Keyboard Shortcuts

| Key     | Action              |
| ------- | ------------------- |
| `Space` | Play / Pause        |
| `←`     | Previous frame      |
| `→`     | Next frame          |
| `Home`  | Jump to first frame |
| `End`   | Jump to last frame  |

## How It Works

`pellicule dev` reuses the same rendering pipeline as `pellicule` but skips the Playwright + FFmpeg step. Under the hood:

1. Starts a Vite (or Rsbuild) dev server — same as during a render
2. Opens your browser instead of launching headless Chromium
3. Injects the preview overlay controls into the page
4. Uses the same `window.__PELLICULE_SET_FRAME__()` mechanism as the renderer

This means what you see in preview is exactly what you'll get in the final render.

### Hot Module Replacement

Since the preview runs on Vite's dev server, file changes are hot-reloaded automatically. Edit your `.vue` file, save, and the preview updates instantly without losing your current frame position.

## Framework Support

`pellicule dev` works with all supported frameworks:

| Framework        | How It Works                                           |
| ---------------- | ------------------------------------------------------ |
| Standalone       | Starts a built-in Vite dev server                      |
| Vite             | Starts Vite with your existing config merged in        |
| Rsbuild          | Starts Rsbuild with your existing config merged in     |
| The Boring Stack | Starts Rsbuild with Shipwright config                  |
| Laravel          | Starts Vite with your Laravel config merged in         |
| Nuxt             | Connects to your running Nuxt dev server (BYOS mode)   |
| Quasar           | Connects to your running Quasar dev server (BYOS mode) |

### BYOS Projects (Nuxt, Quasar)

For Nuxt and Quasar projects, start your framework's dev server first, then run `pellicule dev`:

```bash
# Terminal 1: Start your dev server
npm run dev

# Terminal 2: Start the preview
npx pellicule dev InvoiceDemo
```

Pellicule auto-detects the framework and connects to the running server.

## Adding a Dev Script

Add a `dev` script to your `package.json` for convenience:

```json
{
  "scripts": {
    "dev": "pellicule dev",
    "render": "pellicule -o output.mp4"
  }
}
```

Then simply:

```bash
npm run dev
```

## Workflow

The recommended workflow with `pellicule dev` is:

1. **Start the preview** — `npx pellicule dev`
2. **Edit your component** — modify animations, styles, timing
3. **Save** — HMR instantly refreshes the preview
4. **Scrub and play** — use the controls to check different parts of the video
5. **Render** — when you're happy, run `npx pellicule` to produce the final MP4
