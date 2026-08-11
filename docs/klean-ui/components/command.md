---
title: Command
titleTemplate: Klean UI
description: One pragmatic, accessible command surface for application actions across Vue, React, and Svelte.
outline: [2, 3]
---

<script setup>
import { ref } from 'vue'
import CopyCode from '../../.vitepress/theme/components/CopyCode.vue'
import KleanInstallation from '../../.vitepress/theme/components/KleanInstallation.vue'
import KleanPreview from '../../.vitepress/theme/components/KleanPreview.vue'
import KleanCommand from '../../.vitepress/theme/components/klean/command/Command.vue'
import commandSource from '../../.vitepress/theme/components/klean/command/Command.vue?raw'
import reactSource from '../sources/command/Command.jsx?raw'
import svelteSource from '../sources/command/Command.svelte?raw'
import vueUsage from '../snippets/command/usage.vue?raw'
import reactUsage from '../snippets/command/usage.jsx?raw'
import svelteUsage from '../snippets/command/usage.svelte?raw'
import rankedUsage from '../snippets/command/ranked.vue?raw'
import paletteUsage from '../snippets/command/palette.vue?raw'
import nestedUsage from '../snippets/command/nested.vue?raw'

const query = ref('')
const selected = ref('Nothing yet')
const commands = [
  {
    id: 'projects',
    title: 'Open projects',
    subtitle: 'View every application and service',
    keywords: ['dashboard', 'apps'],
    group: 'Navigation',
    shortcut: 'G P'
  },
  {
    id: 'lookout',
    title: 'Open Lookout',
    subtitle: 'Inspect metrics and recent incidents',
    keywords: ['monitoring', 'metrics'],
    group: 'Navigation',
    shortcut: 'G L'
  },
  {
    id: 'deploy',
    title: 'Deploy application',
    subtitle: 'Choose an application to deploy',
    keywords: ['ship', 'release'],
    group: 'Actions',
    shortcut: 'D'
  },
  {
    id: 'restart',
    title: 'Restart production',
    subtitle: 'Unavailable during the active deployment',
    keywords: ['reboot'],
    group: 'Actions',
    disabled: true
  }
]

const vueFiles = [
  {
    filename: 'Command.vue',
    destination: 'assets/js/components/ui/command/Command.vue',
    source: commandSource
  }
]
</script>

# Command

Command turns ordinary application records into one searchable, keyboard-complete command surface. Give it `commands`; it renders the real input, groups and options, keeps focus stable, filters titles and keywords, and gives the selected record back unchanged.

There is one component to install and use. Routes, icons, permissions, async work, nested flows, and product-specific fields remain on your records and in your application code.

<KleanPreview id="command-source" :source="commandSource" filename="Command.vue">
  <template #preview>
    <div class="grid w-full max-w-lg gap-3">
      <KleanCommand
        v-model:query="query"
        :commands="commands"
        label="Application commands"
        class="rounded-xl border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-900"
        @select="selected = $event.title"
      >
        <template #prefix>
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="mr-3 size-5 shrink-0 text-gray-400">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-4-4" />
          </svg>
        </template>
        <template #item="{ command }">
          <span class="flex min-w-0 flex-1 flex-col">
            <span class="truncate font-medium">{{ command.title }}</span>
            <span v-if="command.subtitle" class="truncate text-xs text-gray-500 dark:text-gray-400">
              {{ command.subtitle }}
            </span>
          </span>
          <kbd v-if="command.shortcut" aria-hidden="true" class="ml-auto font-mono text-xs text-gray-400">
            {{ command.shortcut }}
          </kbd>
        </template>
        <template #empty="{ query: emptyQuery }">
          No command matches “{{ emptyQuery }}”.
        </template>
      </KleanCommand>
      <output class="text-sm text-gray-500 dark:text-gray-400">Selected: {{ selected }}</output>
    </div>
  </template>
  <template #source>

<<< ../../.vitepress/theme/components/klean/command/Command.vue

  </template>
  <template #caption>
    Search “metrics”, use Arrow Up/Down, Home/End, and Enter, or point at an enabled result. The real input keeps focus throughout.
  </template>
</KleanPreview>

## Installation

