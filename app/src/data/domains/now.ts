// ── 当下（NOW · Current Observations）────────────
// NOW ≠ 新闻 / 行情 / Ticker / Dashboard——只记录"正在发生、值得观察的变化"。
// Observation ≠ Thesis：观察回答"什么在变"，命题回答"我因此相信什么"。
// polarity 不持有字段——需要时经 mapNodeId 由 deriveThesisPolarity 同源推导（V2-04.5 契约）。
// 过渡态：3–5 条人工维护；SIGNALS 完整形态挂 C-04（V2-07）。
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
    summary: '推理成本持续下降，单位智能的价格曲线仍在下移——需求结构比芯片性能更值得盯。',
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
]
