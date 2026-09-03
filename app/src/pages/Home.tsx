import { SITE, THESES, OBSERVATIONS, LEDGER, INDUSTRY_MAP } from '../data/content'
import { deriveThesisPolarity, formatPolarity } from '../data/polarity'
import { deltaOf, lastRevisedOf, deriveCurrentBelief } from '../data/ledger'
import { Label } from '../components/Bits'
import { HSNSeal, HSNSymbol } from '../components/Brand'
import { PolarityInstrument } from '../components/PolarityInstrument'
import { ResearchProductCard, type FocusSymbol } from '../components/ResearchProductCard'
import { useRevealRoot } from '../hooks/useReveal'

/* ── V2 Homepage · PRODUCT RE-CENTERING（2026-08-31 裁决）────────────────
 * 章序：FOCUS → LIVE THESIS → WHAT CHANGED MY MIND → RESEARCH → NOW（含
 * POLARITY 读法块）→ WUWEI → END。WHAT 优先，HOW 融进它服务的对象：
 * POLARITY 从独立章节嵌入 NOW 成为事实层的读法框架；Research Loop 退出
 * 首页（Method/System 页保留）。业务数据全部来自 data layer，组件内只有
 * 固定产品文案。
 * ── TASK-003 · Homepage Deduplication & Content Routing（2026-09-01，
 *    V2-29 v1.0 LOCKED）：首页 = Orientation + Preview + Routing，不承担
 *    第二内容库职责——FOCUS 路由 Report 优先（直接回应）/Thesis 兜底；
 *    LIVE THESIS 卡片压缩为纯信念状态；RESEARCH 章 = 1 份 Featured +
 *    ALL RESEARCH；NOW 保持 Observation Language（thesisId 直链保留）。
 *    Semantic Layering Rule：FOCUS=QUESTION / RESEARCH=EVIDENCE /
 *    LIVE THESIS=BELIEF / NOW=OBSERVATION / WHAT CHANGED MY MIND=REVISION。 */

/* 章节标记：沿用 V1 ActMark 视觉（编号 + 注记） */
function ChapterMark({ no, note }: { no: string; note: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 flex-wrap" data-reveal>
      <span className="font-mono-num tnum text-xs cinnabar tracking-[0.2em]">{no}</span>
      <span className="text-xs ink-3 tracking-widest">{note}</span>
    </div>
  )
}

/* FOCUS = HSN 当前研究注意力的声明式视图（V2-28 §4.2），以 ResearchProductCard
   呈现（Presentation Layer 任务 · 2026-08-31）：Default = 识别（符号+名称+类型），
   Hover = 定向（反转显示一句研究问题 + 状态 + 入口）。内容映射既有 Canonical
   Objects（Thesis / Report），零新增数据结构。
   路由纪律（V2-29 §3.3 · TASK-003）：Report 优先——落点 = 直接回应（directly
   addresses）该 Focus 问题的 Research Report；无直接对应 Report 时才兜底 Thesis；
   两者皆无则该 Focus 不上首页。type 标签语义 = 该注意力的当前主载体（OQ-1 实施裁决）。 */
const FOCUS: {
  no: string
  symbol: FocusSymbol
  name: string
  type: string
  q: string
  href: string
}[] = [
  {
    no: '01',
    symbol: 'compute',
    name: '国产算力链',
    type: 'REPORT · 2026.08',
    q: '政策意志与产业能力的剪刀差，如何在出货数据里显形？',
    href: '#/research/report-1',
  },
  {
    no: '02',
    symbol: 'cycle',
    name: '存储周期',
    type: 'REPORT · 2026.08',
    q: '价格与基本面的背离，这一次走到哪里了？',
    href: '#/research/report-2',
  },
  {
    no: '03',
    symbol: 'power',
    name: '电力约束',
    type: 'REPORT · 2026.08',
    q: '这个约束的硬度，用什么尺子量？',
    href: '#/research/report-3',
  },
  {
    no: '04',
    symbol: 'gate',
    name: '商保支付端',
    type: 'REPORT · 2026.09',
    q: '医保之外的钱，从哪条管道流进创新药？',
    href: '#/research/report-4',
  },
]

