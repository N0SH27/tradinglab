import { useMemo, useState } from 'react'
import { DOMAIN_LABELS, NOTE_TYPE_LABELS, type DomainId, type NoteType, type PrivateContent, type PrivateNote } from './hiddenTypes'

type Props = {
  content: PrivateContent
  initialDomain: DomainId | 'all'
  onOpenNote: (slug: string) => void
  onOpenSearch: () => void
}

function noteSearchText(note: PrivateNote) {
  return [note.title, note.summary, note.tag, ...note.topics, ...note.sections.flatMap(section => [section.heading, section.text ?? '', ...(section.items ?? [])])]
    .join(' ').toLocaleLowerCase()
}

export default function HiddenLibrary({ content, initialDomain, onOpenNote, onOpenSearch }: Props) {
  const [query, setQuery] = useState('')
  const [domain, setDomain] = useState<DomainId | 'all'>(initialDomain)
  const [type, setType] = useState<NoteType | 'all'>('all')
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [selectedSlug, setSelectedSlug] = useState(() => content.notes.find(note => initialDomain === 'all' || note.domain === initialDomain)?.slug ?? content.notes[0]?.slug ?? '')

  const filtered = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase()
    return content.notes.filter(note => {
      if (domain !== 'all' && note.domain !== domain) return false
      if (type !== 'all' && note.type !== type) return false
      if (verifiedOnly && note.status !== 'verified') return false
      return !needle || noteSearchText(note).includes(needle)
    })
  }, [content.notes, domain, query, type, verifiedOnly])

  const selected = filtered.find(note => note.slug === selectedSlug) ?? filtered[0]
  const clearFilters = () => { setQuery(''); setDomain('all'); setType('all'); setVerifiedOnly(false) }
  const selectNote = (slug: string) => {
    if (window.matchMedia('(max-width: 900px)').matches) onOpenNote(slug)
    else setSelectedSlug(slug)
  }

  return (
    <main className="ah-workspace ah-library">
      <div className="ah-workspace-heading">
        <div><span>AFTER HOURS / LIBRARY</span><h1>体系资料库</h1></div>
        <div className="ah-library-heading-meta"><span>{String(filtered.length).padStart(2, '0')} / {String(content.notes.length).padStart(2, '0')} ENTRIES</span><button type="button" onClick={onOpenSearch}>全局搜索 ⌘ K</button></div>
      </div>

      <button type="button" className="ah-filter-toggle" onClick={() => setFiltersOpen(open => !open)} aria-expanded={filtersOpen}>
        筛选与搜索 <span>{filtersOpen ? '−' : '+'}</span>
      </button>

      <div className="ah-library-grid">
        <aside className={`ah-library-filters ${filtersOpen ? 'is-open' : ''}`} aria-label="资料库筛选">
          <label className="ah-filter-search">SEARCH<input value={query} onChange={event => setQuery(event.target.value)} placeholder="输入关键词……" /></label>
          <fieldset>
            <legend>DOMAIN / 体系域</legend>
            <button type="button" className={domain === 'all' ? 'is-active' : ''} onClick={() => setDomain('all')}><span>全部内容</span><span>{content.notes.length}</span></button>
            {content.domains.map(item => (
              <button key={item.id} type="button" className={domain === item.id ? 'is-active' : ''} onClick={() => setDomain(item.id)}>
                <span>{item.name}</span><span>{content.notes.filter(note => note.domain === item.id).length}</span>
              </button>
            ))}
          </fieldset>
          <fieldset>
            <legend>TYPE / 类型</legend>
            <div className="ah-type-filter">
              <button type="button" className={type === 'all' ? 'is-active' : ''} onClick={() => setType('all')}>全部</button>
              {(Object.keys(NOTE_TYPE_LABELS) as NoteType[]).map(item => (
                <button key={item} type="button" className={type === item ? 'is-active' : ''} onClick={() => setType(item)}>{NOTE_TYPE_LABELS[item]}</button>
              ))}
            </div>
          </fieldset>
          <label className="ah-verified-filter"><input type="checkbox" checked={verifiedOnly} onChange={event => setVerifiedOnly(event.target.checked)} /><span>仅看已验证内容</span></label>
          <button type="button" className="ah-clear-filters" onClick={clearFilters}>清除全部筛选</button>
        </aside>

        <section className="ah-library-results" aria-label="内容索引">
          <div className="ah-results-header"><span>INDEX / TITLE</span><span>TYPE / READ</span></div>
          {filtered.map(note => (
            <button key={note.slug} type="button" className={`ah-library-row ${selected?.slug === note.slug ? 'is-selected' : ''}`} onClick={() => selectNote(note.slug)}>
              <span className="ah-library-row-index">{note.index}</span>
              <span className="ah-library-row-title"><strong>{note.title}</strong><small>{note.topics.join(' · ')} / {DOMAIN_LABELS[note.domain]}</small></span>
              <span className="ah-library-row-meta">{NOTE_TYPE_LABELS[note.type]}<small>{note.readingMinutes} MIN</small></span>
              <span className="ah-library-row-arrow" aria-hidden="true">→</span>
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="ah-library-empty"><p>当前条件下没有内容。</p><button type="button" className="ah-inline-link" onClick={clearFilters}>清除筛选 →</button></div>
          )}
        </section>

        <aside className="ah-library-preview" aria-label="内容预览">
          {selected ? (
            <div key={selected.slug}>
              <span className="ah-preview-index">{selected.index} / {NOTE_TYPE_LABELS[selected.type]}</span>
              <h2>{selected.title}</h2>
              <p className="ah-preview-summary">{selected.summary}</p>
              {selected.sections.slice(0, 2).map(section => (
                <section key={section.heading}>
                  <h3>{section.heading}</h3>
                  {section.text && <p>{section.text}</p>}
                  {section.items && <ul>{section.items.slice(0, 3).map(item => <li key={item}>{item}</li>)}</ul>}
                </section>
              ))}
              <div className="ah-preview-related"><span>关联内容</span><strong>{String(selected.relatedSlugs.length).padStart(2, '0')}</strong></div>
              <button type="button" className="ah-preview-open" onClick={() => onOpenNote(selected.slug)}>打开完整内容 <span>→</span></button>
            </div>
          ) : <p className="ah-preview-empty">选择一条内容开始阅读。</p>}
        </aside>
      </div>
    </main>
  )
}
