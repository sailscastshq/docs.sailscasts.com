---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/social.png
title: Building Adapters
titleTemplate: Sails AI
description: How to build a custom sails-ai adapter for any AI provider
prev:
  text: OpenAI
  link: /sails-ai/openai
editLink: true
---

# Building Adapters

Sails AI uses an adapter pattern to support any AI provider. Each adapter is a separate npm package that implements the `Adapter` interface. This guide shows you how to build one.

## The Adapter interface

Every adapter extends the base `Adapter` class from `sails-ai`:

```js
const { Adapter } = require('sails-ai')

class MyAdapter extends Adapter {
  async initialize(config) {
    /* ... */
  }
  async chat({ messages, model }) {
    /* ... */
  }
  async *stream({ messages, model }) {
    /* ... */
  }
  async teardown() {
    /* ... */
  }
}

module.exports = MyAdapter
```

| Method                        | Required | Description                                                                  |
| ----------------------------- | -------- | ---------------------------------------------------------------------------- |
| `initialize(config)`          | Yes      | Called once during `sails.lift()`. Set up connections, validate credentials. |
| `chat({ messages, model })`   | Yes      | Send a chat completion request. Return `{ role, content, model }`.           |
| `stream({ messages, model })` | No       | Async generator that yields `{ text, done }` chunks.                         |
| `teardown()`                  | No       | Clean up resources on `sails.lower()`.                                       |

## Scaffold a new adapter

Create a new package:

```
my-adapter/
├── index.js
└── package.json
```

```json
// package.json
{
  "name": "@sails-ai/my-provider",
  "version": "0.0.1",
  "main": "index.js",
  "peerDependencies": {
    "sails-ai": ">=0.0.1"
  }
}
```

::: tip
Use `peerDependencies` for `sails-ai` so the adapter uses the same `Adapter` class as the hook. This ensures `instanceof` checks work correctly.
:::

## Implement the adapter

Here's a minimal adapter skeleton:

```js
const { Adapter } = require('sails-ai')

class MyAdapter extends Adapter {
  /**
   * Called once during sails.lift().
   * Use this to validate config, test connectivity, or cache credentials.
   */
  async initialize(config) {
    this.apiKey = config.apiKey
    this.baseUrl = config.baseUrl || 'https://api.my-provider.com'
    this.defaultModel = config.model || 'default-model'

    // Optional: test connectivity
    try {
      await fetch(`${this.baseUrl}/health`)
    } catch {
      console.warn(`@sails-ai/my-provider: Could not reach ${this.baseUrl}`)
    }
  }

  /**
   * Send a chat completion and return the full response.
   */
  async chat({ messages, model }) {
    const res = await fetch(`${this.baseUrl}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: model || this.defaultModel,
        messages
      })
    })

    if (!res.ok) {
      const error = new Error(`Request failed: ${res.status}`)
      error.code = 'E_PROVIDER_ERROR'
      throw error
    }

    const data = await res.json()
    return {
      role: 'assistant',
      content: data.choices[0].message.content,
      model: model || this.defaultModel
    }
  }

  /**
   * Stream a chat completion token by token.
   */
  async *stream({ messages, model }) {
    const res = await fetch(`${this.baseUrl}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: model || this.defaultModel,
        messages,
        stream: true
      })
    })

    const reader = res.body.getReader()
    const decoder = new TextDecoder()

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const text = decoder.decode(value, { stream: true })
      yield { text, done: false }
    }

    yield { text: '', done: true, model: model || this.defaultModel }
  }
}

module.exports = MyAdapter
```

## Error codes

Adapters should throw errors with a `code` property for programmatic handling:

| Code                     | When                                                       |
| ------------------------ | ---------------------------------------------------------- |
| `E_PROVIDER_UNAVAILABLE` | Can't connect to the provider (network, server down)       |
| `E_MODEL_NOT_FOUND`      | Requested model doesn't exist on the provider              |
| `E_PROVIDER_ERROR`       | Provider returned an error (bad request, rate limit, etc.) |
| `E_AUTH_FAILED`          | Invalid credentials                                        |

```js
const error = new Error('Could not connect to provider')
error.code = 'E_PROVIDER_UNAVAILABLE'
throw error
```

## Using your adapter

Install it and add it to `config/ai.js`:

```js
// config/ai.js
module.exports.ai = {
  provider: 'my-provider',
  providers: {
    'my-provider': {
      adapter: '@sails-ai/my-provider',
      apiKey: process.env.MY_PROVIDER_API_KEY,
      baseUrl: 'https://api.my-provider.com'
    }
  }
}
```

The config object is passed directly to your adapter's `initialize()` method, so you can add any provider-specific options you need.

## Official adapters

| Adapter                                     | Provider                                                  | Package            |
| ------------------------------------------- | --------------------------------------------------------- | ------------------ |
| [Local (Ollama)](/sails-ai/getting-started) | Ollama                                                    | `@sails-ai/local`  |
| [OpenAI](/sails-ai/openai)                  | Together AI, Groq, Fireworks, OpenRouter, Mistral, OpenAI | `@sails-ai/openai` |

Check the [GitHub repository](https://github.com/sailscastshq/sails-ai) for the latest list.
