---
title: Breadcrumb
titleTemplate: Klean UI
description: Durable location hierarchy with framework-native Inertia links, truthful current-page semantics, and automatic responsive condensation across Vue, React, and Svelte.
outline: [2, 3]
---

<script setup>
import CopyCode from '../../.vitepress/theme/components/CopyCode.vue'
import KleanInstallation from '../../.vitepress/theme/components/KleanInstallation.vue'
import KleanPreview from '../../.vitepress/theme/components/KleanPreview.vue'
import KleanBreadcrumb from '../../.vitepress/theme/components/klean/breadcrumb/Breadcrumb.vue'
import breadcrumbSource from '../../.vitepress/theme/components/klean/breadcrumb/Breadcrumb.vue?raw'
import reactSource from '../sources/breadcrumb/Breadcrumb.jsx?raw'
import svelteSource from '../sources/breadcrumb/Breadcrumb.svelte?raw'
import vueUsage from '../snippets/breadcrumb/usage.vue?raw'
import reactUsage from '../snippets/breadcrumb/usage.jsx?raw'
import svelteUsage from '../snippets/breadcrumb/usage.svelte?raw'

const previewItems = [
  { label: 'Projects', href: '/' },
  { label: 'Slipway', href: '/projects/slipway' },
  { label: 'Production', href: '/projects/slipway/environments/production' },
  { label: 'API', href: '/projects/slipway/environments/production/apps/api' },
  { label: 'Settings' }
]

function stopPreviewNavigation(event) {
  if (event.target.closest?.('a')) event.preventDefault()
}
</script>

# Breadcrumb

Breadcrumb tells people where the current page lives in an application hierarchy. Pass one ordered list. Klean makes every ancestor with an `href` a real framework-native Inertia Link and infers the final item as the current page.

There is no item component, link adapter, separator prop, collapse setting, visual variant, or route configuration. The Boring Stack already has a Link, and the ordered data already says what the trail means.

<KleanPreview id="breadcrumb-source" :source="breadcrumbSource" filename="Breadcrumb.vue">
  <template #preview>
    <div
      class="w-full max-w-3xl rounded-lg border border-gray-200 bg-white px-4 dark:border-gray-800 dark:bg-gray-950"
      @click.capture="stopPreviewNavigation"
    >
      <KleanBreadcrumb :items="previewItems" />
    </div>
  </template>
  <template #source>

<<< ../../.vitepress/theme/components/klean/breadcrumb/Breadcrumb.vue

  </template>
  <template #caption>
    Narrow this preview to see one semantic trail retain the root, nearest parent, and current page.
  </template>
</KleanPreview>

## Installation

One command detects Vue, React, or Svelte, installs the matching official Inertia adapter when needed, and writes one editable source file into the conventional component directory:

<KleanInstallation
  id="breadcrumb-installation"
  component="breadcrumb"
  :source="breadcrumbSource"
  filename="Breadcrumb.vue"
  destination="assets/js/components/ui/breadcrumb/Breadcrumb.vue"
  :dependencies="['@inertiajs/vue3', 'tailwind-merge']"
/>

There is no initializer, provider, `klean-ui.json`, generated class helper, or runtime Klean package to configure.

## Usage

Write the hierarchy your page already knows. Ancestors receive destinations; the final item does not need one.

### Vue

<CopyCode :code="vueUsage" label="ProjectBreadcrumb.vue" />

### React

<CopyCode :code="reactUsage" label="ProjectBreadcrumb.jsx" />

### Svelte

<CopyCode :code="svelteUsage" label="ProjectBreadcrumb.svelte" />

The object shape is identical in every framework. Only the framework's ordinary component syntax changes.

## API

| Input                 | Default      | Purpose                                                                  |
| --------------------- | ------------ | ------------------------------------------------------------------------ |
| `items`               | required     | Ordered `{ label, href?, title? }` records ending with the current page. |
| `aria-label`          | `Breadcrumb` | Accessible name for the navigation landmark.                             |
| `class` / `className` | —            | Ordinary Tailwind classes merged on the navigation root.                 |
| native attributes     | —            | IDs, test hooks, and other navigation attributes forwarded to the root.  |

The final record is always rendered as current-page text with `aria-current="page"`. If it accidentally contains an `href`, Klean ignores that destination instead of creating a link to the page the user is already viewing. Earlier records without an `href` are truthful plain text.

