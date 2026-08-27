import {
  FRAMEWORK_CHAIN, FRAMEWORK_LOOPS, FRAMEWORK_CONSTRAINT,
  FRAMEWORK_DECISION, FRAMEWORK_INTERFACE, FRAMEWORK_REVIEW,
} from '../data/content'
import { Label, PageHead, SectionHead } from '../components/Bits'

export default function Framework() {
  return (
    <div className="max-w-[1400px] mx-auto px-5 md:px-10">
      <PageHead
        no="09"
        zh="框架"
        en="FRAMEWORK"
        intro="操作架构：现实如何变成判断，判断如何获得行动授权，行动结果如何回流为认知修正。这一页是地图——方法在方法页，规则在系统页。"
      />

      {/* ── Ⅰ · 操作地图 ───────────────────── */}
      <section className="hairline-t pt-14 md:pt-20 pb-20 md:pb-28">
        <SectionHead no="Ⅰ" zh="操作地图" en="THE MAP" note="从现实到修正的完整链路" />
        <div className="border border-[rgb(var(--line))]">
          {FRAMEWORK_CHAIN.map((n, i) => (
            <div
              key={n.key}
              className={`grid md:grid-cols-12 gap-2 md:gap-8 px-5 md:px-8 py-6 md:py-7 items-baseline ${
                i > 0 ? 'hairline-t' : ''
              }`}
            >
              <div className="md:col-span-3 flex items-baseline gap-3">
                <span className="font-mono-num tnum text-xs ink-3">{String(i + 1).padStart(2, '0')}</span>
                <span className="font-serif-sc font-bold text-xl md:text-2xl whitespace-nowrap">{n.zh}</span>
              </div>
              <div className="md:col-span-2">
                <Label>{n.key}</Label>
              </div>
              <p className="md:col-span-6 text-sm md:text-base leading-relaxed ink-2">{n.desc}</p>
              <div className="md:col-span-1 md:text-right">
                {n.href && (
                  <a href={n.href} className="text-sm tracking-widest water hover:opacity-70 transition-opacity">
                    {n.hrefLabel} →
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Ⅱ · 双循环 ─────────────────────── */}
      <section className="pb-20 md:pb-28">
        <SectionHead no="Ⅱ" zh="双循环" en="TWO CYCLES" note="两个完整循环，两种时间尺度" />
        <div className="grid md:grid-cols-2 gap-px bg-[rgb(var(--line))] border border-[rgb(var(--line))]">
          {FRAMEWORK_LOOPS.map((l) => (
            <div key={l.en} className="bg-paper p-6 md:p-10">
              <Label className="block mb-2">{l.tempo}</Label>
              <h3 className="font-serif-sc font-bold text-2xl mb-1">{l.name}</h3>
              <Label className="block mb-8">{l.en}</Label>
              <ol className="space-y-4 mb-8">
                {l.steps.map((s, i) => (
                  <li key={i} className="flex gap-4 items-baseline text-sm leading-loose ink-2">
                    <span className="font-mono-num tnum text-xs ink-3 shrink-0">{String(i + 1).padStart(2, '0')}</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ol>
              <p className="text-sm leading-loose ink-2 mb-6">{l.note}</p>
              <a href={l.href} className="text-sm tracking-widest water hover:opacity-70 transition-opacity">
                {l.hrefLabel} →
              </a>
            </div>
          ))}
        </div>
        <div className="mt-10 max-w-4xl">
          <Label className="block mb-4">{FRAMEWORK_CONSTRAINT.name} · {FRAMEWORK_CONSTRAINT.en}</Label>
          <p className="text-base md:text-lg leading-loose ink-2">{FRAMEWORK_CONSTRAINT.desc}</p>
          <a href={FRAMEWORK_CONSTRAINT.href} className="inline-block mt-6 text-sm tracking-widest water hover:opacity-70 transition-opacity">
            {FRAMEWORK_CONSTRAINT.hrefLabel} →
          </a>
        </div>
      </section>

      {/* ── Ⅲ · 决策 ───────────────────────── */}
      <section className="hairline-t py-20 md:py-28">
        <SectionHead no="Ⅲ" zh={FRAMEWORK_DECISION.title} en={FRAMEWORK_DECISION.en} />
        <div className="max-w-4xl">
          <p className="font-serif-sc font-black text-2xl md:text-4xl leading-snug tracking-tight mb-10 md:mb-14">
            {FRAMEWORK_DECISION.lead}
          </p>
          <ol className="space-y-6">
            {FRAMEWORK_DECISION.points.map((p, i) => (
              <li key={i} className="flex gap-5 items-baseline hairline-b pb-6 last:border-0 last:pb-0">
                <span className="font-mono-num tnum text-sm ink-3 shrink-0">{String(i + 1).padStart(2, '0')}</span>
                <span className="text-base leading-loose ink-2">{p}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Ⅳ · 行动接口 ───────────────────── */}
      <section className="pb-20 md:pb-28">
        <SectionHead no="Ⅳ" zh={FRAMEWORK_INTERFACE.title} en={FRAMEWORK_INTERFACE.en} note="授权线：决策之后，才是系统" />
        <div className="border border-[rgb(var(--line))] mb-12">
          {FRAMEWORK_INTERFACE.chain.map((c, i) => (
            <div
              key={c}
              className={`grid md:grid-cols-12 gap-2 md:gap-8 px-5 md:px-8 py-5 md:py-6 items-baseline ${
                i > 0 ? 'hairline-t' : ''
              }`}
            >
              <div className="md:col-span-2 flex items-baseline gap-3">
                <span className="font-mono-num tnum text-xs ink-3">{String(i + 1).padStart(2, '0')}</span>
                <span className="font-serif-sc font-bold text-lg">{c.split(' ')[0]}</span>
              </div>
              <p className="md:col-span-10 text-sm md:text-base ink-2">{c.split(' ').slice(1).join(' ')}</p>
            </div>
          ))}
        </div>
        <div className="max-w-4xl">
          <ol className="space-y-6">
            {FRAMEWORK_INTERFACE.points.map((p, i) => (
              <li key={i} className="flex gap-5 items-baseline hairline-b pb-6 last:border-0 last:pb-0">
                <span className="font-mono-num tnum text-sm ink-3 shrink-0">{String(i + 1).padStart(2, '0')}</span>
                <span className="text-base leading-loose ink-2">{p}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Ⅴ · 复盘与修正 ─────────────────── */}
      <section className="hairline-t pt-14 md:pt-20 pb-20 md:pb-28">
        <SectionHead no="Ⅴ" zh={FRAMEWORK_REVIEW.title} en={FRAMEWORK_REVIEW.en} />
        <div className="grid md:grid-cols-2 gap-px bg-[rgb(var(--line))] border border-[rgb(var(--line))] mb-12">
          {FRAMEWORK_REVIEW.reviews.map((r) => (
            <div key={r.en} className="bg-paper p-6 md:p-10">
              <Label className="block mb-4">{r.en}</Label>
              <h3 className="font-serif-sc font-bold text-xl mb-2">{r.name}</h3>
              <p className="font-serif-sc font-bold text-lg md:text-xl leading-snug mb-5">{r.q}</p>
              <p className="text-sm leading-loose ink-2">{r.desc}</p>
            </div>
          ))}
        </div>
        <p className="max-w-4xl font-serif-sc text-lg md:text-xl font-bold leading-relaxed">
          {FRAMEWORK_REVIEW.gate}
        </p>
      </section>
    </div>
  )
}
