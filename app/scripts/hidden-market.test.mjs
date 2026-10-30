import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  EASTMONEY_HISTORY_URLS,
  EASTMONEY_URL,
  TENCENT_MARKET_URLS,
  TENCENT_URL,
  getMarket,
  parseEastMoney,
  parseEastMoneyHistory,
  parseEastMoneySnapshot,
  parseTencent,
  parseTencentSnapshot,
} from '../api/hidden-market.js'

const NOW = Math.floor(Date.now() / 1000)
const QUOTES = [
  { code: '000001', symbol: 'sh000001', name: '上证指数', price: 3632.92, previousClose: 3651.43 },
  { code: '399001', symbol: 'sz399001', name: '深证成指', price: 11028.69, previousClose: 11138.20 },
  { code: '399006', symbol: 'sz399006', name: '创业板指', price: 2474.34, previousClose: 2517.59 },
  { code: '000016', symbol: 'sh000016', name: '上证50', price: 2752.80, previousClose: 2762.79 },
  { code: '000300', symbol: 'sh000300', name: '沪深300', price: 4018.89, previousClose: 4041.84 },
  { code: '000688', symbol: 'sh000688', name: '科创50', price: 1198.36, previousClose: 1228.09 },
]
const AMOUNTS = { '000001': 453253292178.10, '399001': 556502126552.02 }
const PREVIOUS_AMOUNTS = { '000001': 715620694906.30, '399001': 840903489814.18 }
const BREADTH = {
  '000001': { up: 1036, flat: 107, down: 1175 },
  '399001': { up: 1331, flat: 120, down: 1454 },
}
const HISTORY_URLS = EASTMONEY_HISTORY_URLS.map(item => item.url)
const BACKUP_URLS = [TENCENT_URL, ...TENCENT_MARKET_URLS.map(item => item.url)]

function changeFor(quote) {
  return Number((quote.price - quote.previousClose).toFixed(2))
}

function percentFor(quote) {
  return Number((changeFor(quote) / quote.previousClose * 100).toFixed(2))
}

function shanghaiDate(epoch) {
  return new Date((epoch + 8 * 60 * 60) * 1000).toISOString().slice(0, 10)
}

function shiftDate(date, days) {
  const value = new Date(`${date}T00:00:00Z`)
  value.setUTCDate(value.getUTCDate() + days)
  return value.toISOString().slice(0, 10)
}

const CURRENT_DATE = shanghaiDate(NOW)
const PREVIOUS_DATE = shiftDate(CURRENT_DATE, -1)
const OLDER_DATE = shiftDate(CURRENT_DATE, -2)

function eastMoneyFixture() {
  return JSON.stringify({
    data: {
      diff: [...QUOTES].reverse().map(quote => ({
        f12: quote.code,
        f14: quote.name,
        f2: quote.price,
        f3: percentFor(quote),
        f4: changeFor(quote),
        f6: AMOUNTS[quote.code] ?? 0,
        f104: BREADTH[quote.code]?.up ?? 0,
        f105: BREADTH[quote.code]?.down ?? 0,
        f106: BREADTH[quote.code]?.flat ?? 0,
        f124: NOW,
      })),
    },
  })
}

function shanghaiTimestamp(epoch) {
  return new Date((epoch + 8 * 60 * 60) * 1000).toISOString().replace(/[-:TZ]/g, '').slice(0, 14)
}

function tencentFixture() {
  return QUOTES.map(quote => {
    const fields = Array(80).fill('0')
    fields[0] = quote.symbol.startsWith('sh') ? '1' : '51'
    fields[1] = quote.name
    fields[2] = quote.code
    fields[3] = String(quote.price)
    fields[4] = String(quote.previousClose)
    fields[30] = shanghaiTimestamp(NOW)
    fields[31] = String(changeFor(quote))
    fields[32] = String(percentFor(quote))
    fields[35] = `${quote.price}/1000/${AMOUNTS[quote.code] ?? 0}`
    fields[36] = '1000'
    fields[37] = String((AMOUNTS[quote.code] ?? 0) / 10000)
    return `v_${quote.symbol}="${fields.join('~')}";`
  }).join('\n')
}