`title` is optional native text for a truncated or technical label, such as a full filename or record identifier. Klean does not invent a second label API.

## Durable by default

Breadcrumb is navigation, so its ancestors remain destinations rather than click handlers:

- Vue, React, and Svelte use their official Inertia Link automatically;
- modified clicks, opening in a new tab, prefetch policy, and browser history remain native framework behavior;
- every destination is visible in the rendered markup and can be copied or inspected;
- the current page is not a redundant link;
- the navigation landmark contains one ordered list at every width;
- decorative chevrons stay out of the accessibility tree;
- no trail state is written to local storage or recreated from browser history.

The application still owns route construction, authorization, localization, and the labels that truthfully describe its hierarchy.

## Responsive paths and long names

Deep trails condense automatically when the component's own container is narrow. Klean keeps the root, a non-interactive ellipsis, the nearest parent, and the current page. When the container has enough room, the omitted ancestors return. This works inside compact headers and panels without relying on the viewport or rendering a second mobile landmark.

Labels truncate rather than forcing the page wider. Supply a native `title` when preserving the complete text on hover is useful:

```vue
<Breadcrumb
  :items="[
    { label: 'Projects', href: '/' },
    {
      label: project.name,
      href: `/projects/${project.slug}`,
      title: project.name
    },
    { label: file.name, title: file.name }
  ]"
/>
```

Do not put omitted ancestors inside an interactive menu merely because the path is long. An ellipsis here describes responsive omission; it does not pretend to be an action. If a product genuinely needs ancestor discovery, compose a separately labelled [Menu](/klean-ui/components/menu).

## Styling with Tailwind

The installed file is application source, so edit its baseline classes when the whole product needs a different treatment. For a contextual finish, target the stable data slots with ordinary Tailwind:

```vue
<Breadcrumb
  :items="items"
  class="**:data-[slot=link]:font-medium **:data-[slot=link]:text-black/55 **:data-[slot=link]:hover:text-black **:data-[slot=current]:font-bold **:data-[slot=current]:text-black **:data-[slot=separator]:text-black/35"
/>
```

The available hooks are `breadcrumb`, `list`, `item`, `link`, `label`, `separator`, `ellipsis`, and `current`; the final item also has `data-state="current"`. These are styling seams, not a visual-variant API.

## Slipway migration recipe

Slipway pages already know their route hierarchy, so migration is data replacement rather than a routing abstraction:

```vue
<Breadcrumb
  :items="[
    { label: 'projects', href: '/' },
    { label: project.name, href: `/projects/${project.slug}` },
    {
      label: environment.name,
      href: `/projects/${project.slug}/environments/${environment.slug}`
    },
    { label: app.name, href: appUrl },
    { label: 'deployments' }
  ]"
/>
```

Use the same shape for Bridge records, Helm, Dock, and content-editor files. Keep any real Back button separate: Breadcrumb describes hierarchy, while Back follows visit history.

## When to use

Use Breadcrumb on deeply nested application pages where parent destinations help people understand or change location: project environments, app settings, deployments, Bridge records, content files, and administrative resources.

## When not to use

- Use an ordinary Back link or button when the intent is to return to the previous place rather than visit a parent.
- Use [Tabs](/klean-ui/components/tabs) when the choices are peer sections or peer routes, not ancestors.
- Use Sidebar or primary navigation for the application's global destinations.
- Use a numbered step list for progress through a workflow.
- Omit Breadcrumb when the page has no meaningful hierarchy or the same information is already clear and nearby.

## Complete framework source

Copy, inspect, and change the complete one-file source for your framework.

### Vue source

<CopyCode :code="breadcrumbSource" label="Breadcrumb.vue" />

### React source

<CopyCode :code="reactSource" label="Breadcrumb.jsx" />

### Svelte source

<CopyCode :code="svelteSource" label="Breadcrumb.svelte" />

## Related components

- [Tabs](/klean-ui/components/tabs) — handles peer panels or routes instead of parent hierarchy.
- [Menu](/klean-ui/components/menu) — supplies a real interactive list when ancestor discovery is intentionally required.
- [Pagination](/klean-ui/components/pagination) — navigates pages within one collection rather than locations in the application hierarchy.
- [Button](/klean-ui/components/button) — provides a truthful Back action when visit history, not hierarchy, is the intent.
