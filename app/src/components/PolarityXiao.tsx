import { useEffect, useState } from 'react'
import { INDUSTRY_MAP, MAP_EDGES, type MapNode } from '../data/domains/map'
import type { PolarityState } from './PolarityInstrument'
import {
  SLICE,
  CHAIN,
  STATE_ZH,
  STATE_COLOR,
  primaryHomeOf,
} from './MapPreview'
import { useIsMobile } from '../hooks/use-mobile'

/* ── PolarityXiao（阴阳 · 洞箫 · SEE 场景右侧 · R1 Representation Correction）──
 * 依据：00_PROJECT/V2_SEE_POLARITY_XIAO_DESIGN.md（R0 定稿）
 *     + 00_PROJECT/V2_SEE_POLARITY_XIAO_REVISION_R1.md（2026-09-06 Human 批准）
 *
 * R1 核心原则：
 *   音孔只表达「这里有一个观察点」，Polarity 才表达「当前正在观察什么」。
 *
 * R1 视觉修正（DEPRECATED VISUAL ENCODING，仅 Representation 层废止）：
 *   · MapNode.size       → 不再编码为孔径（DOT 三档废止，全孔统一 = 管宽 × 0.55）
 *   · MapNode.valuation  → 不再编码为外环（朱砂/深水蓝环在 SEE 切片废止）
 *   · MapNode.state fill → 不再进入音孔几何（无实心/半实/空心之分）
 *   · MapNode.state      → 只经既有 Polarity 滤镜控制点亮(100%) / 退淡(45%)
 *   数据字段全部保留，IndustryMap 等页面不受影响。
 *
 * 不变的契约：
 *   · State ≠ Interaction Permission：点亮孔 = <a> 一步直达 Primary Home；
 *     滤镜下未点亮孔 = <button>，SELECT → REVEAL → EXPLORE。
 *   · 真边校验保留：CHAIN 必须是 MAP_EDGES 的真实边，断裂不画洞箫。
 *   · 箫身静止：无绘制动画 / 漂浮 / 粒子 / 声音 / 缩放 / 旋转。
 *   · 64° 以视觉为准（Desktop / Mobile 均成立），非 CSS 数值。
 *   · 器物验收：隐藏全部标签与交互后，它必须首先被识别为一支洞箫。 */

/* 主轴方向向量（屏幕坐标，y 向下）：右上 = (cos64°, -sin64°) */
const COS64 = 0.4383711467890774
const SIN64 = 0.898794046299167

interface XiaoGeom {
  vbW: number
  vbH: number
  cx: number // 轴心（viewBox 坐标）
  cy: number
  span: number // 首末音孔间距（沿轴）
  mouth: number // 吹口端超出首孔的距离
  tail: number // 尾端超出末孔的距离
  halfW: number // 箫身半宽（名义值）
  hit: number // 音孔热区边长（px，≥44）
}

const GEOM: Record<'desktop' | 'mobile', XiaoGeom> = {
  desktop: { vbW: 1000, vbH: 700, cx: 400, cy: 350, span: 560, mouth: 95, tail: 85, halfW: 16, hit: 56 },
  mobile: { vbW: 700, vbH: 1000, cx: 300, cy: 500, span: 640, mouth: 105, tail: 95, halfW: 19, hit: 48 },
}

/* 真边校验（契约保留）：切片链必须是 MAP_EDGES 的真实边；断裂时不画洞箫 */
const EDGE_OK = CHAIN.every(([a, b]) =>
  MAP_EDGES.some(([x, y]) => (x === a && y === b) || (x === b && y === a)),
)
if (!EDGE_OK && typeof console !== 'undefined') {
  console.error('[PolarityXiao] chain edge missing from MAP_EDGES — Contract violation, no false axis drawn')
}

/** 第 i 个音孔的轴线参数 s（i=0 为最右上 / 产业链源头 gpu；s>0 偏向吹口端） */
function holeS(g: XiaoGeom, i: number): number {
  return g.span / 2 - (i * g.span) / (SLICE.length - 1)
}

/** 第 i 个音孔在 viewBox 中的坐标（供 DOM overlay 定位） */
function holePos(g: XiaoGeom, i: number): { x: number; y: number } {
  const s = holeS(g, i)
  return { x: g.cx + s * COS64, y: g.cy - s * SIN64 }
}

/* ── 箫身 + 音孔（手工内联 SVG）：垂直绘制，绕轴心 rotate(26°) → 视觉主轴 64° ──
 * R1 造型（修订 §F）：微凸曲线管身 · 斜切歌口 · 不对称双线竹节 ×3 · 微张箫尾。
 * 音孔（修订 §E）：统一孔径 = 管宽 × 0.55；纸面填充 + 墨环 + 孔内沿细环（钻孔感）；
 * 孔本身无状态语义，点亮/退淡仅由 opacity 表达。 */
