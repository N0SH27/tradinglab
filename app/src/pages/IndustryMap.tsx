import { useState } from 'react'
import { INDUSTRY_MAP, MAP_EDGES, MAP_ESSAY, MAP_ERA, THESES, type MapNode } from '../data/content'
import { Label, PageHead, PolarityTag } from '../components/Bits'

const NODE_R: Record<number, number> = { 3: 4.6, 2: 3.4, 1: 2.5 }

/* 估值位置 → 描边色调：透支=朱砂，出清=深水蓝，合理=不加外环 */
const VALUATION_RING: Record<MapNode['valuation'], string | null> = {
  stretched: 'rgb(var(--cinnabar))',
  washed: 'rgb(var(--water))',
  fair: null,
}

/* 佩雷斯时代标尺：爆发→狂热→转折点→协同→成熟 */
function EraScale() {
  const W = 100
  const x = 6 + (MAP_ERA.current / (MAP_ERA.stages.length - 1)) * (W - 12)
  return (
    <div className="border border-[rgb(var(--line))] mb-6 px-5 md:px-8 pt-6 pb-7">
      <div className="flex items-baseline justify-between gap-4 mb-6 flex-wrap">
        <Label>{MAP_ERA.title}</Label>
        <span className="text-xs ink-3 tracking-widest">技术革命 × 金融资本</span>
      </div>
      <svg viewBox={`0 -3 ${W} 16`} className="w-full h-auto block select-none overflow-visible" aria-label="时代标尺">
        {/* 基线 */}
        <line x1="6" y1="2" x2={W - 6} y2="2" stroke="rgb(var(--ink))" strokeWidth="0.3" opacity="0.5" />
        {/* 阶段刻度与名称 */}
        {MAP_ERA.stages.map((s, i) => {
          const cx = 6 + (i / (MAP_ERA.stages.length - 1)) * (W - 12)
          const passed = i < MAP_ERA.current
          const isTurn = s === '转折点'
          return (
            <g key={s}>
              <line x1={cx} y1="0.8" x2={cx} y2="3.2" stroke={isTurn ? 'rgb(var(--cinnabar))' : 'rgb(var(--ink))'} strokeWidth={isTurn ? 0.5 : 0.3} opacity={isTurn ? 1 : 0.6} />
              <text
                x={cx} y="9" textAnchor="middle" fontSize="2.9"
                fill={isTurn ? 'rgb(var(--cinnabar))' : passed ? 'rgb(var(--ink))' : 'rgb(var(--ink-3))'}
                fontWeight={isTurn ? 700 : 400}
                style={{ fontFamily: "'Noto Serif SC', serif", letterSpacing: '0.1em' }}
              >
                {s}
              </text>
            </g>
          )
        })}
        {/* 当前位置标记：墨点 */}
        <circle cx={x} cy="2" r="1.1" fill="rgb(var(--ink))" />
        <text x={x} y="-1.6" textAnchor="middle" fontSize="2" fill="rgb(var(--ink-2))" style={{ fontFamily: "'IBM Plex Mono', monospace", letterSpacing: '0.15em' }}>
          NOW
        </text>
      </svg>
      <p className="mt-5 text-sm leading-relaxed ink-2 max-w-3xl">{MAP_ERA.note}</p>
    </div>
  )
}

