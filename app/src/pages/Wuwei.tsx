import { STOP_LOSS, EMOTION, LIFE_OS } from '../data/content'
import { Label, PageHead, SectionHead } from '../components/Bits'

export default function Wuwei() {
  return (
    <div className="max-w-[1400px] mx-auto px-5 md:px-10">
      <PageHead
        no="08"
        zh="无为"
        en="WU WEI"
        intro="最不像交易板块的交易板块——没有指标，没有形态，只有止损、情绪与生活。操作是阳，不操作是阴。多数人只看到阳，看不到阴的力量。"
      />

      {/* ── 止损的艺术 ────────────────────── */}
      <section className="hairline-t pt-14 md:pt-20 pb-20 md:pb-28">
        <SectionHead no="Ⅰ" zh={STOP_LOSS.title} en={STOP_LOSS.en} note={STOP_LOSS.intro} />

        {/* 三件事 */}
        <div className="grid md:grid-cols-3 gap-px bg-[rgb(var(--line))] border border-[rgb(var(--line))] mb-16">
          {STOP_LOSS.three.map((t, i) => (
            <div key={t.title} className="bg-paper p-6 md:p-10">
              <span className="font-mono-num tnum text-sm ink-3 block mb-4">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="font-serif-sc font-bold text-xl mb-4">{t.title}</h3>
              <p className="text-sm leading-loose ink-2">{t.desc}</p>
            </div>
          ))}
        </div>

        {/* 五条真相 */}
        <div className="max-w-4xl space-y-0">
          {STOP_LOSS.truths.map((t, i) => (
            <div key={i} className={`grid md:grid-cols-12 gap-4 md:gap-8 py-8 ${i > 0 ? 'hairline-t' : 'border-t border-[rgb(var(--line))]'}`}>
              <span className="md:col-span-1 font-mono-num tnum text-sm ink-3">{String(i + 1).padStart(2, '0')}</span>
              <p className={`md:col-span-11 leading-loose ${i === 2 ? 'font-serif-sc font-bold text-xl md:text-2xl' : 'text-base ink-2'}`}>
                {t}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 情绪管理 ─────────────────────── */}
      <section className="pb-20 md:pb-28">
        <SectionHead no="Ⅱ" zh={EMOTION.title} en={EMOTION.en} />
        <div className="grid md:grid-cols-2 gap-px bg-[rgb(var(--line))] border border-[rgb(var(--line))]">
          {EMOTION.points.map((p) => (
            <div key={p.k} className="bg-paper p-6 md:p-10">
              <span className="font-serif-sc font-black text-3xl md:text-4xl block mb-5">{p.k}</span>
              <p className="text-sm md:text-base leading-loose ink-2">{p.v}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 生活即系统 ────────────────────── */}
      <section className="hairline-t py-20 md:py-28">
        <div className="max-w-4xl">
          <Label className="block mb-8">Ⅲ · {LIFE_OS.en}</Label>
          <h2 className="font-serif-sc font-black text-3xl md:text-5xl leading-snug tracking-tight mb-10">
            {LIFE_OS.title}
          </h2>
          <div className="space-y-8">
            {LIFE_OS.body.map((p, i) => (
              <p key={i} className={`leading-loose ${i === 0 ? 'text-lg md:text-xl' : 'text-base ink-2'}`}>
                {p}
              </p>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
