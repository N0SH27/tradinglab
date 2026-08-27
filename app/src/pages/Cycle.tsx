import {
  CYCLE_STAGES, CYCLE_INDUSTRIES, CYCLE_NOTE,
  CYCLE_RESONANCE, THEME_LIFECYCLE, THEME_LEVELS, FACE_WEIGHTS,
} from '../data/content'
import { Label, PageHead, SectionHead, Taiji } from '../components/Bits'

export default function Cycle() {
  return (
    <div className="max-w-[1400px] mx-auto px-5 md:px-10">
      <PageHead no="06" zh="周期" en="CYCLE" intro={CYCLE_NOTE} />

      {/* ── 七阶段谱系 ───────────────────── */}
      <section className="hairline-t pt-14 md:pt-20 pb-20 md:pb-28">
        <SectionHead no="Ⅰ" zh="七阶段" en="SEVEN STAGES" note="盛极而衰，否极泰来" />
        <div className="flex flex-col md:flex-row items-center gap-10 md:gap-20 mb-16 md:mb-20">
          <Taiji size={150} slow />
          <div className="max-w-xl text-center md:text-left">
            <p className="font-serif-sc text-xl md:text-2xl font-bold leading-relaxed">
              盛极而衰，否极泰来。
            </p>
            <p className="mt-4 text-sm md:text-base leading-loose ink-2">
              圆环上的七个位置没有好坏之分——处于出清期的行业可能比处于狂热期的行业更接近机会。
              空着的阶段同样是一种信息：它说明市场此刻缺少什么。
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-7 gap-px bg-[rgb(var(--line))] border border-[rgb(var(--line))]">
          {CYCLE_STAGES.map((stage, i) => {
            const items = CYCLE_INDUSTRIES.filter((x) => x.stage === stage)
            return (
              <div
                key={stage}
                className="min-h-[240px] md:min-h-[300px] p-4 md:p-5 flex flex-col bg-paper"
              >
                <div className="hairline-b pb-3 mb-4">
                  <span className="font-mono-num tnum text-[10px] ink-3 block mb-1">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="font-serif-sc font-bold text-lg tracking-widest">{stage}</span>
                </div>
                <div className="flex-1 space-y-4">
                  {items.length === 0 ? (
                    <span className="text-xs ink-3 tracking-widest">— 空 —</span>
                  ) : (
                    items.map((x) => (
                      <div key={x.name}>
                        <div className="text-sm font-medium mb-1">{x.name}</div>
                        <div className="text-xs leading-relaxed ink-3">{x.note}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )
          })}
          {/* 七格在窄屏两列下余出第 8 格：纸色占位，保持网格线完整 */}
          <div className="bg-paper md:hidden" aria-hidden="true" />
        </div>
        <p className="mt-4 text-xs ink-3 tracking-widest">
          读法：从左到右是一次完整的阴阳循环。「空」意味着当前没有行业处于该阶段——这本身值得思考。
        </p>
      </section>

      {/* ── 三层共振 ─────────────────────── */}
      <section className="pb-20 md:pb-28">
        <SectionHead no="Ⅱ" zh="三层共振" en="TRIPLE RESONANCE" note="必须 ≥2 层共振，禁止 3 层逆向" />
        <div className="grid md:grid-cols-3 gap-px bg-[rgb(var(--line))] border border-[rgb(var(--line))]">
          {CYCLE_RESONANCE.map((r, i) => (
            <div key={r.level} className="bg-paper p-6 md:p-10">
              <span className="font-mono-num tnum text-xs ink-3 block mb-4">{String(i + 1).padStart(2, '0')} · {r.role}</span>
              <h3 className="font-serif-sc font-bold text-2xl mb-3">{r.level}</h3>
              <p className="text-sm ink-2">{r.question}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 题材生命周期 ──────────────────── */}
      <section className="pb-20 md:pb-28">
        <SectionHead no="Ⅲ" zh="题材的生命" en="LIFECYCLE OF A THEME" note="在启动点抓住机会，在退潮期规避风险" />
        <div className="grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7">
            <div className="border border-[rgb(var(--line))]">
              {THEME_LIFECYCLE.map((t, i) => (
                <div key={t.stage} className={`grid md:grid-cols-12 gap-3 md:gap-6 px-5 md:px-8 py-6 ${i > 0 ? 'hairline-t' : ''}`}>
                  <div className="md:col-span-3 flex items-baseline gap-3">
                    <span className="font-mono-num tnum text-xs ink-3">{String(i + 1).padStart(2, '0')}</span>
                    <span className="font-serif-sc font-bold text-xl water">{t.stage}</span>
                  </div>
                  <p className="md:col-span-9 text-sm leading-loose ink-2">{t.detail}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-5">
            <Label className="block mb-6">题材的级别 · 理解力的前提</Label>
            <div className="border border-[rgb(var(--line))]">
              {THEME_LEVELS.map((l, i) => (
                <div key={l.level} className={`px-5 md:px-8 py-6 ${i > 0 ? 'hairline-t' : ''}`}>
                  <h4 className="font-serif-sc font-bold text-lg mb-2">{l.level}</h4>
                  <p className="text-sm leading-relaxed ink-2">{l.desc}</p>
                </div>
              ))}
            </div>
            <p className="mt-6 text-sm leading-loose ink-2">
              驱动力度：政策驱动 ＞ 行业事件驱动 ＞ 消息驱动。
              股市是货币政策的晴雨表——判断题材级别，先看政策的级别。
            </p>
          </div>
        </div>
      </section>

      {/* ── 四面权重 ─────────────────────── */}
      <section className="pb-8">
        <SectionHead no="Ⅳ" zh="四面权重" en="FOUR FACES, WEIGHTED" note="按市场状态分配四面的权重" />
        <div className="border border-[rgb(var(--line))] overflow-x-auto">
          <div className="min-w-[640px]">
            <div className="grid grid-cols-5 hairline-b">
              <div className="px-5 py-4"><Label>市场状态</Label></div>
              {FACE_WEIGHTS.faces.map((f) => (
                <div key={f} className="px-5 py-4 text-right"><Label>{f}</Label></div>
              ))}
            </div>
            {FACE_WEIGHTS.rows.map((r, i) => {
              const max = Math.max(...r.weights)
              return (
                <div key={r.state} className={`grid grid-cols-5 items-baseline ${i > 0 ? 'hairline-t' : ''}`}>
                  <div className="px-5 py-5 font-serif-sc font-bold">{r.state}</div>
                  {r.weights.map((w, j) => (
                    <div key={j} className={`px-5 py-5 text-right font-mono-num tnum ${w === max ? 'ink font-medium' : 'ink-3'}`}>
                      {w}%
                    </div>
                  ))}
                </div>
              )
            })}
          </div>
        </div>
        <p className="mt-6 text-sm leading-loose ink-2 max-w-3xl">
          墨色加粗为该市场状态下权重最高的一面。趋势市里技术面的权重最高，熊市反弹里情绪面占一半——
          在不同的市场里用同一把尺子，是多数分析失效的原因。
        </p>
      </section>
    </div>
  )
}
