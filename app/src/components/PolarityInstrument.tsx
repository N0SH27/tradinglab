import React, { useRef, useState } from 'react'

/* Polarity Instrument —— TradingLabb 阴阳仪（V2-04 / 2026-08-27 redesign）
 * 全站唯二阴阳图形之一（另一为 Cycle 页 Taiji，保留不动）。禁止第三个。
 *
 * 设计裁决（2026-08-27 Polarity Redesign Review）：
 *   · 三态刻度方块删除——状态语义由「中文状态字 + 状态色」单一载体承担；
 *     方块从未可点，既不导航也不指示（与文字冗余），属 UI ornament。
 *   · STATE → CANONICAL ANGLE：YANG≡0° / TURN≡120° / YIN≡240°（mod 360）；
 *     旋转单向累积（每步 +120°）——方向永远一致，角度由状态推导，不由点击次数推导。
 *   · Pointer-follow 采用 BOUNDED 模型：桌面指针只产生 ±15° 有界倾斜，
 *     指针离开归位到状态基准角——指针负责"感受到变化"，三态负责"表达意义"。
 *   · Touch 不跟随（手指遮挡圆盘）：tap / 横滑 = 状态推进。
 *   · prefers-reduced-motion：零过渡、零跟随，点击瞬时切态。
 *   · 禁止粒子/辉光/3D/纹理/WebGL（V2-04 不变）。
 * 它是认知仪器，不是装饰——三态语义与 MapNode.state (yang|yin|turn) 同源。 */

export type PolarityState = 'yin' | 'turn' | 'yang'

const META: Record<PolarityState, { en: string; zh: string; words: { en: string; zh: string }[] }> = {
  yang: { en: 'YANG', zh: '阳', words: [{ en: 'Growth', zh: '增长' }, { en: 'Adoption', zh: '采纳' }, { en: 'Expansion', zh: '扩张' }] },
  turn: { en: 'TURN', zh: '转换', words: [{ en: 'Transition', zh: '过渡' }, { en: 'Reversal', zh: '反转' }, { en: 'Inflection', zh: '拐点' }] },
  yin: { en: 'YIN', zh: '阴', words: [{ en: 'Constraint', zh: '约束' }, { en: 'Clearing', zh: '出清' }, { en: 'Contraction', zh: '收缩' }] },
}

/* 可预测的单向循环：YANG → TURN → YIN → YANG（同 Loop：YIN→TURN→YANG→TURN→YIN 的简化路径） */
const NEXT: Record<PolarityState, PolarityState> = { yang: 'turn', turn: 'yin', yin: 'yang' }

/* 状态色沿用 PolarityTag 既有语义：阳=墨、阴=深水蓝、转换中=朱砂（风险语义豁免）。
   2026-08-27 起，状态色唯一载体 = 中文状态字。 */
const STATE_FILL: Record<PolarityState, string> = {
  yang: 'rgb(var(--ink))',
  turn: 'rgb(var(--cinnabar))',
  yin: 'rgb(var(--water))',
}

/* Canonical Orientation：状态 → 基准角（mod 360）。
   120° 等距：三态是循环而非两端，等距表达"消长—转化—消长"的连续；
   单向累积（turns）保证 YIN→YANG 也按同一方向行进，永不反转。 */
const STATE_ANGLE: Record<PolarityState, number> = { yang: 0, turn: 120, yin: 240 }

/* 有界跟随参数：±15° 上限；指针偏离基准 60° 以内线性响应，之外饱和 */
const MAX_TILT = 15
const TILT_RANGE = 60
/* 横滑推进阈值（px） */
const SWIPE_MIN = 40

