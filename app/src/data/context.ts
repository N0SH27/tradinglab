/* ─────────────────────────────────────────────
 * Context 派生层（V2-C1）
 *
 * 职责边界（19 号文七节锁 1）：本文件 = Read / Derivation Boundary，
 * 只持有派生逻辑，不持有任何独立状态——NOT a second canonical source。
 *
 * 铁律：
 *  · Current Context 只能由 fold(CONTEXT_HISTORY) 派生——fold 结果不得持久化；
 *  · fold 是纯函数：排序完全由条目内容（date + 同日 id 序号）决定，
 *    不依赖 CONTEXT_HISTORY 数组物理顺序（R-01 同纪律）；
 *  · sparse 语义：changes 未提及的字段 = 未变化，继承上一有效状态；
 *  · append-only 落实到 API 层（19 号文七节锁 2）：本模块不存在、
 *    也不得新增 update / delete / rewrite 历史条目的任何入口。
 * ───────────────────────────────────────────── */
import {
  CONTEXT_HISTORY,
  type ContextChanges,
  type ContextHistory,
  type ContextSnapshot,
} from './domains/context-history'

/** 同日多条 Context Revision 的确定性次序：id 以 `-N` 后缀表达同日序号（首条无后缀 = 1） */
function seqOf(id: string): number {
  // 只认 8 位日期之后的序号后缀，防止把日期数字本身误当序号
  const m = /-\d{8}-(\d+)$/.exec(id)
  return m ? parseInt(m[1], 10) : 1
}

/**
 * 全部 Context Revision 按确定性次序升序：
 * 先按 date（'YYYY.MM.DD' 字典序 = 时间序），同日按 id 序号后缀。
 * 排序完全由数据内容决定，与数组物理顺序无关。
 */
export function orderedHistory(history: readonly ContextHistory[]): ContextHistory[] {
  return [...history].sort((a, b) =>
    a.date < b.date ? -1 : a.date > b.date ? 1 : seqOf(a.id) - seqOf(b.id),
  )
}

/** sparse 合并：返回新对象，不改写入参；未提及字段原样继承 */
function applyChanges(state: ContextSnapshot, changes: ContextChanges): ContextSnapshot {
  const next: ContextSnapshot = {
    map: {
      era: changes.map?.era ? { ...state.map.era, ...changes.map.era } : state.map.era,
      nodes: { ...state.map.nodes },
    },
    now: {
      observations: changes.now?.observations ?? state.now.observations,
    },
    cycle: {
      industries: { ...state.cycle.industries, ...changes.cycle?.industries },
    },
  }
  if (changes.map?.nodes) {
    for (const [nodeId, patch] of Object.entries(changes.map.nodes)) {
      const prev = state.map.nodes[nodeId]
      if (!prev) throw new Error(`Context Revision 引用了不存在的节点 "${nodeId}"`)
      next.map.nodes[nodeId] = { ...prev, ...patch }
    }
  }
  return next
}

/**
 * CURRENT CONTEXT 的 canonical 派生入口（V2-C1，对应 18 号文三 Q4）。
 * initial snapshot（唯一全量条目）为起点，按确定性次序依次叠加 sparse changes。
 * 缺 initial = 数据契约破坏，直接抛错（由 check-data 在构建前拦截）。
 */
export function foldContext(history: readonly ContextHistory[]): ContextSnapshot {
  const ordered = orderedHistory(history)
  const initial = ordered[0]
  if (!initial?.snapshot) throw new Error('CONTEXT_HISTORY 缺 initial snapshot（首条必须为全量快照）')
  let state = initial.snapshot
  for (const h of ordered.slice(1)) {
    if (h.snapshot) throw new Error(`"${h.id}" 携带 snapshot——全量快照只允许 initial 一条`)
    if (h.changes) state = applyChanges(state, h.changes)
  }
  return state
}

/** 当前 Context（派生结果，每次调用重新 fold——不缓存、不持久化） */
export function currentContext(): ContextSnapshot {
  return foldContext(CONTEXT_HISTORY)
}

/** 全部历史 Version（确定性次序，只读事实） */
export function contextHistory(): readonly ContextHistory[] {
  return orderedHistory(CONTEXT_HISTORY)
}
