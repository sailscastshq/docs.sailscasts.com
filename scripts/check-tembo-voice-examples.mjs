// Offline validation against a pinned local TemboAI source snapshot. No HTTP calls.
import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { createRequire } from 'node:module'
import { run } from '../docs/public/tembo-voice/quickstart.mjs'

if (!process.env.TEMBO_VOICE_SOURCE)
  throw new Error('Set TEMBO_VOICE_SOURCE to the reviewed source root')
const require = createRequire(
  path.join(path.resolve(process.env.TEMBO_VOICE_SOURCE), 'package.json')
)
const contract = require('./lib/voice/contract')
const sources = require('./lib/voice/sources')
const usage = require('./lib/voice/api-credit-usage')
const credits = require('./lib/voice/api-credits')
const fixture = require('./tests/support/voice-fixture')
const languages = require('./shared/voice-stt-languages.json')
const projectLanguages = require('./lib/voice/project-languages')
const setup = require('./lib/voice/live-project-setup')
assert.equal(setup.policy.version, 'voice-service-20261030-v1')
assert.equal(
  contract.fingerprint(setup.policy),
  '2661753f9a0ed5847f592e5d495aae74e86ea0523c0ee44cfdaea6c89a738269'
)
assert.equal(setup.policy.sourceByteLimit, 64 * 1024 * 1024)
assert.equal(setup.policy.perRecordingByteLimit, 4 * 1024 * 1024)
assert.equal(setup.policy.retentionDays, 1)
assert.equal(setup.policy.unitLimit, 10000)
assert.equal(setup.policy.maxConcurrent, 1)
assert.throws(
  () => setup.accepted({ accepted: false, version: setup.policy.version }),
  (error) => error.code === 'service_agreement_required'
)
assert.throws(
  () => setup.accepted({ accepted: true, version: 'stale' }),
  (error) => error.code === 'service_agreement_required'
)
const routes = require('./config/routes').routes
const reference = await fs.readFile(
  new URL('../docs/tembo-voice/reference.md', import.meta.url),
  'utf8'
)
const sourceErrors = (
  await Promise.all(
    ['lib/voice/contract.js', 'lib/voice/api-credit-usage.js'].map((file) =>
      fs.readFile(path.join(process.env.TEMBO_VOICE_SOURCE, file), 'utf8')
    )
  )
).join('\n')
assert.ok(!sourceErrors.includes("fail('provider_not_approved'"))
assert.ok(!reference.includes('`provider_not_approved`'))
for (const code of [
  'provider_processing_not_approved',
  'live_access_not_configured',
  'provider_not_configured',
  'api_credit_rate_not_approved'
]) {
  assert.ok(sourceErrors.includes("'" + code + "'"), code)
  assert.ok(reference.includes('`' + code + '`'), code)
}
for (const route of [
  'POST /api/v1/voice/projects/:projectId/sources',
  'POST /api/v1/voice/projects/:projectId/requests',
  'GET /api/v1/voice/projects/:projectId/requests/:requestId',
  'POST /api/v1/voice/projects/:projectId/requests/:requestId/poll',
  'DELETE /api/v1/voice/projects/:projectId/sources/:sourceId'
])
  assert.ok(routes[route], route)
