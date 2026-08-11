---
title: Command
titleTemplate: Klean UI
description: A pragmatic, accessible command-list composition for application actions across Vue, React, and Svelte.
outline: [2, 3]
---

<script setup>
import { ref } from 'vue'
import CopyCode from '../../.vitepress/theme/components/CopyCode.vue'
import KleanInstallation from '../../.vitepress/theme/components/KleanInstallation.vue'
import KleanPreview from '../../.vitepress/theme/components/KleanPreview.vue'
import KleanCommand from '../../.vitepress/theme/components/klean/command/Command.vue'
import KleanCommandEmpty from '../../.vitepress/theme/components/klean/command/CommandEmpty.vue'
import KleanCommandGroup from '../../.vitepress/theme/components/klean/command/CommandGroup.vue'
import KleanCommandInput from '../../.vitepress/theme/components/klean/command/CommandInput.vue'
import KleanCommandItem from '../../.vitepress/theme/components/klean/command/CommandItem.vue'
import KleanCommandList from '../../.vitepress/theme/components/klean/command/CommandList.vue'
import KleanCommandSeparator from '../../.vitepress/theme/components/klean/command/CommandSeparator.vue'
import KleanCommandShortcut from '../../.vitepress/theme/components/klean/command/CommandShortcut.vue'
import commandSource from '../../.vitepress/theme/components/klean/command/Command.vue?raw'
import commandInputSource from '../../.vitepress/theme/components/klean/command/CommandInput.vue?raw'
import commandListSource from '../../.vitepress/theme/components/klean/command/CommandList.vue?raw'
import commandEmptySource from '../../.vitepress/theme/components/klean/command/CommandEmpty.vue?raw'
import commandGroupSource from '../../.vitepress/theme/components/klean/command/CommandGroup.vue?raw'
import commandItemSource from '../../.vitepress/theme/components/klean/command/CommandItem.vue?raw'
import commandSeparatorSource from '../../.vitepress/theme/components/klean/command/CommandSeparator.vue?raw'
import commandShortcutSource from '../../.vitepress/theme/components/klean/command/CommandShortcut.vue?raw'
import commandContextSource from '../../.vitepress/theme/components/klean/command/context.js?raw'
import reactSource from '../sources/command/Command.jsx?raw'
import svelteCommandSource from '../sources/command/Command.svelte?raw'
import svelteInputSource from '../sources/command/CommandInput.svelte?raw'
import svelteListSource from '../sources/command/CommandList.svelte?raw'
import svelteEmptySource from '../sources/command/CommandEmpty.svelte?raw'
import svelteGroupSource from '../sources/command/CommandGroup.svelte?raw'
import svelteItemSource from '../sources/command/CommandItem.svelte?raw'
import svelteSeparatorSource from '../sources/command/CommandSeparator.svelte?raw'
import svelteShortcutSource from '../sources/command/CommandShortcut.svelte?raw'
import svelteContextSource from '../sources/command/context.js?raw'
import vueUsage from '../snippets/command/usage.vue?raw'
import reactUsage from '../snippets/command/usage.jsx?raw'
import svelteUsage from '../snippets/command/usage.svelte?raw'
import paletteUsage from '../snippets/command/palette.vue?raw'
import nestedUsage from '../snippets/command/nested.vue?raw'

const query = ref('')
const selected = ref('Nothing yet')
const navigation = [
  {
    value: 'Open projects',
    description: 'View every application and service',
    keywords: ['dashboard', 'apps'],
    shortcut: 'G P'
  },
  {
    value: 'Open Lookout',
    description: 'Inspect metrics and recent incidents',
    keywords: ['monitoring', 'metrics'],
    shortcut: 'G L'
  }
]
const actions = [
  {
    value: 'Deploy application',
    description: 'Choose an application to deploy',
    keywords: ['ship', 'release'],
    shortcut: 'D'
  },
  {
    value: 'Restart production',
    description: 'Unavailable during the active deployment',
    keywords: ['reboot'],
    disabled: true
  }
]