One command detects Vue, React, or Svelte and copies the matching framework-native file:

<KleanInstallation
  id="command-installation"
  component="command"
  :source="commandSource"
  filename="Command.vue"
  destination="assets/js/components/ui/command/Command.vue"
  :files="vueFiles"
  :dependencies="['tailwind-merge']"
/>

That is the whole component. There is no initializer, config file, provider, generated class helper, runtime package, or interaction library.

## Usage

### Vue

<CopyCode :code="vueUsage" label="ApplicationCommands.vue" />

### React

<CopyCode :code="reactUsage" label="ApplicationCommands.jsx" />

### Svelte

<CopyCode :code="svelteUsage" label="ApplicationCommands.svelte" />

The framework binding changes; the command record and selection outcome do not.

## Command records

`title` is the only field required for the default rendering and search. A stable `id` is strongly recommended.

| Field         | Purpose                                                        |
| ------------- | -------------------------------------------------------------- |
| `id`          | Stable identity used for active-option relationships.          |
| `title`       | Visible command name and default search text.                  |
| `subtitle`    | Optional supporting text in the default item.                  |
| `keywords`    | Additional strings searched by the default filter.             |
| `group`       | Visible group heading. Missing groups become `Other`.          |
| `shortcut`    | Presentational shortcut hint. It does not register a listener. |
| `disabled`    | Keeps the command visible but prevents selection.              |
| `destructive` | Exposes `data-destructive` for a caller-owned Tailwind recipe. |

Add any application fields you need: `href`, `route`, `icon`, `action`, `children`, `context`, permission metadata, or something product-specific. Klean never reshapes or clones the record. Selection returns the same object you supplied.

## Two data paths, one component

Use `commands` by default. Klean filters `title` and `keywords`, groups records by `group`, preserves their order, and highlights the first enabled result.

Use `groups` only when your application already owns ranking, recent history, permissions, remote results, or a domain-specific search. Pass an ordered object such as `{ Recent: [...], Projects: [...] }`. Klean renders those groups exactly as supplied and still owns the accessible input and keyboard interaction; it does not filter or reorder them.

<CopyCode :code="rankedUsage" label="RankedCommands.vue" />

This is not a second component or a mode to learn. It is the escape hatch that lets an existing search model keep doing its job.

## API

| Input                     | Default                     | Purpose                                                                                        |
| ------------------------- | --------------------------- | ---------------------------------------------------------------------------------------------- |
| `commands`                | `[]`                        | Flat records for the ordinary Klean filtering and grouping path.                               |
| `groups`                  | —                           | Caller-filtered and ordered `{ heading: commands }` results. Takes precedence over `commands`. |
| `query`                   | internal                    | Controlled query: Vue `v-model:query`, React `query`, or Svelte `bind:query`.                  |
| `defaultQuery`            | `''`                        | Initial query for uncontrolled use.                                                            |
| `label`                   | `Search commands`           | Accessible name for the real combobox input.                                                   |
| `placeholder`             | `Type a command or search…` | Native input placeholder.                                                                      |
| `filter`                  | normalized substring        | Boolean `(command, query) => visible` predicate for `commands`.                                |
| `autofocus` / `autoFocus` | `false`                     | Focus the input when a newly opened palette needs it.                                          |
| `id`                      | generated                   | Stable base ID when server and client markup require an explicit value.                        |
| `class` / `className`     | —                           | Ordinary Tailwind merged onto the root.                                                        |

| Outcome               | Vue             | React           | Svelte          |
| --------------------- | --------------- | --------------- | --------------- |
| Query changed         | `@update:query` | `onQueryChange` | `onquerychange` |
| Record selected       | `@select`       | `onSelect`      | `onselect`      |
| Empty-query Escape    | `@escape`       | `onEscape`      | `onescape`      |
| Empty-query Backspace | `@back`         | `onBack`        | `onback`        |

Escape clears a non-empty query first. Escape and Backspace delegate only when the query is already empty, making surrounding dialogs and nested flows easy to control without hidden navigation policy.

## Custom rendering without component ceremony

The default renderer covers a title, subtitle, shortcut, disabled state, groups, and an empty result. Customize only the seam your product owns:

