---
title: YarnGPT
titleTemplate: Sails AI
description: Install and configure the YarnGPT asynchronous speech adapter for Sails AI.
editLink: true
---

# YarnGPT

`@sails-ai/yarngpt` **0.0.1** implements hosted asynchronous transcription and synthesis for Sails AI **0.0.3**. YarnGPT uses its own speech job protocol at `https://api.yarngpt.ai`; it is **not OpenAI-compatible**. It supports `transcribe`, `synthesize` and `getJob`, with no chat, chat streaming, live ASR or streaming TTS.

## Install and configure

```sh
npm install sails-ai@0.0.3 @sails-ai/yarngpt@0.0.1
```

Create `config/ai.js` and provide an existing provider key through your server environment:

```js
// config/ai.js
module.exports.ai = {
  provider: 'voice',
  providers: {
    voice: {
      adapter: '@sails-ai/yarngpt',
      apiKey: process.env.YARNGPT_API_KEY,
      timeoutMs: 30000
    }
  }
}
```

`timeoutMs` is a positive integer up to 120000 and defaults to 30000. Keep keys on the server. To preserve a chat default, add `voice` alongside your existing provider and select it with `await sails.ai.use('voice')`.

## Submit a local audio file

Run this inside a lifted Sails application, supplying your own audio file. This submits one hosted request and may spend provider credits. It does not wait for completion. The receipt file demonstrates persistence; a production application should use durable storage with access controls and persist its key and input fingerprint before submission.

```js
const fs = require('node:fs/promises')
const { randomUUID, createHash } = require('node:crypto')
const voice = await sails.ai.use('voice')
const audio = await fs.readFile('/path/to/note.ogg')
const idempotencyKey = randomUUID()
await fs.writeFile(
  'speech-intent.json',
  JSON.stringify({
    idempotencyKey,
    inputPath: '/path/to/note.ogg',
    inputSha256: createHash('sha256').update(audio).digest('hex'),
    mimeType: 'audio/ogg',
    filename: 'note.ogg'
  }),
  { flag: 'wx', mode: 0o600 }
)
try {
  const receipt = await voice.transcribe({
    audio,
    mimeType: 'audio/ogg',
    filename: 'note.ogg',
    idempotencyKey
  })
  await fs.writeFile('speech-job.json', JSON.stringify(receipt), {
    mode: 0o600
  })
} catch (error) {
  if (error.receipt) {
    await fs.writeFile('speech-job.json', JSON.stringify(error.receipt), {
      mode: 0o600
    })
  }
  throw error
}
```

In a later worker invocation, load the receipt and perform one check:

```js
const fs = require('node:fs/promises')
const voice = await sails.ai.use('voice')
const savedReceipt = JSON.parse(await fs.readFile('speech-job.json', 'utf8'))
const current = await voice.getJob(savedReceipt)
await fs.writeFile('speech-job.json', JSON.stringify(current), { mode: 0o600 })
if (current.status === 'completed') console.log(current.result.text)
if (current.status === 'failed') console.error(current.error.code)
```

An unknown submission without an ID cannot be polled. Apply the [receipt, recovery and bounded scheduling rules](/sails-ai/speech) before invoking this worker.

## Media and input contract

| Operation    | Accepted input                                                                                                      | Completed result                                                        |
| ------------ | ------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `transcribe` | Nonempty `Uint8Array` or Buffer up to 64 MiB; required `audio/*` MIME type; optional filename (default `audio.wav`) | `result.text`, `translation`, `translationStatus`, `translationMessage` |
| `synthesize` | Nonblank `text` up to 15000 characters; optional `voice`; `outputFormat` of `mp3` (default) or `wav`                | `result.audioUrl`                                                       |

Both submissions require an `idempotencyKey` of 1–64 visible characters without a colon, and accept optional `targetLanguage` and `signal`. Filenames must contain 1–128 ASCII letters, digits, underscores, periods or hyphens. Voice and target-language values, when present, must be nonempty strings up to 128 characters.

The adapter checks bytes and MIME syntax, not actual encoding or duration. Your application must validate the file contents, duration, permissions and provider-supported media before sending. `targetLanguage` requests translation; it is not a source-language hint. `language` and `sourceLanguage` transcription fields are rejected. Check the provider's current language and voice catalogue and evaluate real samples before promising coverage or quality.

```js
const voice = await sails.ai.use('voice')
const receipt = await voice.synthesize({
  text: 'Welcome aboard.',
  outputFormat: 'mp3',
  idempotencyKey: synthesisRequestId // application-owned, persisted before sending
})
// Persist receipt; later getJob(receipt) exposes result.audioUrl on completion.
```

Omitting `voice` selects the provider default. The adapter uses POST `/api/v1/asr` and GET `/api/v1/asr/:id` for transcription, POST `/api/v1/tts` and GET `/api/v1/status/:id` for synthesis. It does not follow redirects or fetch output audio.

## Errors and job outcomes

| Code                       | Meaning                                                      |
| -------------------------- | ------------------------------------------------------------ |
| `E_INVALID_INPUT`          | Invalid media/fields/receipt or wrong configured provider    |
| `E_CAPABILITY_UNSUPPORTED` | Operation unavailable on the selected provider               |
| `E_AUTH_FAILED`            | HTTP 401                                                     |
| `E_QUOTA_EXCEEDED`         | HTTP 402                                                     |
| `E_RATE_LIMITED`           | HTTP 429; inspect `retryAfter`                               |
| `E_JOB_NOT_FOUND`          | HTTP 404                                                     |
| `E_PROVIDER_ERROR`         | Other normalized HTTP error                                  |
| `E_PROVIDER_RESPONSE`      | Invalid GET response                                         |
| `E_PROVIDER_UNAVAILABLE`   | GET transport failure                                        |
| `E_ABORTED`                | Cancellation before transmission or interrupted GET          |
| `E_SUBMISSION_UNKNOWN`     | POST outcome uncertain; persist its receipt and original key |

HTTP errors expose `status` and, when supplied, `providerCode`. A POST transport failure, timeout, invalid response, server error, or `409 ALREADY_EXISTS` can be uncertain; never automatically resubmit it. Provider job failure is instead represented by a receipt with `status: 'failed'` and an `error` object. Inspect warnings and translation status separately from transcription success.

Contracts are mock-tested; real-audio quality has not been evaluated. Installation includes no provider account, credits, commercial clearance or training rights. See the [provider API reference](https://yarngpt.ai/api-docs) and the [released adapter source](https://github.com/sailscastshq/sails-ai/tree/00f4db184e353bba8ca9c9450a181a5dd4cfde14/packages/yarngpt).
