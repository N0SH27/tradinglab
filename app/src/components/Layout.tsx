import React, { useState } from 'react'
import { NAV, SITE, ARCHIVE_TREE } from '../data/content'
import { Label } from './Bits'
import { HSNSeal, HSNSymbol } from './Brand'

/* 视觉 lockup「trading·lab BY HSN」= Founder Signature（V2-06-00 裁决 A）：
   与 canonical brand（SITE.name = 'TradingLabb'）正式解耦——
   Header wordmark 永远渲染此字面量，不消费 SITE.name，不随 canonical brand 变化。
   字面量保持原 'trading-lab' 形态（配合 lowercase class，像素级不变）。 */
const HEADER_LOCKUP = 'trading-lab'

function Header({ path }: { path: string }) {
  const [open, setOpen] = useState(false)
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-paper hairline-b">
      <div className="max-w-[1400px] mx-auto px-5 md:px-10 h-14 flex items-center justify-between">
        <a href="#/" className="flex items-center gap-2.5 group" onClick={() => setOpen(false)}>
          <HSNSymbol size={22} />
          <span className="font-mono-num font-medium tracking-tight text-base lowercase">{HEADER_LOCKUP}</span>
          <span className="label-sm hidden xl:inline">by {SITE.author}</span>
        </a>
        <nav className="hidden lg:flex items-stretch gap-5 self-stretch">
          {NAV.map((n) =>
            'children' in n ? (
              <div key={n.label} className="nav-group relative group flex items-center">
                <span
                  tabIndex={0}
                  role="button"
                  aria-haspopup="true"
                  aria-label={`${n.label}栏目`}
                  className={`ink-hv text-xs leading-none tracking-[0.2em] cursor-default ${
                    n.children.some((c) => c.path === path) ? 'ink font-medium' : 'ink-3 hover:ink'
                  }`}
                >
                  {n.label}
                </span>
                <div className="nav-panel absolute left-1/2 -translate-x-1/2 top-full hidden group-hover:block group-focus-within:block">
                  <div className="mt-2.5 bg-paper border border-[rgb(var(--line))] min-w-36 py-1.5">
                    {n.children.map((c) => (
                      <a
                        key={c.path}
                        href={`#${c.path}`}
                        className={`ink-hv flex items-baseline justify-between gap-7 px-4 py-2.5 text-xs tracking-[0.2em] whitespace-nowrap ${
                          path === c.path ? 'ink font-medium' : 'ink-3 hover:ink'
                        }`}
                      >
                        <span>{c.label}</span>
                        <span className="label-sm">{c.en}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <a
                key={n.path}
                href={`#${n.path}`}
                className={`flex items-center text-xs leading-none tracking-[0.2em] ${
                  path === n.path ? 'ink font-medium' : 'ink-3 hover:ink'
                }`}
              >
                <span className="ink-hv">{n.label}</span>
              </a>
            )
          )}
        </nav>
        <button
          className="lg:hidden text-xs tracking-[0.2em] ink-2"
          onClick={() => setOpen(!open)}
          aria-label="菜单"
        >
          {open ? '关闭' : '目录'}
        </button>
      </div>
      {open && (
        <>
          {/* 纸面遮蔽层：抽屉展开时压住下方页面，点击任意处收起 */}
          <div
            className="fixed inset-0 top-14 z-40 lg:hidden bg-[rgb(var(--paper)/0.88)]"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <nav className="relative z-50 lg:hidden hairline-t bg-paper max-h-[70vh] overflow-y-auto">
            {NAV.map((n) =>
              'children' in n ? (
                <div key={n.label}>
                  <div
                    className={`flex items-center justify-between px-5 py-3.5 hairline-b text-sm tracking-widest ${
                      n.children.some((c) => c.path === path) ? 'ink font-medium' : 'ink-3'
                    }`}
                  >
                    <span>{n.label}</span>
                    <span className="label-sm">{n.en}</span>
                  </div>
                  {n.children.map((c) => (
                    <a
                      key={c.path}
                      href={`#${c.path}`}
                      onClick={() => setOpen(false)}
                      className={`flex items-center justify-between pl-9 pr-5 py-3.5 hairline-b text-sm tracking-widest ${
                        path === c.path ? 'ink font-medium' : 'ink-3'
                      }`}
                    >
                      <span>{c.label}</span>
                      <span className="label-sm">{c.en}</span>
                    </a>
                  ))}
                </div>
              ) : (
                <a
                  key={n.path}
                  href={`#${n.path}`}
                  onClick={() => setOpen(false)}
                  className={`flex items-center justify-between px-5 py-3.5 hairline-b text-sm tracking-widest ${
                    path === n.path ? 'ink font-medium' : 'ink-3'
                  }`}
                >
                  <span>{n.label}</span>
                  <span className="label-sm">{n.en}</span>
                </a>
              )
            )}
          </nav>
        </>
      )}
    </header>
  )
}

function Footer() {
  return (
    <footer className="hairline-t mt-24 md:mt-32">
      {/* 知识归档树 */}
      <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-16 md:py-20">
        <div className="flex items-baseline gap-x-4 gap-y-2 mb-10 flex-wrap">
          <Label>ARCHIVE · 知识树</Label>
          <span className="text-xs ink-3 shrink-0">内容最终沉淀为一棵树，而非时间流</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-6 gap-y-10">
          {ARCHIVE_TREE.map((node) => (
            <div key={node.name}>
              <div className="font-serif-sc font-bold text-sm tracking-widest mb-3 hairline-b pb-2">
                {node.name}
              </div>
              <ul className="space-y-2">
                {node.children.map((c) => (
                  <li key={c} className="text-xs leading-relaxed ink-3">{c}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="hairline-t">
        <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <HSNSeal size={30} tone="cinnabar" />
              <span className="font-mono-num font-medium text-xl tracking-[0.08em]">{SITE.author}</span>
              <span className="label-sm">· {SITE.name}</span>
            </div>
            <p className="text-xs leading-relaxed ink-3 max-w-md">{SITE.disclaimer}</p>
          </div>
          <div className="text-left md:text-right">
            <p className="font-serif-sc text-sm tracking-[0.2em] mb-2">{SITE.motto}</p>
            <p className="label-sm">CONTINUOUSLY UPDATED · SINCE 2026</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default function Layout({ path, children }: { path: string; children: React.ReactNode }) {
  return (
    <div id="page-root" className="min-h-screen flex flex-col relative z-[1] bg-paper">
      <Header path={path} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
