// ── 框架 · Operating Architecture ─────────────
// Framework = How I Move From Reality To Action（V2-26 契约 · LOCKED）。
// Framework 是把 Research、Decision、Trading、Review 连接起来的操作架构——
// 本文件只是 Framework 页的静态文本源（静态框架层，非演化状态，同 C1 契约定性）：
// 不持有任何研究事实——信念 / 命题 / 证据的唯一事实源在各自 domain。
// 交易执行规则（盘面信号 / 触发器 / 预案 / 共振 / 好交易标准）已迁至 domains/system.ts。

export const FRAMEWORK_CHAIN = [
  { key: 'WORLD', zh: '世界', desc: '现实本身。它不负责被理解。' },
  { key: 'INFORMATION', zh: '信息', desc: '未筛选的资讯流。信息不是信号。' },
  { key: 'OBSERVATION', zh: '观察', desc: '人工选择正在发生、值得观察的变化——真、新、大。', href: '#/', hrefLabel: '当下' },
  { key: 'RESEARCH', zh: '研究循环', desc: '定位、框定矛盾、立题、对照现实、刻度化信念、入账修正。', href: '#/method', hrefLabel: '方法' },
  { key: 'BELIEF', zh: '信念', desc: '0–100 的诚实刻度。唯一更新入口是账本，不是感觉。', href: '#/journal', hrefLabel: '日志' },
  { key: 'DECISION', zh: '决策', desc: '「我认为是真的」≠「我决定行动」。信到什么程度、等什么条件、动不动。' },
  { key: 'ACTION / INACTION', zh: '行动 · 不行动', desc: '不行动是一等输出。空仓是持仓，等待是工作。', href: '#/wuwei', hrefLabel: '无为' },
  { key: 'REVIEW', zh: '复盘', desc: '执行是否正确、理解是否正确——两个问题，分开回答。' },
  { key: 'REVISION', zh: '修正', desc: '只有经过研究与判断，才允许修改信念与方法。然后，更好地观察。', href: '#/journal', hrefLabel: '修正记录' },
]

export const FRAMEWORK_LOOPS = [
  {
    name: '研究循环', en: 'RESEARCH LOOP v1.0', tempo: '慢回路 · 信念如何形成与修正',
    steps: ['OBSERVE 观察', 'CONTEXT 定位', 'FRAME 框定', 'THESIS 立题', 'TEST 对照', 'BELIEVE 信念', 'REVISE 修正', 'REFLECT 反思'],
    note: '它是框架内部一个完整的认知循环，不是地图上的一个步骤。',
    href: '#/method', hrefLabel: '方法页承载这个循环',
  },
  {
    name: '交易循环', en: 'TRADING LOOP', tempo: '快回路 · 授权之后如何执行',
    steps: ['DECISION 授权', 'TRIGGER 触发', 'ENTRY 入场', 'POSITION 持仓', 'MANAGEMENT 管理', 'EXIT 退出', 'REVIEW 复盘'],
    note: '系统是规则容器——循环穿过它，但循环不等于它。',
    href: '#/system', hrefLabel: '系统页承载这些规则',
  },
]

export const FRAMEWORK_CONSTRAINT = {
  name: '行为约束层', en: 'BEHAVIORAL CONSTRAINTS',
  desc: '无为不是任何循环里的一个步骤——它永远可以在任一步介入，回答同一个问题：是否需要行动？',
  href: '#/wuwei', hrefLabel: '无为',
}

export const FRAMEWORK_DECISION = {
  title: '决策：信念与行动之间',
  en: 'DECISION',
  lead: '「我认为某件事情是真的」 ≠ 「我决定因此采取行动」。',
  points: [
    '信念是刻度，行动是授权——中间隔着决策。高度相信不等于允许行动：估值、风险收益比、市场状态，都有一票。',
    'BELIEF = YES，ACTION = NO 是合法且常见的状态。',
    '认知侧的 If-Then 早已写进每个命题：证伪条件预先登记——IF 事实出现，THEN 重新检验命题。',
    '不行动是一等输出：系统是阳，不操作是阴。',
  ],
}

export const FRAMEWORK_INTERFACE = {
  title: '行动接口',
  en: 'THE ACTION INTERFACE',
  chain: ['DECISION 决策授权', 'TRIGGER 条件确认', 'SYSTEM 规则执行', 'TRADE 交易行为'],
  points: [
    'Trigger 是经决策确认、被交易系统消费的可执行条件——它是接口，不是系统。',
    '研究信号 ≠ 盘面信号：前者改变解释，后者服务执行。两个词，两层职责。',
    '触发条件必须事先写明：入场条件、失效条件、历史依据。事后拼凑的条件不是触发，是叙事。',
    '授权的反面同样重要：条件不满足时，系统负责禁止行动。',
  ],
}

export const FRAMEWORK_REVIEW = {
  title: '复盘与修正的边界',
  en: 'REVIEW → REVISION',
  reviews: [
    { name: '执行复盘', en: 'TRADING REVIEW', q: '我执行得对吗？', desc: '入场、仓位、风险、管理、退出——对照系统逐条核。属交易循环。' },
    { name: '认知复盘', en: 'COGNITIVE REVIEW', q: '我理解得对吗？', desc: '信号是否有效、命题是否成立、证据是否充分、概率是否要变。属研究循环。' },
  ],
  gate: '亏损不是修改框架的理由。交易结果的唯一合法路径：执行复盘 → 认知复盘 → 研究 → 判断 → 修正入账。',
}
