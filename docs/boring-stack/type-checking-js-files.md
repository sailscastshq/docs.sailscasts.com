---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/boring-stack-social.png
title: Type checking JS files
titleTemplate: The Boring JavaScript 🥱
description: Configuration on type checking in JS files
prev:
  text: Testing
  link: '/boring-stack/testing'
next: false
editLink: true
---

# Type checking JS files

The Boring JavaScript Stack templates ships with a `jsconfig.json` file with configs that allows TypeScript's compiler in editors like VS Code to type check your JS files.

While this is good, you will need to manually maintain a `types/index.d.ts` file so TypeScript don't complain too much.

## Disabling type checking

You can disable type-checking if its too much of an annoyance and you prefer just JavaScript by setting `checkJs` and `allowJs` to `false`:

```json
{
  "compilerOptions": {
    "allowJs": true, // [!code --]
    "allowJs": false, // [!code ++]
    "checkJs": true, // [!code --]
    "checkJs": false // [!code ++]
  }
}
```
