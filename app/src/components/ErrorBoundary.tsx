import React from 'react'
import { HSNSeal } from './Brand'

/* ─────────────────────────────────────────────
 * 错误边界：数据文件写错一个逗号，也不许整站白屏。
 * 崩溃时以品牌化兜底页接住（印章 + 墨染提示 + 返回目录），
 * 同时把错误打进控制台供排查。
 * ───────────────────────────────────────────── */

interface State {
  error: Error | null
}

export class ErrorBoundary extends React.Component<React.PropsWithChildren, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[trading-lab] 页面渲染失败：', error, info.componentStack)
  }

  render() {
    if (this.state.error) {
      return (
        <main className="min-h-[70vh] flex items-center justify-center px-6">
          <div className="text-center">
            <div className="flex justify-center mb-8 opacity-80">
              <HSNSeal size={64} tone="cinnabar" />
            </div>
            <p className="font-serif-sc font-bold text-2xl md:text-3xl tracking-wide mb-3">此页墨染</p>
            <p className="text-sm ink-2 mb-1">页面渲染时出了错——多半是某份档案数据的笔误。</p>
            <p className="font-mono-num text-xs ink-3 mb-10 break-all max-w-md mx-auto">
              {this.state.error.message}
            </p>
            <a href="#/" className="btn-line" onClick={() => this.setState({ error: null })}>
              返回目录 →
            </a>
          </div>
        </main>
      )
    }
    return this.props.children
  }
}
