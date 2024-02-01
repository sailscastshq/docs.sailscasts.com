---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/sails-mail-social.png
title: Getting started
editLink: true
next:
  text: 'Configuration'
  link: '/mail/configuration'
---

# {{ $frontmatter.title }}

## Introduction

Mail or Sails Mail provides a sleek, elegant, and developer-friendly email API that turns sending emails into a walk in the park for your Sails applications.

Mail introduces transports for sending emails via SMTP, Resend, etc which allows you to quickly and elegantly get started sending emails through any local or cloud-based email service of your choice.

## Installation

### Prerequisites

- [Node.js](https://nodejs.org) version 18 or higher
- [Sails](https://sailsjs.com) version 1 or higher

To install Mail, simply run the following command in your Sails project:

```sh [npm]
$ npm install sails-hook-mail
```

## Usage

Mail exposes a `send` [helper](https://sailsjs.com/documentation/concepts/helpers) that you can call in your Sails actions or where ever you have access to helpers in your Sails application.

For example we can send an email verification email when a user signs up successfully via a `user/signup.js` action:

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

You can already see a couple of the arguments you can pass to the send helper provided by Mail.

Next, You can check out all the various supported transports Mail provide for you to send your emails and how to configure them
