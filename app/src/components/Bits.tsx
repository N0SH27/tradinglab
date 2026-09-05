import React from 'react'

/* 标签：小字号、宽字距、等宽数字 */
export function Label({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <span className={`label-sm ${className}`}>{children}</span>
}

/* 区块头：编号 + 中文名 + 英文名 + 发丝线 */
export function SectionHead({
  no, zh, en, note,
}: { no: string; zh: string; en: string; note?: string }) {
  return (
    <div className="hairline-t pt-5 mb-12 md:mb-16">
      <div className="flex items-baseline justify-between gap-4 flex-wrap">
        <div className="flex items-baseline gap-4">
          <span className="font-mono-num text-sm ink-3 tnum">{no}</span>
          <h2 className="font-serif-sc text-2xl md:text-3xl font-bold tracking-wide">{zh}</h2>
          <Label>{en}</Label>
        </div>
        {note && <span className="text-sm ink-3">{note}</span>}
      </div>
    </div>
  )
}

/* 太极图：极简 SVG，可选慢速旋转 */
export function Taiji({
  size = 120, className = '', slow = false,
}: { size?: number; className?: string; slow?: boolean }) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 100 100"
      className={`${slow ? 'taiji-slow' : ''} ${className}`}
      aria-label="太极"
    >
      <circle cx="50" cy="50" r="49" fill="rgb(var(--paper))" stroke="rgb(var(--ink))" strokeWidth="1" />
      <path
        d="M50 1 a49 49 0 0 1 0 98 a24.5 24.5 0 0 1 0 -49 a24.5 24.5 0 0 0 0 -49 Z"
        fill="rgb(var(--ink))"
      />
      <circle cx="50" cy="25.5" r="4.5" fill="rgb(var(--paper))" />
      <circle cx="50" cy="74.5" r="4.5" fill="rgb(var(--ink))" />
    </svg>
  )
}

/* 阴阳标记 */
export function PolarityTag({ polarity }: { polarity: 'yang' | 'yin' | 'turn' }) {
  if (polarity === 'yang')
    return (
      <span className="inline-flex items-center gap-1.5 text-xs tracking-widest">
        <span className="inline-block w-2 h-2 bg-ink" /> 阳
      </span>
    )
  if (polarity === 'yin')
    return (
      <span className="inline-flex items-center gap-1.5 text-xs tracking-widest water">
        <span className="inline-block w-2 h-2 border border-current" /> 阴
      </span>
    )
  return (
    <span className="inline-flex items-center gap-1.5 text-xs tracking-widest">
      <span className="inline-block w-2 h-2 bg-cinnabar" /> 转换中
    </span>
  )
}

/* 页头：大标题区（no 可选——V2-C · B-10：报告页首屏以标题为唯一主标识，不再传 no） */
export function PageHead({
  no, zh, en, intro,
}: { no?: string; zh: string; en: string; intro?: string }) {
  return (
    <header className="pt-28 md:pt-40 pb-16 md:pb-24">
      <div className="flex items-baseline gap-4 mb-8">
        {no && <span className="font-mono-num text-sm ink-3 tnum">{no}</span>}
        <Label>{en}</Label>
      </div>
      <h1 className="font-serif-sc font-black leading-none tracking-tight text-[clamp(3rem,10vw,7.5rem)]">
        {zh}
      </h1>
      {intro && (
        <p className="mt-8 md:mt-10 max-w-2xl text-base md:text-lg leading-relaxed ink-2">{intro}</p>
      )}
    </header>
  )
}
