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
      const startTop = 88
      const targetTop = 20
      let frame = 0
      let documentTop = 0
      let sourceLeft = 0
      let sourceWidth = 0
      let sourceHeight = 0
      let targetScale = 1
      let targetLeft = 0
      let scrollRange = 1
      let compact = window.innerWidth < 640
      let sourceHidden: boolean | null = null

      /* 布局只在挂载和视口变化时读取。滚动帧只消费缓存值，避免读写交错触发布局。 */
      const measure = () => {
        const rect = source.getBoundingClientRect()
        const styles = getComputedStyle(source)
        const rootFontSize = Number.parseFloat(getComputedStyle(document.documentElement).fontSize) || 16
        /* 全站共用首页双行标题的滚动时间轴：短标题不再因自身高度较小而加速。
           与首页 clamp(2.8rem, 9vw, 8rem) × 1.08 × 2 行的原始行程一致。 */
        const homeFontSize = Math.min(Math.max(window.innerWidth * 0.09, rootFontSize * 2.8), rootFontSize * 8)
        documentTop = rect.top + window.scrollY
        sourceLeft = rect.left
        sourceWidth = rect.width
        sourceHeight = rect.height
        targetScale = 12 / (Number.parseFloat(styles.fontSize) || 16)
        targetLeft = (window.innerWidth - sourceWidth * targetScale) / 2
        scrollRange = startTop - (56 - homeFontSize * 1.08 * 2)
        compact = window.innerWidth < 640

        ghost.style.left = `${sourceLeft}px`
        ghost.style.top = `${documentTop}px`
        ghost.style.width = `${sourceWidth}px`
        ghost.style.fontFamily = styles.fontFamily
        ghost.style.fontSize = styles.fontSize
        ghost.style.fontWeight = styles.fontWeight
        ghost.style.lineHeight = styles.lineHeight
        ghost.style.letterSpacing = styles.letterSpacing
        ghost.style.textAlign = styles.textAlign
        ghost.style.color = styles.color
        label.textContent = compact && isLongTitle ? shorten(fullLabel, 4) : fullLabel
      }

      const render = () => {
        frame = 0
        const scrollY = window.scrollY
        const rectTop = documentTop - scrollY
        const progress = motionQuery.matches
          ? (rectTop + sourceHeight <= 56 ? 1 : 0)
          : clamp((startTop - rectTop) / scrollRange)
        const horizontalProgress = smoothstep(0.04, 0.9, progress)
        const scaleProgress = smoothstep(0, 0.92, progress)
        const scale = 1 + (targetScale - 1) * scaleProgress
        const nextSourceHidden = progress > 0.001

        if (sourceHidden !== nextSourceHidden) {
          sourceHidden = nextSourceHidden
          source.style.opacity = nextSourceHidden ? '0' : ''
        }
        ghost.style.transform = `translate(${(targetLeft - sourceLeft) * horizontalProgress}px, ${-scrollY + (targetTop - rectTop) * progress}px) scale(${scale})`
        ghost.style.opacity = `${nextSourceHidden ? 1 - smoothstep(0.64, 0.86, progress) : 0}`

        const islandProgress = smoothstep(0.5, 0.94, progress)
        const elasticProgress = spring(islandProgress)
        const labelProgress = smoothstep(0.78, 0.97, progress)
        const expandedWidth = compact ? 104 : 148
        const islandWidth = 40 + (expandedWidth - 40) * elasticProgress
        const stretch = Math.sin(Math.PI * islandProgress)
        const scaleX = 0.9 + 0.1 * islandProgress + 0.04 * stretch
        const scaleY = 0.94 + 0.06 * islandProgress - 0.06 * stretch
        island.style.width = `${islandWidth}px`
        island.style.left = compact ? `${window.innerWidth - 56 - islandWidth / 2}px` : '50%'
        island.style.opacity = `${islandProgress}`
        island.style.visibility = progress > 0.46 ? 'visible' : 'hidden'
        island.style.transform = `translateX(-50%) scale(${scaleX}, ${scaleY})`
        label.style.opacity = `${labelProgress}`
        label.style.transform = `translateY(${4 * (1 - labelProgress)}px)`
      }

      const scheduleRender = () => {
        if (!frame) frame = window.requestAnimationFrame(render)
      }
      const handleResize = () => {
        measure()
        scheduleRender()
      }

      measure()
      render()
      window.addEventListener('scroll', scheduleRender, { passive: true })
      window.addEventListener('resize', handleResize)
      motionQuery.addEventListener('change', scheduleRender)
      detach = () => {
        source.style.opacity = ''
        if (frame) window.cancelAnimationFrame(frame)
        window.removeEventListener('scroll', scheduleRender)
        window.removeEventListener('resize', handleResize)
        motionQuery.removeEventListener('change', scheduleRender)
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