const vueFiles = [
  { filename: 'Command.vue', destination: 'assets/js/components/ui/command/Command.vue', source: commandSource },
  { filename: 'CommandInput.vue', destination: 'assets/js/components/ui/command/CommandInput.vue', source: commandInputSource },
  { filename: 'CommandList.vue', destination: 'assets/js/components/ui/command/CommandList.vue', source: commandListSource },
  { filename: 'CommandEmpty.vue', destination: 'assets/js/components/ui/command/CommandEmpty.vue', source: commandEmptySource },
  { filename: 'CommandGroup.vue', destination: 'assets/js/components/ui/command/CommandGroup.vue', source: commandGroupSource },
  { filename: 'CommandItem.vue', destination: 'assets/js/components/ui/command/CommandItem.vue', source: commandItemSource },
  { filename: 'CommandSeparator.vue', destination: 'assets/js/components/ui/command/CommandSeparator.vue', source: commandSeparatorSource },
  { filename: 'CommandShortcut.vue', destination: 'assets/js/components/ui/command/CommandShortcut.vue', source: commandShortcutSource },
  { filename: 'context.js', destination: 'assets/js/components/ui/command/context.js', source: commandContextSource }
]

const svelteFiles = [
  { filename: 'Command.svelte', source: svelteCommandSource },
  { filename: 'CommandInput.svelte', source: svelteInputSource },
  { filename: 'CommandList.svelte', source: svelteListSource },
  { filename: 'CommandEmpty.svelte', source: svelteEmptySource },
  { filename: 'CommandGroup.svelte', source: svelteGroupSource },
  { filename: 'CommandItem.svelte', source: svelteItemSource },
  { filename: 'CommandSeparator.svelte', source: svelteSeparatorSource },
  { filename: 'CommandShortcut.svelte', source: svelteShortcutSource },
  { filename: 'context.js', source: svelteContextSource }
]
</script>

# Command

Command is the searchable list engine for actions and destinations inside an application. Klean keeps one real text input focused, exposes the active item through `aria-activedescendant`, filters explicit values and keywords, and handles the composite keyboard contract. The application keeps ownership of routes, permissions, icons, async work, and any nested flow.

It is deliberately a small composition, not a provider, command registry, router adapter, fuzzy-search package, or product schema.

<KleanPreview id="command-source" :source="commandSource" filename="Command.vue">
  <template #preview>
    <div class="grid w-full max-w-lg gap-3">
      <KleanCommand v-model:query="query" @select="selected = $event">
        <KleanCommandInput aria-label="Application commands" />
        <KleanCommandList aria-label="Available commands">
          <KleanCommandEmpty>No matching command.</KleanCommandEmpty>
          <KleanCommandGroup heading="Navigation">
            <KleanCommandItem
              v-for="item in navigation"
              :key="item.value"
              :value="item.value"
              :keywords="item.keywords"
            >
              <span class="min-w-0 flex-1">
                <span class="block font-medium">{{ item.value }}</span>
                <span class="mt-0.5 block truncate text-xs text-gray-500 dark:text-gray-400">{{ item.description }}</span>
              </span>
              <KleanCommandShortcut>{{ item.shortcut }}</KleanCommandShortcut>
            </KleanCommandItem>
          </KleanCommandGroup>
          <KleanCommandSeparator />
          <KleanCommandGroup heading="Actions">
            <KleanCommandItem
              v-for="item in actions"
              :key="item.value"
              :value="item.value"
              :keywords="item.keywords"
              :disabled="item.disabled"
            >
              <span class="min-w-0 flex-1">
                <span class="block font-medium">{{ item.value }}</span>
                <span class="mt-0.5 block truncate text-xs text-gray-500 dark:text-gray-400">{{ item.description }}</span>
              </span>
              <KleanCommandShortcut v-if="item.shortcut">{{ item.shortcut }}</KleanCommandShortcut>
            </KleanCommandItem>
          </KleanCommandGroup>
        </KleanCommandList>
      </KleanCommand>
      <output class="text-sm text-gray-500 dark:text-gray-400">Selected: {{ selected }}</output>
    </div>
  </template>
  <template #source>