function tencentMarketFixture(definition) {
  const breadth = BREADTH[definition.code]
  const marker = definition.symbol.startsWith('sh') ? 'Rank_A_sh' : 'Rank_A_sz'
  const fields = Array(80).fill('0')
  fields[2] = definition.code
  fields[30] = shanghaiTimestamp(NOW)
  return JSON.stringify({
    code: 0,
    data: {
      [definition.symbol]: {
        qt: {
          [definition.symbol]: fields,
          zhishu: [marker, marker, breadth.up, breadth.flat, breadth.down, breadth.up + breadth.flat + breadth.down],
        },
      },
    },
  })
}

function historyFixture(definition) {
  const rows = [
    [OLDER_DATE, '1', '1', '1', '1', '1', '100000000'],
    [PREVIOUS_DATE, '1', '1', '1', '1', '1', String(PREVIOUS_AMOUNTS[definition.code])],
    [CURRENT_DATE, '1', '1', '1', '1', '1', String(AMOUNTS[definition.code])],
  ].map(row => row.join(','))
  return JSON.stringify({ data: { code: definition.code, klines: rows } })
}

function fixtureFor(url) {
  if (url === EASTMONEY_URL) return eastMoneyFixture()
  if (url === TENCENT_URL) return tencentFixture()
  const market = TENCENT_MARKET_URLS.find(item => item.url === url)
  if (market) return tencentMarketFixture(market)
  const history = EASTMONEY_HISTORY_URLS.find(item => item.url === url)
  if (history) return historyFixture(history)
  throw new Error(`unexpected_url_${url}`)
}

test('东方财富数据按固定六指数顺序返回', () => {
  const indices = parseEastMoney(eastMoneyFixture())
  assert.deepEqual(indices.map(item => item.code), QUOTES.map(item => item.code))
  assert.equal(indices[0].price, QUOTES[0].price)
  assert.equal(indices[0].change, changeFor(QUOTES[0]))
})

test('东方财富成交额与市场宽度按沪深合计', () => {
  const snapshot = parseEastMoneySnapshot(eastMoneyFixture())
  assert.equal(snapshot.currentAmount, AMOUNTS['000001'] + AMOUNTS['399001'])
  assert.deepEqual(snapshot.breadth, { up: 2367, down: 2629, flat: 227, total: 5223, upRatio: 45.32 })
  assert.equal(snapshot.tradeDate, CURRENT_DATE)
})

test('腾讯 GBK 解码后的字段可解析为统一行情结构', () => {
  const indices = parseTencent(tencentFixture())
  assert.equal(indices.length, 6)
  assert.deepEqual(indices.map(item => item.name), QUOTES.map(item => item.name))
  assert.equal(indices[0].timestamp, NOW)
  assert.equal(indices[5].changePercent, percentFor(QUOTES[5]))
})

test('腾讯备用源成交额和沪深 A 股宽度可复核', () => {
  const snapshot = parseTencentSnapshot(tencentFixture(), tencentMarketFixture(TENCENT_MARKET_URLS[0]), tencentMarketFixture(TENCENT_MARKET_URLS[1]))
  assert.equal(snapshot.currentAmount, AMOUNTS['000001'] + AMOUNTS['399001'])
  assert.equal(snapshot.breadth.total, 5223)
  assert.equal(snapshot.breadth.up + snapshot.breadth.down + snapshot.breadth.flat, snapshot.breadth.total)
})

test('历史成交额忽略当日并选择最近完成交易日', () => {
  const history = parseEastMoneyHistory(historyFixture(EASTMONEY_HISTORY_URLS[0]), '000001', CURRENT_DATE)
  assert.equal(history.date, PREVIOUS_DATE)
  assert.equal(history.amount, PREVIOUS_AMOUNTS['000001'])
})

