import { useEffect, useRef, type RefObject } from 'react'
import { createPortal } from 'react-dom'

const clamp = (value: number) => Math.min(1, Math.max(0, value))
const smoothstep = (from: number, to: number, value: number) => {
  const progress = clamp((value - from) / (to - from))
  return progress * progress * (3 - 2 * progress)
}
/* 可逆的滚动弹簧：展开途中允许轻微过冲，回滚时沿原曲线收回。 */
const spring = (value: number) => {
  const progress = clamp(value)
  if (progress === 0 || progress === 1) return progress
  return 1 - Math.exp(-7 * progress) * Math.cos(11 * progress)
}
const shorten = (value: string, max: number) => {
  const text = value.replace(/\s+/g, '')
  const chars = Array.from(text)
  return chars.length > max ? `${chars.slice(0, max).join('')}…` : text
}

const PAGE_LABELS: Record<string, string> = {
  '/': '观察变化',
}

type ScrollTitleIslandProps = {
  containerRef: RefObject<HTMLElement | null>
  path: string
}

/* 全站标题收拢：自动读取当前路由的主标题，无需各页面单独接入。
   标题副本跟随滚动收拢，短标题在黑色胶囊中接力；路由切换时完整清理旧状态。 */
export function ScrollTitleIsland({ containerRef, path }: ScrollTitleIslandProps) {
  const ghostRef = useRef<HTMLDivElement>(null)
  const islandRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const container = containerRef.current
    const ghost = ghostRef.current
    const island = islandRef.current
    const label = labelRef.current
    if (!container || !ghost || !island || !label) return

    let detach = () => {}
    const attach = (source: HTMLElement | null) => {
      if (!source) return false
      detach()

      ghost.innerHTML = source.innerHTML
      ghost.querySelectorAll('[id]').forEach((element) => element.removeAttribute('id'))
      /* 滚动副本不参与页面的逐字落墨：直接以完整标题开始收拢。
         否则栏目页会复制 InkTitle 的隐藏状态，只剩外层位移而文字不可见。 */
      ghost.querySelectorAll<HTMLElement>('.ink-title-reveal span').forEach((element) => {
        element.style.opacity = '1'
        element.style.filter = 'none'
        element.style.transition = 'none'
      })
      const sourceTitle = (source.textContent ?? '').replace(/\s+/g, '')
      const isLongTitle = Array.from(sourceTitle).length > 6
      const fullLabel = PAGE_LABELS[path] ?? (isLongTitle ? shorten(sourceTitle, 6) : sourceTitle)
      const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

      const render = () => {
        const rect = source.getBoundingClientRect()
        const startTop = 88
        /* 全站共用首页双行标题的滚动时间轴：短标题不再因自身高度较小而加速。
           与首页 clamp(2.8rem, 9vw, 8rem) × 1.08 × 2 行的原始行程一致。 */
        const rootFontSize = Number.parseFloat(getComputedStyle(document.documentElement).fontSize) || 16
        const homeFontSize = Math.min(Math.max(window.innerWidth * 0.09, rootFontSize * 2.8), rootFontSize * 8)
        const scrollRange = startTop - (56 - homeFontSize * 1.08 * 2)
        const progress = motionQuery.matches
          ? (rect.bottom <= 56 ? 1 : 0)
          : clamp((startTop - rect.top) / scrollRange)
        const styles = getComputedStyle(source)
        const targetScale = 12 / Number.parseFloat(styles.fontSize)
        const horizontalProgress = smoothstep(0.04, 0.9, progress)
        const scaleProgress = smoothstep(0, 0.92, progress)
        const scale = 1 + (targetScale - 1) * scaleProgress
        const targetLeft = (window.innerWidth - rect.width * targetScale) / 2
        const targetTop = 20

        source.style.opacity = progress > 0.001 ? '0' : ''
        ghost.style.left = `${rect.left}px`
        ghost.style.top = `${rect.top}px`
        ghost.style.width = `${rect.width}px`
        ghost.style.fontFamily = styles.fontFamily
        ghost.style.fontSize = styles.fontSize
        ghost.style.fontWeight = styles.fontWeight
        ghost.style.lineHeight = styles.lineHeight
        ghost.style.letterSpacing = styles.letterSpacing
        ghost.style.textAlign = styles.textAlign
        ghost.style.color = styles.color
        ghost.style.transform = `translate(${(targetLeft - rect.left) * horizontalProgress}px, ${(targetTop - rect.top) * progress}px) scale(${scale})`
        ghost.style.opacity = `${progress > 0.001 ? 1 - smoothstep(0.64, 0.86, progress) : 0}`

        const islandProgress = smoothstep(0.5, 0.94, progress)
        const elasticProgress = spring(islandProgress)
        const labelProgress = smoothstep(0.78, 0.97, progress)
        const compact = window.innerWidth < 640
        const expandedWidth = compact ? 104 : 148
        const islandWidth = 40 + (expandedWidth - 40) * elasticProgress
        const stretch = Math.sin(Math.PI * islandProgress)
        const scaleX = 0.9 + 0.1 * islandProgress + 0.04 * stretch
        const scaleY = 0.94 + 0.06 * islandProgress - 0.06 * stretch
        label.textContent = compact && isLongTitle ? shorten(fullLabel, 4) : fullLabel
        island.style.width = `${islandWidth}px`
        island.style.left = compact ? `${window.innerWidth - 56 - islandWidth / 2}px` : '50%'
        island.style.opacity = `${islandProgress}`
        island.style.visibility = progress > 0.46 ? 'visible' : 'hidden'
        island.style.transform = `translateX(-50%) scale(${scaleX}, ${scaleY})`
        label.style.opacity = `${labelProgress}`
        label.style.transform = `translateY(${4 * (1 - labelProgress)}px)`
      }

      render()
      window.addEventListener('scroll', render, { passive: true })
      window.addEventListener('resize', render)
      motionQuery.addEventListener('change', render)
      detach = () => {
        source.style.opacity = ''
        window.removeEventListener('scroll', render)
        window.removeEventListener('resize', render)
        motionQuery.removeEventListener('change', render)
      }
      observer.disconnect()
      return true
    }

    const observer = new MutationObserver(() => attach(container.querySelector('h1')))
    if (!attach(container.querySelector('h1'))) {
      observer.observe(container, { childList: true, subtree: true })
    }

    return () => {
      observer.disconnect()
      detach()
      ghost.style.opacity = '0'
      island.style.opacity = '0'
      island.style.visibility = 'hidden'
    }
  }, [containerRef, path])

  return createPortal(
    <>
      <div
        ref={ghostRef}
        aria-hidden="true"
        className="fixed left-0 top-0 z-[70] m-0 pointer-events-none opacity-0 will-change-transform"
        style={{ transformOrigin: 'left top' }}
      />
      <div
        ref={islandRef}
        aria-hidden="true"
        className="fixed left-1/2 top-3 z-[71] h-8 overflow-hidden rounded-full bg-ink text-[rgb(var(--paper))] pointer-events-none flex items-center justify-center opacity-0 will-change-transform"
      >
        <span
          ref={labelRef}
          className="font-serif-sc font-bold text-xs leading-none tracking-[0.16em] whitespace-nowrap opacity-0"
        />
      </div>
    </>,
    document.body,
  )
}
