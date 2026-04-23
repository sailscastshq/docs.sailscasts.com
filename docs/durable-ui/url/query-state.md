---
title: query-state
description: Keep one query parameter in sync with useQueryState.
---

# query-state

`query-state` keeps one query parameter in sync with the current UI.

Use it when the state belongs in the URL because the view should be shareable, bookmarkable, and restorable from a link.

## Import

::: code-group

```vue [Vue]
import { useQueryState } from '@durable-ui/vue'
```

```jsx [React]
import { useQueryState } from '@durable-ui/react'
```

:::

## Usage

::: code-group

```vue [Vue]
<script setup>
import { useQueryState } from '@durable-ui/vue'

const activeTab = useQueryState('tab', 'profile')
</script>
```

```jsx [React]
import { useQueryState } from '@durable-ui/react'

export function SettingsTabs() {
  const [activeTab, setActiveTab] = useQueryState('tab', 'profile')

  return null
}
```

:::

## When To Use It

Use `useQueryState` for:

- Tabs.
- Search terms.
- Filters.
- Sorting.
- Pagination.
- Shareable modal state.

Do not use it for private drafts, secrets, raw files, or large structured data that should stay out of the URL.

## Return Value

In Vue, `useQueryState` returns a writable ref. Read the current value from `.value` and assign back to `.value` when you want to update the URL.

In React, `useQueryState` returns a `[value, setValue]` tuple, following the `useState` shape developers already expect.

## Options

| Option    | Meaning                                                            |
| --------- | ------------------------------------------------------------------ |
| `history` | `'push'` creates a Back-button step. `'replace'` updates in place. |

## Replace History For Typing

Use `history: 'replace'` for state that changes rapidly, such as a search input.

::: code-group

```vue [Vue]
<script setup>
import { useQueryState } from '@durable-ui/vue'

const search = useQueryState('search', '', { history: 'replace' })
</script>
```

```jsx [React]
import { useQueryState } from '@durable-ui/react'

export function SearchInput() {
  const [search, setSearch] = useQueryState('search', '', {
    history: 'replace'
  })

  return null
}
```

:::

## Behavior

`useQueryState`:

- Reads the current query parameter on mount.
- Removes the parameter when the value becomes `null`, `''`, or the default value.
- Preserves unrelated query parameters and hash fragments.
- Responds to Back and Forward navigation.