function XiaoBody({ g, litMap }: { g: XiaoGeom; litMap: boolean[] }) {
  const topL = g.span / 2 + g.mouth // 轴心 → 吹口端
  const botL = g.span / 2 + g.tail // 轴心 → 尾端
  const wTop = g.halfW * 0.8
  const wBot = g.halfW * 1.04 // 尾端极轻外张（竹根端）
  const slant = wTop * 0.55 // 歌口斜切高差
  const holeR = g.halfW * 0.6 // 统一孔径（接近真实竹箫的孔管比）

  /* 竹节 3 道——恰好落在第 2/3、4/5、6/7 孔的间隙中点。
     骨节感（Human 微调 2026-09-06 · 参考真实竹箫）：竹节不是画上去的线，
     而是管身轮廓在节处微微凸起（bumpK）+ 截面环弧（一深一浅、节向交替） */
  const joints = [-g.span / 4, g.span / 12, (g.span * 5) / 12]
  const jw = g.halfW * 0.94

  /* 歌口：顶边自左下向右上斜切，凹口开在斜面中段偏左 */
  const topLy = -topL + slant / 2
  const topRy = -topL - slant / 2
  const n1x = -wTop * 0.32
  const n1y = -topL + slant * 0.16
  const n2x = wTop * 0.14
  const n2y = -topL - slant * 0.07
  const ncx = -wTop * 0.08
  const ncy = -topL + slant * 0.85 // 凹口深度（向管身内）

  /* 管身宽度沿轴线性收束（吹口端细 → 尾端略粗） */
  const wAt = (y: number) => wTop + ((y - -topL) / (topL + botL)) * (wBot - wTop)
  /* 侧轮廓：节间微凸（1.10）+ 节处凸起成环（1.28）。管身不填充——
     纸面即底色，纯墨线轮廓更接近白描 */
  const edge = (side: 1 | -1, startY: number): string => {
    let d = `M ${side * wAt(startY)} ${startY}`
    let prevY = startY
    for (const jy of joints) {
      const midY = (prevY + jy - 8) / 2
      d += ` Q ${side * wAt(midY) * 1.1} ${midY} ${side * wAt(jy - 8)} ${jy - 8}`
      d += ` Q ${side * (wAt(jy) * 1.28 + 1)} ${jy} ${side * wAt(jy + 8)} ${jy + 8}`
      prevY = jy + 8
    }
    const midY = (prevY + botL) / 2
    d += ` Q ${side * wAt(midY) * 1.1} ${midY} ${side * wAt(botL)} ${botL}`
    return d
  }
  const strokeMain = {
    fill: 'none',
    stroke: 'rgb(var(--ink))',
    strokeOpacity: 0.9,
    strokeWidth: 2.6,
  } as const

  return (
    <svg
      className="absolute inset-0 w-full h-full"
      viewBox={`0 0 ${g.vbW} ${g.vbH}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <g transform={`translate(${g.cx} ${g.cy}) rotate(26)`}>
        {/* 管身：左右侧轮廓（带竹节凸起）+ 斜切歌口 + 尾切 */}
        <path d={edge(1, topRy)} {...strokeMain} />
        <path d={edge(-1, topLy)} {...strokeMain} />
        <path
          d={`M ${-wTop} ${topLy} L ${n1x} ${n1y} Q ${ncx} ${ncy} ${n2x} ${n2y} L ${wTop} ${topRy}`}
          {...strokeMain}
        />
        <line x1={-wBot} y1={botL} x2={wBot} y2={botL} {...strokeMain} />
        {/* 竹节 3 道：截面环弧，一深一浅不对称双线，节向交替 */}
        {joints.map((jy, k) => {
          const dir = k % 2 === 0 ? -0.2 : 0.15 // 弓形控制点左右交替
          return (
            <g key={jy}>
              <path
                d={`M ${-jw} ${jy} Q ${jw * dir} ${jy + 8} ${jw} ${jy + 1}`}
                fill="none"
                stroke="rgb(var(--ink))"
                strokeOpacity="0.8"
                strokeWidth="2.4"
              />
              <path
                d={`M ${-jw * 0.98} ${jy + 5} Q ${jw * dir} ${jy + 12} ${jw * 0.98} ${jy + 6}`}
                fill="none"
                stroke="rgb(var(--ink))"
                strokeOpacity="0.45"
                strokeWidth="1.1"
              />
            </g>
          )
        })}
        {/* 尾部收束线 */}
        <line
          x1={-wBot * 0.88}
          y1={botL - g.halfW * 0.5}
          x2={wBot * 0.88}
          y2={botL - g.halfW * 0.5}
          stroke="rgb(var(--ink))"
          strokeOpacity="0.55"
          strokeWidth="2"
        />

        {/* 7 个音孔：统一几何，无状态编码；点亮/退淡仅 opacity */}
        {SLICE.map((id, i) => {
          const y = -holeS(g, i) // 局部坐标 y 向下，首孔在负 y
          const lit = litMap[i]
          const cls =
            'transition-opacity duration-300 motion-reduce:transition-none'
          return (
            <g key={id} className={cls} style={{ opacity: lit ? 1 : 0.45 }}>
              <circle
                cx={0}
                cy={y}
                r={holeR}
                fill="rgb(var(--paper))"
                stroke="rgb(var(--ink))"
                strokeWidth="2"
              />
              {/* 孔内沿细环：钻孔深度感（唯一的器物细节） */}
              <circle
                cx={0}
                cy={y}
                r={holeR * 0.62}
                fill="none"
                stroke="rgb(var(--ink-3))"
                strokeWidth="1"
              />
            </g>
          )
        })}
      </g>
    </svg>
  )
}

export function PolarityXiao({
  active,
  className = '',
}: {
  active: PolarityState | null
  className?: string
}) {
  const isMobile = useIsMobile()
  const g = isMobile ? GEOM.mobile : GEOM.desktop
  const [selected, setSelected] = useState<string | null>(null)

  const nodes = SLICE.map((id) => INDUSTRY_MAP.nodes.find((n) => n.id === id)).filter(
    (n): n is MapNode => Boolean(n),
  )
  const sel = nodes.find((n) => n.id === selected) ?? null
  const litMap = nodes.map((n) => active === null || n.state === active)
  const litIdx = Object.fromEntries(nodes.map((n, i) => [n.id, litMap[i]]))

  /* Esc 退出 SELECTED */
  useEffect(() => {
    if (!selected) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelected(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selected])

  /* 契约：真边断裂 → 不画洞箫（宁可空缺，不出现假脉络） */
  if (!EDGE_OK) return null

  return (
    <div className={className}>
      <div
        className="relative w-full"
        style={{ aspectRatio: `${g.vbW} / ${g.vbH}` }}
        role="group"
        aria-label="当前观察的产业环节"
      >
        <XiaoBody g={g} litMap={nodes.map((n) => (litIdx[n.id] || selected === n.id) ?? true)} />

        {nodes.map((n, i) => {
          const p = holePos(g, i)
          const lit = litMap[i]
          const isSel = selected === n.id
          const home = primaryHomeOf(n)
          /* 热区盒：透明、固定边长（≥44px），中心精确落在主轴孔位上；
             标签置于孔右侧（轴的行进方向一侧），随点亮/退淡同步 opacity */
          const cls = `absolute flex items-center justify-center cursor-pointer transition-opacity duration-300 motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-[rgb(var(--cinnabar))] ${
            lit || isSel ? 'opacity-100' : 'opacity-45'
          }`
          const pos = {
            left: `${(p.x / g.vbW) * 100}%`,
            top: `${(p.y / g.vbH) * 100}%`,
            width: g.hit,
            height: g.hit,
            transform: 'translate(-50%, -50%)',
          }
          const label = (
            <span
              aria-hidden={false}
              className="absolute left-1/2 top-1/2 -translate-y-1/2 ml-7 md:ml-9 font-serif-sc font-bold text-sm md:text-lg tracking-tight whitespace-nowrap"
            >
              {n.name}
            </span>
          )

          /* 点亮 = <a> 一步直达 Primary Home（V2-C.1 §12 契约不变）；
             未点亮 = <button>，SELECT → REVEAL → EXPLORE */
          return lit ? (
            <a
              key={n.id}
              href={home.href}
              aria-label={`${n.name}：${STATE_ZH[n.state]}。进入它的研究本体。`}
              className={cls}
              style={pos}
              onClick={() => setSelected(null)}
            >
              {label}
            </a>
          ) : (
            <button
              key={n.id}
              type="button"
              onClick={() => setSelected((cur) => (cur === n.id ? null : n.id))}
              aria-pressed={isSel}
              aria-label={`${n.name}：${STATE_ZH[n.state]}。查看名称与状态。`}
              className={cls}
              style={pos}
            >
              {label}
            </button>
          )
        })}
      </div>

      {/* Topic Reveal（SELECTED）：选题名 + 一句观察（stateNote）+ EXPLORE；
          未选中时 = 唯一说明文案「按下一处音孔，进入它的研究。」 */}
      <div className="hairline-t mt-6 pt-5 min-h-[3.5rem]">
        {sel ? (
          <div className="flex items-baseline justify-between gap-x-6 gap-y-3 flex-wrap">
            <span className="font-serif-sc font-bold text-xl md:text-2xl tracking-tight">
              {sel.name}
            </span>
            <span className="text-sm ink-2 leading-relaxed max-w-md">{sel.stateNote}</span>
            <span className="flex items-baseline gap-5">
              <span
                className="font-mono-num text-xs tracking-[0.2em]"
                style={{ color: STATE_COLOR[sel.state] }}
              >
                {STATE_ZH[sel.state]} · {sel.state.toUpperCase()}
              </span>
              <a href={primaryHomeOf(sel).href} className="btn-line">
                {primaryHomeOf(sel).label}
              </a>
            </span>
          </div>
        ) : (
          <span className="text-xs ink-3 tracking-widest">按下一处音孔，进入它的研究。</span>
        )}
      </div>
    </div>
  )
}
