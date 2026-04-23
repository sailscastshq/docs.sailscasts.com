---
title: Getting Started
description: Start using Durable UI progress and URL primitives with Vue composables or React hooks.
---

# Getting Started

Durable UI organizes client state by durability category. Use Progress when private work should survive refreshes until the user submits. Use URL when the view itself should be shareable and bookmarkable.

Install the package for the app you are building.

::: code-group

```sh [Vue]
npm install @durable-ui/vue
```

```sh [React]
npm install @durable-ui/react
```

:::

## Use The URL Primitive

Vue APIs use composables and refs. React APIs use hooks and state tuples.

::: code-group

```vue [Vue]
<script setup>
import { useQueryState } from '@durable-ui/vue'

const activeTab = useQueryState('tab', 'profile')
const search = useQueryState('search', '', { history: 'replace' })
</script>
```

```jsx [React]
import { useQueryState } from '@durable-ui/react'

export function SettingsPage() {
  const [activeTab, setActiveTab] = useQueryState('tab', 'profile')
  const [search, setSearch] = useQueryState('search', '', {
    history: 'replace'
  })

  return null
}
```

:::

## Use The Progress Primitives

Vue APIs use composables and refs. React APIs use hooks.

::: code-group

```vue [Vue]
<script setup>
import { useFormDraft, useWizardDraft } from '@durable-ui/vue'

const draft = useFormDraft('students:details', () => form.data(), {
  clearWhen: () => form.recentlySuccessful,
  restore: (data) => Object.assign(form, data)
})

const wizard = useWizardDraft('students:import', {
  details: { name: '', email: '' },
  import: { rows: [] }
})
</script>
```

```jsx [React]
import { useFormDraft, useWizardDraft } from '@durable-ui/react'

const steps = {
  details: { name: '', email: '' },
  import: { rows: [] }
}

export function StudentImport({ form }) {
  const draft = useFormDraft('students:details', form.data, {
    clearWhen: form.recentlySuccessful,
    onRestore: form.setData
  })

  const wizard = useWizardDraft('students:import', steps)

  // Render restore/discard UI from draft.hasDraft.
  // Render step UI from wizard.currentStep and wizard.steps.
}
```

:::

## Choose The Right Category

Use [query-state](/durable-ui/url/query-state) for shareable tabs, filters, sorting, pagination, and modal state.

Use [form-draft](/durable-ui/progress/form-draft) for private field values in one form.

Use [wizard-draft](/durable-ui/progress/wizard-draft) for private multi-step progress, such as step number, selected method, student rows, or parsed CSV rows.

If the state has already been submitted, belongs in records, or must be shared across devices, put it in the database instead.
