---
title: Flash Messages
editLink: true
prev:
  text: Sharing data
  link: '/inertia-sails/sharing-data'
next:
  text: View data
  link: '/inertia-sails/view-data'
---

# Flash Messages

Flash messages are one-time notifications that don't persist when navigating back in browser history. inertia-sails provides a simple API for flash messages.

## Basic Usage

Use `sails.inertia.flash()` to set flash messages:

```js
// Single key-value
sails.inertia.flash('success', 'Profile updated!')

// Object form for multiple values
sails.inertia.flash({
  success: 'Changes saved!',
  warning: 'Some fields were skipped'
})
```

## Common Patterns

### After Form Submission

```js
module.exports = {
  inputs: {
    fullName: { type: 'string', required: true }
  },

  exits: {
    success: { responseType: 'inertiaRedirect' }
  },

  fn: async function ({ fullName }) {
    await User.updateOne({ id: this.req.session.userId }).set({ fullName })

    sails.inertia.flash('success', 'Profile updated!')
    sails.inertia.refreshOnce('loggedInUser')

    return sails.inertia.back('/profile')
  }
}
```

### Error Messages

```js
fn: async function () {
  try {
    await ExternalService.process()
    sails.inertia.flash('success', 'Processing complete!')
  } catch (err) {
    sails.inertia.flash('error', 'Processing failed. Please try again.')
    sails.log.error('Processing error:', err)
  }

  return sails.inertia.back('/dashboard')
}
```

## Accessing Flash Messages

Flash messages are available via `page.props.flash`:

### Vue

```vue
<script setup>
import { usePage } from '@inertiajs/vue3'

const page = usePage()
</script>

<template>
  <div v-if="page.props.flash?.success" class="alert alert-success">
    {{ page.props.flash.success }}
  </div>
  <div v-if="page.props.flash?.error" class="alert alert-danger">
    {{ page.props.flash.error }}
  </div>
</template>
```

### React

```jsx
import { usePage } from '@inertiajs/react'

function FlashMessages() {
  const { flash } = usePage().props

  return (
    <>
      {flash?.success && (
        <div className="alert alert-success">{flash.success}</div>
      )}
      {flash?.error && <div className="alert alert-danger">{flash.error}</div>}
    </>
  )
}
```

## Flash vs Share

| Feature                     | `flash()`             | `share()`       |
| --------------------------- | --------------------- | --------------- |
| Persists on back navigation | No                    | Yes             |
| One-time display            | Yes                   | No              |
| Use case                    | Notifications, alerts | Persistent data |

Use `flash()` for temporary notifications that shouldn't reappear when the user navigates back. Use `share()` for data that should persist across navigation.