<<< ../../.vitepress/theme/components/klean/command/Command.vue

  </template>
  <template #caption>
    Search “metrics”, use Arrow Up/Down, Home/End, and Enter, or point directly at an enabled result. Input focus does not jump around the list.
  </template>
</KleanPreview>

## Installation

Run one command in a Vue, React, or Svelte application. Klean detects the framework and conventional component directory, then copies the framework-native composition and its only direct dependency.

<KleanInstallation
  id="command-installation"
  component="command"
  :source="commandSource"
  filename="Command.vue"
  destination="assets/js/components/ui/command/Command.vue"
  :files="vueFiles"
  :dependencies="['tailwind-merge']"
/>

No initializer, config file, provider, alias questionnaire, generated class helper, runtime package, or interaction library is added.

## Usage

### Vue

<CopyCode :code="vueUsage" label="ApplicationCommands.vue" />

### React

<CopyCode :code="reactUsage" label="ApplicationCommands.jsx" />

### Svelte

<CopyCode :code="svelteUsage" label="ApplicationCommands.svelte" />

The framework binding changes; the command values, keywords, item markup, and keyboard outcome do not.

## When to use Command

Use Command when a typed query narrows actions or destinations: an application palette, a quick-create surface, an operations launcher, or a searchable step in a task.

- Use [Combobox](/klean-ui/components/combobox) when the result commits one form or relationship value.
- Use [Menu](/klean-ui/components/menu) for a short action list that does not need a query.
- Use [Dialog](/klean-ui/components/dialog) when the surface should be modal; Command composes inside it.
- Use [Input](/klean-ui/components/input) when arbitrary text, rather than an item, is the result.
- Use dedicated site search when results are documents ranked by a search index. Command does not become a search backend.

This avoids a super-component with `mode="select|menu|palette|search"`. Those controls have different values, focus rules, and expectations even when they look similar.

## Composition API

| Part               | Purpose                                                                                       |
| ------------------ | --------------------------------------------------------------------------------------------- |
| `Command`          | Owns temporary query, item registration, filtering, active descendant, and keyboard movement. |
| `CommandInput`     | The one focused `combobox` input. Accepts ordinary input attributes.                          |
| `CommandList`      | The labelled `listbox` and scroll surface.                                                    |
| `CommandEmpty`     | A polite empty result shown only when no item matches.                                        |
| `CommandGroup`     | A visible and accessible labelled item group.                                                 |
| `CommandItem`      | One `option` with a required string `value`, optional `keywords`, and optional `disabled`.    |
| `CommandSeparator` | A visual separator between groups.                                                            |
| `CommandShortcut`  | Presentational shortcut text hidden from the accessible name.                                 |

### Root state and events

| Purpose               | Vue             | React                    | Svelte         |
| --------------------- | --------------- | ------------------------ | -------------- |
| Controlled query      | `v-model:query` | `query`, `onQueryChange` | `bind:query`   |
| Initial query         | `default-query` | `defaultQuery`           | `defaultQuery` |
| Item accepted         | `@select`       | `onSelect`               | `onselect`     |
| Empty-query Escape    | `@escape`       | `onEscape`               | `onescape`     |
| Empty-query Backspace | `@back`         | `onBack`                 | `onback`       |
| Custom visibility     | `:filter`       | `filter`                 | `filter`       |
| Styling               | `class`         | `className`              | `class`        |

The default filter performs normalized, case-insensitive substring matching across the item's `value` and `keywords`. A custom `filter(value, query, keywords)` may return a Boolean or a numeric score; `false` and scores at or below zero hide the item. Command does not reorder application records—sort them before rendering when ranking matters.

Each item also has its framework-native select callback. Put authorization and conditional rendering where the items are rendered. Klean never receives a permission model or route table.

## Native Dialog palette

Command does not own a modal, global shortcut, or open state. Compose it inside [Dialog](/klean-ui/components/dialog), let native `<dialog>` provide focus containment and inert background behavior, and clean up the application shortcut when its page unmounts:

