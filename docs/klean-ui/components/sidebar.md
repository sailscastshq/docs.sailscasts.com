---
title: Sidebar
titleTemplate: Klean UI
description: A durable native desktop aside with remembered visibility and application-owned navigation, links, and Tailwind across Vue, React, and Svelte.
outline: [2, 3]
---

<script setup>
import CopyCode from '../../.vitepress/theme/components/CopyCode.vue'
import KleanInstallation from '../../.vitepress/theme/components/KleanInstallation.vue'
import KleanPreview from '../../.vitepress/theme/components/KleanPreview.vue'
import SidebarRecipes from '../../.vitepress/theme/components/klean/sidebar/SidebarRecipes.vue'
import sidebarSource from '../../.vitepress/theme/components/klean/sidebar/Sidebar.vue?raw'
import reactSource from '../sources/sidebar/Sidebar.jsx?raw'
import svelteSource from '../sources/sidebar/Sidebar.svelte?raw'
import vueUsage from '../snippets/sidebar/usage.vue?raw'
import reactUsage from '../snippets/sidebar/usage.jsx?raw'
import svelteUsage from '../snippets/sidebar/usage.svelte?raw'
import appShellSource from '../snippets/sidebar/app-shell.vue?raw'
</script>

# Sidebar

Sidebar is one persistent native `<aside>` for application navigation. It remembers whether the user left it open, keeps closed links out of the focus order, and exposes a small imperative handle for an application-owned trigger.

The application still writes every `<nav>`, list, real `<a>` or Boring Stack `<Link>`, current-page marker, logo, menu, permission check, and Tailwind class. There is no item schema, router adapter, provider, collapse icon, breakpoint, visual variant, or application-shell package.

<KleanPreview id="sidebar-app-shell" :source="appShellSource" filename="AppShell.vue">
  <template #preview>
    <SidebarRecipes />
  </template>
  <template #caption>
    Resize the page: Sidebar is persistent desktop navigation; the same app-owned navigation becomes a native modal Sheet on narrow screens.
  </template>
</KleanPreview>

## Installation

One command detects Vue, React, or Svelte and copies the matching one-file source into the conventional component directory:

<KleanInstallation
  id="sidebar-installation"
  component="sidebar"
  :source="sidebarSource"
  filename="Sidebar.vue"
  destination="assets/js/components/ui/sidebar/Sidebar.vue"
/>

There is no initializer, `klean-ui.json`, provider, navigation configuration, class helper, barrel file, or Klean runtime.

## Sidebar or Sheet?

The two components solve different semantic problems. Do not make one pretend to be both.

| Surface                                 | Use                                                      | Browser relationship         |
| --------------------------------------- | -------------------------------------------------------- | ---------------------------- |
| [Sidebar](/klean-ui/components/sidebar) | Persistent navigation that occupies desktop layout space | Ordinary non-modal `<aside>` |
| [Sheet](/klean-ui/components/sheet)     | Temporary mobile navigation over the current page        | Native modal `<dialog>`      |

The desktop Sidebar may be open or closed by preference. The mobile Sheet is temporary and closes after navigation. Keeping them separate lets the browser own modal focus containment, Escape, background inertness, and focus return without burdening the desktop landmark with dialog behavior.

## Usage

The component does not manufacture navigation items. Write honest links directly and connect the external trigger with `aria-controls` and `aria-expanded`.

### Vue

<CopyCode :code="vueUsage" label="AppShell.vue" />

### React

<CopyCode :code="reactUsage" label="AppShell.jsx" />

### Svelte

<CopyCode :code="svelteUsage" label="AppShell.svelte" />

## API

| Purpose                              | Vue            | React                  | Svelte            | Default                        |
| ------------------------------------ | -------------- | ---------------------- | ----------------- | ------------------------------ |
| Stable landmark and memory namespace | `id`           | `id`                   | `id`              | `app-sidebar`                  |
| Open state                           | `v-model:open` | `open`, `onOpenChange` | `bind:open`       | uncontrolled                   |
| Initial state                        | `default-open` | `defaultOpen`          | `defaultOpen`     | `true`                         |
| Remember the choice                  | `remember`     | `remember`             | `remember`        | `true`                         |
| Styling                              | `class`        | `className`            | `class`           | structural motion only         |
| Actions                              | component ref  | forwarded ref          | component binding | `show()`, `hide()`, `toggle()` |

The content slot, render function, or snippet also receives `{ open, show, hide, toggle }`. That is useful for an internal collapse control, but the closed Sidebar becomes inert; the application should keep at least one show/toggle button outside it.

Use a stable, unique `id` whenever an application has more than one shell, such as `primary-navigation` and `bridge-navigation`. That gives each Sidebar an independent remembered choice without another configuration prop.

Set `remember={false}` only when persistence would be dishonest: an embedded preview, test fixture, kiosk, or other intentionally transient shell.

