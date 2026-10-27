/* ─────────────────────────────────────────────
 * 行笔墨刷 · Brush Engine & Components
 *
 * 源自 DESIGN_AUDIT 系列 demo 的定稿算法：
 * · paintFrame — 4 号「淡墨飞白 · 残边」墨迹边框（瓦片四边形、双频呼吸、
 *   转角交叠；飞白留 30% 底痕，纸纹始终挂得住墨）
 * · strokePts / paintBands — 带状行笔（行气/分隔线共用）
 * · <InkFrame> 卡片墨迹边框 · <Seal> 印章（实测包围盒适配）
 * · <InkDivider> 笔迹分隔（浓划/淡痕） · <EdgeStroke> 纸缘行气
 *   （2026-10-27 结合版：巨字题眼 × 点景 × 朱点，马善正楷书子集本地加载）
 * · <InkTitle> 落墨成字 · <Anno> 朱笔圈点
 * 全部：落墨一次即驻留；prefers-reduced-motion 直接成图。
 * ───────────────────────────────────────────── */
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'

export const reducedMotion = () =>
  typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches

/* ── 基础 ── */
function hash(n: number) {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453
  return s - Math.floor(s)
}
function vnoise(x: number, seed: number) {
  const i0 = Math.floor(x),
    f = x - i0,
    s = f * f * (3 - 2 * f)
  return hash(i0 * 3.7 + seed) * (1 - s) + hash((i0 + 1) * 3.7 + seed) * s
}
const INK: Record<string, [number, number, number]> = {
  concentrated: [13, 13, 13],
  rich: [26, 26, 26],
  soot: [60, 60, 60],
  graphite: [84, 84, 84],
  slate: [52, 52, 52],
  silver: [135, 135, 135],
  pale: [170, 170, 170],
  mist: [220, 220, 220],
}
const inkA = (c: string, a: number) =>
  `rgba(${INK[c][0]},${INK[c][1]},${INK[c][2]},${Math.max(0, Math.min(1, a)).toFixed(3)})`

/* ── 墨迹边框 · 4 号淡墨飞白残边 ───────────────────────────────────── */
function framePath(W: number, H: number, seed: number) {
  const m = 7
  const per = 2 * (W - 2 * m) + 2 * (H - 2 * m)
  const N = Math.max(160, Math.round(per / 7))
  const pts: { x: number; y: number; d: number; tan: number }[] = []
  for (let i = 0; i < N; i++) {
    const s = i / N,
      d = s * per
    let x: number, y: number, tan: number
    const a = W - 2 * m,
      b = H - 2 * m
    if (d < a) {
      x = m + d
      y = m
      tan = 0
    } else if (d < a + b) {
      x = W - m
      y = m + (d - a)
      tan = Math.PI / 2
    } else if (d < 2 * a + b) {
      x = W - m - (d - a - b)
      y = H - m
      tan = Math.PI
    } else {
      x = m
      y = H - m - (d - 2 * a - b)
      tan = -Math.PI / 2
    }
    const nx = -Math.sin(tan),
      ny = Math.cos(tan)
    const wob = (vnoise(d / 30, seed) - 0.5) * 0.7 + (vnoise(d / 9, seed + 9) - 0.5) * 0.25
    pts.push({ x: x + nx * wob, y: y + ny * wob, d, tan })
  }
  return pts
}

