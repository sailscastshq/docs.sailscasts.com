---
title: Tabs
titleTemplate: Klean UI
description: Durable tabs for caller-owned buttons, anchors, and framework Links across Vue, React, and Svelte.
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
import verticalUsage from '../snippets/tabs/vertical.vue?raw'
import settingsNavigation from '../snippets/tabs/settings-navigation.vue?raw'
import reactNavigation from '../snippets/tabs/navigation.jsx?raw'
import svelteNavigation from '../snippets/tabs/navigation.svelte?raw'

const active = ref('overview')
const verticalActive = ref('profile')
const navigationActive = ref('profile')
const verticalSections = [
  { value: 'profile', label: 'Profile' },
  { value: 'notifications', label: 'Notifications' },
  { value: 'billing', label: 'Billing' }
]
const navigationSections = [
  { value: 'profile', label: 'Profile', href: '#profile' },
  { value: 'billing', label: 'Billing', href: '#billing' },
  { value: 'schedule', label: 'Schedule', href: '#schedule' }
]
</script>

# Tabs

Tabs gives one durable contract to two things applications routinely need: buttons that switch mounted peer panels, and links that navigate among related pages. The caller writes the real elements; Klean reads their semantics instead of asking for a mode, item schema, or router adapter.

With `button[data-value]`, Klean supplies the missing ARIA tab contract: relationships, selected and hidden state, roving focus, Arrow keys, Home/End, disabled skipping, overflow reveal, and safe fallback when a dynamic tab disappears. With `a[href][data-value]`—including a framework Link that renders an anchor—Klean preserves native navigation and adds only active-state and styling hooks. Tailwind, routing, persistence, loading, and close policy remain application code.

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
          class="min-h-11 shrink-0 cursor-pointer border-b-2 border-transparent px-1 py-2 text-sm font-medium text-gray-500 outline-none hover:text-gray-950 focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 data-[state=active]:border-gray-950 data-[state=active]:text-gray-950 dark:text-gray-400 dark:hover:text-white dark:focus-visible:ring-white dark:data-[state=active]:border-white dark:data-[state=active]:text-white"
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

The first child is the list or navigation landmark. Klean infers the contract from its descendants:

- `button[data-value]` creates a tab widget. Each later direct child with the same `data-value` is that button's panel.
- `a[href][data-value]` creates durable navigation. Native anchors and framework Links keep their normal browser and router behavior; no panels are required.

Keep a group all buttons or all links. A mixed group is ambiguous, so Klean deliberately leaves it unenhanced.

### Vue

<CopyCode :code="vueUsage" label="ProjectTabs.vue" />

### React

<CopyCode :code="reactUsage" label="ProjectTabs.jsx" />

### Svelte

<CopyCode :code="svelteUsage" label="ProjectTabs.svelte" />

The binding syntax changes, but the visible HTML and `data-value` relationship stay the same.

## API

| Input                                            | Default      | Purpose                                                              |
| ------------------------------------------------ | ------------ | -------------------------------------------------------------------- |
| Vue `v-model`                                    | inferred     | Controlled or uncontrolled selected value.                           |
| React `value` / `defaultValue` / `onValueChange` | inferred     | React-native controlled or initial selected value.                   |
| Svelte `bind:value`                              | inferred     | Svelte-native selected value.                                        |
| `orientation`                                    | `horizontal` | `horizontal` uses Left/Right; `vertical` uses Up/Down.               |
| `activation`                                     | `automatic`  | `automatic` selects on focus; `manual` waits for Enter or Space.     |
| `aria-label` / `aria-labelledby`                 | required     | Accessible name forwarded to the button list or navigation landmark. |
| `class` / `className`                            | —            | Ordinary Tailwind classes merged on the root.                        |

Panel mode falls back to the first enabled button. Navigation mode uses the controlled value or an existing `aria-current="page"`; it never guesses which URL shape means current. Tabs forwards other non-conflicting attributes to its root. Individual button, link, and panel attributes stay on the caller's elements, where they remain easy to inspect and change.

## Horizontal, vertical, and settings navigation

`orientation="horizontal"` is the default. It uses Left/Right Arrow keys and is appropriate for a short row of peer panels. `orientation="vertical"` uses Up/Down Arrow keys and works well when the peer panels belong beside a settings-style rail.

