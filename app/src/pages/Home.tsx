import { useState } from 'react'
import { THESES, LEDGER } from '../data/content'
import { deriveCurrentBelief, lastRevisedOf } from '../data/ledger'
import { HSNSeal, HSNSymbol } from '../components/Brand'
import { PolarityInstrument, type PolarityState } from '../components/PolarityInstrument'
import { FlipCard } from '../components/FlipCard'
import { MapPreview } from '../components/MapPreview'
import { useRevealRoot } from '../hooks/useReveal'

/* ── V2 Homepage · COGNITIVE EXPERIENCE（V2-30 v1.0 LOCKED / V2-B FINAL 施工）──
 * 首页 = A Guided Entry Into HSN's Way of Seeing：ENTRY → NOW → SEE → THINK →
 * CHANGE → WUWEI（静默尾章）→ END。五场景是内部认知骨架（Scene ≠ Section）——
 * 本文件不得出现任何场景标签 / 幕间标题；场景靠阅读行为的切换区分。
 * 硬约束（V2-B FINAL · DELTA-01 · C-1，全部 LOCK）：
 * · NOW 三卡 = 真点击 Flip（表面 → 隐藏变量），文案 = V2-B §04 Human 定稿；
 * · SEE = Polarity（受控 Filter，是镜头不是解释器）+ MapPreview
 *   （Option A · 7 节点 6 真边；Node Detail 严格 = Name + State + EXPLORE WORLD）；
 * · THINK = 1 个 Current Belief（判断 > 数字）+ 1 份 Featured Research；
 * · CHANGE = 1 张 THEN/NOW/WHY 对比卡（存储周期 65→68）；
 * · ENTRY = 1 品牌 + 1 句宣言 + 1 入口（description 五行已 MOVE → Manifesto）；
 * · FOCUS 撤出首页（转 Research/World Derived View 入口，非本轮施工）。
 * 数据纪律：全部业务数据只读自 data layer；卡文案为 V2-B 批准的 presentation copy。 */

/* NOW × 3 Reading Cards（V2-B B-1 · Human PASS 定稿文案）
   类型标识按各报告真实日期落（事实纪律）：报告一/二 = 2026.08，报告四 = 2026.09。 */
const NOW_CARDS: {
  name: string
  type: string
  frontTitle: string
  frontBody: string
  backBody: React.ReactNode
  href: string
}[] = [
  {
    name: '存储',
    type: 'REPORT · 2026.08',
    frontTitle: '存储价格还在涨。',
    frontBody: 'DDR4 每月涨约两成，Q4 合约价再涨五成——但股价已经不跟了。',
    backBody: (
      <>
        价格还在涨。但买方开始用行动投票：下一代 AI 服务器把 HBM 从 12 层降到 8 层。
        <strong className="block mt-3 font-bold">涨价的终结者不是低价，而是方案降级。</strong>
      </>
    ),
    href: '#/research/report-2',
  },
  {
    name: '算力链',
    type: 'REPORT · 2026.08',
    frontTitle: 'AI 算力的瓶颈正在搬家。',
    frontBody: '最紧的环节从芯片，搬到了封装设备与厂房。',
    backBody: (
      <>
        瓶颈每迁移一次，价值就重新定价一次。现在的咽喉是封装：扩产要 18 个月。
        <strong className="block mt-3 font-bold">跟踪设备交期，比跟踪订单更领先。</strong>
      </>
    ),
    href: '#/research/report-1',
  },
  {
    name: '商保支付端',
    type: 'REPORT · 2026.09',
    frontTitle: '商保创新药目录执行已满半年。',
    frontBody: '通道建好了——水还没有来。',
    backBody: (
      <>
        目录内品种至今没有公开放量案例；今年最轰动的放量（英克司兰）走的是医保通道，不是商保。
        <strong className="block mt-3 font-bold">通道已建立，不等于通道已通水。</strong>
        <span className="block mt-2 text-sm text-[rgb(var(--paper))]/60">
          第一个检验点：2026 年底。
        </span>
      </>
    ),
    href: '#/research/report-4',
  },
]

/* Polarity Filter（HDG-2 Rotate 受控三选）：点击某一态 = 激活滤镜，再点取消；三态互斥。
   默认 = 完整切片。语义由 Map 的变化来教，不写解释段落（V2-B 修正③ · LOCK）。 */
const FILTER_META: Record<PolarityState, { zh: string; en: string; color: string }> = {
  yang: { zh: '阳', en: 'YANG', color: 'rgb(var(--ink))' },
  turn: { zh: '转换', en: 'TURN', color: 'rgb(var(--cinnabar))' },
  yin: { zh: '阴', en: 'YIN', color: 'rgb(var(--water))' },
}

