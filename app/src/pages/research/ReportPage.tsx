import React, { useEffect } from 'react'
import { PageHead } from '../../components/Bits'
import { useRevealRoot } from '../../hooks/useReveal'

/* ── 固定内容报告页渲染器 v4（READER EXPERIENCE 转译层，2026-09-01 修订）─────────
 * 报告 = 作品本身（与 Manifesto 同型的固定内容页），不是数据层条目。
 * v2：双栏杂志式版面、研究四格卡片化。
 * v3：内部证据键剥离正文、chain / watch / mind 三种原生研究图形。
 * v4：① 删除每章「证据登记」折叠区（裁决：无存在必要，溯源由研究后台承担）；
 *     ② 删除章节标题上方的灰色序号（与标题内编号重复）；
 *     ③ 标题内数字与文字间距加大（约一个空格）；
 *     ④ 版本号切换为跟踪周期制：vX.Y.Z = 第 X 个跟踪年 · 该年第 Y 个月 · 该月第 Z 周
 *        （以开始跟踪日为锚，1 起计；同一周内多次修订共享版本号，以日期区分）。
 * 视觉纪律沿用 02_DESIGN_CONSTITUTION：发丝线 / 墨色 / 朱砂仅作注意语义标记，无图表库。 */

export interface ChainNode {
  label: string
  sub?: string
  tag?: 'throat' | 'next'   // throat = 当前咽喉；next = 下一约束
}

export interface WatchItem {
  name: string   // 变量名（剪刀差 / 火车头 / 咽喉 / 电力 / 偿还者）
  role: string   // 它度量什么
  note?: string  // 它占据的结构位
}

export interface MindItem {
  title: string
  body: string
}

export type Block =
  | { type: 'p'; text: string }
  | { type: 'quote'; text: string }
  | { type: 'h'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'pre'; text: string }
  | { type: 'table'; head: string[]; rows: string[][] }
  | { type: 'chain'; nodes: ChainNode[] }
  | { type: 'watch'; items: WatchItem[] }
  | { type: 'mind'; items: MindItem[] }

export interface ReportSection {
  id: string
  title: string
  blocks: Block[]
  summary?: boolean   // 研究四格
}

export interface ReportMeta {
  no: string        // e.g. 'REPORT #1'
  title: string
  date: string      // e.g. '2026.08'
  review: string    // e.g. 'PASS · v1.1.1'（跟踪周期制版本号）
  kind?: string     // default 'INDUSTRY'
}

/* 轻量行内标记：**bold** 与 `code` */
function inline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g)
  return parts.map((p, i) => {
    if (p.startsWith('**') && p.endsWith('**'))
      return <strong key={i} className="font-bold text-[rgb(var(--ink))]">{p.slice(2, -2)}</strong>
    if (p.startsWith('`') && p.endsWith('`'))
      return <code key={i} className="font-mono-num text-[0.85em] ink-3">{p.slice(1, -1)}</code>
    return <React.Fragment key={i}>{p}</React.Fragment>
  })
}

