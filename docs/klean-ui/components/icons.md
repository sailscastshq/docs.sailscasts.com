---
title: Icons
titleTemplate: Klean UI
description: Original source-owned SVG icons with one quiet visual voice, exact Vue, React, and Svelte components, and caller-owned styling.
outline: [2, 3]
---

<script setup>
import CopyCode from '../../.vitepress/theme/components/CopyCode.vue'
import KleanFrameworkCode from '../../.vitepress/theme/components/KleanFrameworkCode.vue'
import KleanInstallation from '../../.vitepress/theme/components/KleanInstallation.vue'
import IconGallery from '../../.vitepress/theme/components/klean/icons/IconGallery.vue'
import { iconSource, icons } from '../../.vitepress/theme/components/klean/icons/icons.js'
import vueUsage from '../snippets/icons/usage.vue?raw'
import reactUsage from '../snippets/icons/usage.jsx?raw'
import svelteUsage from '../snippets/icons/usage.svelte?raw'

const trash = icons.find(({ slug }) => slug === 'trash')
const frameworkSources = [
  {
    id: 'vue',
    label: 'Vue',
    filename: 'Trash.vue',
    destination: 'assets/js/components/ui/icons/Trash.vue',
    source: iconSource(trash, 'vue')
  },
  {
    id: 'react',
    label: 'React',
    filename: 'Trash.jsx',
    destination: 'assets/js/components/ui/icons/Trash.jsx',
    source: iconSource(trash, 'react')
  },
  {
    id: 'svelte',
    label: 'Svelte',
    filename: 'Trash.svelte',
    destination: 'assets/js/components/ui/icons/Trash.svelte',
    source: iconSource(trash, 'svelte')
  }
]

const usageFrameworks = [
  {
    id: 'vue',
    label: 'Vue',
    filename: 'DeleteInvoice.vue',
    language: 'vue',
    code: vueUsage
  },
  {
    id: 'react',
    label: 'React',
    filename: 'DeleteInvoice.jsx',
    language: 'jsx',
    code: reactUsage
  },
  {
    id: 'svelte',
    label: 'Svelte',
    filename: 'DeleteInvoice.svelte',
    language: 'svelte',
    code: svelteUsage
  }
]
</script>

# Icons

Klean Icons is a focused family of 98 original SVGs drawn from the actions and objects that repeat across Slipway and Hagfish. Every mark uses the same 24px canvas, calm 1.5px stroke, rounded joins, and optical rhythm.

There is no icon font, runtime package, provider, icon registry in the browser, size prop, color prop, or variant API. Install only the source you use. Then style ordinary SVG with Tailwind or native attributes.

<IconGallery />

Search is reflected in the page URL, so a filtered catalog can be reloaded, bookmarked, and shared. Framework choice is remembered across the Klean docs.

## Installation

Install one icon by its lowercase name. The CLI detects Vue, React, or Svelte and writes the matching source into the conventional <code>icons</code> directory:

<KleanInstallation
  id="icon-installation"
  component="icon trash"
  :frameworks="frameworkSources"
  :dependencies="[]"
/>

Install several icons in one command when a screen needs a set:

<CopyCode code="npx klean-ui add icon trash search calendar" label="Terminal" />

Re-running <code>add</code> preserves changed local source. Use <code>klean-ui check icon trash</code>, <code>diff icon trash</code>, or <code>update icon trash</code> when you deliberately review upstream changes.

## Usage

The component is decorative by default. Put its meaning in visible button or link text, or in the accessible name of the semantic parent control.

<KleanFrameworkCode
  id="icon-usage"
  :frameworks="usageFrameworks"
  label="Icon usage framework"
/>

## Styling

Icons use <code>1em</code> for width and height and <code>currentColor</code> for stroke. Text size and color utilities therefore work without a Klean-specific API:

```vue
<Search class="size-5 text-blue-600" />
<Bell class="size-4 text-gray-500" stroke-width="1.75" />
<Rocket class="size-8 text-orange-500" />
```

Use `size-*`, `text-*`, opacity, responsive, state, and dark-mode utilities directly. Native SVG attributes such as <code>stroke-width</code>, <code>aria-label</code>, and <code>role</code> are forwarded by every framework component.

Do not make every icon louder to create hierarchy. Start with one color and one stroke weight. Let placement, visible text, and the parent control carry most of the meaning.

## API

