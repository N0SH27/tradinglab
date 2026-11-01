import Report7 from '../research/Report7'
import Report8 from '../research/Report8'

export const HIDDEN_REPORTS = {
  'report-7': {
    title: '中国 AI：更多增长，更少再通胀',
    component: Report7,
    backHref: '#/after-hours/research/industry-macro',
    backLabel: '返回产业与宏观',
  },
  'report-8': {
    title: 'Anthropic：AI 如何重构工作与就业',
    component: Report8,
    backHref: '#/after-hours/research/company-business',
    backLabel: '返回公司与商业模式',
  },
} as const

export default function HiddenReport({ id }: { id: string }) {
  const report = HIDDEN_REPORTS[id as keyof typeof HIDDEN_REPORTS]
  if (!report) {
    return (
      <main className="ah-workspace ah-note-not-found">
        <span>404 / RESEARCH NOT FOUND</span>
        <h1>这份研究档案不存在。</h1>
        <a className="ah-inline-link" href="#/after-hours/collection/research">返回研究分类 →</a>
      </main>
    )
  }

  const Report = report.component
  return (
    <main className="ah-workspace ah-report-page">
      <a className="ah-note-back ah-report-back" href={report.backHref}>← {report.backLabel}</a>
      <Report />
    </main>
  )
}