/* RESEARCH 章（V2-29 §5 · OD-3 / TASK-003 Rule 5）：首页只展示 1 份 Featured
   Research + ALL RESEARCH 出口，不承担 Research Index 职责。Featured 由现有
   Canonical Content 状态中人工选择——本次指定 REPORT #1（Report #0 试点直系、
   三份报告中产业链覆盖最广）；不新增字段 / 数据结构 / 算法逻辑，不建立任何
   Featured 管理机制；更换 Featured = 人工改此引用。 */
const FEATURED = {
  href: '#/research/report-1',
  no: 'REPORT #1',
  title: '中国 AI 算力基础设施产业链研究',
  meta: 'INDUSTRY · 2026.08 · CANONICAL RESEARCH',
}

export default function Home() {
  const rootRef = useRevealRoot<HTMLDivElement>()

  const mapNodes = INDUSTRY_MAP.nodes
  // 首页只呈现 active 命题（closed / invalidated 属 ARCHIVE，V2-06-04）
  const liveTheses = THESES.filter((t) => (t.status ?? 'active') === 'active').slice(0, 3)
  // WHAT CHANGED MY MIND：conviction 修正的唯一事实源 = Belief Ledger（V2-06-02）
  const revisions = LEDGER.slice(0, 3)

  return (
    <div ref={rootRef}>
      {/* ── 封面：HSN + 一句宣言（保留 V1 品牌前门） ── */}
      <section className="max-w-[1400px] mx-auto px-5 md:px-10 pt-32 md:pt-48 pb-20 md:pb-32">
        <h1 className="font-serif-sc font-black leading-[1.08] tracking-tight text-[clamp(2.8rem,9vw,8rem)]">
          观察变化，
          <br />
          而非预测未来<span className="cinnabar">。</span>
        </h1>

        <div className="mt-14 md:mt-20 grid md:grid-cols-12 gap-10 items-end">
          <p className="md:col-span-6 text-base md:text-lg leading-relaxed ink-2">
            {SITE.description.map((line, i) => (
              <span key={i} className="block">{line}</span>
            ))}
          </p>
          <div className="md:col-span-6 flex md:justify-end">
            <HSNSymbol size={110} className="opacity-90" />
          </div>
        </div>

        <div className="mt-16 md:mt-24 hairline-t pt-5">
          <p className="font-serif-sc text-lg md:text-xl tracking-[0.15em]">{SITE.motto}</p>
        </div>
      </section>

      {/* ── 01 FOCUS · 我正在研究什么（ResearchProductCard 网格） ── */}
      <section className="hairline-t">
        <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-16 md:py-24">
          <ChapterMark no="FOCUS" note="观 · What am I researching?" />
          <div className="mt-10 md:mt-14 grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5" data-reveal>
            {FOCUS.map((f) => (
              <ResearchProductCard
                key={f.no}
                symbol={f.symbol}
                name={f.name}
                type={f.type}
                question={f.q}
                href={f.href}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── 02 LIVE THESIS ── */}
      <section className="hairline-t">
        <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-16 md:py-24">
          <ChapterMark no="LIVE THESIS" note="What do I believe?" />
          <div className="mt-10 md:mt-14 grid md:grid-cols-3 gap-px bg-[rgb(var(--line))] border border-[rgb(var(--line))]" data-reveal>
            {liveTheses.map((t) => {
              const polarity = formatPolarity(deriveThesisPolarity(t, mapNodes))
              const lastRevised = lastRevisedOf(LEDGER, t.id, t.revisions[0]?.date ?? t.updated)
              const belief = deriveCurrentBelief(t, LEDGER)
              return (
                <a key={t.id} href={`#/thesis/${t.id}`} className="ink-card group bg-paper p-6 md:p-8 flex flex-col">
                  <div className="mb-6">
                    <Label>{t.no}</Label>
                  </div>
                  {/* 首页卡片 = 纯信念状态面板（V2-29 §5 · OD-4 / TASK-003 Rule 4）：
                      移除 industry 与 conflict.but——「为什么这样判断」归 Thesis Detail，
                      首页只回答「现在这个判断处于什么状态」。theses.ts 数据源零改动。 */}
                  <span className="ink-title font-serif-sc font-bold text-xl md:text-2xl leading-snug tracking-tight block mb-6">
                    {t.title}
                  </span>
                  <span className="mt-auto block hairline-t pt-5">
                    <span className="flex items-baseline gap-1.5 mb-3">
                      <span className="font-mono-num tnum text-4xl md:text-5xl font-medium">{belief}</span>
                      <span className="font-mono-num tnum text-base ink-3">%</span>
                      <span className="label-sm ml-2">CONVICTION</span>
                    </span>
                    <span className="flex flex-wrap gap-x-5 gap-y-1 text-xs ink-3 tracking-widest">
                      {polarity && <span className="font-mono-num">{polarity}</span>}
                      <span className="font-mono-num tnum">{t.window}</span>
                      <span className="font-mono-num tnum">
                        修正 {lastRevised}
                      </span>
                    </span>
                  </span>
                </a>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── 03 WHAT CHANGED MY MIND ── */}
      {revisions.length > 0 && (
        <section className="hairline-t">
          <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-16 md:py-24">
            <ChapterMark no="WHAT CHANGED MY MIND" note="反 · Revision, not news" />
            <div className="mt-10 md:mt-14 max-w-4xl">
              {revisions.map((r) => {
                const delta = deltaOf(r)
                const thesis = THESES.find((t) => t.id === r.thesisId)
                return (
                  <a
                    key={r.id}
                    href={`#/thesis/${r.thesisId}`}
                    className="ink-row group grid grid-cols-12 items-baseline gap-3 md:gap-6 py-7 md:py-9 hairline-b first:border-t first:border-[rgb(var(--line))] px-2 md:px-4 -mx-2 md:-mx-4"
                    data-reveal
                  >
                    <span className="col-span-12 md:col-span-3 font-serif-sc font-bold text-xl md:text-2xl tracking-tight">
                      {thesis?.title ?? r.thesisId}
                    </span>
                    <span className="col-span-6 md:col-span-2 font-mono-num tnum text-2xl md:text-3xl font-medium">
                      {r.previous} → {r.current}
                      <span className={`text-sm ml-2 ${delta > 0 ? 'cinnabar' : delta < 0 ? 'water' : 'ink-3'}`}>
                        {delta > 0 ? '+' : ''}{delta}
                      </span>
                    </span>
                    <span className="col-span-12 md:col-span-5 text-sm ink-2 leading-relaxed">{r.note ?? r.reason}</span>
                    <span className="col-span-6 md:col-span-2 font-mono-num tnum text-xs ink-3 md:text-right">
                      {r.date}
                    </span>
                  </a>
                )
              })}
            </div>
            <div className="mt-10 flex justify-end" data-reveal>
              <a href="#/journal" className="btn-line">READ JOURNAL →</a>
            </div>
          </div>
        </section>
      )}

      {/* ── POLARITY · 节奏间断（完整保留：可点击旋转仪器 + 文字注解） ── */}
      <section className="hairline-t">
        <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-24 md:py-36">
          <ChapterMark no="POLARITY" note="YIN / TURN / YANG" />
          <div className="mt-12 md:mt-16 flex flex-col md:flex-row items-center gap-10 md:gap-20" data-reveal>
            <PolarityInstrument state="yang" size={150} interactive showLabel />
            <div className="max-w-xl text-center md:text-left">
              <p className="font-serif-sc text-xl md:text-2xl font-bold leading-relaxed tracking-tight">
                变化，不是线性的。
              </p>
              <p className="mt-5 text-sm md:text-base leading-loose ink-2">
                阳是看得见的增长与叙事，阴是看不见的约束与出清——重要的不是预测拐点，而是观察消长。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 04 RESEARCH · 完整研究作品（V2-29 OD-3：Featured + ALL RESEARCH） ── */}
      <section className="hairline-t">
        <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-16 md:py-24">
          <ChapterMark no="RESEARCH" note="常 · What did the research produce?" />
          <div className="mt-10 md:mt-14">
            <a
              href={FEATURED.href}
              className="ink-row group grid grid-cols-12 items-baseline gap-3 md:gap-6 py-6 md:py-7 hairline-b border-t border-[rgb(var(--line))] px-2 md:px-4 -mx-2 md:-mx-4"
              data-reveal
            >
              <span className="row-no col-span-4 md:col-span-2 font-mono-num tnum text-sm ink-3">{FEATURED.no}</span>
              <span className="row-zh col-span-8 md:col-span-5 font-serif-sc font-bold text-xl md:text-2xl tracking-tight leading-snug">
                {FEATURED.title}
              </span>
              <span className="col-span-10 col-start-3 md:col-span-5 md:col-start-auto font-mono-num text-xs ink-3 tracking-widest md:text-right">
                {FEATURED.meta}
              </span>
            </a>
          </div>
          <div className="mt-10 flex justify-end" data-reveal>
            <a href="#/research" className="btn-line">ALL RESEARCH →</a>
          </div>
        </div>
      </section>

      {/* ── 05 NOW · 观 ── */}
      {OBSERVATIONS.length > 0 && (
        <section className="hairline-t">
          <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-16 md:py-24">
            <ChapterMark no="NOW" note="观 · What is changing?" />

            <div className="mt-10 md:mt-14">
              {OBSERVATIONS.slice(0, 5).map((o, i) => (
                <a
                  key={o.id}
                  href={o.thesisId ? `#/thesis/${o.thesisId}` : o.mapNodeId ? '#/map' : '#/'}
                  className="ink-row group grid grid-cols-12 items-baseline gap-3 md:gap-6 py-6 md:py-7 hairline-b first:border-t first:border-[rgb(var(--line))] px-2 md:px-4 -mx-2 md:-mx-4"
                  data-reveal
                >
                  <span className="row-no col-span-2 md:col-span-1 font-mono-num tnum text-sm ink-3">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="row-zh col-span-10 md:col-span-3 font-serif-sc font-bold text-xl md:text-2xl tracking-tight">
                    {o.title}
                  </span>
                  <span className="col-span-10 col-start-3 md:col-span-6 md:col-start-auto text-sm ink-2 leading-relaxed">
                    {o.summary}
                  </span>
                  <span className="col-span-10 col-start-3 md:col-span-2 md:col-start-auto font-mono-num tnum text-xs ink-3 md:text-right">
                    {o.date}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 06 WUWEI ── */}
      <section className="hairline-t">
        <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-24 md:py-36">
          <ChapterMark no="WUWEI" note="虚 · When not to act" />
          <div className="mt-10 md:mt-14 flex flex-col md:flex-row md:items-end justify-between gap-10" data-reveal>
            <div className="max-w-xl">
              <p className="font-serif-sc text-xl md:text-2xl font-bold leading-relaxed tracking-tight">
                有时，正确的仓位是空仓。
              </p>
            </div>
            <a href="#/wuwei" className="btn-line shrink-0">EXPLORE WUWEI →</a>
          </div>
        </div>
      </section>

      {/* ── 07 END · 终幕 ── */}
      <section className="bg-ivory -mx-0">
        <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-24 md:py-40 text-center">
          <div className="flex justify-center mb-10 md:mb-14" data-reveal>
            <HSNSeal size={88} tone="cinnabar" />
          </div>
          <p className="font-serif-sc text-2xl md:text-4xl leading-relaxed font-bold tracking-wide" data-reveal>
            反者道之动<span className="mr-[-1em]">，</span>
            <br />
            弱者道之用<span className="cinnabar mr-[-1em]">。</span>
          </p>
          <p className="mt-10 font-mono-num text-sm tracking-[0.3em] pl-[0.3em]" data-reveal>
            HSN · TRADINGLABB
          </p>
        </div>
      </section>
    </div>
  )
}
