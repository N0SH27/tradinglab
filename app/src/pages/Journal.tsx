import { useEffect, useRef, useState } from 'react'
import { JOURNAL, LEDGER, THESES } from '../data/content'
import type { JournalEntry, JournalItem } from '../data/domains/journal'
import { deltaOf, latestChanges } from '../data/ledger'
import { PageHead, Label } from '../components/Bits'
import { Seal, InkFrame, InkDivider } from '../ink/brush'

/* 干支纪日（落款用；锚点 2024-02-10 = 甲辰日校准，JDN+49 取六十甲子序） */
function ganzhiToday(d: Date): string {
  const G = '甲乙丙丁戊己庚辛壬癸',
    Z = '子丑寅卯辰巳午未申酉戌亥'
  const y = d.getFullYear()
  const yr = `${G[(y - 4) % 10]}${Z[(y - 4) % 12]}`
  const jdn = Math.floor(d.getTime() / 86400000 + 2440588)
  const di = (jdn + 49) % 60
  return `${yr}年 ${G[di % 10]}${Z[di % 12]}日`
}

const TYPE_META: Record<string, { mark: string; label: string; red?: boolean }> = {
  up: { mark: '↑', label: '上调概率' },
  down: { mark: '↓', label: '下调概率' },
  risk: { mark: '△', label: '新增风险', red: true },
  new: { mark: '＋', label: '新增记录' },
}

const QN = ['第一季度', '第二季度', '第三季度', '第四季度']
const yearOf = (d: string) => d.split('.')[0]
const quarterOf = (d: string) => Math.ceil(Number(d.split('.')[1]) / 3)

/* 季度档案架分组：年为一层（新年份在上），每层四函 Q1–Q4。
   JOURNAL 源数据新→旧；组内保持新→旧，展卷时 reverse 成时间顺序（最新一面在最右）。 */
interface Rack { year: string; quarters: Map<number, JournalEntry[]> }
const RACKS: Rack[] = (() => {
  const byYear = new Map<string, Map<number, JournalEntry[]>>()
  for (const en of JOURNAL) {
    const y = yearOf(en.date)
    const q = quarterOf(en.date)
    if (!byYear.has(y)) byYear.set(y, new Map())
    const quarters = byYear.get(y)!
    if (!quarters.has(q)) quarters.set(q, [])
    quarters.get(q)!.push(en)
  }
  return [...byYear.entries()]
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([year, quarters]) => ({ year, quarters }))
})()

/* 单条叙事（01 REVISION 不用，02 卷宗折面复用） */
function JournalItems({ items }: { items: JournalItem[] }) {
  return (
    <div className="space-y-8">
      {items.map((item, i) => {
        const meta = TYPE_META[item.type]
        const inner = (
          <>
            <div className="flex items-baseline gap-3 mb-2 flex-wrap">
              <span className="font-serif-sc font-bold text-lg">{item.target}</span>
            </div>
            <p className="text-sm md:text-base leading-relaxed ink-2">{item.note}</p>
          </>
        )
        return (
          <div key={i} className="flex gap-5 md:gap-8 items-start">
            <span
              className={`font-mono-num tnum text-2xl leading-none shrink-0 w-8 ${
                meta.red ? 'ink' : ''
              }`}
            >
              {meta.mark}
            </span>
            {item.thesisId ? (
              <a href={`#/thesis/${item.thesisId}`} className="ink-hv block">{inner}</a>
            ) : (
              <div>{inner}</div>
            )}
          </div>
        )
      })}
    </div>
  )
}

