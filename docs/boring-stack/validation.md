---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/boring-stack-social.png
title: Validation
titleTemplate: The Boring JavaScript Stack 🥱
description: Validation errors handling in The Boring JavaScript Stack
prev:
  text: Redirects
  link: '/boring-stack/redirects'
next:
  text: Flash messages
  link: '/boring-stack/flash-messages'
editLink: true
---

# Validation

The Boring Stack leverages sessions and flash messages for handling server-side validation errors.

## How it works

When a validation error occurs while a form is submitted using Inertia, The Boring Stack will automatically detect that this is an Inertia request and then flash the error to the session using [Sails Flash](https://github.com/sailscastshq/sails-flash) and the error will be made available in both `usePage().props.errors` and `form.errors` if you are using the [form helper](https://inertiajs.com/forms#form-helper) provided by Inertia.

## Sharing errors

By default, when any input fails a Sails validation, the error will be flashed to the session and made available to you automatically.

You can also share errors in your action by throwing an exit with the `responseType` of `badRequest`. For example, in a login form you want to display the message "Email/Password is wrong", you can do so in your `login.js` action:

```js
module.exports = {
  exits: {
    badCombo: {
      responseType: 'badRequest'
    }
  },
  fn: async function () {
    const user = await User.findOne({ email })
    if (!user) {
      throw {
        badCombo: {
          problems: [{ login: 'Email/Password is wrong' }]
        }
      }
    }
  }
}
```

## Displaying errors

Then in your login page, you can access the `login` errror via `form.errors.login` if you are using the [form helper](https://inertiajs.com/forms#form-helper) or `usPage().props.errors.login`.

::: info
Learn more about [displaying errors](https://inertiajs.com/validation#displaying-errors) in the Inertia docs.
:::

## Error bags

If you are using the form helper, you don't need error bags because validatioin errors are scoped to the form object making the request.

::: info
Learn more about [error bags](https://inertiajs.com/validation#error-bags) in the Inertia docs.
:::
