import { SITE, THESES, ACTS, CYCLE_STAGES, CYCLE_INDUSTRIES, INDEX_ITEMS } from '../data/content'
import { Label, SectionHead } from '../components/Bits'
import { HSNSeal, HSNSymbol } from '../components/Brand'
import { useRevealRoot } from '../hooks/useReveal'

/* 幕次标记：电影式章节 */
function ActMark({ act }: { act: { no: string; en: string; note: string } }) {
  return (
    <div className="flex items-baseline justify-between gap-4 flex-wrap" data-reveal>
      <span className="font-mono-num tnum text-xs cinnabar tracking-[0.2em]">{act.no}</span>
      <span className="text-xs ink-3 tracking-widest">{act.note}</span>
    </div>
  )
}

export default function Home() {
  const featured = THESES[0]
  if (!featured) return null // 命题库为空时不渲染，不拖垮整站
  const rootRef = useRevealRoot<HTMLDivElement>()
  return (
    <div ref={rootRef}>
      {/* ── 封面：HSN + 一句宣言 ─────────────── */}
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

      {/* ── 第一幕 NOW：当下的两句真话 ────────── */}
      <section className="hairline-t">
        <div className="max-w-[1400px] mx-auto px-5 md:px-10 pt-10 md:pt-14">
          <ActMark act={ACTS.now} />
        </div>
        <div className="max-w-[1400px] mx-auto grid md:grid-cols-2 mt-8 md:mt-12 hairline-t">
          <div className="px-5 md:px-10 py-16 md:py-24 md:border-r border-[rgb(var(--line))]" data-reveal>
            <Label className="block mb-6">阳 · 所求</Label>
            <p className="font-serif-sc font-black text-3xl md:text-5xl leading-snug tracking-tight">
              放弃赚每一分钱时，就赢了
            </p>
          </div>
          <div className="px-5 md:px-10 py-16 md:py-24 hairline-t md:border-t-0" data-reveal>
            <Label className="block mb-6 water">阴 · 所控</Label>
            <p className="font-serif-sc font-black text-3xl md:text-5xl leading-snug tracking-tight ink-2">
              交易除了风险，都控制不了
            </p>
          </div>
        </div>
      </section>

      {/* ── 第二幕 WHY：阅读的镜头 ───────────── */}
      <section className="hairline-t">
        <div className="max-w-[1400px] mx-auto px-5 md:px-10 pt-10 md:pt-14">
          <ActMark act={ACTS.why} />
        </div>
        <div className="max-w-[1400px] mx-auto grid md:grid-cols-2 mt-8 md:mt-12 hairline-t">
          <div className="px-5 md:px-10 py-14 md:py-20 md:border-r border-[rgb(var(--line))]" data-reveal>
            <div className="flex items-center gap-3 mb-6">
              <span className="inline-block w-3 h-3 bg-ink" />
              <span className="font-serif-sc text-2xl font-bold">阳</span>
              <Label>YANG</Label>
            </div>
            <p className="text-sm md:text-base leading-loose ink-2">
              增长、创新、突破、扩张、资本投入。阳是看得见的方向，是叙事最容易附着的部分——也是多数人唯一看见的部分。
            </p>
          </div>
          <div className="px-5 md:px-10 py-14 md:py-20 hairline-t md:border-t-0" data-reveal>
            <div className="flex items-center gap-3 mb-6 water">
              <span className="inline-block w-3 h-3 border border-current" />
              <span className="font-serif-sc text-2xl font-bold">阴</span>
              <Label>YIN</Label>
            </div>
            <p className="text-sm md:text-base leading-loose ink-2">
              周期、风险、出清、估值、监管、不确定性。阴是看不见的约束，是决定阳能走多远的部分。弱者道之用——阴的力量，往往在事后才被承认。
            </p>
          </div>
        </div>
      </section>

      {/* ── 第三幕 SYSTEM：当前大命题 ─────────── */}
      <section className="max-w-[1400px] mx-auto px-5 md:px-10 py-20 md:py-32">
        <div className="mb-10 md:mb-14">
          <ActMark act={ACTS.system} />
        </div>
        <SectionHead no="◆" zh="当前大命题" en="FEATURED THESIS" note={`更新于 ${featured.updated}`} />

        <a href="#/thesis" className="group block" data-reveal>
          <div className="grid md:grid-cols-12 gap-8">
            <div className="md:col-span-8">
              <Label className="block mb-5">{featured.no} · {featured.industry}</Label>
              <h3 className="font-serif-sc font-bold text-3xl md:text-5xl leading-snug tracking-tight group-hover:opacity-70 transition-opacity">
                {featured.title}
              </h3>
            </div>
            <div className="md:col-span-4 flex flex-col justify-end">
              <div className="hairline-t pt-4">
                <Label className="block mb-2">主观概率</Label>
                <div className="flex items-baseline gap-2">
                  <span className="font-mono-num tnum text-5xl md:text-6xl font-medium">{featured.probability}</span>
                  <span className="font-mono-num tnum text-xl ink-3">%</span>
                  <span className="text-xs ink-3 tracking-widest ml-2">{featured.probabilityNote}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 grid md:grid-cols-2 gap-px bg-[rgb(var(--line))] border border-[rgb(var(--line))]">
            <div className="bg-paper p-6 md:p-10">
              <Label className="block mb-4">虽然</Label>
              <p className="text-base md:text-lg leading-relaxed ink-2">{featured.conflict.although}</p>
            </div>
            <div className="bg-paper p-6 md:p-10">
              <Label className="block mb-4 ink">但是</Label>
              <p className="text-base md:text-lg leading-relaxed">{featured.conflict.but}</p>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <span className="btn-line">阅读完整命题 →</span>
          </div>
        </a>
      </section>

      {/* ── 第四幕 CAPITAL：资本的刻度 ────────── */}
      <section className="hairline-t">
        <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-16 md:py-24">
          <ActMark act={ACTS.capital} />
          <p className="mt-6 mb-12 md:mb-16 max-w-2xl text-sm md:text-base leading-loose ink-2" data-reveal>
            不用涨跌表达判断，用概率表达信念。以下刻度随证据修正——每一次变动，都在日志里留有日期与原因。
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-[rgb(var(--line))] border border-[rgb(var(--line))]" data-reveal>
            {THESES.map((t) => (
              <a
                key={t.id}
                href="#/thesis"
                className="ink-card group bg-paper p-6 md:p-8"
              >
                <div className="flex items-center justify-between mb-6">
                  <Label className="block">{t.no}</Label>
                  <span className="ink-dot inline-block w-1.5 h-1.5 rounded-full bg-[rgb(var(--ink-3))]" />
                </div>
                <div className="flex items-baseline gap-1.5 mb-4">
                  <span className="font-mono-num tnum text-4xl md:text-5xl font-medium">{t.probability}</span>
                  <span className="font-mono-num tnum text-base ink-3">%</span>
                </div>
                <p className="ink-title font-serif-sc font-bold text-base md:text-lg leading-snug mb-3">{t.industry}</p>
                <p className="text-xs tracking-widest ink-3">{t.probabilityNote}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── 第五幕 NEXT：周期的位置 ───────────── */}
      <section className="hairline-t">
        <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-16 md:py-24">
          <ActMark act={ACTS.next} />
          <p className="mt-6 mb-12 md:mb-16 max-w-2xl text-sm md:text-base leading-loose ink-2" data-reveal>
            增长 → 狂热 → 分化 → 出清 → 重构 → 新周期。重要的不是预测拐点，而是知道自己站在圆环的哪一段。
          </p>
          <div className="overflow-x-auto" data-reveal>
            <div className="grid grid-cols-7 gap-px bg-[rgb(var(--line))] border border-[rgb(var(--line))] min-w-[720px]">
              {CYCLE_STAGES.map((stage) => {
                const here = CYCLE_INDUSTRIES.filter((c) => c.stage === stage)
                return (
                  <div key={stage} className="bg-paper p-4 md:p-5 min-h-[180px] flex flex-col">
                    <span className="font-serif-sc font-bold text-base md:text-lg mb-4 block">{stage}</span>
                    <div className="space-y-3 mt-auto">
                      {here.map((c) => (
                        <div key={c.name}>
                          <span className="text-xs font-medium tracking-wider block">{c.name}</span>
                          <span className="text-[11px] leading-snug ink-3 block mt-0.5">{c.note}</span>
                        </div>
                      ))}
                      {here.length === 0 && <span className="text-[11px] ink-3 block">— 空 —</span>}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          <div className="mt-8 flex justify-end" data-reveal>
            <a href="#/cycle" className="btn-line">进入周期页 →</a>
          </div>
        </div>
      </section>

      {/* ── 目录 ─────────────────────────── */}
      <section className="max-w-[1400px] mx-auto px-5 md:px-10 pb-8 md:pb-16">
        <SectionHead no="§" zh="目录" en="CONTENTS" note="本站的全部结构" />
        <div>
          {INDEX_ITEMS.map((item) => (
            <a
              key={item.path}
              href={`#${item.path}`}
              className="ink-row group grid grid-cols-12 items-baseline gap-3 md:gap-6 py-6 md:py-8 hairline-b first:border-t first:border-[rgb(var(--line))] px-2 md:px-4 -mx-2 md:-mx-4"
            >
              <span className="row-no col-span-2 md:col-span-1 font-mono-num tnum text-sm ink-3">{item.no}</span>
              <span className="row-zh col-span-5 md:col-span-3 font-serif-sc font-bold text-2xl md:text-4xl tracking-tight">{item.zh}</span>
              <span className="col-span-5 md:col-span-2 label-sm">{item.en}</span>
              <span className="col-span-12 md:col-span-6 text-sm ink-3 leading-relaxed">{item.desc}</span>
            </a>
          ))}
        </div>
      </section>

      {/* ── 终幕：回到 HSN ───────────────────── */}
      <section className="bg-ivory -mx-0">
        <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-24 md:py-40 text-center">
          <div className="flex justify-center mb-10 md:mb-14" data-reveal>
            <HSNSeal size={88} tone="cinnabar" />
          </div>
          <p className="font-serif-sc text-2xl md:text-4xl leading-relaxed font-bold tracking-wide" data-reveal>
            反者道之动，弱者道之用<span className="cinnabar">。</span>
          </p>
          <p className="mt-6 text-sm ink-3 tracking-widest" data-reveal>
            所有趋势的尽头都是反转，柔弱的信号往往比强硬的信号更可靠。
          </p>
          <p className="mt-14 md:mt-20 label-sm" data-reveal>{SITE.brandLine}</p>
        </div>
      </section>
    </div>
  )
}
