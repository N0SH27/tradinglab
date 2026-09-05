import { useState } from 'react'
import { INDUSTRY_MAP, MAP_EDGES, type MapNode } from '../data/domains/map'
import type { PolarityState } from './PolarityInstrument'

/* ── MapPreview（V2-C.1 · 2026-09-05 Human 裁决 · World at a Glance）───────────
 * 首页切片 = 从既有 Map 数据选择的展示切片（7 节点 6 真边，Option A 切片不变）：
 * gpu→hbm→cowos→optical→server→idc→power。map.ts / MapNode schema / MAP_EDGES 零改动。
 *
 * 视觉（V2-C.1 Option A+B 组合）：节点、边、间距同步增重——网络关系是视觉主体，
 * 不是细线流程图；节点数量与实体零新增，仅 Presentation 层调整。
 *
 * 交互（V2-C.1 §11/§12 裁决）：State ≠ Interaction Permission。
 * · 点亮节点（无滤镜 = 全部点亮；滤镜下 = 命中态）= <a> 直链 Primary Home：
 *   点击进入，不再经过「详情 → EXPLORE」两段操作，也不再中转完整 /map；
 * · 未点亮节点（滤镜下退淡）= <button>：仍可点击，下方显示 Node Detail
 *   （DELTA-01 纪律不变：Name + State + EXPLORE，仅此三项）；
 * · Primary Home 分流：node.theses[0] 存在 → #/thesis/<id>；否则 → #/map。
 * · Polarity = Lens：滤镜只改变状态表达，从不剥夺操作权限。 */

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
/* 节点权重 → 圆点尺寸（px）（V2-C.1 增重：14/18/22 → 22/28/34） */
const DOT: Record<number, number> = { 1: 22, 2: 28, 3: 34 }

/* Primary Home 分流（V2-C.1 §12.1）：有命题 → 命题页；无命题 → 完整 /map */
function primaryHomeOf(n: MapNode): { href: string; label: string } {
  const t = n.theses?.[0]
  return t
    ? { href: `#/thesis/${t}`, label: 'EXPLORE →' }
    : { href: '#/map', label: 'EXPLORE WORLD →' }
}

function nodeFill(n: MapNode): React.CSSProperties {
  if (n.state === 'yang') return { background: 'rgb(var(--ink))' }
  if (n.state === 'yin') return { background: 'rgb(var(--paper))', border: '1.5px solid rgb(var(--ink))' }
  /* turn：半实半空（与 IndustryMap 同语义） */
  return {
    background: 'linear-gradient(90deg, rgb(var(--ink)) 50%, rgb(var(--paper)) 50%)',
    border: '1.5px solid rgb(var(--ink))',
  }
}

function valuationRing(n: MapNode): string | undefined {
  /* 估值位置外环（沿用地图既有编码：透支 = 朱砂，出清 = 深水蓝；合理 = 无环） */
  if (n.valuation === 'stretched') return '0 0 0 4px rgb(var(--paper)), 0 0 0 5.5px rgb(var(--cinnabar))'
  if (n.valuation === 'washed') return '0 0 0 4px rgb(var(--paper)), 0 0 0 5.5px rgb(var(--water))'
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
      <div className="relative h-[520px] md:h-[600px]">
        {/* 6 条真实边（真边校验失败时不绘制任何边）；V2-C.1 增重：1px/25% → 2px/40% */}
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
                strokeOpacity="0.4"
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
              />
            ))}
        </svg>

        {nodes.map((n) => {
          const p = POS[n.id]
          const lit = active === null || n.state === active
          const d = DOT[n.size] ?? DOT[1]
          const home = primaryHomeOf(n)
          const inner = (
            <>
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
              <span className="font-serif-sc font-bold text-base md:text-lg tracking-tight whitespace-nowrap">
                {n.name}
              </span>
            </>
          )
          const cls = `absolute -translate-x-1/2 -translate-y-1/2 flex items-center gap-3 cursor-pointer transition-opacity duration-300 motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-[rgb(var(--cinnabar))] ${
            p.x > 50 ? 'flex-row-reverse' : ''
          } ${lit ? 'opacity-100' : 'opacity-45'}`
          const pos = { left: `${p.x}%`, top: `${p.y}%` }

          /* 点亮 = 一步直达 Primary Home；未点亮 = 可点击，出 Node Detail */
          return lit ? (
            <a
              key={n.id}
              href={home.href}
              aria-label={`${n.name}：${STATE_ZH[n.state]}。进入它的研究本体。`}
              className={cls}
              style={pos}
              onClick={() => setSelected(null)}
            >
              {inner}
            </a>
          ) : (
            <button
              key={n.id}
              type="button"
              onClick={() => setSelected((cur) => (cur === n.id ? null : n.id))}
              aria-pressed={selected === n.id}
              aria-label={`${n.name}：${STATE_ZH[n.state]}。查看名称与状态。`}
              className={cls}
              style={pos}
            >
              {inner}
            </button>
          )
        })}
      </div>

      {/* Node Detail（DELTA-01：Name + State + EXPLORE，仅此三项）——
          服务于滤镜下未点亮节点；无滤镜时全部节点一步直达，无需详情中段 */}
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
            <a href={primaryHomeOf(sel).href} className="btn-line">
              {primaryHomeOf(sel).label}
            </a>
          </div>
        ) : (
          <span className="text-xs ink-3 tracking-widest">
            {active === null
              ? '点击任一环节，直接进入它的研究本体。'
              : '滤镜之外的环节仍可点击——查看它的当前状态。'}
          </span>
        )}
      </div>
    </div>
  )
}
