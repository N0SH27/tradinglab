import React, { useState } from 'react'

/* Polarity Instrument —— TradingLabb 阴阳仪（V2-04）
 * 全站唯二阴阳图形之一（另一为 Cycle 页 Taiji，保留不动）。禁止第三个。
 * 硬规则（2026-08-23 用户裁决，P1 成文例外）：
 *   默认完全静止，无开场自动旋转；hover 仅有界微转；click 循环 YANG→TURN→YIN；
 *   prefers-reduced-motion 下零运动；禁止粒子/辉光/3D/纹理/WebGL。
 * 它是认知仪器，不是装饰——三态语义与 MapNode.state (yang|yin|turn) 同源。 */

export type PolarityState = 'yin' | 'turn' | 'yang'

const META: Record<PolarityState, { en: string; zh: string; words: { en: string; zh: string }[] }> = {
  yang: { en: 'YANG', zh: '阳', words: [{ en: 'Growth', zh: '增长' }, { en: 'Adoption', zh: '采纳' }, { en: 'Expansion', zh: '扩张' }] },
  turn: { en: 'TURN', zh: '转换', words: [{ en: 'Transition', zh: '过渡' }, { en: 'Reversal', zh: '反转' }, { en: 'Inflection', zh: '拐点' }] },
  yin: { en: 'YIN', zh: '阴', words: [{ en: 'Constraint', zh: '约束' }, { en: 'Clearing', zh: '出清' }, { en: 'Contraction', zh: '收缩' }] },
}

/* 可预测的单向循环：YANG → TURN → YIN → YANG（同 Loop：YIN→TURN→YANG→TURN→YIN 的简化路径） */
const NEXT: Record<PolarityState, PolarityState> = { yang: 'turn', turn: 'yin', yin: 'yang' }

/* 状态色沿用 PolarityTag 既有语义：阳=墨、阴=深水蓝、转换中=朱砂（风险语义豁免） */
const STATE_FILL: Record<PolarityState, string> = {
  yang: 'rgb(var(--ink))',
  turn: 'rgb(var(--cinnabar))',
  yin: 'rgb(var(--water))',
}

/* 三态刻度（viewBox 0 0 100 100）：YANG 顶 / TURN 右下 / YIN 底 */
const TICKS: { state: PolarityState; cx: number; cy: number }[] = [
  { state: 'yang', cx: 50, cy: 2.8 },
  { state: 'turn', cx: 92.2, cy: 73.9 },
  { state: 'yin', cx: 50, cy: 97.2 },
]

export function PolarityInstrument({
  state = 'yang',
  interactive = true,
  size = 160,
  showLabel = true,
  className = '',
}: {
  state?: PolarityState
  interactive?: boolean
  size?: number
  showLabel?: boolean
  className?: string
}) {
  const [current, setCurrent] = useState<PolarityState>(state)
  const [flipped, setFlipped] = useState(false)
  const meta = META[current]
  const aria = `Polarity: ${meta.zh} ${meta.en} — ${meta.words.map((w) => `${w.zh} ${w.en}`).join(', ')}`

  const advance = () => {
    setCurrent(NEXT[current])
    setFlipped((f) => !f)
  }
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      advance()
    }
  }

  const disc = (
    <svg
      width={size} height={size} viewBox="0 0 100 100"
      className={`polarity-disc${flipped ? ' is-flipped' : ''}`}
      aria-hidden="true"
    >
      <circle cx="50" cy="50" r="44" fill="rgb(var(--paper))" stroke="rgb(var(--ink))" strokeWidth="1" />
      <path
        d="M50 6 a44 44 0 0 1 0 88 a22 22 0 0 1 0 -44 a22 22 0 0 0 0 -44 Z"
        fill="rgb(var(--ink))"
      />
      <circle cx="50" cy="28" r="4" fill="rgb(var(--paper))" />
      <circle cx="50" cy="72" r="4" fill="rgb(var(--ink))" />
      {TICKS.map((t) =>
        t.state === current ? (
          <rect
            key={t.state}
            x={t.cx - 2.2} y={t.cy - 2.2} width="4.4" height="4.4"
            fill={STATE_FILL[t.state]}
          />
        ) : (
          <rect
            key={t.state}
            x={t.cx - 2.2} y={t.cy - 2.2} width="4.4" height="4.4"
            fill="none" stroke="rgb(var(--ink-3))" strokeWidth="0.6"
          />
        ),
      )}
    </svg>
  )

  const body = (
    <>
      {disc}
      {showLabel && (
        <span className="flex flex-col gap-1.5">
          <span className="label-sm">{meta.zh} · {meta.en}</span>
          {meta.words.map((w) => (
            <span key={w.en} className="text-sm ink-2 tracking-wide">
              {w.zh} <span className="font-mono-num text-xs ink-3">{w.en}</span>
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
      onClick={advance}
      onKeyDown={onKeyDown}
      className={`polarity-interactive inline-flex items-center gap-6 cursor-pointer ${className}`}
    >
      {body}
    </span>
  )
}
