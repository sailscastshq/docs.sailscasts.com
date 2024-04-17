---
title: Installation,
description: To install and setup captain-vane run npm i --save-dev captain-vane captain-vane-generator,
editLink: true
---

# Installation

Add captain-vane and captain-vane-generator development dependencies to your project.
Add `captain-vane` and `captain-vane-generator` development dependencies to your project:

```bash
npm i --save-dev captain-vane captain-vane-generator
```

or

```bash
  yarn add -D captain-vane captain-vane-generator
```

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
