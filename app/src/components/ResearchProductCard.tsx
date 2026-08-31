/* ── ResearchProductCard（Research Product Presentation Layer · FOCUS 卡）────
 * 纯 UI/Presentation 组件：零 Entity / 零 Schema / 零数据层。
 * 设计契约（任务提示词 §4–§9 / §17–§18）：
 * · Default = Recognition（符号 + 名称 + 类型）；Hover = Orientation（一句话 + 状态 + 入口）
 * · Hover 反转 = 纸墨阴阳翻转（bg ink / text paper），150–250ms，禁缩放旋转弹跳
 * · 符号 = TradingLabb Flat Symbol System：单色、几何、抽象隐喻，服务研究概念而非行业实物
 * · 状态语言只用 Research Active / Thesis Revised 等研究状态，禁用买卖评级语言
 * · 可及性：keyboard focus-visible / focus-within 同效，motion-reduce 降级 */

export type FocusSymbol = 'compute' | 'cycle' | 'power'

/* Flat Symbol System — 48 viewBox，stroke = currentColor，随反转自动换色 */
function Symbol({ kind, className = '' }: { kind: FocusSymbol; className?: string }) {
  const common = {
    viewBox: '0 0 48 48',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.5,
    className,
    'aria-hidden': true as const,
  }
  if (kind === 'compute')
    /* 算力：芯片的抽象——方、针脚、核心节点（不画真实 GPU） */
    return (
      <svg {...common}>
        <rect x="12" y="12" width="24" height="24" />
        <circle cx="24" cy="24" r="3" fill="currentColor" stroke="none" />
        <path d="M24 4v8M24 36v8M4 24h8M36 24h8" />
      </svg>
    )
  if (kind === 'cycle')
    /* 周期：环 + 穿过环的波（Cycle，不画硬盘） */
    return (
      <svg {...common}>
        <circle cx="24" cy="24" r="15" />
        <path d="M9 24q3.75-6 7.5 0t7.5 0t7.5 0t7.5 0" />
      </svg>
    )
  /* 电力约束：闪电落于基线——能量与它的边界（不画电线杆） */
  return (
    <svg {...common}>
      <path d="M27 6L17 26h7l-5 16 13-22h-7l2-14z" strokeLinejoin="round" />
      <path d="M8 44h32" />
    </svg>
  )
}

export interface ResearchProductCardProps {
  symbol: FocusSymbol
  name: string
  type: string      // e.g. 'THESIS · ACTIVE' / 'THESIS · REVISED 2026.08' / 'REPORT · ACTIVE'
  question: string  // hover 第二层：一句研究问题
  href: string
}

export function ResearchProductCard({ symbol, name, type, question, href }: ResearchProductCardProps) {
  return (
    <a
      href={href}
      aria-label={`${name}：${question}`}
      className="group relative block min-h-[300px] md:min-h-[360px] border border-[rgb(var(--line))] bg-paper overflow-hidden transition-all duration-200 motion-reduce:transition-none hover:-translate-y-0.5 motion-reduce:hover:translate-y-0 hover:bg-[rgb(var(--ink))] hover:border-[rgb(var(--ink))] focus-visible:outline-2 focus-visible:outline-[rgb(var(--cinnabar))]"
    >
      {/* Default · Recognition */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-7 p-8 text-center transition-opacity duration-200 group-hover:opacity-0 group-focus-within:opacity-0">
        <Symbol kind={symbol} className="w-16 h-16 text-[rgb(var(--ink))]" />
        <span className="font-serif-sc font-bold text-xl md:text-2xl tracking-tight">{name}</span>
        <span className="label-sm ink-3">{type}</span>
      </div>

      {/* Hover · Orientation（纸墨反转后的信息简览：最多 3–4 行） */}
      <div className="absolute inset-0 flex flex-col justify-between p-7 md:p-8 text-[rgb(var(--paper))] opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100">
        <div>
          <span className="label-sm block mb-5 text-[rgb(var(--paper))]/60">{type}</span>
          <span className="font-serif-sc font-bold text-xl md:text-2xl tracking-tight block mb-4">{name}</span>
          <p className="text-sm leading-loose text-[rgb(var(--paper))]/75">{question}</p>
        </div>
        <span className="font-mono-num text-xs tracking-[0.2em] text-[rgb(var(--paper))]/80">
          → 进入研究
        </span>
      </div>
    </a>
  )
}
