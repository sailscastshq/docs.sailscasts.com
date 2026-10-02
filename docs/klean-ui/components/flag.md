---
title: Flag
titleTemplate: Klean UI
description: A local country flag image with derived country names, custom source precedence, resilient fallback, and caller-owned Tailwind across Vue, React, and Svelte.
outline: [2, 3]
---

<script setup>
import KleanInstallation from '../../.vitepress/theme/components/KleanInstallation.vue'
import KleanPreview from '../../.vitepress/theme/components/KleanPreview.vue'
import Flag from '../../.vitepress/theme/components/klean/flag/Flag.vue'
import FlagExamples from '../../.vitepress/theme/components/klean/flag/FlagExamples.vue'
import vueSource from '../../.vitepress/theme/components/klean/flag/Flag.vue?raw'
import reactSource from '../sources/flag/Flag.jsx?raw'
import svelteSource from '../sources/flag/Flag.svelte?raw'

import selectSource from '../../.vitepress/theme/components/klean/flag/FlagExamples.vue?raw'
const frameworks = [
  { id: 'vue', label: 'Vue', filename: 'Flag.vue', destination: 'assets/js/components/ui/flag/Flag.vue', source: vueSource },
  { id: 'react', label: 'React', filename: 'Flag.jsx', destination: 'assets/js/components/ui/flag/Flag.jsx', source: reactSource },
  { id: 'svelte', label: 'Svelte', filename: 'Flag.svelte', destination: 'assets/js/components/ui/flag/Flag.svelte', source: svelteSource }
]
</script>

# Flag

Display a country flag, style it with Tailwind, and add fallback content for missing images.

<KleanPreview id="flag-source" :source="vueSource" filename="Flag.vue">
  <template #preview>
    <div class="flex flex-wrap items-center gap-6">
      <Flag country="NG" class="w-12" />
      <Flag country="KE" class="w-12" />
      <Flag country="GH" class="size-12 aspect-square rounded-full" />
      <Flag country="ZZ" alt="Country unavailable" class="w-12 text-gray-500 dark:text-gray-400">?</Flag>
    </div>
  </template>
  <template #usage>

::: code-group

<<< ../snippets/flag/usage.vue [Vue]

<<< ../snippets/flag/usage.jsx [React]

<<< ../snippets/flag/usage.svelte [Svelte]

:::

  </template>
  <template #source>

<<< ../../.vitepress/theme/components/klean/flag/Flag.vue

  </template>
</KleanPreview>

## Installation

<KleanInstallation id="flag-installation" component="flag" :frameworks="frameworks" :dependencies="['tailwind-merge']" />

For manual installation, copy the matching framework source and [flags.js](/klean-ui/flag/flags.js) into the same `flag/` directory, and install `tailwind-merge`. Keep the asset module's license notice.

## Usage

