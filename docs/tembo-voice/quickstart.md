---
title: Quickstart
titleTemplate: Tembo Voice API
description: Upload a source, submit transcription and reconcile one request using Node.js.
editLink: true
---

# Quickstart

Use **Node.js 22 or newer**, a provisioned live project, an existing live API key with `voice:read` and `voice:write`, and audio you are permitted to process. A later withdrawal also needs `voice:delete`. These commands can spend your organisation's credits when you run them against an activated project.

## Prepare permission evidence

Obtain the project's approved service-notice **version** and **basis** from your project setup with Tembo. Create `permission.json` using your actual permission record:

```json
{
  "noticeVersion": "YOUR_APPROVED_NOTICE_VERSION",
  "purpose": "voice-service",
  "basis": "YOUR_APPROVED_BASIS",
  "reference": "YOUR_PERMISSION_RECORD_REFERENCE",
  "collectedAt": 0
}
```

Replace `collectedAt: 0` with the real time permission was collected, as Unix milliseconds. It must be in the past year and not in the future; do not fabricate a fresh timestamp for missing permission. `reference` must contain 8–250 characters. The exact same object must accompany both source upload and transcription; do not regenerate its timestamp between calls. A sample JSON object is not evidence that consent or another valid processing basis exists.

## Configure your server process

[Download quickstart.mjs](/tembo-voice/quickstart.mjs) into your application. Set these environment variables using your existing secret-management process; the example embeds no API key:

```sh
export TEMBO_BASE_URL='https://temboai.com'
export TEMBO_PROJECT_ID='YOUR_PROJECT_UUID'
export TEMBO_LANGUAGE='ha'
export TEMBO_AUDIO='/absolute/path/to/note.ogg'
export TEMBO_PERMISSION='/absolute/path/to/permission.json'
export TEMBO_STATE='./tembo-state.json'
# Supply TEMBO_API_KEY through your server's secret environment.
```

`TEMBO_LANGUAGE` must equal the language selected for this project: `en`, `pcm`, `yo`, `ig` or `ha`.

```sh
node quickstart.mjs upload
node quickstart.mjs submit
node quickstart.mjs status
```

The upload returns a retained source ID. Submit returns the Tembo request ID, status, output and any API-credit reservation. **HTTP 200 does not imply transcription succeeded**; inspect `status`, `errorCode` and `apiCredits`.

When the saved request is `reconciliation-required`, run one explicit reconciliation:

```sh
node quickstart.mjs poll
```

This command first reads the Tembo request. If reconciliation is needed it makes one POST to `/requests/:requestId/poll`, which checks the already accepted provider job. It does not create another transcription. Repeat only through a bounded application-owned schedule with backoff, a finite attempt budget and an overall deadline. `status` only reads stored state; it never polls the provider.

When `status` is `succeeded`, the transcript is at `output.transcript`, with `output.originalTranscript` and provenance. Empty text can be valid for silence. On `failed` or `cancelled`, inspect `errorCode`. If reconciliation remains unresolved, keep the request identity and spend reservation and contact Tembo rather than creating new keys or requests.

## Persistence and retry behavior

The script saves the source-upload key, transcription request UUID and idempotency key, permission object, input fingerprint and API results in `tembo-state.json`. Treat the file as private and durable; exclude it from Git and use one state file per recording. It does not store your API key. Run only one process per state file. Production applications should replace local file storage with transactional durable storage and enforce the same input/key binding.

A failed network request triggers no automatic retry. After a lost transcription response, use `status` with the saved UUID first. If no request exists and you explicitly decide to retry, re-running `submit` uses the original payload and key. Do not remove the state file to generate a fresh request. Re-running `upload` uses the original upload key and rejects changed input; keep the audio and permission record unchanged.

To withdraw the uploaded recording with a `voice:delete` key:

```sh
node quickstart.mjs withdraw
```

Withdrawal immediately excludes the source from processing and removes transcript access, while physical deletion may remain pending. See [retention and withdrawal](/tembo-voice/data#retention-and-withdrawal).

## Complete client

The downloaded file is the exact source below. It uses native Node.js APIs and makes only the operation you request. The original audio is identified from its contents by the server; changing a filename or MIME header cannot make an unsupported recording valid.

<<< ../public/tembo-voice/quickstart.mjs{js}
