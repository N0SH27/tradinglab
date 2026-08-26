import { SITE, THESES, OBSERVATIONS, LEDGER, INDUSTRY_MAP } from '../data/content'
import { deriveThesisPolarity, formatPolarity } from '../data/polarity'
import { deltaOf, lastRevisedOf, deriveCurrentBelief } from '../data/ledger'
import { Label } from '../components/Bits'
import { HSNSeal, HSNSymbol } from '../components/Brand'
import { PolarityInstrument } from '../components/PolarityInstrument'
import { useRevealRoot } from '../hooks/useReveal'

/* ── V2 Homepage（V2-05 T-6）────────────────────
 * 七章：NOW → POLARITY → HOW I THINK → LIVE THESIS
 *      → WHAT CHANGED MY MIND → WUWEI → END
 * Brand + Orientation + Research Entry Point——不是 Dashboard。
 * 业务数据全部来自 data layer（observations/theses/journal/map），
 * 极性统一经 deriveThesisPolarity 推导；组件内只有固定产品文案。 */

/* 章节标记：沿用 V1 ActMark 视觉（编号 + 注记） */
function ChapterMark({ no, note }: { no: string; note: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 flex-wrap" data-reveal>
      <span className="font-mono-num tnum text-xs cinnabar tracking-[0.2em]">{no}</span>
      <span className="text-xs ink-3 tracking-widest">{note}</span>
    </div>
  )
}

/* Research Loop v1.0（13 号文 LOCKED）：OBSERVE→CONTEXT→FRAME→THESIS→TEST→BELIEVE→REVISE→REFLECT。
   ACT 不进 Research Loop（属 Trading Loop）；WUWEI 是约束层，不是节点。 */
const LOOP_STEPS = [
  { en: 'OBSERVE', zh: '观察' },
  { en: 'CONTEXT', zh: '语境' },
  { en: 'FRAME', zh: '框架' },
  { en: 'THESIS', zh: '命题' },
  { en: 'TEST', zh: '检验' },
  { en: 'BELIEVE', zh: '信念' },
  { en: 'REVISE', zh: '修正' },
  { en: 'REFLECT', zh: '复盘' },
]

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

      {/* ── 01 NOW · What is changing? ── */}
      {OBSERVATIONS.length > 0 && (
        <section className="hairline-t">
          <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-16 md:py-24">
            <ChapterMark no="NOW" note="What is changing?" />
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

      {/* ── 02 POLARITY · Change is not linear ── */}
      <section className="hairline-t">
        <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-16 md:py-24">
          <ChapterMark no="POLARITY" note="YIN / TURN / YANG" />
          <div className="mt-12 md:mt-16 flex flex-col md:flex-row items-center gap-10 md:gap-20" data-reveal>
            <PolarityInstrument state="yang" size={150} interactive showLabel />
            <div className="max-w-xl text-center md:text-left">
              <p className="font-serif-sc text-xl md:text-2xl font-bold leading-relaxed tracking-tight">
                变化，不是线性的。
              </p>
              <p className="mt-3 label-sm">CHANGE IS NOT LINEAR.</p>
              <p className="mt-5 text-sm md:text-base leading-loose ink-2">
                阳是看得见的增长与叙事，阴是看不见的约束与出清——重要的不是预测拐点，而是观察消长。
                Growth contains the conditions of contraction. Contraction creates the conditions of growth.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 03 HOW I THINK · Research Loop ── */}
      <section className="hairline-t">
        <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-16 md:py-24">
          <ChapterMark no="HOW I THINK" note="Research Loop" />
          <div className="mt-12 md:mt-16 grid md:grid-cols-12 gap-10">
            <div className="md:col-span-7" data-reveal>
              <ol className="border border-[rgb(var(--line))]">
                {LOOP_STEPS.map((step, i) => (
                  <li
                    key={step.en}
                    className="flex items-baseline gap-5 px-5 md:px-7 py-4 hairline-b last:border-b-0"
                  >
                    <span className="font-mono-num tnum text-xs ink-3 shrink-0">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="font-mono-num text-sm md:text-base tracking-[0.18em]">{step.en}</span>
                    <span className="font-serif-sc text-sm md:text-base ink-2">{step.zh}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div className="md:col-span-5 flex flex-col justify-between gap-10" data-reveal>
              <div>
                <p className="font-serif-sc text-xl md:text-2xl font-bold leading-relaxed tracking-tight">
                  我不预测未来。
                  <br />
                  现实变化时，我更新信念。
                </p>
                <p className="mt-4 label-sm leading-relaxed">
                  I DON'T PREDICT THE FUTURE. I UPDATE MY BELIEFS AS REALITY CHANGES.
                </p>
              </div>
              <div>
                <a href="#/system" className="btn-line">EXPLORE SYSTEM →</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 04 LIVE THESIS ── */}
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
                  <div className="flex items-center justify-between mb-6">
                    <Label>{t.no}</Label>
                    <span className="ink-dot inline-block w-1.5 h-1.5 rounded-full bg-[rgb(var(--ink-3))]" />
                  </div>
                  <span className="label-sm water block mb-3">{t.industry}</span>
                  <span className="ink-title font-serif-sc font-bold text-xl md:text-2xl leading-snug tracking-tight block mb-6">
                    {t.title}
                  </span>
                  <span className="text-sm ink-2 leading-relaxed block mb-8 line-clamp-3">{t.conflict.but}</span>
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
                    <span className="block mt-5 text-xs tracking-[0.2em] ink-2">READ THESIS →</span>
                  </span>
                </a>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── 05 WHAT CHANGED MY MIND ── */}
      {revisions.length > 0 && (
        <section className="hairline-t">
          <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-16 md:py-24">
            <ChapterMark no="WHAT CHANGED MY MIND" note="Revision, not news" />
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

      {/* ── 06 WUWEI ── */}
      <section className="hairline-t">
        <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-16 md:py-24">
          <ChapterMark no="WUWEI" note="When not to act" />
          <div className="mt-10 md:mt-14 flex flex-col md:flex-row md:items-end justify-between gap-10" data-reveal>
            <div className="max-w-xl">
              <p className="font-serif-sc text-xl md:text-2xl font-bold leading-relaxed tracking-tight">
                有时，正确的仓位是空仓。
              </p>
              <p className="mt-3 label-sm">SOMETIMES THE CORRECT POSITION IS NO POSITION.</p>
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
