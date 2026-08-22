/* ─────────────────────────────────────────────
 * 返回 = 收束
 *
 * 极细左向线性符号 + 极简文字，默认极低存在感。
 * hover：箭头轻微左移、向左拖出一线淡墨尾迹、
 * 周围泛起极浅墨晕——「回去的方向已经被打开」。
 *
 * 仅在存在明确上一层级的页面出现（当前：文章详情 → 文集）。
 * 桌面展示；移动端由左缘右滑手势承担（SwipeBack）。
 * 点击由 InkTransition 识别 data-ink-back，播放反向收束过渡。
 * ───────────────────────────────────────────── */

export function BackNav({ to, label }: { to: string; label: string }) {
  return (
    <a href={`#${to}`} data-ink-back className="ink-back" aria-label={`返回${label}`}>
      <span className="bk-arrow" aria-hidden="true">
        <svg width="30" height="8" viewBox="0 0 30 8" fill="none" className="block">
          <path d="M30 4H5M5 4l4.5-3M5 4l4.5 3" stroke="currentColor" strokeWidth="1" />
        </svg>
        <span className="bk-trail" aria-hidden="true" />
      </span>
      <span className="bk-text font-mono-num">BACK</span>
      <span className="bk-text ink-3">· {label}</span>
    </a>
  )
}
