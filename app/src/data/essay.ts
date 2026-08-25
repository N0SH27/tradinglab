/* ─────────────────────────────────────────────
 * Essay 派生层（V2-C4）
 *
 * 职责边界（21 号文七节）：本文件 = Essay History / Current Essay Read Boundary，
 * 只持有读取与派生逻辑，不持有任何独立状态——NOT a second canonical source。
 * 不得演化成 Essay Repository / Service / Manager / Version Engine；
 * 不得形成 ESSAYS ↕ essay.ts ↕ ESSAY_VERSIONS 三角依赖。
 *
 * 铁律：
 *  · Current Essay 的唯一来源是 ESSAYS（essays.ts）——本文件只做定位读取，
 *    不存在 ESSAY_VERSIONS → derive Current 的方向（LOCK-C4-01）；
 *  · essayHistory 排序完全由 version 序号决定，不依赖数组物理顺序；
 *  · append-only 落实到 API 层：本模块不存在、也不得新增
 *    update / delete / rewrite 历史 Version 的任何入口；
 *  · 与 C1 机制零共享：本文件没有 fold / sparse / previous / delta / direction。
 * ───────────────────────────────────────────── */
import { ESSAYS, type Essay } from './domains/essays'
import { ESSAY_VERSIONS, type EssayVersion } from './domains/essay-versions'

/**
 * 某篇作品的全部历史 Version，按 version 序号升序。
 * 排序完全由数据内容决定，与 ESSAY_VERSIONS 数组物理顺序无关。
 */
export function versionsOf(
  versions: readonly EssayVersion[],
  essayId: string,
): EssayVersion[] {
  return versions
    .filter((v) => v.essayId === essayId)
    .sort((a, b) => a.version - b.version)
}

/** 该篇全部历史 Version（确定性次序，只读事实） */
export function essayHistory(essayId: string): readonly EssayVersion[] {
  return versionsOf(ESSAY_VERSIONS, essayId)
}

/** 该篇最新 Version（用于一致性断言；Current 本身仍以 ESSAYS 为准） */
export function latestVersionOf(
  versions: readonly EssayVersion[],
  essayId: string,
): EssayVersion | undefined {
  const vs = versionsOf(versions, essayId)
  return vs[vs.length - 1]
}

/**
 * 当前作品（= ESSAYS 中的条目本身）。
 * ESSAYS 是 Current Canonical Work Source——本函数只是定位读取，不是派生。
 */
export function currentEssay(essayId: string): Essay | undefined {
  return ESSAYS.find((e) => e.id === essayId)
}
