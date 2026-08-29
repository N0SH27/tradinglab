import { THESES, INDUSTRY_MAP, LEDGER, type Thesis } from '../data/content'
import { deriveThesisPolarity, type DerivedPolarity } from '../data/polarity'
import { deriveCurrentBelief, lastRevisedOf } from '../data/ledger'
import { Label, PageHead } from '../components/Bits'

/* 命题聚合页（V2-06-05 · Thesis as Belief Registry）。
   Thesis 不是文章目录，是当前仍然有效的投资判断及其随现实更新的注册表。
   注册行只放投影：Current Belief / Polarity / Horizon / Last Revised 全部
   经 data 层派生函数取数（与 ThesisDetail 同一入口，禁止页面内重复实现）；
   完整论证（阴阳两面 / 证据链 / A / I / 修订史）收进 ThesisDetail。
   不表达行情、ticker、信号、涨跌箭头——这里回答"我现在相信什么，以及为什么"。 */

/* 轻量极性标记：方块字形 + 文字，不引入第三个阴阳图形（全站 ≤2 硬约束） */
function PolarityMark({ p }: { p: DerivedPolarity | null }) {
  if (!p) return <span className="ink-3">—</span>
  const glyph = (s: 'yang' | 'yin' | 'turn') =>
    s === 'yang' ? (
      <span key="y" className="inline-block w-2 h-2 bg-ink" />
    ) : s === 'yin' ? (
      <span key="n" className="inline-block w-2 h-2 border border-current water" />
    ) : (
      <span key="t" className="inline-block w-2 h-2 bg-cinnabar" />
    )
  if (p.kind === 'single')
    return (
      <span className="inline-flex items-center gap-1.5">
        {glyph(p.state)}
        <span className="tracking-widest">{p.state.toUpperCase()}</span>
      </span>
    )
  if (p.kind === 'to-turn')
    return (
      <span className="inline-flex items-center gap-1.5">
        {glyph(p.from)}
        <span className="tracking-widest">{p.from.toUpperCase()} → TURN</span>
      </span>
    )
  return (
    <span className="inline-flex items-center gap-1.5">
      {glyph('yang')}
      {glyph('yin')}
      <span className="tracking-widest">MIXED</span>
    </span>
  )
}

/* 注册行：一个仍然有效的判断 */
function BeliefRow({ t }: { t: Thesis }) {
  const nodes = INDUSTRY_MAP.nodes
  // CURRENT BELIEF / LAST REVISED / POLARITY：与 ThesisDetail 同一派生入口
  const belief = deriveCurrentBelief(t, LEDGER)
  const lastRevised = lastRevisedOf(LEDGER, t.id, t.revisions[0]?.date ?? t.updated)
  const polarity = deriveThesisPolarity(t, nodes)
  return (
    <a
      href={`#/thesis/${t.id}`}
      className="block hairline-t py-8 md:py-10 group"
    >
      <div className="grid md:grid-cols-12 gap-x-6 gap-y-4 md:items-baseline">
        {/* 编号 + 状态 */}
        <div className="md:col-span-2 flex md:block items-baseline gap-3">
          <span className="font-mono-num tnum text-sm ink-3">{t.no}</span>
        </div>
        {/* 题名 + 一句核心主张（conflict.but = the claim） */}
        <div className="md:col-span-6">
          <h3 className="font-serif-sc font-bold text-xl md:text-2xl leading-snug tracking-tight group-hover:opacity-70 transition-opacity">
            {t.title}
          </h3>
          <p className="mt-3 text-sm ink-3 leading-relaxed line-clamp-2 md:line-clamp-1">
            虽然{t.conflict.although}——但是{t.conflict.but}
          </p>
        </div>
        {/* Current Belief */}
        <div className="md:col-span-1 md:text-right">
          <span className="font-mono-num tnum text-3xl font-medium">{belief}</span>
          <span className="font-mono-num tnum text-sm ink-3">%</span>
        </div>
        {/* Polarity / Horizon / Last Revised */}
        <div className="md:col-span-3 md:text-right space-y-2 text-xs">
          <div className="md:flex md:justify-end">
            <PolarityMark p={polarity} />
          </div>
          <p className="ink-3 tracking-wider">HORIZON · {t.window}</p>
          <p className="ink-3 font-mono-num tnum tracking-wider">LAST REVISED · {lastRevised}</p>
        </div>
      </div>
    </a>
  )
}

export default function Thesis() {
  // V2-06-04/05：Registry 只呈现 active；closed / invalidated 进 ARCHIVE 分区
  const active = THESES.filter((t) => (t.status ?? 'active') === 'active')
  const archived = THESES.filter((t) => t.status === 'closed' || t.status === 'invalidated')
  return (
    <div className="max-w-[1400px] mx-auto px-5 md:px-10">
      <PageHead
        no="02"
        zh="命题"
        en="THESIS"
        intro="不是文章目录，是信念注册表：当前仍然有效的投资判断，以及这些判断如何随现实变化而更新。每一行标注当前信念、阴阳极性、时间窗口与最近修正——完整论证与证伪条件收进单命题页。"
      />

      {/* 01 · ACTIVE BELIEFS */}
      <section className="pb-16 md:pb-24">
        <div className="flex items-baseline justify-between gap-4 mb-8 flex-wrap">
          <div className="flex items-baseline gap-4">
            <span className="font-mono-num tnum text-sm ink-3">01</span>
            <h2 className="font-serif-sc text-2xl md:text-3xl font-bold tracking-wide">当前命题</h2>
            <Label>ACTIVE BELIEFS</Label>
          </div>
          <span className="text-sm ink-3 font-mono-num tnum">{active.length} 项</span>
        </div>
        <div className="border-b border-[rgb(var(--line))]">
          {active.map((t) => (
            <BeliefRow key={t.id} t={t} />
          ))}
        </div>
      </section>

      {/* 02 · ARCHIVE：已结束的命题（closed）与被证伪的命题（invalidated）——
          Historical Beliefs，公开的 epistemic record，不做"失败案例墙"；
          无封闭命题时整区不渲染（不渲染空状态、不显示"暂无"、不制造测试数据） */}
      {archived.length > 0 && (
        <section className="pb-10">
          <div className="flex items-baseline gap-4 mb-2">
            <span className="font-mono-num tnum text-sm ink-3">02</span>
            <h2 className="font-serif-sc text-2xl md:text-3xl font-bold tracking-wide">存档</h2>
            <Label>ARCHIVE · What I once believed</Label>
          </div>
          <p className="text-sm ink-3 mb-10">已经结束的命题与被现实证伪的命题——两者语义不同，都保留完整修正史。</p>
          {(['closed', 'invalidated'] as const).map((s) => {
            const group = archived.filter((t) => t.status === s)
            if (group.length === 0) return null
            return (
              <div key={s} className="mb-10">
                <Label className="block mb-5 water">{s === 'closed' ? 'CLOSED · 命题完成' : 'INVALIDATED · 核心假设被证伪'}</Label>
                <div className="border border-[rgb(var(--line))]">
                  {group.map((t) => (
                    <a
                      key={t.id}
                      href={`#/thesis/${t.id}`}
                      className="ink-hv flex items-baseline justify-between gap-4 px-5 py-4 hairline-b last:border-b-0"
                    >
                      <span className="font-serif-sc font-bold tracking-wide">{t.title}</span>
                      <span className="font-mono-num tnum text-xs ink-3 shrink-0">{t.updated}</span>
                    </a>
                  ))}
                </div>
              </div>
            )
          })}
        </section>
      )}
    </div>
  )
}
