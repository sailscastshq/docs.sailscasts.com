---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/sails-mail-social.png
title: Send Helper
editLink: true
prev:
  text: 'Email Layout'
  link: '/mail/email-layout'
next: false
---

# {{ $frontmatter.title }}

Mail provides a `send` helper that is used to send your emails within your Sails applications. The `send` helper takes in several optional and required arguments like `mailer`, `template`, `templateData` etc.

## mailer

The mailer to use for sending the email. This is optional because by default Mail will look for the mailer to use by checking for it in the following places:

- an environment variable called `MAIL_MAILER`,
- a config in `config/local.js` called `mailer`,
- and finally the `default` mailer set in `config/mail.js`

```js
sails.helpers.mail.send.with({ mailer: 'resend' })
```

## template <Badge type="danger">required</Badge>

This is a string matching an [email template](/mail/email-template) in `views/emails` without the file extension.

```js
sails.helpers.mail.send.with({ template: 'email-verify-account' })
```

## templateData

A dictionary of data which will be accessible in your email template.

```js
sails.helpers.mail.send.with({ templateData: { fullName: 'Jack Sparrow' } })
```

## to <Badge type="danger">required</Badge>

The email address of the primary recipient.

```js
sails.helpers.mail.send.with({ to: 'jack@blackpearl.com' })
```

## toName

The name of the primary recipient

```js
sails.helpers.mail.send.with({ toName: 'Jack Sparrow' })
```

## subject

The subject of the email.

```js
sails.helpers.mail.send.with({ subject: 'Verify email' })
```

## from

The from email to use to send the email. This isn't required because you can specify a [global from](/mail/configuration#from)

```js
sails.helpers.mail.send.with({ from: 'boring@sailscasts.com' })
```

## fromName

The from name to use to send the email. This isn't required because you can specify a [global from](/mail/configuration#from)

```js
sails.helpers.mail.send.with({ fromName: 'The Boring JavaScript Stack' })
```

## layout

The email layout to use for this email. This isn't required because by default Mail will look for a layout called `layout-email`.

However with `layout` you can pass an override and chose another layout to use or you can disable layout by passing `false`

### Specify a layout

```js
await sails.helpers.mail.send.with({ layout: 'layout-accout' })
```

### Disable layout

```js
await sails.helpers.mail.send.with({ layout: false })
```

## text

Specify email plain text.

```js
await sails.helpers.mail.send.with({ text: 'Verify your email' })
```

## Examples

### Send email with template

```js
await sails.helpers.mail.send.with({
  to: 'jack@blackpearl.com',
  toName: 'Jack Sparrow',
  template: 'email-verify-account',
  templateData: { token: '3828bsbababvbas', fullName: 'Jack Sparrow' }
})
```

### Disable layout

```js
await sails.helpers.mail.send.with({
  to: 'jack@blackpearl.com',
  toName: 'Jack Sparrow',
  template: 'email-verify-account',
  templateData: { token: '3828bsbababvbas', fullName: 'Jack Sparrow' },
  layout: false
})
```

### Send plain text email

```js
await sails.helpers.mail.send.with({
  to: 'jack@blackpearl.com',
  toName: 'Jack Sparrow',
  text: 'Hello Jack, how is the black pearl'
})
```
