import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { createSession } from '../api/_hidden-access.js'
import hiddenContentHandler from '../api/hidden-content.js'
import hiddenResearchHandler, {
  RESEARCH_ARTICLES,
  RESEARCH_PAGE_SIZE,
  RESEARCH_TOPICS,
  queryResearch,
} from '../api/hidden-research.js'

const ENV_KEYS = ['HIDDEN_PAGE_PASSWORD', 'HIDDEN_PAGE_SECRET', 'VERCEL', 'VERCEL_ENV']
const originalEnvironment = Object.fromEntries(ENV_KEYS.map(key => [key, process.env[key]]))

function configureServer() {
  process.env.HIDDEN_PAGE_PASSWORD = 'research-test-password'
  process.env.HIDDEN_PAGE_SECRET = 'research-test-signing-secret-long-enough'
  delete process.env.VERCEL
  delete process.env.VERCEL_ENV
}

function request({ method = 'GET', url = '/api/hidden-research?topic=industry-macro', session = false } = {}) {
  return {
    method,
    url,
    headers: session ? { cookie: `tradinglab_after_hours=${createSession()}` } : {},
  }
}

function response() {
  return {
    statusCode: 200,
    headers: {},
    body: null,
    setHeader(key, value) { this.headers[key] = value },
    end(payload) { this.body = JSON.parse(payload) },
  }
}

test('六篇初始文章全部连接现有真实报告，编号和路由唯一', () => {
  assert.equal(RESEARCH_ARTICLES.length, 6)
  assert.equal(new Set(RESEARCH_ARTICLES.map(article => article.id)).size, 6)
  assert.equal(new Set(RESEARCH_ARTICLES.map(article => article.archiveId)).size, 6)
  assert.equal(new Set(RESEARCH_ARTICLES.map(article => article.href)).size, 6)
  for (const article of RESEARCH_ARTICLES) {
    assert.match(article.href, new RegExp(`^#/research/${article.id}$`))
    assert.equal(article.topic, 'industry-macro')
    assert.equal(fs.existsSync(path.join(process.cwd(), 'public', article.image)), true, article.image)
  }
})

test('三个专题计数真实，默认索引按日期由新到旧', () => {
  const counts = RESEARCH_TOPICS.map(topic => queryResearch({ topic: topic.id }).topic.count)
  assert.deepEqual(counts, [6, 0, 0])
  const result = queryResearch({ topic: 'industry-macro' })
  assert.equal(result.total, 6)
  assert.equal(result.pageSize, 15)
  assert.equal(result.pageCount, 1)
  assert.deepEqual(result.articles.map(article => article.id), ['report-6', 'report-5', 'report-4', 'report-3', 'report-2', 'report-1'])
  assert.deepEqual(result.featured.map(article => article.id), ['report-2', 'report-1', 'report-3'])
})

test('搜索、标签、类型与排序均在服务端执行', () => {
  const storage = queryResearch({ topic: 'industry-macro', q: '存储' })
  assert.deepEqual(storage.articles.map(article => article.id), ['report-5', 'report-2'])
  assert.equal(queryResearch({ topic: 'industry-macro', q: 'rc-001' }).articles[0].id, 'report-1')
  assert.equal(queryResearch({ topic: 'industry-macro', tag: 'AI 算力' }).total, 3)
  assert.equal(queryResearch({ topic: 'industry-macro', tag: '存储周期' }).total, 2)
  assert.equal(queryResearch({ topic: 'industry-macro', kind: 'report' }).total, 6)
  assert.equal(queryResearch({ topic: 'industry-macro', kind: 'essay' }).total, 6, '不可用类型回退为全部')
  const oldest = queryResearch({ topic: 'industry-macro', sort: 'oldest' })
  assert.equal(oldest.articles[0].id, 'report-1')
  const titled = queryResearch({ topic: 'industry-macro', sort: 'title' })
  assert.deepEqual(titled.articles.map(article => article.id), [...titled.articles].sort((left, right) => left.title.localeCompare(right.title, 'zh-CN')).map(article => article.id))
})

