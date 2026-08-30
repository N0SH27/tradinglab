// ── 产业地图 ──────────────────────────────────
// 设计原则：
//  · 节点状态为双层结构：产业景气（state）× 估值位置（valuation）
//    —— 源自凌鹏「一切皆周期、估值终有效」与 MEMORY v51 存储命题的背离判断
//  · 每个节点标注生命周期阶段坐标（penetration）与该阶段的分析重心（stageFocus）
//    —— 源自肖璟的行研框架：渗透率 15–20% 进成长期，35–40% 进成熟期
//  · 地图不是名单，是一组相互等待的 S 曲线（佩雷斯：技术革命 × 金融资本）
export interface MapNode {
  id: string
  name: string
  en: string
  stage: string
  state: 'yang' | 'yin' | 'turn'        // 产业景气
  valuation: 'stretched' | 'fair' | 'washed'  // 估值位置：透支 / 合理 / 出清
  penetration: string                    // 渗透率/生命周期坐标
  stageFocus: string                     // 当前阶段的分析重点
  stateNote: string
  observation: string
  links: string[]
  x: number   // 画布坐标 0–100
  y: number
  size: number // 节点权重 1–3
  essays?: string[]  // 关联文章 id
  theses?: string[]  // 关联命题 id
}

export const MAP_EDGES: [string, string][] = [
  // 上游：芯片与存储
  ['gpu', 'hbm'], ['gpu', 'dram'], ['hbm', 'cowos'], ['dram', 'cowos'],
  ['equip', 'gpu'], ['equip', 'dram'],
  // 中游：封装→互联→板卡→整机→散热
  ['cowos', 'pcb'], ['cowos', 'optical'], ['pcb', 'server'],
  ['optical', 'server'], ['server', 'cooling'],
  // 下游：IDC → 电力约束 → 运营 → 云
  ['server', 'idc'], ['cooling', 'idc'], ['idc', 'power'],
  ['idc', 'operator'], ['power', 'operator'], ['operator', 'cloud'],
  // 价值终点：云 → 应用 → Token 经济
  ['cloud', 'app'], ['app', 'token'], ['cloud', 'token'],
]

export const MAP_ESSAY = 'thesis-writing-os'

/* 佩雷斯时代标尺：技术革命 × 金融资本的五阶段定位 */
export const MAP_ERA = {
  title: '时代坐标 · 佩雷斯标尺',
  stages: ['爆发', '狂热', '转折点', '协同', '成熟'] as const,
  current: 1.8, // 0–4 连续刻度：当前位于狂热后期、转折前夜
  note: 'AI 算力处在第五次技术革命（信息与通信时代）的狂热后期——金融资本与生产资本开始脱钩，估值膨胀领先于收入兑现。历史经验：泡沫破裂沉淀的基础设施，才是展开期黄金时代的地基。',
}