/* 产业链结构图：观点即图形。咽喉 = 墨框 + 朱砂标记（注意语义）；下一约束 = 深水蓝标记 */
function ChainView({ nodes }: { nodes: ChainNode[] }) {
  return (
    <div className="py-2 max-w-xl">
      {nodes.map((n, i) => (
        <div key={i}>
          <div
            className={`border px-5 py-3.5 ${
              n.tag === 'throat' ? 'border-[rgb(var(--ink))]' : 'border-[rgb(var(--line))]'
            }`}
          >
            <div className="flex items-baseline justify-between gap-3 flex-wrap">
              <span className="font-serif-sc font-bold text-base md:text-lg tracking-tight">
                {n.label}
              </span>
              {n.tag === 'throat' && <span className="label-sm cinnabar">■ 当前咽喉</span>}
              {n.tag === 'next' && <span className="label-sm water">■ 下一约束</span>}
            </div>
            {n.sub && <span className="block text-sm ink-2 mt-1 leading-relaxed">{n.sub}</span>}
          </div>
          {i < nodes.length - 1 && (
            <div className="flex justify-center py-0.5" aria-hidden>
              <span className="ink-3 text-xs leading-none">↓</span>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

/* 跟踪变量卡列：删掉 80% 之后剩下的骨架。gap-px 网格卡片阵（沿用设计宪法 §04/§07） */
function WatchView({ items }: { items: WatchItem[] }) {
  return (
    <div
      className="grid gap-px bg-[rgb(var(--line))] border border-[rgb(var(--line))]"
      style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))' }}
    >
      {items.map((it, i) => (
        <div key={i} className="bg-paper p-5 md:p-6">
          <span className="font-mono-num tnum text-sm ink-3">{String(i + 1).padStart(2, '0')}</span>
          <span className="block font-serif-sc font-bold text-lg md:text-xl tracking-tight mt-3">
            {it.name}
          </span>
          <span className="block text-sm ink-2 mt-2 leading-relaxed">{it.role}</span>
          {it.note && <span className="block text-xs ink-3 mt-3 leading-relaxed">{it.note}</span>}
        </div>
      ))}
    </div>
  )
}

/* WHAT WOULD CHANGE MY MIND：TradingLabb 品牌组件——传统研报收尾是「风险提示」，
 * 这里的收尾是「什么证据会让我承认自己错了」。墨框，朱砂不介入（决断已在正文）。 */
function MindView({ items }: { items: MindItem[] }) {
  return (
    <div className="border border-[rgb(var(--ink))]">
      <div className="px-6 md:px-10 pt-8 pb-6 text-center">
        <span className="font-mono-num text-xs tracking-[0.35em] ink-2">
          WHAT WOULD CHANGE MY MIND
        </span>
      </div>
      <div className="hairline-t" />
      <ol>
        {items.map((m, i) => (
          <li
            key={i}
            className={`grid md:grid-cols-12 gap-2 md:gap-6 px-6 md:px-10 py-6 ${
              i > 0 ? 'hairline-t' : ''
            }`}
          >
            <span className="md:col-span-1 font-mono-num tnum text-sm ink-3">
              {String(i + 1).padStart(2, '0')}
            </span>
            <div className="md:col-span-11">
              <span className="font-serif-sc font-bold text-base md:text-lg tracking-tight block mb-1.5">
                {m.title}
              </span>
              <span className="block text-sm md:text-base leading-loose ink-2">{inline(m.body)}</span>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}

/* 章节标题：数字编号与文字之间加大间距（约一个空格） */
function SectionTitle({ title }: { title: string }) {
  const m = title.match(/^(\d+)\s+(.*)$/)
  if (!m) return <>{inline(title)}</>
  return (
    <>
      <span className="inline-block mr-[0.9em]">{m[1]}</span>
      {inline(m[2])}
    </>
  )
}

function BlockView({ b }: { b: Block }) {
  switch (b.type) {
    case 'h':
      return <h3 className="font-serif-sc font-bold text-xl md:text-2xl tracking-tight pt-6">{inline(b.text)}</h3>
    case 'quote':
      return (
        <blockquote className="border-l-2 border-[rgb(var(--cinnabar))] pl-6 py-1 font-serif-sc text-lg md:text-xl leading-relaxed ink-2">
          {inline(b.text)}
        </blockquote>
      )
    case 'list':
      return (
        <ul className="space-y-3 text-base md:text-lg leading-loose ink-2">
          {b.items.map((it, i) => (
            <li key={i} className="flex gap-3">
              <span className="cinnabar shrink-0">—</span>
              <span>{inline(it)}</span>
            </li>
          ))}
        </ul>
      )
    case 'pre':
      return (
        <pre className="font-mono-num text-sm md:text-base leading-loose ink-2 border border-[rgb(var(--line))] p-6 overflow-x-auto whitespace-pre-wrap">
          {b.text}
        </pre>
      )
    case 'table':
      return (
        <div className="overflow-x-auto py-2">
          <table className="w-full text-sm md:text-base">
            <thead>
              <tr className="hairline-b">
                {b.head.map((h, i) => (
                  <th key={i} className="label-sm text-left py-4 pr-5 font-normal">{inline(h)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {b.rows.map((r, i) => (
                <tr key={i} className="hairline-b">
                  {r.map((c, j) => (
                    <td key={j} className={`py-4 pr-5 align-top leading-relaxed ${j === 0 ? 'font-serif-sc font-bold text-[rgb(var(--ink))]' : 'ink-2'}`}>
                      {inline(c)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    case 'chain':
      return <ChainView nodes={b.nodes} />
    case 'watch':
      return <WatchView items={b.items} />
    case 'mind':
      return <MindView items={b.items} />
    default:
      return <p className="text-base md:text-lg leading-loose ink-2">{inline(b.text)}</p>
  }
}

/* 研究四格：把「**标签** 段 + 引用段」配对成 2×2 卡片 */
function FourGrid({ blocks }: { blocks: Block[] }) {
  const cells: { label: string; body: string }[] = []
  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i]
    if (b.type === 'p' && b.text.startsWith('**') && blocks[i + 1]?.type === 'quote') {
      cells.push({
        label: b.text.replace(/\*\*/g, ''),
        body: (blocks[i + 1] as { type: 'quote'; text: string }).text,
      })
      i++
    }
  }
  if (cells.length < 2) return <>{blocks.map((b, i) => <BlockView key={i} b={b} />)}</>
  const rest = blocks.slice(cells.length * 2)
  return (
    <>
      <div className="grid md:grid-cols-2 gap-px bg-[rgb(var(--line))] border border-[rgb(var(--line))]">
        {cells.map((c, i) => (
          <div key={i} className="bg-paper p-6 md:p-8">
            <span className="label-sm cinnabar block mb-4">{c.label.split('—')[0].trim()}</span>
            <span className="block font-serif-sc font-bold text-base md:text-lg mb-3 tracking-tight">
              {c.label.split('—')[1]?.trim()}
            </span>
            <p className="text-sm md:text-base leading-loose ink-2">{inline(c.body)}</p>
          </div>
        ))}
      </div>
      {rest.map((b, i) => (
        <BlockView key={i} b={b} />
      ))}
    </>
  )
}

export default function ReportPage({
  meta,
  sections,
}: {
  meta: ReportMeta
  sections: ReportSection[]
}) {
  const rootRef = useRevealRoot<HTMLDivElement>()

  /* 锚点定位：#/research/report-N@锚点 → 滚动到对应 section（U-01 / IM-13）。
   * reduced-motion 用户用 auto 瞬时定位，不做平滑滚动。 */
  useEffect(() => {
    const anchor = window.location.hash.split('@')[1]
    if (!anchor) return
    const raf = requestAnimationFrame(() => {
      const el = document.getElementById(anchor)
      if (!el) return
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
    })
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div ref={rootRef} className="max-w-[1400px] mx-auto px-5 md:px-10 pb-24">
      <PageHead
        zh={meta.title}
        en={`${meta.kind ?? 'INDUSTRY'} · ${meta.date} · RESEARCH`}
        intro=""
      />
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 -mt-6 mb-4 hairline-b pb-8" data-reveal>
        <span className="font-mono-num tnum text-xs ink-3 tracking-widest">HSN · TRADINGLABB</span>
        <span className="font-mono-num tnum text-xs ink-3 tracking-widest">最近修订 {meta.date} · {meta.review}</span>
      </div>

      {sections.map((s, si) => (
        <section
          key={s.id}
          id={s.id}
          className={`grid md:grid-cols-12 gap-6 md:gap-10 py-14 md:py-20 ${
            si > 0 ? 'hairline-t' : ''
          }`}
          data-reveal
        >
          <div className="md:col-span-4">
            <h2 className="font-serif-sc font-bold text-2xl md:text-3xl tracking-tight leading-snug">
              <SectionTitle title={s.title} />
            </h2>
          </div>
          <div className="md:col-span-8 space-y-7">
            {s.summary ? (
              <FourGrid blocks={s.blocks} />
            ) : (
              s.blocks.map((b, i) => <BlockView key={i} b={b} />)
            )}
          </div>
        </section>
      ))}

      <div className="hairline-t pt-10 flex justify-between items-center flex-wrap gap-4">
        <a href="#/research" className="btn-line">← ALL RESEARCH</a>
        <span className="font-mono-num text-xs ink-3 tracking-[0.3em]">HSN · TRADINGLABB</span>
      </div>
    </div>
  )
}
