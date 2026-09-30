---
title: Flag
titleTemplate: Klean UI
description: A local country flag image with decorative defaults, custom source precedence, resilient fallback, and caller-owned Tailwind across Vue, React, and Svelte.
outline: [2, 3]
---

<script setup>
import CopyCode from '../../.vitepress/theme/components/CopyCode.vue'
import KleanInstallation from '../../.vitepress/theme/components/KleanInstallation.vue'
import KleanPreview from '../../.vitepress/theme/components/KleanPreview.vue'
import Flag from '../../.vitepress/theme/components/klean/flag/Flag.vue'
import FlagExamples from '../../.vitepress/theme/components/klean/flag/FlagExamples.vue'
import vueSource from '../../.vitepress/theme/components/klean/flag/Flag.vue?raw'
import reactSource from '../sources/flag/Flag.jsx?raw'
import svelteSource from '../sources/flag/Flag.svelte?raw'
import vueUsage from '../snippets/flag/usage.vue?raw'
import reactUsage from '../snippets/flag/usage.jsx?raw'
import svelteUsage from '../snippets/flag/usage.svelte?raw'
import selectSource from '../../.vitepress/theme/components/klean/flag/FlagExamples.vue?raw'
const frameworks = [
  { id: 'vue', label: 'Vue', filename: 'Flag.vue', destination: 'assets/js/components/ui/flag/Flag.vue', source: vueSource },
  { id: 'react', label: 'React', filename: 'Flag.jsx', destination: 'assets/js/components/ui/flag/Flag.jsx', source: reactSource },
  { id: 'svelte', label: 'Svelte', filename: 'Flag.svelte', destination: 'assets/js/components/ui/flag/Flag.svelte', source: svelteSource }
]
</script>

# Flag

Flag displays one chosen region as a native image. A case-insensitive two-letter `country` resolves to local flag art; a nonempty `src` overrides that registry. The image is decorative by default. Missing, invalid, or failed images reveal application-owned fallback content.

That is the behavioral contract. Width, shape, borders, color, and country-picker layout remain ordinary Tailwind and application markup. Country is explicit application data, never inferred ethnicity or nationality.

<KleanPreview id="flag-source" :source="vueSource" filename="Flag.vue">
  <template #preview>
    <div class="flex flex-wrap items-center gap-6">
      <Flag country="NG" alt="Nigeria" class="w-12" />
      <Flag country="KE" alt="Kenya" class="w-12" />
      <Flag country="GH" alt="Ghana" class="size-12 aspect-square rounded-full" />
      <Flag country="ZZ" alt="Country unavailable" class="w-12 text-gray-500 dark:text-gray-400">?</Flag>
    </div>
  </template>
  <template #source>

<<< ../../.vitepress/theme/components/klean/flag/Flag.vue

  </template>
</KleanPreview>

## Installation

