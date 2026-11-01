---
title: Quickstart
titleTemplate: TemboAI Voice API
description: Upload a source, submit transcription and reconcile one request using Node.js.
head:
  - - link
    - rel: canonical
      href: https://docs.sailscasts.com/tembo-ai/voice
editLink: true
---

# Quickstart

::: info Compatibility URL
The canonical Quick Start documentation is now at [Quick Start](/tembo-ai/voice#quick-start). Existing links and anchors on this page remain available.
:::

<!-- #region voice-quick-start -->

Use **Node.js 22 or newer**, a live project whose service agreement you have accepted, an existing live API key with `voice:read` and `voice:write`, and audio you are permitted to process. A later withdrawal also needs `voice:delete`. These commands can spend your organisation's credits when you run them against an activated project.

The signed-in Console Playground can transcribe without an API key. This guide is for external server clients; creating or activating a project does not create a key or grant credits.

## Prepare permission evidence

For a self-service project activated under the current agreement, use the notice version and basis below. For an existing administrator-provisioned project, use its own approved notice version and basis instead. Create `permission.json` using your actual permission record:

```json
{
  "noticeVersion": "voice-service-20261030-v1",
  "purpose": "voice-service",
  "basis": "organisation service agreement; recording-level licence or speaker permission required",
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

`TEMBO_LANGUAGE` must be one of the languages selected for this project: `en`, `pcm`, `yo`, `ig` or `ha`.

```sh
node quickstart.mjs upload
node quickstart.mjs submit
node quickstart.mjs status
```

The upload sends that language as a multipart field and returns a retained source ID. Submit returns the TemboAI request ID, status, output and any API-credit reservation. **HTTP 200 does not imply transcription succeeded**; inspect `status`, `errorCode` and `apiCredits`.

When the saved request is `reconciliation-required`, run one explicit reconciliation:

```sh
node quickstart.mjs poll
```

This command first reads the TemboAI request. If reconciliation is needed it makes one POST to `/requests/:requestId/poll`, which checks the already accepted provider job. It does not create another transcription. Repeat only through a bounded application-owned schedule with backoff, a finite attempt budget and an overall deadline. `status` only reads stored state; it never polls the provider.

When `status` is `succeeded`, the transcript is at `output.transcript`, with `output.originalTranscript` and provenance. Empty text can be valid for silence. On `failed` or `cancelled`, inspect `errorCode`. If reconciliation remains unresolved, keep the request identity and spend reservation and contact TemboAI rather than creating new keys or requests.

## Persistence and retry behavior

The script saves the source-upload key, transcription request UUID and idempotency key, permission object, input fingerprint and API results in `tembo-state.json`. Treat the file as private and durable; exclude it from Git and use one state file per recording. It does not store your API key. Run only one process per state file. Production applications should replace local file storage with transactional durable storage and enforce the same input/key binding.

A failed network request triggers no automatic retry. After a lost transcription response, use `status` with the saved UUID first. If no request exists and you explicitly decide to retry, re-running `submit` uses the original payload and key. Do not remove the state file to generate a fresh request. Re-running `upload` uses the original upload key and rejects changed input; keep the audio and permission record unchanged.

To withdraw the uploaded recording with a `voice:delete` key:

```sh
node quickstart.mjs withdraw
```

Withdrawal immediately excludes the source from processing and removes transcript access, while physical deletion may remain pending. See [retention and withdrawal](/tembo-ai/voice#retention-and-withdrawal).

## Complete client

The downloaded file is the exact source below. It uses native Node.js APIs and makes only the operation you request. The original audio is identified from its contents by the server; changing a filename or MIME header cannot make an unsupported recording valid.

<<< ../public/tembo-voice/quickstart.mjs{js}

<!-- #endregion voice-quick-start -->
