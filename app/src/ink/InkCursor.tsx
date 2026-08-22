import { useEffect, useRef } from 'react'

/* ─────────────────────────────────────────────
 * 墨点游标
 * 默认：一粒极小的墨点。
 * 悬停可交互元素：化为一圈空心圆（如涟漪将起）。
 * 点击：一粒朱砂微点，如印落纸，随即化开。
 * 仅在精细指针（鼠标）设备上启用；不做视觉主角。
 * ───────────────────────────────────────────── */

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
const finePointer = () => window.matchMedia('(pointer: fine)').matches

export function InkCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const sparkRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (reduced() || !finePointer()) return
    document.documentElement.classList.add('ink-cursor-on')

    const dot = dotRef.current!
    const ring = ringRef.current!
    const spark = sparkRef.current!
    let x = -100, y = -100, rx = -100, ry = -100
    let hovering = false
    let raf = 0
    let idle = true

    const move = (e: MouseEvent) => {
      x = e.clientX; y = e.clientY
      if (idle) { idle = false; raf = requestAnimationFrame(tick) }
    }
    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement
      const next = !!t.closest('a, button, [role="button"], [data-ink-hover], input, select, textarea, summary')
      if (next !== hovering) {
        hovering = next
        ring.classList.toggle('is-hover', next)
      }
    }
    const down = (e: MouseEvent) => {
      // 朱砂微点：快反馈，随即化开
      spark.style.transition = 'none'
      spark.style.opacity = '1'
      spark.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%,-50%) scale(0.4)`
      requestAnimationFrame(() => {
        spark.style.transition = 'transform 700ms cubic-bezier(.22,.8,.36,1), opacity 700ms ease'
        spark.style.opacity = '0'
        spark.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%,-50%) scale(2.6)`
      })
    }

    const tick = () => {
      // 墨点即点即至；空心圈稍后跟上——一实一虚，一快一慢
      rx += (x - rx) * 0.16
      ry += (y - ry) * 0.16
      dot.style.transform = `translate(${x}px, ${y}px) translate(-50%,-50%)`
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%) scale(${hovering ? 1.3 : 0.32})`
      ring.style.opacity = hovering ? '0.85' : '0'
      if (Math.abs(x - rx) > 0.1 || Math.abs(y - ry) > 0.1 || hovering) {
        raf = requestAnimationFrame(tick)
      } else {
        idle = true
      }
    }

    window.addEventListener('mousemove', move, { passive: true })
    window.addEventListener('mouseover', over, { passive: true })
    window.addEventListener('mousedown', down, { passive: true })
    return () => {
      document.documentElement.classList.remove('ink-cursor-on')
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseover', over)
      window.removeEventListener('mousedown', down)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      <div ref={dotRef} className="ink-cursor-dot" aria-hidden />
      <div ref={ringRef} className="ink-cursor-ring" aria-hidden />
      <div ref={sparkRef} className="ink-cursor-spark" aria-hidden />
    </>
  )
}
