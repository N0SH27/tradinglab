import React from 'react'
import { PageHead } from '../../components/Bits'
import { useRevealRoot } from '../../hooks/useReveal'

/* ── 固定内容报告页渲染器 v2（PRODUCT RE-CENTERING · RC-4 选项 b）────────────
 * 报告 = 作品本身（与 Manifesto 同型的固定内容页），不是数据层条目。
 * v2 可读性裁决（2026-08-31）：双栏杂志式版面（左题右文，沿用 Manifesto 语言）、
 * Executive Summary 四格卡片化、删除锚点目录（hash 路由下无法跳转，且违反极简）。 */

export type Block =
  | { type: 'p'; text: string }
  | { type: 'quote'; text: string }
  | { type: 'h'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'pre'; text: string }
  | { type: 'table'; head: string[]; rows: string[][] }

export interface ReportSection {
  id: string
  title: string
  blocks: Block[]
}

export interface ReportMeta {
  no: string        // e.g. 'REPORT #1'
  title: string
  date: string      // e.g. '2026.08'
  review: string    // e.g. 'PASS · v0.1.1'
  kind?: string     // default 'INDUSTRY'
}

/* 轻量行内标记：**bold** 与 `code`（含 [O:x] / [MAP:x] 等 Evidence Reference 键） */
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
    default:
      return <p className="text-base md:text-lg leading-loose ink-2">{inline(b.text)}</p>
  }
}

/* Executive Summary 四格：把「**标签** 段 + 引用段」配对成 2×2 卡片 */
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
  return (
    <div ref={rootRef} className="max-w-[1400px] mx-auto px-5 md:px-10 pb-24">
      <PageHead
        no={meta.no}
        zh={meta.title}
        en={`${meta.kind ?? 'INDUSTRY'} · ${meta.date} · CANONICAL RESEARCH`}
        intro=""
      />
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 -mt-6 mb-4 hairline-b pb-8" data-reveal>
        <span className="font-mono-num tnum text-xs ink-3 tracking-widest">HSN · TRADINGLABB</span>
        <span className="font-mono-num tnum text-xs ink-3 tracking-widest">HUMAN REVIEW · {meta.review}</span>
      </div>

      {sections.map((s, si) => (
        <section
          key={s.id}
          className={`grid md:grid-cols-12 gap-6 md:gap-10 py-14 md:py-20 ${
            si > 0 ? 'hairline-t' : ''
          }`}
          data-reveal
        >
          <div className="md:col-span-4">
            <span className="font-mono-num tnum text-sm ink-3 block mb-4">
              {String(si).padStart(2, '0')}
            </span>
            <h2 className="font-serif-sc font-bold text-2xl md:text-3xl tracking-tight leading-snug">
              {inline(s.title)}
            </h2>
          </div>
          <div className="md:col-span-8 space-y-7">
            {s.title.startsWith('Executive Summary') ? (
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
