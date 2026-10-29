---
title: Audio, permissions and retention
titleTemplate: Tembo Voice API
description: Supported media, service permission evidence, training boundaries and withdrawal.
editLink: true
---

# Audio, permissions and retention

## Supported recordings

Uploads use multipart form field `audio`, with `idempotencyKey` and JSON `permission` fields. Let your HTTP client set the multipart boundary. Tembo validates actual bytes rather than trusting the uploaded MIME type or filename. Maximum size is **4 MiB** and duration is **1–30 seconds**.

| Container | Required encoding                                                                                                         |
| --------- | ------------------------------------------------------------------------------------------------------------------------- |
| WAV       | RIFF/WAVE, PCM format 1, signed 16-bit little-endian, one channel, 16000/24000/48000 Hz                                   |
| Ogg       | One Opus stream, mono, valid headers, packet durations, sequence numbers, CRCs and end-of-stream granule; 48 kHz timeline |

Stereo, chained Ogg streams, malformed/truncated containers, MP3, AAC, MP4 and WebM are not accepted. Browser recordings may need conversion. WhatsApp Ogg/Opus recordings must still pass these limits; a WhatsApp MIME label is not sufficient.

For an existing recording you are permitted to process, this local conversion produces mono 16 kHz PCM WAV. It does not upload or call a provider:

```sh
ffmpeg -i input.ogg -ac 1 -ar 16000 -c:a pcm_s16le output.wav
```

Check duration and size before upload; this command does not trim long recordings. Obtain appropriate permission before processing or converting the source.

## Service permission

The project needs an approved service notice whose purposes include `voice-service`, an approved basis, explicit provider-processing notice for `yarngpt.ai`, and retention of 1–365 days. Your upload evidence must contain:

- `noticeVersion` equal to the current project notice version;
- `purpose: 'voice-service'`;
- `basis` equal to the approved notice basis;
- `reference`, 8–250 characters, identifying the actual permission record; and
- `collectedAt`, an integer Unix millisecond timestamp in the past year, not in the future.

Reuse that exact evidence object as `servicePermission` when submitting transcription. A changed source notice/basis, withdrawn or expired source, different project, or different project language prevents processing. Store your permission record securely; the API verifies its binding and shape, not whether your underlying legal basis was actually obtained.

## Training is a separate choice

Ordinary upload without `trainingEvidence` is `service-only`. Service permission does not grant model-training permission. Optional training evidence enters `pending-review`, not immediate eligibility. Internal review requires separate human-voice-training purpose, optional choice, source license, withdrawal reference and supporting evidence. Do not add fabricated training evidence to make an upload pass.

Provider output has `trainingEligibility.eligible: false` with reason `provider_output_not_cleared`. A transcript, language choice or provider account is not a training license.

## Retention and withdrawal

The source's `retentionUntil` is computed from the approved project retention days at ingestion. Expired sources cannot be processed or accessed through media links; the retention job handles physical removal in bounded batches. Do not promise a particular physical-deletion time from an expiry timestamp.

Withdraw with `DELETE /sources/:sourceId` and a `voice:delete` key. The source is immediately excluded, its transcript labels cleared and associated public request output redacted. Object removal may still be `deletion-pending` if storage fails; repeated deletion remains safe. Physical deletion becomes `deleted` only after confirmed removal. This does not assert deletion of accounting/provenance records or data already processed by an external provider.

Authenticated callers with `voice:read` can request `/sources/:sourceId/media-link`. It returns a **relative** signed URL and `expires` timestamp valid for 60 seconds. Resolve it against the Tembo origin, treat the URL as private bearer access, and never log or publish it. Expiry or withdrawal invalidates access even if you still hold an earlier URL.
