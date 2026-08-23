import { THESES, INDUSTRY_MAP, JOURNAL, SITE } from '../data/content'
import { deriveThesisPolarity, formatPolarity } from '../data/polarity'
import { Label, PolarityTag } from '../components/Bits'
import { BackNav } from '../ink/BackNav'

/* 单命题页（V2-05 T-5）：LIVE THESIS 的最小详情视图。
   数据全部来自 domains（theses / map / journal），极性经 deriveThesisPolarity 推导——
   组件不写死任何业务数据。 */
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
  const lastRevision = thesis.revisions[thesis.revisions.length - 1]
  const journalItems = JOURNAL.flatMap((entry) =>
    entry.items
      .filter((it) => it.thesisId === thesis.id)
      .map((it) => ({ date: entry.date, ...it })),
  )

  return (
    <article className="max-w-[1400px] mx-auto px-5 md:px-10">
      {/* 返回 = 收束：桌面展示，移动端由左缘右滑承担 */}
      <div className="pt-24 md:pt-28 hidden md:block">
        <BackNav to="/thesis" label="命题" />
      </div>

      {/* 命题头 */}
      <header className="pt-24 md:pt-12 pb-14 md:pb-16 max-w-3xl">
        <div className="flex items-baseline gap-4 mb-8 flex-wrap">
          <span className="font-mono-num tnum text-sm ink-3">{thesis.no}</span>
          <Label className="water">{thesis.industry}</Label>
          <Label>更新 {thesis.updated}</Label>
          <Label className="ml-auto">LIVE THESIS</Label>
        </div>
        <h1 className="font-serif-sc font-black text-3xl md:text-5xl leading-tight tracking-tight mb-10">
          {thesis.title}
        </h1>

        {/* 命题仪表条：概率 / 极性 / 窗口 / 最近修正 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[rgb(var(--line))] border border-[rgb(var(--line))]">
          <div className="bg-paper p-5">
            <Label className="block mb-2">CONVICTION</Label>
            <span className="font-mono-num tnum text-3xl md:text-4xl font-medium">{thesis.probability}%</span>
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
            <span className="font-mono-num tnum text-sm tracking-widest">
              {lastRevision ? lastRevision.date : thesis.updated}
            </span>
          </div>
        </div>
      </header>

      {/* 核心矛盾 */}
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

      {/* 证据与反证 */}
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
        <Label className="block mb-6">COUNTER · 反面论证</Label>
        <p className="text-base ink-2 leading-[2.1]">{thesis.counter}</p>
        <p className="mt-8 text-sm ink-3">{thesis.probabilityNote}</p>
      </section>

      {/* 关联地图节点 */}
      {linkedNodes.length > 0 && (
        <section className="hairline-t pt-12 md:pt-16 pb-14 max-w-3xl">
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

      {/* 修正史：命题 revisions + 结构化日志 */}
      <section className="hairline-t pt-12 md:pt-16 pb-20 max-w-3xl">
        <Label className="block mb-6">REVISION HISTORY · 修正留痕</Label>
        <ul className="space-y-8">
          {journalItems.map((it, i) => (
            <li key={`j-${i}`} className="flex gap-5">
              <span className="font-mono-num tnum text-xs ink-3 mt-1 shrink-0 w-20">{it.date}</span>
              <div>
                {it.previousConviction !== undefined && it.currentConviction !== undefined && (
                  <span className="font-mono-num tnum text-sm block mb-1.5">
                    {it.previousConviction} → {it.currentConviction}
                    <span className="ink-3">（{it.currentConviction - it.previousConviction > 0 ? '+' : ''}
                      {it.currentConviction - it.previousConviction}）</span>
                  </span>
                )}
                <p className="text-sm ink-2 leading-relaxed">{it.note}</p>
              </div>
            </li>
          ))}
          {thesis.revisions.map((r, i) => (
            <li key={`r-${i}`} className="flex gap-5">
              <span className="font-mono-num tnum text-xs ink-3 mt-1 shrink-0 w-20">{r.date}</span>
              <p className="text-sm ink-2 leading-relaxed">{r.note}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* CTA */}
      <div className="hairline-t py-14 flex flex-wrap gap-4">
        <a href="#/map" className="btn-line">查看产业地图 →</a>
        <a href="#/journal" className="btn-line">查看修正日志 →</a>
        <span className="label-sm self-center ml-auto">{SITE.author} / LIVE THESIS / {thesis.no}</span>
      </div>
    </article>
  )
}
