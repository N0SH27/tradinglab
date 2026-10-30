import { request } from 'node:https'
import { hasValidSession, sendJson } from './_hidden-access.js'

export const EASTMONEY_URL = 'https://push2.eastmoney.com/api/qt/ulist.np/get?fltt=2&secids=1.000001,0.399001,0.399006,1.000016,1.000300,1.000688&fields=f12,f14,f2,f3,f4,f6,f104,f105,f106,f124'
export const TENCENT_URL = 'https://qt.gtimg.cn/q=sh000001,sz399001,sz399006,sh000016,sh000300,sh000688'
export const TENCENT_MARKET_URLS = [
  { code: '000001', symbol: 'sh000001', url: 'https://web.ifzq.gtimg.cn/appstock/app/kline/kline?param=sh000001,day,,,1' },
  { code: '399001', symbol: 'sz399001', url: 'https://web.ifzq.gtimg.cn/appstock/app/kline/kline?param=sz399001,day,,,1' },
]
export const EASTMONEY_HISTORY_URLS = [
  { code: '000001', url: 'https://push2his.eastmoney.com/api/qt/stock/kline/get?secid=1.000001&klt=101&fqt=0&lmt=3&end=20500101&fields1=f1,f2,f3,f4,f5,f6&fields2=f51,f52,f53,f54,f55,f56,f57,f58,f59,f60,f61' },
  { code: '399001', url: 'https://push2his.eastmoney.com/api/qt/stock/kline/get?secid=0.399001&klt=101&fqt=0&lmt=3&end=20500101&fields1=f1,f2,f3,f4,f5,f6&fields2=f51,f52,f53,f54,f55,f56,f57,f58,f59,f60,f61' },
]

const INDEX_DEFINITIONS = [
  { code: '000001', tencent: 'sh000001' },
  { code: '399001', tencent: 'sz399001' },
  { code: '399006', tencent: 'sz399006' },
  { code: '000016', tencent: 'sh000016' },
  { code: '000300', tencent: 'sh000300' },
  { code: '000688', tencent: 'sh000688' },
]
const MARKET_CODES = ['000001', '399001']
const ALLOWED_CODES = new Set(INDEX_DEFINITIONS.map(item => item.code))
const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36'

function validateQuote(quote) {
  const values = [quote.price, quote.changePercent, quote.change, quote.timestamp]
  if (!values.every(Number.isFinite) || quote.price <= 0 || Math.abs(quote.changePercent) > 1000) throw new Error('invalid_market_value')
  const now = Math.floor(Date.now() / 1000)
  if (quote.timestamp < 946684800 || quote.timestamp > now + 86400 || !quote.name) throw new Error('invalid_market_metadata')
  return quote
}

function validateAmount(value) {
  const amount = Number(value)
  if (!Number.isFinite(amount) || amount < 0 || amount > 100000000000000) throw new Error('invalid_market_amount')
  return amount
}

function validateBreadth(value) {
  const breadth = Object.fromEntries(['up', 'down', 'flat', 'total'].map(key => [key, Number(value[key])]))
  if (!Object.values(breadth).every(item => Number.isInteger(item) && item >= 0)) throw new Error('invalid_market_breadth')
  if (breadth.total <= 0 || breadth.total !== breadth.up + breadth.down + breadth.flat) throw new Error('inconsistent_market_breadth')
  return { ...breadth, upRatio: Number((breadth.up / breadth.total * 100).toFixed(2)) }
}

function combineBreadth(rows) {
  if (rows.length !== MARKET_CODES.length) throw new Error('incomplete_market_breadth')
  return validateBreadth(rows.reduce((total, row) => ({
    up: total.up + row.up,
    down: total.down + row.down,
    flat: total.flat + row.flat,
    total: total.total + row.total,
  }), { up: 0, down: 0, flat: 0, total: 0 }))
}

function shanghaiDate(timestamp) {
  return new Date((timestamp + 8 * 60 * 60) * 1000).toISOString().slice(0, 10)
}

function snapshotResult(indices, currentAmount, breadth) {
  const ordered = inCanonicalOrder(indices)
  const dates = new Set(ordered.map(item => shanghaiDate(item.timestamp)))
  if (dates.size !== 1) throw new Error('inconsistent_market_timestamp')
  validateAmount(currentAmount)
  return { indices: ordered, currentAmount, breadth, tradeDate: ordered[0] ? shanghaiDate(ordered[0].timestamp) : null }
}

function inCanonicalOrder(indices) {
  if (indices.length !== INDEX_DEFINITIONS.length || new Set(indices.map(item => item.code)).size !== INDEX_DEFINITIONS.length) throw new Error('incomplete_market_data')
  return INDEX_DEFINITIONS.map(({ code }) => {
    const quote = indices.find(item => item.code === code)
    if (!quote) throw new Error('incomplete_market_data')
    return quote
  })
}

