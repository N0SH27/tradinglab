/* PHASE 9 · Acceptance Audit 驱动脚本（一次性验收工具，不进 src/，不改产品代码）
 * 真实 Chrome（headless=new）+ CDP：桌面走查 / 交互 / 键盘 Tab / reduced-motion / 移动端 / 跨页。
 * 自包含：启动 vite preview（构建产物）+ Chrome，结束全部清理，不留后台进程。
 * 运行：node scripts/phase9-acceptance.mjs   （cwd = tradinglab/app） */
import { spawn } from 'node:child_process'
import net from 'node:net'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

const APP_DIR = process.cwd()
const OUT_DIR = path.join(APP_DIR, 'phase9-audit')
fs.mkdirSync(OUT_DIR, { recursive: true })
const PREVIEW_PORT = 5199
const CDP_PORT = 9337
const BASE = `http://127.0.0.1:${PREVIEW_PORT}`

const results = []
const consoleErrors = []
function rec(area, test, ok, evidence, severity = ok ? '' : 'P1') {
  results.push({ area, test, result: ok ? 'PASS' : 'FAIL', evidence: String(evidence).slice(0, 300), severity: ok ? '' : severity })
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

/* ── 最小 WebSocket 客户端（CDP 用，client→server 必须 mask） ─────────── */
class WS {
  constructor(url) {
    const m = url.match(/^ws:\/\/([^:/]+):(\d+)(\/.*)$/)
    this.host = m[1]; this.port = +m[2]; this.path = m[3]
    this.buf = Buffer.alloc(0)
    this.frags = []
    this.onmessage = null
  }
  connect() {
    return new Promise((resolve, reject) => {
      const key = crypto.randomBytes(16).toString('base64')
      this.sock = net.connect(this.port, this.host, () => {
        this.sock.write(
          `GET ${this.path} HTTP/1.1\r\nHost: ${this.host}:${this.port}\r\n` +
          `Upgrade: websocket\r\nConnection: Upgrade\r\n` +
          `Sec-WebSocket-Key: ${key}\r\nSec-WebSocket-Version: 13\r\n\r\n`)
      })
      let hs = Buffer.alloc(0); let done = false
      this.sock.on('data', (d) => {
        if (!done) {
          hs = Buffer.concat([hs, d])
          const idx = hs.indexOf('\r\n\r\n')
          if (idx === -1) return
          if (!hs.slice(0, idx).toString().includes('101')) return reject(new Error('WS handshake failed'))
          done = true; resolve()
          const rest = hs.slice(idx + 4)
          if (rest.length) this.feed(rest)
        } else this.feed(d)
      })
      this.sock.on('error', reject)
    })
  }
  feed(d) {
    this.buf = Buffer.concat([this.buf, d])
    for (;;) {
      if (this.buf.length < 2) return
      const b0 = this.buf[0], b1 = this.buf[1]
      const fin = (b0 & 0x80) !== 0, op = b0 & 0x0f
      let len = b1 & 0x7f, off = 2
      if (len === 126) { if (this.buf.length < 4) return; len = this.buf.readUInt16BE(2); off = 4 }
      else if (len === 127) { if (this.buf.length < 10) return; len = Number(this.buf.readBigUInt64BE(2)); off = 10 }
      if (this.buf.length < off + len) return
      const payload = this.buf.slice(off, off + len)
      this.buf = this.buf.slice(off + len)
      if (op === 9) { this.sendRaw(payload, 0xA); continue }        // ping → pong
      if (op === 8) continue                                        // close
      if (op === 1 || op === 0) {
        this.frags.push(payload)
        if (fin) {
          const msg = Buffer.concat(this.frags).toString('utf8')
          this.frags = []
          if (this.onmessage) this.onmessage(msg)
        }
      }
    }
  }
  sendRaw(payload, op = 1) {
    const mask = crypto.randomBytes(4)
    const len = payload.length
    let head
    if (len < 126) { head = Buffer.from([0x80 | op, 0x80 | len]) }
    else if (len < 65536) { head = Buffer.alloc(4); head[0] = 0x80 | op; head[1] = 0x80 | 126; head.writeUInt16BE(len, 2) }
    else { head = Buffer.alloc(10); head[0] = 0x80 | op; head[1] = 0x80 | 127; head.writeBigUInt64BE(BigInt(len), 2) }
    const masked = Buffer.from(payload)
    for (let i = 0; i < masked.length; i++) masked[i] ^= mask[i & 3]
    this.sock.write(Buffer.concat([head, mask, masked]))
  }
  sendText(s) { this.sendRaw(Buffer.from(s, 'utf8'), 1) }
}

/* ── CDP 会话 ─────────────────────────────────────────────────────────── */
let msgId = 0
const pending = new Map()
const eventHandlers = []
let ws
function cmd(method, params = {}, timeout = 25000) {
  const id = ++msgId
  ws.sendText(JSON.stringify({ id, method, params }))
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => { pending.delete(id); reject(new Error(`CDP timeout: ${method}`)) }, timeout)
    pending.set(id, { resolve: (v) => { clearTimeout(t); resolve(v) }, reject: (e) => { clearTimeout(t); reject(e) } })
  })
}
async function ev(expression, timeout) {
  const r = await cmd('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true }, timeout)
  if (r.exceptionDetails) {
    const ex = r.exceptionDetails.exception
    throw new Error('evaluate failed: ' + (ex?.description || JSON.stringify(r.exceptionDetails)).slice(0, 300) + '  ::EXPR:: ' + expression.slice(0, 120))
  }
  return r.result?.value
}
async function nav(url, settle = 700) {
  await cmd('Page.navigate', { url })
  for (let i = 0; i < 60; i++) {
    await sleep(250)
    try { if ((await ev('document.readyState')) === 'complete') break } catch {}
  }
  await sleep(settle)
}
async function shot(name, fullPage = false) {
  let params = { format: 'png' }
  if (fullPage) {
    const m = await cmd('Page.getLayoutMetrics')
    const cs = m.cssContentSize || m.contentSize
    const h = Math.min(Math.ceil(cs.height), 12000)
    params.captureBeyondViewport = true
    params.clip = { x: 0, y: 0, width: Math.ceil(cs.width), height: h, scale: 1 }
  }
  const r = await cmd('Page.captureScreenshot', params, 60000)
  const p = path.join(OUT_DIR, name)
  fs.writeFileSync(p, Buffer.from(r.data, 'base64'))
  return p
}
async function key(keyName, code, keyCode) {
  await cmd('Input.dispatchKeyEvent', { type: 'keyDown', key: keyName, code, windowsVirtualKeyCode: keyCode, nativeVirtualKeyCode: keyCode })
  await cmd('Input.dispatchKeyEvent', { type: 'keyUp', key: keyName, code, windowsVirtualKeyCode: keyCode, nativeVirtualKeyCode: keyCode })
}
const tab = () => key('Tab', 'Tab', 9)
const enter = async () => {
  await cmd('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Enter', code: 'Enter', text: '\r', windowsVirtualKeyCode: 13, nativeVirtualKeyCode: 36 })
  await cmd('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13, nativeVirtualKeyCode: 36 })
}
const space = () => key(' ', 'Space', 32)
/* 滚动到元素中心（instant，绕开 html smooth-scroll），等待后重读取坐标 */
async function centerOf(selectorExpr) {
  await ev(`(() => { const el = ${selectorExpr}; el.scrollIntoView({ behavior: 'instant', block: 'center' }); return true })()`)
  await sleep(450)
  return ev(`(() => { const el = ${selectorExpr}; const r = el.getBoundingClientRect(); return { x: Math.round(r.left + r.width / 2), y: Math.round(r.top + r.height / 2) } })()`)
}
/* 滚动通页（触发 IO reveal），回到顶部 */
async function scrollThrough() {
  await ev(`(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += 600) { window.scrollTo({ top: y, behavior: 'instant' }); await new Promise(r => setTimeout(r, 90)) } window.scrollTo({ top: 0, behavior: 'instant' }); return true })()`)
  await sleep(600)
}
async function clickAt(x, y) {
  await cmd('Input.dispatchMouseEvent', { type: 'mousePressed', x, y, button: 'left', clickCount: 1 })
  await cmd('Input.dispatchMouseEvent', { type: 'mouseReleased', x, y, button: 'left', clickCount: 1 })
}

/* ── 子进程管理 ───────────────────────────────────────────────────────── */
let preview, chrome
async function waitHttp(url, tries = 60) {
  for (let i = 0; i < tries; i++) {
    try { const r = await fetch(url); if (r.ok || r.status === 404) return true } catch {}
    await sleep(250)
  }
  throw new Error('timeout waiting ' + url)
}
function cleanup() {
  for (const p of [chrome, preview]) {
    try { if (p?.pid) process.kill(-p.pid, 'SIGKILL') } catch {}
    try { p?.kill('SIGKILL') } catch {}
  }
  try { fs.rmSync('/tmp/phase9-chrome-profile', { recursive: true, force: true }) } catch {}
}

/* ═══════════════════ 主流程 ═══════════════════ */
async function main() {
  preview = spawn('npx', ['vite', 'preview', '--port', String(PREVIEW_PORT), '--strictPort', '--host', '127.0.0.1'], { cwd: APP_DIR, stdio: 'ignore', detached: true })
  await waitHttp(`${BASE}/`)
  fs.rmSync('/tmp/phase9-chrome-profile', { recursive: true, force: true })
  chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
    '--headless=new', '--disable-gpu', '--no-first-run', '--hide-scrollbars',
    `--remote-debugging-port=${CDP_PORT}`, '--user-data-dir=/tmp/phase9-chrome-profile', 'about:blank',
  ], { stdio: 'ignore', detached: true })
  await waitHttp(`http://127.0.0.1:${CDP_PORT}/json/version`)
  const target = await (await fetch(`http://127.0.0.1:${CDP_PORT}/json/new?about:blank`, { method: 'PUT' })).json()
  ws = new WS(target.webSocketDebuggerUrl)
  await ws.connect()
  ws.onmessage = (s) => {
    const m = JSON.parse(s)
    if (m.id && pending.has(m.id)) {
      const p = pending.get(m.id); pending.delete(m.id)
      m.error ? p.reject(new Error(m.error.message)) : p.resolve(m.result)
    } else if (m.method) {
      if (m.method === 'Runtime.exceptionThrown') consoleErrors.push('EXCEPTION: ' + JSON.stringify(m.params.exceptionDetails?.exception?.description || m.params.exceptionDetails?.text).slice(0, 200))
      if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') consoleErrors.push('CONSOLE.ERROR: ' + m.params.args.map((a) => a.value ?? a.description ?? '').join(' ').slice(0, 200))
      for (const h of eventHandlers) h(m)
    }
  }
  await cmd('Page.enable'); await cmd('Runtime.enable')

  /* ────────── A · DESKTOP 1440×900 ────────── */
  await cmd('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false })
  await nav(`${BASE}/`)

  // A-1 首页加载 + 无场景标签
  const homeText = await ev('document.body.innerText')
  rec('Home', '首页加载（ENTRY 宣言可读）', homeText.includes('观察变化') && homeText.includes('而非预测未来'), '宣言文案在首屏')
  const sceneLeak = ['SCENE', 'Scene 0', 'ENTRY ·', 'NOW ·', 'SEE ·', 'THINK ·', 'CHANGE ·', 'WUWEI ·', '幕'].filter((s) => homeText.includes(s))
  rec('Home', 'Scene ≠ Section（无场景标题/分幕标签）', sceneLeak.length === 0, sceneLeak.length ? '泄漏: ' + sceneLeak.join(',') : '渲染层零场景标签')

  // A-2 Flip：NOW 第一卡 点正面→背面→翻回
  const flipCount = await ev(`[...document.querySelectorAll('button[aria-label*="翻面"]')].length`)
  rec('Flip', 'Flip 卡数量（NOW×3 + Featured×1）', flipCount === 4, `实际 ${flipCount}`)
  await ev(`[...document.querySelectorAll('button[aria-label*="翻面"]')][0].click()`)
  await sleep(350)
  let backVisible = await ev(`(() => { const f=[...document.querySelectorAll('button[aria-label*="翻面"]')][0].closest('div.relative'); return getComputedStyle(f.children[1]).visibility === 'visible' && getComputedStyle(f.children[1]).opacity === '1' })()`)
  rec('Flip', '点击正面 → 背面可见', backVisible === true, 'crossfade 后背面 visibility/opacity=1')
  await ev(`[...document.querySelectorAll('button')].find(b => b.textContent.includes('翻回'))?.click()`)
  await sleep(350)
  const frontBack = await ev(`(() => { const f=[...document.querySelectorAll('button[aria-label*="翻面"]')][0]; return getComputedStyle(f).visibility === 'visible' && getComputedStyle(f).opacity === '1' })()`)
  rec('Flip', '翻回 → 正面恢复', frontBack === true, '正面 visibility/opacity=1')

  // A-3 Polarity Filter 三态互斥 + 再点取消 + Map 退淡
  await ev(`[...document.querySelectorAll('[role="group"][aria-label="Polarity view filter"] button')].find(b => b.textContent.includes('阴'))?.click()`)
  await sleep(500)
  const yinOn = await ev(`[...document.querySelectorAll('[role="group"][aria-label="Polarity view filter"] button')].find(b => b.textContent.includes('阴'))?.getAttribute('aria-pressed')`)
  const dimmed = await ev(`[...document.querySelectorAll('button[aria-label*="查看名称与状态"]')].filter(b => b.className.includes('opacity-20')).length`)
  const total7 = await ev(`[...document.querySelectorAll('button[aria-label*="查看名称与状态"]')].length`)
  rec('Polarity', 'Filter 点击「阴」激活（aria-pressed）', yinOn === 'true', `aria-pressed=${yinOn}`)
  rec('Polarity', 'Lens 生效：非阴节点退淡', dimmed > 0 && total7 === 7, `7 节点中 ${dimmed} 个退淡`)
  await ev(`[...document.querySelectorAll('[role="group"][aria-label="Polarity view filter"] button')].find(b => b.textContent.includes('阴'))?.click()`)
  await sleep(500)
  const dimmed2 = await ev(`[...document.querySelectorAll('button[aria-label*="查看名称与状态"]')].filter(b => b.className.includes('opacity-20')).length`)
  rec('Polarity', '再点取消：恢复完整切片', dimmed2 === 0, `退淡节点=${dimmed2}`)

  // A-4 MapPreview：7 节点 6 真边 + Node Detail 严格三项
  const edgeCount = await ev(`document.querySelectorAll('svg line').length`)
  rec('Map', 'MapPreview 7 节点 / 6 真边', total7 === 7 && edgeCount === 6, `节点=${total7} 边=${edgeCount}`)
  await ev(`[...document.querySelectorAll('button[aria-label*="查看名称与状态"]')][0].click()`)
  await sleep(350)
  const detail = await ev(`(() => { const d=[...document.querySelectorAll('div')].find(x => x.querySelector('a[href="#/map"]')); return d ? d.innerText : '' })()`)
  const detailOk = detail.includes('EXPLORE WORLD') && !detail.includes('Related') && !detail.includes('相关')
  rec('Map', 'Node Detail = Name + State + EXPLORE WORLD（DELTA-01）', detailOk, detail.replace(/\n/g, ' / '))

  // A-5 Featured 双锚点链接
  const ctaHrefs = await ev(`[...document.querySelectorAll('a')].filter(a => a.href.includes('@')).map(a => a.getAttribute('href'))`)
  rec('Research', 'Featured CTA = @five-min / @deep-dive', ctaHrefs.includes('#/research/report-1@five-min') && ctaHrefs.includes('#/research/report-1@deep-dive'), ctaHrefs.join(' , '))

  // A-6 CHANGE 65→68 来自 Ledger
  const changeTxt = await ev(`(() => { const e=[...document.querySelectorAll('span')].find(s => s.textContent.trim() === 'WHAT CHANGED'); return e ? e.closest('div.border').innerText : '' })()`)
  rec('Belief', 'CHANGE 对比卡 65 → 68（Ledger 只读）', /65\s*→\s*68/.test(changeTxt), changeTxt.replace(/\n/g, ' / ').slice(0, 120))

  // A-7 Current Belief：判断先于数字（DOM 顺序）
  const beliefOrder = await ev(`(() => { const sec=[...document.querySelectorAll('span')].find(s => s.textContent.trim() === 'WHAT I BELIEVE NOW')?.parentElement; if (!sec) return ''; const kids=[...sec.children].map(c => c.tagName + ':' + c.textContent.slice(0,18)); return kids.join('|') })()`)
  const judgeFirst = beliefOrder.indexOf('国产算力正在从') > -1 && beliefOrder.indexOf('CONVICTION') > beliefOrder.indexOf('国产算力正在从')
  rec('Belief', 'Judgment > 数字（判断在前，CONVICTION 为辅助小字）', judgeFirst, beliefOrder.slice(0, 160))

  // A-8 WUWEI 静默：无 CTA
  const wuweiCta = await ev(`(() => { const p=[...document.querySelectorAll('p')].find(x => x.textContent.includes('正确的仓位是空仓')); const sec=p?.closest('section'); return sec ? sec.querySelectorAll('a,button').length : -1 })()`)
  rec('Home', 'WUWEI 静默尾章：零 CTA / 零营销', wuweiCta === 0, `交互元素=${wuweiCta}`)

  await scrollThrough()
  await shot('desktop-home-full.png', true)

  // A-9 真实鼠标点击 Flip（非 evaluate click）
  const fpos = await centerOf(`[...document.querySelectorAll('button[aria-label*="翻面"]')][1]`)
  await clickAt(fpos.x, fpos.y)
  await sleep(350)
  const flip2 = await ev(`(() => { const f=[...document.querySelectorAll('button[aria-label*="翻面"]')][1].closest('div.relative'); return getComputedStyle(f.children[1]).opacity === '1' })()`)
  rec('Flip', '真实鼠标事件点击第二卡翻面', flip2 === true, `(${fpos.x},${fpos.y})`)
  await shot('desktop-now-flipped.png')

  /* ────────── B · RESEARCH ×4 ────────── */
  const REPORTS = [
    { n: 1, kf: 4, titles: ['政策意志和产业能力的距离，用什么量？', '同一条链上，谁在景气、谁被透支？', '这改变了我的判断吗？——没有，但它垫厚了地基'], date: '2026.08', ver: 'v1.1.1' },
    { n: 2, kf: 4, titles: ['失效从哪里开始？', '现在走到周期的哪一站？', '命题跟得上它自己的证据吗？'], date: '2026.08', ver: 'v1.1.1' },
    { n: 3, kf: 3, titles: ['约束多硬，用什么量？', '要跟踪电力，需要哪七条数据流？', '这会成为下一个命题吗？——还不能'], date: '2026.08', ver: 'v1.1.1' },
    { n: 4, kf: 4, titles: ['收入在海外，基本盘靠什么？', '当初的推演，兑现了多少？', '这让我对创新药的判断变厚了吗？', '05b 2026 观察层'], date: '2026.09', ver: 'v0.2' },
  ]
  for (const R of REPORTS) {
    await nav(`${BASE}/#/research/report-${R.n}`)
    const txt = await ev('document.body.innerText')
    const grid = ['问题 — 这篇研究在问什么', '发现 — 目前看到什么', '意义 — 为什么值得在意', '触发 — 什么会让我重新研究'].every((s) => txt.replace(/\s+/g, ' ').includes(s.replace(/\s+/g, ' ')) || txt.includes(s.split(' — ')[0]))
    rec('Research', `R${R.n} · 30 SEC 四格（问题/发现/意义/触发）`, grid, '四格标签与副题')
    const fiveMin = await ev(`(() => { const s=document.getElementById('five-min'); if (!s) return null; return { ps: s.querySelectorAll('p').length, hasDan: s.innerText.includes('但'), hasTrace: s.innerText.includes('溯源'), title: s.querySelector('h2')?.innerText || '' } })()`)
    rec('Research', `R${R.n} · 5 MIN 节存在且 KF 数=${R.kf}`, fiveMin && fiveMin.ps === R.kf, fiveMin ? `p=${fiveMin.ps} 标题=${fiveMin.title.replace(/\n/g,'')}` : 'five-min 缺失')
    rec('Research', `R${R.n} · 5 MIN 保留「但」转折 / 无审稿注记`, fiveMin && fiveMin.hasDan && !fiveMin.hasTrace, fiveMin ? `但=${fiveMin.hasDan} 溯源=${fiveMin.hasTrace}` : 'n/a')
    const missing = R.titles.filter((t) => !txt.includes(t))
    rec('Research', `R${R.n} · B-9 标题逐份核对`, missing.length === 0, missing.length ? '缺: ' + missing.join(',') : '全部命中')
    const topbar = await ev(`(() => { const s=[...document.querySelectorAll('span')].find(x => x.textContent.includes('最近修订')); return s ? s.textContent : '' })()`)
    rec('Research', `R${R.n} · 顶栏=最近修订+版本，无审核语`, topbar.includes('最近修订') && topbar.includes(R.ver) && !topbar.includes('PASS'), topbar)
    const firstScreen = await ev(`(() => { let out=''; document.querySelectorAll('body *').forEach(e => { const r=e.getBoundingClientRect(); if (r.top < 850 && (e.children ? e.children.length : 0) === 0) out += (e.textContent || '') + ' ' }); return out })()`)
    rec('Research', `R${R.n} · 首屏无 REPORT #n 主标识`, !firstScreen.includes('REPORT #'), '弱化方案：标题为唯一主标识')
    const dd = await ev(`!!document.getElementById('deep-dive')`)
    rec('Research', `R${R.n} · deep-dive 锚点存在`, dd === true, 'id=deep-dive')
  }
  await shot('desktop-report1-top.png')
  // 5 MIN 视口证据（滚动触发 reveal 后截取）
  await ev(`document.getElementById('five-min').scrollIntoView({ behavior: 'instant', block: 'start' })`)
  await sleep(600)
  await shot('desktop-report1-fivemin.png')

  /* ────────── B-2 · 锚点跳转落位 ────────── */
  await nav(`${BASE}/#/research/report-1@five-min`, 1500)
  const a1 = await ev(`(() => { const r = document.getElementById('five-min').getBoundingClientRect(); return { top: Math.round(r.top), scroll: Math.round(window.scrollY) } })()`)
  rec('Research', '@five-min 锚点落位', a1.scroll > 100 && a1.top > -400 && a1.top < 400, JSON.stringify(a1))
  await nav(`${BASE}/#/research/report-1@deep-dive`, 1500)
  const a2 = await ev(`(() => { const r = document.getElementById('deep-dive').getBoundingClientRect(); return { top: Math.round(r.top), scroll: Math.round(window.scrollY) } })()`)
  rec('Research', '@deep-dive 锚点落位', a2.scroll > 100 && a2.top > -400 && a2.top < 400, JSON.stringify(a2))

  /* ────────── C · KEYBOARD（真实 Tab 键走查） ────────── */
  await nav(`${BASE}/`, 900)
  const focusLog = []
  let trap = false, invisibleFocus = []
  let prevDesc = ''
  for (let i = 0; i < 46; i++) {
    await tab()
    await sleep(60)
    const f = await ev(`(() => { const ae=document.activeElement; if (!ae || ae===document.body) return {desc:'BODY',style:'',width:''}; const cs=getComputedStyle(ae); return { desc:(ae.tagName+':'+(ae.getAttribute('aria-label')||ae.textContent||'').trim().slice(0,30)), style:cs.outlineStyle, width:cs.outlineWidth } })()`)
    if (f.desc === 'BODY') { if (focusLog.length > 5) break; else continue }
    focusLog.push(f)
    if (f.desc === prevDesc && focusLog.length > 3) { const last3 = focusLog.slice(-3).map(x=>x.desc); if (last3.every(d=>d===last3[0])) { trap = true; break } }
    if (f.style === 'none' || f.width === '0px') invisibleFocus.push(f.desc)
    prevDesc = f.desc
  }
  const distinct = new Set(focusLog.map((f) => f.desc)).size
  rec('Keyboard', `Tab 走查：≥18 个不同停靠点（实际 ${distinct}）`, distinct >= 18, focusLog.slice(0, 24).map((f) => f.desc).join(' → '))
  rec('Keyboard', '无焦点陷阱', !trap, trap ? '同一元素连续 3 次' : '焦点链持续推进')
  rec('Keyboard', '所有停靠点 focus 可见', invisibleFocus.length === 0, invisibleFocus.length ? '不可见: ' + invisibleFocus.join(' | ') : '全部 outline 可见')

  // 键盘 Enter 翻面（Tab 到 Flip 卡后按 Enter）
  await nav(`${BASE}/`, 900)
  let flippedByKeyboard = false, focusAfterFlip = ''
  for (let i = 0; i < 30; i++) {
    await tab(); await sleep(60)
    const d = await ev(`(document.activeElement?.getAttribute('aria-label')||'')`)
    if (d.includes('翻面')) {
      await enter(); await sleep(400)
      flippedByKeyboard = await ev(`(() => { const f=[...document.querySelectorAll('button[aria-label*="翻面"]')].find(b => getComputedStyle(b).visibility === 'hidden'); return !!f })()`)
      focusAfterFlip = await ev(`(document.activeElement?.tagName || '') + ':' + (document.activeElement?.getAttribute('aria-label') || document.activeElement?.textContent || '').trim().slice(0,20)`)
      break
    }
  }
  rec('Keyboard', 'Enter 触发 Flip（键盘可达可操作）', flippedByKeyboard === true, `翻面后面焦点落在 ${focusAfterFlip || '未知'}`)

  /* ────────── D · REDUCED MOTION ────────── */
  await cmd('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] })
  await nav(`${BASE}/`, 900)
  const rm = await ev(`(() => {
    const rev = document.querySelector('[data-reveal]')
    const disc = document.querySelector('.polarity-disc')
    const html = getComputedStyle(document.documentElement).scrollBehavior
    return {
      revealOpacity: rev ? getComputedStyle(rev).opacity : 'n/a',
      revealTransition: rev ? getComputedStyle(rev).transitionProperty : 'n/a',
      discTransition: disc ? getComputedStyle(disc).transitionProperty : 'n/a',
      htmlScroll: html,
    }
  })()`)
  rec('Reduced Motion', '[data-reveal] 瞬时呈现（opacity=1, 无过渡）', rm.revealOpacity === '1' && rm.revealTransition === 'none', JSON.stringify(rm))
  rec('Reduced Motion', 'Polarity 圆盘零过渡 / html 滚动 auto', rm.discTransition === 'none' && rm.htmlScroll === 'auto', `disc=${rm.discTransition} scroll=${rm.htmlScroll}`)
  await ev(`[...document.querySelectorAll('button[aria-label*="翻面"]')][0].click()`)
  await sleep(120)
  const rmFlip = await ev(`(() => { const f=[...document.querySelectorAll('button[aria-label*="翻面"]')][0].closest('div.relative'); return getComputedStyle(f.children[1]).opacity === '1' && getComputedStyle(f.children[1]).transitionProperty === 'none' })()`)
  rec('Reduced Motion', 'reduced-motion 下 Flip 功能保留（瞬时切换）', rmFlip === true, '瞬时且功能完整')
  await shot('reduced-home.png')
  await cmd('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }] })

  /* ────────── E · MOBILE 390×844 ────────── */
  await cmd('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true })
  await nav(`${BASE}/`, 1000)
  const mob = await ev(`({ sw: document.documentElement.scrollWidth, iw: window.innerWidth, nodesOut: [...document.querySelectorAll('button[aria-label*="查看名称与状态"]')].filter(b => { const r=b.getBoundingClientRect(); return r.left < -2 || r.right > window.innerWidth + 2 }).length })`)
  rec('Mobile', '首页无横向溢出', mob.sw <= mob.iw + 1, `scrollWidth=${mob.sw} innerWidth=${mob.iw}`)
  rec('Mobile', 'MapPreview 节点全部在视口内（可触摸）', mob.nodesOut === 0, `越界节点=${mob.nodesOut}`)
  const mpos = await centerOf(`[...document.querySelectorAll('button[aria-label*="查看名称与状态"]')][0]`)
  const hitEl = await ev(`(() => { const e = document.elementFromPoint(${mpos.x}, ${mpos.y}); return e ? (e.tagName + ':' + (e.getAttribute('aria-label') || e.textContent || '').trim().slice(0, 30)) : 'null' })()`)
  await cmd('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: mpos.x, y: mpos.y, id: 1 }] })
  await sleep(90)
  await cmd('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
  await sleep(400)
  const pressed = await ev(`[...document.querySelectorAll('button[aria-label*="查看名称与状态"]')].map(b => b.getAttribute('aria-pressed')).join(',')`)
  const mtap = await ev(`(() => { const d=[...document.querySelectorAll('a[href="#/map"]')].filter(a => a.textContent.includes('EXPLORE WORLD')); return d.length > 0 && d[0].getBoundingClientRect().width > 0 })()`)
  rec('Mobile', '触摸（touch 事件）点开 Node Detail', mtap === true, `(${mpos.x},${mpos.y}) 命中=${hitEl} aria-pressed=[${pressed}]`)
  await scrollThrough()
  await shot('mobile-home-full.png', true)
  await nav(`${BASE}/#/research/report-1`, 900)
  const mobR = await ev(`({ sw: document.documentElement.scrollWidth, iw: window.innerWidth })`)
  rec('Mobile', '报告页无横向溢出', mobR.sw <= mobR.iw + 1, `scrollWidth=${mobR.sw}`)
  await shot('mobile-report1.png')
  await cmd('Emulation.clearDeviceMetricsOverride')

  /* ────────── F · CROSS-PAGE ────────── */
  const pages = [
    ['#/research', '研报', 'Research 索引'],
    ['#/map', '', 'Map 完整页'],
    ['#/thesis', '', 'Thesis 域'],
    ['#/journal', 'REVISION', 'Journal'],
  ]
  for (const [hash, marker, name] of pages) {
    const before = consoleErrors.length
    await nav(`${BASE}/${hash}`, 800)
    const t = await ev('document.body.innerText')
    const ok = t.length > 300 && (marker === '' || t.includes(marker)) && consoleErrors.length === before
    rec('Cross-page', `${name}（${hash}）可达且渲染`, ok, `文本量=${t.length}${marker ? ' 标识=' + t.includes(marker) : ''}`)
  }
  // 返回路径：报告页 ← ALL RESEARCH
  await nav(`${BASE}/#/research/report-1`, 800)
  await ev(`[...document.querySelectorAll('a')].find(a => a.textContent.includes('ALL RESEARCH'))?.click()`)
  await sleep(800)
  const backOk = await ev(`location.hash === '#/research' && document.body.innerText.includes('研报')`)
  rec('Cross-page', '报告页 ← ALL RESEARCH 返回路径', backOk === true, await ev('location.hash'))
  // Home Featured ↔ Research 语义一致：索引含报告一标题
  const idxHas = await ev(`document.body.innerText.includes('中国 AI 算力基础设施产业链研究')`)
  rec('Cross-page', 'Home Featured ↔ Research 索引语义一致', idxHas === true, '索引含报告一标题')
  // Map Preview vs 完整 Map 密度差
  await nav(`${BASE}/#/map`, 900)
  const mapTxt = await ev('document.body.innerText')
  rec('Cross-page', '完整 Map 信息密度 > Preview（含图例/明细）', mapTxt.includes('估值透支') && mapTxt.length > 600, `文本量=${mapTxt.length}`)
  await shot('desktop-map.png')
  // Thesis ↔ Current Belief 不冲突
  await nav(`${BASE}/#/thesis/compute`, 900)
  const thTxt = await ev('document.body.innerText')
  rec('Cross-page', 'Thesis compute ↔ Current Belief 同源（72% 一致）', thTxt.includes('国产算力') && thTxt.includes('72'), '命题页含国产算力与 72')

  /* ────────── 汇总 ────────── */
  const jsErrors = consoleErrors.filter((e) => !e.includes('fonts.g') && !e.includes('net::ERR'))
  rec('Home', '全程零 JS 异常 / 零 console.error', jsErrors.length === 0, jsErrors.length ? jsErrors.slice(0, 3).join(' ;; ') : '干净')

  const fails = results.filter((r) => r.result === 'FAIL')
  const summary = { total: results.length, pass: results.length - fails.length, fail: fails.length, consoleErrors: jsErrors }
  fs.writeFileSync(path.join(OUT_DIR, 'results.json'), JSON.stringify({ summary, results, allConsoleNotes: consoleErrors }, null, 2))
  console.log('\n════ PHASE 9 ACCEPTANCE ════')
  for (const r of results) console.log(`${r.result === 'PASS' ? '✅' : '❌'} [${r.area}] ${r.test}${r.result === 'FAIL' ? '  ::  ' + r.evidence : ''}`)
  console.log(`\nTOTAL ${summary.pass}/${summary.total} PASS · FAIL=${summary.fail}`)
  if (consoleErrors.length) console.log('console notes:', consoleErrors.slice(0, 5))
}

main().then(() => { cleanup(); process.exit(0) }).catch((e) => { console.error('FATAL', e); cleanup(); process.exit(1) })
setTimeout(() => { console.error('GLOBAL TIMEOUT'); cleanup(); process.exit(2) }, 280000)
