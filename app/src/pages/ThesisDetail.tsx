import { THESES, INDUSTRY_MAP, LEDGER, type Thesis } from '../data/content'
import { deriveThesisPolarity, formatPolarity } from '../data/polarity'
import {
  revisionsOf,
  deltaOf,
  directionOf,
  lastRevisedOf,
  deriveCurrentBelief,
} from '../data/ledger'
import type { Revision } from '../data/domains/ledger'
import { Label, PolarityTag } from '../components/Bits'
import { BackNav } from '../ink/BackNav'

/* 单命题页（V2-06-04 Revision Engine / Belief Ledger Presentation）。
   信息优先级（契约）：CURRENT BELIEF → THESIS → WHY → WHAT WOULD CHANGE MY MIND
   → REVISION HISTORY → EVIDENCE → MAP CONNECTIONS。
   CURRENT BELIEF 一律经 deriveCurrentBelief（Ledger 最终 SSOT，
   thesis.probability 仅 migration-era fallback）；修订史单一 canonical 呈现：
   Ledger 为事实层，legacy Thesis.revisions 仅作叙事存档且按日期去重。 */

/* WHY · 阴阳两面（论据并存，不作结论） */
function YinYangColumns({ t }: { t: Thesis }) {
  return (
    <div className="grid md:grid-cols-2 gap-px bg-[rgb(var(--line))] border border-[rgb(var(--line))]">
      <div className="bg-paper p-6 md:p-8">
        <div className="flex items-center gap-2.5 mb-5">
          <span className="inline-block w-2.5 h-2.5 bg-ink" />
          <span className="text-sm font-medium tracking-widest">阳面 · 看多逻辑</span>
        </div>
        <ul className="space-y-4">
          {t.yang.map((y, i) => (
            <li key={i} className="flex gap-3 text-sm leading-relaxed ink-2">
              <span className="font-mono-num tnum ink-3 shrink-0">{String(i + 1).padStart(2, '0')}</span>
              <span>{y}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-paper p-6 md:p-8">
        <div className="flex items-center gap-2.5 mb-5 water">
          <span className="inline-block w-2.5 h-2.5 border border-current" />
          <span className="text-sm font-medium tracking-widest">阴面 · 看空逻辑</span>
        </div>
        <ul className="space-y-4">
          {t.yin.map((y, i) => (
            <li key={i} className="flex gap-3 text-sm leading-relaxed ink-2">
              <span className="font-mono-num tnum ink-3 shrink-0">{String(i + 1).padStart(2, '0')}</span>
              <span>{y}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

/* 修订史时间线行：revision = Ledger 事实；narrative = legacy 叙事存档 */
type TimelineRow =
  | { kind: 'revision'; r: Revision }
  | { kind: 'narrative'; date: string; note: string }

function RevisionRow({ r }: { r: Revision }) {
  const delta = deltaOf(r)
  const direction = directionOf(r)
  return (
    <li className="flex gap-5">
      <span className="font-mono-num tnum text-xs ink-3 mt-1 shrink-0 w-20">{r.date}</span>
      <div>
        <span className="flex items-baseline gap-3 flex-wrap mb-1.5">
          <span className="font-mono-num tnum text-sm">
            {r.previous} → {r.current}
            <span className="ink-3">（{delta > 0 ? '+' : ''}{delta}）</span>
          </span>
          {/* CONFIRM 与 UP/DOWN 同级三态；一律墨灰，朱砂只留既有风险/TURN 语义 */}
          <span className="label-sm ink-3">{direction.toUpperCase()}</span>
        </span>
        <p className="text-sm ink-2 leading-relaxed">{r.reason}</p>
        {r.note && <p className="mt-2 text-xs ink-3 leading-relaxed">{r.note}</p>}
        {r.evidence && r.evidence.length > 0 && (
          <ul className="mt-3 space-y-1.5">
            {r.evidence.map((e, i) => (
              <li key={i} className="text-xs ink-3 leading-relaxed">· {e}</li>
            ))}
          </ul>
        )}
      </div>
    </li>
  )
}

export default function ThesisDetail({ id }: { id: string }) {
  const thesis = THESES.find((t) => t.id === id)

  if (!thesis) {
    return (
      <div className="max-w-[1400px] mx-auto px-5 md:px-10 pt-40 pb-32 text-center">
        <p className="font-serif-sc text-2xl font-bold mb-6">命题不存在</p>
        <a href="#/thesis" className="btn-line">返回命题</a>
      </div>
    )
  }

  const nodes = INDUSTRY_MAP.nodes
  const linkedNodes = (thesis.nodes ?? [])
    .map((nid) => nodes.find((n) => n.id === nid))
    .filter((n): n is NonNullable<typeof n> => n !== undefined)
  const polarity = formatPolarity(deriveThesisPolarity(thesis, nodes))

  // CURRENT BELIEF：Ledger 最终 SSOT（无账本记录时回落 migration-era snapshot）
  const currentBelief = deriveCurrentBelief(thesis, LEDGER)
  // LAST REVISED：Ledger 末条优先，fallback = legacy revisions 首条（数组新→旧）
  const lastRevised = lastRevisedOf(LEDGER, thesis.id, thesis.revisions[0]?.date ?? thesis.updated)

  // 单一 REVISION HISTORY：Ledger 事实 + legacy 叙事（按日期去重，同一事件不重复呈现）
  const ledgerEntries = revisionsOf(LEDGER, thesis.id)
  const ledgerDates = new Set(ledgerEntries.map((r) => r.date))
  const legacyNarrative = thesis.revisions.filter((r) => !ledgerDates.has(r.date))
  const timeline: TimelineRow[] = [
    ...ledgerEntries.map((r): TimelineRow => ({ kind: 'revision', r })),
    ...legacyNarrative.map((n): TimelineRow => ({ kind: 'narrative', date: n.date, note: n.note })),
  ].sort((a, b) => {
    const da = a.kind === 'revision' ? a.r.date : a.date
    const db = b.kind === 'revision' ? b.r.date : b.date
    return da > db ? -1 : da < db ? 1 : 0
  })

  return (
    <article className="max-w-[1400px] mx-auto px-5 md:px-10">
      {/* 返回 = 收束：桌面展示，移动端由左缘右滑承担 */}
      <div className="pt-24 md:pt-28 hidden md:block">
        <BackNav to="/thesis" label="命题" />
      </div>

      {/* 1 · CURRENT BELIEF */}
      <header className="pt-24 md:pt-12 pb-14 md:pb-16 max-w-3xl">
        <div className="flex items-baseline gap-4 mb-8 flex-wrap">
          <span className="font-mono-num tnum text-sm ink-3">{thesis.no}</span>
          <Label className="water">{thesis.industry}</Label>
          <Label>更新 {thesis.updated}</Label>
        </div>
        <h1 className="font-serif-sc font-black text-3xl md:text-5xl leading-tight tracking-tight mb-10">
          {thesis.title}
        </h1>

        {/* 当前信念仪表条：conviction / polarity / horizon / last revised */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[rgb(var(--line))] border border-[rgb(var(--line))]">
          <div className="bg-paper p-5">
            <Label className="block mb-2">CONVICTION</Label>
            <span className="font-mono-num tnum text-3xl md:text-4xl font-medium">{currentBelief}%</span>
          </div>
          <div className="bg-paper p-5">
            <Label className="block mb-2">POLARITY</Label>
            <span className="font-mono-num text-sm tracking-widest">{polarity ?? '—'}</span>
          </div>
          <div className="bg-paper p-5">
            <Label className="block mb-2">HORIZON</Label>
            <span className="font-mono-num text-sm tracking-widest">{thesis.window}</span>
          </div>
          <div className="bg-paper p-5">
            <Label className="block mb-2">LAST REVISED</Label>
            <span className="font-mono-num tnum text-sm tracking-widest">{lastRevised}</span>
          </div>
        </div>
      </header>

      {/* 2 · THESIS：核心矛盾 */}
      <section className="hairline-t pt-12 md:pt-16 pb-14 max-w-3xl">
        <Label className="block mb-6">THE CLAIM · 虽然……但是……</Label>
        <p className="text-base md:text-[1.05rem] ink-2 leading-[2.1] mb-6">
          <span className="font-serif-sc font-bold text-[rgb(var(--ink))]">虽然</span>
          {thesis.conflict.although}，
        </p>
        <p className="font-serif-sc font-bold text-lg md:text-xl leading-[1.9] text-[rgb(var(--ink))]">
          <span>但是</span>
          {thesis.conflict.but}。
        </p>
      </section>

      {/* 3 · WHY：阴阳两面论据 */}
      <section className="hairline-t pt-12 md:pt-16 pb-14 max-w-4xl">
        <Label className="block mb-6">WHY · 阴阳两面，不作结论</Label>
        <YinYangColumns t={thesis} />
      </section>

      {/* 4 · WHAT WOULD CHANGE MY MIND */}
      {(thesis.assumptions || thesis.invalidation) && (
        <section className="hairline-t pt-12 md:pt-16 pb-14 max-w-3xl">
          <Label className="block mb-6">WHAT WOULD CHANGE MY MIND · 什么会改变我的判断</Label>
          {thesis.assumptions && thesis.assumptions.length > 0 && (
            <div className="mb-10">
              <Label className="block mb-4 water">ASSUMPTIONS · What must remain true</Label>
              <ul className="space-y-3">
                {thesis.assumptions.map((a, i) => (
                  <li key={i} className="flex gap-4 text-sm ink-2 leading-relaxed">
                    <span className="font-mono-num tnum text-xs ink-3 mt-1 shrink-0">{String(i + 1).padStart(2, '0')}</span>
                    <span>{a}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {thesis.invalidation && thesis.invalidation.length > 0 && (
            <div>
              <Label className="block mb-4">止 · INVALIDATION · What makes it wrong</Label>
              <ul className="space-y-3">
                {thesis.invalidation.map((v, i) => (
                  <li key={i} className="flex gap-4 text-sm ink-2 leading-relaxed">
                    <span className="font-mono-num tnum text-xs ink-3 mt-1 shrink-0">×{i + 1}</span>
                    <span>{v}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      {/* 5 · REVISION HISTORY：单一 canonical 呈现（Ledger 事实 + legacy 叙事去重合并） */}
      <section className="hairline-t pt-12 md:pt-16 pb-14 max-w-3xl">
        <Label className="block mb-6">REVISION HISTORY · 修正留痕</Label>
        <ul className="space-y-8">
          {timeline.map((row, i) =>
            row.kind === 'revision' ? (
              <RevisionRow key={row.r.id} r={row.r} />
            ) : (
              <li key={`n-${i}`} className="flex gap-5">
                <span className="font-mono-num tnum text-xs ink-3 mt-1 shrink-0 w-20">{row.date}</span>
                <div>
                  <span className="label-sm ink-3 block mb-1.5">NARRATIVE · 叙事存档</span>
                  <p className="text-sm ink-2 leading-relaxed">{row.note}</p>
                </div>
              </li>
            ),
          )}
        </ul>
      </section>

      {/* 6 · EVIDENCE + COUNTER */}
      <section className="hairline-t pt-12 md:pt-16 pb-14 max-w-3xl">
        <Label className="block mb-6">EVIDENCE · 证据（可被外部验证）</Label>
        <ul className="space-y-4 mb-12">
          {thesis.evidence.map((e, i) => (
            <li key={i} className="flex gap-4 text-base ink-2 leading-relaxed">
              <span className="font-mono-num tnum text-xs ink-3 mt-1.5 shrink-0">{String(i + 1).padStart(2, '0')}</span>
              <span>{e}</span>
            </li>
          ))}
        </ul>
        <Label className="block mb-6">COUNTER · 当前反方证据与风险</Label>
        <p className="text-base ink-2 leading-[2.1]">{thesis.counter}</p>
        <p className="mt-8 text-sm ink-3">{thesis.probabilityNote}</p>
      </section>

      {/* 7 · MAP CONNECTIONS */}
      {linkedNodes.length > 0 && (
        <section className="hairline-t pt-12 md:pt-16 pb-20 max-w-3xl">
          <Label className="block mb-6">RELATED MAP · 产业地图中的位置</Label>
          <div className="border border-[rgb(var(--line))]">
            {linkedNodes.map((n) => (
              <a
                key={n.id}
                href="#/map"
                className="ink-hv flex items-center justify-between gap-4 px-5 py-4 hairline-b last:border-b-0"
              >
                <span className="font-serif-sc font-bold tracking-wide">{n.name}</span>
                <span className="flex items-center gap-4">
                  <span className="label-sm hidden md:inline">{n.en}</span>
                  <PolarityTag polarity={n.state} />
                </span>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <div className="hairline-t py-14 flex flex-wrap gap-4">
        <a href="#/map" className="btn-line">查看产业地图 →</a>
        <a href="#/journal" className="btn-line">查看修正日志 →</a>
      </div>
    </article>
  )
}
