import { useEffect, useRef } from 'react'
import { InkEngine, type InkTone } from './engine'
import { initNavTag, tagPush, popDirection } from './nav'
import { inkBus } from './inkBus'

/* 页面 → 墨色：不同页面不同的墨 */
export function toneForPath(p: string): InkTone {
  if (p.startsWith('/essays') || p.startsWith('/thesis') || p.startsWith('/system') || p.startsWith('/framework')) return 'water'
  if (p.startsWith('/map')) return 'gray'
  if (p.startsWith('/journal')) return 'invert'
  return 'ink'
}

const reduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* 全局拦截站内 hash 链接：点击 → 墨入水 → 换页 → 墨退；
   带 data-ink-back 的链接（返回）与浏览器原生前进/后退：
   → 墨色收束 → 换页 → 逆向展开。两个方向互为镜像。 */
export function InkTransition() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (reduced()) return
    initNavTag()
    const engine = new InkEngine(ref.current!)
    inkBus.engine = engine

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const a = (e.target as HTMLElement).closest('a[href^="#/"]') as HTMLAnchorElement | null
      if (!a) return
      const href = a.getAttribute('href')!
      const target = href.slice(1) // '/xxx'
      const current = window.location.hash.replace(/^#/, '') || '/'
      if (target === current) return
      e.preventDefault()
      const go = () => {
        window.location.hash = target
        tagPush()
      }
      if (a.hasAttribute('data-ink-back')) {
        engine.recede(e.clientX, e.clientY, toneForPath(target), go)
      } else {
        engine.drop(e.clientX, e.clientY, toneForPath(target), go)
      }
    }

    // 浏览器前进/后退：页面已被浏览器切换，
    // 以满墨收束开窗的方式补上统一的收束过渡，不允许裸切
    const onPop = (e: PopStateEvent) => {
      popDirection(e)
      const p = window.location.hash.replace(/^#/, '') || '/'
      engine.revealBack(window.innerWidth * 0.3, window.innerHeight * 0.42, toneForPath(p))
    }

    document.addEventListener('click', onClick, true)
    window.addEventListener('popstate', onPop)
    return () => {
      document.removeEventListener('click', onClick, true)
      window.removeEventListener('popstate', onPop)
      inkBus.engine = null
      engine.destroy()
    }
  }, [])

  if (typeof window !== 'undefined' && reduced()) return null
  return (
    <canvas
      ref={ref}
      aria-hidden
      className="fixed inset-0 z-[90] pointer-events-none"
    />
  )
}