function paintFrame(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  o: { seed: number; baseW?: number; dark?: boolean; dry?: boolean; prog?: number }
) {
  const pts = framePath(W, H, o.seed)
  const n = Math.max(2, Math.floor(pts.length * (o.prog ?? 1)))
  const col = o.dark ? [40, 40, 40] : [110, 110, 110]
  const L = pts.length
  const baseW = o.baseW ?? 1.3
  for (let i = 0; i < n; i++) {
    const p = pts[i],
      q = pts[(i + 1) % L]
    if (q.d < p.d && (o.prog ?? 1) < 1) break // 勾框进度：未圆满时封口前停
    let a = 0.5 + 0.18 * (vnoise(p.d / 300, o.seed + 3) - 0.5) + 0.05 * (vnoise(p.d / 170, o.seed + 5) - 0.5)
    if (o.dry) {
      // 飞白骤淡，但留底痕
      const t = Math.max(0, Math.min(1, (vnoise(p.d / 90, o.seed + 7) - 0.3) / 0.55))
      a *= 0.3 + 0.7 * Math.pow(t, 1.3)
    }
    const hp = (baseW * (0.9 + 0.22 * vnoise(p.d / 110, o.seed + 11))) / 2
    const hq = (baseW * (0.9 + 0.22 * vnoise(q.d / 110, o.seed + 11))) / 2
    const nx = -Math.sin(p.tan),
      ny = Math.cos(p.tan)
    ctx.fillStyle = `rgba(${col[0]},${col[1]},${col[2]},${a.toFixed(3)})`
    ctx.beginPath()
    ctx.moveTo(p.x + nx * hp, p.y + ny * hp)
    ctx.lineTo(q.x + nx * hq, q.y + ny * hq)
    ctx.lineTo(q.x - nx * hq, q.y - ny * hq)
    ctx.lineTo(p.x - nx * hp, p.y - ny * hp)
    ctx.closePath()
    ctx.fill()
  }
  if ((o.prog ?? 1) >= 1) {
    const m = 7
    const corners: [number, number][] = [[m, m], [W - m, m], [W - m, H - m], [m, H - m]]
    corners.forEach(([x, y], i) => {
      const a = o.dark ? 0.3 : 0.2
      ctx.fillStyle = `rgba(${col[0]},${col[1]},${col[2]},${a})`
      ctx.beginPath()
      ctx.arc(x, y, 0.9 + hash(o.seed + i) * 0.4, 0, 7)
      ctx.fill()
    })
  }
}

/* ── 带状行笔 ───────────────────────────────────────────────────── */
interface Pt {
  x: number
  y: number
  s: number
  nx: number
  ny: number
  w: number
}
interface StrokeCfg {
  N?: number
  yK: number
  amps: [number, number, number]
  f: [number, number, number]
  ph: number
  baseW: number
  envIn: number
  envOut: number
  pressFreq: number
  pressDepth: number
  seed: number
}
function strokePts(W: number, H: number, o: StrokeCfg): Pt[] {
  const N = o.N || 220
  const pts: Pt[] = []
  for (let i = 0; i < N; i++) {
    const s = i / (N - 1),
      x = s * W
    const y =
      H * o.yK +
      o.amps[0] * Math.sin(s * o.f[0] + o.ph) +
      o.amps[1] * Math.sin(s * o.f[1] + o.ph) +
      o.amps[2] * Math.sin(s * o.f[2] + o.ph)
    pts.push({ x, y, s, nx: 0, ny: 0, w: 1 })
  }
  for (let i = 0; i < N; i++) {
    const a = pts[Math.max(0, i - 1)],
      b = pts[Math.min(N - 1, i + 1)]
    const tx = b.x - a.x,
      ty = b.y - a.y,
      l = Math.hypot(tx, ty) || 1
    pts[i].nx = -ty / l
    pts[i].ny = tx / l
  }
  let pw: number | null = null
  for (let i = 0; i < N; i++) {
    const s = pts[i].s
    let env: number
    if (s < o.envIn) env = 0.35 + (s / o.envIn) * 0.65
    else if (s > o.envOut) env = Math.max(0.12, 1 - ((s - o.envOut) / (1 - o.envOut)) * 0.88)
    else env = 1
    const press = 1 - o.pressDepth * Math.pow(Math.max(0, Math.sin(s * Math.PI * o.pressFreq + 0.6)), 2)
    let w = Math.max(1.2, o.baseW * env * press * (0.94 + 0.1 * Math.sin(i * 0.21 + o.seed)))
    if (pw !== null) w = pw * 0.6 + w * 0.4
    pw = w
    pts[i].w = w
  }
  return pts
}
type Stops = [number, string][]
function paintBands(
  ctx: CanvasRenderingContext2D,
  pts: Pt[],
  n: number,
  o: { stops: Stops; alpha: number; pad?: number; tipDry?: boolean; wob?: (k: number) => number }
) {
  const K = 18
  for (let b = 0; b < K; b++) {
    const sc = 1.3 - b * (0.78 / K)
    let col = o.stops[0][1]
    for (const [r, c] of o.stops) if (sc <= r) col = c
    const C = o.alpha * (sc > 0.8 ? Math.exp(-Math.pow((sc - 0.8) / 0.3, 2)) : 1)
    ctx.fillStyle = inkA(col, C)
    ctx.beginPath()
    for (let k = 0; k < n; k++) {
      const p = pts[k]
      let extra = 0
      if (o.tipDry && k > n - 7 && n > 8) extra = -(1 - (n - k) / 7) * p.w * 0.22
      const hw = (p.w * sc) / 2 + (o.pad || 0) + extra + (o.wob ? o.wob(k) : 0)
      k === 0 ? ctx.moveTo(p.x + p.nx * hw, p.y + p.ny * hw) : ctx.lineTo(p.x + p.nx * hw, p.y + p.ny * hw)
    }
    for (let k = n - 1; k >= 0; k--) {
      const p = pts[k]
      let extra = 0
      if (o.tipDry && k > n - 7 && n > 8) extra = -(1 - (n - k) / 7) * p.w * 0.22
      const hw = (p.w * sc) / 2 + (o.pad || 0) + extra + (o.wob ? o.wob(k) : 0)
      ctx.lineTo(p.x - p.nx * hw, p.y - p.ny * hw)
    }
    ctx.closePath()
    ctx.fill()
  }
}
const GRAY_STOPS: Stops = [[1.3, 'mist'], [1.12, 'pale'], [0.95, 'silver'], [0.72, 'graphite'], [0, 'slate']]
const DARK_STOPS: Stops = [[1.3, 'mist'], [1.1, 'graphite'], [0.95, 'soot'], [0.7, 'rich'], [0, 'concentrated']]

