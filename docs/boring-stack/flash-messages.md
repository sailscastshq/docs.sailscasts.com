---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/boring-stack-social.png
title: Flash messages
titleTemplate: The Boring JavaScript Stack 🥱
description: Flash messages in The Boring JavaScript Stack
prev:
  text: Validation
  link: '/boring-stack/validation'
next:
  text: Sharing data
  link: '/boring-stack/sharing-data'
editLink: true
---

# Flash messages

Flash messages are stable and boring mechanisms for sharing messages between requests.

In fact, The Boring Stack leverages flash messages for sending [server-side validation error messages](/boring-stack/validation).

## Sending flash messages

You can send a flash message in your action using `req.flash()`.

```js
module.exports = {
  exits: {
    success: {
      responseType: 'redirect'
    }
  }
  fn: async function () {
    req.flash('message', 'Look like your timezone has changed')
    req.flash('success', 'Billing details updated successfully')
    req.flash('error', 'Your subscription could not be renewed')

    return '/dashboard'
  }
}
```

## Reading flash messages

Flash messages sent in your actions are made available in a `flash` page prop object with `3` properties like so.

- `success`: Use this for indicating successful operations.
- `error`: Use this to communicate errors or failures.
- `message`: Use this for generic messages.

::: code-group

```js [Vue]
import { usePage } from '@inertiajs/vue3'
const messages = usePage().props.flash.success // can be flash.message, flash.error
```

```js [React]
import { usePage } from '@inertiajs/react'
const messages = usePage().props.flash.success // can be flash.message, flash.error
```

```js [Svelte]
import { page } from '@inertiajs/svelte'
const messages = page.props.flash.success // can be flash.message, flash.error
```

:::

::: tip
The properties of the flash prop are always an array
:::
