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

Then in your login page, you can access the `login` error via `form.errors.login` if you are using the [form helper](https://inertiajs.com/forms#form-helper) or `usePage().props.errors.login`.

::: info
Learn more about [displaying errors](https://inertiajs.com/validation#displaying-errors) in the Inertia docs.
:::

## Error bags

If you are using the form helper, you don't need error bags because validation errors are scoped to the form object making the request.

::: info
Learn more about [error bags](https://inertiajs.com/validation#error-bags) in the Inertia docs.
:::

## Precognition

Precognition gives Boring Stack forms live validation without copying Sails rules into the browser.

The form still submits to a normal Sails action. The difference is that the Inertia client can send an early validation request with the `Precognition` header. Sails runs the same Action2 input validation, and `inertia-sails` returns either field errors or a `204 No Content` success response.

Use Precognition when early feedback improves the form:

- signup email and username fields
- password reset email fields
- profile settings
- invite forms
- billing setup forms
- multi-step onboarding screens

Skip it when live validation does not change the experience, or when the check is expensive and should only happen during the real submit.

### Server shape

Add a `precognitionSuccess` response:

```js
// api/responses/precognitionSuccess.js
module.exports = function precognitionSuccess() {
  return this.req._sails.inertia.handlePrecognitionSuccess(this.req, this.res)
}
```

Then return that exit before side effects:

```js
// api/controllers/auth/forgot-password.js
module.exports = {
  inputs: {
    email: {
      type: 'string',
      required: true,
      isEmail: true
    }
  },

  exits: {
    success: { responseType: 'redirect' },
    precognitionSuccess: { responseType: 'precognitionSuccess' }
  },

  fn: async function ({ email }, exits) {
    if (sails.inertia.isPrecognitive?.(this.req)) {
      return exits.precognitionSuccess()
    }

    // Send reset emails, create records, queue jobs, or mutate sessions here.
    return '/check-email'
  }
}
```

### Client shape

Opt the form into Precognition and validate the field when it makes sense for the UI, usually on blur:

```js
const form = useForm({
  email: ''
}).withPrecognition('post', '/forgot-password')

form.validate('email')
```

Render the error from the same place normal submissions use:

```vue
<p v-if="form.errors.email">{{ form.errors.email }}</p>
```

### Availability checks

Precognition can handle checks like “username is taken” because it is still server code. Keep the database query in the action, and guard it with `sails.inertia.shouldValidate()` when you only want to run it for the requested field.

```js
if (sails.inertia.shouldValidate?.('username', this.req)) {
  const exists = await User.count({ username })

  if (exists > 0) {
    throw {
      badRequest: {
        problems: [{ username: 'Username is already taken.' }]
      }
    }
  }
}
```

Precognition is not a replacement for submit-time validation. Treat it as a better feedback loop around the same server-side source of truth.