test('十五篇一页，超过后分页不遗漏不重复，越界页自动收敛', () => {
  const originals = RESEARCH_ARTICLES.splice(0, RESEARCH_ARTICLES.length)
  try {
    RESEARCH_ARTICLES.push(...Array.from({ length: 31 }, (_, index) => ({
      ...originals[0],
      id: `fixture-${index + 1}`,
      archiveId: `FIX-${String(index + 1).padStart(3, '0')}`,
      title: `分页测试 ${String(index + 1).padStart(2, '0')}`,
      date: `2026.${String(index + 1).padStart(2, '0')}`,
      featuredOrder: index + 1,
    })))
    const first = queryResearch({ topic: 'industry-macro', sort: 'oldest', page: 1 })
    const second = queryResearch({ topic: 'industry-macro', sort: 'oldest', page: 2 })
    const last = queryResearch({ topic: 'industry-macro', sort: 'oldest', page: 999 })
    assert.equal(RESEARCH_PAGE_SIZE, 15)
    assert.equal(first.pageCount, 3)
    assert.equal(first.articles.length, 15)
    assert.equal(second.articles.length, 15)
    assert.equal(last.page, 3)
    assert.equal(last.articles.length, 1)
    const ids = [...first.articles, ...second.articles, ...last.articles].map(article => article.id)
    assert.equal(new Set(ids).size, 31)
    assert.deepEqual(ids, Array.from({ length: 31 }, (_, index) => `fixture-${index + 1}`))
    assert.equal(queryResearch({ topic: 'industry-macro', page: -8 }).page, 1)
    assert.equal(queryResearch({ topic: 'industry-macro', page: 'not-a-page' }).page, 1)
  } finally {
    RESEARCH_ARTICLES.splice(0, RESEARCH_ARTICLES.length, ...originals)
  }
})

test('空专题、无结果与非法参数保持稳定', () => {
  for (const topic of ['company-business', 'cross-asset']) {
    const result = queryResearch({ topic })
    assert.equal(result.total, 0)
    assert.equal(result.page, 1)
    assert.equal(result.pageCount, 0)
    assert.deepEqual(result.articles, [])
    assert.deepEqual(result.featured, [])
  }
  const empty = queryResearch({ topic: 'industry-macro', q: '不存在的检索词' })
  assert.equal(empty.total, 0)
  assert.equal(empty.pageCount, 0)
  assert.deepEqual(empty.articles, [])
  const fallback = queryResearch({ topic: 'industry-macro', tag: '伪造标签', sort: 'random', q: `  ${'检'.repeat(100)}  ` })
  assert.equal(fallback.query.tag, '')
  assert.equal(fallback.query.sort, 'newest')
  assert.equal(fallback.query.q.length, 80)
})

test('研究接口复用配置、方法、会话和未知专题保护', () => {
  for (const key of ENV_KEYS) {
    if (originalEnvironment[key] === undefined) delete process.env[key]
    else process.env[key] = originalEnvironment[key]
  }
  delete process.env.HIDDEN_PAGE_PASSWORD
  delete process.env.HIDDEN_PAGE_SECRET
  const missingConfig = response()
  hiddenResearchHandler(request(), missingConfig)
  assert.equal(missingConfig.statusCode, 503)

  configureServer()
  const wrongMethod = response()
  hiddenResearchHandler(request({ method: 'POST', session: true }), wrongMethod)
  assert.equal(wrongMethod.statusCode, 405)
  assert.equal(wrongMethod.headers.Allow, 'GET')

  const unauthorized = response()
  hiddenResearchHandler(request(), unauthorized)
  assert.equal(unauthorized.statusCode, 401)

  const unknown = response()
  hiddenResearchHandler(request({ url: '/api/hidden-research?topic=unknown', session: true }), unknown)
  assert.equal(unknown.statusCode, 404)

  const valid = response()
  hiddenResearchHandler(request({ url: '/api/hidden-research?topic=industry-macro&q=%E5%AD%98%E5%82%A8', session: true }), valid)
  assert.equal(valid.statusCode, 200)
  assert.equal(valid.body.total, 2)
  assert.equal(valid.headers['Cache-Control'], 'no-store, max-age=0')
})

test('总内容接口只暴露专题元数据与真实计数，不回传整份文章索引', () => {
  configureServer()
  const res = response()
  hiddenContentHandler(request({ url: '/api/hidden-content', session: true }), res)
  assert.equal(res.statusCode, 200)
  const research = res.body.collections.find(collection => collection.id === 'research')
  assert.deepEqual(research.groups.map(group => [group.id, group.count]), [
    ['industry-macro', 6], ['company-business', 0], ['cross-asset', 0],
  ])
  assert.equal('articles' in research, false)
  assert.equal('researchArticles' in res.body, false)
})