export default function Home() {
  const rootRef = useRevealRoot<HTMLDivElement>()
  const [polarity, setPolarity] = useState<PolarityState | null>(null)

  /* Current Belief（V2-B B-3 · Human PASS WITH MODIFY：判断 > 数字） */
  const beliefThesis = THESES.find((t) => t.id === 'compute')!
  const belief = deriveCurrentBelief(beliefThesis, LEDGER)
  const beliefRevised = lastRevisedOf(
    LEDGER,
    beliefThesis.id,
    beliefThesis.revisions[0]?.date ?? beliefThesis.updated,
  )

  /* CHANGE（V2-B B-5 · Human PASS）：存储周期修正 65→68，数字只读自 Ledger */
  const revision = LEDGER.find((r) => r.id === 'rev-memory-cycle-20260830')!

  const enter = () => {
    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    document.getElementById('home-now')?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' })
  }

  return (
    <div ref={rootRef}>
      {/* ── ENTRY · 1 品牌 + 1 句宣言 + 1 入口（B-6 宣言版 · 整屏静态零开场动效） ── */}
      <section className="max-w-[1400px] mx-auto px-5 md:px-10 min-h-[88vh] flex flex-col justify-center py-24">
        <HSNSymbol size={110} className="opacity-90" />
        <h1 className="mt-12 md:mt-16 font-serif-sc font-black leading-[1.08] tracking-tight text-[clamp(2.8rem,9vw,8rem)]">
          观察变化，
          <br />
          而非预测未来<span className="cinnabar">。</span>
        </h1>
        <div className="mt-16 md:mt-24 hairline-t pt-5">
          <button
            type="button"
            onClick={enter}
            className="font-mono-num text-sm tracking-[0.3em] ink-3 hover:text-[rgb(var(--ink))] cursor-pointer transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[rgb(var(--cinnabar))]"
          >
            ENTER ↓
          </button>
        </div>
      </section>

      {/* ── NOW · 三张阅读卡（Flip：表面 → 隐藏变量） ── */}
      <section id="home-now" className="hairline-t">
        <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-20 md:py-28">
          <div className="grid md:grid-cols-3 gap-4 md:gap-5" data-reveal>
            {NOW_CARDS.map((c) => (
              <FlipCard
                key={c.name}
                label={c.name}
                front={
                  <>
                    <span className="label-sm ink-3 block mb-6">{c.type}</span>
                    <span className="font-serif-sc font-bold text-xl md:text-2xl tracking-tight leading-snug block mb-4">
                      {c.frontTitle}
                    </span>
                    <span className="text-sm ink-2 leading-relaxed block">{c.frontBody}</span>
                  </>
                }
                back={
                  <p className="text-sm md:text-base leading-loose text-[rgb(var(--paper))]/85">
                    {c.backBody}
                  </p>
                }
                cta={[{ href: c.href, label: 'EXPLORE RESEARCH →' }]}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── SEE · Polarity（Lens）+ World at a Glance（Map Preview） ── */}
      <section className="hairline-t">
        <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-24 md:py-36">
          <div className="grid md:grid-cols-12 gap-10 md:gap-16 items-start">
            <div className="md:col-span-4" data-reveal>
              <PolarityInstrument
                value={polarity ?? 'yang'}
                interactive={false}
                size={130}
                showLabel={false}
                className={polarity ? '' : 'opacity-40'}
              />
              <p className="mt-10 font-serif-sc text-xl md:text-2xl font-bold leading-relaxed tracking-tight">
                变化，不是线性的。
              </p>
              <div className="mt-8 flex gap-7" role="group" aria-label="Polarity view filter">
                {(Object.keys(FILTER_META) as PolarityState[]).map((s) => {
                  const meta = FILTER_META[s]
                  const on = polarity === s
                  return (
                    <button
                      key={s}
                      type="button"
                      aria-pressed={on}
                      onClick={() => setPolarity((cur) => (cur === s ? null : s))}
                      className={`text-left cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-[rgb(var(--cinnabar))] ${
                        on ? 'font-bold underline underline-offset-8' : 'ink-3 hover:text-[rgb(var(--ink))]'
                      } transition-colors`}
                      style={on ? { color: meta.color } : undefined}
                    >
                      <span className="font-serif-sc text-lg leading-none block">{meta.zh}</span>
                      <span className="font-mono-num text-[10px] tracking-[0.2em]">{meta.en}</span>
                    </button>
                  )
                })}
              </div>
            </div>
            <div className="md:col-span-8" data-reveal>
              <MapPreview active={polarity} />
            </div>
          </div>
        </div>
      </section>

      {/* ── THINK · 1 个 Current Belief + 1 份 Featured Research（阅读宽度） ── */}
      <section className="hairline-t">
        <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-20 md:py-28">
          {/* Current Belief：判断 > 数字（B-3 · PASS WITH MODIFY · LOCK）。
              视觉层级 = 当前判断 → WHY / WHAT COULD CHANGE IT / HISTORY → conviction（辅助）。 */}
          <div className="max-w-3xl" data-reveal>
            <span className="label-sm ink-3 block mb-8">WHAT I BELIEVE NOW</span>
            <p className="font-serif-sc font-bold text-2xl md:text-4xl leading-snug tracking-tight">
              国产算力正在从「可用」变成「必须用」：推理时代的需求是分散的、对成本敏感的——这恰好是追赶者的主场。但天花板在供给端，不在需求端。
            </p>
            <div className="mt-10 flex gap-x-8 gap-y-3 flex-wrap">
              <a href="#/thesis/compute" className="btn-line">
                WHY →
              </a>
              <a href="#/thesis/compute" className="btn-line">
                WHAT COULD CHANGE IT →
              </a>
              <a href="#/journal" className="btn-line">
                HISTORY →
              </a>
            </div>
            {/* conviction = metadata，不是内容：小字、不居中、无仪表盘 */}
            <p className="mt-8 font-mono-num tnum text-xs ink-3 tracking-widest">
              CONVICTION {belief} · 修正 {beliefRevised} · {beliefThesis.window}
            </p>
          </div>

          {/* Featured Research（B-4 · PASS：维持报告一；CANONICAL 系统语言已清除） */}
          <div className="mt-16 md:mt-20 max-w-2xl" data-reveal>
            <FlipCard
              label="中国 AI 算力基础设施产业链研究"
              front={
                <>
                  <span className="label-sm ink-3 block mb-6">行业研究 · 2026.08</span>
                  <span className="font-serif-sc font-bold text-xl md:text-2xl tracking-tight leading-snug block mb-4">
                    中国 AI 算力基础设施，正在发生什么？
                  </span>
                  <span className="text-sm ink-2 leading-relaxed block">
                    从算力芯片到电力约束，一条完整链条的三年观察。
                  </span>
                </>
              }
              back={
                <p className="text-sm md:text-base leading-loose text-[rgb(var(--paper))]/85">
                  需求的确定性高于供给的确定性；瓶颈正沿链条迁移（制程 → 封装 → 电力），而多数环节的景气与估值已经分离。
                </p>
              }
              cta={[
                { href: '#/research/report-1@five-min', label: 'READ 5 MIN →' },
                { href: '#/research/report-1@deep-dive', label: 'DEEP DIVE →' },
              ]}
            />
          </div>
        </div>
      </section>

      {/* ── CHANGE · 一张 THEN / NOW / WHY 对比卡（B-5 · PASS：存储周期 65→68） ── */}
      <section className="hairline-t">
        <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-20 md:py-28">
          <div className="max-w-4xl mx-auto border border-[rgb(var(--line))] p-8 md:p-12" data-reveal>
            <span className="label-sm ink-3 block mb-10">WHAT CHANGED</span>
            <div className="grid md:grid-cols-12 gap-6 md:gap-8 items-baseline">
              <span className="md:col-span-3 font-serif-sc font-bold text-xl md:text-2xl tracking-tight">
                存储周期
              </span>
              <span className="md:col-span-3 font-mono-num tnum">
                <span className="block text-xs ink-3 tracking-widest mb-2">THEN → NOW</span>
                <span className="text-2xl md:text-3xl font-medium">
                  {revision.previous} → {revision.current}
                </span>
              </span>
              <p className="md:col-span-6 text-sm md:text-base ink-2 leading-relaxed">
                买方开始降级硬件方案（HBM 12 层 → 8 层）——涨价的失效从股价蔓延到了产品层。
              </p>
            </div>
            <div className="mt-10 flex justify-end">
              <a href="#/thesis/memory-cycle" className="btn-line">
                SEE REVISION →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── WUWEI · 静默尾章（OQ-1）：少、静、留白；无 CTA、无营销 ── */}
      <section className="hairline-t">
        <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-28 md:py-40 text-center">
          <p className="font-serif-sc text-lg md:text-xl ink-2 leading-relaxed" data-reveal>
            有时，正确的仓位是空仓。
          </p>
        </div>
      </section>

      {/* ── END · 终幕（保留现状） ── */}
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
