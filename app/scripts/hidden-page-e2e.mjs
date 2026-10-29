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
const COLLECTIONS_ONLY = process.env.E2E_COLLECTIONS_ONLY === '1'
const MOBILE_ONLY = process.env.E2E_MOBILE_ONLY === '1'
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
    const timer = setTimeout(() => {
      pending.delete(id)
      reject(new Error(`Browser command timed out: ${method}`))
    }, 30000)
    pending.set(id, { resolve, reject, timer })
    ws.send(JSON.stringify({ id, method, params }))
  })
}

async function waitFor(expression, timeout = 30000) {
  const start = Date.now()
  while (Date.now() - start < timeout) {
    if (await evaluate(expression)) return
    await sleep(120)
  }
  const state = await evaluate(`({ hash: location.hash, text: document.body.innerText.slice(0, 500) })`)
  throw new Error(`Browser assertion timed out: ${expression}\n${JSON.stringify(state)}`)
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
  if ((MOBILE_ONLY && name.startsWith('desktop-')) || (COLLECTIONS_ONLY && name === 'desktop-locked.png')) return
  console.log(`CAPTURE ${name}`)
  const result = await send('Page.captureScreenshot', {
    format: 'png',
    fromSurface: true,
    captureBeyondViewport: false,
  })
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
    '--disable-background-timer-throttling',
    '--disable-renderer-backgrounding',
    '--disable-backgrounding-occluded-windows',
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
      clearTimeout(handler.timer)
      if (message.error) handler.reject(new Error(JSON.stringify(message.error)))
      else handler.resolve(message.result)
    }
    if (message.method === 'Runtime.exceptionThrown') exceptions.push(message.params)
  })

  console.log('STAGE browser connected')
  await send('Runtime.enable')
  await send('Page.enable')
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false })

  /* 没有三连击凭证时，直接输入内部地址也会被送回首页。 */
  await send('Page.navigate', { url: `${BASE}/#/after-hours/library` })
  console.log('STAGE page navigated')
  await waitFor(`location.hash === '#/' && !!document.querySelector('button[aria-label="HSN 符号"]')`)
  await waitFor(`(() => { const button = document.querySelector('button[aria-label="HSN 符号"]'); const propsKey = Object.keys(button).find(key => key.startsWith('__reactProps$')); return propsKey && typeof button[propsKey].onClick === 'function' })()`)
  await sleep(200)

  if (MOBILE_ONLY) {
    console.log('STAGE creating mobile test session')
    const loginStatus = await evaluate(`fetch('/api/hidden-access', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: 'correct-horse' }),
    }).then(response => response.status)`)
    assert.equal(loginStatus, 200)
    await evaluate(`sessionStorage.setItem('tradinglab:after-hours-entry', 'granted'); location.hash = '/after-hours'; true`)
    await waitFor(`!!document.querySelector('.ah-private')`)
  } else {
    await evaluate(`(() => {
      const logo = document.querySelector('button[aria-label="HSN 符号"]')
      for (let click = 0; click < 3; click += 1) logo.click()
    })()`)
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
    const articleItemCounts = await evaluate(`fetch('/api/hidden-content').then(response => response.json()).then(content => content.notes.map(note => note.sections.flatMap(section => section.items ?? []).length))`)
    assert.equal(articleItemCounts.length, 8)
    assert.equal(articleItemCounts.every(count => count >= 15), true)
    await screenshot('desktop-unlocked.png')
  }

  if (!MOBILE_ONLY) {
    await evaluate(`document.querySelector('.ah-scroll-link').click()`)
    await waitFor(`document.querySelector('.circular-carousel')?.hasAttribute('data-ready')`)
    await sleep(1800)
    assert.equal(await evaluate(`document.querySelectorAll('.circular-carousel__card').length`), 7)
    assert.equal(await evaluate(`location.hash`), '#/after-hours')
    assert.equal(await evaluate(`!!document.querySelector('.ah-carousel-current, .ah-system-section, .ah-path-section, .ah-recent-section, .ah-footer')`), false)
    assert.equal(await evaluate(`document.querySelector('.ah-carousel-section').lastElementChild.classList.contains('ah-carousel-stage')`), true)
    await screenshot('desktop-carousel.png')

    /* 七张卡片都是真实目录入口；Library 保持原三栏工作台。 */
    await evaluate(`document.querySelector('[data-cc-index="0"]').click()`)
    await waitFor(`location.hash === '#/after-hours/library' && document.querySelectorAll('.ah-library-row').length === 8`)
    await evaluate(`document.querySelector('.ah-library-home').click()`)
    await waitFor(`location.hash === '#/after-hours' && document.querySelector('.circular-carousel')?.hasAttribute('data-ready')`)
  }

  const collectionCases = [
    { index: 1, id: 'research', title: '高价值研报与文章', stage: '.ah-collection-interactive--research .stack', second: '公司与商业模式' },
    { index: 2, id: 'media', title: '书籍、视频与影视剧', stage: '.ah-collection-interactive--media .masonry', second: '纪录片与视频' },
    { index: 3, id: 'tools', title: '实用工具', stage: '.ah-collection-interactive--tools .folder-root', second: '数据与测量工具' },
    { index: 4, id: 'dashboards', title: '数据看板', stage: '.ah-collection-interactive--dashboards .magic-bento', second: '产业与供需' },
    { index: 5, id: 'conversations', title: '财经对话与现场实录', stage: '.ah-collection-interactive--conversations .animated-list', second: '大佬访谈' },
    { index: 6, id: 'investors', title: '投资者框架与持仓思路', stage: '.ah-collection-interactive--investors .sphere-root', second: '投资体系' },
  ]
  if (!MOBILE_ONLY) {
  for (const { index, id, title, stage, second } of collectionCases) {
    await evaluate(`document.querySelector('[data-cc-index="${index}"]').click()`)
    await waitFor(`location.hash === '#/after-hours/collection/${id}' && document.querySelector('.ah-collection-header h1')?.textContent === ${JSON.stringify(title)}`)
    await waitFor(`!!document.querySelector(${JSON.stringify(stage)})`)
    assert.match(await evaluate(`document.querySelector('.ah-collection-empty').textContent`), /内容等待归档/)
    await sleep(800)

    if (id === 'research') {
      assert.equal(await evaluate(`document.querySelectorAll('.stack-card').length`), 3)
      const card = await evaluate(`(() => { const element = document.querySelector('.stack-card[data-top]'); element.scrollIntoView({ block: 'center' }); const rect = element.getBoundingClientRect(); return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 } })()`)
      await send('Input.dispatchMouseEvent', { type: 'mousePressed', ...card, button: 'left', clickCount: 1 })
      await send('Input.dispatchMouseEvent', { type: 'mouseReleased', ...card, button: 'left', clickCount: 1 })
    } else if (id === 'media') {
      await waitFor(`document.querySelectorAll('.masonry__card').length === 3 && [...document.querySelectorAll('.masonry__image')].every(image => image.hasAttribute('data-loaded'))`)
      await evaluate(`document.querySelectorAll('.masonry__card')[1].click()`)
    } else if (id === 'tools') {
      assert.equal(await evaluate(`document.querySelectorAll('.folder-stage').length`), 3)
      await evaluate(`document.querySelectorAll('.folder-stage')[1].click()`)
      await waitFor(`document.querySelectorAll('.folder-root')[1].hasAttribute('data-open')`)
    } else if (id === 'dashboards') {
      assert.equal(await evaluate(`document.querySelectorAll('.magic-bento__card').length`), 3)
      assert.equal(await evaluate(`document.querySelector('.magic-bento').textContent.includes('WAITING FOR DATA')`), true)
      await evaluate(`document.querySelectorAll('.magic-bento__card')[1].click()`)
    } else if (id === 'conversations') {
      assert.equal(await evaluate(`document.querySelectorAll('.animated-list__item').length`), 3)
      await evaluate(`document.querySelectorAll('.animated-list__item')[1].click()`)
    } else if (id === 'investors') {
      await waitFor(`document.querySelectorAll('.ah-investor-dome .item__image').length > 0`)
      const domeLabel = await evaluate(`(() => {
        const tiles = [...document.querySelectorAll('.ah-investor-dome .item__image')]
        const visible = tiles.find(tile => {
          const rect = tile.getBoundingClientRect()
          if (rect.width <= 0 || rect.height <= 0 || rect.bottom < 0 || rect.top > innerHeight) return false
          const hit = document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2)
          return tile.getAttribute('aria-label') !== '思考框架' && hit && (hit === tile || tile.contains(hit))
        })
        const target = visible ?? tiles.find(tile => tile.getAttribute('aria-label') !== '思考框架') ?? tiles[0]
        const label = target.getAttribute('aria-label')
        target.click()
        return label
      })()`)
      await waitFor(`document.querySelector('.ah-collection-empty h2')?.textContent.includes(${JSON.stringify(domeLabel)})`)
      await waitFor(`!!document.querySelector('.ah-investor-dome .enlarge')`)
      await sleep(500)
      await evaluate(`window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))`)
      await waitFor(`!document.querySelector('.ah-investor-dome .enlarge')`)
    }

    if (id !== 'investors') await waitFor(`document.querySelector('.ah-collection-empty h2')?.textContent.includes(${JSON.stringify(second)})`)
    assert.equal(await evaluate(`document.documentElement.scrollWidth <= window.innerWidth`), true)
    await screenshot(`desktop-collection-${id}.png`)
    await evaluate(`document.querySelector('.ah-collection-home').click()`)
    await waitFor(`location.hash === '#/after-hours' && document.querySelector('.circular-carousel')?.hasAttribute('data-ready')`)
  }
  }

  if (!COLLECTIONS_ONLY && !MOBILE_ONLY) {
  await evaluate(`window.location.hash = '/after-hours/note/structure-break-retest'`)
  await waitFor(`location.hash === '#/after-hours/note/structure-break-retest' && !!document.querySelector('.ah-note-article')`)
  assert.equal(await evaluate(`document.querySelectorAll('.ah-note-article section').length`), 5)
  assert.equal(await evaluate(`document.querySelectorAll('.ah-note-article li').length`), 15)
  await screenshot('desktop-note.png')

  await evaluate(`document.querySelector('.ah-note-back').click()`)
  await waitFor(`location.hash === '#/after-hours/library' && document.querySelectorAll('.ah-library-row').length === 8`)

  await evaluate(`document.querySelector('.ah-panel-resizer-left').dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))`)
  await waitFor(`document.querySelector('.ah-panel-resizer-left').getAttribute('aria-valuenow') === '236'`)
  const leftResizer = await evaluate(`(() => { const rect = document.querySelector('.ah-panel-resizer-left').getBoundingClientRect(); return { x: rect.x + rect.width / 2, y: rect.y + 140 } })()`)
  await send('Input.dispatchMouseEvent', { type: 'mousePressed', ...leftResizer, button: 'left', clickCount: 1 })
  await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: leftResizer.x + 60, y: leftResizer.y, button: 'left', buttons: 1 })
  await send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: leftResizer.x + 60, y: leftResizer.y, button: 'left', clickCount: 1 })
  await waitFor(`document.querySelector('.ah-panel-resizer-left').getAttribute('aria-valuenow') === '296'`)
  await evaluate(`document.querySelector('.ah-panel-resizer-left').dispatchEvent(new MouseEvent('dblclick', { bubbles: true }))`)
  await waitFor(`document.querySelector('.ah-panel-resizer-left').getAttribute('aria-valuenow') === '220'`)

  await evaluate(`document.querySelector('.ah-library-panelbar > div > button').click()`)
  await waitFor(`document.querySelector('.ah-library-grid').classList.contains('is-left-collapsed')`)
  await evaluate(`document.querySelector('.ah-library-panelbar > div > button').click()`)
  await waitFor(`!document.querySelector('.ah-library-grid').classList.contains('is-left-collapsed')`)
  await evaluate(`document.querySelector('.ah-panel-resizer-right').dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }))`)
  await waitFor(`document.querySelector('.ah-panel-resizer-right').getAttribute('aria-valuenow') === '621'`)
  await send('Page.reload')
  await sleep(800)
  await waitFor(`document.querySelector('.ah-panel-resizer-right')?.getAttribute('aria-valuenow') === '621'`)
  await evaluate(`document.querySelector('.ah-library-panelbar > button').click()`)
  await waitFor(`document.querySelector('.ah-panel-resizer-right').getAttribute('aria-valuenow') === '605'`)

  /* 桌面右栏是完整长文；切文回到顶部，返回只关闭阅读区而不丢索引。 */
  assert.equal(await evaluate(`document.querySelectorAll('.ah-library-reader > section').length`), 5)
  assert.equal(await evaluate(`(() => { const reader = document.querySelector('.ah-library-preview'); return reader.scrollHeight > reader.clientHeight })()`), true)
  await evaluate(`document.querySelector('.ah-library-preview').scrollTop = 800`)
  await waitFor(`document.querySelector('.ah-library-preview').scrollTop > 0`)
  await evaluate(`document.querySelectorAll('.ah-library-row')[1].click()`)
  await waitFor(`document.querySelector('.ah-library-preview').scrollTop === 0`)
  assert.equal(await evaluate(`document.querySelectorAll('.ah-library-reader li').length`), 15)
  assert.equal(await evaluate(`document.querySelectorAll('.ah-reader-tab').length`), 2)
  await screenshot('desktop-library-tabs.png')
  await evaluate(`document.querySelectorAll('.ah-reader-tab-close')[1].click()`)
  await waitFor(`document.querySelectorAll('.ah-reader-tab').length === 1 && document.querySelector('.ah-library-reader h2').textContent.includes('流动性清扫')`)
  assert.equal(await evaluate(`document.querySelectorAll('.ah-library-row').length`), 8)
  await evaluate(`document.querySelector('.ah-reader-tab-close').click()`)
  await waitFor(`document.querySelectorAll('.ah-reader-tab').length === 0 && document.querySelector('.ah-library-grid').classList.contains('is-right-collapsed')`)
  await evaluate(`document.querySelectorAll('.ah-library-row')[2].click()`)
  await waitFor(`document.querySelectorAll('.ah-reader-tab').length === 1 && document.querySelector('.ah-library-reader h2').textContent.includes('趋势不是一条线')`)
  assert.equal(await evaluate(`document.querySelectorAll('.ah-library-row').length`), 8)
  await evaluate(`document.querySelector('.ah-preview-close').click()`)
  await waitFor(`document.querySelector('.ah-library-grid').classList.contains('is-right-collapsed')`)
  assert.equal(await evaluate(`document.querySelectorAll('.ah-library-row').length`), 8)
  await evaluate(`document.querySelector('.ah-library-panelbar > div > button:nth-child(2)').click()`)
  await waitFor(`!document.querySelector('.ah-library-grid').classList.contains('is-right-collapsed')`)
  await evaluate(`document.querySelectorAll('.ah-library-row')[0].click()`)
  await waitFor(`document.querySelector('.ah-library-reader > header h2')?.textContent.length > 0`)
  await screenshot('desktop-library.png')

  /* 与用户标注截图相同的宽屏：正文默认约占窗口 42%，不再被索引挤压。 */
  await send('Emulation.setDeviceMetricsOverride', { width: 1900, height: 1200, deviceScaleFactor: 1, mobile: false })
  await evaluate(`localStorage.removeItem('tradinglab:after-hours-library-panels-v2')`)
  await send('Page.reload')
  await sleep(800)
  await waitFor(`document.querySelector('.ah-panel-resizer-right')?.getAttribute('aria-valuenow') === '798'`)
  assert.equal(await evaluate(`document.querySelector('.ah-library-preview').getBoundingClientRect().width >= window.innerWidth * 0.4`), true)
  await screenshot('wide-library.png')
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false })

  await evaluate(`document.querySelector('.ah-library-home').click()`)
  await waitFor(`location.hash === '#/after-hours' && !!document.querySelector('.ah-private')`)
  await evaluate(`document.querySelector('.ah-header-link').click()`)
  await waitFor(`location.hash === '#/after-hours/library' && document.querySelectorAll('.ah-library-row').length === 8`)
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
  await waitFor(`location.hash === '#/after-hours' && !!document.querySelector('.ah-private')`)
  assert.equal(await evaluate(`!!document.querySelector('.ah-system-section, .ah-path-section, .ah-recent-section, .ah-footer')`), false)
  await evaluate(`window.location.hash = '/after-hours/library?domain=structure'`)
  await waitFor(`location.hash === '#/after-hours/library?domain=structure' && document.querySelectorAll('.ah-library-row').length === 2`)
  await evaluate(`window.location.hash = '/after-hours/note/price-action-failure'`)
  await waitFor(`location.hash === '#/after-hours/note/price-action-failure' && !!document.querySelector('.ah-note-page')`)

  await send('Emulation.setDeviceMetricsOverride', { width: 1100, height: 850, deviceScaleFactor: 1, mobile: false })
  await send('Page.navigate', { url: `${BASE}/#/after-hours/library` })
  await waitFor(`document.querySelectorAll('.ah-library-row').length === 8`)
  assert.equal(await evaluate(`getComputedStyle(document.querySelector('.ah-panel-resizer-left')).display`), 'none')
  await evaluate(`document.querySelectorAll('.ah-library-row')[1].click()`)
  await waitFor(`document.querySelector('.ah-library-preview').classList.contains('is-medium-open')`)
  assert.equal(await evaluate(`document.documentElement.scrollWidth <= window.innerWidth`), true)
  assert.equal(await evaluate(`(() => { const reader = document.querySelector('.ah-library-preview'); return reader.scrollHeight > reader.clientHeight })()`), true)
  await screenshot('medium-library-preview.png')
  await evaluate(`document.querySelector('.ah-preview-close').click()`)
  await waitFor(`!document.querySelector('.ah-library-preview').classList.contains('is-medium-open')`)
  assert.equal(await evaluate(`document.querySelectorAll('.ah-library-row').length`), 8)
  await evaluate(`document.querySelectorAll('.ah-library-row')[1].click()`)
  await waitFor(`document.querySelector('.ah-library-preview').classList.contains('is-medium-open')`)
  await evaluate(`window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))`)
  await waitFor(`!document.querySelector('.ah-library-preview').classList.contains('is-medium-open')`)
  }

  await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true })
  await send('Page.navigate', { url: `${BASE}/#/after-hours` })
  await waitFor(`!!document.querySelector('.ah-private')`)
  await waitFor(`document.querySelector('.circular-carousel')?.hasAttribute('data-ready')`)
  assert.equal(await evaluate(`window.innerWidth === 390 && document.documentElement.scrollWidth <= window.innerWidth`), true)
  await evaluate(`window.scrollTo(0, document.querySelector('.ah-carousel-stage').getBoundingClientRect().top + window.scrollY)`)
  await sleep(900)
  assert.equal(await evaluate(`window.innerWidth === 390 && document.documentElement.scrollWidth <= window.innerWidth`), true)
  await screenshot('mobile-carousel.png')
  console.log('CHECK mobile carousel')

  for (const { id, stage, second } of collectionCases) {
    console.log(`CHECK mobile ${id}`)
    await evaluate(`window.location.hash = '/after-hours/collection/${id}'`)
    await waitFor(`location.hash === '#/after-hours/collection/${id}' && !!document.querySelector(${JSON.stringify(stage)})`)
    await sleep(700)
    assert.equal(await evaluate(`document.querySelector('.ah-collection-stage-heading span')?.textContent.startsWith('01 /')`), true)
    if (id === 'media') {
      await waitFor(`document.querySelectorAll('.masonry__card').length === 3`)
      await evaluate(`document.querySelectorAll('.masonry__card')[1].click()`)
    } else if (id === 'tools') {
      await evaluate(`document.querySelectorAll('.folder-stage')[1].click()`)
      await waitFor(`document.querySelectorAll('.folder-root')[1].hasAttribute('data-open')`)
    } else if (id === 'dashboards') {
      await evaluate(`document.querySelectorAll('.magic-bento__card')[1].click()`)
    } else if (id === 'conversations') {
      await evaluate(`document.querySelectorAll('.animated-list__item')[1].click()`)
    }
    if (id !== 'research' && id !== 'investors') await waitFor(`document.querySelector('.ah-collection-empty h2')?.textContent.includes(${JSON.stringify(second)})`)
    assert.equal(await evaluate(`window.innerWidth === 390 && document.documentElement.scrollWidth <= window.innerWidth`), true)
    const captureTarget = {
      media: `document.querySelectorAll('.masonry__card')[1]`,
      tools: `document.querySelector('.folder-root[data-open]')`,
      dashboards: `document.querySelectorAll('.magic-bento__card')[1]`,
      conversations: `document.querySelectorAll('.animated-list__item')[1]`,
    }[id] ?? `document.querySelector('.ah-collection-interactive')`
    await evaluate(`(() => {
      const target = ${captureTarget}
      window.scrollTo(0, Math.max(0, target.getBoundingClientRect().top + window.scrollY - 120))
    })()`)
    await sleep(500)
    assert.equal(await evaluate(`window.innerWidth === 390 && document.documentElement.scrollWidth <= window.innerWidth`), true)
    await screenshot(`mobile-collection-${id}.png`)
  }

  await send('Page.navigate', { url: `${BASE}/#/after-hours/library` })
  await waitFor(`document.querySelectorAll('.ah-library-row').length === 8`)
  assert.equal(await evaluate(`document.documentElement.scrollWidth <= window.innerWidth`), true)
  await screenshot('mobile-library.png')
  await evaluate(`document.querySelector('.ah-library-row').click()`)
  await waitFor(`!!document.querySelector('.ah-note-page')`)
  assert.equal(await evaluate(`document.documentElement.scrollWidth <= window.innerWidth`), true)
  await screenshot('mobile-note.png')
  assert.deepEqual(exceptions, [])

  if (MOBILE_ONLY) {
    console.log('PASS 六类手机目录 / 移动端基础阅读 / 390px 无横向溢出 / 无浏览器异常')
  } else if (COLLECTIONS_ONLY) {
    console.log('PASS 内部地址拦截 → 三连击 → 密码验证 → 七类目录轮播 → 六类独立目录')
    console.log('PASS 六类桌面与手机目录 / 移动端基础阅读 / 无横向溢出 / 无浏览器异常')
  } else {
    console.log('PASS 内部地址拦截 → 三连击 → 密码验证 → 七类目录轮播 → 六类独立目录 → 详情阅读')
    console.log('PASS Library 筛选与标签 / 全局搜索 / 移动端目录 / 无横向溢出 / 无浏览器异常')
  }
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
