/* 一次性真实 Chrome 验收：node scripts/hidden-page-e2e.mjs；结束自动清理进程。 */
import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const OUT = path.join(ROOT, 'hidden-audit')
const PROFILE = path.join(ROOT, '.tmp-hidden-e2e-chrome')
const PDF_FIXTURE = path.join(ROOT, 'public/hidden/books/e2e-book-download.pdf')
const PDF_DOWNLOAD = path.join(OUT, 'e2e-book-download.pdf')
const BASE = 'http://127.0.0.1:7100'
const CHROME = process.env.CHROME_PATH ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const COLLECTIONS_ONLY = process.env.E2E_COLLECTIONS_ONLY === '1'
const MOBILE_ONLY = process.env.E2E_MOBILE_ONLY === '1'
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
fs.rmSync(PROFILE, { recursive: true, force: true })
fs.mkdirSync(OUT, { recursive: true })

function createPdfFixture() {
  const stream = 'BT\n/F1 12 Tf\n20 60 Td\n(TradingLabb PDF fixture) Tj\nET\n'
  const objects = [
    '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n',
    '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n',
    '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 200 120] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>\nendobj\n',
    '4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n',
    `5 0 obj\n<< /Length ${Buffer.byteLength(stream)} >>\nstream\n${stream}endstream\nendobj\n`,
  ]
  let content = '%PDF-1.4\n'
  const offsets = []
  for (const object of objects) {
    offsets.push(Buffer.byteLength(content))
    content += object
  }
  const xref = Buffer.byteLength(content)
  content += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`
  content += offsets.map(offset => `${String(offset).padStart(10, '0')} 00000 n \n`).join('')
  return `${content}trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`
}

async function waitForFile(file, timeout = 10000) {
  const start = Date.now()
  while (Date.now() - start < timeout) {
    if (fs.existsSync(file) && fs.statSync(file).size > 0) return
    await sleep(120)
  }
  throw new Error(`Download timed out: ${file}`)
}

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

async function assertCarouselReturn(index, title) {
  await waitFor(`location.hash === '#/after-hours' && document.querySelector('.circular-carousel')?.hasAttribute('data-ready')`)
  await waitFor(`document.querySelector('.circular-carousel__title')?.firstChild?.textContent === ${JSON.stringify(title)}`)
  const state = await evaluate(`({
    caption: document.querySelector('.circular-carousel__title').firstChild.textContent,
    sectionTop: document.querySelector('.ah-carousel-section').getBoundingClientRect().top,
    scrollY: window.scrollY,
    grayscale: getComputedStyle(document.querySelector('.circular-carousel__photo')).filter,
    live: document.querySelector('.circular-carousel__live').textContent,
  })`)
  assert.equal(state.caption, title)
  assert.ok(Math.abs(state.sectionTop) < 2, `返回后轮播未对齐顶部：${state.sectionTop}`)
  assert.ok(state.scrollY > 0, '返回后仍停留在 AFTER HOURS 首屏')
  assert.equal(state.grayscale, 'grayscale(1)')
  assert.ok(state.live.includes(`${index + 1} of 7`), `轮播选中项错误：${state.live}`)
}

try {
  fs.writeFileSync(PDF_FIXTURE, createPdfFixture())
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
    await assertCarouselReturn(0, '交易知识 Library')
  }

  const collectionCases = [
    { index: 1, id: 'research', title: '高价值研报与文章', stage: '.ah-collection-interactive--research .stack', second: '公司与商业模式' },
    { index: 2, id: 'media', title: '书籍、视频与影视剧', stage: '.ah-bookshelf', second: '纪录片与视频' },
    { index: 3, id: 'tools', title: '实用工具', stage: '.ah-collection-interactive--tools .folder-root', second: '房地产与利率' },
    { index: 4, id: 'dashboards', title: '数据看板', stage: '.ah-collection-interactive--dashboards .magic-bento', second: '' },
    { index: 5, id: 'conversations', title: '财经对话与现场实录', stage: '.ah-collection-interactive--conversations .animated-list', second: '大佬访谈' },
    { index: 6, id: 'investors', title: '投资者框架与持仓思路', stage: '.ah-collection-interactive--investors .sphere-root', second: '' },
  ]
  if (!MOBILE_ONLY) {
  for (const { index, id, title, stage, second } of collectionCases) {
    await evaluate(`document.querySelector('[data-cc-index="${index}"]').click()`)
    await waitFor(`location.hash === '#/after-hours/collection/${id}' && document.querySelector('.ah-collection-header h1')?.textContent === ${JSON.stringify(title)}`)
    await waitFor(`!!document.querySelector(${JSON.stringify(stage)})`)
    if (!['tools', 'dashboards', 'investors', 'media'].includes(id)) assert.match(await evaluate(`document.querySelector('.ah-collection-empty').textContent`), /内容等待归档/)
    await sleep(800)

    if (id === 'research') {
      assert.equal(await evaluate(`document.querySelectorAll('.stack-card').length`), 3)
      const card = await evaluate(`(() => { const element = document.querySelector('.stack-card[data-top]'); element.scrollIntoView({ block: 'center' }); const rect = element.getBoundingClientRect(); return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 } })()`)
      await send('Input.dispatchMouseEvent', { type: 'mousePressed', ...card, button: 'left', clickCount: 1 })
      await send('Input.dispatchMouseEvent', { type: 'mouseReleased', ...card, button: 'left', clickCount: 1 })
    } else if (id === 'media') {
      assert.equal(await evaluate(`document.querySelectorAll('.ah-book-spine').length`), 5)
      assert.equal(await evaluate(`document.querySelectorAll('.ah-bookshelf-tier').length`), 2)
      assert.deepEqual(await evaluate(`Array.from(document.querySelectorAll('.ah-bookshelf-tier')).map(tier => tier.querySelectorAll('.ah-book-spine').length)`), [3, 2])
      assert.equal(await evaluate(`!!document.querySelector('.ah-bookshelf-pagination')`), false)
      assert.equal(await evaluate(`!!document.querySelector('.ah-collection-empty')`), false)
      await screenshot('desktop-bookshelf.png')
      await evaluate(`document.querySelectorAll('.ah-bookshelf-tier')[1].scrollIntoView({ block: 'center' })`)
      await sleep(300)
      await screenshot('desktop-bookshelf-second-tier.png')
      await evaluate(`document.querySelectorAll('.ah-book-spine')[1].click()`)
      await waitFor(`document.querySelector('.ah-book-preview h2')?.textContent === '我和小明' && !!document.querySelector('.ah-book-holo-button .holo-card')`)
      await sleep(500)
      assert.equal(await evaluate(`(() => {
        const layer = document.querySelector('.ah-book-immersive--preview')
        if (!layer) return false
        const style = getComputedStyle(layer)
        const rect = layer.getBoundingClientRect()
        return layer.parentElement === document.body && style.position === 'fixed' && style.backdropFilter.includes('blur') && rect.top === 0 && rect.left === 0 && rect.width === innerWidth && rect.height === innerHeight && document.body.style.overflow === 'hidden' && !!layer.querySelector('[role="dialog"][aria-modal="true"]')
      })()`), true)
      await screenshot('desktop-book-preview.png')
      await evaluate(`document.querySelector('.ah-book-holo-button').click()`)
      await waitFor(`document.querySelector('.ah-book-detail-header h1')?.textContent === '我和小明'`)
      assert.equal(await evaluate(`!!document.querySelector('.ah-book-immersive--detail [role="dialog"][aria-modal="true"]')`), true)
      assert.equal(await evaluate(`document.querySelectorAll('.ah-book-detail-reading section').length`), 3)
      assert.equal(await evaluate(`document.querySelectorAll('.ah-book-detail-reading ol li').length`), 3)
      assert.equal(await evaluate(`!!document.querySelector('.ah-book-download')`), false)
      await sleep(500)
      await screenshot('desktop-book-detail.png')
      await evaluate(`document.querySelector('.ah-book-detail-nav button').click()`)
      await waitFor(`!!document.querySelector('.ah-book-preview') && !document.querySelector('.ah-book-detail')`)

      /* 仅当前浏览器会话注入测试配置；正式书目和 PDF 文件均不保留测试数据。 */
      await evaluate(`import('/src/pages/hidden/hiddenBooks.ts').then(({ HIDDEN_BOOKS }) => {
        HIDDEN_BOOKS[1].pdf = '/hidden/books/e2e-book-download.pdf';
        return true;
      })`)
      await evaluate(`document.querySelector('.ah-book-holo-button').click()`)
      await waitFor(`!!document.querySelector('.ah-book-detail .ah-book-download')`)
      const downloadLink = await evaluate(`(() => {
        const link = document.querySelector('.ah-book-download');
        return { href: link.getAttribute('href'), fileName: link.download, label: link.getAttribute('aria-label') };
      })()`)
      assert.deepEqual(downloadLink, {
        href: '/hidden/books/e2e-book-download.pdf',
        fileName: 'e2e-book-download.pdf',
        label: '下载《我和小明》PDF 原文',
      })
      const pdfResponse = await evaluate(`fetch('/hidden/books/e2e-book-download.pdf').then(async response => ({
        status: response.status,
        type: response.headers.get('content-type'),
        prefix: (await response.text()).slice(0, 8),
      }))`)
      assert.equal(pdfResponse.status, 200)
      assert.match(pdfResponse.type, /application\/pdf/)
      assert.equal(pdfResponse.prefix, '%PDF-1.4')
      fs.rmSync(PDF_DOWNLOAD, { force: true })
      await send('Page.setDownloadBehavior', { behavior: 'allow', downloadPath: OUT })
      await evaluate(`document.querySelector('.ah-book-download').click()`)
      await waitForFile(PDF_DOWNLOAD)
      assert.equal(fs.readFileSync(PDF_DOWNLOAD, 'utf8').startsWith('%PDF-1.4'), true)
      await evaluate(`document.querySelector('.ah-book-download').scrollIntoView({ block: 'center' })`)
      await sleep(250)
      await screenshot('desktop-book-detail-download.png')
      await evaluate(`document.querySelector('.ah-book-detail-nav button').click()`)
      await waitFor(`!!document.querySelector('.ah-book-preview') && !document.querySelector('.ah-book-detail')`)
      await evaluate(`import('/src/pages/hidden/hiddenBooks.ts').then(({ HIDDEN_BOOKS }) => {
        delete HIDDEN_BOOKS[1].pdf;
        return true;
      })`)
      await evaluate(`window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))`)
      await waitFor(`!document.querySelector('.ah-book-preview') && !!document.querySelector('.ah-bookshelf') && document.body.style.overflow !== 'hidden' && document.activeElement?.id === 'book-spine-me-and-xiaoming'`)
      await evaluate(`document.querySelectorAll('.ah-media-tab')[1].click()`)
      await waitFor(`document.querySelectorAll('.ah-media-single .masonry__card').length === 1 && document.querySelector('.ah-media-single .masonry__image')?.hasAttribute('data-loaded')`)
    } else if (id === 'tools') {
      assert.equal(await evaluate(`document.querySelectorAll('.folder-stage').length`), 3)
      await evaluate(`document.querySelectorAll('.folder-stage')[1].click()`)
      await waitFor(`document.querySelectorAll('.folder-root')[1].hasAttribute('data-open')`)
      for (let group = 0; group < 3; group += 1) {
        await evaluate(`document.querySelectorAll('.ah-tool-tabs button')[${group}].click()`)
        await waitFor(`document.querySelectorAll('.ah-tool-tabs button')[${group}].getAttribute('aria-selected') === 'true'`)
        assert.equal(await evaluate(`document.querySelectorAll('.ah-tool-links > a').length`), 7)
        assert.equal(await evaluate(`[...document.querySelectorAll('.ah-tool-links > a')].every(link => link.href.startsWith('https://') && link.target === '_blank' && link.rel.includes('noreferrer'))`), true)
      }
    } else if (id === 'dashboards') {
      assert.equal(await evaluate(`document.querySelectorAll('.magic-bento__card').length`), 5)
      await waitFor(`document.querySelector('.ah-market-status')?.classList.contains('is-ready') || document.querySelector('.ah-market-status')?.classList.contains('is-error')`)
      const marketReady = await evaluate(`document.querySelector('.ah-market-status').classList.contains('is-ready')`)
      if (marketReady) {
        assert.equal(await evaluate(`document.querySelectorAll('.ah-index-quote').length`), 6)
        assert.equal(await evaluate(`document.querySelectorAll('.ah-market-empty').length`), 2)
        assert.equal(await evaluate(`document.querySelectorAll('.ah-turnover-value').length`), 1)
        assert.equal(await evaluate(`document.querySelectorAll('.ah-breadth-count').length`), 3)
        assert.match(await evaluate(`document.querySelector('.ah-turnover').textContent`), /沪深两市.*亿/s)
        assert.match(await evaluate(`document.querySelector('.ah-breadth-meta').textContent`), /上涨占比.*合计/s)
        assert.match(await evaluate(`document.querySelector('.ah-market-source').textContent`), /(?:东方财富|腾讯)公开行情.*可能延迟/)
      } else {
        assert.match(await evaluate(`document.querySelector('.ah-index-unavailable').textContent`), /暂无有效数据/)
        assert.equal(await evaluate(`document.querySelectorAll('.ah-index-quote').length`), 0)
        assert.equal(await evaluate(`document.querySelectorAll('.ah-market-empty').length`), 4)
        assert.equal(await evaluate(`document.querySelectorAll('.ah-turnover-value, .ah-breadth-count').length`), 0)
      }
    } else if (id === 'conversations') {
      assert.equal(await evaluate(`document.querySelectorAll('.animated-list__item').length`), 3)
      await evaluate(`document.querySelectorAll('.animated-list__item')[1].click()`)
    } else if (id === 'investors') {
      await waitFor(`document.querySelectorAll('.ah-investor-dome .item__image').length > 0`)
      assert.equal(await evaluate(`document.querySelectorAll('.ah-investor-directory-grid > button').length`), 20)
      const domeLabel = await evaluate(`(() => {
        const tiles = [...document.querySelectorAll('.ah-investor-dome .item__image')]
        const visible = tiles.find(tile => {
          const rect = tile.getBoundingClientRect()
          if (rect.width <= 0 || rect.height <= 0 || rect.bottom < 0 || rect.top > innerHeight) return false
          const hit = document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2)
          return hit && (hit === tile || tile.contains(hit))
        })
        const target = visible ?? tiles[0]
        const label = target.getAttribute('aria-label')
        target.click()
        return label
      })()`)
      await waitFor(`location.hash.startsWith('#/after-hours/investor/') && document.querySelector('.ah-investor-page h1')?.textContent === ${JSON.stringify(domeLabel)}`)
      assert.equal(await evaluate(`document.querySelectorAll('.ah-investor-article section').length`), 4)
      assert.equal(await evaluate(`document.querySelectorAll('.ah-investor-article li').length`), 12)
      await evaluate(`document.querySelector('.ah-note-back').click()`)
      await waitFor(`location.hash === '#/after-hours/collection/investors' && !!document.querySelector('.ah-investor-directory-grid')`)

      const profiles = await evaluate(`fetch('/api/hidden-content').then(response => response.json()).then(content => content.investors.map(({ id, name }) => ({ id, name })))`)
      assert.equal(profiles.length, 20)
      for (const profile of profiles) {
        await evaluate(`window.location.hash = '/after-hours/investor/${profile.id}'`)
        await waitFor(`document.querySelector('.ah-investor-page h1')?.textContent === ${JSON.stringify(profile.name)}`)
        if (profile.id === 'xie-guozhong') await screenshot('desktop-investor.png')
        assert.equal(await evaluate(`document.querySelectorAll('.ah-investor-article section').length`), 4)
        assert.equal(await evaluate(`document.querySelector('.ah-investor-sources').textContent.length > 20`), true)
        assert.equal(await evaluate(`document.documentElement.scrollWidth <= window.innerWidth`), true)
      }
      await evaluate(`window.location.hash = '/after-hours/collection/investors'`)
      await waitFor(`!!document.querySelector('.ah-investor-directory-grid')`)
    }

    if (['research', 'media', 'conversations'].includes(id)) await waitFor(`document.querySelector('.ah-collection-empty h2')?.textContent.includes(${JSON.stringify(second)})`)
    assert.equal(await evaluate(`document.documentElement.scrollWidth <= window.innerWidth`), true)
    await screenshot(`desktop-collection-${id}.png`)
    await evaluate(`document.querySelector('.ah-collection-home').click()`)
    const caption = await evaluate(`fetch('/api/hidden-content').then(response => response.json()).then(content => content.collections[${index}].shortTitle)`)
    await assertCarouselReturn(index, caption)
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
      assert.equal(await evaluate(`document.querySelectorAll('.ah-book-spine').length`), 5)
      assert.equal(await evaluate(`document.querySelectorAll('.ah-bookshelf-tier').length`), 2)
      assert.deepEqual(await evaluate(`Array.from(document.querySelectorAll('.ah-bookshelf-tier')).map(tier => tier.querySelectorAll('.ah-book-spine').length)`), [3, 2])
      assert.equal(await evaluate(`!!document.querySelector('.ah-bookshelf-pagination')`), false)
      assert.equal(await evaluate(`document.documentElement.scrollWidth <= window.innerWidth`), true)
      await screenshot('mobile-bookshelf.png')
      await evaluate(`document.querySelectorAll('.ah-bookshelf-tier')[1].scrollIntoView({ block: 'center' })`)
      await sleep(300)
      await screenshot('mobile-bookshelf-second-tier.png')
      await evaluate(`document.querySelectorAll('.ah-book-spine')[4].click()`)
      await waitFor(`document.querySelector('.ah-book-preview h2')?.textContent.includes('周期真实义')`)
      await sleep(500)
      assert.equal(await evaluate(`document.documentElement.scrollWidth <= window.innerWidth`), true)
      await screenshot('mobile-book-preview.png')
      await evaluate(`document.querySelector('.ah-book-holo-button').click()`)
      await waitFor(`document.querySelector('.ah-book-detail-header h1')?.textContent.includes('周期真实义')`)
      assert.equal(await evaluate(`document.querySelectorAll('.ah-book-detail-reading ol li').length`), 3)
      await waitFor(`document.querySelector('.ah-book-download')?.getAttribute('href') === '/hidden/books/zhou-jintao-cycle-collection.pdf'`)
      assert.equal(await evaluate(`document.querySelector('.ah-book-download').download`), 'zhou-jintao-cycle-collection.pdf')
      const cyclePdfResponse = await evaluate(`fetch('/hidden/books/zhou-jintao-cycle-collection.pdf', { method: 'HEAD' }).then(response => ({
        status: response.status,
        type: response.headers.get('content-type'),
        length: response.headers.get('content-length'),
      }))`)
      assert.equal(cyclePdfResponse.status, 200)
      assert.match(cyclePdfResponse.type, /application\/pdf/)
      assert.equal(Number(cyclePdfResponse.length), 95226872)
      assert.equal(await evaluate(`document.documentElement.scrollWidth <= window.innerWidth`), true)
      await sleep(500)
      await screenshot('mobile-book-detail.png')
      await evaluate(`document.querySelector('.ah-book-download').scrollIntoView({ block: 'center' })`)
      await sleep(250)
      await screenshot('mobile-book-detail-download.png')
      await evaluate(`document.querySelectorAll('.ah-book-detail-nav button')[1].click()`)
      await waitFor(`!!document.querySelector('.ah-bookshelf') && !document.querySelector('.ah-book-preview')`)
      await evaluate(`document.querySelectorAll('.ah-media-tab')[1].click()`)
      await waitFor(`document.querySelectorAll('.ah-media-single .masonry__card').length === 1`)
    } else if (id === 'tools') {
      await evaluate(`document.querySelectorAll('.folder-stage')[1].click()`)
      await waitFor(`document.querySelectorAll('.folder-root')[1].hasAttribute('data-open')`)
      await evaluate(`document.querySelectorAll('.ah-tool-tabs button')[2].click()`)
      await waitFor(`document.querySelector('.ah-tool-links').textContent.includes('JODI Oil')`)
      assert.equal(await evaluate(`document.querySelectorAll('.ah-tool-links > a').length`), 7)
    } else if (id === 'dashboards') {
      await waitFor(`document.querySelector('.ah-market-status')?.classList.contains('is-ready') || document.querySelector('.ah-market-status')?.classList.contains('is-error')`)
      assert.equal(await evaluate(`document.querySelectorAll('.magic-bento__card').length`), 5)
      assert.equal(await evaluate(`getComputedStyle(document.querySelector('.magic-bento')).gridTemplateColumns.split(' ').length`), 1)
    } else if (id === 'conversations') {
      await evaluate(`document.querySelectorAll('.animated-list__item')[1].click()`)
    } else if (id === 'investors') {
      await evaluate(`document.querySelector('.ah-investor-directory-grid > button').click()`)
      await waitFor(`location.hash === '#/after-hours/investor/xie-guozhong' && document.querySelector('.ah-investor-page h1')?.textContent === '谢国忠'`)
      assert.equal(await evaluate(`document.documentElement.scrollWidth <= window.innerWidth`), true)
      await screenshot('mobile-investor.png')
      await evaluate(`document.querySelector('.ah-note-back').click()`)
      await waitFor(`location.hash === '#/after-hours/collection/investors' && !!document.querySelector('.ah-investor-directory-grid')`)
    }
    if (['media', 'conversations'].includes(id)) await waitFor(`document.querySelector('.ah-collection-empty h2')?.textContent.includes(${JSON.stringify(second)})`)
    assert.equal(await evaluate(`window.innerWidth === 390 && document.documentElement.scrollWidth <= window.innerWidth`), true)
    const captureTarget = {
      media: `document.querySelector('.ah-media-single .masonry__card')`,
      tools: `document.querySelector('.ah-tool-directory')`,
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
  fs.rmSync(PDF_FIXTURE, { force: true })
  fs.rmSync(PDF_DOWNLOAD, { force: true })
}
