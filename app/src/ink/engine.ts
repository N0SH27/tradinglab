/* ─────────────────────────────────────────────
 * 墨入水 · Ink Transition Engine
 *
 * 正向（drop）：DOT → SPREAD → TRANSFORMATION → 墨退
 * 墨滴自点击处落水，多层不规则墨晕扩散，
 * 浓淡不一、中心深边缘浅；至满屏时换页，
 * 随后墨退，新页自墨中生出。
 *
 * 反向（recede / reveal）：返回 = 收束。
 * 可视之窗向原点收拢 → 满墨换页 → 自原点重新展开，
 * 上一页自墨下浮现。与正向构成镜像：
 *   进入，是展开；返回，是收束。
 * reveal 仅后半段（满墨 → 开窗），供浏览器原生后退使用。
 *
 * 全部原生 Canvas 实现：无依赖、无 GIF、无视频。
 * 鼠标静止与动画结束后零计算；prefers-reduced-motion 时退化为淡入淡出。
 * ───────────────────────────────────────────── */

export type InkTone = 'ink' | 'water' | 'gray' | 'cinnabar' | 'invert'

const TONES: Record<InkTone, [number, number, number]> = {
  ink: [10, 10, 10],
  water: [22, 36, 45],
  gray: [84, 84, 82],
  cinnabar: [158, 47, 35],
  invert: [250, 250, 249],
}

/* 一维 value noise，供墨缘不规则起伏 */
function makeNoise(seed: number) {
  const p = new Float32Array(256)
  let s = seed >>> 0 || 1
  for (let i = 0; i < 256; i++) {
    s = (s * 1664525 + 1013904223) >>> 0
    p[i] = s / 4294967295
  }
  return (t: number) => {
    t = ((t % 1) + 1) % 1
    const x = t * 256
    const i = Math.floor(x) & 255
    const f = x - Math.floor(x)
    const u = f * f * (3 - 2 * f)
    return p[i] * (1 - u) + p[(i + 1) & 255] * u
  }
}

interface Blob {
  rMax: number // 最终半径（相对覆盖半径的比例）
  grow: number // 生长速率
  phase: number // 出现延迟 0..1
  alpha: number
  irr: number // 不规则度
  freq: number
  dx: number
  dy: number
  noise: (t: number) => number
}

type InkMode = 'drop' | 'recede' | 'reveal'

interface InkRun {
  mode: InkMode
  duration: number
  x: number
  y: number
  tone: InkTone
  start: number
  navAt: number // 覆盖比例到达此值时触发换页（ms）
  navDone: boolean
  onCover: (() => void) | null
  onDone: (() => void) | null
  blobs: Blob[]
  holdUntil: number
}

const DURATION = 1500 // 墨入到墨退完成
const NAV_DELAY = 620 // 墨覆盖后换页时机
const RECEDE_DURATION = 1400 // 收束 → 逆向展开
const RECEDE_NAV = 580 // 可视之窗闭合后换页时机
const REVEAL_DURATION = 950 // 仅开窗（浏览器后退）

export class InkEngine {
  private cv: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private raf = 0
  private run: InkRun | null = null
  private dpr = 1
  private running = false

  constructor(canvas: HTMLCanvasElement) {
    this.cv = canvas
    this.ctx = canvas.getContext('2d')!
    this.resize()
    window.addEventListener('resize', this.resize)
  }

  private resize = () => {
    this.dpr = Math.min(window.devicePixelRatio || 1, 2)
    this.cv.width = window.innerWidth * this.dpr
    this.cv.height = window.innerHeight * this.dpr
    this.cv.style.width = window.innerWidth + 'px'
    this.cv.style.height = window.innerHeight + 'px'
  }

  get busy() {
    return this.run !== null
  }

  /** 在 (x,y) 落一滴墨；onCover 在墨色满屏时调用（换页），动画结束后 Promise 解决 */
  drop(x: number, y: number, tone: InkTone, onCover: (() => void) | null): Promise<void> {
    if (this.run) return Promise.resolve()
    const cover = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    )
    const seedBase = (Math.random() * 1e9) >>> 0
    const blobs: Blob[] = [
      // 主墨：中心深
      { rMax: 1.08, grow: 1.0, phase: 0.0, alpha: 0.97, irr: 0.045, freq: 5, dx: 0, dy: 0, noise: makeNoise(seedBase) },
      // 二层墨晕：略慢、稍淡、更不规则
      { rMax: 0.92, grow: 0.82, phase: 0.10, alpha: 0.5, irr: 0.11, freq: 9, dx: cover * 0.03, dy: -cover * 0.02, noise: makeNoise(seedBase + 7) },
      // 外层水渍：最慢最淡，边缘参差
      { rMax: 0.78, grow: 0.66, phase: 0.2, alpha: 0.22, irr: 0.17, freq: 13, dx: -cover * 0.04, dy: cover * 0.03, noise: makeNoise(seedBase + 13) },
    ]
    blobs.forEach((b) => {
      b.rMax *= cover
      b.dx += x
      b.dy += y
    })

