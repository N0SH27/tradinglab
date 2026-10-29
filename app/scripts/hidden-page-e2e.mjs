/* 一次性真实 Chrome 验收：node scripts/hidden-page-e2e.mjs；结束自动清理进程。 */
import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const OUT = path.join(ROOT, 'hidden-audit')
const PROFILE = path.join(ROOT, '.tmp-hidden-e2e-chrome')
const BASE = 'http://127.0.0.1:7100'
const CHROME = process.env.CHROME_PATH ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
fs.rmSync(PROFILE, { recursive: true, force: true })
fs.mkdirSync(OUT, { recursive: true })

let vite
let chrome
let ws

async function waitHttp(url, timeout = 15000) {
  const start = Date.now()
  while (Date.now() - start < timeout) {
    try {
      const response = await fetch(url)
      if (response.ok) return response
    } catch { /* 服务尚未启动 */ }
    await sleep(150)
  }
  throw new Error(`Timed out: ${url}`)
}

async function evaluate(expression) {
  const result = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })
  if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails))
  return result.result?.value
}

let sequence = 0
const pending = new Map()
const exceptions = []
function send(method, params = {}) {
  const id = ++sequence
  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject })
    ws.send(JSON.stringify({ id, method, params }))
  })
}

async function waitFor(expression, timeout = 12000) {
  const start = Date.now()
  while (Date.now() - start < timeout) {
    if (await evaluate(expression)) return
    await sleep(120)
  }
  throw new Error(`Browser assertion timed out: ${expression}`)
}

async function setPassword(value) {
  await evaluate(`(() => {
    const input = document.querySelector('#after-hours-password');
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
    setter.call(input, ${JSON.stringify(value)});
    input.dispatchEvent(new Event('input', { bubbles: true }));
  })()`)
}

async function screenshot(name) {
  const result = await send('Page.captureScreenshot', { format: 'png', fromSurface: true })
  fs.writeFileSync(path.join(OUT, name), Buffer.from(result.data, 'base64'))
}

