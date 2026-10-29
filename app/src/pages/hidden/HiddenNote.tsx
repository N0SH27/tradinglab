import { DOMAIN_LABELS, NOTE_TYPE_LABELS, type PrivateContent } from './hiddenTypes'

type Props = {
  content: PrivateContent
  slug: string
  onBack: () => void
  onOpenNote: (slug: string) => void
}

export default function HiddenNote({ content, slug, onBack, onOpenNote }: Props) {
  const note = content.notes.find(item => item.slug === slug)
  if (!note) {
    return <main className="ah-workspace ah-note-not-found"><span>404 / NOTE NOT FOUND</span><h1>这份卷宗不存在。</h1><button type="button" className="ah-inline-link" onClick={onBack}>返回资料库 →</button></main>
  }
  const related = note.relatedSlugs.map(relatedSlug => content.notes.find(item => item.slug === relatedSlug)).filter(item => item !== undefined)

  return (
    <main className="ah-workspace ah-note-page">
      <button type="button" className="ah-note-back" onClick={onBack}>← 返回资料库</button>
      <header className="ah-note-header">
        <span className="ah-kicker">{note.index} / {note.tag}</span>
        <h1>{note.title}</h1>
        <p>{note.summary}</p>
        <div><span>{DOMAIN_LABELS[note.domain]}</span><span>{NOTE_TYPE_LABELS[note.type]}</span><span>{note.readingMinutes} MIN READ</span><span>UPDATED {note.updatedAt.replaceAll('-', '.')}</span></div>
      </header>

      <div className="ah-note-layout">
        <aside className="ah-note-metadata">
          <span>METADATA</span>
          <dl>
            <div><dt>体系域</dt><dd>{DOMAIN_LABELS[note.domain]}</dd></div>
            <div><dt>内容类型</dt><dd>{NOTE_TYPE_LABELS[note.type]}</dd></div>
            <div><dt>整理状态</dt><dd>{note.status === 'verified' ? '已验证' : '整理中'}</dd></div>
            <div><dt>主题</dt><dd>{note.topics.join(' / ')}</dd></div>
          </dl>
        </aside>

        <article className="ah-note-article">
          {note.sections.map((section, index) => (
            <section key={section.heading} id={`note-section-${index}`}>
              <div className="ah-note-section-heading"><span>{String(index + 1).padStart(2, '0')}</span><h2>{section.heading}</h2></div>
              {section.text && <p>{section.text}</p>}
              {section.items && <ol>{section.items.map(item => <li key={item}>{item}</li>)}</ol>}
            </section>
          ))}
        </article>

        <aside className="ah-note-aside">
          <nav aria-label="本文目录"><span>CONTENTS</span>{note.sections.map((section, index) => <button key={section.heading} type="button" onClick={() => document.getElementById(`note-section-${index}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}><span>{String(index + 1).padStart(2, '0')}</span>{section.heading}</button>)}</nav>
          <div className="ah-related-notes"><span>LINKED NOTES / {String(related.length).padStart(2, '0')}</span>{related.map(item => <button type="button" key={item.slug} onClick={() => onOpenNote(item.slug)}><small>{item.index} / {NOTE_TYPE_LABELS[item.type]}</small><strong>{item.title}</strong><span>→</span></button>)}</div>
        </aside>
      </div>
      <footer className="ah-note-footer"><span>END OF NOTE / {note.index}</span><button type="button" onClick={onBack}>继续探索资料库 →</button></footer>
    </main>
  )
}
