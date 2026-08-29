import {
  METHOD_LOOP, METHOD_GATE, METHOD_TIMING, METHOD_EVIDENCE, METHOD_REVISION, METHOD_CONSTRAINT,
} from '../data/content'
import { Label, PageHead, SectionHead } from '../components/Bits'

export default function Method() {
  return (
    <div className="max-w-[1400px] mx-auto px-5 md:px-10">
      <PageHead
        no="11"
        zh="方法"
        en="METHOD"
        intro="我如何形成判断：观察的准入、证据的标准、证伪的纪律、修正的规则。方法不是路径——路径在框架页；方法是引擎。"
      />

      {/* ── Ⅰ · 研究循环 ───────────────────── */}
      <section className="hairline-t pt-14 md:pt-20 pb-20 md:pb-28">
        <SectionHead no="Ⅰ" zh={METHOD_LOOP.title} en={METHOD_LOOP.en} note={METHOD_LOOP.note} />
        <div className="border border-[rgb(var(--line))]">
          {METHOD_LOOP.steps.map((s, i) => (
            <div
              key={s.key}
              className={`grid md:grid-cols-12 gap-2 md:gap-8 px-5 md:px-8 py-6 md:py-7 items-baseline ${
                i > 0 ? 'hairline-t' : ''
              }`}
            >
              <div className="md:col-span-3 flex items-baseline gap-3">
                <span className="font-mono-num tnum text-xs ink-3">{String(i + 1).padStart(2, '0')}</span>
                <span className="font-serif-sc font-bold text-xl md:text-2xl whitespace-nowrap">{s.zh}</span>
              </div>
              <div className="md:col-span-2">
                <Label>{s.key}</Label>
              </div>
              <p className="md:col-span-6 text-sm md:text-base leading-relaxed ink-2">{s.desc}</p>
              <div className="md:col-span-1 md:text-right">
                {s.href && (
                  <a href={s.href} className="text-sm tracking-widest water hover:opacity-70 transition-opacity">
                    {s.hrefLabel} →
                  </a>
                )}
              </div>
            </div>
          ))}
          <div className="hairline-t px-5 md:px-8 py-5 flex items-center gap-3">
            <span className="inline-block w-2 h-2 bg-ink" />
            <span className="text-sm ink-2">反思的产出回到观察——循环由此闭合，方法由此演化。</span>
          </div>
        </div>
      </section>

      {/* ── Ⅱ · 观察的准入 ─────────────────── */}
      <section className="pb-20 md:pb-28">
        <SectionHead no="Ⅱ" zh={METHOD_GATE.title} en={METHOD_GATE.en} note={METHOD_GATE.note} />
        <p className="font-serif-sc font-bold text-xl md:text-2xl leading-snug tracking-tight mb-10 max-w-4xl">
          {METHOD_GATE.chain}
        </p>
        <div className="grid md:grid-cols-3 gap-px bg-[rgb(var(--line))] border border-[rgb(var(--line))] mb-10">
          {METHOD_GATE.gates.map((g) => (
            <div key={g.k} className="bg-paper p-6 md:p-10">
              <span className="font-serif-sc font-black text-4xl md:text-5xl block mb-2">{g.zh}</span>
              <Label className="block mb-5">{g.k}</Label>
              <p className="text-sm leading-loose ink-2">{g.desc}</p>
            </div>
          ))}
        </div>
        <p className="max-w-4xl text-base leading-loose ink-2">{METHOD_GATE.discipline}</p>
      </section>

      {/* ── Ⅲ · 信号的时序 ─────────────────── */}
      <section className="pb-20 md:pb-28">
        <SectionHead no="Ⅲ" zh={METHOD_TIMING.title} en={METHOD_TIMING.en} note={METHOD_TIMING.note} />
        <div className="border border-[rgb(var(--line))] mb-10">
          <div className="hidden md:grid grid-cols-12 gap-4 px-5 md:px-8 py-4 hairline-b">
            <Label className="col-span-2">阶段</Label>
            <Label className="col-span-3">市场态度</Label>
            <Label className="col-span-7">研究含义</Label>
          </div>
          {METHOD_TIMING.stages.map((s, i) => (
            <div
              key={s.name}
              className={`grid md:grid-cols-12 gap-2 md:gap-4 px-5 md:px-8 py-5 md:py-6 items-baseline ${
                i > 0 ? 'hairline-t' : ''
              }`}
            >
              <div className="md:col-span-2 font-serif-sc font-bold text-lg">{s.name}</div>
              <div className="md:col-span-3 text-sm ink-3">{s.attitude}</div>
              <div className="md:col-span-7 text-sm ink-2 leading-relaxed">{s.value}</div>
            </div>
          ))}
        </div>
        <div className="max-w-4xl">
          <ol className="space-y-6">
            {METHOD_TIMING.freshness.map((p, i) => (
              <li key={i} className="flex gap-5 items-baseline hairline-b pb-6 last:border-0 last:pb-0">
                <span className="font-mono-num tnum text-sm ink-3 shrink-0">{String(i + 1).padStart(2, '0')}</span>
                <span className="text-base leading-loose ink-2">{p}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Ⅳ · 证据与证伪 ─────────────────── */}
      <section className="pb-20 md:pb-28">
        <SectionHead no="Ⅳ" zh={METHOD_EVIDENCE.title} en={METHOD_EVIDENCE.en} />
        <div className="max-w-4xl">
          <ol className="space-y-6">
            {METHOD_EVIDENCE.points.map((p, i) => (
              <li key={i} className="flex gap-5 items-baseline hairline-b pb-6 last:border-0 last:pb-0">
                <span className="font-mono-num tnum text-sm ink-3 shrink-0">{String(i + 1).padStart(2, '0')}</span>
                <span className="text-base leading-loose ink-2">{p}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Ⅴ · 修正纪律 ───────────────────── */}
      <section className="pb-20 md:pb-28">
        <SectionHead no="Ⅴ" zh={METHOD_REVISION.title} en={METHOD_REVISION.en} />
        <div className="max-w-4xl">
          <ol className="space-y-6 mb-10">
            {METHOD_REVISION.points.map((p, i) => (
              <li key={i} className="flex gap-5 items-baseline hairline-b pb-6 last:border-0 last:pb-0">
                <span className="font-mono-num tnum text-sm ink-3 shrink-0">{String(i + 1).padStart(2, '0')}</span>
                <span className="text-base leading-loose ink-2">{p}</span>
              </li>
            ))}
          </ol>
          <a href={METHOD_REVISION.href} className="text-sm tracking-widest water hover:opacity-70 transition-opacity">
            {METHOD_REVISION.hrefLabel} →
          </a>
        </div>
      </section>

      {/* ── Ⅵ · 行为约束层 ─────────────────── */}
      <section className="hairline-t py-20 md:py-28">
        <div className="max-w-4xl">
          <SectionHead no="Ⅵ" zh={METHOD_CONSTRAINT.title} en={METHOD_CONSTRAINT.en} />
          <p className="text-base md:text-lg leading-loose ink-2">{METHOD_CONSTRAINT.desc}</p>
          <a href={METHOD_CONSTRAINT.href} className="inline-block mt-8 text-sm tracking-widest water hover:opacity-70 transition-opacity">
            {METHOD_CONSTRAINT.hrefLabel} →
          </a>
        </div>
      </section>
    </div>
  )
}
