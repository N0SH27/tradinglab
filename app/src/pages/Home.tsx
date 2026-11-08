import { useEffect, useRef, useState } from 'react'
import { THESES, LEDGER, OBSERVATIONS, SITE, WATCH_DATES } from '../data/content'
import { deltaOf, deriveCurrentBelief, derivePlumState, lastRevisedOf, latestChanges, type PlumState } from '../data/ledger'
import { HSNSeal } from '../components/Brand'
import { HiddenEntryLogo } from '../components/HiddenEntryLogo'
import { PolarityInstrument, type PolarityState } from '../components/PolarityInstrument'
import { FlipCard } from '../components/FlipCard'
import { PolarityXiao } from '../components/PolarityXiao'
import { useRevealRoot } from '../hooks/useReveal'
import { HeroInk } from '../ink/HeroInk'

/* 寒梅表态（2026-10-26 Human 裁决三态：阴·含苞 / 平·疏放 / 阳·盛放；
   2026-11-08 HSN 裁决改为 derivePlumState 全量派生，不再手动维护——
   score = 非零 delta 全量平均，±3 换态；站点数据层仍无立场字段，不发明数据）。 */
const PLUM_STATE = derivePlumState(LEDGER)
const PLUM_IMG: Record<PlumState, string> = {
  bud: 'ink/plum-bud.png',
  sparse: 'ink/plum-sparse.png',
  bloom: 'ink/plum-bloom.png',
}

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

/* Research 阅读卡（V2-C.1：卡数不再固定为 3，由真实 Report 决定；本轮 = 6。
   类型标识按各报告真实日期落（事实纪律）：一/二/三 = 2026.08，四/五/六 = 2026.09。 */
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
  {
    name: '存储 II',
    type: 'REPORT · 2026.09',
    frontTitle: '紧缺还在，斜率开始松动。',
    frontBody: '利润率历史极值的同一周，涨价共识从 +200% 腰斩到 +100%。',
    backBody: (
      <>
        铠侠第一次说「涨够了」，闪迪说「紧张到 2028」——上下游公开吵架的一周，分歧本身就是数据。
        <strong className="block mt-3 font-bold">紧缺延续，不等于价格斜率延续。</strong>
        <span className="block mt-2 text-sm text-[rgb(var(--paper))]/60">
          下一个关口：Q4 合约价谈判。
        </span>
      </>
    ),
    href: '#/research/report-5',
  },
  {
    name: '算力租赁',
    type: 'REPORT · 2026.09',
    frontTitle: 'GPU 租金半年涨了五成。',
    frontBody: '13.1 个月回本——利率上升，为什么还没有杀死 AI 基建。',
    backBody: (
      <>
        涨价的另一面是兜底：英伟达表外担保 5300 亿美元。单位经济学成立的命门只有一个——利用率不掉。
        <strong className="block mt-3 font-bold">现货价掉头向下，才是真正的压力测试。</strong>
      </>
    ),
    href: '#/research/report-6',
  },
]

/* Polarity Filter（受控三选：点击 = 激活滤镜，再点取消；三态互斥；默认 = 完整切片）。
   V2-C.1：选中态不再用下划线（重复编码删除）。
   R1（2026-09-06 Human 批准 · Representation Correction）：三态 hint 解释词删除——
   Polarity 是认知控制器，不是信息说明卡片；语义词汇仍由 PolarityInstrument 的
   aria-label（META.words）携带。辅助句取自宣言 §06 原句（零原创，见 R1 §B/§C）。 */
const FILTER_META: Record<PolarityState, { zh: string; en: string; color: string }> = {
  yang: { zh: '阳', en: 'YANG', color: 'rgb(var(--ink))' },
  turn: { zh: '转换', en: 'TURN', color: 'rgb(var(--cinnabar))' },
  yin: { zh: '阴', en: 'YIN', color: 'rgb(var(--water))' },
}

/* H-2a 热力图墨色分级（0 = 无观察的浅痕，1–3 = 条数越深越浓） */
const HEAT_BG: Record<number, string> = {
  0: 'bg-[rgb(var(--ink))]/[0.05]',
  1: 'bg-[rgb(var(--ink))]/30',
  2: 'bg-[rgb(var(--ink))]/65',
  3: 'bg-[rgb(var(--ink))]',
}

