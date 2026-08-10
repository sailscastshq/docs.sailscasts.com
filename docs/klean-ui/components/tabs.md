---
title: Tabs
titleTemplate: Klean UI
description: Accessible peer panels with roving focus, dynamic values, and caller-owned native buttons and Tailwind styling across Vue, React, and Svelte.
outline: [2, 3]
---

<script setup>
import { ref } from 'vue'
import CopyCode from '../../.vitepress/theme/components/CopyCode.vue'
import KleanInstallation from '../../.vitepress/theme/components/KleanInstallation.vue'
import KleanPreview from '../../.vitepress/theme/components/KleanPreview.vue'
import KleanTabs from '../../.vitepress/theme/components/klean/tabs/Tabs.vue'
import tabsSource from '../../.vitepress/theme/components/klean/tabs/Tabs.vue?raw'
import reactSource from '../sources/tabs/Tabs.jsx?raw'
import svelteSource from '../sources/tabs/Tabs.svelte?raw'
import vueUsage from '../snippets/tabs/usage.vue?raw'
import reactUsage from '../snippets/tabs/usage.jsx?raw'
import svelteUsage from '../snippets/tabs/usage.svelte?raw'

const active = ref('overview')
</script>

# Tabs

Tabs switches among peer sections without leaving the current context. The caller writes the real buttons and panels; one shared `data-value` pairs each button with its panel.

HTML has no native tabs element, so Klean supplies the missing interaction contract: relationships, selected and hidden state, roving focus, Arrow keys, Home/End, disabled skipping, overflow reveal, and safe fallback when a dynamic tab disappears. Tailwind, routing, persistence, loading, and close policy remain application code.

<KleanPreview id="tabs-source" :source="tabsSource" filename="Tabs.vue">
  <template #preview>
    <KleanTabs
      v-model="active"
      aria-label="Project sections"
      class="w-full max-w-xl text-gray-950 dark:text-white"
    >
      <div class="flex gap-6 overflow-x-auto border-b border-gray-200 dark:border-gray-800">
        <button
          v-for="item in ['overview', 'activity', 'settings']"
          :key="item"
          type="button"
          :data-value="item"
          class="min-h-11 shrink-0 border-b-2 border-transparent px-1 py-2 text-sm font-medium text-gray-500 outline-none hover:text-gray-950 focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 data-[state=active]:border-gray-950 data-[state=active]:text-gray-950 dark:text-gray-400 dark:hover:text-white dark:focus-visible:ring-white dark:data-[state=active]:border-white dark:data-[state=active]:text-white"
        >
          {{ item[0].toUpperCase() + item.slice(1) }}
        </button>
      </div>
      <section data-value="overview" class="min-h-40 py-6 outline-none focus-visible:ring-2">
        <h2 class="text-lg font-semibold">Project overview</h2>
        <p class="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
          Health, ownership, and the next deploy in one instant panel.
        </p>
      </section>
      <section data-value="activity" class="min-h-40 py-6 outline-none focus-visible:ring-2">
        <h2 class="text-lg font-semibold">Recent activity</h2>
        <p class="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
          Seven deployments completed this week.
        </p>
      </section>
      <section data-value="settings" class="min-h-40 py-6 outline-none focus-visible:ring-2">
        <h2 class="text-lg font-semibold">Project settings</h2>
        <p class="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
          Configuration remains ordinary application markup.
        </p>
      </section>
    </KleanTabs>
  </template>
  <template #source>

<<< ../../.vitepress/theme/components/klean/tabs/Tabs.vue

  </template>
  <template #caption>
    Focus a tab and use Left/Right, Home, or End. Tab leaves the tab list for the active panel.
  </template>
</KleanPreview>

## Installation

One command detects Vue, React, or Svelte and writes the matching framework-native source:

<KleanInstallation
  id="tabs-installation"
  component="tabs"
  :source="tabsSource"
  filename="Tabs.vue"
  destination="assets/js/components/ui/tabs/Tabs.vue"
  :dependencies="['tailwind-merge']"
/>

There is no initializer, provider, item schema, `klean-ui.json`, generated class helper, or runtime package to configure.

## Usage

The first child is the tab list. Its descendant `button[data-value]` elements are tabs. Each later direct child with the same `data-value` is that tab's panel.

### Vue

<CopyCode :code="vueUsage" label="ProjectTabs.vue" />

### React

<CopyCode :code="reactUsage" label="ProjectTabs.jsx" />

### Svelte

<CopyCode :code="svelteUsage" label="ProjectTabs.svelte" />

The binding syntax changes, but the visible HTML and `data-value` relationship stay the same.

## API

| Input                                            | Default           | Purpose                                                          |
| ------------------------------------------------ | ----------------- | ---------------------------------------------------------------- |
| Vue `v-model`                                    | first enabled tab | Controlled or uncontrolled selected value.                       |
| React `value` / `defaultValue` / `onValueChange` | first enabled tab | React-native controlled or initial selected value.               |
| Svelte `bind:value`                              | first enabled tab | Svelte-native selected value.                                    |
| `orientation`                                    | `horizontal`      | `horizontal` uses Left/Right; `vertical` uses Up/Down.           |
| `activation`                                     | `automatic`       | `automatic` selects on focus; `manual` waits for Enter or Space. |
| `aria-label` / `aria-labelledby`                 | required          | Accessible name forwarded to the tab list.                       |
| `class` / `className`                            | —                 | Ordinary Tailwind classes merged on the root.                    |

Tabs forwards other non-conflicting attributes to its root. Individual button and panel attributes stay on the caller's elements, where they remain easy to inspect and change.

## When to use

Use Tabs when all sections are peers in one task and changing sections should preserve the surrounding page: workspace results, editor documents, dashboard views, or instant detail sections.

