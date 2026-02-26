---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/social.png
title: Configuration
titleTemplate: Sails AI
description: Configuring sails-ai providers, models, and defaults
prev:
  text: Getting started
  link: /sails-ai/getting-started
next:
  text: Chat
  link: /sails-ai/chat
editLink: true
---

# Configuration

All AI configuration lives in `config/ai.js`. This is where you define providers, set defaults, and configure provider-specific options.

## Basic configuration

```js
// config/ai.js
module.exports.ai = {
  // Which provider to use by default
  provider: 'local',

  // All configured providers
  providers: {
    local: {
      adapter: '@sails-ai/local',
      baseUrl: 'http://localhost:11434'
    }
  }
}
```

## Multiple providers

You can configure multiple providers and switch between them at runtime:

```js
// config/ai.js
module.exports.ai = {
  provider: 'local', // default for development

  providers: {
    local: {
      adapter: '@sails-ai/local',
      baseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434'
    },
    together: {
      adapter: '@sails-ai/openai',
      apiKey: process.env.TOGETHER_API_KEY,
      baseURL: 'https://api.together.xyz/v1'
    }
  }
}
```

Then in your code:

```js
// Uses the default provider
await sails.ai.chat('Hello')

// Uses a specific provider
await sails.ai.use('together').chat('Hello')
```

## Environment-based provider switching

A common pattern is using Ollama locally and a cloud provider in production:

```js
// config/ai.js
module.exports.ai = {
  provider: process.env.AI_PROVIDER || 'local'
  // ...
}
```

```sh
# .env (production)
AI_PROVIDER=together
TOGETHER_API_KEY=your-key
```

## Provider configuration reference

Each adapter accepts its own configuration options. These are passed directly to the adapter's `initialize()` method.

### `@sails-ai/local` (Ollama)

| Option    | Type   | Default                    | Description                     |
| --------- | ------ | -------------------------- | ------------------------------- |
| `adapter` | string | —                          | Must be `'@sails-ai/local'`     |
| `baseUrl` | string | `'http://localhost:11434'` | Ollama server URL               |
| `model`   | string | `null`                     | Default model for this provider |

## Application-level configuration

You can add any custom keys to `config/ai.js` for your application's use. A common pattern is mapping model tiers to provider-specific model identifiers:

```js
// config/ai.js
module.exports.ai = {
  provider: 'local',
  providers: {
    /* ... */
  },

  // Your app's model tier mapping
  models: {
    light: 'qwen2.5:1.5b',
    standard: 'qwen2.5:7b',
    flagship: 'qwen2.5:32b'
  },

  // Your app's system prompt
  systemPrompt: 'You are a helpful assistant.'
}
```

These custom keys are available at `sails.config.ai.models`, `sails.config.ai.systemPrompt`, etc. Sails AI doesn't use them directly — they're for your application code.
