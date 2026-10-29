import { createHmac, timingSafeEqual } from 'node:crypto'

export const SESSION_MAX_AGE = 60 * 60 * 2
const ATTEMPT_WINDOW = 10 * 60 * 1000
const MAX_ATTEMPTS = 5
const attempts = new Map()

export function hasServerConfig() {
  return Boolean(process.env.HIDDEN_PAGE_PASSWORD && process.env.HIDDEN_PAGE_SECRET)
}

export function sendJson(res, status, payload, headers = {}) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.setHeader('Cache-Control', 'no-store, max-age=0')
  res.setHeader('Vary', 'Cookie')
  for (const [key, value] of Object.entries(headers)) res.setHeader(key, value)
  res.end(JSON.stringify(payload))
}

export async function readJson(req) {
  if (req.body && typeof req.body === 'object') return req.body
  if (typeof req.body === 'string') return JSON.parse(req.body)

  let body = ''
  for await (const chunk of req) {
    body += chunk
    if (Buffer.byteLength(body) > 8192) throw new Error('payload_too_large')
  }
  return body ? JSON.parse(body) : {}
}

function secureCookie() {
  return process.env.VERCEL === '1' && process.env.VERCEL_ENV !== 'development'
}

function cookieName() {
  return secureCookie() ? '__Host-tradinglab_after_hours' : 'tradinglab_after_hours'
}

function sign(payload, secret) {
  return createHmac('sha256', secret).update(payload).digest('base64url')
}

export function createSession() {
  const payload = Buffer.from(JSON.stringify({
    exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE,
  })).toString('base64url')
  return `${payload}.${sign(payload, process.env.HIDDEN_PAGE_SECRET)}`
}

export function sessionCookie() {
  const secure = secureCookie() ? '; Secure' : ''
  return `${cookieName()}=${createSession()}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${SESSION_MAX_AGE}${secure}`
}

export function clearSessionCookie() {
  const secure = secureCookie() ? '; Secure' : ''
  return `${cookieName()}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0${secure}`
}

function safeEqual(left, right) {
  const a = Buffer.from(left)
  const b = Buffer.from(right)
  return a.length === b.length && timingSafeEqual(a, b)
}

export function passwordMatches(candidate) {
  return typeof candidate === 'string' && safeEqual(candidate, process.env.HIDDEN_PAGE_PASSWORD ?? '')
}

export function hasValidSession(req) {
  if (!hasServerConfig()) return false
  const cookies = String(req.headers.cookie ?? '')
  const token = cookies.split(';').map(part => part.trim()).find(part => part.startsWith(`${cookieName()}=`))?.slice(cookieName().length + 1)
  if (!token) return false

  const [payload, signature, extra] = token.split('.')
  if (!payload || !signature || extra) return false
  if (!safeEqual(signature, sign(payload, process.env.HIDDEN_PAGE_SECRET))) return false

  try {
    const session = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'))
    const now = Math.floor(Date.now() / 1000)
    return Number.isInteger(session.exp) && session.exp > now && session.exp <= now + SESSION_MAX_AGE + 60
  } catch {
    return false
  }
}

function attemptKey(req) {
  return String(req.headers['x-forwarded-for'] ?? req.socket?.remoteAddress ?? 'unknown').split(',')[0].trim()
}

export function isRateLimited(req) {
  const record = attempts.get(attemptKey(req))
  if (!record || Date.now() - record.startedAt > ATTEMPT_WINDOW) return false
  return record.count >= MAX_ATTEMPTS
}

export function recordFailedAttempt(req) {
  const key = attemptKey(req)
  const current = attempts.get(key)
  const record = !current || Date.now() - current.startedAt > ATTEMPT_WINDOW
    ? { count: 0, startedAt: Date.now() }
    : current
  record.count += 1
  attempts.set(key, record)
}

export function clearFailedAttempts(req) {
  attempts.delete(attemptKey(req))
}
