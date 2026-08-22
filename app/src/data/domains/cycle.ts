// ── 周期 ─────────────────────────────────────
export const CYCLE_STAGES = ['萌芽', '成长', '狂热', '分化', '泡沫', '出清', '重构'] as const

export const CYCLE_INDUSTRIES: { name: string; stage: (typeof CYCLE_STAGES)[number]; note: string }[] = [
  { name: 'AI 应用', stage: '成长', note: '商业模式验证期，收入开始接棒叙事' },
  { name: '国产算力', stage: '成长', note: '渗透率陡峭段，政策与需求共振' },
  { name: '机器人', stage: '萌芽', note: '供应链先行，终端需求未证' },
  { name: '半导体设备', stage: '分化', note: '先进制程向阳，成熟制程向阴' },
  { name: '新能源', stage: '出清', note: '产能退出的尾声，现金流先于利润见底' },
  { name: '军工', stage: '重构', note: '订单节奏重置，新一轮景气酝酿' },
  { name: '医疗科技', stage: '萌芽', note: 'AI 制药与脑机接口的早期信号' },
]

export const CYCLE_NOTE =
  '周期不是看多看空的投票，而是阴阳消长的位置判断。任何行业都在萌芽、成长、狂热、分化、泡沫、出清、重构之间循环。盛极而衰，否极泰来——重要的不是预测拐点，而是知道自己站在圆环的哪一段。'

// 周期三层共振
export const CYCLE_RESONANCE = [
  { level: '大盘周期', role: '战略', question: '决定要不要重仓' },
  { level: '板块周期', role: '战术', question: '决定打哪个赛道' },
  { level: '个股周期', role: '执行', question: '决定具体哪一只' },
]

// 题材生命周期
export const THEME_LIFECYCLE = [
  { stage: '启动', detail: '冷启动：零星涨停逐步发酵，通常 3–7 天，观察连板梯队的形成。热启动：启动即高潮，首日批量涨停，次日通常大幅分化，存活率约一到两成。' },
  { stage: '高潮', detail: '板块大规模爆发，涨停家数超过 20 家。此时要做的不是兴奋，而是警惕次日分化，做好去弱留强的准备。' },
  { stage: '分化', detail: '良性分化：涨停家数缩减一半，龙头继续封板。恶性分化：缩减八成以上。关键指标只有一个——龙头是否继续封板。汰弱留强，放弃后排跟风。' },
  { stage: '分歧', detail: '龙头断板，阶段性高点。三种走向：反包（三日内收复失地，走二波）、横盘（高位震荡，板块反复活跃）、退潮（龙头 A 杀，周期结束）。' },
  { stage: '退潮', detail: '预警信号是龙头 A 杀——跌破关键位置或连续跌停。退潮期唯一的操作是规避风险，等待下一次阴阳转换。' },
]

export const THEME_LEVELS = [
  { level: '顶层设计', desc: '政治局会议、中财委会议等国家级战略。力度与持续性最大。' },
  { level: '宏观政策', desc: '货币政策与财政政策：降准降息、减税降费。股市是货币政策的晴雨表。' },
  { level: '产业政策', desc: '各部委发布的行业政策。判断级别（国务院＞部委）与力度，是题材理解力的核心。' },
]

// 四面权重（按市场状态）
export const FACE_WEIGHTS = {
  faces: ['基本面', '情绪面', '资金面', '技术面'],
  rows: [
    { state: '趋势市', weights: [30, 10, 20, 40] },
    { state: '主题市', weights: [10, 40, 30, 20] },
    { state: '震荡市', weights: [20, 20, 30, 30] },
    { state: '熊市反弹', weights: [5, 50, 25, 20] },
  ],
}
