import { useEffect, useMemo, useState } from 'react'
import { ESSAYS } from '../data/content'
import type { Essay } from '../data/content'
import { PageHead, Label } from '../components/Bits'

const STREAM_LIMIT = 6
const STATE_KEY = 'tradinglab:essays:view'
const SCROLL_KEY = 'tradinglab:essays:scroll'
const yearOf = (date: string) => date.split('.')[0]

type EssaysView = 'stream' | 'archive'
type EssayReadingState = 'unread' | 'reading' | 'finished'
type ReadingFilter = 'all' | EssayReadingState
type EssaysSort = 'latest' | 'recent'

const READING_FILTERS: { value: ReadingFilter; label: string }[] = [
  { value: 'all', label: '全部' },
  { value: 'unread', label: '未读' },
  { value: 'reading', label: '在读' },
  { value: 'finished', label: '读完' },
]

interface EssayReadingProgress {
  progress: number
  state: EssayReadingState
  updatedAt: number
}

function readEssayProgress() {
  return new Map<string, EssayReadingProgress>(ESSAYS.map((essay) => {
    let progress = 0
    let updatedAt = 0
    try {
      const raw = localStorage.getItem(`tradinglab:essay:progress:${essay.id}`)
      if (raw) {
        const saved = JSON.parse(raw) as { progress?: unknown; updatedAt?: unknown }
        if (typeof saved.progress === 'number' && Number.isFinite(saved.progress)) {
          progress = Math.min(Math.max(saved.progress, 0), 1)
        }
        if (typeof saved.updatedAt === 'number' && Number.isFinite(saved.updatedAt) && saved.updatedAt > 0) {
          updatedAt = saved.updatedAt
        }
      }
    } catch {
      /* 书签缺失或本地存储不可用时，仍按未读展示。 */
    }
    const state: EssayReadingState = progress >= 0.95
      ? 'finished'
      : progress > 0.05 ? 'reading' : 'unread'
    return [essay.id, { progress, state, updatedAt }]
  }))
}

interface EssaysViewState {
  view: EssaysView
  showAll: boolean
  category: string
  openYears: string[]
  readingFilter: ReadingFilter
  sortMode: EssaysSort
}

function readViewState(): EssaysViewState {
  const fallback: EssaysViewState = {
    view: 'stream',
    showAll: false,
    category: '全部',
    openYears: [yearOf(ESSAYS[0].date)],
    readingFilter: 'all',
    sortMode: 'latest',
  }
  try {
    const raw = sessionStorage.getItem(STATE_KEY)
    if (!raw) return fallback
    const saved = JSON.parse(raw) as Partial<EssaysViewState> & { onlyReading?: unknown }
    const category = typeof saved.category === 'string' &&
      (saved.category === '全部' || ESSAYS.some((essay) => essay.category === saved.category))
      ? saved.category
      : '全部'
    const readingFilter = READING_FILTERS.some((filter) => filter.value === saved.readingFilter)
      ? saved.readingFilter as ReadingFilter
      : saved.onlyReading === true ? 'reading' : 'all'
    return {
      view: saved.view === 'archive' ? 'archive' : 'stream',
      showAll: saved.showAll === true,
      category,
      openYears: Array.isArray(saved.openYears)
        ? saved.openYears.filter((year): year is string => typeof year === 'string')
        : fallback.openYears,
      readingFilter,
      sortMode: saved.sortMode === 'recent' ? 'recent' : 'latest',
    }
  } catch {
    return fallback
  }
}

function EssayRow({ essay }: { essay: Essay }) {
  return (
    <a
      href={`#/essays/${essay.id}`}
      className="ink-row group grid md:grid-cols-12 gap-4 md:gap-8 py-10 md:py-14 hairline-b items-baseline"
    >
      <div className="md:col-span-2">
        <span className="label-sm block mb-3">HSN / RESEARCH / {essay.no}</span>
        <span className="font-mono-num tnum text-sm block mb-2">{essay.date}</span>
        <span className="label-sm water">{essay.category}</span>
      </div>
      <div className="md:col-span-7">
        <h3 className="row-zh font-serif-sc font-bold text-2xl md:text-4xl leading-snug tracking-tight mb-3">
          {essay.title}
        </h3>
        <p className="text-sm md:text-base leading-relaxed ink-2">{essay.subtitle}</p>
      </div>
      <div className="md:col-span-3 md:text-right">
        <span className="label-sm block mb-2">阅读约 {essay.readTime} 分钟</span>
      </div>
    </a>
  )
}

