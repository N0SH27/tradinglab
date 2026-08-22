import { useEffect, useState } from 'react'
import { ESSAYS, SITE } from '../data/content'
import type { EssayBlock } from '../data/content'
import { Label } from '../components/Bits'
import { HSNSeal } from '../components/Brand'
import { BackNav } from '../ink/BackNav'

/* 行文结构渲染：p 段落（首段引子除外，均 2em 缩进）/ h 小节（编号+hairline+锚点）/ quote 引文（朱砂竖线，与落款同源） */
function Block({ block, secNo, anchor }: { block: EssayBlock; secNo: number; anchor?: string }) {
  if (block.type === 'h') {
    return (
      <h2 id={anchor} className="scroll-mt-24 flex items-baseline gap-4 mt-14 md:mt-16 mb-8 pb-4 hairline-b">
        <span className="font-mono-num tnum text-xs ink-3 tracking-[0.2em] shrink-0">
          §{String(secNo).padStart(2, '0')}
        </span>
        <span className="font-serif-sc font-bold text-xl md:text-2xl tracking-tight">{block.text}</span>
      </h2>
    )
  }
  if (block.type === 'quote') {
    return (
      <blockquote className="my-12 md:my-14 border-l-2 border-[rgb(var(--cinnabar))] pl-6 md:pl-8">
        <p className="font-serif-sc font-semibold text-lg md:text-xl leading-[1.9]">{block.text}</p>
      </blockquote>
    )
  }
  return (
    <p className="text-base md:text-[1.05rem] ink-2 leading-[2.1] mb-8 indent-[2em]">{block.text}</p>
  )
}

