---
prev:
  text: Sequences
  link: /pellicule/sequences
next:
  text: useFrame
  link: /pellicule/use-frame
---

# defineVideoConfig

Declare video configuration directly in your component. This is a **compile-time macro** — you don't need to import it.

## Basic Usage

```vue
<script setup>
// No import needed! defineVideoConfig is a compiler macro
defineVideoConfig({
  durationInSeconds: 5
})

import { useFrame } from 'pellicule'
const frame = useFrame()
</script>
```

Then render with zero flags:

```bash
npx pellicule Video.vue
```

That's it! Pellicule reads the duration from your component.

## Why a Macro?

`defineVideoConfig` works like Vue's `defineProps` — it's recognized by the compiler and doesn't exist at runtime. This gives you:

- **Zero boilerplate** — no imports needed
- **Self-documenting components** — duration is declared where it's used
- **IDE support** — static analysis tools can read the config

## Configuration Options

| Property            | Type     | Default | Description                       |
| ------------------- | -------- | ------- | --------------------------------- |
| `durationInSeconds` | `number` | -       | Duration in seconds (recommended) |
| `durationInFrames`  | `number` | `90`    | Duration in frames                |
| `fps`               | `number` | `30`    | Frames per second                 |
| `width`             | `number` | `1920`  | Video width in pixels             |
| `height`            | `number` | `1080`  | Video height in pixels            |

Use either `durationInSeconds` or `durationInFrames`, not both.

## Examples

### Simple Duration

```vue
<script setup>
defineVideoConfig({
  durationInSeconds: 5
})
</script>
```

### 4K Video at 60fps

```vue
<script setup>
defineVideoConfig({
  durationInSeconds: 10,
  fps: 60,
  width: 3840,
  height: 2160
})
</script>
```

### Square Video (Instagram)

```vue
<script setup>
defineVideoConfig({
  durationInSeconds: 15,
  width: 1080,
  height: 1080
})
</script>
```

### Precise Frame Count

```vue
<script setup>
defineVideoConfig({
  durationInFrames: 147 // Exactly 147 frames
})
</script>
```

## How It Works

```
┌─────────────────────────────────────────────────────────────┐
│  1. You write defineVideoConfig() in <script setup>        │
│  2. CLI extracts config before rendering                    │
│  3. Vite plugin strips the call during compilation          │
│  4. Component gets values via useVideoConfig() at runtime   │
└─────────────────────────────────────────────────────────────┘
```

The macro is processed at compile time:

1. **CLI extracts** — Parses your `.vue` file and reads the config values
2. **Plugin strips** — Removes the `defineVideoConfig()` call before Vue compiles
3. **Runtime receives** — Your component accesses values via `useVideoConfig()`

## Priority Order

CLI flags always win:

```
CLI flags > defineVideoConfig > built-in defaults
```

Override component config with CLI flags:

```bash
# Component says 5 seconds, but render 10 instead
npx pellicule Video.vue -d 300
```

## Relationship with useVideoConfig

|             | `defineVideoConfig`     | `useVideoConfig`     |
| ----------- | ----------------------- | -------------------- |
| **When**    | Compile time            | Runtime              |
| **Purpose** | Declare intended config | Access actual values |
| **Import**  | Not needed (macro)      | Required             |
| **Used by** | CLI                     | Component code       |

Use both together:

```vue
<script setup>
// Macro - declares what this video should be
defineVideoConfig({
  durationInSeconds: 5
})

// Composable - reads actual values (might differ if CLI overrides)
import { useFrame, useVideoConfig } from 'pellicule'

const frame = useFrame()
const { fps, durationInFrames, width, height } = useVideoConfig()
</script>
```

## Static Values Only

The macro extracts values at **compile time**, so use literal values:

```vue
<script setup>
// ✅ Works - literal values
defineVideoConfig({
  durationInSeconds: 5,
  fps: 30
})

// ❌ Won't work - computed values
const FPS = 30
defineVideoConfig({
  durationInFrames: FPS * 5 // Can't evaluate at compile time
})
</script>
```

Use `durationInSeconds` instead of computing frames manually.
