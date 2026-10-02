import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { spawn } from 'node:child_process'
import { mkdtemp, readdir, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { once } from 'node:events'

// Production route, isolated API and uploads; no production credentials/data.
const uploadDir = await mkdtemp(path.join(tmpdir(), 'cartagena-upload-test-'))
const calls = []
const api = createServer((req, res) => {
  calls.push(req.headers.authorization)
  res.setHeader('Content-Type', 'application/json')
  const token = req.headers.authorization
  if (token === 'Bearer valid-local-user') res.end(JSON.stringify({ id: 'test-user', role: 'user' }))
  else if (token === 'Bearer malformed-local-user') res.end('{}')
  else { res.statusCode = token === 'Bearer unavailable-local-api' ? 503 : 401; res.end('{}') }
})
await new Promise(resolve => api.listen(0, '127.0.0.1', resolve))
const reserve = createServer()
await new Promise(resolve => reserve.listen(0, '127.0.0.1', resolve))
const port = reserve.address().port
await new Promise(resolve => reserve.close(resolve))
const app = spawn(process.execPath, ['.next/standalone/server.js'], {
  env: { ...process.env, NODE_ENV: 'production', HOSTNAME: '127.0.0.1', PORT: String(port),
    API_URL: `http://127.0.0.1:${api.address().port}`, ADMIN_API_KEY: 'valid-local-admin',
    UPLOAD_DIR: uploadDir, NEXT_TELEMETRY_DISABLED: '1' },
  stdio: ['ignore', 'pipe', 'pipe'],
})
let log = ''
app.stdout.on('data', data => { log += data })
app.stderr.on('data', data => { log += data })
const base = `http://127.0.0.1:${port}`
async function request(cookie) {
  const form = new FormData()
  form.append('file', new Blob([Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Y9Z4r8AAAAASUVORK5CYII=', 'base64')], {type:'image/png'}), 'test.png')
  return fetch(base + '/api/uploads', { method: 'POST', body: form,
    headers: cookie ? {cookie} : {}, redirect: 'manual', signal: AbortSignal.timeout(10000) })
}
try {
  let ready = false
  for (let i = 0; i < 100; i++) {
    if (app.exitCode !== null) throw new Error('Local server exited: ' + log)
    try {
      const r = await fetch(base + '/api/session', {redirect:'manual', signal:AbortSignal.timeout(1000)})
      if (r.ok) {ready=true;break}
    } catch { /* Retry while the local server starts. */ }
    await new Promise(r=>setTimeout(r,100))
  }
  assert.ok(ready, 'local server starts')
  for (const [name, cookie] of [
    ['anonymous', ''], ['fake cookie', 'user_token=fake-local-user'],
    ['expired cookie', 'user_token=expired-local-user'], ['wrong admin', 'admin_key=wrong-local-admin'],
    ['malformed backend identity','user_token=malformed-local-user'],
    ['backend unavailable','user_token=unavailable-local-api'],
  ]) {
    assert.equal((await request(cookie)).status,401,name)
    assert.equal((await readdir(uploadDir)).length,0, name+' writes no file')
    console.log('PASS '+name)
  }
  assert.ok(calls.includes('Bearer fake-local-user'), 'fake token checked by API')
  assert.ok(calls.includes('Bearer expired-local-user'), 'expired token checked by API')
  assert.equal((await request('user_token=valid-local-user')).status,200,'verified user upload')
  assert.equal((await readdir(uploadDir)).length,1)
  console.log('PASS verified user')
  const callsBefore=calls.length
  assert.equal((await request('admin_key=valid-local-admin')).status,200,'admin upload')
  assert.equal(calls.length,callsBefore,'admin key uses existing authorization')
  assert.equal((await readdir(uploadDir)).length,2)
  console.log('PASS valid admin')
  await new Promise(resolve=>api.close(resolve))
  assert.equal((await request('user_token=valid-local-user')).status,401,'connection failure fails closed')
  assert.equal((await readdir(uploadDir)).length,2)
  console.log('PASS backend connection failure')
} finally {
  app.kill('SIGTERM')
  if (app.exitCode===null) await once(app,'exit')
  if (api.listening) await new Promise(resolve=>api.close(resolve))
  await rm(uploadDir,{recursive:true,force:true})
}
