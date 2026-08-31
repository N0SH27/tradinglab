// ── 当下（NOW · Current Observations）────────────
// NOW ≠ 新闻 / 行情 / Ticker / Dashboard——只记录"正在发生、值得观察的变化"。
// Observation ≠ Thesis：观察回答"什么在变"，命题回答"我因此相信什么"。
// polarity 不持有字段——需要时经 mapNodeId 由 deriveThesisPolarity 同源推导（V2-04.5 契约）。
// 人工维护；W35 证据入账（2026-08-31，7 新增 + 1 注记）后进入 Evidence Operating Phase；SIGNALS 完整形态挂 C-04（V2-07）。
export interface Observation {
  id: string
  title: string
  summary: string
  date: string
  mapNodeId?: string   // 可选 → 地图节点（#\/map）
  thesisId?: string    // 可选 → 命题（#\/thesis/:id）
}

export const OBSERVATIONS: Observation[] = [
  {
    id: 'ai-inference-economics',
    title: 'AI 推理经济学',
    summary: '推理成本持续下降，单位智能的价格曲线仍在下移——需求结构比芯片性能更值得盯。（证据注记：训练/推理结构 6:4 → 2:8 翻转，2026.04 口径，知识圈消化）',
    date: '2026.08',
    mapNodeId: 'gpu',
    thesisId: 'compute',
  },
  {
    id: 'china-semiconductor-localization',
    title: '国产半导体本地化',
    summary: '从"可用"到"必须用"的切换正在发生：英伟达前瞻指引已不计入中国数据中心收入，海外管制未见放松；智算项目推进速度快于预期。',
    date: '2026.08',
    mapNodeId: 'equip',
    thesisId: 'compute',
  },
  {
    id: 'memory-price-divergence',
    title: '存储价格与股价背离',
    summary: '价格上涨开始遭遇买方抵制：Rubin Ultra 的 HBM 从 12 层降配至 8 层，存储约占整机 BoM 70%；英伟达以存储极端定价为由下调毛利率指引。顶部信号不是价格下跌，而是上涨失效。',
    date: '2026.08',
    mapNodeId: 'dram',
    thesisId: 'memory-cycle',
  },
  {
    id: 'supply-bottleneck-migration',
    title: '瓶颈向设备与厂房迁移',
    summary: '最紧的环节从算力芯片延伸到洁净室、先进封装设备与载板——CoW 设备交期长达 12 个月，亚洲封测厂资本开支创历史高位。订单之后，交付能力开始决定收入。',
    date: '2026.08',
    mapNodeId: 'cowos',
    thesisId: 'compute',
  },
  {
    id: 'power-as-constraint',
    title: '电力成为算力约束',
    summary: 'IDC 扩张之后，瓶颈正在向电力与散热环节迁移。',
    date: '2026.07',
    mapNodeId: 'power',
  },
  {
    id: 'nand-ssd-supercycle',
    title: 'NAND/SSD：存储涨价的第三极',
    summary: '本轮涨价最疯狂的品种是 NAND/SSD 而非 DRAM：服务器 SSD 需求爆发，NAND 卷 3D 堆叠层数（256 层为主）——存储内部结构的第三极，此前体系重心在 HBM/DRAM。（2026.02 口径，知识圈消化）',
    date: '2026.02',
    mapNodeId: 'dram',
    thesisId: 'memory-cycle',
  },
  {
    id: 'samsung-foundry-bypass',
    title: '国产 AI 芯片的三星流片旁路',
    summary: '因中芯先进制程产能来不及，国内 AI 芯片公司开始去三星流片（三星先进制程稼动率不足 50%）——国产算力供给的泄压阀。（2026.04 口径，知识圈消化）',
    date: '2026.04',
    mapNodeId: 'gpu',
    thesisId: 'compute',
  },
  {
    id: 'memory-price-signal-distortion',
    title: '存储价格信号开始失真',
    summary: '合约侧：存储大厂纷纷签 LTA 长协（含两长），大客户合约价占六七成，散单与现货仅占小头；现货侧：缺货时经销商捂盘，现货价被人为放大。价格变量的可读性下降——合约价与现货价的裂口需要分开盯。（2026.04–07 口径，知识圈消化）',
    date: '2026.07',
    mapNodeId: 'hbm',
    thesisId: 'memory-cycle',
  },
  {
    id: 'silicon-wafer-leading-indicator',
    title: '硅片价格：周期领先指标值守',
    summary: '已采纳硅片价格为存储周期最领先观察指标（"最不紧缺品种价格见顶"框架：电新轮的领先指标是电解液，本轮对应硅片）。当前读数：未见顶信号。（2026.08 框架口径，知识圈消化）',
    date: '2026.08',
    mapNodeId: 'dram',
    thesisId: 'memory-cycle',
  },
  {
    id: 'diamond-cooling-commercialization',
    title: '金刚石散热进入商用导入期',
    summary: '英伟达 Rubin 架构明确采用金刚石铜复合方案；海外首批钻石冷却 AI 服务器约 3 亿美金订单，实测 GPU 降温约 10 度、每瓦算力提升 20%+。散热是电力约束的直接承接环节——但板块已被炒过 2–4 倍后回调，真假靠产能/订单/需求放量三问验证。（2026.08 口径，知识圈消化）',
    date: '2026.08',
    mapNodeId: 'cooling',
  },
  {
    id: 'ai-storage-power-mechanism',
    title: 'AI 配储：电力约束的市场化解决层',
    summary: '同一电力约束两种解法：中国要更便宜的电，美国是缺电。容量电价时代开启（13 省出台）；风光发电量占比全部越过 10% 电网调度临界点（中国 21.8%、欧盟 24.6%、美国约 20%），储能从补充变刚需——电力约束度量框架的值守起点。（2026.07 口径，知识圈消化）',
    date: '2026.07',
    mapNodeId: 'power',
  },
  {
    id: 'innovative-drug-bd-curve',
    title: '创新药海外 BD 金额曲线',
    summary: '海外 BD 金额 500 亿 → 1300 亿 → 2026 有望 2000 亿美金；政策边界澄清：单个品种海外 BD 不受影响，技术平台出口或公司打包出售受严格审查。（2026.05 口径，知识圈消化）',
    date: '2026.05',
    thesisId: 'innovative-drug',
  },
]
