---
title: Tembo Voice API
titleTemplate: Tembo
description: Transcribe short, permissioned recordings in English, Nigerian Pidgin, Yoruba, Igbo and Hausa.
editLink: true
---

# Tembo Voice API

Tembo Voice turns short recordings into text through a project-scoped HTTP API. Upload a permissioned source, submit a transcription request, then read or explicitly reconcile that request. The Console at [temboai.com/console](https://temboai.com/console) manages organisations, projects, API keys, usage and budgets.

## Languages and limits

| Code  | Project language |
| ----- | ---------------- |
| `en`  | English          |
| `pcm` | Nigerian Pidgin  |
| `yo`  | Yoruba           |
| `ig`  | Igbo             |
| `ha`  | Hausa            |

Each project has one language. Request language and retained-source language must match the project. The hosted recognizer detects speech automatically: this code is metadata and validation, not a source-language hint sent to the provider. Supported metadata does not establish measured recognition quality. Review names, numbers, units, negation and time references before using transcripts.

Recordings must be **1–30 seconds**, **mono**, and at most **4 MiB**. Accepted formats are signed 16-bit PCM WAV at 16, 24 or 48 kHz, or validated single-stream Ogg/Opus. MP3, AAC, MP4 and WebM are not accepted uploads. See [audio and permissions](/tembo-voice/data).

## Authentication and readiness

Create an organisation and project in Console, select its language, and complete project activation with Tembo. Creating project metadata does not activate hosted processing. Live access also requires an active live project, approved service notice and retention policy, approved allowance and storage limits, provider processing approval and configured billing.

A current organisation owner or administrator can issue an explicitly confirmed live key in Console. The secret is displayed once. Keep it on your server and send it as `Authorization: Bearer <your existing live key>`. Keys are project-bound and scoped:

| Scope          | Allows                                                                        |
| -------------- | ----------------------------------------------------------------------------- |
| `voice:read`   | Read requests, list sources and create short-lived media links                |
| `voice:write`  | Upload sources, submit requests, reconcile and cancel requests, update labels |
| `voice:delete` | Withdraw a source                                                             |

Only owners/admins can issue keys. Membership changes, revoked keys and cross-project use can invalidate access. Browser cookies are not machine API authority. `tv_test_…` keys are limited to development/test projects; a sample fixture is not a free hosted sandbox. Never put a key in frontend code, URLs or logs.

Start with the [quickstart](/tembo-voice/quickstart), then consult [endpoints and errors](/tembo-voice/reference), [billing](/tembo-voice/billing), and [permissions and retention](/tembo-voice/data).

## Current capability

Hosted requests support `operation: 'transcribe'`. The fixture-only `interpret` and `render` operations are not hosted translation or speech synthesis products. There is no public streaming ASR/TTS, arbitrary URL ingestion or WhatsApp webhook endpoint in this contract. A WhatsApp integration must securely obtain the media, validate/convert it to a supported format, obtain the required permission evidence, and use the same upload/request flow.

This API wraps [Sails AI speech jobs](/sails-ai/speech); applications call Tembo's endpoints rather than the provider's jobs API. Tembo persists provider receipts and accounts for tenant permissions and reservations.
