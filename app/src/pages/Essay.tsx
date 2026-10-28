import { useEffect, useState } from 'react'
import { ESSAYS, SITE } from '../data/content'
import type { EssayBlock } from '../data/content'
import { Label } from '../components/Bits'
import { HSNSeal } from '../components/Brand'
import { BackNav } from '../ink/BackNav'

type EssayFormat = 'sectioned' | 'open' | 'continuous'
type EssayLead = 'assertive' | 'narrative' | 'plain' | 'prologue'
type EssayEnding = 'maxim' | 'coda' | 'colophon' | 'quiet'

interface EssayPresentation {
  format: EssayFormat
  lead: EssayLead
  ending: EssayEnding
}

/* 每篇明确记录进入与收束方式；变化服务于文章语气，而非随机换皮。
   新文章默认开放叙事，只有真正需要检索的研究长文才使用编号目录。 */
const ESSAY_PRESENTATION: Record<string, EssayPresentation> = {
  'params-not-better': { format: 'sectioned', lead: 'assertive', ending: 'maxim' },
  'brick-to-gold': { format: 'open', lead: 'narrative', ending: 'coda' },
  'super-signal': { format: 'sectioned', lead: 'narrative', ending: 'colophon' },
  'only-two-things': { format: 'continuous', lead: 'plain', ending: 'coda' },
  'price-as-consensus': { format: 'open', lead: 'plain', ending: 'maxim' },
  'casino-boss': { format: 'open', lead: 'assertive', ending: 'colophon' },
  'thesis-writing-os': { format: 'sectioned', lead: 'assertive', ending: 'maxim' },
  'art-of-not-trading': { format: 'continuous', lead: 'plain', ending: 'quiet' },
  'water-as-teacher': { format: 'continuous', lead: 'prologue', ending: 'colophon' },
}

const DEFAULT_PRESENTATION: EssayPresentation = {
  format: 'open',
  lead: 'narrative',
  ending: 'maxim',
}

const LEAD_CLASS: Record<EssayLead, string> = {
  assertive: 'font-semibold text-lg md:text-xl leading-[2.1] mb-8',
  narrative: 'font-normal text-lg md:text-xl leading-[2.15] mb-10',
  plain: 'font-normal text-[1.05rem] md:text-lg leading-[2.15] mb-10',
  prologue: 'font-normal text-lg md:text-xl leading-[2] tracking-[0.06em] text-center mb-12',
}

const progressKey = (id: string) => `tradinglab:essay:progress:${id}`

function readProgress(id: string): number | null {
  try {
    const raw = localStorage.getItem(progressKey(id))
    if (!raw) return null
    const saved = JSON.parse(raw) as { progress?: unknown }
    if (typeof saved.progress !== 'number' || !Number.isFinite(saved.progress)) return null
    return Math.min(Math.max(saved.progress, 0), 1)
  } catch {
    return null
  }
}

function Block({
  block,
  secNo,
  anchor,
  format,
  ending,
  isOpening,
  isFinal,
}: {
  block: EssayBlock
  secNo: number
  anchor?: string
  format: EssayFormat
  ending: EssayEnding
  isOpening: boolean
  isFinal: boolean
}) {
  if (block.type === 'h') {
    if (format === 'continuous') return null
    if (format === 'open') {
      return (
        <h2 id={anchor} className="scroll-mt-24 flex items-center gap-4 mt-14 md:mt-20 mb-7">
          <span aria-hidden="true" className="w-5 h-px bg-[rgb(var(--cinnabar))] shrink-0" />
          <span className="font-serif-sc font-bold text-xl md:text-2xl tracking-tight">{block.text}</span>
        </h2>
      )
    }
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
    if (isOpening) {
      return (
        <blockquote className="mb-12 md:mb-16 text-center" data-ending="epigraph">
          <p className="font-serif-sc text-base md:text-lg ink-2 leading-[2]">{block.text}</p>
        </blockquote>
      )
    }
    if (ending === 'coda') {
      return (
        <blockquote className="my-14 md:my-20 pt-10 hairline-t text-center" data-ending="coda">
          <p className="font-serif-sc font-semibold text-lg md:text-xl leading-[2]">{block.text}</p>
        </blockquote>
      )
    }
    if (ending === 'colophon') {
      return (
        <blockquote className="my-14 md:my-16 pt-8 hairline-t" data-ending="colophon">
          <p className="font-serif-sc font-normal text-base md:text-lg ink-2 leading-[2.1]">{block.text}</p>
        </blockquote>
      )
    }
    return (
      <blockquote className="my-12 md:my-14 border-l-2 border-[rgb(var(--cinnabar))] pl-6 md:pl-8" data-ending="maxim">
        <p className="font-serif-sc font-semibold text-lg md:text-xl leading-[1.9]">{block.text}</p>
      </blockquote>
    )
  }
  return (
    <p className={`ink-2 mb-8 indent-[2em] ${
      format === 'continuous'
        ? 'font-serif-sc text-[1.05rem] md:text-[1.125rem] leading-[2.2] md:mb-9'
        : 'text-base md:text-[1.05rem] leading-[2.1]'
    } ${isFinal && ending === 'quiet' ? 'mt-12 pt-10 hairline-t' : ''}`}>{block.text}</p>
  )
}

