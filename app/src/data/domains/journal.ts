// ── 日志 ─────────────────────────────────────
// Journal is the narrative record. Ledger is the factual record.
// Journal 记录我为什么这样想；Ledger（domains/ledger.ts）记录我改变了什么。
// V2-06-02（OD-2 授权）：previousConviction/currentConviction 已迁出至 Belief Ledger——
// 本文件不再持有 conviction 事实字段，仅经 thesisId 建立叙事关联；
// note 自由文本保留为 legacy display，禁止正则提取。
export interface JournalItem {
  type: 'up' | 'down' | 'risk' | 'new'
  target: string
  note: string
  thesisId?: string            // 结构化关联命题（#/thesis/:id）；conviction 事实见 domains/ledger.ts
}

export interface JournalEntry {
  date: string
  items: JournalItem[]
}

export const JOURNAL: JournalEntry[] = [
  {
    date: '2026.08.30',
    items: [
      { type: 'new', target: '周度研究', note: '登记三条深度研究：存储涨价遭遇成建制的买方抵抗（HBM 降配、BoM 占比 70%）；AI 硬件瓶颈迁移到设备交期与洁净室；长鑫进入全球第四大 DRAM 厂商行列。' },
      { type: 'up', target: '存储', note: '上调概率 65% → 68%。涨价的终结者不是低价，而是买方的配置降级——Rubin Ultra 从 12 层降配至 8 层，英伟达以存储极端定价为由下调毛利率指引。"上涨失效"从股价蔓延到产品配置。反证并存：降配提高良率，HBM 总供给反增。', thesisId: 'memory-cycle' },
      { type: 'new', target: '国产算力', note: '命题一证据强化但概率未动：英伟达 FY28 指引 +70% 且声明受供给约束、不计中国收入；亚洲封测资本开支同比 +80%，CoW 设备交期 12 个月。瓶颈迁移判断被验证——验证不是变化，不改概率。', thesisId: 'compute' },
      { type: 'new', target: '机器人', note: '更新一个观察：行业在蓄力喷发，但整体股价萧条，宛若黎明前的黑暗。与六月"交易拥挤"的记录正好构成一个完整回合——拥挤时降温，萧条时重新点亮注意力。', thesisId: 'robot' },
      { type: 'risk', target: '稀土', note: '登记一条反证：沃什删除前瞻指引并给出鹰派行动标准——四重底中的"降息预期"一腿受到挑战。单周言论不足以改判断，继续观察。', thesisId: 'rare-earth' },
    ],
  },
  {
    date: '2026.08.09',
    items: [
      { type: 'new', target: '命题库', note: '新增四个命题：光模块估值死线（60%，偏空）、存储周期背离（65%）、稀土四重底（68%）、创新药先遣图（62%）。命题页从四个扩展到八个——研究视野从产业成长扩展到周期与估值结构。' },
      { type: 'risk', target: '存储', note: '价格与股价开始背离——碳酸锂的前鉴摆在眼前：价格 30 万股价见顶，60 万股价不跟。周期股的顶部信号从来不是价格下跌，而是股价上涨失效。' },
    ],
  },
  {
    date: '2026.08.03',
    items: [
      { type: 'new', target: 'TradingLabb', note: '网站上线。把 Notion 里的交易知识库公开化：系统、四象、无为、框架、周期、命题。从私密笔记到公开档案——写下来，就要接受检验。—— HSN' },
    ],
  },
  {
    date: '2026.07.31',
    items: [
      { type: 'up', target: '国产算力', note: '上调概率 65% → 72%。北京智算项目推进速度快于预期。', thesisId: 'compute' },
      { type: 'risk', target: '液冷散热', note: '新增风险：竞争者密集入局，格局恶化快于预期。弱者道之用——拥挤的强信号不如冷清的弱信号。' },
      { type: 'new', target: 'TL 指标', note: '底部确认标准更新：连续 3 个交易日放量站上 MA5；7 个交易日内至少 1–2 天放巨量（系数 ×1.45）。' },
    ],
  },
  {
    date: '2026.07.29',
    items: [
      { type: 'new', target: '框架', note: '补全七层金字塔：周期(战略)→市场结构(战术)→变化&信号(触发)→形态量价(确认)→操作止损仓位(执行)→心态(护栏)→复盘认知(进化)→反哺周期。闭环完成。' },
      { type: 'risk', target: '认知', note: '记录一句提醒：只要交易者否认市场正在发生的事情，他就会经历很多痛苦。根据所见交易，而不是根据所希望的情况交易。' },
    ],
  },
  {
    date: '2026.07.28',
    items: [
      { type: 'new', target: '止损', note: '重写止损页。从"多少钱该砍"的技术问题，重写为"自我宽恕"的能力问题。核心一句：止损不是保护钱的，是保护判断力的。' },
    ],
  },
  {
    date: '2026.07.05',
    items: [
      { type: 'up', target: '新能源', note: '上调概率 57% → 63%。龙头经营性现金流连续两季为正，出清证据链闭合。否极泰来的早期形态。', thesisId: 'newenergy' },
    ],
  },
  {
    date: '2026.06.25',
    items: [
      { type: 'down', target: '机器人', note: '下调概率 55% → 51%。成交拥挤度创年内新高，估值透支速度超过产业兑现速度。盛极而衰的预警，不是结论。', thesisId: 'robot' },
    ],
  },
  {
    date: '2026.05.21',
    items: [
      { type: 'new', target: '生活与交易', note: '想明白一件事：生活是底层操作系统，交易只是运行其上的高风险程序。收益曲线只是人生结构的投影。此后，睡眠、降噪、极简，全部纳入交易风控。' },
    ],
  },
]
