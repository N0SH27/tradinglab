import { hasServerConfig, hasValidSession, sendJson } from './_hidden-access.js'

export const RESEARCH_PAGE_SIZE = 15

export const RESEARCH_TOPICS = [
  {
    id: 'industry-macro',
    index: '02.01',
    title: '产业与宏观',
    english: 'INDUSTRY & MACRO',
    description: '产业周期、政策环境、宏观变量与关键传导路径。',
    summary: '不只保存结论，也保存结论依赖的证据、假设与失效条件。精选研究用于重新进入问题，完整索引用于持续查找与回看。',
  },
  {
    id: 'company-business',
    index: '02.02',
    title: '公司与商业模式',
    english: 'COMPANY & BUSINESS MODEL',
    description: '公司研究、商业模式、竞争优势与长期跟踪材料。',
    summary: '围绕公司如何创造、分配并守住价值建立档案，也观察技术如何重写组织、岗位与协作方式。',
  },
  {
    id: 'cross-asset',
    index: '02.03',
    title: '跨资产与专题',
    english: 'CROSS-ASSET & SPECIALS',
    description: '股票、商品与其他资产的交叉研究和专题长文。',
    summary: '把不同资产、时间尺度与研究方法放在同一条问题线上。真实内容完成归档前，这里保持空白。',
  },
]

export const RESEARCH_ARTICLES = [
  {
    id: 'report-7', topic: 'industry-macro', archiveId: 'RC-007',
    title: '中国 AI：更多增长，更少再通胀',
    summary: 'AI 的增长红利主要来自出口而非投资；就业与再通胀并未同步出现。',
    source: 'Barclays', date: '2026.10', version: '导读 v1.0', kind: 'report',
    tags: ['中国宏观', 'AI 产业', '汇率与利率'], href: '#/after-hours/report/report-7', image: '/hidden/research/report-7.svg', featuredOrder: 1,
  },
  {
    id: 'report-8', topic: 'company-business', archiveId: 'RC-008',
    title: 'Anthropic：AI 如何重构工作与就业',
    summary: '初级技术招聘占比降至 9% 的另一面，是人的注意力与判断力成为新瓶颈。',
    source: 'The Anthropic Institute', date: '2026.10', version: '导读 v1.0', kind: 'report',
    tags: ['AI 原生组织', '劳动与招聘', '组织协作'], href: '#/after-hours/report/report-8', image: '/hidden/research/report-8.svg', featuredOrder: 1,
  },
]

const KIND_LABELS = { report: '研究报告', essay: '深度文章' }
const SORTS = new Set(['newest', 'oldest', 'title'])

function text(value, maxLength) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : ''
}

export function getResearchTopic(topicId) {
  return RESEARCH_TOPICS.find(topic => topic.id === topicId)
}

export function queryResearch(parameters = {}) {
  const requestedTopic = text(parameters.topic, 60)
  const topic = getResearchTopic(requestedTopic) ?? RESEARCH_TOPICS[0]
  const q = text(parameters.q, 80).toLocaleLowerCase('zh-CN')
  const topicArticles = RESEARCH_ARTICLES.filter(article => article.topic === topic.id)
  const availableTags = new Set(topicArticles.flatMap(article => article.tags))
  const availableKinds = new Set(topicArticles.map(article => article.kind))
  const requestedTag = text(parameters.tag, 40)
  const requestedKind = text(parameters.kind, 20)
  const tag = availableTags.has(requestedTag) ? requestedTag : ''
  const kind = availableKinds.has(requestedKind) ? requestedKind : ''
  const sort = SORTS.has(parameters.sort) ? parameters.sort : 'newest'

  const filtered = topicArticles.filter(article => {
    if (tag && !article.tags.includes(tag)) return false
    if (kind && article.kind !== kind) return false
    if (!q) return true
    return [article.archiveId, article.title, article.summary, article.source, ...article.tags]
      .join(' ').toLocaleLowerCase('zh-CN').includes(q)
  })

  filtered.sort((left, right) => {
    if (sort === 'title') return left.title.localeCompare(right.title, 'zh-CN')
    const dateOrder = left.date.localeCompare(right.date) || left.archiveId.localeCompare(right.archiveId)
    return sort === 'oldest' ? dateOrder : -dateOrder
  })

  const pageCount = Math.ceil(filtered.length / RESEARCH_PAGE_SIZE)
  const parsedPage = Number.parseInt(String(parameters.page ?? '1'), 10)
  const safePage = Number.isFinite(parsedPage) ? Math.max(1, parsedPage) : 1
  const page = pageCount === 0 ? 1 : Math.min(safePage, pageCount)
  const articles = filtered.slice((page - 1) * RESEARCH_PAGE_SIZE, page * RESEARCH_PAGE_SIZE)
  const facets = {
    tags: [...availableTags].sort((left, right) => left.localeCompare(right, 'zh-CN')).map(id => ({
      id, count: topicArticles.filter(article => article.tags.includes(id)).length,
    })),
    kinds: [...availableKinds].map(id => ({
      id, label: KIND_LABELS[id] ?? id, count: topicArticles.filter(article => article.kind === id).length,
    })),
  }

  return {
    topic: { ...topic, count: topicArticles.length },
    articles,
    featured: [...topicArticles].sort((left, right) => left.featuredOrder - right.featuredOrder).slice(0, 3),
    total: filtered.length,
    page,
    pageSize: RESEARCH_PAGE_SIZE,
    pageCount,
    facets,
    query: { q: text(parameters.q, 80), tag, kind, sort },
  }
}

export default function handler(req, res) {
  if (!hasServerConfig()) {
    sendJson(res, 503, { error: 'server_not_configured' })
    return
  }
  if (req.method !== 'GET') {
    sendJson(res, 405, { error: 'method_not_allowed' }, { Allow: 'GET' })
    return
  }
  if (!hasValidSession(req)) {
    sendJson(res, 401, { error: 'unauthorized' })
    return
  }

  let url
  try {
    url = new URL(req.url ?? '/', 'http://localhost')
  } catch {
    sendJson(res, 400, { error: 'invalid_query' })
    return
  }
  const requestedTopic = url.searchParams.get('topic') ?? RESEARCH_TOPICS[0].id
  if (!getResearchTopic(requestedTopic)) {
    sendJson(res, 404, { error: 'topic_not_found' })
    return
  }
  sendJson(res, 200, queryResearch(Object.fromEntries(url.searchParams.entries())))
}