export default function Essay({ id }: { id: string }) {
  const essay = ESSAYS.find((e) => e.id === id)
  const [progress, setProgress] = useState(0)
  const [resumePoint, setResumePoint] = useState<number | null>(() => readProgress(id))
  useEffect(() => {
    let latestProgress = 0
    let lastSaved = 0
    let initialScroll = true
    let hasUserScrolled = false

    const saveProgress = () => {
      try {
        localStorage.setItem(progressKey(id), JSON.stringify({
          progress: latestProgress,
          updatedAt: Date.now(),
        }))
      } catch {
        /* 本地存储不可用时，只保留当前页内的进度条。 */
      }
    }

    const onScroll = () => {
      if (window.location.hash !== `#/essays/${id}`) return
      const el = document.getElementById('essay-body')
      if (!el) return
      const rect = el.getBoundingClientRect()
      const total = el.offsetHeight - window.innerHeight * 0.6
      const done = Math.min(Math.max(-rect.top + window.innerHeight * 0.4, 0), total)
      const next = total > 0 ? done / total : 0
      latestProgress = next
      setProgress(next)

      /* 初次渲染只读取书签，不用顶部的 0% 覆盖旧进度。 */
      if (initialScroll) {
        initialScroll = false
        return
      }
      hasUserScrolled = true
      setResumePoint(null)

      const now = Date.now()
      if (now - lastSaved >= 150) {
        lastSaved = now
        saveProgress()
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (hasUserScrolled) saveProgress()
    }
  }, [id])

  const resumeReading = () => {
    const el = document.getElementById('essay-body')
    if (!el || resumePoint === null) return
    const bodyTop = window.scrollY + el.getBoundingClientRect().top
    const total = Math.max(el.offsetHeight - window.innerHeight * 0.6, 1)
    const target = bodyTop - window.innerHeight * 0.4 + resumePoint * total
    setResumePoint(null)
    window.scrollTo({ top: Math.max(target, 0), behavior: 'instant' as ScrollBehavior })
  }

  const restartReading = () => {
    try {
      localStorage.removeItem(progressKey(id))
    } catch {
      /* 无法修改存储时，仍允许从文章开头阅读。 */
    }
    setResumePoint(null)
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }

  if (!essay) {
    return (
      <div className="max-w-[1400px] mx-auto px-5 md:px-10 pt-40 pb-32 text-center">
        <p className="font-serif-sc text-2xl font-bold mb-6">文章不存在</p>
        <a href="#/essays" className="btn-line">返回文集</a>
      </div>
    )
  }

  const { format, lead, ending } = ESSAY_PRESENTATION[id] ?? DEFAULT_PRESENTATION

  /* 小节编号与锚点仍从原始内容生成；只有研究拆解型文章展示目录。 */
  let secCount = 0
  const blocks = essay.body.map((b) => (b.type === 'h' ? { b, no: ++secCount, anchor: `sec-${secCount}` } : { b, no: secCount }))
  const toc = format === 'sectioned'
    ? blocks.filter((x) => x.b.type === 'h') as { b: EssayBlock & { type: 'h' }; no: number; anchor: string }[]
    : []
  const firstP = essay.body.findIndex((b) => b.type === 'p')

  /* 继续阅读 = 同主题近邻 + 编号近邻；单一主题栏目则自然退化为两篇编号近作。 */
  const distanceFromCurrent = (candidate: (typeof ESSAYS)[number]) =>
    Math.abs(Number(candidate.no) - Number(essay.no))
  const sameTheme = ESSAYS
    .filter((candidate) => candidate.id !== id && candidate.category === essay.category)
    .sort((a, b) => distanceFromCurrent(a) - distanceFromCurrent(b))[0]
  const others = [
    ...(sameTheme ? [sameTheme] : []),
    ...ESSAYS
      .filter((candidate) => candidate.id !== id && candidate.id !== sameTheme?.id)
      .sort((a, b) => distanceFromCurrent(a) - distanceFromCurrent(b)),
  ].slice(0, 2)

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
        <header className={`pt-24 md:pt-12 max-w-3xl ${format === 'continuous' ? 'pb-10 md:pb-14' : 'pb-14 md:pb-20'}`}>
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

          {resumePoint !== null && resumePoint > 0.05 && resumePoint < 0.95 && (
            <div data-resume-prompt className="mt-8 flex items-center justify-between gap-4 py-4 hairline-t hairline-b">
              <span className="label-sm">上次读到 {Math.round(resumePoint * 100)}%</span>
              <span className="flex items-baseline gap-5">
                <button
                  type="button"
                  data-resume-reading
                  onClick={resumeReading}
                  className="text-sm ink-2 hover:ink transition-colors"
                  aria-label={`从上次 ${Math.round(resumePoint * 100)}% 的位置续读`}
                >
                  续读 →
                </button>
                <button
                  type="button"
                  data-restart-reading
                  onClick={restartReading}
                  className="text-xs ink-3 hover:ink transition-colors"
                >
                  从头
                </button>
              </span>
            </div>
          )}

          {/* 目录只服务于真正需要检索的研究拆解型长文。 */}
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
        <div id="essay-body" className={`hairline-t pt-12 md:pt-16 pb-16 ${format === 'continuous' ? 'max-w-[42rem]' : 'max-w-3xl'}`}>
          {blocks.map((x, i) =>
            x.b.type === 'p' && i === firstP ? (
              <p key={i} data-lead={lead} className={`font-serif-sc ${LEAD_CLASS[lead]}`}>{x.b.text}</p>
            ) : (
              <Block
                key={i}
                block={x.b}
                secNo={x.no}
                anchor={'anchor' in x ? x.anchor : undefined}
                format={format}
                ending={ending}
                isOpening={i === 0}
                isFinal={i === blocks.length - 1}
              />
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
