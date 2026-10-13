---
title: Menu
titleTemplate: Klean UI
description: A native-Popover Klean UI menu with truthful buttons and links, roving focus, typeahead, and caller-owned Tailwind.
outline: [2, 3]
---

<script setup>
import CopyCode from '../../.vitepress/theme/components/CopyCode.vue'
import KleanInstallation from '../../.vitepress/theme/components/KleanInstallation.vue'
import KleanPreview from '../../.vitepress/theme/components/KleanPreview.vue'
import KleanButton from '../../.vitepress/theme/components/klean/Button.vue'
import KleanMenu from '../../.vitepress/theme/components/klean/menu/Menu.vue'
import menuSource from '../../.vitepress/theme/components/klean/menu/Menu.vue?raw'
import popoverSource from '../../.vitepress/theme/components/klean/popover/Popover.vue?raw'

import productSource from '../snippets/menu/products.vue?raw'



import reactInstallPopoverjsx from '../sources/popover/Popover.jsx?raw'
import reactInstallMenujsx from '../sources/menu/Menu.jsx?raw'
import svelteInstallPopoversvelte from '../sources/popover/Popover.svelte?raw'
import svelteInstallMenusvelte from '../sources/menu/Menu.svelte?raw'

const installationFrameworks = [
  {
    id: 'vue', label: 'Vue',
    dependencies: ["@floating-ui/dom", "tailwind-merge"],
    files: [
      { filename: 'Popover.vue', destination: 'assets/js/components/ui/popover/Popover.vue', source: popoverSource },
      { filename: 'Menu.vue', destination: 'assets/js/components/ui/menu/Menu.vue', source: menuSource },
    ]
  },
  {
    id: 'react', label: 'React',
    dependencies: ["@floating-ui/dom", "tailwind-merge"],
    files: [
      { filename: 'Popover.jsx', destination: 'assets/js/components/ui/popover/Popover.jsx', source: reactInstallPopoverjsx },
      { filename: 'Menu.jsx', destination: 'assets/js/components/ui/menu/Menu.jsx', source: reactInstallMenujsx },
    ]
  },
  {
    id: 'svelte', label: 'Svelte',
    dependencies: ["@floating-ui/dom", "tailwind-merge"],
    files: [
      { filename: 'Popover.svelte', destination: 'assets/js/components/ui/popover/Popover.svelte', source: svelteInstallPopoversvelte },
      { filename: 'Menu.svelte', destination: 'assets/js/components/ui/menu/Menu.svelte', source: svelteInstallMenusvelte },
    ]
  },
]
</script>

# Menu

Group actions and destinations in a keyboard-accessible menu. Built on [Popover](/klean-ui/components/popover), Menu supports Arrow keys, Home/End, typeahead, disabled items, selection, and focus return.

The application supplies real buttons and links plus ordinary Tailwind. There is no `MenuTrigger`, `MenuItem`, item-data schema, `asChild`, visual variant, provider, or theme object.

<KleanPreview id="menu-source" :source="menuSource" filename="Menu.vue">
  <template #preview>
    <KleanButton popovertarget="docs-project-actions">
      Actions
      <svg
        aria-hidden="true"
        class="size-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <path d="m7 10 5 5 5-5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </KleanButton>
    <KleanMenu
      id="docs-project-actions"
      aria-label="Project actions"
      class="w-60"
    >
      <button
        type="button"
        class="flex w-full cursor-pointer rounded px-3 py-2 text-left text-sm text-gray-700 outline-none hover:bg-gray-100 focus:bg-gray-100 focus:text-gray-950 dark:text-gray-200 dark:hover:bg-white/10 dark:focus:bg-white/10"
      >
        Edit project
      </button>
      <a
        href="#truthful-items"
        class="flex w-full rounded px-3 py-2 text-sm text-gray-700 no-underline outline-none hover:bg-gray-100 focus:bg-gray-100 focus:text-gray-950 dark:text-gray-200 dark:hover:bg-white/10 dark:focus:bg-white/10"
      >
        View deployments
      </a>
      <button
        type="button"
        disabled
        class="flex w-full cursor-not-allowed rounded px-3 py-2 text-left text-sm text-gray-400 outline-none"
      >
        Archive project
      </button>
      <button
        type="button"
        class="flex w-full cursor-pointer rounded px-3 py-2 text-left text-sm text-red-700 outline-none hover:bg-red-50 focus:bg-red-50 focus:text-red-800 dark:text-red-400 dark:hover:bg-red-500/10 dark:focus:bg-red-500/10"
      >
        Delete project
      </button>
    </KleanMenu>
  </template>
  <template #usage>

::: code-group

<<< ../snippets/menu/usage.vue [Vue]

