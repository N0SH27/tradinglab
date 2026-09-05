/* ─────────────────────────────────────────────
 * Belief Ledger 派生层（V2-06-02）
 *
 * delta 与 direction 的唯一计算入口——禁止在数据文件持久化，
 * 禁止组件内自行展开 current - previous 之外的逻辑。
 *
 * direction 三态（OD-3 裁决）：
 *   current > previous  → up
 *   current < previous  → down
 *   current = previous  → confirm（"审查之后选择不更新"也是一条账本记录）
 * ───────────────────────────────────────────── */
import type { Revision } from './domains/ledger'

export type RevisionDirection = 'up' | 'down' | 'confirm'

export function deltaOf(r: Revision): number {
  return r.current - r.previous
}

export function directionOf(r: Revision): RevisionDirection {
  const d = deltaOf(r)
  return d > 0 ? 'up' : d < 0 ? 'down' : 'confirm'
}

/**
 * 同日多条 Revision 的确定性次序（Rule 01 + V2-06-05 R-01 裁决）：
 * id 以 `-N` 后缀表达同日序号（首条无后缀 = 1，其后 -2、-3……），
 * 序号大者 = 当日更晚的认知事件。Current Belief 不得依赖数组物理顺序。
 */
function seqOf(id: string): number {
  // id 形如 rev-<thesisId>-<yyyymmdd>[-N]：只认 8 位日期之后的序号后缀，
  // 防止把日期数字本身误当序号
  const m = /-\d{8}-(\d+)$/.exec(id)
  return m ? parseInt(m[1], 10) : 1
}

/**
 * 某命题的全部账本记录，按确定性次序升序：
 * 先按 date（'YYYY.MM.DD' 字典序 = 时间序），同日按 id 序号后缀（seqOf）。
 * 排序完全由数据内容决定，与 LEDGER 数组物理顺序无关（R-01）。
 */
export function revisionsOf(ledger: Revision[], thesisId: string): Revision[] {
  return ledger
    .filter((r) => r.thesisId === thesisId)
    .sort((a, b) =>
      a.date < b.date ? -1 : a.date > b.date ? 1 : seqOf(a.id) - seqOf(b.id),
    )
}

/** 最近修正日：Ledger 有记录以 Ledger 为准（确定性次序末条），否则回落 fallback（legacy revisions 首条或 updated） */
export function lastRevisedOf(ledger: Revision[], thesisId: string, fallback: string): string {
  const rs = revisionsOf(ledger, thesisId)
  return rs.length > 0 ? rs[rs.length - 1].date : fallback
}

/**
 * CURRENT BELIEF 的 canonical 派生入口（V2-06-04，Rule 02；V2-06-05 R-01 加固）。
 * Ledger 有记录 → 按 date + 同日序号确定性排序后的最新 Revision.current（最终 SSOT）；
 * 无记录 → thesis.probability（migration-era snapshot，渐进迁移期 fallback）。
 * UI 一律经本函数取当前信念，禁止把 thesis.probability 当实时 SSOT。
 */
export function deriveCurrentBelief(
  thesis: { id: string; probability: number },
  ledger: Revision[],
): number {
  const rs = revisionsOf(ledger, thesis.id)
  return rs.length > 0 ? rs[rs.length - 1].current : thesis.probability
}

/**
 * WHAT CHANGED 投影（V2-C.1 · Human 裁决：Journal = A / 首页 = 3～5 条）。
 * 展示层规则：过滤 confirm（delta = 0——「审查之后选择不更新」不投影为变化）
 * → 按命题分组 → 每组取确定性次序末条（每类只显示最新一条有效变化）
 * → 时间倒序 → 截取 limit。
 * 纯派生：Ledger append-only 事实层不受投影影响，历史记录零删改。
 */
export function latestChanges(ledger: Revision[], limit = 5): Revision[] {
  const byThesis = new Map<string, Revision[]>()
  for (const r of ledger) {
    if (deltaOf(r) === 0) continue
    byThesis.set(r.thesisId, [...(byThesis.get(r.thesisId) ?? []), r])
  }
  return [...byThesis.entries()]
    .map(([thesisId, rs]) => {
      const sorted = revisionsOf(rs, thesisId)
      return sorted[sorted.length - 1]
    })
    .sort((a, b) =>
      a.date < b.date ? 1 : a.date > b.date ? -1 : seqOf(b.id) - seqOf(a.id),
    )
    .slice(0, limit)
}
