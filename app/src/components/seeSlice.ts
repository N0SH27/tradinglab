import { MAP_EDGES, type MapNode } from '../data/domains/map'
import type { PolarityState } from './PolarityInstrument'

/* ── SEE 场景切片共享（原 MapPreview.tsx，2026-09-06 Phase 5 退役迁入）──────────
 * 唯一消费方：PolarityXiao（SEE 场景右侧 · 阴阳 × 洞箫）。
 * SLICE / CHAIN 是首页从既有 Map 数据选择的展示切片（7 节点 6 真边），
 * 属于 Presentation 层，不属于数据层；map.ts / polarity.ts 零依赖本文件。 */

export const SLICE: string[] = ['gpu', 'hbm', 'cowos', 'optical', 'server', 'idc', 'power']
export const CHAIN: [string, string][] = [
  ['gpu', 'hbm'],
  ['hbm', 'cowos'],
  ['cowos', 'optical'],
  ['optical', 'server'],
  ['server', 'idc'],
  ['idc', 'power'],
]

/* 真边校验（契约保留）：切片链必须是 MAP_EDGES 的真实边；断裂时不绘制 */
export const EDGE_OK = CHAIN.every(([a, b]) =>
  MAP_EDGES.some(([x, y]) => (x === a && y === b) || (x === b && y === a)),
)
if (!EDGE_OK && typeof console !== 'undefined') {
  console.error('[seeSlice] chain edge missing from MAP_EDGES — Contract violation, no false axis drawn')
}

export const STATE_ZH: Record<PolarityState, string> = { yang: '阳', turn: '转换中', yin: '阴' }
export const STATE_COLOR: Record<PolarityState, string> = {
  yang: 'rgb(var(--ink))',
  turn: 'rgb(var(--cinnabar))',
  yin: 'rgb(var(--water))',
}

/* Primary Home 分流（V2-C.1 §12.1）：有命题 → 命题页；无命题 → 完整 /map */
export function primaryHomeOf(n: MapNode): { href: string; label: string } {
  const t = n.theses?.[0]
  return t
    ? { href: `#/thesis/${t}`, label: 'EXPLORE →' }
    : { href: '#/map', label: 'EXPLORE WORLD →' }
}
