/* ─────────────────────────────────────────────
 * 历史方向感知与页面层级
 *
 * 给每个站内历史条目打序号标签（history.state），
 * 使浏览器原生前进/后退可被 popstate 识别方向，
 * 从而套用与自定义返回一致的「收束」过渡。
 *
 * parentOf：站点以扁平结构为主，天然层级仅两处——
 * 文章详情 → 文集；单命题 → 命题聚合（V2-05 T-5）。
 * 返回按钮与滑动返回只在其上出现，
 * 不在一级页面无条件显示。
 * ───────────────────────────────────────────── */

const KEY = 'hsn'
let idx = 0

const cur = () => window.location.hash.replace(/^#/, '') || '/'

/** 首屏：给当前历史条目打上 0 号标签 */
export function initNavTag() {
  idx = 0
  history.replaceState({ [KEY]: 0, path: cur() }, '')
}

/** 站内跳转换页后调用：新条目序号 +1（须紧跟 location.hash 赋值，同步生效） */
export function tagPush() {
  idx += 1
  history.replaceState({ [KEY]: idx, path: cur() }, '')
}

/** popstate 时调用：更新内部序号并给出方向 */
export function popDirection(e: PopStateEvent): 'back' | 'fwd' {
  const st = e.state?.[KEY]
  if (typeof st !== 'number') return 'back'
  const dir = st < idx ? 'back' : 'fwd'
  idx = st
  return dir
}

/** 当前路径的明确上一层级；一级页面返回 null */
export function parentOf(p: string): string | null {
  if (p.startsWith('/essays/')) return '/essays'
  if (p.startsWith('/thesis/')) return '/thesis'
  return null
}