| Area          | Vue                           | React         | Svelte           |
| ------------- | ----------------------------- | ------------- | ---------------- |
| Before input  | `#prefix`                     | `prefix`      | `prefix` snippet |
| After input   | `#suffix`                     | `suffix`      | `suffix` snippet |
| Before groups | `#before`                     | `before`      | `before` snippet |
| Each item     | `#item="{ command, active }"` | `renderItem`  | `item` snippet   |
| Empty result  | `#empty="{ query }"`          | `renderEmpty` | `empty` snippet  |
| After list    | `#footer`                     | `footer`      | `footer` snippet |

Caller Tailwind remains the styling API. Stable `data-slot` hooks cover `command`, `command-search`, `command-input`, `command-list`, `command-empty`, `command-group`, `command-group-heading`, and `command-item`. Items also expose `data-state`, `data-highlighted`, and `data-destructive`.

There are no `variant`, `tone`, `size`, theme, icon, or part-class props.

## Native Dialog palette

Command does not own a modal, global shortcut, or open state. Compose it inside [Dialog](/klean-ui/components/dialog), let native `<dialog>` provide focus containment and inert background behavior, and remove application listeners when their page unmounts:

<CopyCode :code="paletteUsage" label="ApplicationPalette.vue" />

The button uses native dialog commands. Native Dialog restores focus to its invoker. A keyboard shortcut has no invoker, so focus remains with the most sensible available target.

## Nested application flows

Some commands lead to another list, such as “Deploy application” followed by an application. Keep that small state machine in the application and replace the `commands` records:

<CopyCode :code="nestedUsage" label="DeployCommands.vue" />

The original record can carry `children`, `action`, or any other application field. Klean only reports selection.

## Keyboard and accessibility

- DOM focus stays on one real text input while `aria-activedescendant` identifies the highlighted option.
- Arrow Down and Arrow Up wrap across enabled visible commands.
- Home and End move to the enabled edges.
- Enter selects the highlighted command once.
- Disabled commands remain understandable but are skipped by keyboard and pointer selection.
- Pointer movement may highlight an item without stealing input focus.
- IME composition is never interpreted as command navigation.
- Dynamic permission or data changes recover to a valid active descendant.
- Long lists reveal the active command as it moves.
- Tab is untouched and continues through the document normally.

The built-in `label` names the input and groups label themselves. Visible item content should make the action or destination clear without relying on an icon or shortcut.

## Async work and durability

Command reports a record; the application decides what accepting it means. Navigate, enter a nested step, or begin async work. Show truthful pending state, disable only unsafe repeats, and close the surrounding surface when acceptance completes. Keep it open with a visible error when recovery belongs there.

Query, active command, and palette visibility are ephemeral by default. Do not put them in local storage or the URL merely because they can be persisted. Preserve the resulting route, task, or form state when the product needs durability.

There is no hidden promise queue, toast coupling, deploy API, router adapter, permission model, or persistence policy.

## When to use Command

Use Command when typed text narrows application actions or destinations: a command palette, quick-create surface, operations launcher, or searchable step in a task.

- Use [Combobox](/klean-ui/components/combobox) when the result commits one form or relationship value.
- Use [Menu](/klean-ui/components/menu) for a short action list that does not need a query.
- Use [Dialog](/klean-ui/components/dialog) when the surface should be modal; Command composes inside it.
- Use [Input](/klean-ui/components/input) when arbitrary text, rather than a record, is the result.
- Use dedicated site search when results are documents ranked by a search index.

## Related components

- [Combobox](/klean-ui/components/combobox) — searches and commits one data value.
- [Menu](/klean-ui/components/menu) — a short action list without text search.
- [Dialog](/klean-ui/components/dialog) — an optional native modal container.
- [Popover](/klean-ui/components/popover) — non-modal floating content with ordinary Tab order.
- [Input](/klean-ui/components/input) — free-form text rather than command selection.
- [Toast](/klean-ui/components/toast) — feedback after application work begins or completes.

## Complete framework source

### Vue

<CopyCode :code="commandSource" label="Command.vue" />

### React

<CopyCode :code="reactSource" label="Command.jsx" />

### Svelte

<CopyCode :code="svelteSource" label="Command.svelte" />
