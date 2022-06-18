---
title: Installation
---

# {{ $frontmatter.title }}

Add captain-vane and captain-vane-generator development dependencies to your project.
Add `captain-vane` and `captain-vane-generator` development dependencies to your project:

<code-group>
<code-block label="NPM" active>

  ```bash
  npm i --save-dev captain-vane captain-vane-generator
  ```

  </code-block>
  <code-block label="Yarn">

  ```bash
  yarn add -D captain-vane captain-vane-generator
  ```

  </code-block>
</code-group>

Then, add `captain-vane-generator` to the `generators` section of `.sailsrc`:

```json{.sailsrc}
{
  "generators": {
    "modules": {
      "factory": "captain-vane-generator"
    }
  }
}
```
