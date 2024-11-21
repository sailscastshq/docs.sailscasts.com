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

# Send Helper

Mail provides a `send` helper that is used to send your emails within your Sails applications. The `send` helper takes in several optional and required arguments like `mailer`, `template`, `templateData` etc.

## `mailer`

The mailer to use for sending the email. This is optional because by default Mail will look for the mailer to use by checking for it in the following places:

- an environment variable called `MAIL_MAILER`,
- a `default` property in a `mail` object in `config/local.js`,
- and finally the `default` mailer set in `config/mail.js`

```js
sails.helpers.mail.send.with({ mailer: 'resend' })
```

## `template` <Badge type="danger">required</Badge>

This is a string matching an [email template](/mail/email-template) in `views/emails` without the file extension.

```js
sails.helpers.mail.send.with({ template: 'email-verify-account' })
```

## `templateData`

A dictionary of data which will be accessible in your email template.

```js
sails.helpers.mail.send.with({ templateData: { fullName: 'Jack Sparrow' } })
```

## `to` <Badge type="danger">required</Badge>

The email address of the primary recipient.

```js
sails.helpers.mail.send.with({ to: 'jack@blackpearl.com' })
```

## `toName`

The name of the primary recipient

```js
sails.helpers.mail.send.with({ toName: 'Jack Sparrow' })
```

## `cc`

The email addresses to send a carbon copy of the mail to.

```js
sails.helpers.mail.send.with({ cc: ['jack@blackpearl.com'] })
```

## `bcc`

The email addresses to send a blind carbon copy of the mail to.

```js
sails.helpers.mail.send.with({ cc: ['jack@blackpearl.com'] })
```

## `subject`

The subject of the email.

```js
sails.helpers.mail.send.with({ subject: 'Verify email' })
```

## `from`

The from email to use to send the email. This isn't required because you can specify a [global from](/mail/configuration#from)

```js
sails.helpers.mail.send.with({ from: 'boring@sailscasts.com' })
```

## `fromName`

The from name to use to send the email. This isn't required because you can specify a [global from](/mail/configuration#from)

```js
sails.helpers.mail.send.with({ fromName: 'The Boring JavaScript Stack' })
```

## `layout`

The email layout to use for this email. This isn't required because by default Mail will look for a layout called `layout-email`.

However with `layout` you can pass an override and chose another layout to use or you can disable layout by passing `false`

### Specify a layout

```js
await sails.helpers.mail.send.with({ layout: 'layout-account' })
```

### Disable layout

```js
await sails.helpers.mail.send.with({ layout: false })
```

## `text`

Specify email plain text.

```js
await sails.helpers.mail.send.with({ text: 'Verify your email' })
```

## `attachments`

An optional array of attachment objects. Each attachment object should have the following properties:

- `filename`: The name of the file.
- `path`: The path to the file.
- `contentType`: The MIME type of the file (optional).
- `content`: String, Buffer or a Stream contents for the attachment (optional).

```js
await sails.helpers.mail.send.with({
  to: 'jack@blackpearl.com',
  toName: 'Jack Sparrow',
  template: 'email-verify-account',
  templateData: { token: '3828bsbababvbas', fullName: 'Jack Sparrow' },
  attachments: [
    {
      filename: 'adventure-log.txt',
      content: 'The journey begins...'
    },
    {
      filename: 'treasure-map.txt',
      content: new Buffer('X marks the spot!', 'utf-8')
    },
    {
      filename: 'crew-list.txt',
      path: '/path/to/crew-list.txt'
    },
    {
      filename: 'ship-photo.jpg',
      path: '/path/to/ship-photo.jpg',
      contentType: 'image/jpeg'
    }
  ]
})
```

## `replyTo`

An email address that will appear on the Reply-To: field. This isn't required because you can specify a [global replyTo](/mail/configuration#replyTo).

```js
sails.helpers.mail.send.with({ replyTo: 'support@sailscasts.com' })
```

## category <Badge>mailtrap</Badge>

The category of the email.

```js
await sails.helpers.mail.send.with({
  category: 'verify'
})
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