export default function Essay({ id }: { id: string }) {
  const essay = ESSAYS.find((e) => e.id === id)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const el = document.getElementById('essay-body')
      if (!el) return
      const rect = el.getBoundingClientRect()
      const total = el.offsetHeight - window.innerHeight * 0.6
      const done = Math.min(Math.max(-rect.top + window.innerHeight * 0.4, 0), total)
      setProgress(total > 0 ? done / total : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [id])

  if (!essay) {
    return (
      <div className="max-w-[1400px] mx-auto px-5 md:px-10 pt-40 pb-32 text-center">
        <p className="font-serif-sc text-2xl font-bold mb-6">文章不存在</p>
        <a href="#/essays" className="btn-line">返回文集</a>
      </div>
    )
  }

  /* 小节编号与锚点：从 body 自动生成 */
  let secCount = 0
  const blocks = essay.body.map((b) => (b.type === 'h' ? { b, no: ++secCount, anchor: `sec-${secCount}` } : { b, no: secCount }))
  const toc = blocks.filter((x) => x.b.type === 'h') as { b: EssayBlock & { type: 'h' }; no: number; anchor: string }[]
  const firstP = essay.body.findIndex((b) => b.type === 'p')

  const others = ESSAYS.filter((e) => e.id !== id).slice(0, 2)

  return (
    <div>
      {/* 阅读进度条：紧贴导航栏下方 */}
      <div className="fixed top-14 left-0 right-0 z-40 h-[2px] bg-[rgb(var(--line))]">
        <div
          className="h-full bg-cinnabar transition-[width] duration-75 ease-linear"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      <article className="max-w-[1400px] mx-auto px-5 md:px-10">
        {/* 返回 = 收束：桌面展示，移动端由左缘右滑承担 */}
        <div className="pt-24 md:pt-28 hidden md:block">
          <BackNav to="/essays" label="文集" />
        </div>

        {/* 文章头 */}
        <header className="pt-24 md:pt-12 pb-14 md:pb-20 max-w-3xl">
          <div className="flex items-baseline gap-4 mb-8 flex-wrap">
            <span className="font-mono-num tnum text-sm">{essay.date}</span>
            <Label className="water">{essay.category}</Label>
            <Label>阅读约 {essay.readTime} 分钟</Label>
            <Label className="ml-auto">HSN / RESEARCH / {essay.no}</Label>
          </div>
          <h1 className="font-serif-sc font-black text-3xl md:text-5xl leading-tight tracking-tight mb-6">
            {essay.title}
          </h1>
          <p className="text-base md:text-lg leading-relaxed ink-2">{essay.subtitle}</p>
          <p className="mt-6 label-sm">{SITE.author}</p>

          {/* 锚点目录：两列小字，点击平滑滚动 */}
          {toc.length > 0 && (
            <nav className="mt-12 md:mt-14 border border-[rgb(var(--line))] px-5 md:px-6 py-5" aria-label="文章目录">
              <Label className="block mb-4">本文小节 · CONTENTS</Label>
              <ol className="grid md:grid-cols-2 gap-x-8 gap-y-2.5">
                {toc.map((t) => (
                  <li key={t.anchor}>
                    <a
                      href={`#${t.anchor}`}
                      onClick={(e) => {
                        e.preventDefault()
                        document.getElementById(t.anchor)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                      }}
                      className="group flex items-baseline gap-3 text-sm ink-2 hover:text-[rgb(var(--ink))] transition-colors"
                    >
                      <span className="font-mono-num tnum text-xs ink-3 shrink-0">§{String(t.no).padStart(2, '0')}</span>
                      <span className="tracking-wide group-hover:translate-x-1 transition-transform duration-300">{t.b.text}</span>
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          )}
        </header>

        {/* 正文 */}
        <div id="essay-body" className="hairline-t pt-12 md:pt-16 pb-16 max-w-3xl">
          {blocks.map((x, i) =>
            x.b.type === 'p' && i === firstP ? (
              <p key={i} className="text-lg md:text-xl font-serif-sc font-semibold leading-[2.1] mb-8">{x.b.text}</p>
            ) : (
              <Block key={i} block={x.b} secNo={x.no} anchor={'anchor' in x ? x.anchor : undefined} />
            )
          )}

          {/* 落款：签名盖章 */}
          <div className="mt-14 flex items-center gap-3">
            <span className="inline-block w-6 h-px bg-[rgb(var(--cinnabar))]" />
            <span className="font-mono-num text-sm">{SITE.author}</span>
            <span className="font-mono-num tnum text-xs ink-3">{essay.date}</span>
            <HSNSeal size={26} tone="cinnabar" className="ml-2" />
            <span className="font-mono-num tnum text-[10px] ink-3 tracking-[0.15em]">№ {essay.no}</span>
          </div>

          {/* 相关板块 */}
          <div className="mt-16 border border-[rgb(var(--line))]">
            <div className="px-5 md:px-6 py-4 hairline-b">
              <Label>延伸 · 本站相关板块</Label>
            </div>
            <div className="flex flex-wrap">
              {essay.related.map((r) => (
                <a
                  key={r.path}
                  href={`#${r.path}`}
                  className="px-5 md:px-6 py-4 text-sm tracking-widest hover:bg-ink hover:text-[rgb(var(--paper))] transition-colors border-r border-[rgb(var(--line))] last:border-r-0"
                >
                  {r.label} →
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* 继续阅读 */}
        <div className="hairline-t py-14 md:py-20">
          <Label className="block mb-8">继续阅读</Label>
          <div className="grid md:grid-cols-2 gap-px bg-[rgb(var(--line))] border border-[rgb(var(--line))] max-w-4xl">
            {others.map((o) => (
              <a key={o.id} href={`#/essays/${o.id}`} className="bg-paper p-6 md:p-8 group">
                <span className="font-mono-num tnum text-xs ink-3 block mb-3">{o.date}</span>
                <span className="font-serif-sc font-bold text-xl leading-snug group-hover:opacity-60 transition-opacity block mb-2">
                  {o.title}
                </span>
                <span className="label-sm water">{o.category}</span>
              </a>
            ))}
          </div>
        </div>
      </article>
    </div>
  )
}
