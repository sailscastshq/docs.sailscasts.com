---
title: ContextMenu
titleTemplate: Klean UI
description: A point-anchored action menu for existing application targets, composed on native Menu and Popover with caller-owned Tailwind.
outline: [2, 3]
---

<script setup>
import CopyCode from '../../.vitepress/theme/components/CopyCode.vue'
import KleanInstallation from '../../.vitepress/theme/components/KleanInstallation.vue'
import KleanPreview from '../../.vitepress/theme/components/KleanPreview.vue'
import ContextMenuExample from '../../.vitepress/theme/components/klean/context-menu/ContextMenuExample.vue'
import vueSource from '../../.vitepress/theme/components/klean/context-menu/ContextMenu.vue?raw'
import vueMenu from '../../.vitepress/theme/components/klean/menu/Menu.vue?raw'
import vuePopover from '../../.vitepress/theme/components/klean/popover/Popover.vue?raw'
import reactSource from '../sources/context-menu/ContextMenu.jsx?raw'
import reactMenu from '../sources/menu/Menu.jsx?raw'
import reactPopover from '../sources/popover/Popover.jsx?raw'
import svelteSource from '../sources/context-menu/ContextMenu.svelte?raw'
import svelteMenu from '../sources/menu/Menu.svelte?raw'
import sveltePopover from '../sources/popover/Popover.svelte?raw'
import exampleSource from '../../.vitepress/theme/components/klean/context-menu/ContextMenuExample.vue?raw'
import vueUsage from '../snippets/context-menu/usage.vue?raw'
import reactUsage from '../snippets/context-menu/usage.jsx?raw'
import svelteUsage from '../snippets/context-menu/usage.svelte?raw'
const frameworks = [
  { id: 'vue', label: 'Vue', files: [['Popover.vue', vuePopover], ['Menu.vue', vueMenu], ['ContextMenu.vue', vueSource]].map(([filename, source]) => ({ filename, source, destination: `assets/js/components/ui/${filename.replace('.vue', '').replace('ContextMenu', 'context-menu').toLowerCase()}/${filename}` })) },
  { id: 'react', label: 'React', files: [['Popover.jsx', reactPopover], ['Menu.jsx', reactMenu], ['ContextMenu.jsx', reactSource]].map(([filename, source]) => ({ filename, source, destination: `assets/js/components/ui/${filename.replace('.jsx', '').replace('ContextMenu', 'context-menu').toLowerCase()}/${filename}` })) },
  { id: 'svelte', label: 'Svelte', files: [['Popover.svelte', sveltePopover], ['Menu.svelte', svelteMenu], ['ContextMenu.svelte', svelteSource]].map(([filename, source]) => ({ filename, source, destination: `src/lib/components/ui/${filename.replace('.svelte', '').replace('ContextMenu', 'context-menu').toLowerCase()}/${filename}` })) }
]
</script>

# ContextMenu

ContextMenu opens [Menu](/klean-ui/components/menu) from a right-click point or a keyboard request on an existing application element. It reuses Menu's native buttons and links, roving focus, typeahead, and dismissal. [Popover](/klean-ui/components/popover) provides native top-layer display and collision-aware positioning. ContextMenu uses the native `popover="manual"` attribute so the opening right-click cannot immediately light-dismiss its own menu on pointer release. Existing explicit outside-pointer and Escape handlers own dismissal; ordinary Popover defaults remain `auto`.

The target stays your markup. No wrapper, item array, custom trigger component, visual props, long-press interception, submenus, provider, or theme object.

