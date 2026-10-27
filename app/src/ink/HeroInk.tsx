import { useEffect, useRef, type RefObject } from 'react'
import { reducedMotion } from './brush'

/* 首屏笔墨 · 方案五（2026-10-26 Human 批准）：
 * 静态排版一字不动——朱砂句号由墨「泅」出自己凝住（soak），
 * 光标游走留淡墨润笔痕（trail）。两 canvas 叠于首屏，
 * 落墨一次即驻留；prefers-reduced-motion 直接成图、关闭润笔。
 * 算法逐行移植自 00_PROJECT/DESIGN_AUDIT/home-hero-demo.html。 */

const CIN = '192,57,43' // 朱砂；勿改空格格式——addColorStop 对 rgb 串的空格敏感

export function HeroInk({ dotRef }: { dotRef: RefObject<HTMLSpanElement | null> }) {
  const soakRef = useRef<HTMLCanvasElement>(null)
  const trailRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const hero = soakRef.current?.parentElement
    const soakCv = soakRef.current
    const trailCv = trailRef.current
    if (!hero || !soakCv || !trailCv) return
    const reduced = reducedMotion()

    /* ── 墨泅标点：灰晕先起，朱砂随后凝住 ── */
    const soak = (prog: number) => {
      const dot = dotRef.current
      if (!dot) return
      const r = hero.getBoundingClientRect(),
        ar = dot.getBoundingClientRect()
      const cx = ar.left - r.left + ar.width / 2,
        cy = ar.top - r.top + ar.height * 0.6
      const dpr = Math.min(1.5, window.devicePixelRatio || 1)
      if (soakCv.width !== Math.round(r.width * dpr)) {
        soakCv.width = Math.round(r.width * dpr)
        soakCv.height = Math.round(r.height * dpr)
      }
      const ctx = soakCv.getContext('2d')
      if (!ctx) return
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, r.width, r.height)
      const t1 = Math.min(1, prog / 0.45),
        t2 = Math.max(0, Math.min(1, (prog - 0.4) / 0.6))
      const ease = (x: number) => 1 - Math.pow(1 - x, 3)
      if (prog < 1) {
        ctx.beginPath()
        ctx.arc(cx, cy, 3 + 16 * ease(t1) * (1 - t2 * 0.5), 0, 7)
        ctx.fillStyle = `rgba(64,64,64,${0.3 * (1 - t2 * 0.6)})`
        ctx.fill()
      }
      const rad = Math.max(4.4, ar.height * 0.11) * ease(t2)
      const g = ctx.createRadialGradient(cx - rad * 0.2, cy - rad * 0.25, rad * 0.1, cx, cy, rad)
      g.addColorStop(0, `rgba(${CIN},${0.92 * ease(t2)})`)
      g.addColorStop(1, `rgba(${CIN},${0.9 * ease(t2)})`)
      ctx.beginPath()
      ctx.arc(cx, cy, rad, 0, 7)
      ctx.fillStyle = g
      ctx.fill()
    }

    /* ── 启动：墨泅一次；缩放/字体就绪后补正到终态 ── */
    const animate = (fn: (p: number) => void, dur: number) => {
      const t0 = performance.now()
      const loop = () => {
        const p = Math.min(1, (performance.now() - t0) / dur)
        const e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2
        fn(e)
        if (p < 1) requestAnimationFrame(loop)
      }
      requestAnimationFrame(loop)
    }
    const boot = () => {
      if (reduced) soak(1)
      else setTimeout(() => animate(soak, 1150), 350)
    }
    boot()
    const onResize = () => soak(1)
    window.addEventListener('resize', onResize)
    document.fonts?.ready.then(() => soak(1)).catch(() => {})

    /* ── 润笔：光标游走留淡痕（2.4s 淡出，56 点上限） ── */
    let raf = 0
    const trail: { x: number; y: number; r: number; t: number }[] = []
    let lastT = 0
    const trailTick = () => {
      const r = hero.getBoundingClientRect(),
        dpr = Math.min(1.5, window.devicePixelRatio || 1)
      if (trailCv.width !== Math.round(r.width * dpr)) {
        trailCv.width = Math.round(r.width * dpr)
        trailCv.height = Math.round(r.height * dpr)
      }
      const ctx = trailCv.getContext('2d')
      if (ctx) {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
        ctx.clearRect(0, 0, r.width, r.height)
        const now = performance.now()
        for (let i = trail.length - 1; i >= 0; i--) {
          const p = trail[i],
            age = (now - p.t) / 2400
          if (age >= 1) {
            trail.splice(i, 1)
            continue
          }
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.r * (1 + age * 0.6), 0, 7)
          ctx.fillStyle = `rgba(64,64,64,${(1 - age) * 0.09})`
          ctx.fill()
        }
      }
      raf = requestAnimationFrame(trailTick)
    }
    const onMove = (e: MouseEvent) => {
      const now = performance.now()
      if (now - lastT < 30) return
      lastT = now
      const r = hero.getBoundingClientRect()
      trail.push({ x: e.clientX - r.left, y: e.clientY - r.top, r: 2.4 + Math.random() * 2.4, t: now })
      if (trail.length > 56) trail.shift()
    }
    const onTouch = (e: TouchEvent) => {
      const now = performance.now()
      if (now - lastT < 30) return
      lastT = now
      const r = hero.getBoundingClientRect(),
        t0 = e.touches[0]
      if (!t0) return
      trail.push({ x: t0.clientX - r.left, y: t0.clientY - r.top, r: 2.4 + Math.random() * 2.4, t: now })
      if (trail.length > 56) trail.shift()
    }
    if (!reduced) {
      raf = requestAnimationFrame(trailTick)
      hero.addEventListener('mousemove', onMove)
      hero.addEventListener('touchmove', onTouch, { passive: true })
    }

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      hero.removeEventListener('mousemove', onMove)
      hero.removeEventListener('touchmove', onTouch)
    }
  }, [dotRef])

  return (
    <>
      <canvas ref={soakRef} aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" />
      <canvas ref={trailRef} aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" />
    </>
  )
}
