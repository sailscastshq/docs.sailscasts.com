---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/social.png
title: OpenAI
titleTemplate: Sails AI
description: Universal OpenAI-compatible adapter for sails-ai — works with Together AI, Groq, Fireworks, OpenRouter, Mistral, and any provider that follows the OpenAI chat completions API
prev:
  text: Local
  link: /sails-ai/local
next:
  text: Building Adapters
  link: /sails-ai/adapters
editLink: true
---

# OpenAI

`@sails-ai/openai` is a universal adapter for any AI provider that implements the [OpenAI chat completions API](https://platform.openai.com/docs/api-reference/chat). This is the same API spec that most cloud AI providers have adopted, which means one adapter covers a wide range of providers — you just change the `baseURL` and `apiKey`.

Think of it like SMTP for email: the protocol is the same, you just swap the server.

## Compatible providers

The following providers are compatible with `@sails-ai/openai` out of the box:

| Provider                            | `baseURL`                               | Notes                                                     |
| ----------------------------------- | --------------------------------------- | --------------------------------------------------------- |
| [Together AI](https://together.xyz) | `https://api.together.xyz/v1`           | Fine-tuning support, 200+ open-source models              |
| [Groq](https://groq.com)            | `https://api.groq.com/openai/v1`        | Ultra-fast inference on custom LPU hardware               |
| [Fireworks](https://fireworks.ai)   | `https://api.fireworks.ai/inference/v1` | Optimized inference, function calling                     |
| [OpenRouter](https://openrouter.ai) | `https://openrouter.ai/api/v1`          | Gateway to 100+ models from multiple providers            |
| [Mistral](https://mistral.ai)       | `https://api.mistral.ai/v1`             | Mistral's own models (Mixtral, Mistral Large)             |
| [Perplexity](https://perplexity.ai) | `https://api.perplexity.ai`             | Search-augmented models                                   |
| [OpenAI](https://openai.com)        | `https://api.openai.com/v1`             | GPT-4o, GPT-4, GPT-3.5 (default when no `baseURL` is set) |

Any provider that follows the `/v1/chat/completions` spec will work — just set the `baseURL`.

## Installation

```sh
npm i @sails-ai/openai
```

## Quick start

Here's a minimal setup using Together AI:

```js
// config/ai.js
module.exports.ai = {
  provider: 'together',

  providers: {
    together: {
      adapter: '@sails-ai/openai',
      apiKey: process.env.TOGETHER_API_KEY,
      baseURL: 'https://api.together.xyz/v1'
    }
  }
}
```

Then in any action or helper:

```js
const reply = await sails.ai.chat({
  prompt: 'What are some fun things to do in New York?',
  model: 'meta-llama/Llama-3.2-3B-Instruct-Turbo'
})
console.log(reply.content)
```

## Provider examples

### Together AI

Together AI hosts 200+ open-source models and supports fine-tuning — you can upload your own LoRA adapters and deploy them as custom models.

```js
// config/ai.js
module.exports.ai = {
  provider: 'together',

  providers: {
    together: {
      adapter: '@sails-ai/openai',
      apiKey: process.env.TOGETHER_API_KEY,
      baseURL: 'https://api.together.xyz/v1'
    }
  }
}
```

```js
// Use a base model
await sails.ai.chat({
  prompt: 'Explain how solar panels work',
  model: 'meta-llama/Llama-3.2-3B-Instruct-Turbo'
})

// Use your fine-tuned model
await sails.ai.chat({
  prompt: 'Explain how solar panels work',
  model: 'your-org/your-fine-tuned-model'
})
```

Popular Together AI models:

| Model            | ID                                                  |
| ---------------- | --------------------------------------------------- |
| Llama 3.2 3B     | `meta-llama/Llama-3.2-3B-Instruct-Turbo`            |
| Llama 3.1 8B     | `meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo`       |
| Llama 3.1 70B    | `meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo`      |
| Llama 4 Maverick | `meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8` |
| Qwen 2.5 72B     | `Qwen/Qwen2.5-72B-Instruct-Turbo`                   |

### Groq

Groq runs inference on custom LPU (Language Processing Unit) hardware, delivering extremely fast response times.

```js
// config/ai.js
module.exports.ai = {
  provider: 'groq',

  providers: {
    groq: {
      adapter: '@sails-ai/openai',
      apiKey: process.env.GROQ_API_KEY,
      baseURL: 'https://api.groq.com/openai/v1'
    }
  }
}
```

```js
await sails.ai.chat({
  prompt: 'Explain quantum computing simply',
  model: 'llama-3.1-70b-versatile'
})
```

### Fireworks

```js
// config/ai.js
module.exports.ai = {
  provider: 'fireworks',

  providers: {
    fireworks: {
      adapter: '@sails-ai/openai',
      apiKey: process.env.FIREWORKS_API_KEY,
      baseURL: 'https://api.fireworks.ai/inference/v1'
    }
  }
}
```

```js
await sails.ai.chat({
  prompt: 'Write a haiku about the ocean',
  model: 'accounts/fireworks/models/llama-v3p1-70b-instruct'
})
```

### OpenRouter

OpenRouter is a gateway that gives you access to models from multiple providers (OpenAI, Anthropic, Google, Meta, etc.) through a single API key.

```js
// config/ai.js
module.exports.ai = {
  provider: 'openrouter',

  providers: {
    openrouter: {
      adapter: '@sails-ai/openai',
      apiKey: process.env.OPENROUTER_API_KEY,
      baseURL: 'https://openrouter.ai/api/v1'
    }
  }
}
```

```js
await sails.ai.chat({
  prompt: 'What are the benefits of renewable energy?',
  model: 'meta-llama/llama-3.1-70b-instruct'
})
```

### OpenAI

When no `baseURL` is set, the adapter connects to OpenAI's own API by default.

```js
// config/ai.js
module.exports.ai = {
  provider: 'openai',

  providers: {
    openai: {
      adapter: '@sails-ai/openai',
      apiKey: process.env.OPENAI_API_KEY
    }
  }
}
```

```js
await sails.ai.chat({
  prompt: 'Summarize the theory of relativity',
  model: 'gpt-4o'
})
```

## Multiple providers

You can configure several providers and switch between them at runtime. A common pattern is using Ollama locally for free development and a cloud provider in production:

```js
// config/ai.js
module.exports.ai = {
  provider: process.env.AI_PROVIDER || 'local',

  providers: {
    local: {
      adapter: '@sails-ai/local',
      baseUrl: 'http://localhost:11434'
    },
    together: {
      adapter: '@sails-ai/openai',
      apiKey: process.env.TOGETHER_API_KEY,
      baseURL: 'https://api.together.xyz/v1'
    },
    groq: {
      adapter: '@sails-ai/openai',
      apiKey: process.env.GROQ_API_KEY,
      baseURL: 'https://api.groq.com/openai/v1'
    }
  }
}
```

Switch providers in your code:

```js
// Uses the default provider
await sails.ai.chat('Hello')

// Target a specific provider
await sails.ai.use('groq').chat('Hello')
await sails.ai.use('together').stream('Tell me a story')
```

Or switch the default per environment:

```sh
# .env (production)
AI_PROVIDER=together
TOGETHER_API_KEY=your-key
```

## Streaming

The adapter fully supports streaming via async generators:

```js
const stream = sails.ai.stream({
  messages: [
    { role: 'user', content: 'Tell me a short story about a time traveler' }
  ],
  model: 'meta-llama/Llama-3.2-3B-Instruct-Turbo'
})

let fullText = ''
for await (const chunk of stream) {
  if (chunk.text) {
    fullText += chunk.text
    // Send to client via WebSocket, write to response, etc.
  }
  if (chunk.done) {
    console.log('Complete. Model:', chunk.model)
  }
}
```

Chunks follow the standard sails-ai format:

```js
{ text: 'Once', done: false }
{ text: ' upon', done: false }
{ text: ' a', done: false }
// ...
{ text: '', done: true, model: 'meta-llama/Llama-3.2-3B-Instruct-Turbo' }
```

## Configuration reference

| Option    | Type   | Default                       | Description                                                                                                  |
| --------- | ------ | ----------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `adapter` | string | —                             | Must be `'@sails-ai/openai'`                                                                                 |
| `apiKey`  | string | —                             | API key for the provider. Required for all cloud providers.                                                  |
| `baseURL` | string | `'https://api.openai.com/v1'` | The provider's API base URL. This is what makes the adapter universal — change the URL, change the provider. |
| `model`   | string | `null`                        | Default model for this provider. If set, you don't need to pass `model` on every call.                       |

## Error handling

The adapter normalizes errors from any provider into standard sails-ai error codes, so your error handling works the same regardless of which provider you're using:

```js
try {
  const reply = await sails.ai.chat({
    prompt: 'Hello',
    model: 'meta-llama/Llama-3.2-3B-Instruct-Turbo'
  })
} catch (err) {
  switch (err.code) {
    case 'E_PROVIDER_UNAVAILABLE':
      // Can't connect, or invalid API key
      break
    case 'E_MODEL_NOT_FOUND':
      // Model doesn't exist on this provider
      break
    case 'E_PROVIDER_ERROR':
      // Rate limit, bad request, etc.
      break
  }
}
```

| Code                     | When                                                               |
| ------------------------ | ------------------------------------------------------------------ |
| `E_PROVIDER_UNAVAILABLE` | Can't connect to the provider, or invalid/missing API key          |
| `E_MODEL_NOT_FOUND`      | Requested model doesn't exist on the provider                      |
| `E_PROVIDER_ERROR`       | Provider returned an error (rate limit, bad request, server error) |