    return new Promise((resolve) => {
      this.run = {
        mode: 'drop',
        duration: DURATION,
        x, y, tone,
        start: performance.now(),
        navAt: NAV_DELAY,
        navDone: false,
        onCover,
        onDone: resolve,
        blobs,
        holdUntil: 0,
      }
      if (!this.running) {
        this.running = true
        this.raf = requestAnimationFrame(this.frame)
      }
    })
  }

  /* 收束之窗：两层不规则孔洞——外层孔更大、更淡，形成水墨边缘 */
  private makeWindowBlobs(x: number, y: number, cover: number, seed: number): Blob[] {
    return [
      { rMax: cover * 1.14, grow: 1, phase: 0, alpha: 0.38, irr: 0.10, freq: 9, dx: x, dy: y, noise: makeNoise(seed) },
      { rMax: cover * 1.04, grow: 1, phase: 0, alpha: 0.97, irr: 0.05, freq: 5, dx: x, dy: y, noise: makeNoise(seed + 7) },
    ]
  }

  private coverRadius(x: number, y: number) {
    return Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    )
  }

  /** 返回（收束）：可视之窗自全屏向 (x,y) 收拢 → 满墨时换页 → 自原点重新展开 */
  recede(x: number, y: number, tone: InkTone, onCover: (() => void) | null): Promise<void> {
    if (this.run) return Promise.resolve()
    const blobs = this.makeWindowBlobs(x, y, this.coverRadius(x, y), (Math.random() * 1e9) >>> 0)
    return new Promise((resolve) => {
      this.run = {
        mode: 'recede',
        duration: RECEDE_DURATION,
        x, y, tone,
        start: performance.now(),
        navAt: RECEDE_NAV,
        navDone: false,
        onCover,
        onDone: resolve,
        blobs,
        holdUntil: 0,
      }
      if (!this.running) {
        this.running = true
        this.raf = requestAnimationFrame(this.frame)
      }
    })
  }

  /** 浏览器原生前进/后退：页面已被切换，同步满墨遮盖后收束开窗，统一过渡 */
  revealBack(x: number, y: number, tone: InkTone): Promise<void> {
    if (this.run) return Promise.resolve()
    const blobs = this.makeWindowBlobs(x, y, this.coverRadius(x, y), (Math.random() * 1e9) >>> 0)
    return new Promise((resolve) => {
      this.run = {
        mode: 'reveal',
        duration: REVEAL_DURATION,
        x, y, tone,
        start: performance.now(),
        navAt: Infinity,
        navDone: true,
        onCover: null,
        onDone: resolve,
        blobs,
        holdUntil: 0,
      }
      this.running = true
      cancelAnimationFrame(this.raf)
      this.frame(performance.now()) // 同步画第一帧：满墨，遮住浏览器已切换的页面
    })
  }

  private finishRun(run: InkRun) {
    this.run = null
    this.ctx.clearRect(0, 0, this.cv.width, this.cv.height)
    this.running = false
    run.onDone?.()
  }

  private easeOutCubic(t: number) {
    return 1 - Math.pow(1 - t, 3)
  }

  private easeInOutCubic(t: number) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
  }

  private drawBlob(b: Blob, r: number, alpha: number, rgb: [number, number, number]) {
    const ctx = this.ctx
    ctx.beginPath()
    const steps = 72
    for (let i = 0; i <= steps; i++) {
      const a = (i / steps) * Math.PI * 2
      const n = b.noise(i / steps) - 0.5
      const rr = r * (1 + n * b.irr * 2)
      const px = b.dx * this.dpr + Math.cos(a) * rr * this.dpr
      const py = b.dy * this.dpr + Math.sin(a) * rr * this.dpr
      if (i === 0) ctx.moveTo(px, py)
      else ctx.lineTo(px, py)
    }
    ctx.closePath()
    ctx.fillStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${alpha})`
    ctx.fill()
  }

  /* 收束之窗：满屏墨色中留一个不规则的窗（evenodd 挖出孔洞），
     窗外是墨，窗内是正在退场的页面 */
  private drawWindow(b: Blob, r: number, alpha: number, rgb: [number, number, number]) {
    const ctx = this.ctx
    ctx.beginPath()
    ctx.rect(0, 0, this.cv.width, this.cv.height)
    const steps = 72
    for (let i = 0; i <= steps; i++) {
      const a = (i / steps) * Math.PI * 2
      const n = b.noise(i / steps) - 0.5
      const rr = Math.max(0, r * (1 + n * b.irr * 2)) * this.dpr
      const px = b.dx * this.dpr + Math.cos(a) * rr
      const py = b.dy * this.dpr + Math.sin(a) * rr
      if (i === 0) ctx.moveTo(px, py)
      else ctx.lineTo(px, py)
    }
    ctx.closePath()
    ctx.fillStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${alpha})`
    ctx.fill('evenodd')
  }

  /* 开窗段：窗自原点展开，上一页自墨下浮现（recede 后半 / reveal 主体共用） */
  private drawOpening(run: InkRun, k: number, rgb: [number, number, number]) {
    if (k >= 1) {
      this.finishRun(run)
      return
    }
    const e = this.easeOutCubic(k)
    const fade = 1 - e * 0.94
    for (const b of run.blobs) {
      this.drawWindow(b, b.rMax * e, b.alpha * fade, rgb)
    }
  }

  private frame = (now: number) => {
    const run = this.run
    if (!run) {
      this.running = false
      return
    }
    const t = (now - run.start) / run.duration
    const rgb = TONES[run.tone]
    const ctx = this.ctx
    ctx.clearRect(0, 0, this.cv.width, this.cv.height)

    // 换页时机
    if (!run.navDone && now - run.start >= run.navAt) {
      run.navDone = true
      run.onCover?.()
    }

    if (run.mode === 'recede') {
      if (t < 0.4) {
        // ── 收束：窗向原点收拢，墨色自四缘淡入、渐浓
        const k = t / 0.4
        const e = this.easeInOutCubic(k)
        const alphaIn = Math.min(1, k * 2.4)
        for (const b of run.blobs) {
          this.drawWindow(b, b.rMax * (1 - e), b.alpha * alphaIn, rgb)
        }
      } else if (t < 0.5) {
        // ── 满墨停留（状态逆转的一瞬）
        ctx.fillStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},1)`
        ctx.fillRect(0, 0, this.cv.width, this.cv.height)
      } else {
        // ── 逆向展开：窗自原点缓缓打开，上一页浮现（水面归平的节奏）
        this.drawOpening(run, (t - 0.5) / 0.5, rgb)
        if (!this.run) return
      }
    } else if (run.mode === 'reveal') {
      if (t < 0.12) {
        ctx.fillStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},1)`
        ctx.fillRect(0, 0, this.cv.width, this.cv.height)
      } else {
        this.drawOpening(run, (t - 0.12) / 0.88, rgb)
        if (!this.run) return
      }
    } else if (t < 0.5) {
      // ── 阶段一/二：DOT → SPREAD（墨入，快反馈、慢展开）
      const g = this.easeOutCubic(Math.min(t / 0.5, 1))
      for (const b of run.blobs) {
        const local = Math.max(0, Math.min((g - b.phase) / (1 - b.phase), 1))
        if (local <= 0) continue
        const r = b.rMax * this.easeOutCubic(local)
        this.drawBlob(b, r, b.alpha * local, rgb)
      }
    } else if (t < 0.62) {
      // ── 阶段三：TRANSFORMATION——满屏墨色，短暂停留（黑白关系反转的一瞬）
      ctx.fillStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},1)`
      ctx.fillRect(0, 0, this.cv.width, this.cv.height)
    } else {
      // ── 墨退：墨沿原路收回点击处，新页自墨中生出（慢退出）
      const k = (t - 0.62) / 0.38
      if (k >= 1) {
        this.finishRun(run)
        return
      }
      const fade = 1 - this.easeOutCubic(k)
      for (const b of run.blobs) {
        const r = b.rMax * (1 - k * 0.94)
        this.drawBlob(b, r, b.alpha * fade, rgb)
      }
    }

    this.raf = requestAnimationFrame(this.frame)
  }

  destroy() {
    cancelAnimationFrame(this.raf)
    window.removeEventListener('resize', this.resize)
  }
}
