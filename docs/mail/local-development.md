---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/sails-mail-social.png
title: Local development
editLink: true
prev:
  text: 'Resend Transport'
  link: '/mail/resend-transport'
---

# {{ $frontmatter.title }}

When creating an application that involves sending emails, you likely wouldn't want to send actual emails to active email addresses during local development.

Sails Mail offers various methods to "deactivate" the real email sending process for local development purposes.

## Log Transport

During development you may set a mailer with the log transport which will log the content of your email to the console.

```js
// config/mail.js
mailers: {
  log: {
    transport: 'log'
  }
}
```

## Mailtrap / NodemailerApp

Another option is to utilize services like [Mailtrap](https://mailtrap.io/email-sandbox/) or [NodemailerApp](https://nodemailer.com/app/) along with the [SMTP transport](/mail/smtp-transport) to route your email messages to a simulated mailbox.

This enables you to examine the emails within an email client, such as Mailtrap's or NodemailerApp's message viewer.
