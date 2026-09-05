import { useState } from 'react'
import { INDUSTRY_MAP, MAP_EDGES, type MapNode } from '../data/domains/map'
import type { PolarityState } from './PolarityInstrument'

/* ── MapPreview（V2-C · Home Map Preview · DELTA-01 实施口径）──────────────────
 * 首页切片 = 从既有 Map 数据选择的展示切片（Option A · 2026-09-05 Human Decision）：
 * 7 节点 6 真边 gpu→hbm→cowos→optical→server→idc→power。
 * · 真边校验：模块加载时逐条对照 MAP_EDGES，任一边不存在即报错（Contract 违例），
 *   绝不绘制虚假边；map.ts / MapNode schema / MAP_EDGES 零改动（只读）。
 * · DELTA-01：Node Detail 严格 = Node Name + State + EXPLORE WORLD →。
 *   禁止 Related counts / Current State 明细 / Observation / StateNote / StageFocus。
 * · Polarity = Lens：active 非空时，匹配节点保持、其余退淡——语义由 Map 的变化来教。
 * · 节点为原生 <button>：Tab 可达、Enter/Space 触发、朱砂焦点环、reduced-motion 瞬时。 */

const SLICE: string[] = ['gpu', 'hbm', 'cowos', 'optical', 'server', 'idc', 'power']
const CHAIN: [string, string][] = [
  ['gpu', 'hbm'],
  ['hbm', 'cowos'],
  ['cowos', 'optical'],
  ['optical', 'server'],
  ['server', 'idc'],
  ['idc', 'power'],
]

const EDGE_OK = CHAIN.every(([a, b]) =>
  MAP_EDGES.some(([x, y]) => (x === a && y === b) || (x === b && y === a)),
)
if (!EDGE_OK && typeof console !== 'undefined') {
  console.error('[MapPreview] chain edge missing from MAP_EDGES — Contract violation, no false edge drawn')
}

/* 链式排布（百分比坐标，仅本组件的展示布局，不属于数据层） */
const POS: Record<string, { x: number; y: number }> = {
  gpu: { x: 50, y: 5 },
  hbm: { x: 28, y: 20 },
  cowos: { x: 62, y: 35 },
  optical: { x: 32, y: 50 },
  server: { x: 62, y: 65 },
  idc: { x: 34, y: 80 },
  power: { x: 54, y: 95 },
}

const STATE_ZH: Record<PolarityState, string> = { yang: '阳', turn: '转换中', yin: '阴' }
const STATE_COLOR: Record<PolarityState, string> = {
  yang: 'rgb(var(--ink))',
  turn: 'rgb(var(--cinnabar))',
  yin: 'rgb(var(--water))',
}
/* 节点权重 → 圆点尺寸（px） */
const DOT: Record<number, number> = { 1: 14, 2: 18, 3: 22 }

function nodeFill(n: MapNode): React.CSSProperties {
  if (n.state === 'yang') return { background: 'rgb(var(--ink))' }
  if (n.state === 'yin') return { background: 'rgb(var(--paper))', border: '1px solid rgb(var(--ink))' }
  /* turn：半实半空（与 IndustryMap 同语义） */
  return {
    background: 'linear-gradient(90deg, rgb(var(--ink)) 50%, rgb(var(--paper)) 50%)',
    border: '1px solid rgb(var(--ink))',
  }
}

function valuationRing(n: MapNode): string | undefined {
  /* 估值位置外环（沿用地图既有编码：透支 = 朱砂，出清 = 深水蓝；合理 = 无环） */
  if (n.valuation === 'stretched') return '0 0 0 3px rgb(var(--paper)), 0 0 0 4px rgb(var(--cinnabar))'
  if (n.valuation === 'washed') return '0 0 0 3px rgb(var(--paper)), 0 0 0 4px rgb(var(--water))'
  return undefined
}

export function MapPreview({
  active,
  className = '',
}: {
  active: PolarityState | null
  className?: string
}) {
  const [selected, setSelected] = useState<string | null>(null)
  const nodes = SLICE.map((id) => INDUSTRY_MAP.nodes.find((n) => n.id === id)).filter(
    (n): n is MapNode => Boolean(n),
  )
  const sel = nodes.find((n) => n.id === selected) ?? null

  return (
    <div className={className}>
      <div className="relative h-[440px] md:h-[520px]">
        {/* 6 条真实边（真边校验失败时不绘制任何边） */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {EDGE_OK &&
            CHAIN.map(([a, b]) => (
              <line
                key={`${a}-${b}`}
                x1={POS[a].x}
                y1={POS[a].y}
                x2={POS[b].x}
                y2={POS[b].y}
                stroke="rgb(var(--ink))"
                strokeOpacity="0.25"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
            ))}
        </svg>

        {nodes.map((n) => {
          const p = POS[n.id]
          const dim = active !== null && n.state !== active
          const d = DOT[n.size] ?? DOT[1]
          return (
            <button
              key={n.id}
              type="button"
              onClick={() => setSelected((cur) => (cur === n.id ? null : n.id))}
              aria-pressed={selected === n.id}
              aria-label={`${n.name}：${STATE_ZH[n.state]}。查看名称与状态。`}
              className={`absolute -translate-x-1/2 -translate-y-1/2 flex items-center gap-3 cursor-pointer transition-opacity duration-300 motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-[rgb(var(--cinnabar))] ${
                p.x > 50 ? 'flex-row-reverse' : ''
              } ${dim ? 'opacity-20' : 'opacity-100'}`}
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
            >
              <span
                aria-hidden="true"
                className="block rounded-full shrink-0"
                style={{
                  width: d,
                  height: d,
                  boxShadow: valuationRing(n),
                  ...nodeFill(n),
                }}
              />
              <span className="font-serif-sc font-bold text-sm md:text-base tracking-tight whitespace-nowrap">
                {n.name}
              </span>
            </button>
          )
        })}
      </div>

      {/* DELTA-01 · Node Detail：Name + State + EXPLORE WORLD，仅此三项 */}
      <div className="hairline-t pt-5 min-h-[3.5rem]">
        {sel ? (
          <div className="flex items-baseline justify-between gap-4 flex-wrap">
            <span className="font-serif-sc font-bold text-xl md:text-2xl tracking-tight">
              {sel.name}
            </span>
            <span
              className="font-mono-num text-xs tracking-[0.2em]"
              style={{ color: STATE_COLOR[sel.state] }}
            >
              {STATE_ZH[sel.state]} · {sel.state.toUpperCase()}
            </span>
            <a href="#/map" className="btn-line">
              EXPLORE WORLD →
            </a>
          </div>
        ) : (
          <span className="text-xs ink-3 tracking-widest">点击任一环节，查看它的当前状态。</span>
        )}
      </div>
    </div>
  )
}
