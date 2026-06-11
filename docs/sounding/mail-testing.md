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

  expect(sails.sounding.mailbox).toHaveSentCount(1)
  expect(sails.sounding.mailbox).toHaveSentMail({
    to: 'reader@example.com',
    subject: /sign in/i,
    template: 'email-magic-link'
  })
  expect(sails.sounding.mailbox.latest()).toHaveCtaUrl(/magic-link/)
})
```

Password reset flows follow the same shape:

```js
import { test } from 'sounding'

test('password reset sends a reset link', async ({
  request,
  sails,
  expect
}) => {
  await request.post('/forgot-password', {
    email: 'reader@example.com'
  })

  expect(sails.sounding.mailbox).toHaveSentMail({
    to: 'reader@example.com',
    subject: /reset/i,
    template: 'reset-password'
  })
  expect(sails.sounding.mailbox.latest()).toHaveCtaUrl(/reset-password/)
})
```

## Mail assertions

Use the mailbox-level matchers when you care that a trial sent a matching email:

- `expect(sails.sounding.mailbox).toHaveSentCount(count)`
- `expect(sails.sounding.mailbox).toHaveSentMail(criteria)`
- `expect(sails.sounding.mailbox).not.toHaveSentMail(criteria)`

Use message-level matchers when you want to inspect one captured email:

- `expect(sails.sounding.mailbox.latest()).toHaveCtaUrl(expected)`
- `expect(sails.sounding.mailbox.latest()).not.toHaveCtaUrl(expected)`

`criteria` can match normalized captured fields such as `to`, `cc`, `bcc`, `subject`, `template`, `templateData`, `status`, `ctaUrl`, `links`, `attachments`, and `error`. Recipient fields are stored as arrays, but matching a single recipient string works:

```js
expect(sails.sounding.mailbox).toHaveSentMail({
  to: 'reader@example.com',
  subject: /invite/i,
  attachments: [{ filename: 'receipt.pdf' }]
})
```

When a mail assertion fails, Sounding shows a summary of the captured messages so you can see what was actually sent.

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
