---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/sails-content-social.png
title: Content Directory
titleTemplate: Sails Content
description: Content Collections contains your content and makes them queriable by Waterline.
prev:
  text: Getting started
  link: '/content/getting-started'
next:
  text: Configuration
  link: '/content/configuration'
editLink: true
---

# Content Directory

The content directory contains your content collection and by default its a top-level `content/` directory.

## Specifying a content directory

You can tell Sails Content to use another directory as the content directory in `config/content.js`

```js
module.exports.content = {
  dir: './assets/content'
}
```

From the above config we are specifying that our content collections will be in `assets/content`

## Content Collections

Content Collections help to organize your documents and makes querying your content via [Waterline queries](/content/querying-collections) easy.

### What are Content Collections?

A **Content Collection** is any top-level directory inside your content directory, such as `/content/blog`. Only content collections are allowed inside the `/content` directory. This directory cannot be used for anything else.

A **collection entry** is any piece of content stored inside of your content collection directory. Entries are expected to be `.md` files.

Once you have a collection, you can start querying your content using [Waterline queries](/content/querying-collections).
