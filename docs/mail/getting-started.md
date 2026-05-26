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

# Getting started

## Introduction

Mail is a Sails hook for sending email through configured transports such as SMTP, Resend, Mailtrap, or the log transport.

It exposes a `send` helper and template support so actions and helpers can send transactional email through one API.

## Installation

### Prerequisites

- [Node.js](https://nodejs.org) version 18 or higher
- [Sails](https://sailsjs.com) version 1 or higher

To install Mail, simply run the following command in your Sails project:

```sh [npm]
$ npm install sails-hook-mail
```

## Usage

Mail exposes a `send` [helper](https://sailsjs.com/documentation/concepts/helpers) that you can call in Sails actions or anywhere else you have access to helpers.

For example we can send an email verification email when a user signs up successfully via a `user/signup.js` action:

```js
// controllers/user/signup.js
await sails.helpers.mail.send.with({
  subject: 'Verify your email',
  template: 'verify-account',
  to: unverifiedUser.email,
  templateData: {
    token: unverifiedUser.emailProofToken,
    fullName: unverifiedUser.fullName
  }
})
```

The send helper accepts additional options for templates, transports, sender configuration, and scheduling.

Next, review the transport and configuration pages for the provider you want to use.
