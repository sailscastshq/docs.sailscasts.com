---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/social.png
title: Local
titleTemplate: Sails AI
description: Run AI models locally with Ollama using the @sails-ai/local adapter — free, private, and works offline
prev:
  text: Streaming
  link: /sails-ai/streaming
next:
  text: OpenAI
  link: /sails-ai/openai
editLink: true
---

# Local

`@sails-ai/local` connects sails-ai to [Ollama](https://ollama.com), which runs open-source LLMs directly on your machine. It does not require API keys, usage fees, or sending data to a remote provider.

## Why use the local adapter?

- **Free** — no API costs during development. Run as many requests as you want.
- **Private** — your prompts and data never leave your machine.
- **Offline** — works without an internet connection once models are pulled.
- **Fast iteration** — no network latency, no rate limits.
- **Model variety** — access to thousands of open-source models: Llama, Qwen, Mistral, Gemma, Phi, and more.

## Prerequisites

Install and start Ollama:

```sh
# macOS
brew install ollama

# Or download from https://ollama.com

# Start the Ollama server
ollama serve
```

Pull a model to get started:

```sh
# Small and fast — good for development
ollama pull qwen2.5:1.5b

# Llama 3.2 3B — good balance of quality and speed
ollama pull llama3.2:3b

# Llama 3.1 8B — higher quality, needs more RAM
ollama pull llama3.1:8b
```

::: tip
Ollama downloads models on first pull. After that, they're cached locally and start instantly.
:::

## Installation

```sh
npm i @sails-ai/local
```

## Quick start

```js
// config/ai.js
module.exports.ai = {
  provider: 'local',

  providers: {
    local: {
      adapter: '@sails-ai/local',
      baseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434'
    }
  }
}
```

When Sails lifts, you'll see:

```
info: @sails-ai/local: Connected to Ollama (3 models available)
```

If Ollama isn't running, you'll see a warning instead — the app still lifts, but chat requests will fail until you start Ollama:

```
warn: @sails-ai/local: Could not reach Ollama at http://localhost:11434.
      Chat will fail until Ollama is running. Start it with: ollama serve
```

## Usage

### Chat

```js
// Simple string — uses the default model
const reply = await sails.ai.chat('What is the capital of France?')
console.log(reply.content)

// With a specific model
const reply = await sails.ai.chat({
  prompt: 'Explain quantum computing in simple terms',
  model: 'llama3.2:3b'
})

// Full conversation with system prompt
const reply = await sails.ai.chat({
  messages: [
    { role: 'user', content: 'What is risotto?' },
    { role: 'assistant', content: 'Risotto is a creamy Italian rice dish...' },
    { role: 'user', content: 'How do I make it?' }
  ],
  system: 'You are a helpful cooking assistant.',
  model: 'llama3.1:8b'
})
```

### Streaming

```js
const stream = sails.ai.stream({
  prompt: 'Tell me a short story about a clever fox',
  model: 'llama3.2:3b'
})

let fullText = ''
for await (const chunk of stream) {
  if (chunk.text) {
    fullText += chunk.text
    process.stdout.write(chunk.text)
  }
  if (chunk.done) {
    console.log('\nModel:', chunk.model)
  }
}
```

### Streaming over WebSockets

A common pattern during development — stream AI responses to the browser in real time:

```js
// api/controllers/chat/send.js
module.exports = {
  inputs: {
    content: { type: 'string', required: true }
  },

  fn: async function ({ content }) {
    const stream = sails.ai.stream({
      prompt: content,
      system: 'You are a helpful assistant.',
      model: 'llama3.2:3b'
    })

    let fullContent = ''
    for await (const chunk of stream) {
      if (chunk.text) {
        fullContent += chunk.text
        if (this.req.isSocket) {
          sails.sockets.broadcast(sails.sockets.getId(this.req), 'ai:chunk', {
            text: chunk.text
          })
        }
      }
    }

    return { content: fullContent }
  }
}
```

## Setting a default model

If you don't want to pass `model` on every call, set a default in your provider config:

```js
// config/ai.js
module.exports.ai = {
  provider: 'local',

  providers: {
    local: {
      adapter: '@sails-ai/local',
      baseUrl: 'http://localhost:11434',
      model: 'llama3.2:3b' // [!code ++]
    }
  }
}
```

Now you can call `sails.ai.chat('Hello')` without specifying a model. If no default is set and no model is passed, Ollama falls back to `qwen2.5:1.5b`.

## Using with a cloud provider in production

A common setup is using the local adapter during development and switching to a cloud provider like Together AI in production:

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
    }
  }
}
```

```sh
# .env (production)
AI_PROVIDER=together
TOGETHER_API_KEY=your-key
```

Your application code doesn't change — `sails.ai.chat()` and `sails.ai.stream()` work the same regardless of provider.

## Popular Ollama models

| Model         | Pull command               | Size    | Notes                             |
| ------------- | -------------------------- | ------- | --------------------------------- |
| Qwen 2.5 1.5B | `ollama pull qwen2.5:1.5b` | ~1 GB   | Fast, good for testing            |
| Llama 3.2 3B  | `ollama pull llama3.2:3b`  | ~2 GB   | Good balance of speed and quality |
| Llama 3.1 8B  | `ollama pull llama3.1:8b`  | ~4.7 GB | High quality, needs 8GB+ RAM      |
| Mistral 7B    | `ollama pull mistral`      | ~4.1 GB | Strong reasoning                  |
| Gemma 2 9B    | `ollama pull gemma2:9b`    | ~5.4 GB | Google's open model               |
| Qwen 2.5 32B  | `ollama pull qwen2.5:32b`  | ~19 GB  | Needs 32GB+ RAM                   |

Browse the full catalog at [ollama.com/library](https://ollama.com/library).

::: warning
Larger models need more RAM. A 7B model typically needs 8GB, a 13B needs 16GB, and 32B+ needs 32GB or more. If a model is too large for your machine, Ollama will run slowly or fail to load.
:::

## Custom Ollama server

If Ollama is running on a different machine or port, set the `baseUrl`:

```js
// config/ai.js
providers: {
  local: {
    adapter: '@sails-ai/local',
    baseUrl: 'http://192.168.1.100:11434' // Remote machine on your network
  }
}
```

Or use an environment variable:

```sh
OLLAMA_BASE_URL=http://192.168.1.100:11434
```

## Configuration reference

| Option    | Type   | Default                    | Description                                 |
| --------- | ------ | -------------------------- | ------------------------------------------- |
| `adapter` | string | —                          | Must be `'@sails-ai/local'`                 |
| `baseUrl` | string | `'http://localhost:11434'` | Ollama server URL                           |
| `model`   | string | `'qwen2.5:1.5b'`           | Default model to use when none is specified |

## Error handling

```js
try {
  const reply = await sails.ai.chat('Hello')
} catch (err) {
  switch (err.code) {
    case 'E_PROVIDER_UNAVAILABLE':
      // Ollama is not running
      // Start it with: ollama serve
      break
    case 'E_MODEL_NOT_FOUND':
      // Model not pulled yet
      // Pull it with: ollama pull <model>
      break
    case 'E_PROVIDER_ERROR':
      // Something else went wrong with Ollama
      break
  }
}
```

| Code                     | When                     | Fix                       |
| ------------------------ | ------------------------ | ------------------------- |
| `E_PROVIDER_UNAVAILABLE` | Can't connect to Ollama  | Run `ollama serve`        |
| `E_MODEL_NOT_FOUND`      | Model not installed      | Run `ollama pull <model>` |
| `E_PROVIDER_ERROR`       | Ollama returned an error | Check Ollama logs         |