function NodeShape({ node, isActive, isLinked }: { node: MapNode; isActive: boolean; isLinked: boolean }) {
  const r = NODE_R[node.size]
  const half = node.state === 'turn'
  // 选中光环半径 r+2.2，标签要避开光环
  const labelY = isActive ? r + 5.6 : r + 3.6
  // 标签描边镂空：连线从文字下方穿过时被“挖掉”，如真实地图注记
  const textKnockout = {
    paintOrder: 'stroke',
    stroke: 'rgb(var(--paper))',
    strokeWidth: 1,
    strokeLinejoin: 'round',
  } as const
  return (
    <g transform={`translate(${node.x}, ${node.y})`} style={{ cursor: 'pointer' }}>
      {/* 放大点击热区 */}
      <circle r={r + 3.5} fill="transparent" />
      {/* 估值位置外环：朱砂=透支，深水蓝=出清 */}
      {VALUATION_RING[node.valuation] && (
        <circle r={r + 1.1} fill="none" stroke={VALUATION_RING[node.valuation]!} strokeWidth="0.22" opacity={isActive ? 0 : 0.7} />
      )}
      {/* 选中光环 */}
      {isActive && (
        <circle r={r + 2.2} fill="none" stroke="rgb(var(--cinnabar))" strokeWidth="0.28" strokeDasharray="1.2 0.9" />
      )}
      {/* 悬停墨晕：墨落在纸上，边缘晕开 */}
      <circle
        r={r + 3.2}
        fill="none"
        stroke={node.state === 'yin' ? 'rgb(var(--water))' : 'rgb(var(--ink))'}
        strokeWidth="1.6"
        opacity="0"
        className="map-halo"
        style={{ filter: 'blur(0.7px)', strokeOpacity: 0.28 }}
      />
      {/* 主体 */}
      {half && !isActive ? (
        <>
          <circle r={r} fill="rgb(var(--paper))" stroke="rgb(var(--ink))" strokeWidth={isActive ? 0 : 0.28} />
          <path
            d={`M ${-r} 0 A ${r} ${r} 0 0 1 ${r} 0 Z`}
            fill="rgb(var(--ink))"
          />
        </>
      ) : (
        <circle
          r={r}
          fill={isActive ? 'rgb(var(--cinnabar))' : node.state === 'yang' ? 'rgb(var(--ink))' : 'rgb(var(--paper))'}
          stroke={isActive ? 'rgb(var(--cinnabar))' : node.state === 'yin' ? 'rgb(var(--water))' : 'rgb(var(--ink))'}
          strokeWidth={!isActive && node.state === 'yin' ? 0.4 : 0.28}
          style={{ transition: 'fill 200ms' }}
        />
      )}
      {/* 名称 */}
      <text
        y={labelY}
        textAnchor="middle"
        fontSize={node.size === 3 ? 3.4 : node.size === 2 ? 3 : 2.6}
        fontWeight={node.size === 3 ? 700 : 500}
        fill={isActive ? 'rgb(var(--cinnabar))' : isLinked ? 'rgb(var(--ink))' : 'rgb(var(--ink-2))'}
        style={{ fontFamily: "'Noto Serif SC', serif", letterSpacing: '0.05em', transition: 'fill 200ms', ...textKnockout }}
      >
        {node.name}
      </text>
      <text
        y={labelY + 3.2}
        textAnchor="middle"
        fontSize="1.7"
        fill="rgb(var(--ink-3))"
        style={{ fontFamily: "'IBM Plex Mono', monospace", letterSpacing: '0.12em', ...textKnockout }}
      >
        {node.en.toUpperCase()}
      </text>
    </g>
  )
}

