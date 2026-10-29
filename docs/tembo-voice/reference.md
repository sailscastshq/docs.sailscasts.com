---
title: Endpoints and errors
titleTemplate: Tembo Voice API
description: Exact project-scoped source, request, poll and recovery contracts.
editLink: true
---

# Endpoints and errors

Base URL: `https://temboai.com/api/v1/voice/projects/:projectId`. Use an existing project-scoped bearer key. Sources and requests from another project cannot be used through your project's routes.

## Sources

| Method and path                     | Scope          | Request / response                                                                       |
| ----------------------------------- | -------------- | ---------------------------------------------------------------------------------------- |
| `POST /sources`                     | `voice:write`  | Multipart `audio`, `idempotencyKey`, JSON `permission`; optional JSON `trainingEvidence` |
| `GET /sources`                      | `voice:read`   | `{ sources: [...] }`, latest 100 sources                                                 |
| `GET /sources/:sourceId/media-link` | `voice:read`   | `{ url, expires }`; relative signed URL, expires in 60 seconds                           |
| `PATCH /sources/:sourceId/labels`   | `voice:write`  | Correct labels with provenance; not needed to transcribe                                 |
| `DELETE /sources/:sourceId`         | `voice:delete` | Source status after withdrawal/deletion                                                  |

An uploaded source returns `id`, `language`, `eligibility`, `status`, `durationSeconds`, `byteSize`, `mimeType`, `sha256`, `retentionUntil` and `createdAt`. Submit only a source with `status: 'retained'`. Without optional training evidence its eligibility is `service-only`. Never use client-supplied recording URLs in place of source upload.

`permission` has `noticeVersion`, `purpose: 'voice-service'`, `basis`, `reference` and `collectedAt`. It must match the approved project notice. See [permission rules](/tembo-voice/data).

## Requests

| Method and path                  | Scope         | Behavior                                                             |
| -------------------------------- | ------------- | -------------------------------------------------------------------- |
| `POST /requests`                 | `voice:write` | Submit or replay an idempotent transcription                         |
| `GET /requests/:requestId`       | `voice:read`  | Read stored public request state; no provider call                   |
| `POST /requests/:requestId/poll` | `voice:write` | Explicitly reconcile an existing held provider job                   |
| `DELETE /requests/:requestId`    | `voice:write` | Request cancellation; not guaranteed provider cancellation or refund |

Submission is JSON with these fields:

| Field               | Contract                                                                                |
| ------------------- | --------------------------------------------------------------------------------------- |
| `requestId`         | Persisted UUID-shaped identifier: 36 lowercase hex/hyphen characters; use a proper UUID |
| `idempotencyKey`    | 8–100 ASCII letters, digits, underscores or hyphens                                     |
| `operation`         | `transcribe` for hosted processing                                                      |
| `language`          | Project language: `en`, `pcm`, `yo`, `ig`, `ha`                                         |
| `sourceId`          | ID of a retained, unexpired, permissioned source in this project                        |
| `servicePermission` | Exact permission evidence bound to the source                                           |
| `provider`          | Optional; omit it to use the configured provider consistently                           |

Idempotency keys belong in the **request body**, not an `Idempotency-Key` HTTP header. Source upload and request submission have separate keys, both scoped to the project. Reusing a source key with different bytes, permission or training evidence returns `idempotency_conflict`. A request key replays the existing request with `replay: true` when normalized input matches; conflicting input returns 409. Persist the original `requestId`, key and body even though request replay is keyed by the idempotency key. Keep optional provider selection consistent across retries.

A request response contains `id`, `operation`, `status`, `output`, `errorCode`, `inputProvenance`, `outputProvenance`, `createdAt`, `trainingEligibility` and `apiCredits`. Output is `null` while unavailable. A successful transcript exposes `output.transcript`, `originalTranscript`, `uncertainty`, `criticalChecks` and provenance. The response does not expose the private provider receipt or signed provider output URL.

## Status and recovery

| Status                    | Caller action                                                      |
| ------------------------- | ------------------------------------------------------------------ |
| `running`                 | Read stored status later; do not submit a second request           |
| `reconciliation-required` | Keep the reservation; explicitly POST one `/poll` when appropriate |
| `succeeded`               | Read transcript and settled usage; inspect transcript quality      |
| `failed`                  | Inspect `errorCode` and billing state                              |
| `cancelled`               | Inspect billing state; do not assume provider cancellation         |

An accepted provider job that is queued/processing, or an uncertain submission, is represented as `reconciliation-required`. Polling is accepted only for a held request with a stored provider receipt; otherwise it returns `request_not_reconcilable`. A receipt with no accepted provider ID remains held and cannot be looked up upstream. There is no client-visible provider receipt to replace or reconstruct. Contact Tembo with the project and request IDs when recovery cannot progress.

Deleting a request with a provider receipt retains reconciliation rather than pretending that provider work stopped. An output can be hidden with `source_unavailable` after source expiry or withdrawal even if the request itself succeeded. Stop automatic polling on terminal state and bound the number of nonterminal attempts. A server request can wait for its configured provider timeout (15 seconds by default, at most 60 seconds); choose a client timeout that accommodates the approved deployment setting. A timeout is not proof of no charge.

## Errors

Voice application errors use `{"error":{"code":"..."}}` and an HTTP status. Sails input-validation or upload-limit errors may use framework error envelopes; check the HTTP status even when no `error.code` exists. Provider error bodies and credentials are not forwarded.

| Status | Common codes / meaning                                                                                                                                                                     |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 400    | `invalid_idempotency_key`, `invalid_request_id`, `unsupported_language`, `unsupported_operation`, `invalid_pcm_wav`, `invalid_ogg_opus`, `audio_duration_limit`, `invalid_permission_json` |
| 401    | `bearer_key_required`, `invalid_key`, `test_key_not_allowed`                                                                                                                               |
| 402    | `insufficient_api_credits`                                                                                                                                                                 |
| 403    | `insufficient_scope`, `service_permission_required`, `source_permission_mismatch`, `source_permission_changed`, `provider_processing_not_approved`                                         |
| 404    | `project_not_found`, `request_not_found`, `source_not_found`, `source_unavailable`, `media_link_invalid`                                                                                   |
| 409    | `idempotency_conflict`, `project_paused`, `source_language_mismatch`, `request_not_reconcilable`, `partner_agent_operation_required`                                                       |
| 429    | `concurrency_limit`, `trial_limit_reached`, `storage_limit_reached`                                                                                                                        |
| 503    | `live_access_not_configured`, `provider_not_approved`, `provider_not_configured`, `api_credit_rate_not_approved`, `private_storage_not_configured`                                         |
| 500    | `voice_internal_error` or a framework/upload failure                                                                                                                                       |

Do not blindly retry a chargeable submission after a transport error or 5xx. Preserve input and identity, read stored state first, and retry only the identical operation when explicitly appropriate. Back off on capacity errors and keep a deadline. This contract does not guarantee a `Retry-After` header.
