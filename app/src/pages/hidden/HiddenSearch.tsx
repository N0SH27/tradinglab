import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { NOTE_TYPE_LABELS, type PrivateNote } from './hiddenTypes'

type Props = {
  notes: PrivateNote[]
  onClose: () => void
  onOpenNote: (slug: string) => void
}

export default function HiddenSearch({ notes, onClose, onOpenNote }: Props) {
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const results = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase()
    const matches = needle
      ? notes.filter(note => [note.title, note.summary, note.tag, ...note.topics, ...note.sections.flatMap(section => [section.heading, section.text ?? '', ...(section.items ?? [])])]
        .join(' ').toLocaleLowerCase().includes(needle))
      : [...notes].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    return matches.slice(0, 7)
  }, [notes, query])

  useEffect(() => {
    inputRef.current?.focus()
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [onClose])

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveIndex(index => Math.min(index + 1, results.length - 1))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex(index => Math.max(index - 1, 0))
    } else if (event.key === 'Enter' && results[activeIndex]) {
      event.preventDefault()
      onOpenNote(results[activeIndex].slug)
    }
  }

  return (
    <div className="ah-search-overlay" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) onClose() }}>
      <section className="ah-search-dialog" role="dialog" aria-modal="true" aria-label="搜索交易体系">
        <div className="ah-search-input-row">
          <span aria-hidden="true">⌕</span>
          <input
            ref={inputRef}
            value={query}
            onChange={event => { setQuery(event.target.value); setActiveIndex(0) }}
            onKeyDown={handleKeyDown}
            placeholder="搜索概念、规则、指标、案例……"
            aria-label="搜索知识库"
          />
          <button type="button" onClick={onClose}>ESC</button>
        </div>
        <div className="ah-search-meta"><span>{query ? `${results.length} 条匹配` : '最近修订'}</span><span>↑↓ 选择 · ENTER 打开</span></div>
        <div className="ah-search-results">
          {results.map((note, index) => (
            <button
              type="button"
              key={note.slug}
              className={index === activeIndex ? 'is-active' : ''}
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => onOpenNote(note.slug)}
            >
              <span className="ah-search-result-index">{note.index}</span>
              <span><strong>{note.title}</strong><small>{note.summary}</small></span>
              <span className="ah-search-result-type">{NOTE_TYPE_LABELS[note.type]} / {note.topics[0]}</span>
            </button>
          ))}
          {results.length === 0 && <p className="ah-search-empty">没有找到匹配内容，试试主题名或更短的关键词。</p>}
        </div>
      </section>
    </div>
  )
}
