import { useEffect, useRef } from 'react'
import { parentOf, tagPush } from './nav'
import { toneForPath } from './InkTransition'
import { inkBus } from './inkBus'
import { NAV } from '../data/content'

/* ─────────────────────────────────────────────
 * 移动端：左缘右滑 = 收束返回
 *
 * 手指自左缘右移：当前页随指轻微右移并减弱，
 * 上一层自淡墨下渐显（最初非常淡），左缘泛起一线墨色。
 * 未达阈值：水面归平——一切平滑回到原位。
 * 达成：墨色收束（engine.recede），逆向展开到上一层。
 *
 * 与系统手势共存：只在「左缘起始 + 横向主导」时介入；
 * 若浏览器原生边缘手势胜出，popstate 的 reveal 过渡
 * 会兜底，保证体验统一。仅存在于有明确上一层的页面。
 * ───────────────────────────────────────────── */

const EDGE = 26 // 左缘触发区（px）
const ENGAGE = 12 // 起判位移（px）
const FULL = 0.42 // 滑过屏宽此比例必触发
const HARD = 120 // 绝对位移阈值（px）

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
const curPath = () => window.location.hash.replace(/^#/, '') || '/'

export function SwipeBack() {
  const underRef = useRef<HTMLDivElement>(null)
  const veilRef = useRef<HTMLDivElement>(null)
  const edgeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!window.matchMedia('(pointer: coarse)').matches) return
    const under = underRef.current!
    const veil = veilRef.current!
    const edge = edgeRef.current!
    const root = () => document.getElementById('page-root')

    let tracking = false
    let engaged = false
    let settled = false
    let sx = 0, sy = 0, dx = 0, p = 0

    const reset = (smooth: boolean) => {
      const el = root()
      const els = [el, under, veil, edge].filter(Boolean) as HTMLElement[]
      if (smooth) {
        // 水面归平：慢、稳、无弹跳
        els.forEach((n) => {
          n.style.transition = 'transform 640ms cubic-bezier(.22,.8,.36,1), opacity 640ms ease'
        })
      }
      if (el) {
        el.style.transform = ''
        el.style.opacity = ''
      }
      under.style.opacity = '0'
      veil.style.opacity = '0'
      edge.style.opacity = '0'
      if (smooth) {
        window.setTimeout(() => els.forEach((n) => { n.style.transition = '' }), 700)
      }
    }

    const onStart = (e: TouchEvent) => {
      const t = e.touches[0]
      if (!parentOf(curPath()) || t.clientX > EDGE) return
      const src = e.target as Element | null
      if (src && typeof src.closest === 'function' && src.closest('[data-no-swipe]')) return
      tracking = true
      engaged = false
      settled = false
      sx = t.clientX
      sy = t.clientY
      dx = 0
      p = 0
      const par = parentOf(curPath())!
      const flat = NAV.flatMap((n) => ('children' in n ? n.children : [n]))
      const label = flat.find((n) => n.path === par)?.label ?? ''
      const slot = under.querySelector('[data-parent-label]')
      if (slot) slot.textContent = label
    }

    const onMove = (e: TouchEvent) => {
      if (!tracking || settled) return
      const t = e.touches[0]
      dx = t.clientX - sx
      const dy = t.clientY - sy
      if (!engaged) {
        if (dx > ENGAGE && dx > Math.abs(dy) * 1.2) {
          engaged = true // 横向主导：手势成立
        } else if (Math.abs(dy) > ENGAGE || dx < -ENGAGE) {
          tracking = false // 纵向滚动或左滑：让位
          return
        } else {
          return
        }
      }
      p = Math.min(dx / (window.innerWidth * FULL), 1)
      const shift = Math.min(dx * 0.36, 110) // 移动幅度克制
      const el = root()
      if (el) {
        el.style.transform = `translateX(${shift}px)`
        el.style.opacity = String(1 - p * 0.22) // 当前页逐渐减弱
      }
      veil.style.opacity = String(p * 0.1) // 墨色轻罩
      under.style.opacity = String(Math.min(p * 1.1, 0.95)) // 上一层渐显
      edge.style.opacity = String(0.2 + p * 0.55) // 左缘流动线
    }

    const onEnd = () => {
      if (!tracking) return
      tracking = false
      if (!engaged || settled) return
      settled = true
      const par = parentOf(curPath())
      if (!par) {
        reset(true)
        return
      }
      if (p >= 1 || dx > HARD) {
        // 达成：墨色收束 → 换页 → 逆向展开
        const eng = inkBus.engine
        if (eng && !reduced() && !eng.busy) {
          eng.recede(window.innerWidth * 0.06, window.innerHeight * 0.45, toneForPath(par), () => {
            reset(false)
            window.location.hash = par
            tagPush()
          })
        } else {
          reset(false)
          window.location.hash = par
          tagPush()
        }
      } else {
        reset(true) // 未达阈值：水面归平
      }
    }

    const onPop = () => reset(false) // 系统手势胜出时兜底复位

    window.addEventListener('touchstart', onStart, { passive: true })
    window.addEventListener('touchmove', onMove, { passive: true })
    window.addEventListener('touchend', onEnd, { passive: true })
    window.addEventListener('touchcancel', onEnd, { passive: true })
    window.addEventListener('popstate', onPop)
    return () => {
      window.removeEventListener('touchstart', onStart)
      window.removeEventListener('touchmove', onMove)
      window.removeEventListener('touchend', onEnd)
      window.removeEventListener('touchcancel', onEnd)
      window.removeEventListener('popstate', onPop)
    }
  }, [])

  if (typeof window !== 'undefined' && reduced()) return null
  return (
    <>
      {/* 上一层：最初非常淡，像隐藏在墨色之下 */}
      <div ref={underRef} aria-hidden className="fixed inset-0 z-0 pointer-events-none opacity-0 bg-paper">
        <div
          className="h-full flex items-center pl-8"
          style={{ background: 'linear-gradient(to right, rgba(10,10,10,0.05), transparent 45%)' }}
        >
          <span data-parent-label className="font-serif-sc font-black text-6xl tracking-tight" style={{ opacity: 0.1 }} />
        </div>
      </div>
      {/* 当前页的轻墨罩：随拖拽渐浓 */}
      <div
        ref={veilRef}
        aria-hidden
        className="fixed inset-0 z-[70] pointer-events-none opacity-0"
        style={{ background: 'linear-gradient(to right, rgba(10,10,10,0.9), rgba(10,10,10,0.35) 55%, transparent)' }}
      />
      {/* 左缘流动线：手势成立的极轻反馈 */}
      <div
        ref={edgeRef}
        aria-hidden
        className="fixed left-0 top-0 bottom-0 w-[2px] z-[80] pointer-events-none opacity-0"
        style={{ background: 'linear-gradient(to bottom, transparent, rgba(10,10,10,0.5) 30%, rgba(10,10,10,0.5) 70%, transparent)' }}
      />
    </>
  )
}
