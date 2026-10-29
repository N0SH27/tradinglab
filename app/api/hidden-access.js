import {
  clearFailedAttempts,
  clearSessionCookie,
  hasServerConfig,
  hasValidSession,
  isRateLimited,
  passwordMatches,
  readJson,
  recordFailedAttempt,
  sendJson,
  sessionCookie,
} from './_hidden-access.js'

export default async function handler(req, res) {
  if (!hasServerConfig()) {
    sendJson(res, 503, { error: 'server_not_configured' })
    return
  }

  if (req.method === 'GET') {
    sendJson(res, 200, { authenticated: hasValidSession(req) })
    return
  }

  if (req.method === 'DELETE') {
    clearFailedAttempts(req)
    sendJson(res, 200, { authenticated: false }, { 'Set-Cookie': clearSessionCookie() })
    return
  }

  if (req.method !== 'POST') {
    sendJson(res, 405, { error: 'method_not_allowed' }, { Allow: 'GET, POST, DELETE' })
    return
  }

  if (isRateLimited(req)) {
    sendJson(res, 429, { error: 'too_many_attempts' }, { 'Retry-After': '600' })
    return
  }

  try {
    const body = await readJson(req)
    if (!passwordMatches(body.password)) {
      recordFailedAttempt(req)
      sendJson(res, 401, { error: 'invalid_password' })
      return
    }

    clearFailedAttempts(req)
    sendJson(res, 200, { authenticated: true }, { 'Set-Cookie': sessionCookie() })
  } catch {
    sendJson(res, 400, { error: 'invalid_request' })
  }
}