Copy the [example above](#flag-source) for your framework.

## API

| Input                          | Default      | Purpose                                                                                                                                          |
| ------------------------------ | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `country`                      | `''`         | Case-insensitive two-letter code; surrounding whitespace is ignored. Only codes in the fixed local registry resolve.                             |
| `src`                          | `''`         | Custom image source. A nonempty value takes precedence over `country`.                                                                           |
| `alt`                          | country name | Omitted: stable English name for a known code. Any supplied string overrides it; `''` is decorative.                                             |
| slot / children                | —            | Application-owned fallback content, shown only when no image resolves or the image fails.                                                        |
| `class` / `className`          | —            | Caller Tailwind merged after the neutral 24px-wide, 3:2 baseline.                                                                                |
| native image/global attributes | —            | IDs, titles, `loading`, `decoding`, `srcset`, `sizes`, ARIA and native image event hooks. Image-only attributes are removed from fallback spans. |
| element reference              | —            | Vue exposes `element`; React forwards `ref`; Svelte exposes `getElement()`. The reference points to the current image or fallback.               |

The installed `flags.js` also exports `countryName(country)`, the stable English lookup, and `countries`, a frozen code list, and `flagSource(country, src)` for local lookup. That asset list is not a country's localized name or a product eligibility policy.

There are no `size`, `circle`, `variant`, `tone`, or `radius` props. The surrounding application owns interaction; Flag stays out of the tab order.

## Size and circular crops

Use `w-5`, `w-6`, `w-8`, `w-10`, or `w-12` for 20, 24, 32, 40, or 48px widths. The native image keeps a 3:2 box unless caller classes override it. For a circle, give the image a square box and rounded corners:

```vue
<Flag country="NG" class="w-5" />
<Flag country="KE" class="w-8" />
<Flag country="GH" class="size-10 aspect-square rounded-full" />
```

Circular cropping can hide details in a flag. Keep a visible country name when the distinction matters. These treatments are class recipes, not separate components or variants.

## Accessibility and fallback

A flag next to a country name should remain decorative:

```vue
<span class="inline-flex items-center gap-2">
  <Flag country="NG" alt="" />
  <span>Nigeria</span>
</span>
```

A standalone `<Flag country="NG" />` derives `alt="Nigeria"`. Override it with `<Flag country="NG" alt="Based in Nigeria" />` when application meaning differs. `alt` is a string, never a Boolean switch; a bare Vue `alt` means the empty string. A missing or failed informative image becomes one named `role="img"` fallback. A decorative fallback is hidden from assistive technology. Deliberate caller `role`, `aria-label`, or `aria-hidden` semantics are respected.

Changing the resolved image source retries after failure. Availability is ephemeral; Flag does not persist an image failure or the chosen country. The product owns the authoritative country record or draft.

```vue
<Flag country="ZZ" alt="Country unavailable">?</Flag>
<Flag country="NG" src="/flags/organization.svg" alt="Organization" />
```

A custom `src` never silently falls back to `country`: its precedence remains truthful even when that custom image fails.

## Country picker composition

Flag supplies an image, not a country-select widget. Use [Select](/klean-ui/components/select) for fixed choices or [Combobox](/klean-ui/components/combobox) for searchable choices. Keep eligible codes, localized labels, validation, persistence and network work in the application.

<KleanPreview id="flag-country-select" :source="selectSource" filename="CountryPicker.vue">
  <template #preview><FlagExamples /></template>
</KleanPreview>

The example deliberately offers four application-selected regions. A real product can derive localized names with `Intl.DisplayNames`, sort with `Intl.Collator`, and choose its own eligible list.

## Stable names and localization

Built-in flags use English country names by default. Pass a localized name as `alt`, or use `alt=""` beside a visible country label.

Missing or unsupported codes derive `""`. A custom `src` without a known `country` cannot identify image content: supply a meaningful explicit `alt` or an explicit empty string for decoration. Any nonempty custom `src` disables inferred naming, even with a known `country`, because that source could depict anything. Only an explicit `alt` labels a custom image.

## Assets, licensing and performance

The flag art comes from [country-flag-icons](https://github.com/catamphetamine/country-flag-icons), licensed under MIT. Its copyright and permission notice is included in `flags.js`.

The pinned registry contains **257 entries**: 249 ISO 3166-1 codes plus `AC`, `EU`, `IC`, `TA`, `XA`, `XC`, `XK`, and `XO`. This describes the asset package's coverage; it is not a Unicode RGI registry or a political-status policy. Unsupported or malformed codes resolve to fallback. Use a custom source for other art.

The complete registry uses SVG data URLs: approximately **246,858 bytes raw / 69,835 bytes gzip**. Importing Flag includes that registry eagerly. Built-in flags make no image-host or tracking requests; there is no runtime asset dependency. Lazy-load an infrequently used picker, or trim application-owned assets when only a fixed subset is needed. The full-size registry is not free merely because it makes no network calls.

Allow `data:` in the application's CSP `img-src` when using built-in assets. Custom `src` follows the application's own network, CSP and privacy policy. Keep asset transformations, remote image hosting and product-specific country restrictions outside the primitive.

## Complete framework source

Copy the matching component and the [shared licensed asset module](/klean-ui/flag/flags.js). The live Vue preview renders this same source.

::: code-group

<<< ../../.vitepress/theme/components/klean/flag/Flag.vue [Vue]

<<< ../sources/flag/Flag.jsx [React]

<<< ../sources/flag/Flag.svelte [Svelte]

:::

## Related components

- [Select](/klean-ui/components/select) and [Combobox](/klean-ui/components/combobox) — own country choice and keyboard behavior.
- [Avatar](/klean-ui/components/avatar) — represents a person or application identity; Flag represents a chosen region.
- [Button](/klean-ui/components/button) — owns a real action or navigation destination around a flag.
- [Table](/klean-ui/components/table) — composes regional data with explicit labels; country inference and business meaning stay in the application.
