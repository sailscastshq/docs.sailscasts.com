---
title: TemboAI Voice API
titleTemplate: TemboAI
description: Transcribe short, permissioned recordings in English, Nigerian Pidgin, Yoruba, Igbo and Hausa.
prev:
  text: TemboAI
  link: /tembo/
editLink: true
---

# TemboAI Voice API

TemboAI Voice turns short recordings into text through a project-scoped HTTP API. Upload a permissioned source, submit a transcription request, then read or explicitly reconcile that request. The Console at [temboai.com/console](https://temboai.com/console) manages organisations, projects, API keys, usage and budgets.

## Languages and limits

| Code  | Project language |
| ----- | ---------------- |
| `en`  | English          |
| `pcm` | Nigerian Pidgin  |
| `yo`  | Yoruba           |
| `ig`  | Igbo             |
| `ha`  | Hausa            |

A project can select one or more of these languages. Specify one selected language for each uploaded recording and use that same language for its transcription request. A single-language project may default the upload language; a multi-language project requires it. The hosted recognizer detects speech automatically: this code is metadata and validation, not a source-language hint sent to the provider. Supported metadata does not establish measured recognition quality. Review names, numbers, units, negation and time references before using transcripts.

Recordings must be **1–30 seconds**, **mono**, and at most **4 MiB**. Accepted formats are signed 16-bit PCM WAV at 16, 24 or 48 kHz, or validated single-stream Ogg/Opus. MP3, AAC, MP4 and WebM are not accepted uploads. See [audio and permissions](/tembo-voice/data).

## Create or activate a live project

1. Sign in to [Console](https://temboai.com/console) and create or select your organisation.
2. As an organisation owner or administrator, create a project and select its languages.
3. Read the **Ready for live transcription** service agreement, then explicitly check **I accept this service agreement and authorise processing by YarnGPT** before creating the live project.
4. For an existing empty project, read the same agreement and choose **Activate live project**. Activation is blocked for a nonempty or previously reviewed project that needs operator review; it does not overwrite retained evidence or an existing reviewed policy.

The released agreement is **`voice-service-20261030-v1`**, with policy SHA256 **`2661753f9a0ed5847f592e5d495aae74e86ea0523c0ee44cfdaea6c89a738269`**. Acceptance is explicit and records the immutable policy, accepting user, time and digest. Project activation is your choice; reading this guide does not accept the agreement.

Self-service projects have these ceilings:

| Control                          | Limit                                        |
| -------------------------------- | -------------------------------------------- |
| Per recording                    | 4 MiB and 1–30 seconds                       |
| Total retained audio per project | 64 MiB, not 64 MiB per recording             |
| TemboAI private audio access     | 24 hours after ingestion                     |
| Concurrent requests              | One                                          |
| Operation allowance ceiling      | 10,000 operations; grants no prepaid credits |

[YarnGPT retains audio for 30 days and transcripts afterward](/tembo-voice/data#retention-and-withdrawal). TemboAI's deletion does not remove those copies. The agreement grants no optional training permission.

Hosted processing and billing are enabled on the released service. Acceptance and activation create neither API keys nor credits automatically; an insufficient prepaid organisation balance blocks processing. Existing administrator-provisioned projects retain their own reviewed policy rather than silently inheriting the self-service limits.

## Playground or external client

The signed-in **Console Playground needs no API key**: it uses your authenticated Console session. Select a permitted recording language, review the recording-level permission basis, and submit only when you choose to process that recording. For an external application, explicitly create a scoped API key and follow the [quickstart](/tembo-voice/quickstart).

A current organisation owner or administrator can issue an explicitly confirmed live key in Console. The secret is displayed once. Keep it on your server and send it as `Authorization: Bearer <your existing live key>`. Keys are project-bound and scoped:

| Scope          | Allows                                                                        |
| -------------- | ----------------------------------------------------------------------------- |
| `voice:read`   | Read requests, list sources and create short-lived media links                |
| `voice:write`  | Upload sources, submit requests, reconcile and cancel requests, update labels |
| `voice:delete` | Withdraw a source                                                             |

Only owners/admins can issue keys. Membership changes, revoked keys and cross-project use can invalidate access. Console sessions authorise the Playground; browser cookies are not machine API authority on `/api/v1/voice/` routes. `tv_test_…` keys are limited to development/test projects; a sample fixture is not a free hosted sandbox. Never put a key in frontend code, URLs or logs.

Local developer fixtures remain separate from hosted processing: development/test fixture mode supports the synthetic Hausa sample, not real recordings or five-language quality claims. Fixture identities and permission references must never be used as live evidence.

Start with the [quickstart](/tembo-voice/quickstart), then consult [endpoints and errors](/tembo-voice/reference), [billing](/tembo-voice/billing), and [permissions and retention](/tembo-voice/data).

## Current capability

Hosted requests support `operation: 'transcribe'`. The fixture-only `interpret` and `render` operations are not hosted translation or speech synthesis products. There is no public streaming ASR/TTS, arbitrary URL ingestion or WhatsApp webhook endpoint in this contract. A WhatsApp integration must securely obtain the media, validate/convert it to a supported format, obtain the required permission evidence, and use the same upload/request flow.

This API wraps [Sails AI speech jobs](/sails-ai/speech); applications call TemboAI's endpoints rather than the provider's jobs API. TemboAI persists provider receipts and accounts for tenant permissions and reservations.