/* 勾框进度动画（入视口一次） */
function animateOnView(
  el: HTMLElement,
  draw: (prog: number) => void,
  dur = 1300,
  threshold = 0.3
) {
  if (reducedMotion()) {
    draw(1)
    return
  }
  draw(0)
  const io = new IntersectionObserver(
    (es) =>
      es.forEach((e) => {
        if (!e.isIntersecting) return
        io.disconnect()
        const t0 = performance.now()
        const tick = () => {
          const p = Math.min(1, (performance.now() - t0) / dur)
          draw(1 - Math.pow(1 - p, 2.4))
          if (p < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      }),
    { threshold }
  )
  io.observe(el)
}

/* ══ <InkFrame> · 4 号淡墨飞白残边 ══════════════════════════════════ */
export function InkFrame({ seed, className = '' }: { seed: number; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const cv = ref.current
    if (!cv || !cv.parentElement) return
    const parent = cv.parentElement
    const draw = (prog: number) => {
      const c = cv.getContext('2d')
      if (!c) return
      c.clearRect(0, 0, cv.width, cv.height)
      paintFrame(c, cv.width, cv.height, { seed, baseW: 1.3, dark: false, dry: true, prog })
    }
    const fit = () => {
      cv.width = parent.clientWidth
      cv.height = parent.clientHeight
    }
    fit()
    animateOnView(parent, draw, 1300, 0.25)
    const ro = new ResizeObserver(() => {
      fit()
      draw(1)
    })
    ro.observe(parent)
    return () => ro.disconnect()
  }, [seed])
  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  )
}

