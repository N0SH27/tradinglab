import assert from 'node:assert/strict'
import { beforeEach, test } from 'node:test'
import { Readable } from 'node:stream'
import accessHandler from '../api/hidden-access.js'
import contentHandler from '../api/hidden-content.js'

class MockResponse {
  statusCode = 200
  headers = {}
  body = ''
  setHeader(name, value) { this.headers[name.toLowerCase()] = value }
  end(body = '') { this.body = body }
  json() { return JSON.parse(this.body) }
}

function request({ method = 'GET', body, cookie, ip = '127.0.0.1' } = {}) {
  const req = Readable.from(body === undefined ? [] : [JSON.stringify(body)])
  req.method = method
  req.headers = { 'x-forwarded-for': ip, ...(cookie ? { cookie } : {}) }
  req.socket = { remoteAddress: ip }
  return req
}

async function invoke(handler, options) {
  const res = new MockResponse()
  await handler(request(options), res)
  return res
}

beforeEach(() => {
  process.env.HIDDEN_PAGE_PASSWORD = 'correct-horse'
  process.env.HIDDEN_PAGE_SECRET = 'test-signing-secret-that-is-long-and-random'
  delete process.env.VERCEL
  delete process.env.VERCEL_ENV
})

test('正文接口拒绝没有登录凭证的请求', async () => {
  const res = await invoke(contentHandler)
  assert.equal(res.statusCode, 401)
  assert.equal(res.json().error, 'unauthorized')
})

test('错误密码返回 401，正确密码签发 HttpOnly Cookie', async () => {
  const wrong = await invoke(accessHandler, { method: 'POST', body: { password: 'wrong' }, ip: '10.0.0.1' })
  assert.equal(wrong.statusCode, 401)

  const login = await invoke(accessHandler, { method: 'POST', body: { password: 'correct-horse' }, ip: '10.0.0.1' })
  assert.equal(login.statusCode, 200)
  const cookie = login.headers['set-cookie']
  assert.match(cookie, /HttpOnly/)
  assert.match(cookie, /SameSite=Strict/)
  assert.match(cookie, /Max-Age=7200/)

  const content = await invoke(contentHandler, { cookie: cookie.split(';')[0] })
  assert.equal(content.statusCode, 200)
  assert.deepEqual(content.json().title, ['AFTER', 'HOURS'])
})

test('有效 Cookie 可恢复会话，篡改后失效', async () => {
  const login = await invoke(accessHandler, { method: 'POST', body: { password: 'correct-horse' }, ip: '10.0.0.2' })
  const cookie = login.headers['set-cookie'].split(';')[0]

  const status = await invoke(accessHandler, { cookie })
  assert.equal(status.json().authenticated, true)

  const tampered = await invoke(accessHandler, { cookie: `${cookie}x` })
  assert.equal(tampered.json().authenticated, false)
})

test('连续错误尝试触发限流', async () => {
  for (let count = 0; count < 5; count += 1) {
    const res = await invoke(accessHandler, { method: 'POST', body: { password: 'wrong' }, ip: '10.0.0.3' })
    assert.equal(res.statusCode, 401)
  }
  const limited = await invoke(accessHandler, { method: 'POST', body: { password: 'correct-horse' }, ip: '10.0.0.3' })
  assert.equal(limited.statusCode, 429)
  assert.equal(limited.headers['retry-after'], '600')
})

test('退出会清除会话 Cookie', async () => {
  const res = await invoke(accessHandler, { method: 'DELETE', ip: '10.0.0.4' })
  assert.equal(res.statusCode, 200)
  assert.match(res.headers['set-cookie'], /Max-Age=0/)
})

test('缺少服务端配置时明确返回 503', async () => {
  delete process.env.HIDDEN_PAGE_SECRET
  const res = await invoke(accessHandler)
  assert.equal(res.statusCode, 503)
  assert.equal(res.json().error, 'server_not_configured')
})
