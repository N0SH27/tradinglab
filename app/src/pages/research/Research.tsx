import { PageHead } from '../../components/Bits'
import { useRevealRoot } from '../../hooks/useReveal'

/* ── 研报索引（RC-4 选项 b）：三份固定内容报告页的导航落点 ─────────────
 * 不是 Research Center：无筛选、无分类侧栏、无搜索——内容规模的函数，等 ≥6 份再议。 */

const REPORTS = [
  {
    href: '#/research/report-1',
    no: 'REPORT #1',
    title: '中国 AI 算力基础设施产业链研究',
    meta: 'INDUSTRY · 2026.08 · RESEARCH',
    review: 'PASS WITH REVISION · v1.1.1',
  },
  {
    href: '#/research/report-2',
    no: 'REPORT #2',
    title: '存储周期：价格上涨失效的周期解剖',
    meta: 'INDUSTRY · 2026.08 · RESEARCH',
    review: 'PASS WITH NOTES · v1.1.1',
  },
  {
    href: '#/research/report-3',
    no: 'REPORT #3',
    title: '电力约束：从判断到可跟踪结构',
    meta: 'INDUSTRY · 2026.08 · RESEARCH',
    review: 'PASS · v1.1.1',
  },
]

export default function Research() {
  const rootRef = useRevealRoot<HTMLDivElement>()
  return (
    <div ref={rootRef} className="max-w-[1400px] mx-auto px-5 md:px-10 pb-24">
      <PageHead
        no="01"
        zh="研报"
        en="RESEARCH"
        intro="完整研究作品——对一个行业、一条链条、一个约束，研究出了什么。每份都写着：什么会让我改变。"
      />
      <div>
        {REPORTS.map((r) => (
          <a
            key={r.no}
            href={r.href}
            className="ink-row group grid grid-cols-12 items-baseline gap-3 md:gap-6 py-8 md:py-10 hairline-b first:border-t first:border-[rgb(var(--line))] px-2 md:px-4 -mx-2 md:-mx-4"
            data-reveal
          >
            <span className="col-span-12 md:col-span-2 font-mono-num tnum text-sm ink-3">{r.no}</span>
            <span className="ink-title col-span-12 md:col-span-6 font-serif-sc font-bold text-xl md:text-2xl tracking-tight leading-snug">
              {r.title}
            </span>
            <span className="col-span-8 md:col-span-2 font-mono-num text-xs ink-3 tracking-widest">{r.meta}</span>
            <span className="col-span-4 md:col-span-2 font-mono-num text-xs ink-3 tracking-widest md:text-right">
              {r.review}
            </span>
          </a>
        ))}
      </div>
    </div>
  )
}
