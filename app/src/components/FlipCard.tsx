import { useState, type ReactNode } from 'react'

/* ── FlipCard（V2-C · HDG-2 Flip 动作 · DESIGN.md §4 阅读动作动效）────────────
 * 语义：表面 → 隐藏变量。翻面是语义，不是表演。
 * · 点击翻面（click/tap），非 hover 依赖；禁 3D 翻转/缩放/弹跳——
 *   以纸墨反转 crossfade 表达「翻」；
 * · 两面键盘与读屏均可达：正面整面为按钮，背面 CTA 为独立链接，
 *   隐藏面 visibility:hidden（不可聚焦）；focus-visible 朱砂焦点环；
 * · prefers-reduced-motion：瞬时切换（motion-reduce:transition-none）。
 * 用于 NOW 阅读卡与 Featured Research 卡，不创造第三种状态。 */

export interface FlipCta {
  href: string
  label: string
}

export function FlipCard({
  label,
  front,
  back,
  cta = [],
  className = '',
}: {
  label: string
  front: ReactNode
  back: ReactNode
  cta?: FlipCta[]
  className?: string
}) {
  const [flipped, setFlipped] = useState(false)

  return (
    <div
      className={`relative min-h-[300px] md:min-h-[340px] border border-[rgb(var(--line))] bg-paper overflow-hidden ${className}`}
    >
      {/* 正面 · 表面（整面即翻面按钮，正面无任何嵌套交互） */}
      <button
        type="button"
        onClick={() => setFlipped(true)}
        aria-label={`${label}：翻面，查看隐藏变量`}
        tabIndex={flipped ? -1 : 0}
        className={`absolute inset-0 block w-full text-left p-7 md:p-8 cursor-pointer transition-opacity duration-200 motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-[rgb(var(--cinnabar))] ${
          flipped ? 'opacity-0 invisible pointer-events-none' : 'opacity-100 visible'
        }`}
      >
        {front}
        <span className="absolute bottom-7 left-7 md:bottom-8 md:left-8 font-mono-num text-xs tracking-[0.2em] ink-3">
          FLIP →
        </span>
      </button>

      {/* 背面 · 隐藏变量（纸墨反转；CTA 独立可达） */}
      <div
        className={`absolute inset-0 flex flex-col justify-between p-7 md:p-8 bg-[rgb(var(--ink))] text-[rgb(var(--paper))] transition-opacity duration-200 motion-reduce:transition-none ${
          flipped ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
      >
        <div>{back}</div>
        <div className="mt-6 flex items-end justify-between gap-4 flex-wrap">
          <span className="flex gap-6 flex-wrap">
            {cta.map((c) => (
              <a
                key={c.label}
                href={c.href}
                tabIndex={flipped ? 0 : -1}
                className="font-mono-num text-xs tracking-[0.2em] text-[rgb(var(--paper))]/80 hover:text-[rgb(var(--paper))] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[rgb(var(--cinnabar))]"
              >
                {c.label}
              </a>
            ))}
          </span>
          <button
            type="button"
            onClick={() => setFlipped(false)}
            aria-label={`${label}：翻回表面`}
            tabIndex={flipped ? 0 : -1}
            className="font-mono-num text-xs tracking-[0.2em] text-[rgb(var(--paper))]/50 hover:text-[rgb(var(--paper))]/80 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-[rgb(var(--cinnabar))]"
          >
            ← 翻回
          </button>
        </div>
      </div>
    </div>
  )
}