export function parseEastMoneySnapshot(text) {
  const payload = JSON.parse(text)
  if (!Array.isArray(payload?.data?.diff)) throw new Error('unexpected_payload')
  const indices = payload.data.diff.map(item => {
    const code = String(item.f12)
    if (!ALLOWED_CODES.has(code)) throw new Error('unexpected_security')
    return validateQuote({
      code,
      name: String(item.f14 ?? '').trim(),
      price: Number(item.f2),
      changePercent: Number(item.f3),
      change: Number(item.f4),
      timestamp: Number(item.f124),
    })
  })
  const markets = MARKET_CODES.map(code => {
    const item = payload.data.diff.find(row => String(row.f12) === code)
    if (!item) throw new Error('incomplete_market_data')
    return item
  })
  const currentAmount = markets.reduce((sum, item) => sum + validateAmount(item.f6), 0)
  const breadth = combineBreadth(markets.map(item => validateBreadth({ up: item.f104, down: item.f105, flat: item.f106, total: Number(item.f104) + Number(item.f105) + Number(item.f106) })))
  return snapshotResult(indices, currentAmount, breadth)
}

export function parseEastMoney(text) {
  return parseEastMoneySnapshot(text).indices
}

function parseShanghaiTimestamp(value) {
  const match = String(value).match(/^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/)
  if (!match) throw new Error('invalid_market_timestamp')
  const [year, month, day, hour, minute, second] = match.slice(1).map(Number)
  return Math.floor(Date.UTC(year, month - 1, day, hour - 8, minute, second) / 1000)
}

function tencentRows(text) {
  const rows = new Map()
  for (const match of text.matchAll(/v_([a-z]{2}\d{6})="([^"]*)";/g)) rows.set(match[1], match[2].split('~'))
  return rows
}

function parseTencentIndices(rows) {
  return INDEX_DEFINITIONS.map(definition => {
    const fields = rows.get(definition.tencent)
    if (!fields || fields.length < 36 || String(fields[2]) !== definition.code) throw new Error('unexpected_security')
    const price = Number(fields[3])
    const previousClose = Number(fields[4])
    const change = Number(fields[31])
    const changePercent = Number(fields[32])
    if (!Number.isFinite(previousClose) || previousClose <= 0) throw new Error('invalid_previous_close')
    if (Math.abs(price - previousClose - change) > 0.05 || Math.abs(change / previousClose * 100 - changePercent) > 0.05) throw new Error('inconsistent_market_value')
    return validateQuote({
      code: definition.code,
      name: String(fields[1] ?? '').trim(),
      price,
      changePercent,
      change,
      timestamp: parseShanghaiTimestamp(fields[30]),
    })
  })
}

export function parseTencent(text) {
  return inCanonicalOrder(parseTencentIndices(tencentRows(text)))
}

function parseTencentMarket(text, definition) {
  const payload = JSON.parse(text)
  if (payload?.code !== 0) throw new Error('unexpected_payload')
  const market = payload?.data?.[definition.symbol]
  const fields = market?.qt?.[definition.symbol]
  const stats = market?.qt?.zhishu
  if (!Array.isArray(fields) || String(fields[2]) !== definition.code || !Array.isArray(stats)) throw new Error('unexpected_security')
  const expectedMarker = definition.symbol.startsWith('sh') ? 'Rank_A_sh' : 'Rank_A_sz'
  if (stats[0] !== expectedMarker || stats[1] !== expectedMarker) throw new Error('unexpected_market_scope')
  const breadth = validateBreadth({ up: stats[2], flat: stats[3], down: stats[4], total: stats[5] })
  return { breadth, tradeDate: shanghaiDate(parseShanghaiTimestamp(fields[30])) }
}

export function parseTencentSnapshot(text, shanghaiText, shenzhenText) {
  const rows = tencentRows(text)
  const indices = parseTencentIndices(rows)
  const currentAmount = MARKET_CODES.reduce((sum, code) => {
    const definition = INDEX_DEFINITIONS.find(item => item.code === code)
    const fields = rows.get(definition.tencent)
    const parts = String(fields?.[35] ?? '').split('/')
    if (parts.length !== 3 || parts[1] !== fields[36]) throw new Error('invalid_market_amount')
    return sum + validateAmount(parts[2])
  }, 0)
  const markets = [parseTencentMarket(shanghaiText, TENCENT_MARKET_URLS[0]), parseTencentMarket(shenzhenText, TENCENT_MARKET_URLS[1])]
  const snapshot = snapshotResult(indices, currentAmount, combineBreadth(markets.map(item => item.breadth)))
  if (markets.some(item => item.tradeDate !== snapshot.tradeDate)) throw new Error('inconsistent_market_timestamp')
  return snapshot
}

export function parseEastMoneyHistory(text, expectedCode, currentDate) {
  const payload = JSON.parse(text)
  if (payload?.data?.code !== expectedCode || !Array.isArray(payload?.data?.klines) || !/^\d{4}-\d{2}-\d{2}$/.test(currentDate)) throw new Error('unexpected_payload')
  const rows = payload.data.klines.map(line => String(line).split(',')).filter(row => /^\d{4}-\d{2}-\d{2}$/.test(row[0]) && row[0] < currentDate)
  rows.sort((a, b) => a[0].localeCompare(b[0]))
  const latest = rows.at(-1)
  if (!latest || latest.length < 7) throw new Error('incomplete_market_history')
  const amount = validateAmount(latest[6])
  if (amount <= 0) throw new Error('invalid_market_amount')
  return { date: latest[0], amount }
}