export const INDUSTRY_MAP: { root: string; note: string; nodes: MapNode[] } = {
  root: 'AI 算力产业链',
  note: '一条产业链不是一张名单，而是一组相互等待的 S 曲线。节点越大，产业权重越高；黑实为产业阳、白空为产业阴、半实为转换中——朱砂描边代表估值透支，深水蓝描边代表估值出清。点击任一环节，查看它的观察档案。',
  nodes: [
    {
      id: 'gpu', name: '算力芯片', en: 'GPU / ASIC', stage: '源头',
      x: 50, y: 13, size: 3, essays: ['thesis-writing-os'], theses: ['compute'],
      state: 'turn', valuation: 'fair',
      penetration: '成长期 · 渗透率陡峭段（推理侧 15%→40%）',
      stageFocus: '规模性 + 供给瓶颈验证',
      stateNote: '阳中有阴：需求极旺，供给受制',
      observation: '需求的确定性高于供给的确定性。国产芯片在推理侧持续渗透，但先进制程产能决定天花板。观察出货增速与智算投资增速的剪刀差。见命题一。',
      links: ['HBM 存储', '通用存储', '先进封装', '国产设备/材料'],
    },
    {
      id: 'hbm', name: 'HBM 存储', en: 'HBM', stage: '上游',
      x: 12, y: 25, size: 2, theses: ['memory-cycle'],
      state: 'yang', valuation: 'stretched',
      penetration: '成长期 · 结构性短缺（AI 服务器渗透率快速提升）',
      stageFocus: '产能分配 + 价格合约期限结构',
      stateNote: '产业阳 × 估值阴：量价齐升，但股价已开始不跟',
      observation: '高带宽存储是当前最紧的瓶颈之一——产业面极阳。但需求侧已出现第一道裂缝：Rubin Ultra 将 HBM 从 12 层降配至 8 层、存储约占整机 BoM 70%，买方自 2026 年 7 月起抵制涨价；三星、海力士仅 5 倍 PE，市场已在定价 2028 年利润腰斩：价格与股价的背离是周期股最经典的顶部信号。跟踪原厂产能分配、HBM 层数与容量配置变化、国产 HBM 验证进度。见命题六。',
      links: ['算力芯片', '先进封装'],
    },
    {
      id: 'dram', name: '通用存储', en: 'DRAM / NAND', stage: '上游',
      x: 13, y: 54, size: 1, theses: ['memory-cycle'],
      state: 'turn', valuation: 'stretched',
      penetration: '成熟期 · 渗透率见顶后的周期段',
      stageFocus: '周期位置 + 价格×产量双击结构',
      stateNote: '阴极：产能过剩周期，碳酸锂前鉴',
      observation: '通用存储与 HBM 是两种生意：一个是结构性短缺，一个是周期性过剩。碳酸锂完整演绎过这条路——价格 30 万时股价见顶，60 万时股价不跟，跌到 5.8 万时市值蒸发九成。长鑫以约 30 倍 PE 上市，对比三星自带数倍泡沫；其产能路径（2025 年 18 万片/月 → 2028 年 50 万片/月）使 DRAM 从三家寡头回到四玩家结构——下行期的低谷可能更长、复苏斜率更缓（2026.08）。见命题六。',
      links: ['算力芯片', '先进封装'],
    },
    {
      id: 'equip', name: '国产设备/材料', en: 'Equipment / Materials', stage: '上游',
      x: 20, y: 38, size: 1, theses: ['compute'],
      state: 'yang', valuation: 'stretched',
      penetration: '成长期 · 国产化率 20%–25%，陡峭段前夜',
      stageFocus: '规模性（400 亿美金市场）× 国产化率斜率',
      stateNote: '阳：卡脖子约束下的确定性倾斜',
      observation: '一级市场生物医药 BD 已收回约千亿美金，半导体设备年市场约 400 亿美金——但二级市值远大于生物医药，估值错配严重。国产化率仅 20%–25%，国运论的直接载体：投国家最缺且必须做成的东西。',
      links: ['算力芯片', '通用存储'],
    },
    {
      id: 'cowos', name: '先进封装', en: 'CoWoS / 2.5D', stage: '上游',
      x: 52, y: 33, size: 2,
      state: 'yang', valuation: 'fair',
      penetration: '成长期 · 满产满销，扩产周期 18 个月',
      stageFocus: '盈利性 + 设备交期（领先指标）',
      stateNote: '阳：满产满销，扩产激进',
      observation: '封装产能是算力供给的"咽喉"。扩产周期长达 18 个月，意味着今天的产能决策决定了明年的供给。跟踪设备交期比跟踪订单更领先。',
      links: ['HBM 存储', '通用存储', 'PCB', '光模块 / CPO'],
    },
    {
      id: 'optical', name: '光模块 / CPO', en: 'Optical / CPO', stage: '中游',
      x: 82, y: 36, size: 2, theses: ['optical-module'],
      state: 'yang', valuation: 'stretched',
      penetration: '成长后期 · 相对估值顶部区域',
      stageFocus: '估值结构（FCC 死线）> 订单增速',
      stateNote: '产业阳 × 估值透支：望远镜被折到 2027 年底',
      observation: '订单能见度到 2027 年、业绩仍在兑现——但 FCC 限制把估值的望远镜从无限远打折到一条"死线"。中概股与 cXo 的前鉴：基本面不变，估值也可以被永远压住。AI 算力占 A 股成交约 45%，史上最拥挤的一趟车。见命题五。',
      links: ['先进封装', '服务器整机'],
    },
    {
      id: 'pcb', name: 'PCB / 载板', en: 'PCB / Substrate', stage: '中游',
      x: 86, y: 51, size: 1,
      state: 'yang', valuation: 'fair',
      penetration: '成长期 · 层数与材料持续升级',
      stageFocus: '盈利性：单机价值量抬升的持续性',
      stateNote: '阳：层数升级，单机价值量抬升',
      observation: 'AI 服务器 PCB 的层数与材料等级持续升级，单机价值量数倍于通用服务器。这是产业链中"确定性通胀"的环节。',
      links: ['先进封装', '服务器整机'],
    },
    {
      id: 'server', name: '服务器整机', en: 'AI Server', stage: '中游',
      x: 49, y: 51, size: 1,
      state: 'yin', valuation: 'fair',
      penetration: '成长期 · 收入放量但格局未定',
      stageFocus: '盈利性：毛利率能否在规模效应中守住',
      stateNote: '阴：收入放大，毛利承压',
      observation: '整机环节收入弹性最大、话语权最弱。放量的阳，藏着利润率的阴。观察毛利率能否在规模效应中守住。',
      links: ['PCB / 载板', '光模块 / CPO', '液冷散热'],
    },
    {
      id: 'cooling', name: '液冷散热', en: 'Liquid Cooling', stage: '中游',
      x: 17, y: 70, size: 1, theses: ['compute'],
      state: 'turn', valuation: 'stretched',
      penetration: '导入期→成长期 · 渗透率从可选项变必选项',
      stageFocus: '防守性：格局恶化速度 vs 渗透率提升速度',
      stateNote: '由阳转阴：渗透率升，竞争者众',
      observation: '单机功率密度突破风冷极限，液冷从可选变为必选——逻辑极阳。但涌入者太多，格局恶化快于预期。拥挤的强信号不如冷清的弱信号。命题一中已将其列为新增风险。',
      links: ['服务器整机', 'IDC'],
    },
    {
      id: 'idc', name: 'IDC / 智算中心', en: 'IDC', stage: '下游',
      x: 50, y: 70, size: 1,
      state: 'turn', valuation: 'fair',
      penetration: '成长期 · 建设热、运营冷的分化段',
      stageFocus: '景气度：上架率爬坡 × 电力指标 × 客户结构',
      stateNote: '阴阳交织：需求上行，回报分化',
      observation: '智算中心的投资热潮真实，但回报率高度分化——位置、电力指标与客户结构决定生死。警惕"建设热、运营冷"的错配。',
      links: ['液冷散热', '电力'],
    },
    {
      id: 'power', name: '电力', en: 'Power', stage: '约束层',
      x: 70, y: 66, size: 2, essays: ['thesis-writing-os'],
      state: 'yang', valuation: 'washed',
      penetration: '成熟期 · 老行业被新需求重新定价',
      stageFocus: '估值：被重新定价的瓶颈，反身性最弱',
      stateNote: '阳 × 估值出清：被重新定价的瓶颈',
      observation: '算力的尽头是电力。当所有人盯着芯片时，电力指标正成为智算中心选址的第一约束。这是产业链中理解者最少、反身性最弱、逻辑最硬的环节——国运论的直接载体。',
      links: ['IDC / 智算中心', '数据中心运营'],
    },
    {
      id: 'operator', name: '数据中心运营', en: 'DC Operation', stage: '下游',
      x: 74, y: 79, size: 1,
      state: 'yin', valuation: 'fair',
      penetration: '成熟期 · 时间的生意',
      stageFocus: '盈利性：现金流确定性 > 成长性',
      stateNote: '阴：重资产、长周期、慢回报',
      observation: '运营是时间的生意。短期看是负担，长期看是壁垒——一旦上架率爬坡完成，现金流的确定性极强。适合用"收租"视角而非"成长"视角评估。',
      links: ['电力', '运营商 / 云'],
    },
    {
      id: 'cloud', name: '运营商 / 云', en: 'Cloud / Carrier', stage: '分发层',
      x: 44, y: 84, size: 2,
      state: 'yang', valuation: 'fair',
      penetration: '成熟期 · 资本开支为链上火车头',
      stageFocus: '景气度：资本开支指引的措辞变化',
      stateNote: '阳：资本开支的火车头',
      observation: '云厂商的资本开支指引是整条产业链的先行指标。它们的每一次上调或放缓，都会沿产业链逐级放大。跟踪指引的措辞变化，比跟踪数值更重要。',
      links: ['数据中心运营', '应用层', 'Token 经济'],
    },
    {
      id: 'app', name: '应用层', en: 'Applications', stage: '价值终点',
      x: 9, y: 93, size: 1, theses: ['ai-app'],
      state: 'turn', valuation: 'fair',
      penetration: '导入期→成长期 · 商业模式验证段',
      stageFocus: '可行性：收入能否接棒叙事',
      stateNote: '阴极阳生：价值回流的起点',
      observation: '算力基建的全部意义，最终要由应用层的收入来偿还。当前应用收入与算力投资之间存在巨大缺口——这个缺口是风险（泡沫），也是机会（渗透空间）。见命题二。',
      links: ['运营商 / 云', 'Token 经济'],
    },
    {
      id: 'token', name: 'Token 经济', en: 'Token Economy', stage: '价值终点',
      x: 47, y: 104, size: 1, theses: ['ai-app'],
      state: 'turn', valuation: 'stretched',
      penetration: '导入期 · 叙事先于收入的"市梦率"段',
      stageFocus: '可行性：Token 成本曲线 × ARR 真实性',
      stateNote: '阴阳未定：估值重构的实验场',
      observation: 'Token 工厂正在重构算力的估值方式——从卖设备到卖智能的计量单位。叙事宏大，但"AI 估值四拍"（拍规模→拍市占率→拍利润率→拍估值）本质是拍脑袋。区分平台型 Token 分成与概念性贴牌。',
      links: ['应用层', '运营商 / 云'],
    },
  ],
}