/* ══ <Seal> · 印章（白文朱砂；字数自适应，实测包围盒收入内框）══════════ */
export function Seal({ text, size = 24, title }: { text: string; size?: number; title?: string }) {
  const ref = useRef<SVGSVGElement>(null)
  const chars = [...text]
  let cells: [number, number, string][] = []
  let fs = size * 0.42
  if (chars.length <= 2) {
    const lineH = size * 0.44
    const y0 = 30 - (chars.length * lineH) / 2 + lineH * 0.72
    cells = chars.map((c, i) => [30, y0 + i * lineH, c] as [number, number, string])
  } else if (chars.length === 3) {
    const lineH = 60 * 0.21 // viewBox 单位下的行距，纵向三列紧凑排
    const y0 = 30 - (3 * lineH) / 2 + lineH * 0.72
    cells = chars.map((c, i) => [30, y0 + i * lineH, c] as [number, number, string])
    fs = 60 * 0.26
  } else {
    const rows = Math.ceil(chars.length / 2)
    fs = 60 * 0.3
    const lineH = fs * 1.16
    const y0 = 30 - (rows * lineH) / 2 + fs * 0.62
    const colX = [39, 21]
    cells = chars.map(
      (c, i) => [colX[Math.floor(i / rows)], y0 + (i % rows) * lineH, c] as [number, number, string]
    )
  }
  // 实测包围盒：缩放进内框并居中
  useLayoutEffect(() => {
    const svg = ref.current
    if (!svg) return
    const texts = svg.querySelectorAll('text')
    if (!texts.length) return
    const union = () => {
      let x0 = 1e9,
        y0 = 1e9,
        x1 = -1e9,
        y1 = -1e9
      texts.forEach((t) => {
        const b = t.getBBox()
        x0 = Math.min(x0, b.x)
        y0 = Math.min(y0, b.y)
        x1 = Math.max(x1, b.x + b.width)
        y1 = Math.max(y1, b.y + b.height)
      })
      return { x: x0, y: y0, width: x1 - x0, height: y1 - y0 }
    }
    const IN = { x: 10, y: 10, w: 40, h: 40 }
    let b = union()
    const s = Math.min(IN.w / b.width, IN.h / b.height)
    if (s < 1) {
      const fs0 = parseFloat(texts[0].getAttribute('font-size') || '16')
      texts.forEach((t) => t.setAttribute('font-size', (fs0 * s * 0.96).toFixed(2)))
    }
    b = union()
    const dx = IN.x + (IN.w - b.width) / 2 - b.x
    const dy = IN.y + (IN.h - b.height) / 2 - b.y
    texts.forEach((t) => {
      t.setAttribute('x', (parseFloat(t.getAttribute('x') || '0') + dx).toFixed(2))
      t.setAttribute('y', (parseFloat(t.getAttribute('y') || '0') + dy).toFixed(2))
    })
  }, [text, size])
  return (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox="0 0 60 60"
      role="img"
      aria-label={title ?? text}
      className="inline-block align-middle"
    >
      <defs>
        <filter id={`sealR${text}${size}`} x="-8%" y="-8%" width="116%" height="116%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.55"
            numOctaves="2"
            result="n"
            seed={text.length * 7 + size}
          />
          <feDisplacementMap in="SourceGraphic" in2="n" scale={size * 0.055} />
        </filter>
        <radialGradient id={`sealG${text}${size}`} cx="42%" cy="38%" r="75%">
          <stop offset="0%" stopColor="rgba(192,57,43,.92)" />
          <stop offset="72%" stopColor="rgba(192,57,43,.82)" />
          <stop offset="100%" stopColor="rgba(192,57,43,.62)" />
        </radialGradient>
      </defs>
      <g filter={`url(#sealR${text}${size})`}>
        <rect x="4" y="4" width="52" height="52" rx="7" fill={`url(#sealG${text}${size})`} />
        <rect
          x="8.5"
          y="8.5"
          width="43"
          height="43"
          rx="4.5"
          fill="none"
          stroke="rgba(250,250,249,.85)"
          strokeWidth="1.6"
        />
        {cells.map(([x, y, c], i) => (
          <text
            key={i}
            x={x}
            y={y}
            fontSize={fs}
            fontFamily="'Noto Serif SC','Songti SC',serif"
            fontWeight={900}
            fill="rgb(var(--paper))"
            textAnchor="middle"
          >
            {c}
          </text>
        ))}
      </g>
    </svg>
  )
}

/* ══ <InkDivider> · 笔迹分隔：heavy 浓划（章节）/ light 淡痕（小节）══════ */
export function InkDivider({
  variant = 'light',
  className = '',
}: {
  variant?: 'heavy' | 'light'
  className?: string
}) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const cv = ref.current
    if (!cv || !cv.parentElement) return
    const parent = cv.parentElement
    const W = () => Math.max(60, parent.clientWidth)
    const heavy = variant === 'heavy'
    const draw = (prog: number) => {
      const c = cv.getContext('2d')
      if (!c) return
      cv.width = W()
      cv.height = heavy ? 22 : 12
      c.clearRect(0, 0, cv.width, cv.height)
      const cfg: StrokeCfg = heavy
        ? { N: 200, yK: 0.5, amps: [2.4, 1, 0.4], f: [3.4, 8, 15], ph: 2.2, baseW: 5, envIn: 0.22, envOut: 0.78, pressFreq: 1, pressDepth: 0.15, seed: 11 }
        : { N: 220, yK: 0.5, amps: [1.6, 0.7, 0.3], f: [2.6, 6.5, 12], ph: 0.9, baseW: 2.4, envIn: 0.12, envOut: 0.85, pressFreq: 0.8, pressDepth: 0.2, seed: 17 }
      const pts = strokePts(cv.width, cv.height, cfg)
      const n = Math.max(2, Math.floor(pts.length * prog))
      paintBands(c, pts, n, { stops: heavy ? DARK_STOPS : GRAY_STOPS, alpha: heavy ? 0.55 : 0.4, pad: 0.3, tipDry: true })
    }
    animateOnView(parent, draw, heavy ? 1000 : 1400, 0.6)
    const ro = new ResizeObserver(() => draw(1))
    ro.observe(parent)
    return () => ro.disconnect()
  }, [variant])
  return <canvas ref={ref} aria-hidden="true" className={`block w-full ${className}`} />
}

