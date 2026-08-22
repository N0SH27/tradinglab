import { JOURNAL } from '../data/content'
import { PageHead } from '../components/Bits'

const TYPE_META: Record<string, { mark: string; label: string; red?: boolean }> = {
  up: { mark: '↑', label: '上调概率' },
  down: { mark: '↓', label: '下调概率' },
  risk: { mark: '△', label: '新增风险', red: true },
  new: { mark: '＋', label: '新增记录' },
}

export default function Journal() {
  return (
    <div className="max-w-[1400px] mx-auto px-5 md:px-10">
      <PageHead
        no="07"
        zh="日志"
        en="JOURNAL"
        intro="不是日记，而是研究的迭代史。每一次观点的修正都留下日期、方向与原因——沉默地改观点，是研究的死亡。"
      />

      <div className="border-t border-[rgb(var(--line))]">
        {JOURNAL.map((entry) => (
          <section key={entry.date} className="grid md:grid-cols-12 gap-6 md:gap-10 py-12 md:py-16 hairline-b">
            <div className="md:col-span-3">
              <span className="font-mono-num tnum text-2xl md:text-3xl font-medium">{entry.date}</span>
            </div>
            <div className="md:col-span-8 md:col-start-5 space-y-8">
              {entry.items.map((item, i) => {
                const meta = TYPE_META[item.type]
                return (
                  <div key={i} className="flex gap-5 md:gap-8 items-start">
                    <span
                      className={`font-mono-num tnum text-2xl leading-none shrink-0 w-8 ${
                        meta.red ? 'ink' : ''
                      }`}
                    >
                      {meta.mark}
                    </span>
                    <div>
                      <div className="flex items-baseline gap-3 mb-2 flex-wrap">
                        <span className="font-serif-sc font-bold text-lg">{item.target}</span>
                      </div>
                      <p className="text-sm md:text-base leading-relaxed ink-2">{item.note}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        ))}
      </div>

      <div className="py-16 md:py-24 text-center">
        <p className="font-serif-sc text-xl md:text-2xl font-bold tracking-wide">
          错误的修正记录，比正确的预测更值得展示。
        </p>
      </div>
    </div>
  )
}
