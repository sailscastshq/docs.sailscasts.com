---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/social.png
title: Streaming
titleTemplate: Sails AI
description: Streaming AI responses token-by-token with sails-ai
prev:
  text: Chat
  link: /sails-ai/chat
next:
  text: Local
  link: /sails-ai/local
editLink: true
---

# Streaming

The `stream()` method returns an async generator that yields response chunks as they arrive from the provider. This lets you send tokens to users in real time instead of waiting for the full response.

## Basic streaming

`stream()` accepts the same input formats as `chat()`:

```js
// String
const stream = sails.ai.stream('Tell me a story')

// Prompt with options
const stream = sails.ai.stream({
  prompt: 'Tell me a story',
  system: 'You are a creative storyteller.',
  model: 'qwen2.5:7b'
})

// Full conversation
const stream = sails.ai.stream({
  messages: [
    { role: 'user', content: 'Tell me about Greek mythology' },
    {
      role: 'assistant',
      content: 'Greek mythology is a collection of stories...'
    },
    { role: 'user', content: 'Tell me the story of Odysseus' }
  ],
  system: 'You are a knowledgeable historian.'
})
```

## Consuming the stream

Use `for await...of` to iterate over chunks:

```js
const stream = sails.ai.stream('Tell me a story')

let fullText = ''
for await (const chunk of stream) {
  if (chunk.text) {
    fullText += chunk.text
    // Send chunk to the client, write to a file, etc.
  }
  if (chunk.done) {
    // Stream complete
    console.log('Model used:', chunk.model)
  }
}
```

## Chunk format

Each chunk yielded by the stream has this shape:

```js
{ text: 'Once', done: false }
{ text: ' upon', done: false }
{ text: ' a', done: false }
// ...
{ text: '', done: true, model: 'qwen2.5:1.5b' }
```

| Field   | Type    | Description                                                      |
| ------- | ------- | ---------------------------------------------------------------- |
| `text`  | string  | The text content of this chunk (may be empty on the final chunk) |
| `done`  | boolean | `true` on the final chunk                                        |
| `model` | string  | The model identifier (only present on the final chunk)           |

## Streaming over WebSockets

A common pattern is streaming AI responses to the browser via WebSocket. Here's an example using Sails sockets:

```js
// api/controllers/chat/send.js
module.exports = {
  inputs: {
    content: { type: 'string', required: true }
  },

  fn: async function ({ content }) {
    const stream = sails.ai.stream({
      prompt: content,
      system: 'You are a helpful assistant.'
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

## Using a specific provider

```js
const stream = sails.ai.use('cloudflare').stream('Tell me a story')

for await (const chunk of stream) {
  // ...
}
```

## Error handling

Errors can occur before or during streaming. Wrap the entire loop in a try/catch:

```js
try {
  const stream = sails.ai.stream('Hello')
  for await (const chunk of stream) {
    // process chunk
  }
} catch (err) {
  if (err.code === 'E_PROVIDER_UNAVAILABLE') {
    // Provider not reachable
  }
}
```
