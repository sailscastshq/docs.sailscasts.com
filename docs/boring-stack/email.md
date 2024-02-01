---
title: Email
titleTemplate: The Boring JavaScript Stack 🥱
description: Sending emails in The Boring JavaScript Stack
prev:
  text: Database
  link: '/boring-stack/database'
next:
  text: Session
  link: '/boring-stack/session'
editLink: true
---

# Email

Sending emails in The Boring JavaScript is powered by the [Sails Mail](/mail) hook.

::: info
Learn all about [Sails Mail](/mail) in the Mail docs.
:::

## Sending emails

To send emails in The Boring JavaScript Stack, use the `sails.helpers.mail.send()` helper:

```js
// controllers/user/signup.js
await sails.helpers.mail.send.with({
  subject: 'Verify your email',
  template: 'email-verify-account',
  to: unverifiedUser.email,
  templateData: {
    token: unverifiedUser.emailProofToken,
    fullName: unverifiedUser.fullName
  }
})
```