<KleanPreview id="tabs-vertical" :source="verticalUsage" filename="vertical-tabs.vue">
  <template #preview>
    <KleanTabs
      v-model="verticalActive"
      orientation="vertical"
      aria-label="Project settings"
      class="grid w-full max-w-xl gap-8 text-gray-950 sm:grid-cols-[11rem_1fr] dark:text-white"
    >
      <div class="flex flex-col gap-1">
        <button
          v-for="section in verticalSections"
          :key="section.value"
          type="button"
          :data-value="section.value"
          class="min-h-11 cursor-pointer rounded-md border-l-2 border-transparent px-3 py-2 text-left text-sm font-medium text-gray-500 outline-none hover:bg-gray-50 hover:text-gray-950 focus-visible:ring-2 focus-visible:ring-gray-950 data-[state=active]:border-gray-950 data-[state=active]:bg-gray-100 data-[state=active]:text-gray-950 dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-white dark:focus-visible:ring-white dark:data-[state=active]:border-white dark:data-[state=active]:bg-gray-900 dark:data-[state=active]:text-white"
        >
          {{ section.label }}
        </button>
      </div>
      <section data-value="profile" class="outline-none focus-visible:ring-2">
        <h2 class="text-lg font-semibold">Profile</h2>
        <p class="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
          Change the name and contact details shown to your team.
        </p>
      </section>
      <section data-value="notifications" class="outline-none focus-visible:ring-2">
        <h2 class="text-lg font-semibold">Notifications</h2>
        <p class="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
          Decide which project events should reach you.
        </p>
      </section>
      <section data-value="billing" class="outline-none focus-visible:ring-2">
        <h2 class="text-lg font-semibold">Billing</h2>
        <p class="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
          Review invoices and the payment method for this project.
        </p>
      </section>
    </KleanTabs>
  </template>
  <template #caption>
    Focus the rail and use Up/Down, Home, or End. The caller owns the rail and panel layout.
  </template>
</KleanPreview>

The visual shape does not decide the semantics. If every settings item has its own URL or Inertia page, put the real links inside Tabs. Klean detects the anchors, skips the ARIA tab widget behavior, and applies `aria-current="page"` plus `data-state="active"` to the selected destination. Reload, sharing, Back/Forward, prefetch, modified clicks, and open-in-new-tab remain native.

<KleanPreview id="tabs-navigation" :source="settingsNavigation" filename="SettingsNavigation.vue">
  <template #preview>
    <div class="w-full max-w-xl border-2 border-black bg-white p-6 shadow-[5px_5px_0_#111] dark:border-white dark:bg-gray-950 dark:shadow-[5px_5px_0_#fff]">
      <div class="flex items-center gap-3">
        <div class="grid size-12 place-items-center rounded-xl bg-black text-sm font-bold text-white dark:bg-white dark:text-black">KU</div>
        <div>
          <h2 class="font-semibold text-gray-950 dark:text-white">Account settings</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">Durable route navigation</p>
        </div>
      </div>
      <KleanTabs
        :model-value="navigationActive"
        orientation="vertical"
        aria-label="Account settings"
        class="mt-8"
      >
        <nav class="flex flex-col gap-1">
          <a
            v-for="section in navigationSections"
            :key="section.value"
            :href="section.href"
            :data-value="section.value"
            class="block min-h-11 cursor-pointer rounded-lg px-3 py-2 text-sm font-medium text-black/60 no-underline outline-none hover:bg-black/5 hover:text-black focus-visible:ring-2 focus-visible:ring-black data-[state=active]:bg-black data-[state=active]:text-white dark:text-white/65 dark:hover:bg-white/5 dark:hover:text-white dark:focus-visible:ring-white dark:data-[state=active]:bg-white dark:data-[state=active]:text-black"
            @click="navigationActive = section.value"
          >
            {{ section.label }}
          </a>
        </nav>
      </KleanTabs>
    </div>
  </template>
  <template #caption>
    These are real links, not buttons wearing link styling. Try opening one in a new tab or using a modified click.
  </template>
</KleanPreview>

### Vue Link navigation

<CopyCode :code="settingsNavigation" label="SettingsNavigation.vue" />

### React Link navigation

<CopyCode :code="reactNavigation" label="SettingsNavigation.jsx" />

### SvelteKit navigation

<CopyCode :code="svelteNavigation" label="SettingsNavigation.svelte" />

