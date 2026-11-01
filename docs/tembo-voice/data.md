---
title: Audio, permissions and retention
titleTemplate: TemboAI Voice API
description: Supported media, service permission evidence, training boundaries and withdrawal.
head:
  - - link
    - rel: canonical
      href: https://docs.sailscasts.com/tembo-ai/voice
editLink: true
---

# Audio, permissions and retention

::: info Compatibility URL
The canonical Audio, permissions and retention documentation is now at [Audio, permissions and retention](/tembo-ai/voice#audio-permissions-and-retention). Existing links and anchors on this page remain available.
:::

<!-- #region voice-data -->

## Supported recordings

Uploads use multipart form field `audio`, with `idempotencyKey`, recording `language` and JSON `permission` fields. The recording language must be selected for the project; multi-language projects require an explicit upload language. Let your HTTP client set the multipart boundary. TemboAI validates actual bytes rather than trusting the uploaded MIME type or filename. Maximum size is **4 MiB** and duration is **1–30 seconds**.

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

Self-service activation records the accepted immutable `voice-service-20261030-v1` service agreement. It authorises the organisation's use of transcription through YarnGPT **only for recordings covered by a valid licence or the speaker's permission**. The agreement is not itself that recording-level permission. It grants no optional training rights.

The project's approved service notice includes `voice-service`, the applicable basis and provider-processing notice for `yarngpt.ai`. For the self-service agreement the basis is exactly `organisation service agreement; recording-level licence or speaker permission required`. Your upload evidence must identify the actual licence or permission record. Existing administrator-provisioned projects keep their own approved notice and retention policy. Your upload evidence must contain:

- `noticeVersion` equal to the current project notice version;
- `purpose: 'voice-service'`;
- `basis` equal to the approved notice basis;
- `reference`, 8–250 characters, identifying the actual permission record; and
- `collectedAt`, an integer Unix millisecond timestamp in the past year, not in the future.

Reuse that exact evidence object as `servicePermission` when submitting transcription. A changed source notice/basis, withdrawn or expired source, different project, or a recording language outside the project selection prevents processing. Store your permission record securely; the API verifies its binding and shape, not whether your underlying legal basis was actually obtained.

## Training is a separate choice

Ordinary upload without `trainingEvidence` is `service-only`. Service permission does not grant model-training permission. Optional training evidence enters `pending-review`, not immediate eligibility. Internal review requires separate human-voice-training purpose, optional choice, source license, withdrawal reference and supporting evidence. Do not add fabricated training evidence to make an upload pass.

Provider output has `trainingEligibility.eligible: false` with reason `provider_output_not_cleared`. A transcript, language choice or provider account is not a training license.

## Retention and withdrawal

For self-service projects, TemboAI's private audio access expires **24 hours after ingestion**. `retentionUntil` records the expiry. Expired sources cannot be processed or accessed through media links. Physical deletion is scheduled in bounded batches; failed deletions are retried. **The 64 MiB total project storage quota is released only after deletion succeeds**, so expiry or a pending deletion does not immediately create space. Reserved uploads count toward the quota too.

**YarnGPT retains audio for 30 days; transcripts remain with the provider afterward. TemboAI's deletion schedule and withdrawal do not remove the provider's copies.** Read this disclosure before accepting the agreement and before submitting a recording. Do not promise provider erasure or a particular physical-deletion time from TemboAI's expiry timestamp.

Previously administrator-provisioned projects retain their reviewed retention settings; do not infer a change to their policy from the new self-service flow.

Withdraw with `DELETE /sources/:sourceId` and a `voice:delete` key. The source is immediately excluded, its transcript labels cleared and associated public request output redacted. Object removal may still be `deletion-pending` if storage fails; repeated deletion remains safe. Physical deletion becomes `deleted` only after confirmed removal. This does not assert deletion of accounting/provenance records or data already processed by an external provider.

Authenticated callers with `voice:read` can request `/sources/:sourceId/media-link`. It returns a **relative** signed URL and `expires` timestamp valid for 60 seconds. Resolve it against the TemboAI origin, treat the URL as private bearer access, and never log or publish it. Expiry or withdrawal invalidates access even if you still hold an earlier URL.

<!-- #endregion voice-data -->