/* ══ <EdgeStroke> · 纸缘行气（2026-10-27 六裁：只留一个淡淡的巨字）══════════
 * 右缘只落巨型题眼字一个图层——不要点景、不要散点、不要朱点、不要涨墨、
 * 不要撕裂、不要游丝、不要飞溅（Human 裁决：特效以后再加）。
 * 骨架字体仍是马善正楷书子集（本地 @font-face MaShanZheng），两层炸毫低透明度成水印。
 * 可见窗 = 字宽 [2%, 75%]（又全见前），右缘沟出血 25% 字宽；canvas z-[-1]（#page-root 内）。
 * 题眼字：全站每页一字（Layout.edgeChar 映射：观/复/记/证/无/易/律/文/衡/枢/法/研）。
 * 字体异步：document.fonts.ready 后重绘一次；prefers-reduced-motion 直接成图。 */
function drawCalliChar(
  ctx: CanvasRenderingContext2D,
  ch: string,
  x: number,
  y: number,
  size: number
) {
  ctx.save()
  ctx.translate(x + size / 2, y + size / 2)
  ctx.rotate(-0.018)
  ctx.translate(-size / 2, -size / 2)
  const F = `${size}px "MaShanZheng","Ma Shan Zheng","Kaiti SC","STKaiti",serif`
  ctx.font = F
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  const cx = size / 2,
    cy = size / 2 + size * 0.03
  /* ══ 淡字题眼（2026-10-27 Human 六裁：只要一个淡淡的巨字，特效以后再加）════
     马善正楷书子集两层炸毫铺身，低透明度成纸下水印；无涨墨、无撕裂、无游丝、无飞溅。 */
  ctx.save()
  ;(ctx as CanvasRenderingContext2D & { filter: string }).filter = 'url(#inkRough)'
  ctx.fillStyle = inkA('graphite', 0.12)
  ctx.fillText(ch, cx, cy)
  ctx.restore()
  ctx.save()
  ;(ctx as CanvasRenderingContext2D & { filter: string }).filter = 'url(#inkRough2)'
  ctx.fillStyle = inkA('rich', 0.065)
  ctx.fillText(ch, cx, cy)
  ctx.fillStyle = inkA('concentrated', 0.045)
  ctx.fillText(ch, cx, cy)
  ctx.restore()
  ctx.restore()
}
export function EdgeStroke({ ch }: { ch: string }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const [on, setOn] = useState(reducedMotion())
  useEffect(() => {
    const cv = ref.current
    if (!cv) return
    const draw = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      const H = window.innerHeight
      const size = H * (window.innerWidth <= 720 ? 0.42 : 0.58)
      /* 2026-10-27 Human 三裁：可见窗 = 字宽的 [2%, 75%]——完整的「又」＋
         「见」的前半；右侧 25% 字宽出血入缘沟。BLEED 与 W 显式化，
         不再耦合在 cx 的 0.34 系数里 */
      const BLEED = size * 0.25
      const W = Math.round(size * 0.73)
      cv.width = W * dpr
      cv.height = H * dpr
      cv.style.width = W + 'px'
      /* 显式像素高，不靠 100vh：避免 iOS Safari/微信 vh 与 innerHeight
         口径不一致时位图被拉伸 */
      cv.style.height = H + 'px'
      const c = cv.getContext('2d')
      if (!c) return
      c.setTransform(dpr, 0, 0, dpr, 0, 0)
      c.clearRect(0, 0, W, H)
      /* cx 是字方左边线（drawCalliChar 以 x,y 为左上锚点）：左缘约 2% 在
         画布外，右缘出血 BLEED 入缘沟——可见窗恰为字宽的 [2%, 75%] */
      const cx = W + BLEED - size,
        cy = (H - size) / 2
      /* 2026-10-27 Human 六裁：只留一个淡淡的巨字——无点景、无特效，以后再加 */
      drawCalliChar(c, ch, cx, cy, size)
    }
    draw()
    /* 字体异步到位后重绘一次（避免首帧回退字体定形） */
    let alive = true
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        if (alive) {
          draw()
          setOn(true)
        }
      })
    } else {
      setOn(true)
    }
    if (reducedMotion()) setOn(true)
    /* iOS 微信橡皮筋拖动会高频触发 resize 且 innerHeight 随抖动变化——
       去抖 220ms：拖动中不重绘；宽度未变且高度小幅波动视为抖动忽略，
       回弹后尺寸自然归位。方向旋转/大变窗才真重绘。 */
    let lastW = window.innerWidth,
      lastH = window.innerHeight,
      rT: number | undefined
    const onR = () => {
      window.clearTimeout(rT)
      rT = window.setTimeout(() => {
        const w = window.innerWidth,
          h = window.innerHeight
        if (w === lastW && Math.abs(h - lastH) < 90) return
        lastW = w
        lastH = h
        draw()
      }, 220)
    }
    window.addEventListener('resize', onR)
    return () => {
      alive = false
      window.clearTimeout(rT)
      window.removeEventListener('resize', onR)
    }
  }, [ch])
  return (
    <>
      {/* 湍流置换滤波器（canvas ctx.filter 引用） */}
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
        <defs>
          <filter id="inkRough" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="3" seed="7" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="16" />
          </filter>
          <filter id="inkRough2" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.09" numOctaves="2" seed="21" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="9" />
          </filter>
        </defs>
      </svg>
      <canvas
        ref={ref}
        aria-hidden="true"
        className={`pointer-events-none fixed right-0 top-0 z-[-1] h-screen transition-opacity duration-[1400ms] ${on ? 'opacity-100' : 'opacity-0'}`}
      />
    </>
  )
}

