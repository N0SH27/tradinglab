// ── 站点信息 · 导航 · 首页目录 · 归档树 ────────
export const SITE = {
  name: 'trading-lab',
  nameZh: '交易实验室',
  author: 'HSN',
  motto: '计划交易，交易计划；应对变化，变化应对。',
  subtitle: '观察变化，而非预测未来。',
  description: [
    'HSN 的交易研究实验室，',
    '一部分是对产业与世界的长期观察，一部分是多年交易沉淀下来的系统、纪律与心法。',
    '所有内容都是活着的档案，而非一次性结论。',
  ],
  disclaimer:
    '本站全部内容为 HSN 的个人研究笔记与交易记录，不构成任何投资建议。研究的价值在于迭代，而非结论。',
  brandLine: '观察未来数年，而非预测明日涨跌。',
}

/* 首页叙事节拍：英文即幕次名（诺兰式结构编排，不落"第X幕"文字） */
export const ACTS = {
  now: { no: 'NOW', en: 'NOW', note: '现在正在发生什么' },
  why: { no: 'WHY', en: 'WHY', note: '我们如何阅读它' },
  system: { no: 'SYSTEM', en: 'SYSTEM', note: '它如何影响产业系统' },
  capital: { no: 'CAPITAL', en: 'CAPITAL', note: '资本正在如何反应' },
  next: { no: 'NEXT', en: 'NEXT', note: '下一阶段可能发生什么' },
}

/* 顶部导航（2026-08-22 分层：11 项平铺 → 6 项两组）
   体系 = 系统·四象·框架·无为（方法论与心法）；
   观察 = 命题·地图·周期（进行中的研究）。 */
export interface NavLink { path: string; label: string; en: string }
export type NavEntry = NavLink | { label: string; en: string; children: NavLink[] }

export const NAV: NavEntry[] = [
  { path: '/', label: '索引', en: 'INDEX' },
  { path: '/manifesto', label: '宣言', en: 'MANIFESTO' },
  {
    label: '体系', en: 'STRUCTURE',
    children: [
      { path: '/system', label: '系统', en: 'SYSTEM' },
      { path: '/dimensions', label: '四象', en: 'DIMENSIONS' },
      { path: '/framework', label: '框架', en: 'FRAMEWORK' },
      { path: '/wuwei', label: '无为', en: 'WU WEI' },
    ],
  },
  {
    label: '观察', en: 'OBSERVE',
    children: [
      { path: '/thesis', label: '命题', en: 'THESIS' },
      { path: '/map', label: '地图', en: 'MAP' },
      { path: '/cycle', label: '周期', en: 'CYCLE' },
    ],
  },
  { path: '/essays', label: '文集', en: 'ESSAYS' },
  { path: '/journal', label: '日志', en: 'JOURNAL' },
]
/* 首页目录（索引页十个入口） */
export const INDEX_ITEMS = [
  { path: '/manifesto', no: '01', zh: '宣言', en: 'MANIFESTO', desc: '我如何理解技术、资本、周期与人性——六条公理' },
  { path: '/system', no: '02', zh: '系统', en: 'SYSTEM', desc: '七层金字塔、市场状态机' },
  { path: '/thesis', no: '03', zh: '命题', en: 'THESIS', desc: '少数产业大命题，阴阳两面同时呈现' },
  { path: '/essays', no: '04', zh: '文集', en: 'ESSAYS', desc: '对行业、对交易、对世界的完整书写' },
  { path: '/map', no: '05', zh: '地图', en: 'MAP', desc: 'AI 算力产业链网络图，逐环节可点击的观察档案' },
  { path: '/cycle', no: '06', zh: '周期', en: 'CYCLE', desc: '七阶段、三层共振、题材的生命与四面权重' },
  { path: '/dimensions', no: '07', zh: '四象', en: 'DIMENSIONS', desc: '量价时空均有阴阳，四者相辅相生' },
  { path: '/wuwei', no: '08', zh: '无为', en: 'WU WEI', desc: '止损的艺术、情绪管理、生活即系统' },
  { path: '/framework', no: '09', zh: '框架', en: 'FRAMEWORK', desc: '信号分层、If-Then 预案、触发器库与好交易的标准' },
  { path: '/journal', no: '10', zh: '日志', en: 'JOURNAL', desc: '观点的每一次修正，都留下日期与原因' },
]

// ── 归档知识树 ────────────────────────────────
export const ARCHIVE_TREE = [
  { name: 'Manifesto', children: ['创造与交易', '计划与应变', '概率与确定性', '价格即共识', '风险优先', '道法自然'] },
  { name: 'System', children: ['七层金字塔', '市场状态机', '资金管理', '持续演进'] },
  { name: 'Essays', children: ['世界观', '市场观', '系统', '研究', '心法'] },
  { name: 'Thesis', children: ['国产算力', 'AI 应用', '机器人', '新能源', '光模块', '存储周期', '稀土', '创新药'] },
  { name: 'Cycle', children: ['七阶段', '题材生命周期', '三层共振', '四面权重'] },
  { name: 'Dimensions', children: ['量·阳', '价·阳', '时·阴', '空·阴', '逆时针曲线'] },
  { name: 'Wu Wei', children: ['止损的艺术', '情绪管理', '生活即系统'] },
  { name: 'Framework', children: ['信号分层', 'If-Then 预案', '触发器库', '好交易的标准'] },
  { name: 'Journal', children: ['修正记录', '错误清单', '认知迭代'] },
]