<CopyCode :code="paletteUsage" label="ApplicationPalette.vue" />

The button uses native dialog commands. The dialog returns focus to its invoker after a command closes it. A global <kbd>Cmd/Ctrl + K</kbd> invocation has no originating button, so the browser keeps the most sensible available focus target.

## Nested application flows

Some commands lead to a second choice, such as “Deploy application” followed by an application. The application owns that small state machine. Command only provides two useful cancellation seams: empty-query Backspace emits `back`, and empty-query Escape emits `escape`.

<CopyCode :code="nestedUsage" label="DeployCommands.vue" />

Escape clears a non-empty query first. Only a second Escape at the empty root should close the surrounding surface. This makes correction cheap without trapping an app inside Klean's idea of navigation.

## Keyboard and accessibility

- DOM focus stays on the real text input while `aria-activedescendant` identifies the highlighted option.
- Arrow Down and Arrow Up wrap across enabled visible items.
- Home and End move to the enabled edges.
- Enter activates the highlighted item once.
- Disabled items remain understandable but are skipped by keyboard and pointer activation.
- Pointer movement may highlight an item without moving DOM focus; pointer selection completes before blur.
- IME composition is never interpreted as command navigation.
- Dynamic removal or filtering recovers to a valid active descendant.
- Long lists scroll the active item into view.
- Tab is untouched and continues through the document normally.

Give `CommandInput` and `CommandList` useful accessible names. Group headings label their own groups. The visible item content should make the action or destination clear without relying on an icon or shortcut.

## Async work

Command reports a selection; the application decides what accepting it means. For a navigation command, navigate. For a synchronous nested step, replace the rendered items. For asynchronous work, start the operation, expose truthful pending state in application markup, disable only unsafe repeats, and close the palette when acceptance is complete. Keep it open with a visible error when the person can recover there.

There is no hidden promise queue, toast coupling, deploy API, or router adapter.

## Styling

Every part merges its own `class` or `className` last, so ordinary Tailwind wins. There are no `variant`, `tone`, `size`, theme, icon, or part-class props.

Stable hooks are available when a parent-owned recipe needs them: `data-slot="command"`, `command-input`, `command-list`, `command-empty`, `command-group`, `command-group-heading`, `command-item`, `command-separator`, and `command-shortcut`. Items expose `data-state` and `data-highlighted`; the root exposes `data-state="results|empty"`.

Prefer mapping application records into visible `CommandItem` markup. That keeps descriptions, icons, links, permission checks, and product Tailwind close to the code that owns them.

## Durable state

Query, active item, and palette visibility are ephemeral by default. They should not appear in local storage or the URL merely because they can. Persist the underlying route, task, or form outcome when the product needs durability.

Command preserves the interaction instead:

- input focus remains stable while results change;
- Escape makes correction cheap before dismissal;
- empty-query Backspace gives nested flows a predictable way out;
- dynamic permission or data changes cannot leave a dead active descendant;
- native Dialog handles modal containment and focus return;
- application listeners and requests remain application-owned and are cleaned up where they are created.

## Related components

- [Combobox](/klean-ui/components/combobox) — searches and commits one data value.
- [Menu](/klean-ui/components/menu) — a short list of actions and destinations without text search.
- [Dialog](/klean-ui/components/dialog) — an optional native modal container for a command palette.
- [Popover](/klean-ui/components/popover) — non-modal floating content with ordinary Tab order.
- [Input](/klean-ui/components/input) — free-form text rather than a command selection.
- [Toast](/klean-ui/components/toast) — feedback after an application command begins or completes work.

## Complete framework source

### Vue

<div v-for="file in vueFiles" :key="file.filename">
  <CopyCode :code="file.source" :label="file.filename" />
</div>

### React

<CopyCode :code="reactSource" label="Command.jsx" />

### Svelte

<div v-for="file in svelteFiles" :key="file.filename">
  <CopyCode :code="file.source" :label="file.filename" />
</div>
