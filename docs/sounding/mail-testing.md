---
title: Mail Testing
editLink: true
---

# Mail testing

Sounding makes outgoing mail easy to test without forcing developers to parse logs or invent their own fake inbox.

Because Sails already has a strong mail story, Sounding leans into it. When a trial boots, Sounding wraps `sails.helpers.mail.send`, captures the real outgoing inputs flowing through `sails-hook-mail`, renders a preview when a template is used, and stores the normalized result in `sails.sounding.mailbox`.

That means the mail story stays simple:

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

## Why this matters

A lot of important product behavior lives in mail:

- magic links
- password resets
- invitations
- billing notifications
- team access flows

If mail is painful to test, teams either skip it or test it too late.

Sounding should make mail trials feel as natural as endpoint trials.

## Mail and auth work well together

A lot of the nicest early Sounding mail tests involve auth flows:

- `auth.requestMagicLink()`
- `auth.issueMagicLink()`
- `login.as(actorOrEmail, page)` for the browser-capable follow-through

That combination is what makes passwordless and invitation flows feel first-class instead of bolted on.
