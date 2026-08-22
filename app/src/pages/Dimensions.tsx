import { FOUR_DIMENSIONS, COUNTERCLOCKWISE, DIMENSIONS_NOTE } from '../data/content'
import { Label, PageHead, SectionHead, PolarityTag } from '../components/Bits'

export default function Dimensions() {
  return (
    <div className="max-w-[1400px] mx-auto px-5 md:px-10">
      <PageHead no="07" zh="四象" en="FOUR DIMENSIONS" intro={DIMENSIONS_NOTE} />

      {/* ── 四象阴阳 ─────────────────────── */}
      <section className="hairline-t pt-14 md:pt-20 pb-20 md:pb-28">
        <div className="grid md:grid-cols-2 gap-px bg-[rgb(var(--line))] border border-[rgb(var(--line))]">
          {FOUR_DIMENSIONS.map((d) => (
            <div key={d.name} className="bg-paper p-6 md:p-12">
              <div className="flex items-start justify-between mb-8">
                <span className="font-serif-sc font-black text-6xl md:text-8xl leading-none">{d.name}</span>
                <div className="text-right">
                  <PolarityTag polarity={d.polarity} />
                  <Label className="block mt-2">{d.en}</Label>
                </div>
              </div>
              <p className="font-serif-sc font-bold text-lg md:text-xl mb-5">{d.essence}</p>
              <p className="text-sm md:text-base leading-loose ink-2 mb-8">{d.body}</p>
              <ul className="space-y-3">
                {d.rules.map((r, i) => (
                  <li key={i} className="flex gap-3 text-sm leading-relaxed ink-2 hairline-b pb-3 last:border-0">
                    <span className={`mt-1.5 shrink-0 w-1.5 h-1.5 ${d.polarity === 'yang' ? 'bg-ink' : 'border border-[rgb(var(--water))]'}`} />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm leading-loose ink-2 max-w-3xl">
          读法：量价可测，时空不可测。可测的阳面给你入场的位置，不可测的阴面决定你该不该在场。
          当时空要素强于量价时，往往预示股价向好的质变——阴，有时比阳更有决定权。
        </p>
      </section>

      {/* ── 逆时针曲线 ────────────────────── */}
      <section className="pb-20 md:pb-28">
        <SectionHead no="◔" zh="逆时针曲线" en="COUNTERCLOCKWISE CURVE" note="一笔完整交易的九个位置" />
        <div className="grid grid-cols-3 gap-px bg-[rgb(var(--line))] border border-[rgb(var(--line))] max-w-3xl">
          {/* 按逆时针布局：左列自下而上，顶行自左而右 */}
          {[4, 3, 2, 5, 0, 1, 6, 7, 8].map((idx) => {
            const isHolding = idx === 4
            const isWatch = idx === 0
            return (
              <div
                key={idx}
                className={`bg-paper aspect-square flex flex-col items-center justify-center gap-3 ${
                  isHolding ? 'bg-ink text-[rgb(var(--paper))]' : ''
                }`}
              >
                <span className={`font-mono-num tnum text-xs ${isHolding ? '' : 'ink-3'}`}>
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <span className={`font-serif-sc font-bold text-lg md:text-2xl ${
                  isWatch ? 'water' : ''
                }`}>
                  {COUNTERCLOCKWISE[idx]}
                </span>
              </div>
            )
          })}
        </div>
        <div className="mt-8 grid md:grid-cols-2 gap-8 max-w-4xl">
          <p className="text-sm leading-loose ink-2">
            从「观察」出发，逆时针行进：反转确认后买入，持续买入，进入持有；警告出现则卖出，
            持续卖出，直至清仓——然后回到观察。九宫格的中心是「持有」：
            整个交易过程中时间占比最长的状态，恰恰是什么都不做的状态。
          </p>
          <p className="text-sm leading-loose ink-2">
            利弗莫尔说：从来不是思考替我赚大钱，而是我的坐功。在你什么都不做的时候，
            那些觉得每天都必须买进卖出的投机者，正在为你的下一次出手打基础。
          </p>
        </div>
      </section>

      {/* ── 关键量价法则 ──────────────────── */}
      <section className="hairline-t py-16 md:py-24">
        <div className="max-w-4xl space-y-10">
          <div>
            <Label className="block mb-3">法则一</Label>
            <p className="font-serif-sc font-bold text-2xl md:text-4xl leading-snug">脚踩巨量翻倍涨</p>
            <p className="mt-4 text-sm md:text-base leading-loose ink-2 max-w-2xl">
              当时间和空间（均线价格）将历史放量的位置踩在脚下，股价将产生质的飞跃——天量见天价。
              历史巨量代表曾经的多空分歧；经过时间沉淀站稳之后，分歧转为一致，虚的阻力位转化为实的支撑位。
            </p>
          </div>
          <div>
            <Label className="block mb-3">法则二</Label>
            <p className="font-serif-sc font-bold text-2xl md:text-4xl leading-snug">有量要有价，量价要配合</p>
            <p className="mt-4 text-sm md:text-base leading-loose ink-2 max-w-2xl">
              天量之后是天价，天价之后防回调。放量滞涨是危险信号，巨量不涨先退场。
              承接要看关键位置——关键位置决定了趋势与结构的边界。
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