::: warning Unreleased
Flag is currently in [Klean's Flag draft PR](https://github.com/sailscastshq/klean-ui/pull/161). Published `klean-ui@0.0.6` does not contain it yet. Use the source below or the feature CLI until a release includes Flag.
:::

The CLI installs the framework-native component and the licensed `flags.js` asset module beside it. There is no Klean runtime dependency, provider, initializer, or asset-host configuration.

<KleanInstallation id="flag-installation" component="flag" :frameworks="frameworks" :dependencies="['tailwind-merge']" />

For manual installation, copy the component for your framework **and** [download the complete licensed flags.js](/klean-ui/flag/flags.js) into the same `flag/` directory. Each displayed component imports `./flags.js`. Install `tailwind-merge` if your application does not already have it. Keep the license comment when editing or redistributing the asset module.

## Usage

### Vue

<CopyCode :code="vueUsage" label="Countries.vue" />

### React

<CopyCode :code="reactUsage" label="Countries.jsx" />

### Svelte

<CopyCode :code="svelteUsage" label="Countries.svelte" />

## API

| Input                          | Default | Purpose                                                                                                                                          |
| ------------------------------ | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `country`                      | `''`    | Case-insensitive two-letter code; surrounding whitespace is ignored. Only codes in the fixed local registry resolve.                             |
| `src`                          | `''`    | Custom image source. A nonempty value takes precedence over `country`.                                                                           |
| `alt`                          | `''`    | Empty for decorative flags; a meaningful label when the image communicates information without adjacent text.                                    |
| slot / children                | —       | Application-owned fallback content, shown only when no image resolves or the image fails.                                                        |
| `class` / `className`          | —       | Caller Tailwind merged after the neutral 24px-wide, 3:2 baseline.                                                                                |
| native image/global attributes | —       | IDs, titles, `loading`, `decoding`, `srcset`, `sizes`, ARIA and native image event hooks. Image-only attributes are removed from fallback spans. |
| element reference              | —       | Vue exposes `element`; React forwards `ref`; Svelte exposes `getElement()`. The reference points to the current image or fallback.               |

The installed `flags.js` also exports `countries`, a frozen code list, and `flagSource(country, src)` for local lookup. That asset list is not a country's localized name or a product eligibility policy.

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
  <Flag country="NG" />
  <span>Nigeria</span>
</span>
```

When the flag stands alone, supply the meaning: `<Flag country="NG" alt="Nigeria" />`. A missing or failed informative image becomes one named `role="img"` fallback. A decorative fallback is hidden from assistive technology. Deliberate caller `role`, `aria-label`, or `aria-hidden` semantics are respected.

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

<CopyCode :code="selectSource" label="CountryPicker.vue" />

The example deliberately offers four application-selected regions. A real product can derive localized names with `Intl.DisplayNames`, sort with `Intl.Collator`, and choose its own eligible list. A selected region must not be used to infer ethnicity, citizenship, or founder nationality.

## Assets, licensing and performance

Flag uses original Klean component behavior. No Flux proprietary implementation is included. The art comes from the npm distribution of [country-flag-icons](https://github.com/catamphetamine/country-flag-icons) **1.6.20**, licensed under MIT. Its complete copyright and permission notice travels inside installed `flags.js`. The tarball SHA-1 is `aa6f36104568993f9cd43e7da283f9b7d0a802cc`.

The pinned registry contains **257 entries**: 249 ISO 3166-1 codes plus `AC`, `EU`, `IC`, `TA`, `XA`, `XC`, `XK`, and `XO`. This describes the asset package's coverage; it is not a Unicode RGI registry or a political-status policy. Unsupported or malformed codes resolve to fallback. Use a custom source for other art.

The complete registry uses SVG data URLs: approximately **242KB raw / 67KB gzip**. Importing Flag includes that registry eagerly. Built-in flags make no image-host or tracking requests; there is no runtime asset dependency. Lazy-load an infrequently used picker, or trim application-owned assets when only a fixed subset is needed. The full-size registry is not free merely because it makes no network calls.

Allow `data:` in the application's CSP `img-src` when using built-in assets. Custom `src` follows the application's own network, CSP and privacy policy. Keep asset transformations, remote image hosting and product-specific country restrictions outside the primitive.

## Complete framework source

Copy the matching component and the [shared licensed asset module](/klean-ui/flag/flags.js). The live Vue preview renders this same source.

### Vue source

<CopyCode :code="vueSource" label="Flag.vue" />

### React source

<CopyCode :code="reactSource" label="Flag.jsx" />

### Svelte source

<CopyCode :code="svelteSource" label="Flag.svelte" />

## Related components

- [Select](/klean-ui/components/select) and [Combobox](/klean-ui/components/combobox) — own country choice and keyboard behavior.
- [Avatar](/klean-ui/components/avatar) — represents a person or application identity; Flag represents a chosen region.
- [Button](/klean-ui/components/button) — owns a real action or navigation destination around a flag.
- [Table](/klean-ui/components/table) — composes regional data with explicit labels; country inference and business meaning stay in the application.
