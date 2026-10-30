import { useCallback, useEffect, useState } from 'react'
import MagicBento from '../../components/MagicBento'

type IndexQuote = {
  code: string
  name: string
  price: number
  changePercent: number
  change: number
  timestamp: number
}

type MarketPayload = {
  source: string
  timestamp: number
  tradeDate: string
  indices: IndexQuote[]
  turnover: {
    currentAmount: number
    previousAmount: number | null
    changeAmount: number | null
    changePercent: number | null
    previousDate: string | null
    historySource: string | null
  }
  breadth: {
    up: number
    down: number
    flat: number
    total: number
    upRatio: number
  }
}

const INDEX_CODES = ['000001', '399001', '399006', '000016', '000300', '000688']
const finite = (value: unknown) => typeof value === 'number' && Number.isFinite(value)
const nullableFinite = (value: unknown) => value === null || finite(value)

function isMarketPayload(value: unknown): value is MarketPayload {
  if (!value || typeof value !== 'object') return false
  const payload = value as MarketPayload
  if (typeof payload.source !== 'string' || !finite(payload.timestamp) || !/^\d{4}-\d{2}-\d{2}$/.test(payload.tradeDate)) return false
  if (!Array.isArray(payload.indices) || payload.indices.length !== INDEX_CODES.length) return false
  if (!payload.indices.every((item, index) => item.code === INDEX_CODES[index] && typeof item.name === 'string' && finite(item.price) && finite(item.changePercent) && finite(item.change) && finite(item.timestamp))) return false
  const turnover = payload.turnover
  if (!turnover || !finite(turnover.currentAmount) || turnover.currentAmount < 0 || !nullableFinite(turnover.previousAmount) || !nullableFinite(turnover.changeAmount) || !nullableFinite(turnover.changePercent)) return false
  if (turnover.previousAmount === null && (turnover.changeAmount !== null || turnover.changePercent !== null || turnover.previousDate !== null || turnover.historySource !== null)) return false
  const breadth = payload.breadth
  if (!breadth || ![breadth.up, breadth.down, breadth.flat, breadth.total, breadth.upRatio].every(finite)) return false
  return breadth.total > 0 && breadth.total === breadth.up + breadth.down + breadth.flat && breadth.upRatio >= 0 && breadth.upRatio <= 100
}

function MarketEmpty({ title, detail, note = '待接入 · 不展示估算值' }: { title: string; detail: string; note?: string }) {
  return (
    <div className="ah-market-empty">
      <span aria-hidden="true">＋</span>
      <strong>{title}</strong>
      <p>{detail}</p>
      <small>{note}</small>
    </div>
  )
}

const amountInYi = (value: number) => (value / 100000000).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const signed = (value: number) => `${value > 0 ? '+' : ''}${value.toFixed(2)}`
const direction = (value: number) => value > 0 ? 'is-up' : value < 0 ? 'is-down' : ''

