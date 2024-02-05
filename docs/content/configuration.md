---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/sails-content-social.png
title: Configurations
titleTemplate: Sails Content
description: Configurations for Sails Content.
prev:
  text: Querying Collections
  link: '/content/querying-collections'
next: false
editLink: true
---

# Configurations

You can configure Sails Content with the `config/content.js` file.

## inputDir

- Default: `'content'`

Specify the content directory.

::: code-group

```js[config/content.js]
module.exports.content = {
  inputDir: 'my-content'
}
```

:::

## output

- Default: `'static'`

Specify whether to build your content when you lift your Sails app or not.

::: code-group

```js[config/content.js]
module.exports.content = {
  output: 'static'
}
```

:::

## layout

- Default: `undefined`

Specify a global layout for your `.md` files.

::: code-group

```js[config/content.js]
module.exports.content = {
  layout: './views/layouts/blog-post.ejs'
}
```

:::
