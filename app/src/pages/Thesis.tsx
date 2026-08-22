import { useState } from 'react'
import { THESES, INDUSTRY_MAP, type Thesis } from '../data/content'
import { Label, PageHead } from '../components/Bits'

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

function ThesisBlock({ t, index }: { t: Thesis; index: number }) {
  const [open, setOpen] = useState(index === 0)
  return (
    <article className={index > 0 ? 'hairline-t' : 'border-t border-[rgb(var(--line))]'}>
      {/* 命题头 */}
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls={`thesis-body-${t.id}`}
        className="w-full text-left py-10 md:py-14 grid md:grid-cols-12 gap-6 items-baseline group"
      >
        <div className="md:col-span-2">
          <Label className="block mb-2">{t.no}</Label>
          <span className="text-xs ink-3 tnum">更新于 {t.updated}</span>
        </div>
        <h3 className="md:col-span-7 font-serif-sc font-bold text-2xl md:text-4xl leading-snug tracking-tight group-hover:opacity-70 transition-opacity">
          {t.title}
        </h3>
        <div className="md:col-span-3 md:text-right">
          <div className="flex md:justify-end items-baseline gap-2">
            <span className="font-mono-num tnum text-4xl font-medium">{t.probability}</span>
            <span className="font-mono-num tnum text-base ink-3">%</span>
          </div>
          <span className="text-xs tracking-widest ink-3">{t.probabilityNote} · {open ? '收起 −' : '展开 +'}</span>
        </div>
      </button>

      {open && (
        <div id={`thesis-body-${t.id}`} className="pb-14 md:pb-20 space-y-12">
          {/* 核心矛盾 */}
          <div className="grid md:grid-cols-2 gap-px bg-[rgb(var(--line))] border border-[rgb(var(--line))]">
            <div className="bg-paper p-6 md:p-10">
              <Label className="block mb-4">虽然 ALTHOUGH</Label>
              <p className="text-lg md:text-xl leading-relaxed ink-2">{t.conflict.although}</p>
            </div>
            <div className="bg-paper p-6 md:p-10">
              <Label className="block mb-4 ink">但是 BUT</Label>
              <p className="text-lg md:text-xl leading-relaxed">{t.conflict.but}</p>
            </div>
          </div>

          {/* 阴阳两面 */}
          <div>
            <Label className="block mb-5">阴阳两面 · 不作结论，由你判断</Label>
            <YinYangColumns t={t} />
          </div>

          {/* 证据链 */}
          <div className="grid md:grid-cols-12 gap-8">
            <div className="md:col-span-7">
              <Label className="block mb-5">证据链 EVIDENCE（不超过三条）</Label>
              <ol className="space-y-5">
                {t.evidence.map((e, i) => (
                  <li key={i} className="flex gap-4 items-baseline hairline-b pb-5 last:border-0">
                    <span className="font-serif-sc font-bold text-2xl leading-none">{['一', '二', '三'][i]}</span>
                    <span className="text-base leading-relaxed">{e}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div className="md:col-span-5 space-y-8">
              <div>
                <Label className="block mb-3">时间窗口</Label>
                <p className="text-sm leading-relaxed ink-2">{t.window}</p>
              </div>
              <div>
                <Label className="block mb-3 ink">反面论证 · 这个命题为什么可能是错的</Label>
                <p className="text-sm leading-relaxed ink-2">{t.counter}</p>
              </div>
            </div>
          </div>

          {/* 修正记录 */}
          <div>
            <Label className="block mb-5">修正记录 REVISIONS</Label>
            <div className="border border-[rgb(var(--line))]">
              {t.revisions.map((r, i) => (
                <div
                  key={i}
                  className={`grid md:grid-cols-12 gap-2 md:gap-6 px-5 md:px-6 py-4 ${
                    i > 0 ? 'hairline-t' : ''
                  }`}
                >
                  <span className="md:col-span-2 font-mono-num tnum text-xs ink-3">{r.date}</span>
                  <span className="md:col-span-10 text-sm leading-relaxed ink-2">{r.note}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 关联节点 */}
          {t.nodes && t.nodes.length > 0 && (
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              <Label className="water">关联节点 · 产业地图</Label>
              {t.nodes.map((nid) => {
                const n = INDUSTRY_MAP.nodes.find((x) => x.id === nid)
                if (!n) return null
                return (
                  <a key={nid} href="#/map" className="text-sm ink-2 hover:opacity-60 transition-opacity border-b border-[rgb(var(--line))] pb-0.5">
                    {n.name}
                  </a>
                )
              })}
            </div>
          )}
        </div>
      )}
    </article>
  )
}

export default function Thesis() {
  return (
    <div className="max-w-[1400px] mx-auto px-5 md:px-10">
      <PageHead
        no="02"
        zh="命题"
        en="THESIS"
        intro="不追求数量，只追求深度。每个命题以「虽然……但是……」开头，同时呈现阳面与阴面，标注主观概率与证伪条件，并保留每一次修正的痕迹。"
      />
      {THESES.map((t, i) => (
        <ThesisBlock key={t.id} t={t} index={i} />
      ))}
    </div>
  )
}
