// ── Belief Ledger（认知账本 · V2-06-02）────────────────
// Ledger is the factual record. Journal is the narrative record.
// Ledger 记录我改变了什么；Journal 记录我为什么这样想。
//
// 铁律（V2-06-01 契约 08 号文件 + 四项 OD 裁决）：
//  · conviction 变化在全站的唯一事实源（SSOT）——append-only，不设计 update/delete；
//  · delta 与 direction（up/down/confirm）一律派生（data/ledger.ts），禁止持久化；
//  · Thesis.revisions[] 已冻结为 legacy narrative，新事件只入本账本；
//  · Journal 不再持有 conviction 字段，仅经 thesisId 建立叙事关联。
export interface Revision {
  id: string                  // 'rev-<thesisId>-<yyyymmdd>'；同日多条加 '-N' 序号后缀（V2-06-05 R-01）
  date: string                // 全站统一 'YYYY.MM.DD'（字典序 = 时间序）
  thesisId: string            // → Thesis.id（check 断言无悬空）
  previous: number            // 修正前 conviction（0–100）
  current: number             // 修正后 conviction（0–100）
  reason: string              // 为什么改（必填）
  evidence?: string[]         // 什么事实出现了（可选，可被外部验证）
  note?: string               // 人读叙述补充（可选，迁移时承接原 journal note）
}

// 按日期倒序维护（最新在前）。新记录插入数组头部——append-only 指账本语义不可变，
// 数组顺序仅为阅读与取数便利；派生层一律按 date + 同日 id 序号重排（R-01：
// Current Belief 由确定性排序决定，不依赖本数组物理顺序）。
// 同一命题同日多条入账时（Rule 01 允许）：首条 id 无后缀，其后依次 '-2'、'-3'……，
// 序号大者 = 当日更晚事件；check [18] 断言序号连续无缺。
export const LEDGER: Revision[] = [
  {
    id: 'rev-memory-cycle-20260830',
    date: '2026.08.30',
    thesisId: 'memory-cycle',
    previous: 65,
    current: 68,
    reason: '"上涨失效"从股价蔓延到产品配置：Rubin Ultra 的 HBM 从 12 层降配至 8 层、存储约占整机 BoM 70%、买方自 7 月起抵制涨价；英伟达以存储极端定价为由把下季度毛利率指引降至 71–72%。同时长鑫进入全球第四大 DRAM 厂商行列，四玩家结构改变下行周期的供给纪律。',
    evidence: [
      'Rubin Ultra HBM 配置从 12-high 降配至 8-high，存储约占整机 BoM 70%（2026.08）',
      '英伟达 FY27Q2 电话会：下季度毛利率指引 71–72%，明确归因存储极端定价环境（2026.08）',
      '长鑫 DRAM 月产能路径 18→50 万片（2025→2028），DRAM 回到四玩家结构（2026.08）',
    ],
    note: '上调概率 65% → 68%。涨价的终结者不是低价，而是买方的配置降级。反证并存：降配提高封装良率，HBM 总供给反增——周期判据未被证伪，但被拉长。',
  },
  {
    id: 'rev-compute-20260731',
    date: '2026.07.31',
    thesisId: 'compute',
    previous: 65,
    current: 72,
    reason: '北京智算项目推进速度快于预期；新增风险：液冷环节竞争加剧。',
    note: '上调概率 65% → 72%。北京智算项目推进速度快于预期。',
  },
  {
    id: 'rev-newenergy-20260705',
    date: '2026.07.05',
    thesisId: 'newenergy',
    previous: 57,
    current: 63,
    reason: '龙头经营性现金流连续两季为正，出清证据链闭合。否极泰来的早期形态。',
    note: '上调概率 57% → 63%。龙头经营性现金流连续两季为正，出清证据链闭合。否极泰来的早期形态。',
  },
  {
    id: 'rev-robot-20260625',
    date: '2026.06.25',
    thesisId: 'robot',
    previous: 55,
    current: 51,
    reason: '成交拥挤度创年内新高，估值透支速度超过产业兑现速度。盛极而衰的预警，不是结论。',
    note: '下调概率 55% → 51%。成交拥挤度创年内新高，估值透支速度超过产业兑现速度。盛极而衰的预警，不是结论。',
  },
]
