import fs from 'node:fs/promises'
import { createHash, randomUUID } from 'node:crypto'
import { pathToFileURL } from 'node:url'

// Node.js 22+. This client makes only the explicitly requested HTTP operation.
export async function run(command, settings, fetchImpl = fetch) {
  const {
    baseUrl = 'https://temboai.com',
    projectId,
    apiKey,
    audioPath,
    permissionPath,
    language,
    statePath = 'tembo-state.json'
  } = settings
  if (!projectId || !apiKey)
    throw new Error('Set TEMBO_PROJECT_ID and TEMBO_API_KEY')
  if (!['upload', 'submit', 'status', 'poll', 'withdraw'].includes(command)) {
    throw new Error('Use upload, submit, status, poll or withdraw')
  }
  const root = `${baseUrl.replace(/\/$/, '')}/api/v1/voice/projects/${projectId}`
  async function save(state) {
    await fs.writeFile(statePath, JSON.stringify(state, null, 2), {
      mode: 0o600
    })
  }
  async function request(path, options = {}) {
    const response = await fetchImpl(root + path, {
      ...options,
      headers: { Authorization: `Bearer ${apiKey}`, ...options.headers },
      signal: AbortSignal.timeout(65000)
    })
    const data = await response.json()
    if (!response.ok) {
      throw Object.assign(new Error(data.error?.code || 'http_error'), {
        status: response.status,
        code: data.error?.code
      })
    }
    return data
  }
  let state
  try {
    state = JSON.parse(await fs.readFile(statePath, 'utf8'))
  } catch (error) {
    if (error.code !== 'ENOENT') throw error
  }
  if (command === 'upload') {
    if (
      !audioPath ||
      !permissionPath ||
      !['en', 'pcm', 'yo', 'ig', 'ha'].includes(language)
    ) {
      throw new Error('Set TEMBO_AUDIO, TEMBO_PERMISSION and TEMBO_LANGUAGE')
    }
    const audio = await fs.readFile(audioPath)
    const permission = JSON.parse(await fs.readFile(permissionPath, 'utf8'))
    const fingerprint = createHash('sha256')
      .update(audio)
      .update(JSON.stringify(permission))
      .update(language)
      .digest('hex')
    if (
      state &&
      (state.fingerprint !== fingerprint ||
        state.projectId !== projectId ||
        state.root !== root)
    ) {
      throw new Error(
        'Existing state belongs to different input; use a separate state file'
      )
    }
    const existingState = Boolean(state)
    state ||= {
      root,
      projectId,
      language,
      permission,
      fingerprint,
      uploadKey: randomUUID(),
      requestId: randomUUID(),
      requestKey: randomUUID()
    }
    if (!state.source) {
      // Save the stable input binding and both submission identities before HTTP.
      await fs.writeFile(statePath, JSON.stringify(state, null, 2), {
        flag: existingState ? 'w' : 'wx',
        mode: 0o600
      })
      const form = new FormData()
      form.append('idempotencyKey', state.uploadKey)
      form.append('permission', JSON.stringify(state.permission))
      form.append('audio', new Blob([audio]), 'note.audio')
      state.source = await request('/sources', { method: 'POST', body: form })
      await save(state)
    }
    return state.source
  }
  if (
    !state ||
    state.root !== root ||
    state.projectId !== projectId ||
    !state.source
  ) {
    throw new Error('Upload first, using this project and state file')
  }
  const requestPath = `/requests/${state.requestId}`
  let result
  if (command === 'submit') {
    if (state.source.status !== 'retained')
      throw new Error('Source must be retained before submission')
    if (state.request)
      throw new Error('Request already saved; use status or poll')
    // Repeating this explicit command after a lost response uses the same body/key.
    result = await request('/requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        requestId: state.requestId,
        idempotencyKey: state.requestKey,
        operation: 'transcribe',
        language: state.language,
        sourceId: state.source.id,
        servicePermission: state.permission
      })
    })
  } else if (command === 'withdraw') {
    result = await request(`/sources/${state.source.id}`, { method: 'DELETE' })
    state.source = result
    await save(state)
    return result
  } else {
    result = await request(requestPath)
    if (command === 'poll' && result.status === 'reconciliation-required') {
      // Exactly one explicit provider reconciliation. No automatic polling loop.
      result = await request(requestPath + '/poll', { method: 'POST' })
    }
  }
  state.request = result
  await save(state)
  return result
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  try {
    const result = await run(process.argv[2], {
      baseUrl: process.env.TEMBO_BASE_URL,
      projectId: process.env.TEMBO_PROJECT_ID,
      apiKey: process.env.TEMBO_API_KEY,
      audioPath: process.env.TEMBO_AUDIO,
      permissionPath: process.env.TEMBO_PERMISSION,
      language: process.env.TEMBO_LANGUAGE,
      statePath: process.env.TEMBO_STATE || 'tembo-state.json'
    })
    console.log(JSON.stringify(result, null, 2))
  } catch (error) {
    console.error(error.code || error.message)
    console.error(
      'Keep the state file. Inspect status before retrying; no automatic POST retry was made.'
    )
    process.exitCode = 1
  }
}