| Input                                                | Default          | Purpose                                                                                  |
| ---------------------------------------------------- | ---------------- | ---------------------------------------------------------------------------------------- |
| <code>class</code> / <code>className</code>          | —                | Ordinary Tailwind sizing, color, opacity, state, responsive, and dark-mode utilities.    |
| <code>stroke-width</code> / <code>strokeWidth</code> | <code>1.5</code> | Native SVG stroke override for a deliberate product treatment.                           |
| other SVG attributes                                 | native           | IDs, data hooks, event handlers, roles, labels, and other framework-native SVG inputs.   |
| element reference                                    | —                | Framework-native access to the SVG element when genuinely needed.                        |
| accessible presentation                              | decorative       | Hidden from assistive technology by default; override only for a truly informative mark. |

There is no <code>size</code>, <code>color</code>, <code>tone</code>, <code>variant</code>, <code>label</code>, <code>title</code>, <code>spin</code>, <code>filled</code>, or <code>as</code> prop. CSS and SVG already provide those capabilities without another naming layer.

## Accessibility

Prefer visible text. In a button that says “Delete”, Trash is decorative and should stay hidden from assistive technology. For an icon-only control, name the button—not the SVG:

```vue
<button type="button" aria-label="Delete invoice">
  <Trash class="size-5" />
</button>
```

Only make the SVG itself informative when it stands alone and no semantic parent can own its name:

```vue
<CheckCircle
  class="size-5 text-emerald-600"
  role="img"
  aria-hidden="false"
  aria-label="Payment complete"
/>
```

- Never rely on the icon alone when a destructive, irreversible, unfamiliar, or status-changing action needs text.
- Keep touch and pointer targets on the parent Button or link at least 44px; enlarging the SVG does not enlarge the target.
- Do not encode status with color alone. Pair the mark with useful text.
- Avoid redundant names such as a labeled button containing a separately labeled icon.
- Icons are not focusable. Keyboard focus belongs to the control that owns the action.

## Why source-owned icons

An icon is interface source, not an opaque service. Installing the exact Vue, React, or Svelte component means an application can inspect it, change geometry when its product genuinely needs to, and keep rendering without a Klean runtime.

The shared 24px geometry keeps Slipway and Hagfish recognizable as part of the same ecosystem. <code>currentColor</code>, native attributes, and caller-owned classes let each product retain its own density, palette, contrast, and motion without forking an icon library API.

Updates are deliberate. Klean never silently replaces local geometry. The CLI shows whether an installed icon differs, and the application chooses when to inspect and accept a new source version.

## Naming

Use the concrete object or action: <code>Trash</code>, <code>Search</code>, <code>Calendar</code>, <code>Copy</code>. Do not encode placement, product, color, or size into the exported name. The same <code>Bell</code> can appear in a header, notification preference, or activity feed without becoming three components.

The CLI uses lowercase kebab-case names while framework exports use PascalCase:

```sh
npx klean-ui add icon check-circle chevron-right
```

```js
import CheckCircle from '@/components/ui/icons/CheckCircle.vue'
import ChevronRight from '@/components/ui/icons/ChevronRight.vue'
```

## When to use

Use Klean Icons for repeated application actions, navigation, statuses, dates, identity, infrastructure, notifications, and deployment language. Use the shared source when consistency is more valuable than a product-specific illustration.

## When not to use

- Use text without an icon when the mark adds no recognition or scanning value.
- Use a logo or product mark for brand identity; do not force a general interface icon to become one.
- Use an illustration for editorial, empty-state, onboarding, or marketing storytelling.
- Use [Spinner](/klean-ui/components/spinner) for indeterminate progress and [Avatar](/klean-ui/components/avatar) for resilient identity images.
- Keep highly specialized domain glyphs in the application until repeated use proves that they belong in the shared family.

## Related components

- [Button](/klean-ui/components/button) — owns action semantics, target size, pending state, and accessible naming around an icon.
- [Menu](/klean-ui/components/menu), [Command](/klean-ui/components/command), and [Tabs](/klean-ui/components/tabs) — compose icons with truthful actions, destinations, and navigation.
- [Tooltip](/klean-ui/components/tooltip) — adds brief supplementary text to a real icon-only control; it does not replace the control's accessible name.
- [Badge](/klean-ui/components/badge), [Alert](/klean-ui/components/alert), and [Toast](/klean-ui/components/toast) — pair status marks with visible language and truthful announcement behavior.
- [Avatar](/klean-ui/components/avatar), [Spinner](/klean-ui/components/spinner), and [Empty State](/klean-ui/components/empty-state) — cover nearby visual roles that should not be folded into the icon contract.