try {
  vite = spawn('npm', ['run', 'dev', '--', '--host', '127.0.0.1', '--port', '7100'], {
    cwd: ROOT,
    detached: true,
    stdio: 'ignore',
    env: {
      ...process.env,
      HIDDEN_PAGE_PASSWORD: 'correct-horse',
      HIDDEN_PAGE_SECRET: 'e2e-signing-secret-that-is-long-and-random',
    },
  })
  await waitHttp(BASE)

  chrome = spawn(CHROME, [
    '--headless=new',
    '--remote-debugging-port=9339',
    `--user-data-dir=${PROFILE}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-gpu-sandbox',
    '--use-angle=swiftshader',
    'about:blank',
  ], { detached: true, stdio: 'ignore' })
  await waitHttp('http://127.0.0.1:9339/json/version')
  const targets = await (await fetch('http://127.0.0.1:9339/json/list')).json()
  const page = targets.find(target => target.type === 'page')
  ws = new WebSocket(page.webSocketDebuggerUrl)
  await new Promise((resolve, reject) => {
    ws.addEventListener('open', resolve, { once: true })
    ws.addEventListener('error', reject, { once: true })
  })
  ws.addEventListener('message', event => {
    const message = JSON.parse(event.data)
    if (message.id) {
      const handler = pending.get(message.id)
      if (!handler) return
      pending.delete(message.id)
      if (message.error) handler.reject(new Error(JSON.stringify(message.error)))
      else handler.resolve(message.result)
    }
    if (message.method === 'Runtime.exceptionThrown') exceptions.push(message.params)
  })

  await send('Runtime.enable')
  await send('Page.enable')
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false })

  /* 没有三连击凭证时，直接输入内部地址也会被送回首页。 */
  await send('Page.navigate', { url: `${BASE}/#/after-hours/library` })
  await waitFor(`location.hash === '#/' && !!document.querySelector('button[aria-label="HSN 符号"]')`)
  await sleep(800)

  await evaluate(`document.querySelector('button[aria-label="HSN 符号"]').click()`)
  await evaluate(`document.querySelector('button[aria-label="HSN 符号"]').click()`)
  await evaluate(`document.querySelector('button[aria-label="HSN 符号"]').click()`)
  await sleep(600)
  await waitFor(`location.hash === '#/after-hours' && !!document.querySelector('#after-hours-password')`)
  await sleep(1400)
  assert.equal(await evaluate(`!!document.querySelector('.ghost-fibers-canvas')?.getContext('webgl2')`), true)
  await screenshot('desktop-locked.png')

  await setPassword('wrong-password')
  await evaluate(`document.querySelector('.ah-form').requestSubmit()`)
  await waitFor(`document.querySelector('.ah-error')?.textContent.includes('密码不正确')`)

  await setPassword('correct-horse')
  await evaluate(`document.querySelector('.ah-form').requestSubmit()`)
  await waitFor(`!!document.querySelector('.ah-private')`)
  await sleep(1200)
  await screenshot('desktop-unlocked.png')

  await evaluate(`document.querySelector('.ah-scroll-link').click()`)
  await waitFor(`document.querySelector('.circular-carousel')?.hasAttribute('data-ready')`)
  await sleep(1800)
  assert.equal(await evaluate(`document.querySelectorAll('.circular-carousel__card').length`), 6)
  assert.equal(await evaluate(`location.hash`), '#/after-hours')
  await screenshot('desktop-carousel.png')

  await evaluate(`document.querySelector('.circular-carousel').dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))`)
  await waitFor(`document.querySelector('.ah-carousel-current-index')?.textContent.includes('031')`)
  assert.match(await evaluate(`document.querySelector('.ah-carousel-current p').textContent`), /结构破坏负责改变假设/)
  await evaluate(`document.querySelector('.ah-carousel-current .ah-inline-link').click()`)
  await waitFor(`location.hash === '#/after-hours/note/structure-break-retest' && !!document.querySelector('.ah-note-article')`)
  assert.equal(await evaluate(`document.querySelectorAll('.ah-note-article section').length`), 4)
  await screenshot('desktop-note.png')

  await evaluate(`document.querySelector('.ah-note-back').click()`)
  await waitFor(`location.hash === '#/after-hours/library' && document.querySelectorAll('.ah-library-row').length === 8`)
  await screenshot('desktop-library.png')
  await evaluate(`[...document.querySelectorAll('.ah-library-filters fieldset')][0].querySelectorAll('button')[4].click()`)
  await waitFor(`document.querySelectorAll('.ah-library-row').length === 2`)
  assert.match(await evaluate(`document.querySelector('.ah-library-results').textContent`), /流动性清扫/)
  await evaluate(`document.querySelector('.ah-clear-filters').click()`)
  await waitFor(`document.querySelectorAll('.ah-library-row').length === 8`)

  await evaluate(`(() => {
    const input = document.querySelector('.ah-filter-search input');
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
    setter.call(input, 'ATR');
    input.dispatchEvent(new Event('input', { bubbles: true }));
  })()`)
  await waitFor(`document.querySelectorAll('.ah-library-row').length === 1`)
  assert.match(await evaluate(`document.querySelector('.ah-library-row-title').textContent`), /ATR/)
  await evaluate(`document.querySelector('.ah-preview-open').click()`)
  await waitFor(`location.hash === '#/after-hours/note/atr-risk-measurement'`)

  await evaluate(`window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true }))`)
  await waitFor(`!!document.querySelector('.ah-search-dialog')`)
  await evaluate(`(() => {
    const input = document.querySelector('.ah-search-input-row input');
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
    setter.call(input, '追单');
    input.dispatchEvent(new Event('input', { bubbles: true }));
  })()`)
  await waitFor(`document.querySelectorAll('.ah-search-results > button').length >= 2`)
  await evaluate(`document.querySelector('.ah-search-input-row input').dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))`)
  await waitFor(`!document.querySelector('.ah-search-dialog') && !!document.querySelector('.ah-note-page')`)

  await evaluate(`document.querySelector('.ah-wordmark').click()`)
  await waitFor(`!!document.querySelector('.ah-system-section')`)
  await evaluate(`document.querySelector('.ah-system-section').scrollIntoView()`)
  await screenshot('desktop-system.png')
  await evaluate(`document.querySelectorAll('.ah-domain-row')[3].click()`)
  await waitFor(`location.hash === '#/after-hours/library?domain=structure' && document.querySelectorAll('.ah-library-row').length === 2`)
  await evaluate(`document.querySelector('.ah-wordmark').click()`)
  await waitFor(`!!document.querySelector('.ah-path-section')`)
  await evaluate(`document.querySelector('.ah-path-current .ah-inline-link').click()`)
  await waitFor(`location.hash === '#/after-hours/note/price-action-failure' && !!document.querySelector('.ah-note-page')`)

  await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true })
  await send('Page.navigate', { url: `${BASE}/#/after-hours` })
  await waitFor(`!!document.querySelector('.ah-private')`)
  await evaluate(`document.querySelector('.ah-scroll-link').click()`)
  await waitFor(`document.querySelector('.circular-carousel')?.hasAttribute('data-ready')`)
  await sleep(900)
  assert.equal(await evaluate(`document.documentElement.scrollWidth <= window.innerWidth`), true)
  await screenshot('mobile-carousel.png')

  await send('Page.navigate', { url: `${BASE}/#/after-hours/library` })
  await waitFor(`document.querySelectorAll('.ah-library-row').length === 8`)
  assert.equal(await evaluate(`document.documentElement.scrollWidth <= window.innerWidth`), true)
  await screenshot('mobile-library.png')
  await evaluate(`document.querySelector('.ah-library-row').click()`)
  await waitFor(`!!document.querySelector('.ah-note-page')`)
  assert.equal(await evaluate(`document.documentElement.scrollWidth <= window.innerWidth`), true)
  await screenshot('mobile-note.png')
  assert.deepEqual(exceptions, [])

  console.log('PASS 内部地址拦截 → 三连击 → 密码验证 → 精选轮播 → 详情阅读 → 资料库筛选')
  console.log('PASS 全局搜索 / 键盘切换 / 移动端直达详情 / 无横向溢出 / 无浏览器异常')
  console.log(`Screenshots: ${OUT}`)
} finally {
  if (ws) ws.close()
  for (const child of [chrome, vite]) {
    if (child?.pid) {
      try { process.kill(-child.pid, 'SIGTERM') } catch { /* 已退出 */ }
    }
  }
  await sleep(300)
  fs.rmSync(PROFILE, { recursive: true, force: true })
}
