import { hasServerConfig, hasValidSession, sendJson } from './_hidden-access.js'

/* 示例知识只从受保护接口发出。正式内容接入数据库前，不要复制进公开前端包。 */
const PRIVATE_CONTENT = {
  kicker: 'TRADINGLABB / PRIVATE STUDY',
  title: ['AFTER', 'HOURS'],
  intro: '把观察整理成规则，把规则交给案例验证。这里是私人交易体系、课程与复盘档案的入口。',
  domains: [
    { id: 'foundation', index: '01', name: '起点与认知', english: 'FOUNDATION', description: '市场、风险与自我认知' },
    { id: 'language', index: '02', name: '市场语言', english: 'MARKET LANGUAGE', description: '形态、价格行为与趋势' },
    { id: 'tools', index: '03', name: '工具与测量', english: 'TOOLS & MEASUREMENT', description: '指标、量价与波动工具' },
    { id: 'structure', index: '04', name: '结构与资金', english: 'STRUCTURE & LIQUIDITY', description: '结构、流动性与资金行为' },
    { id: 'execution', index: '05', name: '执行系统', english: 'EXECUTION', description: '交易计划、纪律与执行' },
    { id: 'review', index: '06', name: '复盘与验证', english: 'REVIEW & EVIDENCE', description: '案例、反例与规则修订' },
  ],
  currentPath: {
    title: '从价格行为到交易系统',
    progress: '04 / 08',
    current: '如何定义一笔交易的失效条件？',
    targetSlug: 'price-action-failure',
    steps: [
      { label: '市场结构', state: 'done' },
      { label: '入场确认', state: 'done' },
      { label: '失效条件', state: 'current' },
      { label: '复盘验证', state: 'next' },
    ],
  },
  notes: [
    {
      slug: 'liquidity-sweep', index: '024', title: '流动性清扫之后，什么才构成有效反转？', tag: 'SMC / LIQUIDITY', type: 'concept', domain: 'structure', topics: ['SMC', '流动性', '市场结构'], status: 'verified',
      src: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=900&q=80&auto=format&fit=max&sat=-100',
      summary: '清扫本身不是入场理由。只有价格重新收回关键位置，并出现可验证的结构变化，反转才从猜测变成假设。',
      readingMinutes: 8, updatedAt: '2026-10-29', reviewCount: 9, featured: true, featuredOrder: 1,
      sections: [
        { heading: '一句话定义', text: '流动性清扫是价格短暂越过明显高点或低点、触发止损与追单后，又重新回到原区间的过程。它描述的是交易行为，不自动等于方向信号。' },
        { heading: '核心规则', items: ['先标记被市场共同看见的流动性位置，再观察越过后的反应。', '越过关键位置后，必须观察价格能否重新收回，而不是仅记录影线。', '反转假设需要独立结构确认，不能用“已经扫过”替代入场条件。'] },
        { heading: '适用条件', text: '适用于关键区间边界、前高前低和盘整极值附近。趋势加速阶段或重要消息驱动的单边行情中，同一形态可能只是延续过程。' },
        { heading: '失效条件', items: ['收回后再次快速失守关键位置。', '没有形成可识别的结构变化，只有单次快速插针。', '入场所依据的周期与判断结构使用的周期相互冲突。'] },
        { heading: '执行检查清单', items: ['流动性位置是否清晰可见？', '收回是否发生在计划周期内？', '结构确认与止损位置是否同时明确？', '如果下一根K线反向运行，原假设是否仍然成立？'] },
      ],
      relatedSlugs: ['structure-break-retest', 'price-action-failure', 'counterexample-chasing'],
    },
    {
      slug: 'structure-break-retest', index: '031', title: '结构破坏与回测：把确认拆成两个动作', tag: 'ICT / STRUCTURE', type: 'setup', domain: 'structure', topics: ['ICT', '结构破坏', '回测'], status: 'verified',
      src: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=900&q=80&auto=format&fit=max&sat=-100',
      summary: '结构破坏负责改变假设，回测负责提供执行位置。把两个动作混在一起，会让入场既缺乏确认，也缺乏清晰失效点。',
      readingMinutes: 12, updatedAt: '2026-10-27', reviewCount: 6, featured: true, featuredOrder: 2,
      sections: [
        { heading: '模型前提', text: '先存在一段可描述的结构，再讨论破坏。没有明确摆动高低点时，任何“破坏”都只是主观画线。' },
        { heading: '触发与确认', items: ['价格有效越过用于定义原结构的摆动点。', '突破后没有立即回到原结构内部。', '回测发生在预先标记的区域，而非临时追逐价格。'] },
        { heading: '入场与失效', text: '入场必须对应具体回测反应；失效放在使新结构假设不再成立的位置，而不是机械使用固定点数。' },
        { heading: '反例与常见误用', items: ['把每一次小幅突破都称为结构破坏。', '在回测尚未发生时提前假设一定成交并反转。', '忽略更高周期方向，只选择符合预期的小周期结构。'] },
      ],
      relatedSlugs: ['liquidity-sweep', 'trend-is-not-a-line', 'pre-trade-checklist'],
    },
    {
      slug: 'trend-is-not-a-line', index: '018', title: '趋势不是一条线，而是一组连续的条件', tag: 'PRICE ACTION / TREND', type: 'rule', domain: 'language', topics: ['趋势', '价格行为', '多周期'], status: 'verified',
      src: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=900&q=80&auto=format&fit=max&sat=-100',
      summary: '趋势线只是观察工具。真正需要记录的是高点与低点如何演进、回撤以何种方式发生，以及原条件何时不再成立。',
      readingMinutes: 7, updatedAt: '2026-10-24', reviewCount: 5, featured: true, featuredOrder: 3,
      sections: [
        { heading: '核心判断', text: '趋势是一组随时间更新的条件，不是屏幕上固定不变的一条斜线。条件包括结构方向、回撤深度、推进效率和关键位置反应。' },
        { heading: '观察顺序', items: ['先确定观察周期和最近的有效摆动点。', '比较推进与回撤，而不是只数阳线和阴线。', '记录原趋势条件被削弱与被否定的不同位置。'] },
        { heading: '常见误用', text: '不断重画趋势线以迎合最新价格，会让规则失去可证伪性。画线变化时，应同时记录是哪一项结构条件发生了变化。' },
        { heading: '关联执行', text: '趋势判断只决定允许寻找哪类机会，不直接替代入场、风险和仓位规则。' },
      ],
      relatedSlugs: ['price-action-failure', 'structure-break-retest', 'atr-risk-measurement'],
    },
    {
      slug: 'atr-risk-measurement', index: '042', title: 'ATR 测量的是波动，不是方向', tag: 'ATR / VOLATILITY', type: 'indicator', domain: 'tools', topics: ['ATR', '波动率', '风险测量'], status: 'verified',
      src: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=900&q=80&auto=format&fit=max&sat=-100',
      summary: 'ATR 可以帮助统一不同波动环境下的止损与仓位讨论，但它不提供多空方向，也不替代结构失效点。',
      readingMinutes: 6, updatedAt: '2026-10-22', reviewCount: 11, featured: true, featuredOrder: 4,
      sections: [
        { heading: '指标边界', text: 'ATR 是真实波幅的平滑结果，用于描述一段时间内的价格波动程度。数值上升不等于上涨，数值下降也不等于下跌。' },
        { heading: '参数与使用', items: ['先固定周期与数据源，再比较不同品种的波动。', '参数变化会改变平滑程度，应在同类样本中保持一致。', 'ATR 倍数是风险换算工具，不是天然最优止损距离。'] },
        { heading: '与结构配合', text: '先用结构确定失效位置，再用 ATR 检查该距离是否处于当前品种的合理波动范围内，并据此调整仓位或放弃交易。' },
        { heading: '常见误用', items: ['把 ATR 上升直接理解为趋势增强。', '在不同周期之间直接比较原始数值。', '只调整止损倍数，不同步重新计算仓位。'] },
      ],
      relatedSlugs: ['pre-trade-checklist', 'risk-before-entry', 'trend-is-not-a-line'],
    },
    {
      slug: 'pre-trade-checklist', index: '057', title: '交易前检查清单：把临场决定提前写完', tag: 'EXECUTION / CHECKLIST', type: 'rule', domain: 'execution', topics: ['交易系统', '检查清单', '风险'], status: 'verified',
      src: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=900&q=80&auto=format&fit=max&sat=-100',
      summary: '清单的目标不是让每笔交易看起来都一样，而是确保任何临场决定都没有跳过前提、失效与风险三个问题。',
      readingMinutes: 5, updatedAt: '2026-10-29', reviewCount: 14, featured: true, featuredOrder: 5,
      sections: [
        { heading: '前提确认', items: ['这笔交易属于哪一个已记录的模型？', '当前市场条件是否符合模型适用环境？', '是否因为刚错过一段行情而降低标准？'] },
        { heading: '失效与风险', items: ['哪一个价格变化能够证明原假设失效？', '按失效距离计算后的仓位是否处于限制内？', '止损之后是否仍需要避免立即反向追单？'] },
        { heading: '执行确认', items: ['入场触发已经发生，而不是预计会发生。', '订单类型、价格和数量已复核。', '计划写明之后，不因短期波动临时扩大风险。'] },
        { heading: '禁止交易条件', text: '无法命名模型、无法指出失效位置、无法接受计划亏损，或明显处于情绪化追单状态时，不执行交易。' },
      ],
      relatedSlugs: ['atr-risk-measurement', 'counterexample-chasing', 'risk-before-entry'],
    },
    {
      slug: 'counterexample-chasing', index: '063', title: '反例：一次看似正确的追单，为什么仍然不合格？', tag: 'REVIEW / COUNTEREXAMPLE', type: 'case', domain: 'review', topics: ['反例', '追单', '执行复盘'], status: 'verified',
      src: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=900&q=80&auto=format&fit=max&sat=-100',
      summary: '结果盈利不能自动证明过程正确。复盘要把“这次赚了”与“这笔交易符合系统”分开评价。',
      readingMinutes: 10, updatedAt: '2026-10-26', reviewCount: 8, featured: true, featuredOrder: 6,
      sections: [
        { heading: '案例背景', text: '价格快速突破后出现追单，随后行情延续并产生浮盈。但入场前没有写下模型名称，失效位置也是在持仓后才补充。' },
        { heading: '过程问题', items: ['入场依据是害怕错过，而不是预先定义的触发。', '仓位先于止损距离确定，风险无法复核。', '盈利结果掩盖了模型外执行，强化了不可重复行为。'] },
        { heading: '有效复盘', text: '将结果评价与过程评价分开：结果可以记录为盈利，过程仍标记为不合格。只有后者才能推动规则修订。' },
        { heading: '规则修订', items: ['没有完成交易前清单，不允许提交订单。', '错过计划入场后，只等待下一次完整模型，不追逐已离开的价格。', '复盘中单独统计模型外交易的长期结果。'] },
      ],
      relatedSlugs: ['pre-trade-checklist', 'liquidity-sweep', 'price-action-failure'],
    },
    {
      slug: 'risk-before-entry', index: '009', title: '先定义能失去什么，再讨论可能得到什么', tag: 'FOUNDATION / RISK', type: 'concept', domain: 'foundation', topics: ['风险认知', '仓位', '交易基础'], status: 'verified',
      src: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=900&q=80&auto=format&fit=max&sat=-100',
      summary: '风险不是交易完成后的统计结果，而是入场前就必须被明确接受和限制的条件。',
      readingMinutes: 6, updatedAt: '2026-10-18', reviewCount: 10, featured: false, featuredOrder: 99,
      sections: [
        { heading: '一句话定义', text: '单笔风险是原假设被证明失效时，账户愿意并且能够承受的损失上限。它应在下单前被换算成具体仓位。' },
        { heading: '核心规则', items: ['先确定失效位置，再计算止损距离。', '先确定允许风险，再反推仓位。', '不因为胜率感觉较高而临时突破风险上限。'] },
        { heading: '常见误用', text: '先决定想买多少，再为了适应仓位把止损放得更近，会让技术失效点服从于仓位冲动。' },
      ],
      relatedSlugs: ['atr-risk-measurement', 'pre-trade-checklist'],
    },
    {
      slug: 'price-action-failure', index: '021', title: '价格行为交易为什么需要预先写出失效条件？', tag: 'PRICE ACTION / INVALIDATION', type: 'lesson', domain: 'language', topics: ['价格行为', '失效条件', '课程'], status: 'reviewing',
      src: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=900&q=80&auto=format&fit=max&sat=-100',
      summary: '失效条件不是一句“看错就止损”，而是一个能够被价格触发的具体观察：哪项原始证据不再成立。',
      readingMinutes: 9, updatedAt: '2026-10-28', reviewCount: 7, featured: false, featuredOrder: 99,
      sections: [
        { heading: '学习目标', text: '完成本课后，应能把一个价格行为判断拆成原始证据、确认条件和失效条件，并指出三者的区别。' },
        { heading: '从证据到条件', items: ['原始证据：当前看见了什么，不加入未来预测。', '确认条件：什么发生后，交易假设才被允许执行。', '失效条件：什么发生后，即使尚未触及止损，也不应继续沿用原判断。'] },
        { heading: '练习', text: '选择一段历史行情，只使用当时已经出现的信息，分别写下三句话。随后检查失效条件是否具体、可观察、不可随意移动。' },
        { heading: '常见误区', text: '把固定金额止损当成全部失效条件，会忽略结构已经变化但价格尚未触及止损的情况；把失效条件写得过宽，则会让任何行情都能被解释。' },
      ],
      relatedSlugs: ['liquidity-sweep', 'trend-is-not-a-line', 'counterexample-chasing'],
    },
  ],
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
  sendJson(res, 200, PRIVATE_CONTENT)
}
