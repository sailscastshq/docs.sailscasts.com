---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/sails-content-social.png
title: Querying Collections
titleTemplate: Sails Content
description: Sails Content Collections are queried via Waterline queries.
prev:
  text: Content collections
  link: '/content/collections'
next:
  text: Configuration
  link: '/content/configuration'
editLink: true
---

# Querying collections

Sails Content provides the `sails-content` adapter which makes querying your content collections with Waterline queries super easy.

## Entries from a collection

Let's say you want to return all the entries in the `blog` collection we created earlier in [getting started](/content/getting-started), you can use the `.find()` Waterline query method in your action:

```js
//api/controllers/blog/view-blog.js
module.exports = {
  fn: async function () {
    const blogPosts = await Blog.find({
      select: ['title', 'slug']
    })
    return { blogPosts }
  }
}
```

::: tip
You can use the `select` and `omit` projections to specify what you want returned.
:::

Notice we have a `pages/blog` template. We are passing `blogPosts` to it and then we can display the posts like this:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Blog | Hagfish</title>
  </head>
  <body>
    <section>
      <h1>Blog</h1>
      <h2>Stay up to date with the latest news and updates.</h2>
      <ul>
        <% blogPosts.forEach(post => { %>
        <li>
          <h3><%= post.title %></h3>
          <a href="/blog/<%= post.slug %>">Read more</a>
        </li>
        <% }) %>
      </ul>
    </section>
  </body>
</html>
```

## A single entry from a collection.

You can also get a single entry from a collection using `.findOne()` Waterline query method in your action. You pass in the slug - file name - of the `.md` file:

```js
module.exports = {
  fn: async function () {
    const post = await Blog.findOne('hello-world') // [!code focus]
    return { posts }
  }
}
```