async function fetchHistoryOnceWithRetry(fetcher, url, retryDelay) {
  try {
    return await fetcher(url, 'utf8', 4000)
  } catch {
    await new Promise(resolve => setTimeout(resolve, retryDelay))
    return fetcher(url, 'utf8', 4000)
  }
}

async function getPreviousTurnover(fetcher, currentDate, retryDelay) {
  const rows = await Promise.all(EASTMONEY_HISTORY_URLS.map(async definition => {
    const text = await fetchHistoryOnceWithRetry(fetcher, definition.url, retryDelay)
    return parseEastMoneyHistory(text, definition.code, currentDate)
  }))
  if (rows[0].date !== rows[1].date) throw new Error('inconsistent_market_history')
  return { previousDate: rows[0].date, previousAmount: rows.reduce((sum, row) => sum + row.amount, 0) }
}

export function fetchUpstream(url, encoding = 'utf8', timeout = 4000) {
  return new Promise((resolve, reject) => {
    const isEastMoney = url.includes('eastmoney.com')
    const upstream = request(url, {
      family: 4,
      headers: {
        Accept: 'application/json,text/plain,*/*',
        'User-Agent': USER_AGENT,
        Referer: isEastMoney ? 'https://quote.eastmoney.com/' : 'https://gu.qq.com/',
      },
    }, response => {
      if (response.statusCode !== 200) {
        response.resume()
        reject(new Error(`upstream_http_${response.statusCode ?? 'unknown'}`))
        return
      }
      const chunks = []
      let size = 0
      response.on('data', chunk => {
        size += chunk.length
        if (size > 100000) {
          upstream.destroy(new Error('unexpected_payload'))
          return
        }
        chunks.push(chunk)
      })
      response.on('end', () => {
        try {
          resolve(new TextDecoder(encoding, { fatal: true }).decode(Buffer.concat(chunks)))
        } catch (error) {
          reject(error)
        }
      })
      response.on('error', reject)
    })
    upstream.setTimeout(timeout, () => upstream.destroy(new Error('upstream_timeout')))
    upstream.on('error', reject)
    upstream.end()
  })
}

function marketPayload(provider, snapshot, history) {
  const eastMoney = provider === 'eastmoney'
  const previousAmount = history?.previousAmount ?? null
  const changeAmount = previousAmount === null ? null : snapshot.currentAmount - previousAmount
  return {
    provider,
    source: eastMoney ? '东方财富公开行情' : '腾讯公开行情（备用）',
    sourceUrl: eastMoney ? EASTMONEY_URL : TENCENT_URL,
    fallback: !eastMoney,
    delayed: true,
    timestamp: Math.max(...snapshot.indices.map(item => item.timestamp)),
    tradeDate: snapshot.tradeDate,
    fetchedAt: Math.floor(Date.now() / 1000),
    indices: snapshot.indices,
    turnover: {
      currentAmount: snapshot.currentAmount,
      previousAmount,
      changeAmount,
      changePercent: previousAmount === null ? null : changeAmount / previousAmount * 100,
      previousDate: history?.previousDate ?? null,
      historySource: history ? '东方财富历史行情' : null,
    },
    breadth: snapshot.breadth,
  }
}

export async function getMarket(fetcher = fetchUpstream, historyRetryDelay = 150) {
  let provider = 'eastmoney'
  let snapshot
  try {
    const text = await fetcher(EASTMONEY_URL, 'utf8', 4000)
    snapshot = parseEastMoneySnapshot(text)
  } catch (error) {
    console.warn('[hidden-market] primary source failed, trying backup:', error instanceof Error ? error.message : 'unknown')
    provider = 'tencent'
    const [text, shanghaiText, shenzhenText] = await Promise.all([
      fetcher(TENCENT_URL, 'gb18030', 4500),
      fetcher(TENCENT_MARKET_URLS[0].url, 'utf8', 4500),
      fetcher(TENCENT_MARKET_URLS[1].url, 'utf8', 4500),
    ])
    snapshot = parseTencentSnapshot(text, shanghaiText, shenzhenText)
  }

  let history = null
  try {
    history = await getPreviousTurnover(fetcher, snapshot.tradeDate, historyRetryDelay)
  } catch (error) {
    console.warn('[hidden-market] previous turnover unavailable:', error instanceof Error ? error.message : 'unknown')
  }
  return marketPayload(provider, snapshot, history)
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    sendJson(res, 405, { error: 'method_not_allowed' }, { Allow: 'GET' })
    return
  }
  if (!hasValidSession(req)) {
    sendJson(res, 401, { error: 'unauthorized' })
    return
  }

  try {
    sendJson(res, 200, await getMarket())
  } catch (error) {
    console.error('[hidden-market] both upstream sources failed:', error instanceof Error ? error.message : 'unknown')
    sendJson(res, 502, { error: 'market_data_unavailable' })
  }
}