## Durable behavior

Sidebar remembers the last desktop choice across visits and keeps open application tabs in agreement. A controlled caller remains authoritative, malformed or unavailable browser memory does not break navigation, and server rendering never assumes a browser exists.

The restored value is reported through the framework-native binding callback. Initializing a bound value as `undefined` lets Sidebar restore its remembered state and gives the parent the correct value for the trigger's `aria-expanded`. Passing an explicit boolean makes the caller authoritative from the first render.

Closing sets `data-state="closed"`, `aria-hidden="true"`, and `inert` on the aside. Caller Tailwind then collapses its width and opacity. This matters: visually hiding a rail while leaving its links keyboard-focusable would be a regression.

Back/Forward navigation and route changes do not rewrite the desktop preference. The destination remains durable because every item is still a real link; Sidebar never turns navigation into button state.

## Responsive application shell

Extract the app-owned navigation links into a local `AppNavigation` component, then compose it into Sidebar and Sheet. That shares routes, active state, authorization, labels, and product styling without making Klean accept a navigation-data schema.

<CopyCode :code="appShellSource" label="AppShell.vue" />

Desktop and mobile may need different surrounding headers or close controls. Keep those surface-specific elements outside `AppNavigation`; the navigation component should contain the truthful destinations shared by both.

## Link and current-page semantics

Use a real `<a href>` for document navigation or the framework-native Boring Stack `Link` for an Inertia visit. Mark only the current destination with `aria-current="page"`. Sidebar does not infer the route because applications differ on nested resources, query-backed workspaces, permissions, and what counts as a current section.

Buttons inside the Sidebar are for real actions such as switching a team or signing out. Do not use a button for a destination and do not give ordinary navigation links tab roles.

## Accessibility

- Give the aside an accessible label such as `aria-label="Project navigation"` when the page contains more than one complementary landmark.
- Put a labeled `<nav>` and a list of destinations inside it. Sidebar is the shell landmark, not a replacement for navigation semantics.
- Keep the trigger outside the collapsible aside and connect it with `aria-controls` and `aria-expanded`.
- Include a skip link before a dense application shell and give the main landmark a stable target.
- Use visible focus, ordinary link activation, and `aria-current="page"`; do not add a custom arrow-key navigation model to a standard list of links.
- The neutral width/opacity transition respects reduced motion. Caller-added motion must do the same.
- Use Sheet for narrow-screen modal navigation so the browser owns focus containment, Escape, background inertness, scroll locking, and invoker focus return.

## Styling with Tailwind

Sidebar supplies only structural overflow and a short width/opacity transition. The caller supplies the actual open width and closed treatment:

```html
class="w-56 border-r bg-gray-50 data-[state=closed]:w-0
data-[state=closed]:opacity-0"
```

`tailwind-merge` lets later caller classes replace timing, easing, width, opacity, or overflow. Use ordinary responsive utilities such as `hidden md:block`; there is no `side`, `size`, `density`, `tone`, `collapsedWidth`, or visual variant prop.

An icon-only rail is not the same closed state because its links remain available. Keep an icon rail as an explicit application recipe with accessible names and tooltips rather than forcing it through Sidebar's inert closed contract.

## When not to use

- Use ordinary `<aside>` markup when the region never opens, closes, or remembers a choice.
- Use [Sheet](/klean-ui/components/sheet) for modal mobile navigation or another temporary edge surface.
- Use [Tabs](/klean-ui/components/tabs) for peer sections within the current page or route, not global application hierarchy.
- Use [Menu](/klean-ui/components/menu) for a compact set of actions or destinations opened from one trigger.
- Do not use Sidebar as a router, authorization layer, nested-tree state machine, resizable panel, or universal page layout.

## Complete framework source

Copy, inspect, and change the complete one-file source for your framework.

### Vue source

<CopyCode :code="sidebarSource" label="Sidebar.vue" />

### React source

<CopyCode :code="reactSource" label="Sidebar.jsx" />

### Svelte source

<CopyCode :code="svelteSource" label="Sidebar.svelte" />

## Related components

- [Sheet](/klean-ui/components/sheet) — presents the same app-owned navigation as a native modal on narrow screens.
- [Button](/klean-ui/components/button) — supplies the external open/close trigger and honest action controls.
- [Menu](/klean-ui/components/menu) — handles team, account, and contextual actions inside the shell.
- [Avatar](/klean-ui/components/avatar) — renders resilient team or account identity without becoming navigation.
- [Tooltip](/klean-ui/components/tooltip) — names evidenced icon-only rail controls when an application keeps them visible.
- [Breadcrumb](/klean-ui/components/breadcrumb) — represents the current location inside the hierarchy.
- [Tabs](/klean-ui/components/tabs) — handles peer page sections or route destinations below the application shell.