function NodeDetail({ node, linkedNodes }: { node: MapNode; linkedNodes: MapNode[] }) {
  const valuationMeta = {
    stretched: { label: '估值透支', cls: 'ink' },
    fair: { label: '估值合理', cls: 'ink-3' },
    washed: { label: '估值出清', cls: 'water' },
  }[node.valuation]
  return (
    <div key={node.id} className="border border-[rgb(var(--line))] p-6 md:p-10">
      <div className="flex items-baseline justify-between gap-4 mb-2">
        <span className="font-mono-num tnum text-xs ink-3">{node.stage}</span>
        <div className="flex items-center gap-4">
          <span className={`text-xs tracking-widest ${valuationMeta.cls}`}>{valuationMeta.label}</span>
          <PolarityTag polarity={node.state} />
        </div>
      </div>
      <h3 className="font-serif-sc font-bold text-3xl md:text-4xl tracking-tight mb-1">{node.name}</h3>
      <Label className="block mb-8">{node.en}</Label>

      {/* 阶段坐标三件套 */}
      <div className="mb-8 border border-[rgb(var(--line))]">
        <div className="px-4 py-3">
          <Label className="block mb-1">生命周期</Label>
          <p className="text-sm leading-relaxed">{node.penetration}</p>
        </div>
        <div className="px-4 py-3 hairline-t">
          <Label className="block mb-1">当前分析重点</Label>
          <p className="text-sm leading-relaxed ink-2">{node.stageFocus}</p>
        </div>
      </div>

      <div className="mb-8">
        <Label className="block mb-3">阴阳状态</Label>
        <p className="font-serif-sc text-lg md:text-xl font-bold leading-relaxed">{node.stateNote}</p>
      </div>

      <div className="mb-8">
        <Label className="block mb-3">当前观察</Label>
        <p className="text-base leading-loose ink-2">{node.observation}</p>
      </div>

      <div>
        <Label className="block mb-3">关联环节</Label>
        <div className="flex flex-wrap gap-2">
          {linkedNodes.map((l) => (
            <span key={l.id} className="border border-[rgb(var(--line))] px-3 py-1.5 text-xs tracking-widest ink-2">
              {l.name}
            </span>
          ))}
        </div>
      </div>

      {node.theses && node.theses.length > 0 && (
        <div className="mt-8 pt-6 hairline-t">
          <Label className="block mb-3 water">关联命题</Label>
          <div className="space-y-2">
            {node.theses.map((tid) => {
              const t = THESES.find((x) => x.id === tid)
              if (!t) return null
              return (
                <a key={tid} href="#/thesis" className="flex items-baseline justify-between gap-4 group">
                  <span className="text-sm ink-2 group-hover:opacity-70 transition-opacity">
                    {t.no} · {t.title}
                  </span>
                  <span className="font-mono-num tnum text-xs ink-3 shrink-0">{t.probability}%</span>
                </a>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default function IndustryMap() {
  const [activeId, setActiveId] = useState(INDUSTRY_MAP.nodes[0]?.id ?? '')
  const [hoverId, setHoverId] = useState<string | null>(null)
  const active = INDUSTRY_MAP.nodes.find((n) => n.id === activeId) ?? INDUSTRY_MAP.nodes[0]
  if (!active) return null // 地图数据为空时不渲染，不拖垮整站
  const byId = Object.fromEntries(INDUSTRY_MAP.nodes.map((n) => [n.id, n]))

  const focusId = hoverId ?? activeId
  const linkedIds = new Set(
    MAP_EDGES.filter(([a, b]) => a === focusId || b === focusId).flat()
  )
  const linkedNodes = [...linkedIds].map((id) => byId[id]).filter(Boolean)

  return (
    <div className="max-w-[1400px] mx-auto px-5 md:px-10">
      <PageHead no="05" zh="产业地图" en="INDUSTRY MAP" intro={INDUSTRY_MAP.note} />

      <EraScale />

      <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 pb-8">
        {/* ── 地图画布 ── */}
        <div className="lg:col-span-7">
          <div className="border border-[rgb(var(--line))] bg-paper relative">
            <div className="absolute top-4 left-4 md:top-5 md:left-5">
              <Label>{INDUSTRY_MAP.root}</Label>
            </div>
            <div className="absolute top-4 right-4 md:top-5 md:right-5 text-right">
              <Label className="block">上游 ↓ 下游</Label>
            </div>
            <svg
              viewBox="0 0 100 120"
              className="w-full h-auto block select-none"
              onMouseLeave={() => setHoverId(null)}
            >
              {/* 连线 */}
              {MAP_EDGES.map(([a, b]) => {
                const na = byId[a]; const nb = byId[b]
                const isFocus = focusId === a || focusId === b
                const dim = hoverId !== null && !isFocus
                // 裁剪到节点边缘：连线止于圆周，而非圆心
                const dx = nb.x - na.x; const dy = nb.y - na.y
                const len = Math.hypot(dx, dy)
                const ra = NODE_R[na.size] + 0.7; const rb = NODE_R[nb.size] + 0.7
                const x1 = na.x + (dx / len) * ra; const y1 = na.y + (dy / len) * ra
                const x2 = nb.x - (dx / len) * rb; const y2 = nb.y - (dy / len) * rb
                return (
                  <line
                    key={`${a}-${b}`}
                    x1={x1} y1={y1} x2={x2} y2={y2}
                    stroke={isFocus ? 'rgb(var(--cinnabar))' : 'rgb(var(--ink))'}
                    strokeWidth={isFocus ? 0.4 : 0.22}
                    opacity={dim ? 0.15 : isFocus ? 0.9 : 0.35}
                    style={{ transition: 'opacity 200ms, stroke 200ms' }}
                  />
                )
              })}
              {/* 节点（小节点先画，大节点在上层） */}
              {[...INDUSTRY_MAP.nodes]
                .sort((a, b) => a.size - b.size)
                .map((node) => (
                  <g
                    key={node.id}
                    onClick={() => setActiveId(node.id)}
                    onMouseEnter={() => setHoverId(node.id)}
                  >
                    <NodeShape
                      node={node}
                      isActive={node.id === activeId}
                      isLinked={linkedIds.has(node.id) && node.id !== focusId}
                    />
                  </g>
                ))}
            </svg>
          </div>
          {/* 图例 */}
          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs ink-3">
            <span className="inline-flex items-center gap-2">
              <svg width="12" height="12"><circle cx="6" cy="6" r="5" fill="rgb(var(--ink))" /></svg>阳
            </span>
            <span className="inline-flex items-center gap-2">
              <svg width="12" height="12"><circle cx="6" cy="6" r="5" fill="rgb(var(--paper))" stroke="rgb(var(--water))" strokeWidth="1.4" /></svg>阴
            </span>
            <span className="inline-flex items-center gap-2">
              <svg width="12" height="12" viewBox="0 0 12 12">
                <circle cx="6" cy="6" r="5" fill="rgb(var(--paper))" stroke="rgb(var(--ink))" strokeWidth="1" />
                <path d="M 1 6 A 5 5 0 0 1 11 6 Z" fill="rgb(var(--ink))" />
              </svg>转换中
            </span>
            <span className="inline-flex items-center gap-2">
              <svg width="12" height="12"><circle cx="6" cy="6" r="5" fill="rgb(var(--cinnabar))" /></svg>当前选中
            </span>
            <span className="tracking-widest">节点大小 = 产业权重</span>
            <span className="inline-flex items-center gap-2">
              <svg width="12" height="12"><circle cx="6" cy="6" r="4.2" fill="none" stroke="rgb(var(--cinnabar))" strokeWidth="0.8" /></svg>估值透支
            </span>
            <span className="inline-flex items-center gap-2">
              <svg width="12" height="12"><circle cx="6" cy="6" r="4.2" fill="none" stroke="rgb(var(--water))" strokeWidth="0.8" /></svg>估值出清
            </span>
          </div>
        </div>

        {/* ── 详情面板 ── */}
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-24">
            <NodeDetail node={active} linkedNodes={linkedNodes} />
            <a
              href={`#/essays/${MAP_ESSAY}`}
              className="mt-4 flex items-center justify-between border border-[rgb(var(--line))] px-5 md:px-6 py-4 group hover:border-[rgb(var(--water))] transition-colors"
            >
              <div>
                <Label className="block mb-1.5 water">延伸阅读 · 文集</Label>
                <span className="text-sm font-medium">如何写一个产业命题</span>
              </div>
              <span className="water group-hover:translate-x-1 transition-transform">→</span>
            </a>
          </div>
        </div>
      </div>

      {/* 地图使用说明 */}
      <div className="hairline-t py-14 md:py-20 grid md:grid-cols-12 gap-8">
        <div className="md:col-span-3">
          <Label>使用说明 HOW TO READ</Label>
        </div>
        <div className="md:col-span-9 space-y-5 max-w-3xl">
          <p className="text-sm md:text-base leading-loose ink-2">
            这张地图读的不是名单，是位置。每个节点有两个坐标：产业景气（黑实/白空/半实）
            回答「生意好不好」，估值位置（朱砂/深水蓝描边）回答「市场已经为它付了多少钱」。
            两者可以背离——量价齐升的行业，股价可能已经开始不跟。
          </p>
          <p className="text-sm md:text-base leading-loose ink-2">
            节点状态只代表当下坐标。渗透率 15%–20% 进入成长期、35%–40% 步入成熟期；
            成长期看规模与增速，成熟期看格局与估值。每一次坐标修正，都在日志里留下日期与原因。
          </p>
          <p className="font-serif-sc text-base md:text-lg leading-relaxed">
            这个世界没有永恒的赛道，只有永恒的周期思维。
          </p>
        </div>
      </div>
    </div>
  )
}