::: warning Unreleased component
ContextMenu is proposed in the [implementation issue](https://github.com/sailscastshq/klean-ui/issues/163). Published `klean-ui@0.0.6` does not include it. Use the complete owned sources below until a release includes this registry item; the CLI command describes that future installation.
:::

<KleanPreview id="context-menu-preview" :source="exampleSource" filename="ProjectActions.vue">
  <template #preview><ContextMenuExample /></template>
  <template #caption>Right-click the project, focus it and press Shift+F10, or use Actions. Disabled leaves the browser context menu available.</template>
</KleanPreview>

## Installation

<KleanInstallation id="context-menu-installation" component="context-menu" :source="vueSource" filename="ContextMenu.vue" destination="assets/js/components/ui/context-menu/ContextMenu.vue" :frameworks="frameworks" :dependencies="['@floating-ui/dom', 'tailwind-merge']" />

Install all three sibling sources: ContextMenu imports Menu, and Menu imports Popover. ContextMenu requires the point-anchor and source-aware invocation versions supplied here. Existing owned Menu/Popover edits must be reviewed before updating. No new runtime package is introduced beyond their existing positioning and class-merging dependencies.

## Usage

### Vue

<CopyCode :code="vueUsage" label="ProjectActions.vue" />

### React

<CopyCode :code="reactUsage" label="ProjectActions.jsx" />

### Svelte

<CopyCode :code="svelteUsage" label="ProjectActions.svelte" />

Use an accessible name and `tabindex="0"` on a noninteractive target. A native button already supplies keyboard focus. Keep the target mounted and pair it by id in the same document or shadow root, or pass the actual element. ContextMenu installs its listeners and ARIA relationships after mount; SSR renders a closed menu without browser globals.

The target is bound after mount and when the `target` prop changes. If a keyed/conditional render replaces the element while retaining the same id, remount ContextMenu with that target (for example with the same application key), or pass/update the actual element prop. It does not observe every document mutation to rediscover replaced targets. Unmount restores the original target ARIA values and removes its listeners.

## API

| Input                   | Default        | Purpose                                                                                                                          |
| ----------------------- | -------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `target`                | required       | Existing focusable element or its id; available when mounted.                                                                    |
| `id`                    | generated      | Stable menu id when the application needs one.                                                                                   |
| `disabled`              | `false`        | Preserve the browser context menu and ignore invocation. Also respects native disabled and `aria-disabled="true"` on the target. |
| framework open binding  | uncontrolled   | Vue `v-model:open`, React `open` / `onOpenChange`, Svelte `bind:open` / `onOpenChange`.                                          |
| `placement`             | `bottom-start` | Preferred point placement; may flip or shift at viewport edges.                                                                  |
| `offset`                | `0`            | Pixel distance from the pointer/keyboard anchor.                                                                                 |
| `class` / `className`   | —              | Tailwind classes merged last on the Menu surface.                                                                                |
| children / default slot | —              | Real buttons, anchors, or application links.                                                                                     |

Refs/component bindings expose `show(source?)` and `hide()`. `show()` uses the target's lower left corner and returns focus to that target on selection or Escape. `source` must be a connected, focusable element. Pass a normal Actions button as `source` to place next to it and restore its focus. Calling `show` also emits the framework open-change request; a controlled application must accept it to open. Open state is ephemeral and is not persisted.

The Menu surface retains `data-slot="menu"` and `data-state`. Native attributes and event handlers pass through. Style the target, action items, and surface directly with ordinary Tailwind classes. There are no sizing, color, radius, animation, or shape props.

## Keyboard and focus

- Right-click opens at the pointer. Keyboard-generated contextmenu events with zero coordinates use target geometry.
- ContextMenu or Shift+F10 opens at the target's lower left corner and focuses the first enabled item. Placement remains logical through Popover; the keyboard point uses physical target geometry.
- Arrow keys, Home/End, typeahead, disabled-item handling and native activation follow [Menu's contract](/klean-ui/components/menu#keyboard-and-focus).
- Escape or selecting an item closes and returns focus to the invoking target/button if it still exists.
- Tab/Shift+Tab closes and continues outside the menu in document order.
- Outside interaction dismisses without stealing focus from the clicked control.
- Caller-prevented contextmenu/keyboard events remain owned by the application.
- Listener cleanup restores the target's original ARIA attributes when unmounted or replaced.

## Touch access

Always expose the same actions through an ordinary, visibly named Actions button. Touch users should not have to discover a hidden long-press gesture. ContextMenu does not intercept touch scrolling or the browser's long-press menu. Use `show(event.currentTarget)` as in the examples; there is no separate touch API.

Context menus are supplementary. Keep essential commands discoverable elsewhere, use real links for navigation and real buttons for actions, and handle authorization in application markup/server logic.

## Complete framework source

The manual installation tabs contain the complete ContextMenu, Menu and Popover source for each framework. They are application-owned and can be edited. The live preview Source tab shows the example composition rather than an invented API.

### Vue

<CopyCode :code="vueSource" label="ContextMenu.vue" />

### React

<CopyCode :code="reactSource" label="ContextMenu.jsx" />

### Svelte

<CopyCode :code="svelteSource" label="ContextMenu.svelte" />

## Related components

- [Menu](/klean-ui/components/menu) — a button-invoked list of actions and navigation destinations.
- [Popover](/klean-ui/components/popover) — ordinary content with normal Tab order.
- [Button](/klean-ui/components/button) — a visible action alternative for every input method.
- [Select](/klean-ui/components/select) — choosing a persistent fixed-list value.