export default function Home() {
  const rootRef = useRevealRoot<HTMLDivElement>()
  const dotRef = useRef<HTMLSpanElement>(null)
  const [polarity, setPolarity] = useState<PolarityState | null>(null)

  /* WHAT CHANGED（V2-C.1 · Human 裁决：3～5 条真实变化，LEDGER 派生）：
     每命题最新一条 delta≠0，时间倒序；confirm 不投影，底层账本不动。 */
  const changes = latestChanges(LEDGER, 5)

  /* H-2a demo（2026-11-08）：NOW 观察日历——五个月滚动窗口（前两月 + 本月 + 未来两月，
     随日期自动滑动），连续格网。回溯观察落墨格，前瞻锚点（WATCH_DATES）落空心朱砂格；
     全部数据只读自 data layer，零写死。格距响应式：桌面 34px 格 / 移动 13px 格。 */
  const obsByDay = new Map<string, typeof OBSERVATIONS>()
  for (const o of OBSERVATIONS) {
    const p = o.date.split('.')
    const key = `${p[0]}.${p[1].padStart(2, '0')}.${(p[2] ?? '01').padStart(2, '0')}`
    const arr = obsByDay.get(key) ?? []
    arr.push(o)
    obsByDay.set(key, arr)
  }
  const watchByDay = new Map<string, typeof WATCH_DATES>()
  for (const w of WATCH_DATES) {
    const arr = watchByDay.get(w.date) ?? []
    arr.push(w)
    watchByDay.set(w.date, arr)
  }
  const fmtDay = (d: Date) =>
    `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
  const now = new Date()
  /* 窗口：前两月 1 号所在周的周一 → 未来两月最后一天（回看观察密度 + 前瞻锚点同图） */
  const winStart = new Date(now.getFullYear(), now.getMonth() - 2, 1)
  winStart.setDate(winStart.getDate() - ((winStart.getDay() + 6) % 7))
  const winEnd = new Date(now.getFullYear(), now.getMonth() + 3, 0)
  const totalDays = Math.round((winEnd.getTime() - winStart.getTime()) / 86400000) + 1
  const colCount = Math.ceil(totalDays / 7)
  /* 格距响应式：<640px 用 13px 格（整图 ~350px 免滑），桌面用 34px 格 */
  const [cellPitch, setCellPitch] = useState(40)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)')
    const upd = () => setCellPitch(mq.matches ? 15 : 40)
    upd()
    mq.addEventListener('change', upd)
    return () => mq.removeEventListener('change', upd)
  }, [])
  const cellGap = cellPitch <= 20 ? 2 : 6
  const cellSize = cellPitch - cellGap
  const grid: ({ key: string; n: number; watch: number } | null)[][] = Array.from(
    { length: colCount },
    (_, c) =>
      Array.from({ length: 7 }, (_, r) => {
        const idx = c * 7 + r
        if (idx >= totalDays) return null
        const d = new Date(winStart)
        d.setDate(d.getDate() + idx)
        const key = fmtDay(d)
        return { key, n: obsByDay.get(key)?.length ?? 0, watch: watchByDay.get(key)?.length ?? 0 }
      }),
  )
  /* 月份标尺：只标窗口内五个月（-2…+2），位置 = 当月 1 号所在列；
     月初 bleed 进来的上月尾段不标；只标月份，不标年份（HSN 裁决） */
  const monthLabels = [-2, -1, 0, 1, 2].map((i) => {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1)
    const idx = Math.round((d.getTime() - winStart.getTime()) / 86400000)
    return { col: Math.floor(idx / 7), label: `${d.getMonth() + 1}月` }
  })
  const [hoverCell, setHoverCell] = useState<{ c: number; r: number; key: string; text: string } | null>(null)
  const [selectedDay, setSelectedDay] = useState<string | null>(null)

  /* 卡片弹层：Escape 关闭 + 锁定底层滚动 */
  useEffect(() => {
    if (!selectedDay) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedDay(null)
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [selectedDay])

  return (
    <div ref={rootRef}>
      {/* ── 首屏宣言（V2-C.1 修正② · 2026-09-06 00:07 Human：三段式左对齐——
          ① 大标题 + 黑色 Logo（位于标题右侧，不落入左上角标题栏邻近区）；
          ② 宣言四行按现有断句左对齐；
          ③ 「玄之又玄，众妙之门。」单独居中、字号稍大——作为总结并开启下文；
          无 ENTER，图形 Logo 不重复于左上角） ── */}
      <section className="relative max-w-[1400px] mx-auto px-5 md:px-10 min-h-[80vh] flex flex-col justify-center pt-24 pb-10 md:pb-12">
        {/* 方案五笔墨：墨泅朱砂句号 + 润笔淡痕（落墨一次即驻留） */}
        <HeroInk dotRef={dotRef} />
        {/* 寒梅：作者对当下市场的多空表态（无竖签，留白让读者自参） */}
        <div
          className="pointer-events-none absolute right-2 bottom-6 md:right-8 md:bottom-10 z-[5] select-none"
          aria-hidden="true"
        >
          <img
            src={PLUM_IMG[PLUM_STATE]}
            alt=""
            className="h-[104px] md:h-[150px] w-auto"
            style={{ filter: 'drop-shadow(0 1px 1px rgba(10,10,10,.06))' }}
          />
        </div>
        <div data-reveal>
          <h1 className="font-serif-sc font-black leading-[1.08] tracking-tight text-[clamp(2.8rem,9vw,8rem)]">
            观察变化，
            <br />
            而非预测未来
            <span ref={dotRef} className="cinnabar invisible" aria-hidden="true">
              。
            </span>
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
            <HiddenEntryLogo />
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

      {/* ── 阴阳 Lens + ② World · PolarityXiao（V2 SEE 重设计 · 2026-09-06 Human 批准；
              洞箫替代原折线，MapPreview 已于 Phase 5 退役，切片共享迁入 seeSlice.ts） ── */}
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
              {/* R1 辅助句：宣言 §06「道法自然」原句截取（零原创），独立文本区，
                  不参与三态列布局 */}
              <p className="mt-4 text-sm md:text-base ink-2 leading-relaxed">
                我不预测拐点，只观察阴阳消长的速度。
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
                      className={`w-20 text-left cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-[rgb(var(--cinnabar))] ${
                        on ? 'font-bold' : 'ink-3 hover:text-[rgb(var(--ink))]'
                      } transition-colors`}
                      style={on ? { color: meta.color } : undefined}
                    >
                      <span className="font-serif-sc text-lg leading-none block">{meta.zh}</span>
                      <span className="mt-1.5 font-mono-num text-[10px] tracking-[0.2em] block">{meta.en}</span>
                    </button>
                  )
                })}
              </div>
            </div>
            <div className="md:col-span-8" data-reveal>
              <PolarityXiao active={polarity} />
            </div>
          </div>
        </div>
      </section>

      {/* ── H-2a · NOW 观察日历（demo：五个月滚动窗口[前两月+本月+未来两月]，
          连续格网响应式格距；回溯观察 = 墨格，前瞻锚点 = 空心朱砂格；
          hover 浮签 · 点击弹卡片全屏虚化） ── */}
      <section className="hairline-t">
        <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-20 md:py-28">
          <div className="max-w-6xl mx-auto" data-reveal>
            <span className="label-sm ink-3 block mb-10">NOW · 正在观察的变化</span>
            <div className="overflow-x-auto pb-1">
              <div
                className="relative mx-auto w-fit"
                style={{ width: colCount * cellPitch - cellGap }}
              >
                {/* 月份标尺 */}
                <div className="relative h-4 mb-2">
                  {monthLabels.map((ml) => (
                    <span
                      key={ml.col}
                      className="absolute top-0 font-mono-num text-[10px] ink-3 tracking-wider"
                      style={{ left: ml.col * cellPitch }}
                    >
                      {ml.label}
                    </span>
                  ))}
                </div>
                {/* 日期格网：周为列、周一至周日为行 */}
                <div
                  className="grid grid-flow-col"
                  style={{ gap: cellGap, gridTemplateRows: `repeat(7, ${cellSize}px)` }}
                >
                  {grid.map((col, c) =>
                    col.map((cell, r) =>
                      cell === null ? (
                        <span key={`${c}-${r}`} />
                      ) : (
                        <button
                          key={cell.key}
                          type="button"
                          tabIndex={cell.n + cell.watch > 0 ? 0 : -1}
                          aria-label={
                            cell.watch > 0
                              ? `${cell.key} · ${watchByDay.get(cell.key)![0].label}`
                              : cell.n > 0
                                ? `${cell.key} · ${cell.n} 条观察`
                                : cell.key
                          }
                          onClick={() =>
                            cell.n + cell.watch > 0 &&
                            setSelectedDay((cur) => (cur === cell.key ? null : cell.key))
                          }
                          onMouseEnter={() =>
                            (cell.n > 0 || cell.watch > 0) &&
                            setHoverCell({
                              c,
                              r,
                              key: cell.key,
                              text:
                                cell.watch > 0
                                  ? watchByDay.get(cell.key)![0].label
                                  : `${cell.n} 条观察`,
                            })
                          }
                          onMouseLeave={() => setHoverCell(null)}
                          style={{ height: cellSize, width: cellSize }}
                          className={`${
                            cell.watch > 0
                              ? `ring-1 ring-[rgb(var(--cinnabar))] ${
                                  selectedDay === cell.key
                                    ? 'bg-[rgb(var(--cinnabar))]/25'
                                    : 'bg-[rgb(var(--cinnabar))]/[0.07] hover:bg-[rgb(var(--cinnabar))]/20'
                                }`
                              : `${HEAT_BG[cell.n === 0 ? 0 : cell.n === 1 ? 1 : cell.n === 2 ? 2 : 3]} ${
                                  cell.n > 0
                                    ? `cursor-pointer ${
                                        selectedDay === cell.key
                                          ? 'ring-1 ring-[rgb(var(--cinnabar))]'
                                          : 'hover:ring-1 hover:ring-[rgb(var(--cinnabar))]'
                                      }`
                                    : 'cursor-default'
                                }`
                          }`}
                        />
                      ),
                    ),
                  )}
                </div>
                {/* hover 浮签 */}
                {hoverCell && (
                  <div
                    className="pointer-events-none absolute z-10 -translate-x-1/2 whitespace-nowrap bg-[rgb(var(--ink))] px-2 py-1 font-mono-num text-[10px] text-[rgb(var(--paper))]"
                    style={{
                      left: Math.max(
                        100,
                        Math.min(
                          hoverCell.c * cellPitch + cellSize / 2,
                          colCount * cellPitch - cellGap - 100,
                        ),
                      ),
                      top: 24 + hoverCell.r * cellPitch,
                    }}
                  >
                    {hoverCell.key} · {hoverCell.text}
                  </div>
                )}
              </div>
            </div>
            {/* 计量行已按 HSN 裁决删除（2026-11-08）：窗口说明与图例撤出，格网自足 */}
          </div>
        </div>
      </section>

      {/* ── H-2a 卡片弹层：点击日格 → 独立卡片，背景全屏虚化 ── */}
      {selectedDay && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-5"
          role="dialog"
          aria-modal="true"
          aria-label={`${selectedDay} 的观察`}
          onClick={() => setSelectedDay(null)}
        >
          <div className="absolute inset-0 bg-[rgb(var(--ink))]/40 backdrop-blur-sm" />
          <div
            className="relative w-full max-w-xl max-h-[75vh] overflow-y-auto bg-[rgb(var(--paper))] border border-[rgb(var(--line))] p-8 md:p-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-baseline justify-between">
              <p className="font-mono-num tnum text-xs tracking-widest ink-3">
                {selectedDay}
                {watchByDay.has(selectedDay) && ` · ${watchByDay.get(selectedDay)!.length} 项待验证`}
                {obsByDay.has(selectedDay) && ` · ${obsByDay.get(selectedDay)!.length} 条观察`}
              </p>
              <button
                type="button"
                onClick={() => setSelectedDay(null)}
                aria-label="关闭"
                className="font-mono-num text-xs tracking-widest ink-3 hover:text-[rgb(var(--ink))] transition-colors cursor-pointer"
              >
                关闭 ×
              </button>
            </div>
            {/* 待验证锚点 */}
            {watchByDay.has(selectedDay) && (
              <div className="mt-6 space-y-5 border-t border-[rgb(var(--line))] pt-6">
                {watchByDay.get(selectedDay)!.map((w) => {
                  const linked = OBSERVATIONS.find((o) => o.id === w.observationId)
                  return (
                    <div key={w.label}>
                      <p className="font-serif-sc font-bold text-lg md:text-xl tracking-tight">
                        <span className="mr-2 inline-block h-2 w-2 ring-1 ring-[rgb(var(--cinnabar))] align-middle" />
                        {w.label}
                      </p>
                      {w.note && <p className="mt-2 text-xs ink-3 leading-relaxed">{w.note}</p>}
                      {linked && (
                        <p className="mt-2 font-mono-num text-[10px] tracking-widest ink-3">
                          关联观察 · {linked.title}
                        </p>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
            {/* 当日观察 */}
            {obsByDay.has(selectedDay) && (
              <div
                className={`space-y-6 ${
                  watchByDay.has(selectedDay)
                    ? 'mt-6 border-t border-[rgb(var(--line))] pt-6'
                    : 'mt-6 border-t border-[rgb(var(--line))] pt-6'
                }`}
              >
                {obsByDay.get(selectedDay)!.map((o) => (
                  <div key={o.id}>
                    <p className="font-serif-sc font-bold text-lg md:text-xl tracking-tight">{o.title}</p>
                    <p className="mt-2 text-sm ink-2 leading-relaxed">{o.summary}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

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
                    className="ink-seep group grid md:grid-cols-12 gap-x-6 gap-y-2 items-baseline py-7 md:py-8 hairline-b"
                  >
                    <span className="md:col-span-3">
                      <span className="ink-seep-name font-serif-sc font-bold text-xl md:text-2xl tracking-tight">
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
          <p className="font-mono-num text-xs tracking-[0.3em] ink-3" data-reveal>
            {THESES.length} 个命题 · {OBSERVATIONS.length} 条观察
          </p>
          <p className="mt-8 font-serif-sc text-lg md:text-xl ink-2 leading-relaxed" data-reveal>
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
