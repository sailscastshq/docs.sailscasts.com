---
prev:
  text: Getting Started
  link: /pellicule/getting-started
next:
  text: Vite
  link: /pellicule/vite
---

# Integrations

Pellicule doesn't live in isolation. It works inside the apps you already build — whether that's a standalone Vite project, a Laravel app, a Nuxt app, or a [Boring Stack](https://docs.sailscasts.com/boring-stack) app powered by Shipwright.

## No Config File

Most tools that integrate with your project ask you to create a dedicated config file. You define your aliases, plugins, and bundler settings in _their_ format, duplicating what you already told your build tool. Then when your project config changes, you update two files instead of one.

Pellicule doesn't do this. **Your project's existing config is the Pellicule config.**

When you run `pellicule`, it looks at your project and figures out what you are:

| What Pellicule finds                       | What it does                                    |
| ------------------------------------------ | ----------------------------------------------- |
| `vite.config.js` or `vite.config.ts`       | Uses the Vite adapter, loads your config        |
| `rsbuild.config.js` or `rsbuild.config.ts` | Uses the Rsbuild adapter, loads your config     |
| `config/shipwright.js`                     | Uses the Rsbuild adapter, reads the `build` key |
| `nuxt.config.ts` or `nuxt.config.js`       | BYOS mode — connects to `localhost:3000`        |
| `quasar.config.js`                         | Detects Vite or Webpack mode                    |
| Nothing                                    | Built-in Vite adapter, zero config              |

That last row is important. If you scaffolded a project with `npm create pellicule`, there are no config files to detect — and Pellicule works exactly as it always has. Standalone projects are unaffected.

## Where Videos Live

Every framework has conventions for where components go. Pages live in one directory, shared components in another. Pellicule follows these conventions and adds `videos/` right next to them.

| Your project                  | Videos go in           | Next to                                     |
| ----------------------------- | ---------------------- | ------------------------------------------- |
| Standalone (create-pellicule) | `./` (project root)    | `Video.vue` in the root, like today         |
| Standalone Vite               | `src/videos/`          | `src/components/`, `src/pages/`             |
| Rsbuild                       | `src/videos/`          | `src/components/`, `src/pages/`             |
| Boring stack (Shipwright)     | `assets/js/videos/`    | `assets/js/pages/`, `assets/js/components/` |
| Laravel + Inertia             | `resources/js/Videos/` | `resources/js/Pages/`                       |
| Nuxt                          | `app/videos/`          | `app/components/`, `app/pages/`             |
| Quasar                        | `src/videos/`          | `src/pages/`, `src/components/`             |

When you run `pellicule InvoiceDemo`, Pellicule checks:

1. Does `./InvoiceDemo.vue` exist? Use it.
2. Does `{videosDir}/InvoiceDemo.vue` exist? Use it.
3. Neither? Error with a helpful message showing where it looked.

You can always pass a full path if you want to render any `.vue` file — the smart defaults just save keystrokes for the common case.

## Project Config

If you need to set options that apply to every `pellicule` command in your project — like `serverUrl` for Nuxt — add a `pellicule` key to your `package.json`:

```json
{
  "pellicule": {
    "serverUrl": "http://localhost:3000"
  }
}
```

Supported keys:

| Key         | Type   | Description                                           |
| ----------- | ------ | ----------------------------------------------------- |
| `serverUrl` | string | URL of a running dev server (BYOS mode)               |
| `videosDir` | string | Custom directory for video components (relative path) |
| `outDir`    | string | Directory for rendered video output (relative path)   |
| `bundler`   | string | Force `vite` or `rsbuild`                             |

The resolution order is: **CLI flags > package.json > auto-detected > defaults**. CLI flags always win, but the package.json config means you set it once and forget it.

## Overrides

If auto-detection gets it wrong or you need something one-off, CLI flags override everything:

```bash
# Force a specific bundler
pellicule Video.vue --bundler rsbuild

# Point at a specific config file
pellicule Video.vue --config ./custom/vite.config.js

# Override default Nuxt server URL
pellicule Video.vue --server-url http://localhost:4000

# Custom video directory
pellicule InvoiceDemo --videos-dir ./my/custom/path
```

These are escape hatches, not the default path. Most projects never need them.

## Importing Your App's Components

The whole point of integrations is that your video components can import real components from your app:

```vue
<script setup>
import { computed } from 'vue'
import { useFrame, interpolate } from 'pellicule'
import InvoiceCard from '@/components/InvoiceCard.vue'
import PriceTag from '@/components/PriceTag.vue'

const frame = useFrame()
const opacity = computed(() => interpolate(frame.value, [0, 30], [0, 1]))
</script>

<template>
  <div class="video" :style="{ opacity }">
    <InvoiceCard :invoice="sampleInvoice">
      <PriceTag amount="2,400" currency="USD" />
    </InvoiceCard>
  </div>
</template>
```

The `@/components/` alias resolves because Pellicule loaded your project's config — whether that's a Vite `resolve.alias`, a Shipwright Rsbuild alias, or a Nuxt auto-import. You didn't configure anything extra.

## Choose Your Integration

- [Vite](/pellicule/vite) — Standalone Vite projects
- [Rsbuild](/pellicule/rsbuild) — Standalone Rsbuild projects
- [The Boring Stack](/pellicule/boring-stack) — Sails.js apps with Shipwright
- [Laravel](/pellicule/laravel) — Laravel + Inertia + Vue
- [Nuxt](/pellicule/nuxt) — Nuxt 3 and Nuxt 4
- [Quasar](/pellicule/quasar) — Quasar Framework
