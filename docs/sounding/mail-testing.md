---
title: Mail Testing
editLink: true
---

# Mail testing

Sounding captures outgoing mail during a trial by wrapping `sails.helpers.mail.send`, rendering a preview when a template is used, and storing the normalized result in `sails.sounding.mailbox`.

That means:

- your app still uses `sails.helpers.mail.send`
- Sounding captures what was actually sent during the trial
- the original helper is restored when the trial ends

## `test()` for mail behavior

Use mail trials when the email itself is the behavior you care about.

```js
import { test } from 'sounding'

test('magic link sends a usable email', async ({ sails, auth, expect }) => {
  await auth.requestMagicLink('reader@example.com')

  const email = sails.sounding.mailbox.latest()

  expect(email.to).toContain('reader@example.com')
  expect(email.subject).toContain('Sign in')
  expect(email.html).toContain('/magic-link/')
})
```

## What the mailbox gives you

The mailbox keeps common assertions close at hand:

- `sails.sounding.mailbox.latest()`
- `sails.sounding.mailbox.all()`
- `sails.sounding.mailbox.clear()`

And each captured message is normalized enough to assert on comfortably:

- `to`, `cc`, and `bcc`
- `subject`, `from`, and `replyTo`
- rendered `html` and plain `text`
- `template` and `templateData`
- extracted links like `ctaUrl`
- `status` for sent vs failed deliveries
- `error` details when delivery fails

## Common mail cases

Mail assertions are useful for:

- magic links
- password resets
- invitations
- billing notifications
- team access flows

## Mail and auth helpers

Mail tests often use auth helpers such as:

- `auth.requestMagicLink()`
- `auth.issueMagicLink()`
- `login.as(actorOrEmail, page)` for the browser-capable follow-through
