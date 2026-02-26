---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/social.png
title: Chat
titleTemplate: Sails AI
description: Sending chat completions with sails-ai
prev:
  text: Configuration
  link: /sails-ai/configuration
next:
  text: Streaming
  link: /sails-ai/streaming
editLink: true
---

# Chat

The `chat()` method sends a message to the AI provider and returns the complete response. It supports three input styles — from a simple string to a full conversation history.

## Simple string

The simplest way to chat — just pass a string:

```js
const reply = await sails.ai.chat('What is the capital of France?')
console.log(reply.content) // "The capital of France is Paris..."
```

## Single prompt with options

Pass an object with `prompt` for a single message, plus optional `system` and `model`:

```js
const reply = await sails.ai.chat({
  prompt: 'Translate "good morning" to Spanish',
  system: 'You are a helpful language tutor.',
  model: 'qwen2.5:7b'
})
```

## Full conversation

Pass a `messages` array for multi-turn conversations:

```js
const reply = await sails.ai.chat({
  messages: [
    { role: 'user', content: 'What is risotto?' },
    { role: 'assistant', content: 'Risotto is a creamy Italian rice dish...' },
    { role: 'user', content: 'How do I make it?' }
  ],
  system: 'You are a helpful cooking assistant.',
  model: 'qwen2.5:7b'
})
```

When you provide a `system` prompt, it's automatically prepended to the messages array as a system message. You don't need to include it in `messages` yourself.

## Response format

`chat()` returns an object with the assistant's response:

```js
{
  role: 'assistant',
  content: 'The capital of France is Paris...',
  model: 'qwen2.5:1.5b'
}
```

| Field     | Type   | Description                                      |
| --------- | ------ | ------------------------------------------------ |
| `role`    | string | Always `'assistant'`                             |
| `content` | string | The full response text                           |
| `model`   | string | The model identifier that generated the response |

## Using a specific provider

If you have multiple providers configured, use `sails.ai.use()` to target one:

```js
// Uses the default provider
const reply = await sails.ai.chat('Hello')

// Uses the cloudflare provider
const reply = await sails.ai.use('cloudflare').chat('Hello')
```

## Error handling

```js
try {
  const reply = await sails.ai.chat('Hello')
} catch (err) {
  if (err.code === 'E_PROVIDER_UNAVAILABLE') {
    // Provider is not reachable (e.g. Ollama not running)
  }
  if (err.code === 'E_MODEL_NOT_FOUND') {
    // Model not installed/available on the provider
  }
}
```

Adapters throw errors with a `code` property for programmatic handling. See your adapter's documentation for specific error codes.