function ArchiveIndex({
  category,
  openYears,
  readingProgress,
  readingFilter,
  sortMode,
  setCategory,
  setReadingFilter,
  setSortMode,
  toggleYear,
}: {
  category: string
  openYears: Set<string>
  readingProgress: Map<string, EssayReadingProgress>
  readingFilter: ReadingFilter
  sortMode: EssaysSort
  setCategory: (category: string) => void
  setReadingFilter: (readingFilter: ReadingFilter) => void
  setSortMode: (sortMode: EssaysSort) => void
  toggleYear: (year: string) => void
}) {
  const categories = useMemo(
    () => ['全部', ...Array.from(new Set(ESSAYS.map((essay) => essay.category)))],
    [],
  )
  const categorized = category === '全部'
    ? ESSAYS
    : ESSAYS.filter((essay) => essay.category === category)
  const readingCount = categorized.filter((essay) => readingProgress.get(essay.id)?.state === 'reading').length
  const finishedCount = categorized.filter((essay) => readingProgress.get(essay.id)?.state === 'finished').length
  const filtered = readingFilter === 'all'
    ? categorized
    : categorized.filter((essay) => readingProgress.get(essay.id)?.state === readingFilter)
  const ordered = sortMode === 'recent'
    ? [...filtered].sort((a, b) =>
      (readingProgress.get(b.id)?.updatedAt ?? 0) - (readingProgress.get(a.id)?.updatedAt ?? 0))
    : filtered
  const years = Array.from(new Set(ordered.map((essay) => yearOf(essay.date))))

  return (
    <section className="border-y border-[rgb(var(--line))]" aria-label="文集文库">
      <div className="grid md:grid-cols-12">
        <aside className="md:col-span-3 border-b md:border-b-0 md:border-r border-[rgb(var(--line))]">
          <div className="md:sticky md:top-24 py-7 md:py-9 md:pr-8">
            <Label className="block mb-5">按主题收束 · SUBJECTS</Label>
            <div className="flex md:flex-col flex-wrap gap-x-5 gap-y-3 md:gap-y-0">
              {categories.map((item) => {
                const count = item === '全部'
                  ? ESSAYS.length
                  : ESSAYS.filter((essay) => essay.category === item).length
                const active = category === item
                return (
                  <button
                    key={item}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setCategory(item)}
                    className={`group flex items-baseline justify-between gap-5 text-left md:py-2.5 transition-colors ${
                      active ? 'ink' : 'ink-3 hover:text-[rgb(var(--ink))]'
                    }`}
                  >
                    <span className={`text-sm tracking-wide ${active ? 'underline underline-offset-[0.35em] decoration-[rgb(var(--cinnabar))]' : ''}`}>
                      {item}
                    </span>
                    <span className="font-mono-num tnum text-[11px]">{String(count).padStart(2, '0')}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </aside>

        <div className="md:col-span-9 md:pl-8 lg:pl-12">
          <div className="py-5 md:py-7">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
              <div className="shrink-0">
                <span className="font-serif-sc font-bold text-xl md:text-2xl">{category === '全部' ? '全部文章' : category}</span>
                <span className="label-sm ml-4">{filtered.length} 篇</span>
              </div>
              <span className="label-sm text-right shrink-0" data-reading-summary>
                {readingCount + finishedCount > 0
                  ? `本地阅读 · 在读 ${readingCount} · 读完 ${finishedCount}`
                  : '阅读状态仅保存在本机'}
              </span>
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-x-4">
              <div className="flex flex-wrap gap-x-6" aria-label="按阅读状态筛选">
                {READING_FILTERS.map((filter) => {
                  const active = readingFilter === filter.value
                  return (
                    <button
                      key={filter.value}
                      type="button"
                      data-reading-filter={filter.value}
                      aria-pressed={active}
                      onClick={() => setReadingFilter(filter.value)}
                      className={`min-w-11 min-h-11 inline-flex items-center justify-center border-b text-xs tracking-[0.12em] transition-colors ${
                        active
                          ? 'text-[rgb(var(--cinnabar))] border-[rgb(var(--cinnabar))]'
                          : 'ink-3 border-transparent hover:text-[rgb(var(--ink))]'
                      }`}
                    >
                      {filter.label}
                    </button>
                  )
                })}
              </div>
              <button
                type="button"
                data-sort-mode
                aria-pressed={sortMode === 'recent'}
                aria-label={sortMode === 'recent' ? '切换为最新发布排序' : '切换为最近阅读排序'}
                onClick={() => setSortMode(sortMode === 'recent' ? 'latest' : 'recent')}
                className={`min-h-11 ml-auto inline-flex items-center border-b text-xs tracking-[0.12em] transition-colors ${
                  sortMode === 'recent'
                    ? 'text-[rgb(var(--cinnabar))] border-[rgb(var(--cinnabar))]'
                    : 'ink-3 border-transparent hover:text-[rgb(var(--ink))]'
                }`}
              >
                {sortMode === 'recent' ? '最新发布' : '最近阅读'}
              </button>
            </div>
          </div>

          {filtered.length === 0 && (
            <div data-reading-empty className="hairline-t py-14 md:py-20 text-center">
              <p className="font-serif-sc text-lg md:text-xl mb-5">当前没有符合这一阅读状态的文章。</p>
              <button
                type="button"
                onClick={() => setReadingFilter('all')}
                className="min-h-11 text-sm ink-3 hover:ink underline underline-offset-[0.4em] transition-colors"
              >
                返回全部文章
              </button>
            </div>
          )}

          {years.map((year) => {
            const entries = ordered.filter((essay) => yearOf(essay.date) === year)
            const open = openYears.has(year)
            return (
              <section key={`${category}-${year}`} className="hairline-t">
                <button
                  type="button"
                  aria-expanded={open}
                  aria-controls={`essay-year-${category}-${year}`}
                  onClick={() => toggleYear(year)}
                  className="w-full flex items-baseline justify-between gap-4 py-5 md:py-6 text-left group"
                >
                  <span className="flex items-baseline gap-4">
                    <span className="font-mono-num tnum text-xl md:text-2xl">{year}</span>
                    <span className="label-sm ink-3">{entries.length} 篇 · {open ? '收起' : '展开'}</span>
                  </span>
                  <span aria-hidden="true" className="font-mono-num text-xl font-light ink-3 group-hover:ink transition-colors">
                    {open ? '−' : '＋'}
                  </span>
                </button>

                {open && (
                  <div id={`essay-year-${category}-${year}`} className="pb-5 md:pb-7">
                    {entries.map((essay) => {
                      const reading = readingProgress.get(essay.id) ?? { progress: 0, state: 'unread' as const }
                      const statusLabel = reading.state === 'finished'
                        ? '读完'
                        : reading.state === 'reading' ? `在读 ${Math.round(reading.progress * 100)}%` : '未读'
                      return (
                        <a
                          key={essay.id}
                          href={`#/essays/${essay.id}`}
                          className="group grid grid-cols-[2.5rem_1fr] md:grid-cols-[4rem_1fr_auto] gap-x-3 md:gap-x-6 gap-y-2 py-5 md:py-6 border-t border-[rgb(var(--line))] items-baseline"
                        >
                          <span className="font-mono-num tnum text-xs ink-3">№ {essay.no}</span>
                          <span className="min-w-0">
                            <span className="block font-serif-sc font-bold text-lg md:text-xl leading-snug group-hover:translate-x-1 transition-transform duration-300">
                              {essay.title}
                            </span>
                            <span className="block mt-2 text-xs md:text-sm leading-relaxed ink-3">{essay.subtitle}</span>
                          </span>
                          <span className="col-start-2 md:col-start-auto md:text-right whitespace-nowrap">
                            <span
                              data-reading-state={reading.state}
                              className={`label-sm block mb-2 ${reading.state === 'reading' ? 'text-[rgb(var(--cinnabar))]' : 'ink-3'}`}
                            >
                              {statusLabel}
                            </span>
                            <span className="label-sm water">{essay.date} · {essay.category} →</span>
                          </span>
                        </a>
                      )
                    })}
                  </div>
                )}
              </section>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default function Essays() {
  const [initial] = useState(readViewState)
  const [view, setView] = useState<EssaysView>(initial.view)
  const [showAll, setShowAll] = useState(initial.showAll)
  const [category, setCategory] = useState(initial.category)
  const [openYears, setOpenYears] = useState<Set<string>>(() => new Set(initial.openYears))
  const [readingProgress] = useState(readEssayProgress)
  const [readingFilter, setReadingFilter] = useState<ReadingFilter>(initial.readingFilter)
  const [sortMode, setSortMode] = useState<EssaysSort>(initial.sortMode)
  const remaining = Math.max(ESSAYS.length - STREAM_LIMIT, 0)
  const visible = showAll ? ESSAYS : ESSAYS.slice(0, STREAM_LIMIT)
  const categoryCount = new Set(ESSAYS.map((essay) => essay.category)).size

  const toggleYear = (year: string) => {
    setOpenYears((current) => {
      const next = new Set(current)
      if (next.has(year)) next.delete(year)
      else next.add(year)
      return next
    })
  }

  useEffect(() => {
    try {
      sessionStorage.setItem(STATE_KEY, JSON.stringify({
        view,
        showAll,
        category,
        openYears: Array.from(openYears),
        readingFilter,
        sortMode,
      }))
    } catch {
      /* 隐私模式下存储不可用时，保留当前页面内的交互能力。 */
    }
  }, [view, showAll, category, openYears, readingFilter, sortMode])

  useEffect(() => {
    let savedY = 0
    try {
      savedY = Number(sessionStorage.getItem(SCROLL_KEY) ?? 0)
    } catch {
      savedY = 0
    }

    let secondFrame = 0
    const firstFrame = requestAnimationFrame(() => {
      secondFrame = requestAnimationFrame(() => {
        if (Number.isFinite(savedY) && savedY > 0) {
          window.scrollTo({ top: savedY, behavior: 'instant' as ScrollBehavior })
        }
      })
    })

    const rememberScroll = () => {
      if (window.location.hash !== '#/essays') return
      try {
        sessionStorage.setItem(SCROLL_KEY, String(window.scrollY))
      } catch {
        /* 无法持久化时不阻断阅读。 */
      }
    }
    window.addEventListener('scroll', rememberScroll, { passive: true })
    return () => {
      cancelAnimationFrame(firstFrame)
      cancelAnimationFrame(secondFrame)
      window.removeEventListener('scroll', rememberScroll)
    }
  }, [])

  return (
    <div className="max-w-[1400px] mx-auto px-5 md:px-10">
      <PageHead
        no="04"
        zh="文集"
        en="ESSAYS"
        intro="定期更新的长文：对行业、对交易、对世界的思考。每一篇都是完整的书写，而非碎片的观点。"
      />

      <div className="flex items-end justify-between gap-5 mb-7 md:mb-9">
        <div className="flex items-baseline gap-7 md:gap-10" aria-label="文集呈现方式">
          <button
            type="button"
            aria-pressed={view === 'stream'}
            onClick={() => setView('stream')}
            className={`pb-3 border-b text-sm md:text-base tracking-[0.12em] transition-colors ${
              view === 'stream' ? 'ink border-[rgb(var(--ink))]' : 'ink-3 border-transparent hover:text-[rgb(var(--ink))]'
            }`}
          >
            阅读流
          </button>
          <button
            type="button"
            aria-pressed={view === 'archive'}
            onClick={() => setView('archive')}
            className={`pb-3 border-b text-sm md:text-base tracking-[0.12em] transition-colors ${
              view === 'archive' ? 'ink border-[rgb(var(--ink))]' : 'ink-3 border-transparent hover:text-[rgb(var(--ink))]'
            }`}
          >
            文库
          </button>
        </div>
        <span className="label-sm text-right">{ESSAYS.length} 篇 · {categoryCount} 个主题</span>
      </div>

      {view === 'stream' ? (
        <>
          <div className="border-t border-[rgb(var(--line))]">
            {visible.map((essay) => <EssayRow key={essay.id} essay={essay} />)}
          </div>
          {remaining > 0 && (
            <button
              type="button"
              onClick={() => setShowAll((current) => !current)}
              aria-expanded={showAll}
              className="group w-full flex items-center justify-between gap-4 py-7 md:py-8 hairline-b text-left"
            >
              <span className="label-sm">{showAll ? '收束阅读流' : `续展余下 ${remaining} 篇`}</span>
              <span className="font-serif-sc text-base md:text-lg ink-2 group-hover:ink transition-colors">
                {showAll ? '只留近作 ↑' : '向更早年份阅读 ↓'}
              </span>
            </button>
          )}
        </>
      ) : (
        <ArchiveIndex
          category={category}
          openYears={openYears}
          readingProgress={readingProgress}
          readingFilter={readingFilter}
          sortMode={sortMode}
          setCategory={setCategory}
          setReadingFilter={setReadingFilter}
          setSortMode={setSortMode}
          toggleYear={toggleYear}
        />
      )}

      <div className="py-14 md:py-20 text-center">
        <p className="text-sm ink-3 tracking-widest">新文章不定期发布——写下，即接受检验。</p>
      </div>
    </div>
  )
}
