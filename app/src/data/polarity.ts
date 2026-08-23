/* ─────────────────────────────────────────────
 * Polarity 推导（V2-04.5 Canonical Contract）
 *
 * MapNode.state 是全站 polarity 唯一事实源（SSOT）。
 * 禁止在 Thesis interface 加 polarity 字段；
 * 禁止组件内部自行推导；本文件是唯一入口。
 *
 * 推导规则（deterministic，不丢信息）：
 *   无关联节点          → null（不显示极性）
 *   全部相同            → single（YANG / YIN / TURN）
 *   含 turn 且其余一致  → to-turn（YANG → TURN / YIN → TURN）
 *   阴阳混合            → mixed（阴·阳并陈，不强行收敛）
 * ───────────────────────────────────────────── */
import type { Thesis } from './domains/theses'
import type { MapNode } from './domains/map'

export type PolarityState = 'yin' | 'turn' | 'yang'

export type DerivedPolarity =
  | { kind: 'single'; state: PolarityState }
  | { kind: 'to-turn'; from: 'yang' | 'yin' }
  | { kind: 'mixed' }

export function derivePolarity(states: PolarityState[]): DerivedPolarity | null {
  if (states.length === 0) return null
  if (states.every((s) => s === states[0])) return { kind: 'single', state: states[0] }
  const nonTurn = [...new Set(states.filter((s) => s !== 'turn'))]
  if (nonTurn.length === 1) return { kind: 'to-turn', from: nonTurn[0] }
  return { kind: 'mixed' }
}

export function deriveThesisPolarity(thesis: Thesis, nodes: MapNode[]): DerivedPolarity | null {
  const byId = new Map(nodes.map((n) => [n.id, n]))
  const states = (thesis.nodes ?? [])
    .map((id) => byId.get(id)?.state)
    .filter((s): s is PolarityState => s !== undefined)
  return derivePolarity(states)
}

/** 展示文案；null 表示无关联节点、不显示 */
export function formatPolarity(p: DerivedPolarity | null): string | null {
  if (!p) return null
  if (p.kind === 'single') return p.state.toUpperCase()
  if (p.kind === 'to-turn') return `${p.from.toUpperCase()} → TURN`
  return 'MIXED'
}
