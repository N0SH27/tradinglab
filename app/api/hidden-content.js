import { hasServerConfig, hasValidSession, sendJson } from './_hidden-access.js'

/* 示例知识只从受保护接口发出。正式内容接入数据库前，不要复制进公开前端包。 */
const PRIVATE_CONTENT = {
  kicker: 'TRADINGLABB / PRIVATE STUDY',
  title: ['AFTER', 'HOURS'],
  intro: '把观察整理成规则，把规则交给案例验证。这里是私人交易体系、课程与复盘档案的入口。',
  collections: [
    {
      id: 'library', index: '01', title: '交易知识 Library', shortTitle: '交易知识 Library', english: 'KNOWLEDGE LIBRARY',
      summary: '交易体系、实操课程与复盘档案的统一工作台，按主题、类型与状态持续整理。',
      src: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=900&q=80&auto=format&fit=max&sat=-100',
      format: 'SYSTEM / COURSE / REVIEW', groups: [],
      editorial: '从轮播进入完整三栏资料库，继续整理、检索与回看交易知识。',
    },
    {
      id: 'research', index: '02', title: '高价值研报与文章', shortTitle: '研报与文章', english: 'RESEARCH & ESSAYS',
      summary: '沉淀值得反复阅读的研究，把结论还原为证据、假设与可以持续追踪的问题。',
      src: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=900&q=80&auto=format&fit=max&sat=-100',
      format: 'RESEARCH / ESSAY / SPECIAL',
      groups: [
        { title: '产业与宏观', description: '产业周期、政策环境、宏观变量与关键传导路径。' },
        { title: '公司与商业模式', description: '公司研究、商业模式、竞争优势与长期跟踪材料。' },
        { title: '跨资产与专题', description: '股票、商品与其他资产的交叉研究和专题长文。' },
      ],
      editorial: '后续按来源、主题与阅读状态归档，保留原始链接、核心证据和个人批注。',
    },
    {
      id: 'media', index: '03', title: '书籍、视频与影视剧', shortTitle: '书籍与影像', english: 'BOOKS & SCREEN',
      summary: '从书籍、纪录片、课程视频与影视作品中提取可讨论、可验证的商业与交易认知。',
      src: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=900&q=80&auto=format&fit=max&sat=-100',
      format: 'BOOK / VIDEO / FILM',
      groups: [
        { title: '书籍与长篇阅读', description: '投资、商业、心理与历史书籍的阅读笔记和章节索引。', src: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=900&q=80&auto=format&fit=max&sat=-100' },
        { title: '纪录片与视频', description: '纪录片、课程与长视频的主题标记和重点片段。', src: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=900&q=80&auto=format&fit=max&sat=-100' },
        { title: '影视剧与商业案例', description: '从人物决策与情节中拆解商业案例，区分戏剧表达与现实。', src: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=900&q=80&auto=format&fit=max&sat=-100' },
      ],
      editorial: '后续按作品建立条目，将书摘、时间码、个人评论与相关知识笔记关联起来。',
    },
    {
      id: 'tools', index: '04', title: '实用工具', shortTitle: '实用工具', english: 'PRACTICAL TOOLS',
      summary: '集中管理研究、数据测量与交易执行工具，记录用途、使用边界和实际工作流。',
      src: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=900&q=80&auto=format&fit=max&sat=-100',
      format: 'RESEARCH / DATA / EXECUTION',
      groups: [
        { title: '研究与信息工具', description: '公告、研报、新闻与资料检索工具及其使用说明。' },
        { title: '数据与测量工具', description: '行情、指标、统计与量化测量工具的入口和口径记录。' },
        { title: '复盘与执行工具', description: '交易计划、检查清单、截图归档与复盘工作流。' },
      ],
      editorial: '后续为每个工具补充用途、访问方式、数据口径与适用场景，不只收藏链接。',
    },
    {
      id: 'dashboards', index: '05', title: '数据看板', shortTitle: '数据看板', english: 'DATA DASHBOARDS',
      summary: '将分散的数据观察组织成固定视图，保留指标定义、更新时间与解释边界。',
      src: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=900&q=80&auto=format&fit=max&sat=-100',
      format: 'MACRO / INDUSTRY / PORTFOLIO',
      groups: [
        { title: '宏观与流动性', description: '利率、汇率、信用与流动性条件的集中观察。' },
        { title: '产业与供需', description: '产业价格、库存、产能和供需变化的持续追踪。' },
        { title: '市场与组合', description: '市场宽度、资产表现、持仓暴露与组合风险视图。' },
      ],
      editorial: '后续逐个接入真实看板，并标明数据来源、更新频率和指标口径。',
    },
    {
      id: 'conversations', index: '06', title: '财经对话与现场实录', shortTitle: '播客与访谈', english: 'CONVERSATIONS & MEETINGS',
      summary: '保存财经播客、线下沙龙、大佬访谈与年度股东大会实录，留住观点出现的完整语境。',
      src: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=900&q=80&auto=format&fit=max&sat=-100',
      format: 'PODCAST / INTERVIEW / MEETING',
      groups: [
        { title: '财经播客与线下沙龙', description: '节目、对谈与沙龙的主题索引、重点片段和听后笔记。' },
        { title: '大佬访谈', description: '成熟从业者与投资者访谈中的判断依据和经验边界。' },
        { title: '年度股东大会实录', description: '管理层陈述、问答原文与后续年度之间的对照记录。' },
      ],
      editorial: '后续按人物、机构与日期整理，区分原始实录、观点摘录和个人解读。',
    },
    {
      id: 'investors', index: '07', title: '投资者框架与持仓思路', shortTitle: '投资者框架', english: 'INVESTOR PLAYBOOKS',
      summary: '研究成熟投资者如何形成判断、搭建体系与管理持仓，而不是只复制一个结论或代码。',
      src: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=900&q=80&auto=format&fit=max&sat=-100',
      format: 'FRAMEWORK / SYSTEM / POSITION',
      groups: [
        { title: '思考框架', description: '问题定义、决策原则、能力圈与常见认知偏差。', src: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=900&q=80&auto=format&fit=max&sat=-100' },
        { title: '投资体系', description: '研究流程、标的选择、买卖条件与风险约束的整体结构。', src: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=900&q=80&auto=format&fit=max&sat=-100' },
        { title: '持仓思路与复盘', description: '公开持仓背后的假设、变化过程与事后再验证。', src: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=900&q=80&auto=format&fit=max&sat=-100' },
      ],
      editorial: '后续按投资者建立长期档案，区分公开事实、个人归纳与不同周期的观点变化。',
    },
  ],
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
        { heading: '定义与识别', text: '流动性清扫描述订单被集中触发后的价格反应，不自动等于方向信号。', items: ['先标记前高、前低、盘整极值等被市场共同看见的位置。', '区分短暂越过与有效站稳：影线只是线索，收回过程才是证据。', '记录清扫发生的时间、周期和背景，避免脱离环境单独命名形态。'] },
        { heading: '核心规则', items: ['清扫之后必须观察价格能否重新收回关键位置，而不是看到插针就入场。', '反转假设需要独立的结构确认，不能用“已经扫过”替代入场条件。', '确认、入场与失效必须来自同一套周期逻辑，不能事后拼接不同周期。'] },
        { heading: '确认顺序', items: ['第一步：价格越过预定流动性位置，并触发明显的止损或追单反应。', '第二步：价格重新回到原区间，且收回不是下一根K线立即吞没的噪声。', '第三步：原弱势结构被破坏，回踩能够守住重新获得的位置。'] },
        { heading: '适用与失效', items: ['区间边界和关键前高前低附近更有效，趋势加速中同一形态可能只是延续。', '收回后再次快速失守关键位置，说明买方或卖方并未真正取得控制。', '重要消息驱动的单边行情中，若没有结构变化，只保留观察而不执行。'] },
        { heading: '执行检查清单', items: ['流动性位置、计划周期和预期收回区域是否在入场前已经写明？', '结构确认与止损位置是否同时明确，仓位是否按失效距离反推？', '若下一根K线反向运行，原假设是否仍成立；若不成立，是否立即退出？'] },
      ],
      relatedSlugs: ['structure-break-retest', 'price-action-failure', 'counterexample-chasing'],
    },
    {
      slug: 'structure-break-retest', index: '031', title: '结构破坏与回测：把确认拆成两个动作', tag: 'ICT / STRUCTURE', type: 'setup', domain: 'structure', topics: ['ICT', '结构破坏', '回测'], status: 'verified',
      src: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=900&q=80&auto=format&fit=max&sat=-100',
      summary: '结构破坏负责改变假设，回测负责提供执行位置。把两个动作混在一起，会让入场既缺乏确认，也缺乏清晰失效点。',
      readingMinutes: 12, updatedAt: '2026-10-27', reviewCount: 6, featured: true, featuredOrder: 2,
      sections: [
        { heading: '模型前提', text: '先存在可描述的结构，再讨论破坏；破坏改变假设，回测提供执行位置。', items: ['标出形成最近一段趋势的摆动高点与低点，不使用事后才知道的极值。', '明确原结构允许价格走到哪里，以及哪个摆动点承担方向定义。', '记录更高周期背景，避免把逆着主结构的小波动误判为新趋势。'] },
        { heading: '破坏确认', items: ['价格有效越过承担原方向定义的摆动点，而不只是触及任意局部极值。', '突破后没有立即回到原结构内部，收盘和后续跟随共同支持结构变化。', '突破时的推进质量可以接受，若只有长影线则降级为流动性事件观察。'] },
        { heading: '回测要求', items: ['回测发生在突破前已经标记的区域，不随价格移动临时改写入场区。', '观察回测时的速度、成交量和K线反应，确认原压力或支撑发生角色转换。', '没有回测就承认错过，不因害怕踏空而把任何停留都当作入场机会。'] },
        { heading: '入场与失效', items: ['入场必须对应具体回测反应，并写明继续成立所需的最低价格行为。', '失效放在使新结构假设不再成立的位置，而不是机械使用固定点数。', '按入场到失效的真实距离反推仓位，距离过大时减少仓位或放弃交易。'] },
        { heading: '反例与复盘', items: ['不要把每一次小幅突破都称为结构破坏，必须能指出被破坏的具体摆动点。', '不要只保留成功回测截图，同时记录直接延续、假突破与二次回测样本。', '复盘分别评价结构判断、回测质量和执行纪律，避免用最终盈亏覆盖过程。'] },
      ],
      relatedSlugs: ['liquidity-sweep', 'trend-is-not-a-line', 'pre-trade-checklist'],
    },
    {
      slug: 'trend-is-not-a-line', index: '018', title: '趋势不是一条线，而是一组连续的条件', tag: 'PRICE ACTION / TREND', type: 'rule', domain: 'language', topics: ['趋势', '价格行为', '多周期'], status: 'verified',
      src: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=900&q=80&auto=format&fit=max&sat=-100',
      summary: '趋势线只是观察工具。真正需要记录的是高点与低点如何演进、回撤以何种方式发生，以及原条件何时不再成立。',
      readingMinutes: 7, updatedAt: '2026-10-24', reviewCount: 5, featured: true, featuredOrder: 3,
      sections: [
        { heading: '核心判断', text: '趋势是一组随时间更新的条件，不是屏幕上固定不变的一条斜线。', items: ['结构方向：有效高点与低点是否按同一方向持续演进。', '推进效率：价格是否用更少时间、更明确实体走出有效距离。', '位置反应：回撤到关键区域后，原方向力量是否仍然作出回应。'] },
        { heading: '观察顺序', items: ['先固定观察周期和最近有效摆动点，再评价趋势，避免周期不断变化。', '比较推进与回撤的深度、速度和持续时间，而不是只数阳线和阴线。', '把趋势条件被削弱与被完全否定分开记录，给降仓和退出留下不同层级。'] },
        { heading: '趋势转弱', items: ['推进距离连续缩短，且同样的推动需要更长时间，说明效率正在下降。', '回撤开始穿越前次关键摆动点，原有节奏不再被守住。', '关键位置反应由快速收回变成横盘滞留，需等待新的确认而非坚持原判断。'] },
        { heading: '常见误用', items: ['不断重画趋势线迎合最新价格，会让规则失去可证伪性。', '把更高周期趋势直接当成低周期入场理由，会忽略执行位置的失效条件。', '将正常回撤等同反转，或把每次创新高都等同趋势加强，都是单点判断。'] },
        { heading: '关联执行', items: ['趋势判断只决定允许寻找哪类机会，不直接替代入场、风险和仓位规则。', '条件转弱时先降低预期和暴露，条件失效时才执行退出，不混淆两种动作。', '每次画线变化都同步记录结构条件变化，保证复盘能还原当时依据。'] },
      ],
      relatedSlugs: ['price-action-failure', 'structure-break-retest', 'atr-risk-measurement'],
    },
    {
      slug: 'atr-risk-measurement', index: '042', title: 'ATR 测量的是波动，不是方向', tag: 'ATR / VOLATILITY', type: 'indicator', domain: 'tools', topics: ['ATR', '波动率', '风险测量'], status: 'verified',
      src: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=900&q=80&auto=format&fit=max&sat=-100',
      summary: 'ATR 可以帮助统一不同波动环境下的止损与仓位讨论，但它不提供多空方向，也不替代结构失效点。',
      readingMinutes: 6, updatedAt: '2026-10-22', reviewCount: 11, featured: true, featuredOrder: 4,
      sections: [
        { heading: '指标边界', text: 'ATR 是真实波幅的平滑结果，描述波动程度，不提供多空方向。', items: ['ATR 上升只说明近期真实波幅扩大，数值上升不等于价格上涨。', 'ATR 下降只说明波动收缩，不代表趋势必然结束或突破即将发生。', '指标建立在历史价格上，只能提供测量尺，不能替代未来的结构验证。'] },
        { heading: '参数与数据', items: ['先固定周期、参数和数据源，再比较同一品种不同阶段的波动。', '参数变化会改变平滑程度，回测和实盘必须保持同一口径。', '跨品种比较时优先使用 ATR 与价格的相对关系，而非孤立原始数值。'] },
        { heading: '风险换算', items: ['先明确单笔允许亏损金额，再用入场到失效的距离计算仓位。', 'ATR 倍数是风险换算工具，不是天然最优止损距离，需用样本验证。', '波动放大导致止损距离增加时，应减少仓位，而不是维持数量放大风险。'] },
        { heading: '与结构配合', items: ['先用结构确定失效位置，再用 ATR 检查该距离是否适合当前波动。', '失效距离显著小于日常噪声时，优先放弃低质量入场而非随意放宽止损。', '止损过宽时评估盈亏比和仓位是否仍合格，不满足条件就不交易。'] },
        { heading: '常见误用', items: ['不要把 ATR 上升直接理解为趋势增强，方向必须回到价格结构判断。', '不要在不同周期之间直接比较原始数值，也不要混用复权口径不同的数据。', '不要只调整止损倍数而不同步重算仓位和账户风险。'] },
      ],
      relatedSlugs: ['pre-trade-checklist', 'risk-before-entry', 'trend-is-not-a-line'],
    },
    {
      slug: 'pre-trade-checklist', index: '057', title: '交易前检查清单：把临场决定提前写完', tag: 'EXECUTION / CHECKLIST', type: 'rule', domain: 'execution', topics: ['交易系统', '检查清单', '风险'], status: 'verified',
      src: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=900&q=80&auto=format&fit=max&sat=-100',
      summary: '清单的目标不是让每笔交易看起来都一样，而是确保任何临场决定都没有跳过前提、失效与风险三个问题。',
      readingMinutes: 5, updatedAt: '2026-10-29', reviewCount: 14, featured: true, featuredOrder: 5,
      sections: [
        { heading: '模型与环境', text: '清单确保临场决定没有跳过前提、失效与风险三个问题。', items: ['这笔交易属于哪一个已记录的模型，当前触发是否符合模型原始定义？', '趋势、波动和流动性环境是否符合模型适用条件，而非只看局部形态？', '是否因为刚错过行情、连续亏损或急于回本而降低标准？'] },
        { heading: '失效与风险', items: ['哪一个可观察的价格变化能够证明原假设失效，位置是否在下单前写明？', '按失效距离计算后的仓位是否处于单笔和当日风险限制内？', '止损成交后的滑点、手续费和无法立即退出情形是否已被接受？'] },
        { heading: '触发与订单', items: ['入场触发已经发生，而不是预计会发生；没有提前用想象替代事实。', '订单类型、价格、数量和交易方向已复核，快捷下单前没有多余犹豫。', '入场后的加减仓、止损和目标处理已写明，不留待情绪临时决定。'] },
        { heading: '禁止交易条件', items: ['无法命名模型、无法指出失效位置或无法计算仓位时，不执行交易。', '无法接受计划亏损，或明显处于情绪化追单状态时，不执行交易。', '重大事件、流动性异常或平台状态不符合模型前提时，不强行执行。'] },
        { heading: '成交后记录', items: ['保存入场前截图与计划，保留当时可见信息，避免事后补写理由。', '记录实际成交、滑点和是否偏离清单，结果与过程分开评价。', '若发生违规，当天先停止同类型交易，复盘原因后再恢复模型。'] },
      ],
      relatedSlugs: ['atr-risk-measurement', 'counterexample-chasing', 'risk-before-entry'],
    },
    {
      slug: 'counterexample-chasing', index: '063', title: '反例：一次看似正确的追单，为什么仍然不合格？', tag: 'REVIEW / COUNTEREXAMPLE', type: 'case', domain: 'review', topics: ['反例', '追单', '执行复盘'], status: 'verified',
      src: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=900&q=80&auto=format&fit=max&sat=-100',
      summary: '结果盈利不能自动证明过程正确。复盘要把“这次赚了”与“这笔交易符合系统”分开评价。',
      readingMinutes: 10, updatedAt: '2026-10-26', reviewCount: 8, featured: true, featuredOrder: 6,
      sections: [
        { heading: '案例背景', text: '一次追单最终盈利，但入场前没有模型、失效位置和完整风险计划。', items: ['价格快速突破后，交易者因害怕错过而追入，随后行情延续并产生浮盈。', '入场前没有写下模型名称，失效位置是在持仓后才根据价格补充。', '交易结果可以记录为盈利，但过程必须单独标记为模型外执行。'] },
        { heading: '过程问题', items: ['入场依据是害怕错过，而不是预先定义并已经发生的触发。', '仓位先于止损距离确定，真实风险无法在下单前复核。', '盈利结果掩盖违规过程，容易强化下一次不可重复的追单行为。'] },
        { heading: '反事实检查', items: ['若突破后立即回到区间，临时补写的止损是否真的能被执行？', '若同样追单连续出现三次，当前仓位规则能否承受正常失败样本？', '若去掉最终盈亏，仅凭入场前截图，这笔交易是否仍会被允许？'] },
        { heading: '有效复盘', items: ['将结果评价与过程评价分开，盈利不能抵消缺失的计划与纪律。', '还原下单前可见信息，不用后续走势证明当时决定合理。', '把问题归到具体环节：模型识别、触发等待、风险换算或订单执行。'] },
        { heading: '规则修订', items: ['没有完成交易前清单，不允许提交订单；软件或纸本都留下完成记录。', '错过计划入场后，只等待下一次完整模型，不追逐已经离开的价格。', '单独统计模型外交易的长期结果与情绪波动，验证规则是否真正改善行为。'] },
      ],
      relatedSlugs: ['pre-trade-checklist', 'liquidity-sweep', 'price-action-failure'],
    },
    {
      slug: 'risk-before-entry', index: '009', title: '先定义能失去什么，再讨论可能得到什么', tag: 'FOUNDATION / RISK', type: 'concept', domain: 'foundation', topics: ['风险认知', '仓位', '交易基础'], status: 'verified',
      src: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=900&q=80&auto=format&fit=max&sat=-100',
      summary: '风险不是交易完成后的统计结果，而是入场前就必须被明确接受和限制的条件。',
      readingMinutes: 6, updatedAt: '2026-10-18', reviewCount: 10, featured: false, featuredOrder: 99,
      sections: [
        { heading: '风险定义', text: '单笔风险是假设失效时账户愿意且能够承受的损失上限。', items: ['风险必须在入场前被换算成金额和仓位，而不是平仓后才统计。', '可承受同时包含账户财务约束与个人行为约束，任何一项不满足都应降低风险。', '风险上限是约束条件，不是每次必须用完的额度。'] },
        { heading: '计算顺序', items: ['先确定失效位置，再计算入场到失效的真实距离。', '先确定允许亏损金额，再除以单位风险反推可交易数量。', '把手续费、滑点和最小交易单位纳入结果，向下取整而非四舍五入放大风险。'] },
        { heading: '账户层约束', items: ['同时检查单笔、单日和相关持仓的总风险，避免多笔交易重复押注同一变量。', '连续亏损后按既定规则降低暴露，而不是通过加仓迅速赚回。', '为高波动和流动性不足预留缓冲，理论止损不等于实际可控成交。'] },
        { heading: '常见误用', items: ['先决定想买多少，再为适应仓位把止损放近，会让技术失效服从冲动。', '因为主观胜率很高而临时突破风险上限，会把单次判断变成账户威胁。', '只计算盈利目标而忽略失败分布，无法判断模型是否长期可执行。'] },
        { heading: '入场前复核', items: ['如果这笔交易立即失败，损失金额是否与计划和接受程度一致？', '如果实际成交出现滑点，账户总风险是否仍在允许范围内？', '若仓位已经降到最小单位仍超出风险，是否明确选择放弃交易？'] },
      ],
      relatedSlugs: ['atr-risk-measurement', 'pre-trade-checklist'],
    },
    {
      slug: 'price-action-failure', index: '021', title: '价格行为交易为什么需要预先写出失效条件？', tag: 'PRICE ACTION / INVALIDATION', type: 'lesson', domain: 'language', topics: ['价格行为', '失效条件', '课程'], status: 'reviewing',
      src: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=900&q=80&auto=format&fit=max&sat=-100',
      summary: '失效条件不是一句“看错就止损”，而是一个能够被价格触发的具体观察：哪项原始证据不再成立。',
      readingMinutes: 9, updatedAt: '2026-10-28', reviewCount: 7, featured: false, featuredOrder: 99,
      sections: [
        { heading: '学习目标', text: '把一个价格行为判断拆成原始证据、确认条件和失效条件。', items: ['能用不含预测的语言描述当前价格、结构和位置，而不是先写结论。', '能为交易假设写出可观察的确认触发，并说明触发前为什么不能执行。', '能指出哪项原始证据消失后假设失效，即使价格尚未触及金额止损。'] },
        { heading: '三类条件', items: ['原始证据：当前已经看见什么，不加入未来预测，也不使用后续K线。', '确认条件：什么发生后交易假设才被允许执行，它决定等待是否结束。', '失效条件：什么发生后不应继续沿用原判断，它决定观点何时退出。'] },
        { heading: '写作标准', items: ['具体：指出价格、位置与行为，不写“走势变差”“感觉不对”等主观句。', '可观察：另一位交易者看同一张图，也能判断条件是否发生。', '不可随意移动：条件只能随新信息按规则更新，不能为持仓亏损不断后移。'] },
        { heading: '课程练习', items: ['选择一段历史行情，只展示当时已经出现的信息，分别写下三类条件。', '逐根推进K线，记录确认和失效谁先发生，不根据最终结果修改原句。', '交换案例复核，检查双方能否独立判断条件，出现分歧就继续细化描述。'] },
        { heading: '常见误区', items: ['固定金额止损只是风险边界，不能覆盖结构已经变化但尚未触及止损的情况。', '失效条件写得过宽会让任何行情都能被解释，写得过窄则容易被日常噪声触发。', '确认与失效不能使用相互冲突的周期和结构，否则持仓后无法一致执行。'] },
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
