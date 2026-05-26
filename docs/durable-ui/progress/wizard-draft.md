---
title: wizard-draft
description: Persist private multi-step progress with useWizardDraft.
---

# wizard-draft

`wizard-draft` protects private progress for a multi-step flow.

Use it when the fragile state is bigger than one form: the current step, selected path, per-step data, parsed rows, or other workflow state the user has not submitted yet.

## Import

::: code-group

```vue [Vue]
import { useWizardDraft } from '@durable-ui/vue'
```

```jsx [React]
import { useWizardDraft } from '@durable-ui/react'
```

:::

## Usage

::: code-group

```vue [Vue]
<script setup>
import { useWizardDraft } from '@durable-ui/vue'

const wizard = useWizardDraft('students:import', {
  details: { name: '', email: '' },
  import: { rows: [] }
})
</script>
```

```jsx [React]
import { useWizardDraft } from '@durable-ui/react'

const steps = {
  details: { name: '', email: '' },
  import: { rows: [] }
}

export function StudentImport() {
  const wizard = useWizardDraft('students:import', steps)

  return null
}
```

:::

## When To Use It

Use `useWizardDraft` for:

- Multi-step onboarding.
- Setup wizards.
- Import flows.
- Step-specific data.
- Parsed CSV rows that should survive refresh before final submit.

Do not use it for authoritative records. Once the user submits successfully, clear the draft and let the server own the submitted state.

## Properties

`useWizardDraft` returns state for rendering the wizard and its restore UI.

In Vue, reactive values are returned as refs or computed refs. In React, they are returned as plain values.

| Property         | Meaning                                                      |
| ---------------- | ------------------------------------------------------------ |
| `currentStep`    | The current 1-based step number.                             |
| `currentStepKey` | The key for the current step, such as `details` or `import`. |
| `totalSteps`     | The number of steps in the wizard.                           |
| `stepKeys`       | The ordered step keys from the defaults object.              |
| `steps`          | The data for each step.                                      |
| `allData`        | All step data flattened into one object for final submit.    |
| `canGoBack`      | Whether the wizard can move to the previous step.            |
| `canGoNext`      | Whether the wizard can move to the next step.                |
| `draft`          | The saved wizard draft envelope, or `null`.                  |
| `draftSavedAt`   | A `Date` for when the wizard draft was saved.                |
| `hasDraft`       | Whether a restorable wizard draft currently exists.          |
| `restoredDraft`  | Whether a saved wizard draft has been restored.              |

## Methods

`useWizardDraft` returns navigation helpers, step-data helpers, and draft actions.

| Method                    | When to call it                                                      |
| ------------------------- | -------------------------------------------------------------------- |
| `goBack()`                | Move to the previous step.                                           |
| `goNext()`                | Move to the next step.                                               |
| `goToStep(step)`          | Move to a step by number or key.                                     |
| `updateStep(step, patch)` | Merge a patch into one step's existing data.                         |
| `replaceStep(step, data)` | Replace one step's data entirely.                                    |
| `restore()`               | Restore the saved wizard draft.                                      |
| `discard()`               | Remove the saved draft without resetting the visible wizard state.   |
| `clear()`                 | Remove the saved draft after final submit succeeds.                  |
| `save()`                  | Write the current wizard progress immediately instead of debouncing. |
| `reset()`                 | Return the wizard to defaults and clear the stored draft.            |

## With form-draft

`wizard-draft` does not always need `form-draft`.

Use only `wizard-draft` when one component owns the whole flow and each step writes data into `wizard.steps` with `updateStep()` or `replaceStep()`.

Pair `wizard-draft` with `form-draft` when each step owns a real form instance, such as an Inertia form or React Hook Form instance. In that setup, `wizard-draft` owns the orchestration state, while `form-draft` owns each form's private field draft.

::: code-group

```vue [Vue]
<script setup>
const wizard = useWizardDraft('students:import', {
  details: {},
  import: {}
})

const detailsDraft = useFormDraft(
  'students:import:details',
  () => form.data(),
  {
    clearWhen: () => form.recentlySuccessful,
    restore: (data) => form.defaults(data).reset()
  }
)
</script>
```

```jsx [React]
const wizard = useWizardDraft('students:import', {
  details: {},
  import: {}
})

const detailsDraft = useFormDraft('students:import:details', form.data, {
  clearWhen: form.recentlySuccessful,
  onRestore: form.setData
})
```

:::

On final successful submit, clear the wizard draft and any step-level form drafts that belong to that flow.