export default function HiddenDashboard() {
  const [market, setMarket] = useState<MarketPayload | null>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')

  const load = useCallback(async (signal?: AbortSignal) => {
    setStatus('loading')
    setMarket(null)
    try {
      const response = await fetch('/api/hidden-market', { credentials: 'same-origin', cache: 'no-store', signal })
      if (!response.ok) throw new Error('market_unavailable')
      const payload: unknown = await response.json()
      if (!isMarketPayload(payload)) throw new Error('invalid_payload')
      setMarket(payload)
      setStatus('ready')
    } catch (cause) {
      if (cause instanceof DOMException && cause.name === 'AbortError') return
      setMarket(null)
      setStatus('error')
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    void load(controller.signal)
    return () => controller.abort()
  }, [load])

  const sourceTime = market
    ? new Intl.DateTimeFormat('zh-CN', { dateStyle: 'medium', timeStyle: 'medium', hour12: false, timeZone: 'Asia/Shanghai' }).format(new Date(market.timestamp * 1000))
    : ''
  const connectedNote = status === 'loading' ? '正在读取 · 不展示旧值' : '暂不可用 · 请刷新重试'
  const breadth = market?.breadth

  return (
    <div className="ah-dashboard-grid">
      <div className="ah-market-source">
        <p><span className={`ah-market-status is-${status}`} />{market ? `${market.source} · 可能延迟` : status === 'loading' ? '正在读取公开行情' : '行情暂时不可用'}</p>
        <div>{sourceTime && <span>数据时间（北京时间） {sourceTime}</span>}<button type="button" onClick={() => void load()} disabled={status === 'loading'}>{status === 'loading' ? '读取中' : '刷新行情'} ↻</button></div>
      </div>
      <MagicBento
        items={[
          {
            id: 'indices', title: '核心指数', label: '01 / LIVE PUBLIC DATA', colSpan: 2, rowSpan: 2,
            description: market ? '六个指数的最新公开行情；颜色仅表示涨跌方向。' : '未获得有效行情时不显示数值。',
            visual: market ? (
              <div className="ah-index-grid">
                {market.indices.map(item => (
                  <div className="ah-index-quote" key={item.code}>
                    <span>{item.name}<small>{item.code}</small></span>
                    <strong>{item.price.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                    <span className={direction(item.changePercent)}>{signed(item.changePercent)}% <small>{signed(item.change)}</small></span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="ah-index-unavailable" role="status">
                <span>{status === 'loading' ? 'LOADING / 读取中' : 'NO QUOTES / 暂无有效数据'}</span>
                {status === 'error' && <p>两个公开行情源均未返回完整数据。请稍后刷新；此处不会使用缓存旧值冒充最新行情。</p>}
              </div>
            ),
          },
          {
            id: 'turnover', title: '成交额', label: '02 / LIVE PUBLIC DATA',
            description: market?.turnover.previousAmount ? '沪深两市合计；与前一个已完成交易日比较。' : '沪深两市当前成交额；前日基准缺失时不计算变化。',
            visual: market ? (
              <div className="ah-turnover">
                <div className="ah-turnover-current"><span>沪深两市</span><strong className="ah-turnover-value">{amountInYi(market.turnover.currentAmount)}<small>亿</small></strong></div>
                {market.turnover.changeAmount !== null && market.turnover.changePercent !== null ? (
                  <div className="ah-turnover-change"><span>较前一交易日</span><strong className={direction(market.turnover.changeAmount)}>{signed(market.turnover.changeAmount / 100000000)} 亿 <small>{signed(market.turnover.changePercent)}%</small></strong></div>
                ) : <p className="ah-turnover-unavailable">前日基准暂不可用，仅展示当前成交额。</p>}
                <small className="ah-turnover-meta">[基准] {market.turnover.previousDate ?? '暂无'} · {market.turnover.historySource ?? '不计算环比'}</small>
              </div>
            ) : <MarketEmpty title={status === 'loading' ? '正在读取成交数据' : '暂无成交数据'} detail="当前成交额与前日基准分别核验。" note={connectedNote} />,
          },
          {
            id: 'breadth', title: '涨跌分布', label: '03 / LIVE PUBLIC DATA',
            description: '沪深市场合计，不含北交所；平盘计入总样本。',
            visual: breadth ? (
              <div className="ah-breadth">
                <div className="ah-breadth-counts">
                  <span className="is-up"><strong className="ah-breadth-count">{breadth.up.toLocaleString('zh-CN')}</strong><small>上涨</small></span>
                  <span className="is-down"><strong className="ah-breadth-count">{breadth.down.toLocaleString('zh-CN')}</strong><small>下跌</small></span>
                  <span><strong className="ah-breadth-count">{breadth.flat.toLocaleString('zh-CN')}</strong><small>平盘</small></span>
                </div>
                <div className="ah-breadth-track">
                  <span className="is-up" style={{ width: `${breadth.up / breadth.total * 100}%` }} />
                  <span className="is-down" style={{ width: `${breadth.down / breadth.total * 100}%` }} />
                  <span className="is-flat" style={{ width: `${breadth.flat / breadth.total * 100}%` }} />
                </div>
                <div className="ah-breadth-meta"><span>[上涨占比] {breadth.upRatio.toFixed(2)}%</span><span>[合计] {breadth.total.toLocaleString('zh-CN')} 家</span></div>
              </div>
            ) : <MarketEmpty title={status === 'loading' ? '正在读取宽度数据' : '暂无宽度数据'} detail="上海、深圳市场统计分别校验后求和。" note={connectedNote} />,
          },
          { id: 'themes', title: '热门题材', label: '04 / PENDING SOURCE', description: '题材强度、扩散与持续性。', visual: <MarketEmpty title="暂无题材数据" detail="题材分类需要真实行情与明确的归属规则。" /> },
          { id: 'limit-up', title: '涨停梯队', label: '05 / PENDING SOURCE', description: '连板高度与晋级结构。', visual: <MarketEmpty title="暂无梯队数据" detail="待接入可复核的涨停、连板与剔除规则。" /> },
        ]}
        columns={4}
        intro={false}
        rowHeight={190}
        gap={12}
        radius={0}
        glowColor="#f7f7f7"
        textAutoHide={false}
      />
      <p className="ah-market-note">成交额按沪深两市合计，前日基准取最近已完成交易日；宽度由上海、深圳市场统计聚合，平盘单列。行情仅用于信息整理，不构成投资建议。</p>
    </div>
  )
}
