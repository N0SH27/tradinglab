// ── 站点信息 · 导航 · 归档树 ──────────────────
export const SITE = {
  // Canonical Brand（V2-06-00 裁决 A）：全站唯一正式品牌名。
  // ⚠️ 与视觉 lockup 正式解耦——Header wordmark「trading·lab BY HSN」是
  // Founder Signature，由 Layout.tsx 的 HEADER_LOCKUP 字面量独立承担，不随本字段变化。
  name: 'TradingLabb',
  author: 'HSN',
  motto: '计划交易，交易计划；应对变化，变化应对。',
  // Retained: referenced by LOCKED POV-02 / Principles as a behavioral-proof anchor;
  // removal requires canonical amendment and is out of scope for Track B.
  subtitle: '观察变化，而非预测未来。',
  description: [
    'HSN 的交易研究实验室，',
    '一部分是对产业与世界的长期观察，一部分是多年交易沉淀下来的系统、纪律与心法。',
    '所有内容都是活着的档案，而非一次性结论。',
  ],
  disclaimer:
    '本站全部内容为 HSN 的个人研究笔记与交易记录，不构成任何投资建议。研究的价值在于迭代，而非结论。',
}

/* 顶部导航（V2-05 T-1，Option C：NOW/WORLD/THESIS/JOURNAL/WUWEI/HSN）
   机制不变（NavLink | 分组）。组内首项为该组主页面：
   WORLD=地图·周期·四象；THESIS=命题·方法·框架·系统；JOURNAL=日志·文集；HSN=宣言。
   （V2-26 T3：THESIS 组吸收 METHOD 页，方案 A 锁定——三页同属「认知—行动系统」）
   过渡态：NOW 暂链首页（独立 NOW 页待 C-04）；ABOUT 待 V2-07。 */
export interface NavLink { path: string; label: string; en: string }
export type NavEntry = NavLink | { label: string; en: string; children: NavLink[] }

export const NAV: NavEntry[] = [
  { path: '/', label: '当下', en: 'NOW' },
  {
    label: '世界', en: 'WORLD',
    children: [
      { path: '/map', label: '地图', en: 'MAP' },
      { path: '/cycle', label: '周期', en: 'CYCLE' },
      { path: '/dimensions', label: '四象', en: 'DIMENSIONS' },
    ],
  },
  {
    label: '命题', en: 'THESIS',
    children: [
      { path: '/thesis', label: '命题', en: 'THESIS' },
      { path: '/method', label: '方法', en: 'METHOD' },
      { path: '/framework', label: '框架', en: 'FRAMEWORK' },
      { path: '/system', label: '系统', en: 'SYSTEM' },
    ],
  },
  {
    label: '日志', en: 'JOURNAL',
    children: [
      { path: '/journal', label: '日志', en: 'JOURNAL' },
      { path: '/essays', label: '文集', en: 'ESSAYS' },
    ],
  },
  { path: '/wuwei', label: '无为', en: 'WUWEI' },
  {
    label: 'HSN', en: 'HSN',
    children: [
      { path: '/manifesto', label: '宣言', en: 'MANIFESTO' },
    ],
  },
]

// ── 归档知识树 ────────────────────────────────
export const ARCHIVE_TREE = [
  { name: 'Manifesto', children: ['创造与交易', '计划与应变', '概率与确定性', '价格即共识', '风险优先', '道法自然'] },
  { name: 'System', children: ['状态机', '盘面信号', '触发器', '资金管理', '执行复盘'] },
  { name: 'Essays', children: ['世界观', '市场观', '系统', '研究', '心法'] },
  { name: 'Thesis', children: ['国产算力', 'AI 应用', '机器人', '新能源', '光模块', '存储周期', '稀土', '创新药'] },
  { name: 'Map', children: ['AI 算力产业链', '景气 × 估值', '佩雷斯标尺'] },
  { name: 'Cycle', children: ['七阶段', '题材生命周期', '三层共振', '四面权重'] },
  { name: 'Dimensions', children: ['量·阳', '价·阳', '时·阴', '空·阴', '逆时针曲线'] },
  { name: 'Wuwei', children: ['止损的艺术', '情绪管理', '生活即系统'] },
  { name: 'Method', children: ['研究循环', '证据标准', '证伪纪律', '修正纪律'] },
  { name: 'Framework', children: ['操作地图', '双循环', '决策授权', '行动接口', '复盘回流'] },
  { name: 'Journal', children: ['修正记录', '错误清单', '认知迭代'] },
]
