import { useState } from 'react'
import { THESES, LEDGER, SITE } from '../data/content'
import { deltaOf, deriveCurrentBelief, lastRevisedOf, latestChanges } from '../data/ledger'
import { HSNSeal, HSNSymbol } from '../components/Brand'
import { PolarityInstrument, type PolarityState } from '../components/PolarityInstrument'
import { FlipCard } from '../components/FlipCard'
import { MapPreview } from '../components/MapPreview'
import { useRevealRoot } from '../hooks/useReveal'

/* ── V2-C.1 Homepage · 2026-09-05 Human 裁决施工 ────────────────────────────
 * 首页 = 三大内容主体 + 两个认知节拍：
 *   首屏宣言（HSN / 交易探索实验室 / 宣言五行，无图形 Logo、无 ENTER）
 *   → ① Research（当前值得探索的研究卡，数量由真实 Report 决定）
 *   → 阴阳 Lens（三态滤镜 + 极简语义，无下划线）
 *   → ② World（Map Preview：点亮节点一步直达 Primary Home）
 *   → ③ What Changed（LEDGER 派生：每命题最新一条 delta≠0 真实变化）
 *   → WUWEI（静默收束 + 唯一极简入口）
 *   → END（不动）
 * 减法（Human 裁决）：THINK 区（Current Belief / WHY / WHAT COULD CHANGE IT /
 * Featured Research）整体撤出首页——Thesis / Research 页面不受影响。
 * 纪律：Scene ≠ Section（界面不出现内部场景名）；业务数据只读自 data layer；
 * What Changed 一律经 latestChanges 派生，confirm（delta=0）不投影为变化。 */

/* Research 阅读卡（V2-C.1：卡数不再固定为 3，由真实 Report 决定；本轮 = 4。
   类型标识按各报告真实日期落（事实纪律）：一/二/三 = 2026.08，四 = 2026.09。 */
