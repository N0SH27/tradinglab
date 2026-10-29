import { useState } from 'react'
import CircularCarousel from '../../components/CircularCarousel'
import type { DomainId, PrivateContent } from './hiddenTypes'

type Props = {
  content: PrivateContent
  onOpenLibrary: (domain?: DomainId) => void
  onOpenNote: (slug: string) => void
  onOpenSearch: () => void
}

export default function HiddenHome({ content, onOpenLibrary, onOpenNote, onOpenSearch }: Props) {
  const [activeNote, setActiveNote] = useState(0)
  const featured = content.notes.filter(note => note.featured).sort((a, b) => a.featuredOrder - b.featuredOrder)
  const current = featured[activeNote] ?? featured[0]
  const recent = [...content.notes].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 3)
  const frequent = [...content.notes].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 3)

  return (
    <main className="ah-private">
      <section className="ah-hero" aria-labelledby="after-hours-title">
        <p className="ah-kicker">{content.kicker}</p>
        <h1 id="after-hours-title">{content.title[0]}<br />{content.title[1]}</h1>
        <div className="ah-hero-bottom">
          <p>{content.intro}</p>
          <div className="ah-hero-actions">
            <button type="button" className="ah-command-hint" onClick={onOpenSearch}>搜索体系 <span>⌘ K</span></button>
            <button
              type="button"
              className="ah-scroll-link"
              onClick={() => document.getElementById('private-notes')?.scrollIntoView({ behavior: 'smooth' })}
            >
              探索体系 <span aria-hidden="true">↓</span>
            </button>
          </div>
        </div>
      </section>

      <section id="private-notes" className="ah-carousel-section" aria-label="精选卷宗轮播">
        <div className="ah-section-heading">
          <span>01 / SELECTED</span>
          <span>{String(featured.length).padStart(2, '0')} FEATURED</span>
        </div>
        <div className="ah-carousel-stage">
          <CircularCarousel
            items={featured.map(note => ({ src: note.src, alt: note.title, title: note.title, subtitle: note.tag }))}
            preset="cylinder"
            intro="assemble"
            cardWidth={280}
            aspectRatio={0.78}
            gap={34}
            curve={1}
            tilt={-8}
            autoplay="off"
            draggable
            momentum={0.55}
            snap
            pauseOnHover
            focusOnClick
            parallax={0.25}
            stretch={0.35}
            depthFade={0.62}
            fadeColor="#101010"
            innerShade={0.45}
            cornerRadius={0}
            captions
            onChange={setActiveNote}
          />
        </div>
        {current && (
          <div className="ah-carousel-current" aria-live="polite" aria-atomic="true">
            <span className="ah-carousel-current-index">{current.index} / CURRENT NOTE</span>
            <div>
              <p>{current.summary}</p>
              <button type="button" className="ah-inline-link" onClick={() => onOpenNote(current.slug)}>打开卷宗 →</button>
            </div>
          </div>
        )}
        <p className="ah-carousel-help">DRAG / ← → / CLICK TO EXPLORE</p>
      </section>

      <section className="ah-system-section" aria-labelledby="ah-system-title">
        <div className="ah-section-heading">
          <span id="ah-system-title">02 / SYSTEM MAP</span>
          <span>{String(content.domains.length).padStart(2, '0')} DOMAINS</span>
        </div>
        <div className="ah-domain-index">
          {content.domains.map(domain => {
            const count = content.notes.filter(note => note.domain === domain.id).length
            return (
              <button key={domain.id} type="button" className="ah-domain-row" onClick={() => onOpenLibrary(domain.id)}>
                <span className="ah-domain-number">{domain.index}</span>
                <span className="ah-domain-name">{domain.name}<small>{domain.description}</small></span>
                <span className="ah-domain-count">{String(count).padStart(2, '0')} ENTRIES</span>
                <span className="ah-domain-english">{domain.english}</span>
                <span className="ah-domain-arrow" aria-hidden="true">→</span>
              </button>
            )
          })}
        </div>
      </section>

      <section className="ah-path-section" aria-labelledby="ah-path-title">
        <div className="ah-section-heading">
          <span>03 / CURRENT PATH</span>
          <span>{content.currentPath.progress}</span>
        </div>
        <div className="ah-path-grid">
          <h2 id="ah-path-title">{content.currentPath.title}</h2>
          <div className="ah-path-current">
            <span>当前课程</span>
            <p>{content.currentPath.current}</p>
            <button type="button" className="ah-inline-link" onClick={() => onOpenNote(content.currentPath.targetSlug)}>继续学习 →</button>
          </div>
        </div>
        <ol className="ah-path-steps">
          {content.currentPath.steps.map((step, index) => (
            <li key={step.label} className={`is-${step.state}`}>
              <span>{step.state === 'done' ? '✓' : String(index + 1).padStart(2, '0')}</span>{step.label}
            </li>
          ))}
        </ol>
      </section>

      <section className="ah-recent-section" aria-label="最近修订与高频回看">
        <div className="ah-section-heading"><span>04 / RECENT</span><span>RETURN & REVISE</span></div>
        <div className="ah-recent-grid">
          <div>
            <h2>最近修订</h2>
            {recent.map(note => (
              <button key={note.slug} type="button" className="ah-recent-row" onClick={() => onOpenNote(note.slug)}>
                <span>{note.title}</span><span>{note.updatedAt.replaceAll('-', '.')}</span>
              </button>
            ))}
          </div>
          <div>
            <h2>高频回看</h2>
            {frequent.map(note => (
              <button key={note.slug} type="button" className="ah-recent-row" onClick={() => onOpenNote(note.slug)}>
                <span>{note.title}</span><span>{String(note.reviewCount).padStart(2, '0')} 次</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <footer className="ah-footer">
        <span>NOT INDEXED / NOT IN NAVIGATION</span>
        <button type="button" onClick={() => onOpenLibrary()}>进入完整资料库 →</button>
        <span>HSN · TRADINGLABB</span>
      </footer>
    </main>
  )
}
