import {
  SYSTEM_PYRAMID, SYSTEM_THREE, SYSTEM_CASINO, SYSTEM_EVOLUTION,
  SYSTEM_PRINCIPLES, MARKET_STATES, SITE,
  SYSTEM_ESSENTIALS, TREND_LIFECYCLE, TAPE_SIGNALS, TRIGGER_SPECS, IF_THEN,
  EXECUTION_RESONANCE, POSITION_DISCIPLINE, TRADING_REVIEW,
} from '../data/content'
import { Label, PageHead, SectionHead } from '../components/Bits'

export default function System() {
  return (
    <div className="max-w-[1400px] mx-auto px-5 md:px-10">
      <PageHead
        no="03"
        zh="系统"
        en="THE SYSTEM"
        intro="行动获得授权之后，具体按照什么规则执行、管理与退出交易——状态机、盘面信号、触发器、仓位、止损与复盘。这一页是 HSN 多年全职交易的沉淀——它仍在演进。"
      />

      {/* ── 总图 · 七层金字塔 ──────────────── */}
      <section className="hairline-t pt-14 md:pt-20 pb-20 md:pb-28">
        <SectionHead no="Ⅰ" zh="七层金字塔" en="SEVEN LAYERS" note="从战略到进化的完整闭环——本页总图" />
        <div className="border border-[rgb(var(--line))]">
          {SYSTEM_PYRAMID.map((l, i) => (
            <div
              key={l.layer}
              className={`grid md:grid-cols-12 gap-3 md:gap-8 px-5 md:px-8 py-6 md:py-7 items-baseline ${
                i > 0 ? 'hairline-t' : ''
              }`}
            >
              <div className="md:col-span-3 flex items-baseline gap-3">
                <span className="font-mono-num tnum text-xs ink-3">{String(i + 1).padStart(2, '0')}</span>
                <span className="font-serif-sc font-bold text-xl md:text-2xl whitespace-nowrap">{l.layer}</span>
              </div>
              <div className="md:col-span-2">
                <Label>{l.role}</Label>
              </div>
              <p className="md:col-span-7 text-sm md:text-base leading-relaxed ink-2">{l.desc}</p>
            </div>
          ))}
          <div className="hairline-t px-5 md:px-8 py-5 flex items-center gap-3">
            <span className="inline-block w-2 h-2 bg-ink" />
            <span className="text-sm ink-2">复盘与认知的产出，反哺到周期判断——循环由此闭合，系统由此进化。</span>
          </div>
        </div>
      </section>

      {/* ── Ⅱ · 机器的存在理由 ─────────────── */}
      <section className="pb-20 md:pb-28">
        <SectionHead no="Ⅱ" zh="机器为什么这样造" en="WHY THIS MACHINE" />
        <div className="max-w-4xl mb-16">
          <Label className="block mb-2">{SYSTEM_ESSENTIALS.en}</Label>
          <h3 className="font-serif-sc font-bold text-2xl mb-3">{SYSTEM_ESSENTIALS.title}</h3>
          <p className="font-serif-sc text-lg font-bold leading-relaxed mb-8">{SYSTEM_ESSENTIALS.core}</p>
          <ol className="space-y-6">
            {SYSTEM_ESSENTIALS.steps.map((s, i) => (
              <li key={i} className="flex gap-5 items-baseline hairline-b pb-6 last:border-0 last:pb-0">
                <span className="font-mono-num tnum text-sm ink-3 shrink-0">{String(i + 1).padStart(2, '0')}</span>
                <span className="text-base leading-loose ink-2">{s}</span>
              </li>
            ))}
          </ol>
        </div>
        <div className="grid md:grid-cols-3 gap-px bg-[rgb(var(--line))] border border-[rgb(var(--line))]">
          {SYSTEM_THREE.map((t, i) => (
            <div key={t.title} className="bg-paper p-6 md:p-10">
              <span className="font-serif-sc font-black text-4xl md:text-5xl block mb-6">
                {['一', '二', '三'][i]}
              </span>
              <h3 className="font-serif-sc font-bold text-xl mb-4">{t.title}</h3>
              <p className="text-sm leading-loose ink-2">{t.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 核心心法 · 赌场比喻 ─────────────── */}
      <section className="hairline-t py-20 md:py-32">
        <div className="max-w-4xl">
          <Label className="block mb-8">核心心法 · CORE METAPHOR</Label>
          <p className="font-serif-sc font-black text-3xl md:text-5xl leading-snug tracking-tight">
            {SYSTEM_CASINO.quote}
          </p>
          <p className="mt-8 md:mt-10 text-base md:text-lg leading-loose ink-2 max-w-3xl">
            {SYSTEM_CASINO.body}
          </p>
        </div>
      </section>

      {/* ── Ⅲ · 市场状态机 ─────────────────── */}
      <section className="pb-20 md:pb-28">
        <SectionHead no="Ⅲ" zh="市场状态机" en="STATE" note="先回答：现在允许做什么" />
        <div className="border border-[rgb(var(--line))]">
          <div className="hidden md:grid grid-cols-12 gap-4 px-5 md:px-8 py-4 hairline-b">
            <Label className="col-span-2">状态</Label>
            <Label className="col-span-4">判定条件</Label>
            <Label className="col-span-4">允许的交易</Label>
            <Label className="col-span-2 text-right">仓位上限</Label>
          </div>
          {MARKET_STATES.map((s, i) => (
            <div
              key={s.state}
              className={`grid md:grid-cols-12 gap-2 md:gap-4 px-5 md:px-8 py-5 md:py-6 items-baseline ${
                i > 0 ? 'hairline-t' : ''
              }`}
            >
              <div className="md:col-span-2 flex items-center gap-2.5">
                <span className={`inline-block w-2.5 h-2.5 ${s.yang ? 'bg-ink' : 'border border-current'}`} />
                <span className="font-serif-sc font-bold text-lg">{s.state}</span>
              </div>
              <div className="md:col-span-4 text-sm ink-2">{s.condition}</div>
              <div className="md:col-span-4 text-sm ink-2">{s.allowed}</div>
              <div className="md:col-span-2 md:text-right font-mono-num tnum text-lg">{s.position}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Ⅳ · 趋势生命周期 ───────────────── */}
      <section className="pb-20 md:pb-28">
        <SectionHead no="Ⅳ" zh={TREND_LIFECYCLE.title} en={TREND_LIFECYCLE.en} note={TREND_LIFECYCLE.rule} />
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-[rgb(var(--line))] border border-[rgb(var(--line))] mb-10">
          {TREND_LIFECYCLE.stages.map((s, i) => (
            <div key={s.name} className="bg-paper p-6 md:p-8">
              <span className="font-mono-num tnum text-sm ink-3 block mb-4">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="font-serif-sc font-bold text-xl mb-4">{s.name}</h3>
              <p className="text-sm leading-loose ink-3 mb-4">{s.feature}</p>
              <p className="text-sm leading-loose ink-2">{s.tactic}</p>
            </div>
          ))}
        </div>
        <div className="max-w-4xl">
          <ol className="space-y-6">
            {TREND_LIFECYCLE.decay.map((p, i) => (
              <li key={i} className="flex gap-5 items-baseline hairline-b pb-6 last:border-0 last:pb-0">
                <span className="font-mono-num tnum text-sm ink-3 shrink-0">{String(i + 1).padStart(2, '0')}</span>
                <span className="text-base leading-loose ink-2">{p}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Ⅴ · 盘面信号分层 ───────────────── */}
      <section className="pb-20 md:pb-28">
        <SectionHead no="Ⅴ" zh={TAPE_SIGNALS.title} en={TAPE_SIGNALS.en} />
        <p className="max-w-4xl text-base leading-loose ink-2 mb-12">{TAPE_SIGNALS.note}</p>
        <div className="border border-[rgb(var(--line))]">
          <div className="hidden md:grid grid-cols-12 gap-4 px-5 md:px-8 py-4 hairline-b">
            <Label className="col-span-2">层</Label>
            <Label className="col-span-2">与价格的关系</Label>
            <Label className="col-span-4">例</Label>
            <Label className="col-span-4">用途</Label>
          </div>
          {TAPE_SIGNALS.layers.map((l, i) => (
            <div
              key={l.name}
              className={`grid md:grid-cols-12 gap-2 md:gap-4 px-5 md:px-8 py-5 md:py-6 items-baseline ${
                i > 0 ? 'hairline-t' : ''
              }`}
            >
              <div className="md:col-span-2 font-serif-sc font-bold text-lg">{l.name}</div>
              <div className="md:col-span-2 text-sm ink-3">{l.when}</div>
              <div className="md:col-span-4 text-sm ink-2">{l.examples}</div>
              <div className="md:col-span-4 text-sm ink-2">{l.usage}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Ⅵ · 触发器规格与预案 ────────────── */}
      <section className="pb-20 md:pb-28">
        <SectionHead no="Ⅵ" zh={TRIGGER_SPECS.title} en={TRIGGER_SPECS.en} note="规格在系统，确认在决策" />
        <p className="font-serif-sc text-lg md:text-xl font-bold leading-relaxed mb-10 max-w-4xl">
          {TRIGGER_SPECS.rule}
        </p>
        <div className="grid md:grid-cols-2 gap-px bg-[rgb(var(--line))] border border-[rgb(var(--line))] mb-16">
          {TRIGGER_SPECS.types.map((t) => (
            <div key={t.name} className="bg-paper p-6 md:p-10">
              <h3 className="font-serif-sc font-bold text-xl mb-4">{t.name}</h3>
              <p className="text-sm leading-loose ink-2">{t.examples}</p>
            </div>
          ))}
        </div>
        <div className="max-w-4xl">
          <Label className="block mb-2">{IF_THEN.en}</Label>
          <h3 className="font-serif-sc font-bold text-2xl mb-3">{IF_THEN.title}</h3>
          <p className="font-serif-sc text-lg font-bold leading-relaxed mb-8">{IF_THEN.core}</p>
          <ol className="space-y-6">
            {IF_THEN.items.map((p, i) => (
              <li key={i} className="flex gap-5 items-baseline hairline-b pb-6 last:border-0 last:pb-0">
                <span className="font-mono-num tnum text-sm ink-3 shrink-0">{String(i + 1).padStart(2, '0')}</span>
                <span className="text-base leading-loose ink-2">{p}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Ⅶ · 执行：三层共振 + 仓位与级别 ── */}
      <section className="pb-20 md:pb-28">
        <SectionHead no="Ⅶ" zh={EXECUTION_RESONANCE.title} en={EXECUTION_RESONANCE.en} note={EXECUTION_RESONANCE.rule} />
        <div className="grid md:grid-cols-3 gap-px bg-[rgb(var(--line))] border border-[rgb(var(--line))] mb-10">
          {EXECUTION_RESONANCE.layers.map((l) => (
            <div key={l.level} className="bg-paper p-6 md:p-10">
              <Label className="block mb-4">{l.role}</Label>
              <h3 className="font-serif-sc font-bold text-xl mb-4">{l.level}</h3>
              <p className="text-sm leading-loose ink-2">{l.desc}</p>
            </div>
          ))}
        </div>
        <p className="max-w-4xl text-base leading-loose ink-2 mb-16">{EXECUTION_RESONANCE.note}</p>
        <div className="max-w-4xl">
          <Label className="block mb-2">{POSITION_DISCIPLINE.en}</Label>
          <h3 className="font-serif-sc font-bold text-2xl mb-8">{POSITION_DISCIPLINE.title}</h3>
          <ol className="space-y-6">
            {POSITION_DISCIPLINE.points.map((p, i) => (
              <li key={i} className="flex gap-5 items-baseline hairline-b pb-6 last:border-0 last:pb-0">
                <span className="font-mono-num tnum text-sm ink-3 shrink-0">{String(i + 1).padStart(2, '0')}</span>
                <span className="text-base leading-loose ink-2">{p}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Ⅷ · 执行复盘 ───────────────────── */}
      <section className="pb-20 md:pb-28">
        <SectionHead no="Ⅷ" zh="执行复盘" en="TRADING REVIEW" note="我执行得对吗" />
        <div className="max-w-4xl">
          <Label className="block mb-2">{TRADING_REVIEW.en}</Label>
          <h3 className="font-serif-sc font-bold text-2xl mb-3">{TRADING_REVIEW.title}</h3>
          <p className="font-serif-sc text-lg font-bold leading-relaxed mb-8">{TRADING_REVIEW.core}</p>
          <ol className="space-y-6">
            {TRADING_REVIEW.points.map((p, i) => (
              <li key={i} className="flex gap-5 items-baseline hairline-b pb-6 last:border-0 last:pb-0">
                <span className="font-mono-num tnum text-sm ink-3 shrink-0">{String(i + 1).padStart(2, '0')}</span>
                <span className="text-base leading-loose ink-2">{p}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Ⅸ · 系统演进 ───────────────────── */}
      <section className="pb-20 md:pb-28">
        <SectionHead no="Ⅸ" zh="演进" en="EVOLUTION" note="同一套系统，数次重生——且仍在继续" />
        <div className="grid md:grid-cols-3 gap-px bg-[rgb(var(--line))] border border-[rgb(var(--line))]">
          {SYSTEM_EVOLUTION.map((e, ei) => (
            <div key={ei} className="bg-paper p-6 md:p-10">
              <h3 className="font-serif-sc font-bold text-2xl mb-8 leading-snug">{e.theme}</h3>
              <ul className="space-y-5">
                {e.points.map((p, i) => (
                  <li key={i} className="text-sm leading-loose ink-2 hairline-b pb-5 last:border-0 last:pb-0">
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ── 四字心法 ────────────────────── */}
      <section className="hairline-t py-16 md:py-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[rgb(var(--line))] border border-[rgb(var(--line))]">
          {SYSTEM_PRINCIPLES.map((p) => (
            <div key={p.k} className="bg-paper p-6 md:p-10 text-center">
              <span className="font-serif-sc font-black text-5xl md:text-7xl block mb-5">{p.k}</span>
              <p className="text-xs md:text-sm leading-relaxed ink-2">{p.v}</p>
            </div>
          ))}
        </div>
        <p className="mt-10 text-center text-sm ink-3 tracking-widest">
          {SITE.motto}
        </p>
        <div className="mt-12 text-center space-x-8">
          <a href="#/essays/casino-boss" className="text-sm tracking-widest water hover:opacity-70 transition-opacity">
            延伸阅读《做赌场，不做赌徒》 →
          </a>
          <a href="#/wuwei" className="text-sm tracking-widest water hover:opacity-70 transition-opacity">
            规则之外，约束层接管：无为 →
          </a>
        </div>
      </section>
    </div>
  )
}
