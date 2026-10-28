---
title: Asynchronous speech
titleTemplate: Sails AI
description: Capability-aware speech jobs, durable receipts and bounded recovery in Sails AI 0.0.3.
editLink: true
---

# Asynchronous speech

Sails AI **0.0.3** adds `transcribe`, `synthesize` and `getJob` alongside existing chat and streaming. Each provider exposes a `capabilities` object with boolean keys for `chat`, `stream`, `transcribe`, `synthesize` and `getJob`. Unsupported methods throw `E_CAPABILITY_UNSUPPORTED`.

```js
const voice = await sails.ai.use('voice')
if (!voice.capabilities.transcribe) {
  throw new Error('Select a provider with transcription support')
}
```

The default provider exposes the same methods on `sails.ai`. Select a speech provider explicitly to keep an existing chat provider as your default. [YarnGPT](/sails-ai/yarngpt) is the shipped speech adapter; the OpenAI and local adapters continue to provide chat and streaming. No OpenAI speech adapter is included in this release.

## Submit, persist, then check once

A submission returns a **job receipt**, not a final transcript or audio file. Save the entire receipt in durable application storage before scheduling a status check. It carries the configured provider alias, adapter identity, operation, job ID, idempotency key and usage.

The following is an application integration sketch: `audioBytes`, `uploadRequestId`, `savedReceipt`, `saveJob` and `useTranscript` belong to your application. The helpers are placeholders, not Sails AI framework methods.

```js
const voice = await sails.ai.use('voice')
const receipt = await voice.transcribe({
  audio: audioBytes,
  mimeType: 'audio/ogg',
  filename: 'note.ogg',
  idempotencyKey: uploadRequestId
})
await saveJob(receipt)

// Later, in a scheduled worker: load the full saved receipt first.
const current = await voice.getJob(savedReceipt)
await saveJob(current)
if (current.status === 'completed') {
  useTranscript(current.result.text)
}
```

`getJob(receipt, { signal })` makes one GET. Passing only a job ID is insufficient. A receipt from a different configured provider is rejected with `E_INVALID_INPUT`; keep provider aliases and configuration stable for outstanding jobs.

Jobs progress through `queued`, `processing`, and terminal `completed` or `failed` states. Save every returned receipt, including its `result`, `error` and `warnings`. Empty transcript text is valid for silence. A failed job is a returned receipt and must be inspected even when the HTTP request succeeds.

The caller owns scheduling: start around one second, back off toward five seconds, and impose a finite attempt budget, overall deadline and cancellation policy. There is no automatic polling loop. Stop on a terminal state and reconcile outstanding usage separately if needed.

## Idempotency and uncertain submissions

Persist the submission key, original payload or recoverable input reference, and input fingerprint **before** sending a paid POST. Bind each key to one exact payload across processes. No POST is automatically retried, and the adapter does not keep cross-process idempotency state.

`E_SUBMISSION_UNKNOWN` includes `receipt` and `outcomeUnknown: true`. Persist that receipt and retain the spend reservation: a timeout or malformed response does not establish that nothing was charged. If the receipt has an ID, check that job. Without an ID, it cannot be polled. Any explicitly authorized retry must use the original payload and original key; do not invent a new key.

## Usage and private output

`usage.creditsReserved` is provisional; `usage.creditsCharged` is settled usage. Missing values remain `null`, never an inferred zero. Credits are neither a currency nor your application's billing price. Failed jobs can still need accounting reconciliation.

Completed synthesis returns a private, expiring `result.audioUrl`. The adapter does not download it. Refresh it through a status check and validate the destination independently before any server-side fetch. Do not log credentials, raw audio or signed output URLs. Keep input permissions and output provenance in your own records.

See [YarnGPT setup, media limits and errors](/sails-ai/yarngpt) for the exact shipped provider contract.
