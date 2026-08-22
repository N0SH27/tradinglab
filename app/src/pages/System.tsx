import {
  SYSTEM_PYRAMID, SYSTEM_THREE, SYSTEM_CASINO, SYSTEM_EVOLUTION,
  SYSTEM_PRINCIPLES, MARKET_STATES, SITE,
} from '../data/content'
import { Label, PageHead, SectionHead } from '../components/Bits'

export default function System() {
  return (
    <div className="max-w-[1400px] mx-auto px-5 md:px-10">
      <PageHead
        no="03"
        zh="系统"
        en="THE SYSTEM"
        intro="计划交易，交易计划；应对变化，变化应对。成功交易只有三要素：正期望的交易系统、与之匹配的资金管理、以及铁血纪律般的心理管控。这一页是 HSN 多年全职交易的沉淀——它仍在演进。"
      />

      {/* ── 七层金字塔 ─────────────────── */}
      <section className="hairline-t pt-14 md:pt-20 pb-20 md:pb-28">
        <SectionHead no="Ⅰ" zh="七层金字塔" en="SEVEN LAYERS" note="从战略到进化的完整闭环" />
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

      {/* ── 三要素 ─────────────────────── */}
      <section className="pb-20 md:pb-28">
        <SectionHead no="Ⅱ" zh="三要素" en="THREE PILLARS" />
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

      {/* ── 赌场比喻 ────────────────────── */}
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

      {/* ── 市场状态机 ──────────────────── */}
      <section className="pb-20 md:pb-28">
        <SectionHead no="Ⅲ" zh="市场状态机" en="MARKET STATE MACHINE" note="系统是阳，状态机是应变之阴" />
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

      {/* ── 系统演进 ────────────────────── */}
      <section className="pb-20 md:pb-28">
        <SectionHead no="Ⅳ" zh="演进" en="EVOLUTION" note="同一套系统，数次重生——且仍在继续" />
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
        <div className="mt-12 text-center">
          <a href="#/essays/casino-boss" className="text-sm tracking-widest water hover:opacity-70 transition-opacity">
            延伸阅读《做赌场，不做赌徒》 →
          </a>
        </div>
      </section>
    </div>
  )
}