const RESEARCH_CARDS: {
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
    name: '电力',
    type: 'REPORT · 2026.08',
    frontTitle: '算力的尽头是电力。',
    frontBody: '当所有人盯着芯片，电力指标正成为智算中心选址的第一约束。',
    backBody: (
      <>
        约束的硬度不来自叙事：电网临界点已被主要经济体普遍越过，容量电价把约束变成了钱。
        <strong className="block mt-3 font-bold">谁先把约束变成可跟踪的指标，谁就拥有稀缺的定价锚。</strong>
      </>
    ),
    href: '#/research/report-3',
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

/* Polarity Filter（受控三选：点击 = 激活滤镜，再点取消；三态互斥；默认 = 完整切片）。
   V2-C.1：选中态不再用下划线（重复编码删除）；hint 取自 PolarityInstrument
   既有批准语义词汇（META.words），三行等距排列——Lens 有最小语义，但不写解释段落。 */
const FILTER_META: Record<PolarityState, { zh: string; en: string; hint: string; color: string }> = {
  yang: { zh: '阳', en: 'YANG', hint: '增长 · 采纳 · 扩张', color: 'rgb(var(--ink))' },
  turn: { zh: '转换', en: 'TURN', hint: '过渡 · 反转 · 拐点', color: 'rgb(var(--cinnabar))' },
  yin: { zh: '阴', en: 'YIN', hint: '约束 · 出清 · 收缩', color: 'rgb(var(--water))' },
}

export default function Home() {
  const rootRef = useRevealRoot<HTMLDivElement>()
  const [polarity, setPolarity] = useState<PolarityState | null>(null)

  /* WHAT CHANGED（V2-C.1 · Human 裁决：3～5 条真实变化，LEDGER 派生）：
     每命题最新一条 delta≠0，时间倒序；confirm 不投影，底层账本不动。 */
  const changes = latestChanges(LEDGER, 5)

  return (
    <div ref={rootRef}>
      {/* ── 首屏宣言（V2-C.1 修正② · 2026-09-06 00:07 Human：三段式左对齐——
          ① 大标题 + 黑色 Logo（位于标题右侧，不落入左上角标题栏邻近区）；
          ② 宣言四行按现有断句左对齐；
          ③ 「玄之又玄，众妙之门。」单独居中、字号稍大——作为总结并开启下文；
          无 ENTER，图形 Logo 不重复于左上角） ── */}
      <section className="max-w-[1400px] mx-auto px-5 md:px-10 min-h-[80vh] flex flex-col justify-center pt-24 pb-10 md:pb-12">
        <div data-reveal>
          <h1 className="font-serif-sc font-black leading-[1.08] tracking-tight text-[clamp(2.8rem,9vw,8rem)]">
            观察变化，
            <br />
            而非预测未来<span className="cinnabar">。</span>
          </h1>
          <div className="mt-14 md:mt-20 max-w-xl space-y-2">
            {SITE.description.slice(0, -1).map((line, i) => (
              <p key={i} className="text-base md:text-lg leading-relaxed ink-2">
                {line}
              </p>
            ))}
          </div>
          <p className="mt-14 md:mt-16 text-center font-serif-sc font-bold text-xl md:text-2xl leading-relaxed tracking-wide">
            {SITE.description[SITE.description.length - 1]}
          </p>
          <div className="mt-10 md:mt-12 flex justify-center">
            <HSNSymbol size={72} className="opacity-90" />
          </div>
        </div>
      </section>

      {/* ── ① Research · 当前值得探索的研究（Flip：表面 → 隐藏变量 → EXPLORE） ── */}
      <section className="hairline-t">
        <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-20 md:py-28">
          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-5" data-reveal>
            {RESEARCH_CARDS.map((c) => (
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
                cta={{ href: c.href, label: 'EXPLORE →' }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── 阴阳 Lens + ② World · Map Preview ── */}
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
                        on ? 'font-bold' : 'ink-3 hover:text-[rgb(var(--ink))]'
                      } transition-colors`}
                      style={on ? { color: meta.color } : undefined}
                    >
                      <span className="font-serif-sc text-lg leading-none block">{meta.zh}</span>
                      <span className="mt-1.5 font-mono-num text-[10px] tracking-[0.2em] block">{meta.en}</span>
                      <span className="mt-1.5 text-xs leading-none block ink-3">{meta.hint}</span>
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

      {/* ── ③ What Changed · 每命题最新一条真实变化（判断 > 数字，数字只读自 Ledger） ── */}
      <section className="hairline-t">
        <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-20 md:py-28">
          <div className="max-w-4xl mx-auto" data-reveal>
            <span className="label-sm ink-3 block mb-10">WHAT CHANGED</span>
            <div className="border-t border-[rgb(var(--line))]">
              {changes.map((r) => {
                const thesis = THESES.find((t) => t.id === r.thesisId)!
                const belief = deriveCurrentBelief(thesis, LEDGER)
                const delta = deltaOf(r)
                return (
                  <a
                    key={r.id}
                    href={`#/thesis/${thesis.id}`}
                    className="group grid md:grid-cols-12 gap-x-6 gap-y-2 items-baseline py-7 md:py-8 hairline-b"
                  >
                    <span className="md:col-span-3">
                      <span className="font-serif-sc font-bold text-xl md:text-2xl tracking-tight group-hover:opacity-70 transition-opacity">
                        {thesis.industry.split(' / ')[0]}
                      </span>
                      <span className="block mt-2 font-mono-num tnum text-xs ink-3 tracking-widest">
                        {lastRevisedOf(LEDGER, thesis.id, thesis.revisions[0]?.date ?? thesis.updated)}
                      </span>
                    </span>
                    <span className="md:col-span-3 font-mono-num tnum">
                      <span className="text-2xl md:text-3xl font-medium">
                        {r.previous} → {belief}
                      </span>
                      <span className={`text-sm ml-2 ${delta > 0 ? 'cinnabar' : 'water'}`}>
                        {delta > 0 ? '+' : ''}
                        {delta}
                      </span>
                    </span>
                    <span className="md:col-span-6 text-sm ink-2 leading-relaxed line-clamp-2">
                      {r.reason}
                    </span>
                  </a>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── WUWEI · 静默收束（V2-C.1 Option A：一句话 + 唯一极简入口，无营销） ── */}
      <section className="hairline-t">
        <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-28 md:py-40 text-center">
          <p className="font-serif-sc text-lg md:text-xl ink-2 leading-relaxed" data-reveal>
            有时，正确的仓位是空仓。
          </p>
          <a
            href="#/wuwei"
            className="mt-10 inline-block font-mono-num text-xs tracking-[0.3em] ink-3 hover:text-[rgb(var(--ink))] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[rgb(var(--cinnabar))]"
            data-reveal
          >
            WUWEI →
          </a>
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
