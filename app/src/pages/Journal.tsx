import { JOURNAL, LEDGER, THESES } from '../data/content'
import { deltaOf } from '../data/ledger'
import { PageHead, Label } from '../components/Bits'

const TYPE_META: Record<string, { mark: string; label: string; red?: boolean }> = {
  up: { mark: '↑', label: '上调概率' },
  down: { mark: '↓', label: '下调概率' },
  risk: { mark: '△', label: '新增风险', red: true },
  new: { mark: '＋', label: '新增记录' },
}

/* 日志页（V2-06-04）：双层结构——
   01 REVISION = WHAT CHANGED MY MIND（Belief Ledger 事实层投影：改变了什么）
   02 叙事流 = 既有日期分组日志（narrative record：为什么这样想）
   Ledger is the factual record. Journal is the narrative record. */
export default function Journal() {
  return (
    <div className="max-w-[1400px] mx-auto px-5 md:px-10">
      <PageHead
        no="10"
        zh="日志"
        en="JOURNAL"
        intro="不是日记，而是研究的迭代史。每一次观点的修正都留下日期、方向与原因——沉默地改观点，是研究的死亡。"
      />

      {/* ── 01 REVISION · WHAT CHANGED MY MIND ── */}
      <section className="border-t border-[rgb(var(--line))] py-12 md:py-16">
        <div className="flex items-baseline justify-between mb-10 md:mb-14">
          <Label>REVISION · WHAT CHANGED MY MIND</Label>
        </div>
        <div>
          {LEDGER.map((r) => {
            const delta = deltaOf(r)
            const thesis = THESES.find((t) => t.id === r.thesisId)
            return (
              <a
                key={r.id}
                href={`#/thesis/${r.thesisId}`}
                className="ink-row group grid grid-cols-12 items-baseline gap-3 md:gap-6 py-7 md:py-8 hairline-b px-2 md:px-4 -mx-2 md:-mx-4"
              >
                <span className="col-span-6 md:col-span-2 font-mono-num tnum text-xs ink-3">{r.date}</span>
                <span className="col-span-12 md:col-span-3 font-serif-sc font-bold text-lg md:text-xl tracking-tight order-first md:order-none">
                  {thesis?.title ?? r.thesisId}
                </span>
                <span className="col-span-6 md:col-span-2 font-mono-num tnum text-xl md:text-2xl font-medium md:text-right">
                  {r.previous} → {r.current}
                  <span className={`text-sm ml-2 ${delta > 0 ? 'cinnabar' : delta < 0 ? 'water' : 'ink-3'}`}>
                    {delta > 0 ? '+' : ''}{delta}
                  </span>
                </span>
                <span className="col-span-12 md:col-span-5 text-sm ink-2 leading-relaxed">{r.reason}</span>
              </a>
            )
          })}
        </div>
      </section>

      {/* ── 02 叙事流 · 研究日志 ── */}
      <section className="py-4 md:py-8">
        <div className="flex items-baseline justify-between mb-4 md:mb-6">
          <Label>NARRATIVE · 研究叙事</Label>
        </div>
        <div className="border-t border-[rgb(var(--line))]">
          {JOURNAL.map((entry) => (
            <section key={entry.date} className="grid md:grid-cols-12 gap-6 md:gap-10 py-12 md:py-16 hairline-b">
              <div className="md:col-span-3">
                <span className="font-mono-num tnum text-2xl md:text-3xl font-medium">{entry.date}</span>
              </div>
              <div className="md:col-span-8 md:col-start-5 space-y-8">
                {entry.items.map((item, i) => {
                  const meta = TYPE_META[item.type]
                  const inner = (
                    <>
                      <div className="flex items-baseline gap-3 mb-2 flex-wrap">
                        <span className="font-serif-sc font-bold text-lg">{item.target}</span>
                      </div>
                      <p className="text-sm md:text-base leading-relaxed ink-2">{item.note}</p>
                    </>
                  )
                  return (
                    <div key={i} className="flex gap-5 md:gap-8 items-start">
                      <span
                        className={`font-mono-num tnum text-2xl leading-none shrink-0 w-8 ${
                          meta.red ? 'ink' : ''
                        }`}
                      >
                        {meta.mark}
                      </span>
                      {item.thesisId ? (
                        <a href={`#/thesis/${item.thesisId}`} className="ink-hv block">{inner}</a>
                      ) : (
                        <div>{inner}</div>
                      )}
                    </div>
                  )
                })}
              </div>
            </section>
          ))}
        </div>
      </section>

      <div className="py-16 md:py-24 text-center">
        <p className="font-serif-sc text-xl md:text-2xl font-bold tracking-wide">
          错误的修正记录，比正确的预测更值得展示。
        </p>
      </div>
    </div>
  )
}