assert.deepEqual(
  languages.map((l) => l.value),
  ['en', 'pcm', 'yo', 'ig', 'ha']
)
assert.equal(credits.price(10000).amountKobo, 200000)
const config = structuredClone(require('./config/api-credits').apiCredits)
globalThis.sails = { config: { environment: 'test', apiCredits: config } }
const temporary = await fs.mkdtemp(
  path.join(os.tmpdir(), 'tembo-doc-examples-')
)
try {
  let scenarios = 0
  for (const multilingual of [false, true]) {
    for (const { value: language } of languages) {
      for (const loseResponse of [false, true]) {
        const folder = path.join(
          temporary,
          language + '-' + multilingual + '-' + loseResponse
        )
        await fs.mkdir(folder)
        const permission = {
          ...fixture.permission(),
          noticeVersion: setup.policy.version,
          basis:
            'organisation service agreement; recording-level licence or speaker permission required'
        }
        const project = {
          publicId: '11111111-1111-4111-8111-111111111111',
          language,
          ...(multilingual ? { languages: languages.map((l) => l.value) } : {}),
          serviceNotice: {
            approved: true,
            version: permission.noticeVersion,
            basis: permission.basis,
            purposes: ['voice-service'],
            evidenceReference: 'synthetic-doc-notice'
          },
          retentionDays: setup.policy.retentionDays
        }
        const settings = {
          baseUrl: 'https://example.invalid',
          projectId: project.publicId,
          apiKey: 'DOCUMENTATION_TEST_PLACEHOLDER',
          language,
          audioPath: path.join(folder, 'note.wav'),
          permissionPath: path.join(folder, 'permission.json'),
          statePath: path.join(folder, 'state.json')
        }
        await fs.writeFile(settings.audioPath, fixture.wav())
        await fs.writeFile(settings.permissionPath, JSON.stringify(permission))
        const calls = []
        let submitted, source
        const response = (body, status = 200) => Response.json(body, { status })
        const fetchMock = async (url, options) => {
          assert.ok(url.startsWith(settings.baseUrl))
          assert.equal(
            options.headers.Authorization,
            'Bearer DOCUMENTATION_TEST_PLACEHOLDER'
          )
          calls.push([options.method || 'GET', url])
          const suffix = new URL(url).pathname.split(project.publicId)[1]
          if (suffix === '/sources' && options.method === 'POST') {
            const form = options.body
            assert.match(form.get('idempotencyKey'), /^[a-zA-Z0-9_-]{8,100}$/)
            assert.equal(form.get('language'), language)
            assert.equal(
              projectLanguages.forRecording(project, form.get('language')),
              language
            )
            if (multilingual)
              assert.throws(
                () => projectLanguages.forRecording(project),
                (error) => error.code === 'recording_language_required'
              )
            const evidence = JSON.parse(form.get('permission'))
            sources.servicePermission(project, evidence)
            assert.deepEqual(evidence, permission)
            const bytes = Buffer.from(await form.get('audio').arrayBuffer())
            assert.equal(sources.inspectAudio(bytes).durationSeconds, 6)
            source = {
              id: '22222222-2222-4222-8222-222222222222',
              status: 'retained',
              language
            }
            return response(source)
          }
          if (suffix === '/requests' && options.method === 'POST') {
            const input = JSON.parse(options.body)
            contract.validate(input, {
              mode: 'provider',
              provider: 'yarngpt.ai'
            })
            assert.equal(input.language, project.language)
            assert.equal(input.sourceId, source.id)
            assert.deepEqual(input.servicePermission, permission)
            assert.equal(
              usage.quote(
                project,
                {
                  publicId: input.requestId,
                  operation: 'transcribe',
                  input: { provider: 'yarngpt.ai', language }
                },
                {
                  publicId: source.id,
                  language,
                  sha256: 'a'.repeat(64),
                  durationSeconds: 6
                }
              ).quotedCredits,
              30
            )
            submitted = {
              id: input.requestId,
              status: 'reconciliation-required',
              output: null
            }
            if (loseResponse)
              throw new Error('Synthetic response lost after acceptance')
            return response(submitted)
          }
          if (suffix === `/requests/${submitted?.id}` && !options.method)
            return response(submitted)
          if (
            suffix === `/requests/${submitted?.id}/poll` &&
            options.method === 'POST'
          ) {
            submitted = {
              ...submitted,
              status: 'succeeded',
              output: { transcript: 'Synthetic transcript' }
            }
            return response(submitted)
          }
          if (
            suffix === `/sources/${source?.id}` &&
            options.method === 'DELETE'
          ) {
            return response({
              ...source,
              status: 'deleted',
              eligibility: 'withdrawn'
            })
          }
          throw new Error('Unexpected mock call: ' + suffix)
        }
        await run('upload', settings, fetchMock)
        // Same source and evidence are reused; no second upload.
        await run('upload', settings, fetchMock)
        if (loseResponse)
          await assert.rejects(
            run('submit', settings, fetchMock),
            /lost after acceptance/
          )
        else await run('submit', settings, fetchMock)
        const stored = JSON.parse(await fs.readFile(settings.statePath, 'utf8'))
        assert.equal(stored.requestId, submitted.id)
        assert.ok(!JSON.stringify(stored).includes(settings.apiKey))
        assert.equal(
          (await run('status', settings, fetchMock)).status,
          'reconciliation-required'
        )
        await assert.rejects(
          run('submit', settings, fetchMock),
          /already saved/
        )
        assert.equal(
          (await run('poll', settings, fetchMock)).status,
          'succeeded'
        )
        assert.equal(
          (await run('poll', settings, fetchMock)).status,
          'succeeded'
        )
        assert.equal(
          calls.filter(
            ([method, url]) => method === 'POST' && url.endsWith('/requests')
          ).length,
          1
        )
        assert.equal(
          calls.filter(
            ([method, url]) => method === 'POST' && url.endsWith('/poll')
          ).length,
          1
        )
        await run('withdraw', settings, fetchMock)
        assert.equal(
          JSON.parse(await fs.readFile(settings.statePath, 'utf8')).source
            .status,
          'deleted'
        )
        scenarios++
      }
    }
  }
  assert.equal(sources.inspectWav(fixture.wav(30)), 30)
  assert.throws(
    () => sources.inspectWav(fixture.wav(30.01)),
    (error) => error.code === 'audio_duration_limit'
  )
  console.log(
    `TemboAI documentation: ${scenarios} offline client scenarios passed; single/multi-language projects, agreement digest, source contracts, rate/format boundaries and lost-response recovery verified. No network or provider calls.`
  )
} finally {
  delete globalThis.sails
  await fs.rm(temporary, { recursive: true, force: true })
}