export function PolarityInstrument({
  state = 'yang',
  value,
  interactive = true,
  size = 160,
  showLabel = true,
  className = '',
}: {
  state?: PolarityState
  /* V2-C · Rotate 受控模式（HDG-2 / DESIGN.md §4 增补）：外部传入 value 时仪器为受控
     展示态——角度由外部状态推导，内部不再自行推进；原有点击推进模式在不传 value 时
     完全保留（既有展位行为不变）。作为 Map View Filter 时配 interactive={false} 使用，
     三选互斥/再点取消的交互由外部 Filter 控件承担。 */
  value?: PolarityState
  interactive?: boolean
  size?: number
  showLabel?: boolean
  className?: string
}) {
  const [internal, setInternal] = useState<PolarityState>(state)
  const [turns, setTurns] = useState(0)
  const [tilt, setTilt] = useState(0)
  const discRef = useRef<HTMLSpanElement>(null)
  const dragStartX = useRef<number | null>(null)
  const swiped = useRef(false)

  const current = value ?? internal

  const meta = META[current]
  const baseAngle = STATE_ANGLE[current] + turns * 360
  const angle = baseAngle + tilt
  const aria = `Polarity: ${meta.zh} ${meta.en} — ${meta.words.map((w) => `${w.zh} ${w.en}`).join(', ')}`

  const prefersReduced = () =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  /* 状态推进：单向 +120°；YIN→YANG 跨界时累积一整圈，方向不变。
     仅未受控（无 value）时生效；受控展示态下角度完全由外部 value 推导。 */
  const advance = () => {
    if (value !== undefined) return
    if (current === 'yin') setTurns((t) => t + 1)
    setInternal(NEXT[current])
  }

  /* 桌面有界跟随：指针相对圆心的方位角 → 与当前基准角的最短偏差 → ±15° 饱和倾斜 */
  const onPointerMove = (e: React.PointerEvent) => {
    if (e.pointerType === 'touch' || prefersReduced() || !discRef.current) return
    const r = discRef.current.getBoundingClientRect()
    const dx = e.clientX - (r.left + r.width / 2)
    const dy = e.clientY - (r.top + r.height / 2)
    /* 屏幕坐标 y 向下：atan2 顺时针递增；+90 使 0° = 正上方，与 rotate 基准对齐 */
    const pointerDeg = (Math.atan2(dy, dx) * 180) / Math.PI + 90
    const rel = (((pointerDeg - (baseAngle % 360)) % 360) + 540) % 360 - 180
    setTilt(Math.sign(rel) * Math.min(Math.abs(rel) / TILT_RANGE, 1) * MAX_TILT)
  }
  const onPointerLeave = () => setTilt(0)

  /* 横滑推进（主要为触屏）；滑动后抑制随之而来的 click，避免双击式连跳 */
  const onPointerDown = (e: React.PointerEvent) => {
    dragStartX.current = e.clientX
    swiped.current = false
  }
  const onPointerUp = (e: React.PointerEvent) => {
    if (dragStartX.current != null && Math.abs(e.clientX - dragStartX.current) > SWIPE_MIN) {
      swiped.current = true
      advance()
    }
    dragStartX.current = null
  }
  const onClick = () => {
    if (swiped.current) {
      swiped.current = false
      return
    }
    advance()
  }
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      advance()
    }
  }

  const disc = (
    <span ref={discRef} className="inline-flex shrink-0" style={{ touchAction: 'pan-y' }}>
      <svg
        width={size} height={size} viewBox="0 0 100 100"
        className="polarity-disc"
        style={{ transform: `rotate(${angle}deg)` }}
        aria-hidden="true"
      >
        <circle cx="50" cy="50" r="44" fill="rgb(var(--paper))" stroke="rgb(var(--ink))" strokeWidth="1" />
        <path
          d="M50 6 a44 44 0 0 1 0 88 a22 22 0 0 1 0 -44 a22 22 0 0 0 0 -44 Z"
          fill="rgb(var(--ink))"
        />
        <circle cx="50" cy="28" r="4" fill="rgb(var(--paper))" />
        <circle cx="50" cy="72" r="4" fill="rgb(var(--ink))" />
      </svg>
    </span>
  )

  const body = (
    <>
      {disc}
      {showLabel && (
        <span className="flex flex-col gap-2 whitespace-nowrap">
          <span className="flex items-baseline gap-3">
            <span
              className="font-serif-sc font-bold text-lg leading-none transition-colors duration-700"
              style={{ color: STATE_FILL[current] }}
            >
              {meta.zh}
            </span>
            <span className="label-sm">{meta.en}</span>
          </span>
          {meta.words.map((w) => (
            <span key={w.en} className="flex items-baseline gap-3">
              <span className="text-sm ink-2 tracking-wide">{w.zh}</span>
              <span className="font-mono-num text-xs ink-3 uppercase tracking-widest">{w.en}</span>
            </span>
          ))}
        </span>
      )}
    </>
  )

  if (!interactive) {
    return (
      <span role="img" aria-label={aria} className={`inline-flex items-center gap-6 ${className}`}>
        {body}
      </span>
    )
  }

  return (
    <span
      role="button"
      tabIndex={0}
      aria-label={`${aria}. Activate to switch polarity state.`}
      onClick={onClick}
      onKeyDown={onKeyDown}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      className={`inline-flex items-center gap-6 cursor-pointer select-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-[rgb(var(--cinnabar))] ${className}`}
    >
      {body}
    </span>
  )
}