Vue and React pass their Inertia Link directly. SvelteKit enhances ordinary anchors, so no Link wrapper is needed. A native `<a>` works in every framework.

## When to use

Use Tabs for related sections that share one visual navigation treatment:

- use buttons and panels for workspace results, editor documents, dashboard views, or instant detail sections;
- use anchors or framework Links when each section has its own durable destination.

Tabs work best when the labels are short, the active panel is clear, and every automatic panel is already mounted and fast.

## When not to use

- Do not use button mode when each destination is a page. Put real links or the Boring Stack Link inside Tabs instead.
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

Style the real button, link, and panel elements directly. Klean adds stable state hooks:

- root: `data-slot="tabs"`, `data-mode="panels|navigation"`, and `data-orientation`;
- list: `data-slot="tabs-list"`, `data-mode`, and `data-orientation`;
- buttons or links: `data-slot="tab"`, `data-mode`, `data-state="active|inactive"`, and `data-orientation`;
- panels: `data-slot="tab-panel"`, `data-state="active|inactive"`, and `data-orientation`.

```html
<button
  type="button"
  data-value="activity"
  class="cursor-pointer border-b-2 border-transparent px-3 py-2 text-gray-500
         data-[state=active]:border-black data-[state=active]:text-black"
>
  Activity
</button>
```

These are ordinary Tailwind selectors, not Klean color, size, tone, elevation, or variant APIs. A product-owned wrapper may repeat a house treatment without hiding the semantic buttons.

The same state selector styles navigation without a second styling API:

```html
<a
  href="/settings/billing"
  data-value="billing"
  class="rounded-lg px-3 py-2 text-gray-500
         data-[state=active]:bg-black data-[state=active]:text-white"
>
  Billing
</a>
```

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
      class="w-36 cursor-pointer pr-10"
    >
      {{ item.label }}
    </button>
  </div>

  <div class="pointer-events-none absolute left-0 top-0 flex">
    <span v-for="item in openTabs" :key="item.value" class="flex w-36 justify-end">
      <button
        type="button"
        class="pointer-events-auto cursor-pointer"
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

Selection durability depends on what the sections mean:

- bind a same-page operational view to a URL query parameter such as `?tab=activity`;
- use route links for settings pages where each section already has its own URL;
- keep browser history meaningful when Back should restore an earlier view;
- use Durable UI storage for a local editor preference that should survive reloads but should not be shared;
- keep disposable result tabs in local component state.

Tabs never writes local storage, cookies, the URL, or server state. Bind panel mode to the application's chosen source of truth. For query-backed panels, preserve unrelated query parameters, push a history entry when a tab change should be reversible with Back, listen for Back/Forward changes, and let Tabs report a valid fallback when restored state names a tab that no longer exists.

In navigation mode, the router already owns durability. Pass the current route-derived value—or render one link with `aria-current="page"` during SSR—and let the anchor or framework Link perform navigation. Klean does not intercept clicks, so browser history, prefetch, reload, middle-click, and modifier keys continue to work.

## Accessible behavior

Button mode:

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

Navigation mode:

- The caller's `<nav>` remains a navigation landmark and every destination remains an anchor.
- The selected destination receives `aria-current="page"`; links never receive `role="tab"`, `aria-selected`, or roving `tabindex`.
- Native Tab visits links normally. Klean does not replace native link keyboard behavior with Arrow-key handling.
- Ordinary and modified clicks are not cancelled, so the browser or framework Link remains in control.

Use a concise visible heading near the component when possible. Otherwise provide `aria-label`; use `aria-labelledby` when an existing heading should name the list or navigation landmark.

## Complete framework source

Copy, inspect, and change the complete source for your framework.

### Vue source

<CopyCode :code="tabsSource" label="Tabs.vue" />

### React source

<CopyCode :code="reactSource" label="Tabs.jsx" />

### Svelte source

<CopyCode :code="svelteSource" label="Tabs.svelte" />

## Related components

- [Button](/klean-ui/components/button) — gives panel tabs or adjacent close actions truthful button semantics and can render a destination as an anchor or framework Link.
- [Radio](/klean-ui/components/radio) — represents one selected value rather than one visible peer panel.
- [Menu](/klean-ui/components/menu) — presents a temporary collection of actions or destinations.
- [Select](/klean-ui/components/select) — chooses one value from a longer fixed list in less space.
- [Combobox](/klean-ui/components/combobox) — searches and chooses from a long or remote list.