/* ══ <InkTitle> · 落墨成字：字被墨「浸」出来（入视口一次）══════════════ */
export function InkTitle({ text, className = '' }: { text: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [on, setOn] = useState(reducedMotion())
  useEffect(() => {
    const el = ref.current
    if (!el || reducedMotion()) {
      setOn(true)
      return
    }
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (!e.isIntersecting) return
          io.disconnect()
          setOn(true)
        }),
      { threshold: 0.5 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <span ref={ref} className={`ink-title-reveal ${on ? 'on' : ''} ${className}`} aria-label={text}>
      {[...text].map((c, i) => (
        <span key={i} aria-hidden="true" style={{ transitionDelay: `${i * 90}ms` }}>
          {c}
        </span>
      ))}
    </span>
  )
}

/* ══ <Anno> · 朱笔圈点：入视口朱圈一次，悬停浮淡墨批注 ═══════════════ */
export function Anno({ children, note }: { children: React.ReactNode; note?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [ring, setRing] = useState<{ w: number; h: number } | null>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const measure = () => setRing({ w: el.offsetWidth, h: el.offsetHeight })
    measure()
    if (!reducedMotion()) {
      const io = new IntersectionObserver(
        (es) =>
          es.forEach((e) => {
            if (!e.isIntersecting) return
            io.disconnect()
            el.classList.add('circled')
          }),
        { threshold: 0.8 }
      )
      io.observe(el)
      return () => io.disconnect()
    } else {
      el.classList.add('circled')
    }
  }, [])
  return (
    <span ref={ref} className="anno-kp relative inline-block">
      {children}
      {ring && (
        <svg
          aria-hidden="true"
          className="anno-ring pointer-events-none absolute left-1/2 top-1/2"
          width={ring.w + 18}
          height={ring.h + 14}
          style={{ transform: 'translate(-50%,-50%) rotate(-1.4deg)' }}
        >
          <defs>
            <filter id="annoRough" x="-10%" y="-10%" width="120%" height="120%">
              <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="2" result="n" seed="7" />
              <feDisplacementMap in="SourceGraphic" in2="n" scale="2.2" />
            </filter>
          </defs>
          <ellipse
            cx={(ring.w + 18) / 2}
            cy={(ring.h + 14) / 2}
            rx={(ring.w + 10) / 2}
            ry={(ring.h + 6) / 2}
            fill="none"
            stroke="rgba(192,57,43,.8)"
            strokeWidth="1.6"
            filter="url(#annoRough)"
          />
        </svg>
      )}
      {note && <span className="anno-note">{note}</span>}
    </span>
  )
}
