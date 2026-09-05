import { useState, type ReactNode } from 'react'

/* ── FlipCard（V2-C.1 · 2026-09-05 Human 裁决 · 整卡翻转）─────────────────────
 * 语义：表面 → 隐藏变量。翻面是语义，不是表演。
 * · 正面整面即翻面按钮；背面整面即翻回按钮——点击卡片主体负责 Flip，
 *   不再需要「← 翻回」等专门 CTA（删除 FLIP BACK / 返回 / 翻回）；
 * · 背面唯一行动出口 = 右下角 EXPLORE →（独立 <a>，位于整面翻回按钮之上，
 *   结构上互不嵌套——不存在事件冒泡冲突）；
 * · 禁 3D 翻转/缩放/弹跳——以纸墨反转 crossfade 表达「翻」；
 * · 两面键盘与读屏均可达：Enter / Space 触发，隐藏面 visibility:hidden
 *   （不可聚焦）；focus-visible 朱砂焦点环；
 * · prefers-reduced-motion：瞬时切换（motion-reduce:transition-none）。
 * 仅用于首页 Research 阅读卡，不创造第三种状态。 */

export interface FlipCta {
  href: string
  label: string
}

export function FlipCard({
  label,
  front,
  back,
  cta,
  className = '',
}: {
  label: string
  front: ReactNode
  back: ReactNode
  cta?: FlipCta
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
        <span className="absolute bottom-7 right-7 md:bottom-8 md:right-8 font-mono-num text-sm ink-3" aria-hidden="true">
          →
        </span>
      </button>

      {/* 背面 · 隐藏变量（纸墨反转；整面即翻回按钮，EXPLORE 为唯一 CTA） */}
      <div
        className={`absolute inset-0 bg-[rgb(var(--ink))] text-[rgb(var(--paper))] transition-opacity duration-200 motion-reduce:transition-none ${
          flipped ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
      >
        {/* 整面翻回层：位于内容之下，点击卡片任意空白处 = 翻回正面 */}
        <button
          type="button"
          onClick={() => setFlipped(false)}
          aria-label={`${label}：翻回表面`}
          tabIndex={flipped ? 0 : -1}
          className="absolute inset-0 block w-full h-full cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-[rgb(var(--cinnabar))] focus-visible:-outline-offset-2"
        />
        {/* 内容层：默认不拦截点击（穿透到翻回层），仅 EXPLORE 恢复交互 */}
        <div className="relative h-full flex flex-col justify-between p-7 md:p-8 pointer-events-none">
          <div>{back}</div>
          {cta && (
            <div className="mt-6 flex justify-end">
              <a
                href={cta.href}
                tabIndex={flipped ? 0 : -1}
                className="pointer-events-auto font-mono-num text-xs tracking-[0.2em] text-[rgb(var(--paper))]/80 hover:text-[rgb(var(--paper))] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[rgb(var(--cinnabar))]"
              >
                {cta.label}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
