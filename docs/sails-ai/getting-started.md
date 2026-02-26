---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/social.png
title: Getting started
titleTemplate: Sails AI
description: Getting started with Sails AI in a Sails.js application
next:
  text: Configuration
  link: /sails-ai/configuration
editLink: true
---

# Getting started

Sails AI is a multi-provider AI hook for Sails.js. It gives you a clean, ergonomic API to chat and stream with any LLM provider — Ollama, Cloudflare Workers AI, OpenAI, Anthropic, or your own.

The hook uses an **adapter pattern** (similar to Sails Pay): you install the core hook, pick an adapter for your provider, configure it, and call `sails.ai.chat()` or `sails.ai.stream()`. Swap providers by changing one line of config.

## Install the hook

```sh
npm i sails-ai
```

## Install a provider adapter

Sails AI ships adapters as separate packages. Install the one that matches your provider:

::: code-group

```sh [Ollama (local)]
npm i @sails-ai/local
```

```sh [Together AI / Groq / OpenAI]
npm i @sails-ai/openai
```

:::

::: tip
`@sails-ai/local` connects to [Ollama](https://ollama.com), which runs open-source LLMs on your machine for free. Perfect for development.

`@sails-ai/openai` works with any OpenAI-compatible provider — [Together AI](https://together.xyz), [Groq](https://groq.com), [Fireworks](https://fireworks.ai), [OpenRouter](https://openrouter.ai), [OpenAI](https://openai.com), and more. See the [OpenAI adapter docs](/sails-ai/openai) for the full list.
:::

## Set up Ollama

If you're using the local adapter, install and start Ollama:

```sh
# macOS
brew install ollama

# Or download from https://ollama.com

# Start the server
ollama serve

# Pull a model
ollama pull qwen2.5:1.5b
```

## Create `config/ai.js`

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

## Try it out

Once Sails lifts, you'll see:

```
info: sails-ai: Loaded provider 'local'
```

Now use it in any action or helper:

```js
// api/controllers/example.js
const reply = await sails.ai.chat('What is the capital of France?')
console.log(reply.content) // "The capital of France is Paris..."
```

That's it. Read on to learn about [configuration](/sails-ai/configuration), [chat](/sails-ai/chat), [streaming](/sails-ai/streaming), and [building adapters](/sails-ai/adapters).