test('主源正常时不请求备用源，并补齐前日成交额', async () => {
  const calls = []
  const payload = await getMarket(async url => {
    calls.push(url)
    return fixtureFor(url)
  })
  assert.equal(calls.some(url => BACKUP_URLS.includes(url)), false)
  assert.equal(calls.filter(url => HISTORY_URLS.includes(url)).length, 2)
  assert.equal(payload.provider, 'eastmoney')
  assert.equal(payload.fallback, false)
  assert.equal(payload.indices.length, 6)
  assert.equal(payload.turnover.previousAmount, PREVIOUS_AMOUNTS['000001'] + PREVIOUS_AMOUNTS['399001'])
  assert.equal(payload.turnover.previousDate, PREVIOUS_DATE)
  assert.equal(payload.breadth.total, 5223)
})

test('主源连接失败时自动切换腾讯备用源', async () => {
  const calls = []
  const payload = await getMarket(async url => {
    calls.push(url)
    if (url === EASTMONEY_URL) throw new Error('socket_closed')
    return fixtureFor(url)
  })
  assert.equal(calls[0], EASTMONEY_URL)
  assert.equal(BACKUP_URLS.every(url => calls.includes(url)), true)
  assert.equal(payload.provider, 'tencent')
  assert.equal(payload.fallback, true)
  assert.match(payload.source, /腾讯/)
  assert.equal(payload.turnover.currentAmount, AMOUNTS['000001'] + AMOUNTS['399001'])
  assert.equal(payload.breadth.total, 5223)
})

test('主源数据不完整同样触发备用源', async () => {
  const payload = await getMarket(async url => {
    if (url === EASTMONEY_URL) return JSON.stringify({ data: { diff: [] } })
    return fixtureFor(url)
  })
  assert.equal(payload.provider, 'tencent')
  assert.equal(payload.indices.length, 6)
})

test('备用源涨跌字段自相矛盾时拒绝出数', () => {
  const fixture = tencentFixture().replace('~-18.51~-0.51~', '~-18.51~9.99~')
  assert.throws(() => parseTencent(fixture), /inconsistent_market_value/)
})

test('备用源宽度家数不等于合计时拒绝出数', () => {
  const market = JSON.parse(tencentMarketFixture(TENCENT_MARKET_URLS[0]))
  market.data.sh000001.qt.zhishu[5] = 9999
  assert.throws(() => parseTencentSnapshot(tencentFixture(), JSON.stringify(market), tencentMarketFixture(TENCENT_MARKET_URLS[1])), /inconsistent_market_breadth/)
})

test('前日历史失败仅降级环比，不影响当前数据', async () => {
  const payload = await getMarket(async url => {
    if (HISTORY_URLS.includes(url)) throw new Error('history_offline')
    return fixtureFor(url)
  })
  assert.equal(payload.turnover.previousAmount, null)
  assert.equal(payload.turnover.changeAmount, null)
  assert.equal(payload.turnover.changePercent, null)
  assert.equal(payload.turnover.historySource, null)
  assert.equal(payload.turnover.currentAmount, AMOUNTS['000001'] + AMOUNTS['399001'])
  assert.equal(payload.breadth.total, 5223)
})

test('单个历史请求首次断连时仅重试一次并恢复环比', async () => {
  const historyCalls = []
  const payload = await getMarket(async url => {
    if (HISTORY_URLS.includes(url)) historyCalls.push(url)
    if (url === HISTORY_URLS[0] && historyCalls.filter(item => item === url).length === 1) throw new Error('socket_closed')
    return fixtureFor(url)
  }, 0)
  assert.equal(historyCalls.filter(url => url === HISTORY_URLS[0]).length, 2)
  assert.equal(historyCalls.filter(url => url === HISTORY_URLS[1]).length, 1)
  assert.equal(payload.turnover.previousAmount, PREVIOUS_AMOUNTS['000001'] + PREVIOUS_AMOUNTS['399001'])
  assert.equal(payload.turnover.previousDate, PREVIOUS_DATE)
})

test('两个实时来源都失败时抛出错误而不返回旧值', async () => {
  const calls = []
  await assert.rejects(() => getMarket(async url => {
    calls.push(url)
    throw new Error('offline')
  }), /offline/)
  assert.equal(calls.some(url => HISTORY_URLS.includes(url)), false)
})