Tabs work best when the labels are short, the active panel is clear, and every automatic panel is already mounted and fast.

## When not to use

- Use real links or the Boring Stack Link when each destination is a page, should open in a new tab, or belongs in browser history as navigation.
- Use [Radio](/klean-ui/components/radio) when the choice changes a value rather than which panel is visible.
- Use [Select](/klean-ui/components/select) or [Combobox](/klean-ui/components/combobox) for a long choice list where simultaneous labels are not useful.
- Use disclosure or an accordion when several sections may be open together or the content is hierarchical rather than peer views.
- Use [Menu](/klean-ui/components/menu) for a temporary list of actions or destinations.

Do not turn every row of page navigation into tabs. The visual resemblance does not change the underlying semantic decision.

## Automatic and manual activation

Automatic activation is the default because it feels direct when every panel is already present and switching is instant. Moving focus selects the next tab.

Use `activation="manual"` when selecting a tab starts a request, performs meaningful work, or could noticeably delay focus. Arrow keys then move focus without changing the panel; Enter or Space selects.

```vue
<Tabs v-model="activeReport" activation="manual" aria-label="Report sections">
  <!-- same native buttons and panels -->
</Tabs>
```

Loading policy still belongs to the page. Tabs does not fetch, cache, suspend, or invent a loading state.

## Styling with Tailwind

Style the real button and panel elements directly. Klean adds stable state hooks:

- root: `data-slot="tabs"` and `data-orientation`;
- list: `data-slot="tabs-list"` and `data-orientation`;
- tabs: `data-slot="tab"`, `data-state="active|inactive"`, and `data-orientation`;
- panels: `data-slot="tab-panel"`, `data-state="active|inactive"`, and `data-orientation`.

```html
<button
  type="button"
  data-value="activity"
  class="border-b-2 border-transparent px-3 py-2 text-gray-500
         data-[state=active]:border-black data-[state=active]:text-black"
>
  Activity
</button>
```

These are ordinary Tailwind selectors, not Klean color, size, tone, elevation, or variant APIs. A product-owned wrapper may repeat a house treatment without hiding the semantic buttons.

## Dynamic workspace tabs

Slipway workspaces add, rename, reorder, overflow, and close result tabs. Keep a close action adjacent to its tab—never nest a button inside another button:

```vue
<Tabs v-model="active" class="relative" aria-label="Open results">
  <div class="flex">
    <button
      v-for="item in openTabs"
      :key="item.value"
      type="button"
      :data-value="item.value"
      class="w-36 pr-10"
    >
      {{ item.label }}
    </button>
  </div>

  <div class="pointer-events-none absolute left-0 top-0 flex">
    <span v-for="item in openTabs" :key="item.value" class="flex w-36 justify-end">
      <button
        type="button"
        class="pointer-events-auto"
        :aria-label="`Close ${item.label}`"
        @click="close(item.value)"
      >
        ×
      </button>
    </span>
  </div>

  <section v-for="item in openTabs" :key="item.value" :data-value="item.value">
    <!-- result -->
  </section>
</Tabs>
```

The overlaid action row is a sibling of the semantic tab list. It appears beside each tab without placing non-tab controls inside `role="tablist"`.

When the active tab disappears or becomes disabled, Tabs selects the enabled tab now occupying that position, then falls back backward at the end. If focus was on the removed active tab, focus follows the safe replacement. A focused tab in an overflowing list scrolls into view without moving the page.

The application still decides whether a tab may close, whether unsaved work needs confirmation, and how a label is renamed.

## Durable state

Selection durability depends on what the tabs mean:

- put a shareable operational view in a URL query parameter;
- keep browser history meaningful when Back should restore an earlier view;
- use Durable UI storage for a local editor preference that should survive reloads but should not be shared;
- keep disposable result tabs in local component state.

Tabs never writes local storage, cookies, the URL, or server state. Bind it to the application's chosen source of truth. Preserve unrelated query parameters, respond to Back/Forward changes, and let Tabs report a valid fallback when restored state names a tab that no longer exists.

## Accessible behavior

- The list, tabs, and panels receive the complete `tablist`, `tab`, and `tabpanel` relationship.
- Generated IDs connect `aria-controls` and `aria-labelledby` without caller coordination.
- Only the selected enabled tab is in the page Tab order.
- Horizontal Arrow keys or vertical Arrow keys move and wrap among enabled tabs.
- Home and End focus the first and last enabled tabs.
- Manual activation uses Enter or Space; automatic activation follows focus.
- Native Tab leaves the tab list instead of visiting every tab.
- Inactive panels stay caller-owned and mounted, but receive native hidden state.
- A panel remains keyboard-focusable so a person can move from its tab into its content.
- Disabled tabs are skipped and cannot be selected.
- Observers and generated behavior are removed with the component.

Use a concise visible heading near the widget when possible. Otherwise provide `aria-label`; use `aria-labelledby` when an existing heading should name the tab list.

## Complete framework source

Copy, inspect, and change the complete source for your framework.

### Vue source

<CopyCode :code="tabsSource" label="Tabs.vue" />

### React source

<CopyCode :code="reactSource" label="Tabs.jsx" />

### Svelte source

<CopyCode :code="svelteSource" label="Tabs.svelte" />

## Related components

- [Button](/klean-ui/components/button) — gives each tab or adjacent close action truthful button semantics.
- [Radio](/klean-ui/components/radio) — represents one selected value rather than one visible peer panel.
- [Menu](/klean-ui/components/menu) — presents a temporary collection of actions or destinations.
- [Select](/klean-ui/components/select) — chooses one value from a longer fixed list in less space.
- [Combobox](/klean-ui/components/combobox) — searches and chooses from a long or remote list.
