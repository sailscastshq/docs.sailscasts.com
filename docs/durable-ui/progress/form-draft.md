---
title: form-draft
description: Persist private field values for one form with useFormDraft.
---

# form-draft

`form-draft` protects private field values for one form.

Use it when the fragile state is the user's unsaved form data and losing that data would make them repeat work.

## Import

::: code-group

```vue [Vue]
import { useFormDraft } from '@durable-ui/vue'
```

```jsx [React]
import { useFormDraft } from '@durable-ui/react'
```

:::

## Usage

::: code-group

```vue [Vue]
<script setup>
import { useForm } from '@inertiajs/vue3'
import { useFormDraft } from '@durable-ui/vue'

const form = useForm({
  name: '',
  email: ''
})

const draft = useFormDraft('students:create', () => form.data(), {
  clearWhen: () => form.recentlySuccessful,
  restore: (data) => form.defaults(data).reset()
})
</script>
```

```jsx [React]
import { useFormDraft } from '@durable-ui/react'

export function StudentForm({ form }) {
  const draft = useFormDraft('students:create', form.data, {
    clearWhen: form.recentlySuccessful,
    onRestore: form.setData
  })

  return null
}
```

:::

## When To Use It

Use `useFormDraft` for:

- One logical form.
- Private field values.
- Long forms where refresh should not erase work.
- Failed submit flows where the user should not retype everything.

Do not use it for submitted records, secrets, raw files, or state that should be shared by URL.

## Properties

`useFormDraft` returns the state needed to render restore, discard, and saved-at UI.

In Vue, reactive values are returned as refs or computed refs. In React, they are returned as plain values.

| Property       | Meaning                                      |
| -------------- | -------------------------------------------- |
| `draft`        | The saved draft envelope, or `null`.         |
| `draftSavedAt` | A `Date` for when the draft was saved.       |
| `hasDraft`     | Whether a restorable draft currently exists. |

## Methods

`useFormDraft` returns the actions needed to manage the draft.

| Method        | When to call it                                                   |
| ------------- | ----------------------------------------------------------------- |
| `restore()`   | When the user chooses to restore the saved draft into the form.   |
| `discard()`   | When the user chooses not to restore the saved draft.             |
| `clear()`     | After the real submit succeeds and the server owns the data.      |
| `save(data?)` | When you want to write a draft immediately instead of debouncing. |
