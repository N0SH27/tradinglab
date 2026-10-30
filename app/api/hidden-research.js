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
    summary: '围绕公司如何创造、分配并守住价值建立档案。真实内容完成归档前，这里保持空白。',
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
    id: 'report-1', topic: 'industry-macro', archiveId: 'RC-001',
    title: '中国 AI 算力基础设施产业链研究',
    summary: '最紧的环节从芯片，搬到了封装设备与厂房。',
    source: 'TradingLabb', date: '2026.08', version: 'v1.1.2', kind: 'report',
    tags: ['AI 算力'], href: '#/research/report-1', image: '/hidden/research/report-1.svg', featuredOrder: 2,
  },
  {
    id: 'report-2', topic: 'industry-macro', archiveId: 'RC-002',
    title: '存储周期：价格上涨失效的周期解剖',
    summary: 'DDR4 每月涨约两成，Q4 合约价再涨五成——但股价已经不跟了。',
    source: 'TradingLabb', date: '2026.08', version: 'v1.1.2', kind: 'report',
    tags: ['存储周期'], href: '#/research/report-2', image: '/hidden/research/report-2.svg', featuredOrder: 1,
  },
  {
    id: 'report-3', topic: 'industry-macro', archiveId: 'RC-003',
    title: '电力约束：从判断到可跟踪结构',
    summary: '当所有人盯着芯片，电力指标正成为智算中心选址的第一约束。',
    source: 'TradingLabb', date: '2026.08', version: 'v1.1.2', kind: 'report',
    tags: ['电力约束', 'AI 算力'], href: '#/research/report-3', image: '/hidden/research/report-3.svg', featuredOrder: 3,
  },
  {
    id: 'report-4', topic: 'industry-macro', archiveId: 'RC-004',
    title: '商保支付端：从政策推演到目录落地',
    summary: '通道建好了——水还没有来。',
    source: 'TradingLabb', date: '2026.09', version: 'v0.2', kind: 'report',
    tags: ['医药政策'], href: '#/research/report-4', image: '/hidden/research/report-4.svg', featuredOrder: 4,
  },
  {
    id: 'report-5', topic: 'industry-macro', archiveId: 'RC-005',
    title: '存储：紧缺与斜率的分离',
    summary: '利润率历史极值的同一周，涨价共识从 +200% 腰斩到 +100%。',
    source: 'TradingLabb', date: '2026.09', version: 'v1.0.0', kind: 'report',
    tags: ['存储周期'], href: '#/research/report-5', image: '/hidden/research/report-5.svg', featuredOrder: 5,
  },
  {
    id: 'report-6', topic: 'industry-macro', archiveId: 'RC-006',
    title: '算力租赁的单位经济学',
    summary: '13.1 个月回本——利率上升，为什么还没有杀死 AI 基建。',
    source: 'TradingLabb', date: '2026.09', version: 'v1.0.0', kind: 'report',
    tags: ['AI 算力'], href: '#/research/report-6', image: '/hidden/research/report-6.svg', featuredOrder: 6,
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