/* 02 叙事流 · 季度档案架（方案七实施）：架 → 函套 → 卷宗浮层（奏折横陈） */
function NarrativeRack() {
  const [open, setOpen] = useState<{ year: string; q: number } | null>(null)
  const [fill, setFill] = useState(100)
  const stripRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const syncFill = (el: HTMLDivElement) => {
    const max = el.scrollWidth - el.clientWidth
    setFill(max > 0 ? 8 + (el.scrollLeft / max) * 92 : 100)
  }

  /* ESC 收卷 + 锁定背景滚动 */
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(null)
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open])

  /* 展卷即见最新：渲染后桌面滚到最右（最新一面）、移动端纵卷落到底；
     滚轮智能接管——折面还能纵向滚动时交给折面（触摸板纵向手势），
     滚到折面尽头后继续滚才转为横向翻折；横向手势原生展卷 */
  useEffect(() => {
    const el = stripRef.current
    if (!el || !open) return
    const raf = requestAnimationFrame(() => {
      if (window.innerWidth <= 720) {
        const sc = scrollRef.current
        if (sc) sc.scrollTop = sc.scrollHeight
      } else {
        el.scrollLeft = el.scrollWidth
      }
      syncFill(el)
    })
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return
      const col = (e.target as HTMLElement).closest?.('.dos-week')
      if (col && col.scrollHeight > col.clientHeight + 1) {
        const atTop = col.scrollTop <= 0 && e.deltaY < 0
        const atBottom =
          col.scrollTop + col.clientHeight >= col.scrollHeight - 1 && e.deltaY > 0
        if (!atTop && !atBottom) return
      }
      e.preventDefault()
      el.scrollLeft += e.deltaY
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => {
      cancelAnimationFrame(raf)
      el.removeEventListener('wheel', onWheel)
    }
  }, [open])

  const openWeeks =
    open && RACKS.find((r) => r.year === open.year)?.quarters.get(open.q)

  return (
    <>
      {RACKS.map((rack) => (
        <div key={rack.year} className="mb-14 last:mb-0">
          <div className="rack-label">
            <span className="yr">{rack.year}</span>
            <span>ARCHIVE RACK · 一层四函</span>
          </div>
          <div className="rack-slots">
            {[1, 2, 3, 4].map((q) => {
              const weeks = rack.quarters.get(q)
              if (!weeks || !weeks.length) {
                return (
                  <button key={q} className="rack-slot" disabled>
                    <span className="q">Q{q}</span>
                    <span className="qn">{QN[q - 1]}</span>
                    <span className="cnt">虚位以待</span>
                    {/* 寒梅含苞：空函不空，留一点生发的余地 */}
                    <img className="slot-plum" src="ink/plum-bud-sm.png" alt="" aria-hidden="true" />
                  </button>
                )
              }
              const marks = { up: 0, down: 0, risk: 0, new: 0 }
              let n = 0
              weeks.forEach((w) =>
                w.items.forEach((it) => {
                  marks[it.type]++
                  n++
                })
              )
              const isOpen = open?.year === rack.year && open.q === q
              return (
                <button
                  key={q}
                  className={isOpen ? 'rack-slot rack-slot-open' : 'rack-slot'}
                  onClick={() => setOpen(isOpen ? null : { year: rack.year, q })}
                >
                  <span className="q">Q{q}</span>
                  <span className="qn">{QN[q - 1]}</span>
                  <span className="cnt">{weeks.length} 周 · {n} 条</span>
                  <span className="marks">
                    <span className="risk">△{marks.risk}</span>
                    　↑{marks.up} ↓{marks.down} ＋{marks.new}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      ))}

      {open && openWeeks && (
        <div className="dos" role="dialog" aria-modal="true">
          <div className="dos-scrim" onClick={() => setOpen(null)} />
          <div className="dos-panel">
            {/* 墨迹边框：4号淡墨飞白残边，展卷时勾框一次即驻留 */}
            <InkFrame seed={Number(open.year) * 4 + open.q} />
            <div className="dos-head">
              <span className="t">
                {open.year} · Q{open.q} 卷宗
                <span className="mono">
                  {QN[open.q - 1]} · {openWeeks.length} WEEKS
                </span>
              </span>
              <span className="flex items-center gap-3">
                {/* 季检朱印：检讫于此 */}
                <Seal text="检" size={26} title="季检之印" />
                <button className="dos-close" onClick={() => setOpen(null)}>
                  收起卷宗 ✕
                </button>
              </span>
            </div>
            <div className="dos-scroll" ref={scrollRef}>
              <div
                className="dos-strip"
                ref={stripRef}
                onScroll={(e) => syncFill(e.currentTarget)}
              >
                {/* 奏折：按时间自左向右铺开，最新一面在最右 */}
                {[...openWeeks].reverse().map((w, i, arr) => (
                  <div className="dos-week" key={w.date}>
                    <div className="dos-date">
                      {w.date}
                      <span className="wk">
                        WEEK {String(i + 1).padStart(2, '0')} / {arr.length}
                      </span>
                    </div>
                    <JournalItems items={w.items} />
                  </div>
                ))}
              </div>
            </div>
            <div className="dos-nav">
              <button
                className="dos-arrow"
                aria-label="向前翻"
                onClick={() =>
                  stripRef.current?.scrollBy({
                    left: -stripRef.current.clientWidth * 0.8,
                    behavior: 'smooth',
                  })
                }
              >
                ←
              </button>
              <div className="dos-track">
                <div className="dos-fill" style={{ width: `${fill}%` }} />
              </div>
              <button
                className="dos-arrow"
                aria-label="向后翻"
                onClick={() =>
                  stripRef.current?.scrollBy({
                    left: stripRef.current.clientWidth * 0.8,
                    behavior: 'smooth',
                  })
                }
              >
                →
              </button>
              <span className="dos-hint">横移如展卷 · 滚轮可用</span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

/* 日志页（V2-06-04 双层结构；V2-C.1 投影规则 · 2026-09-05 Human 裁决 = A；
   02 叙事流 2026-10-21 改为季度档案架：年为一层、每架四函，卷宗浮层奏折横陈，
   Human 批准 demo 实施，页高恒定、周数增长只添函不添长）——
   01 REVISION = WHAT CHANGED MY MIND：展示层只投影「每命题最新一条 delta≠0」
   的真实变化（latestChanges 派生）；confirm（delta=0，如 55→55 校准记录）
   不作为变化展示——底层 Ledger append-only，原始记录零删改。
   02 叙事流 = 既有日期分组日志（narrative record：为什么这样想）。
   Ledger is the factual record. Journal is the narrative record. */
export default function Journal() {
  const changes = latestChanges(LEDGER, LEDGER.length)
  return (
    <div className="max-w-[1400px] mx-auto px-5 md:px-10">
      <PageHead
        no="10"
        zh="日志"
        en="JOURNAL"
        intro="不是日记，而是研究的迭代史。每一次观点的修正都留下日期、方向与原因——沉默地改观点，是研究的死亡。"
      />

      {/* ── 01 REVISION · WHAT CHANGED MY MIND ── */}
      <section className="border-t border-[rgb(var(--line))] py-12 md:py-16">
        <div className="flex items-baseline justify-between mb-10 md:mb-14">
          <Label>反 · REVISION · WHAT CHANGED MY MIND</Label>
        </div>
        <div>
          {changes.map((r) => {
            const delta = deltaOf(r)
            const thesis = THESES.find((t) => t.id === r.thesisId)
            return (
              <a
                key={r.id}
                href={`#/thesis/${r.thesisId}`}
                className="ink-row group grid grid-cols-12 items-baseline gap-3 md:gap-6 py-7 md:py-8 hairline-b px-2 md:px-4 -mx-2 md:-mx-4"
              >
                <span className="col-span-6 md:col-span-2 font-mono-num tnum text-xs ink-3">{r.date}</span>
                <span className="col-span-12 md:col-span-3 font-serif-sc font-bold text-lg md:text-xl tracking-tight order-first md:order-none">
                  {thesis?.title ?? r.thesisId}
                </span>
                <span className="col-span-6 md:col-span-2 font-mono-num tnum text-xl md:text-2xl font-medium md:text-right">
                  {r.previous} → {r.current}
                  <span className={`text-sm ml-2 ${delta > 0 ? 'cinnabar' : delta < 0 ? 'water' : 'ink-3'}`}>
                    {delta > 0 ? '+' : ''}{delta}
                  </span>
                </span>
                <span className="col-span-12 md:col-span-5 text-sm ink-2 leading-relaxed">{r.reason}</span>
              </a>
            )
          })}
        </div>
      </section>

      {/* ── 02 叙事流 · 季度档案架 ── */}
      <section className="py-4 md:py-8">
        <div className="mb-6 md:mb-8 opacity-80">
          <InkDivider variant="light" />
        </div>
        <div className="flex items-baseline justify-between mb-4 md:mb-6">
          <Label>NARRATIVE · 研究叙事</Label>
        </div>
        <NarrativeRack />
      </section>

      <div className="py-16 md:py-24 flex flex-col items-center text-center">
        <p className="font-serif-sc text-xl md:text-2xl font-bold tracking-wide">
          错误的修正记录，比正确的预测更值得展示。
        </p>
        {/* 落款：淡墨短笔 + 干支日期 + 观复小印（作者自题跋） */}
        <div className="mt-10 w-36 opacity-90">
          <InkDivider variant="light" />
        </div>
        <div className="mt-4 flex items-center gap-3">
          <span className="font-serif-sc text-sm tracking-[0.28em] ink-3">
            {ganzhiToday(new Date())} · 观复自题
          </span>
          <Seal text="观复" size={28} title="观复" />
        </div>
      </div>
    </div>
  )
}