<<< ../snippets/menu/usage.jsx [React]

<<< ../snippets/menu/usage.svelte [Svelte]

:::

  </template>
  <template #source>

<<< ../../.vitepress/theme/components/klean/menu/Menu.vue

  </template>
  <template #caption>
    Open Actions, then try Arrow Up/Down, Home/End, typing “d”, Tab, and Escape.
  </template>
</KleanPreview>

## Installation

Run the same command in Vue, React, or Svelte. Klean detects the framework and conventional destination, then installs Popover first when it is missing.

<KleanInstallation
  id="menu-installation"
  component="menu"
  :frameworks="installationFrameworks"
/>

## Usage

Copy the [example above](#menu-source) for your framework.

The framework syntax changes; the HTML contract does not. A real button uses native `popovertarget`. Native button and anchor children become menu items automatically, so developers do not repeat roles or tab indices.

## Truthful items

Use a native button when selection performs an action:

```vue
<button
  type="button"
  class="cursor-pointer ..."
  @click="redeploy"
>Redeploy</button>
```

Use an anchor for navigation. The Boring Stack Link renders an anchor too, so it works without an adapter:

```vue
<Link href="/projects/42/settings" class="...">Project settings</Link>
```

Menu does not accept an item array because an array forces the component to guess whether each record is a button, anchor, download, or framework Link. Authorization, conditional visibility, event handlers, and destinations remain obvious in application markup.

Native buttons keep the browser's default arrow cursor, so button-item recipes opt into `cursor-pointer` explicitly. That visible Tailwind class is part of the application-owned visual API; Menu does not mutate its children's appearance.

### Disabled items

A disabled action uses the native `disabled` attribute and is skipped during keyboard navigation. A navigation item that must remain visible can use `aria-disabled="true"`; Menu prevents activation and skips it. Prefer hiding unauthorized items in application logic instead of teaching Menu about permissions.

```vue
<button
  type="button"
  disabled
  class="disabled:cursor-not-allowed disabled:opacity-40"
>
  Stop provisioning
</button>
```

## API

| Input                  | Default        | Purpose                                                                          |
| ---------------------- | -------------- | -------------------------------------------------------------------------------- |
| `id`                   | generated      | Native target identifier. Supply a stable value when a button invokes the Menu.  |
| `placement`            | `bottom-start` | Preferred logical placement. It may flip or shift to remain visible.             |
| `offset`               | `8`            | Pixel distance between the invoker and menu.                                     |
| framework open binding | uncontrolled   | Observe or control visibility only when application behavior genuinely needs it. |
| `defaultOpen`          | `false`        | Initial visibility when open state is uncontrolled.                              |
| `class` / `className`  | —              | Ordinary Tailwind classes merged last on the menu surface.                       |
| default content        | —              | Native buttons, anchors, or framework links.                                     |

Vue uses `v-model:open`, React uses `open` with `onOpenChange`, and Svelte uses `bind:open`. Placement and offset are geometry, not appearance. Menu has no `variant`, `tone`, `size`, `inset`, `destructive`, animation, or theme props.

### Imperative invocation

Vue and React refs expose `open(edge = 'first', source?)`, `close({ restoreFocus? })`, and `getContent()`. Svelte component bindings expose `show(edge = 'first', source?)`, `closeMenu({ restoreFocus? })`, and `getContent()`. `edge` is `first` or `last`; an optional connected, focusable source establishes the focus-return and Tab-exit origin for non-button invocations such as [ContextMenu](/klean-ui/components/context-menu). Omit it for the normal native `popovertarget` relationship. `getContent()` returns the current menu DOM element after mount, not a server element.

Menu waits until a native Popover is actually showing before focusing the requested item; a native toggle supplies the readiness signal. In fallback browsers it focuses after the closed `hidden` state is removed. No timing delay or persisted state is required.

## Keyboard and focus

- Click, Enter, or Space on the real trigger opens and focuses the first enabled item.
- Arrow Down on the trigger opens at the first enabled item; Arrow Up opens at the last.
- Arrow Down and Arrow Up wrap between enabled items.
- Home and End move to the first and last enabled items.
- Printable characters use a short buffered typeahead against visible text or `aria-label`.
- Enter and Space activation remain native to the real button or anchor, avoiding double firing.
- Escape closes and restores focus to the invoker.
- Selection closes and restores focus; link navigation may then move to the destination.
- Tab or Shift+Tab closes and continues to the next or previous control outside the menu; neither key moves between menu items.
- Outside interaction closes without stealing focus from the selected target.

The vertical key contract is the same in right-to-left documents. Menu adds no animation, so reduced-motion users get a stable surface by default. Product motion, if useful, belongs in caller Tailwind and must use `motion-safe:` or an equivalent fallback.

## Menu is not every floating list

- **Menu** is a composite widget of actions and destinations with arrow navigation and typeahead.
- **Popover** holds ordinary forms, filters, help, or previews and keeps normal Tab order.
- [**Select**](/klean-ui/components/select) chooses one value and has selected-option behavior.
- **Combobox** combines text input, filtering, and an option popup.
- **Dialog** is modal, contains focus, and makes the background inert.

Website navigation remains a semantic `nav` and list of links with ordinary Tab behavior. Do not add Menu roles merely because navigation appears in a floating surface.

## Product recipes

Use compact spacing for operational actions or a stronger border and offset shadow for a more expressive menu.

<KleanPreview id="menu-products" :source="productSource" filename="product-menus.vue">
  <template #preview>
    <div class="grid w-full max-w-2xl gap-8 sm:grid-cols-2">
      <div class="bg-[#f4f0e8] p-6">
        <p class="mb-5 font-mono text-xs uppercase tracking-[0.18em] text-gray-600">
          Hagfish / invoice
        </p>
        <KleanButton
          popovertarget="docs-invoice-actions"
          class="rounded-none border-2 border-black bg-black text-white hover:bg-white hover:text-black"
        >
          Invoice actions
        </KleanButton>
        <KleanMenu
          id="docs-invoice-actions"
          aria-label="Invoice actions"
          class="w-64 rounded-none border-2 border-black p-2 shadow-[6px_6px_0_0_#000]"
        >
          <a href="#product-recipes" class="flex w-full border-2 border-transparent px-3 py-2 text-sm font-medium text-black no-underline outline-none hover:border-black focus:border-black">Preview invoice</a>
          <button type="button" class="flex w-full cursor-pointer border-2 border-transparent px-3 py-2 text-left text-sm font-medium text-red-700 outline-none hover:border-red-700 focus:border-red-700">Void invoice</button>
        </KleanMenu>
      </div>
      <div class="dark bg-gray-950 p-6 text-white">
        <p class="mb-5 font-mono text-xs uppercase tracking-[0.18em] text-gray-400">
          Slipway / deploy
        </p>
        <KleanButton
          popovertarget="docs-deploy-actions"
          class="min-h-9 min-w-0 bg-gray-800 px-3 py-1.5 text-sm hover:bg-gray-700"
        >
          Actions
        </KleanButton>
        <KleanMenu
          id="docs-deploy-actions"
          aria-label="Deployment actions"
          class="w-52 border-gray-700 bg-gray-900 p-1 text-white shadow-xl"
        >
          <button type="button" class="flex w-full cursor-pointer rounded px-2 py-2 text-left text-sm text-gray-200 outline-none hover:bg-white/10 focus:bg-white/10">Redeploy</button>
          <a href="#product-recipes" class="flex w-full rounded px-2 py-2 text-sm text-gray-200 no-underline outline-none hover:bg-white/10 focus:bg-white/10">View logs</a>
          <button type="button" disabled class="flex w-full cursor-not-allowed rounded px-2 py-2 text-left text-sm text-gray-500 outline-none">Stop provisioning</button>
        </KleanMenu>
      </div>
    </div>
  </template>
  <template #caption>
    Every visual choice is visible Tailwind at the call site. The same Menu
    behavior carries both products without a variant or theme selector.
  </template>
</KleanPreview>

## Complete framework source

::: code-group

<<< ../../.vitepress/theme/components/klean/menu/Menu.vue [Vue]

<<< ../sources/menu/Menu.jsx [React]

<<< ../sources/menu/Menu.svelte [Svelte]

:::

## Accessibility and Durable UI contract

- The invoker remains a real button and automatically receives `aria-haspopup="menu"`, `aria-controls`, and synchronized `aria-expanded`.
- Button and anchor children keep their truthful native activation while Menu supplies composite roles and roving focus.
- Disabled items cannot activate and never become the active roving focus stop.
- Escape and selection restore focus only when the invoker still exists; Tab exits forward or backward in composed document order; outside interaction does not steal focus.
- Keyboard behavior remains correct in RTL layouts and as items change.
- Menu open state is ephemeral and is never written to storage, cookies, server data, or the URL.
- Meaningful state selected from a menu follows the [Durable UI contract](/klean-ui/durable-ui); appearance follows the application-owned [theming convention](/klean-ui/theming).

## Related components

- [Popover](/klean-ui/components/popover) — a generic non-modal surface without menu semantics.
- [Button](/klean-ui/components/button) — the truthful invoker and action element.
- [Select](/klean-ui/components/select) — a fixed-list persistent value rather than an action.
- [Dialog](/klean-ui/components/dialog) — modal content that makes the background inert.
