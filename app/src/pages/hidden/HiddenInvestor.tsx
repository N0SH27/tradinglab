import { useEffect } from 'react'
import type { InvestorProfile } from './hiddenTypes'

type Props = {
  profile: InvestorProfile
  profiles: InvestorProfile[]
  onBack: () => void
  onOpenInvestor: (id: string) => void
}

function PrincipleList({ items }: { items: string[] }) {
  return <ol>{items.map(item => <li key={item}>{item}</li>)}</ol>
}

export default function HiddenInvestor({ profile, profiles, onBack, onOpenInvestor }: Props) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [profile.id])

  const current = profiles.findIndex(item => item.id === profile.id)
  const next = profiles[(current + 1) % profiles.length]
  const sections = [
    { title: '核心框架', english: 'FRAMEWORK', items: profile.framework },
    { title: '决策与仓位思路', english: 'DECISION PROCESS', items: profile.execution },
    { title: '风险与适用边界', english: 'RISK BOUNDARIES', items: profile.risks },
    { title: '复盘问题', english: 'REVIEW QUESTIONS', items: profile.checklist },
  ]

  return (
    <main className="ah-workspace ah-investor-page">
      <button type="button" className="ah-note-back" onClick={onBack}>← 投资者框架目录</button>
      <header className="ah-investor-header">
        <div className="ah-investor-portrait">
          <img src={profile.src} alt={profile.kind === '公开人物' ? `${profile.name}公开照片` : `${profile.name}论坛 ID 姓名字卡`} />
        </div>
        <div className="ah-investor-title">
          <span className="ah-kicker">PLAYBOOK / {profile.index} · {profile.english}</span>
          <h1>{profile.name}</h1>
          <p className="ah-investor-focus">{profile.focus}</p>
          <p>{profile.summary}</p>
          <div className="ah-investor-identity"><span>{profile.kind}</span><span>历史资料 / 编辑归纳</span></div>
        </div>
      </header>

      <div className="ah-investor-layout">
        <aside className="ah-investor-aside">
          <span>SOURCE & CONTEXT</span>
          <div className="ah-investor-sources">
            {profile.sources.map(source => (
              <article key={`${source.label}-${source.locator}`}>
                <h2>{source.label}</h2>
                <p>{source.locator}</p>
                {source.url && <a href={source.url} target="_blank" rel="noreferrer">访问公开来源 ↗</a>}
              </article>
            ))}
          </div>
          {profile.photoSource && <p className="ah-investor-photo-source">照片来源：<a href={profile.photoSource.url} target="_blank" rel="noreferrer">{profile.photoSource.label} ↗</a></p>}
        </aside>

        <article className="ah-investor-article">
          {profile.era && <p className="ah-investor-era">{profile.era}</p>}
          {sections.map((section, index) => (
            <section key={section.title}>
              <div className="ah-note-section-heading">
                <span>{String(index + 1).padStart(2, '0')}</span>
                <h2>{section.title}<small>{section.english}</small></h2>
              </div>
              <PrincipleList items={section.items} />
            </section>
          ))}
          <p className="ah-investor-disclaimer">{profile.attribution}</p>
        </article>
      </div>

      <footer className="ah-investor-footer">
        <button type="button" onClick={onBack}>← 全部 {profiles.length} 份档案</button>
        {next && <button type="button" onClick={() => onOpenInvestor(next.id)}><span>下一份 / {next.index}</span>{next.name} →</button>}
      </footer>
    </main>
  )
}
