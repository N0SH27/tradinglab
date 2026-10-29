import { useEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent as ReactKeyboardEvent, type PointerEvent as ReactPointerEvent } from 'react'
import { DOMAIN_LABELS, NOTE_TYPE_LABELS, type DomainId, type NoteType, type PrivateContent, type PrivateNote } from './hiddenTypes'

type Props = {
  content: PrivateContent
  initialDomain: DomainId | 'all'
  onGoHome: () => void
  onOpenNote: (slug: string) => void
  onOpenSearch: () => void
}

type PanelSide = 'left' | 'right'
type PanelPrefs = {
  leftWidth: number
  rightWidth: number
  filtersCollapsed: boolean
  previewCollapsed: boolean
}
type ResizeState = { side: PanelSide; startX: number; startWidth: number }

const PANEL_KEY = 'tradinglab:after-hours-library-panels-v2'
const PANEL_LIMITS = { left: { min: 176, max: 340 }, right: { min: 360, max: 960 } }
const defaultRightWidth = () => clamp(Math.round(window.innerWidth * 0.42), 420, 860)
const DEFAULT_PANELS: PanelPrefs = { leftWidth: 220, rightWidth: defaultRightWidth(), filtersCollapsed: false, previewCollapsed: false }

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function readPanelPrefs(): PanelPrefs {
  try {
    const saved = JSON.parse(window.localStorage.getItem(PANEL_KEY) ?? '{}') as Partial<PanelPrefs>
    return {
      leftWidth: clamp(Number(saved.leftWidth) || DEFAULT_PANELS.leftWidth, PANEL_LIMITS.left.min, PANEL_LIMITS.left.max),
      rightWidth: clamp(Number(saved.rightWidth) || DEFAULT_PANELS.rightWidth, PANEL_LIMITS.right.min, PANEL_LIMITS.right.max),
      filtersCollapsed: saved.filtersCollapsed === true,
      previewCollapsed: saved.previewCollapsed === true,
    }
  } catch {
    return DEFAULT_PANELS
  }
}

function noteSearchText(note: PrivateNote) {
  return [note.title, note.summary, note.tag, ...note.topics, ...note.sections.flatMap(section => [section.heading, section.text ?? '', ...(section.items ?? [])])]
    .join(' ').toLocaleLowerCase()
}

export default function HiddenLibrary({ content, initialDomain, onGoHome, onOpenNote, onOpenSearch }: Props) {
  const [query, setQuery] = useState('')
  const [domain, setDomain] = useState<DomainId | 'all'>(initialDomain)
  const [type, setType] = useState<NoteType | 'all'>('all')
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [panels, setPanels] = useState<PanelPrefs>(readPanelPrefs)
  const [readerOpen, setReaderOpen] = useState(() => window.matchMedia('(max-width: 1279px)').matches ? false : !panels.previewCollapsed)
  const [resizeState, setResizeState] = useState<ResizeState | null>(null)
  const [selectedSlug, setSelectedSlug] = useState(() => content.notes.find(note => initialDomain === 'all' || note.domain === initialDomain)?.slug ?? content.notes[0]?.slug ?? '')
  const [openTabs, setOpenTabs] = useState<string[]>(() => [selectedSlug])
  const readerRef = useRef<HTMLElement>(null)

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
  const selectedKey = selected?.slug ?? ''
  const selectedItemCount = selected?.sections.reduce((total, section) => total + (section.items?.length ?? 0), 0) ?? 0
  const tabNotes = openTabs.map(slug => content.notes.find(note => note.slug === slug)).filter((note): note is PrivateNote => note !== undefined)
  const related = selected?.relatedSlugs.map(slug => content.notes.find(note => note.slug === slug)).filter((note): note is PrivateNote => note !== undefined) ?? []

  function setReaderVisibility(open: boolean) {
    if (open && selectedSlug) setOpenTabs(current => current.length > 0 ? current : [selectedSlug])
    setReaderOpen(open)
    setPanels(current => ({ ...current, previewCollapsed: !open }))
  }

  useEffect(() => {
    try { window.localStorage.setItem(PANEL_KEY, JSON.stringify(panels)) } catch { /* 隐私模式下仍保留当前页状态。 */ }
  }, [panels])

  useEffect(() => {
    readerRef.current?.scrollTo({ top: 0 })
  }, [selectedKey])

  useEffect(() => {
    if (!resizeState) return
    const previousCursor = document.body.style.cursor
    const previousUserSelect = document.body.style.userSelect
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
    const onPointerMove = (event: PointerEvent) => {
      const delta = event.clientX - resizeState.startX
      const limits = PANEL_LIMITS[resizeState.side]
      const nextWidth = resizeState.side === 'left' ? resizeState.startWidth + delta : resizeState.startWidth - delta
      setPanels(current => ({
        ...current,
        [resizeState.side === 'left' ? 'leftWidth' : 'rightWidth']: clamp(nextWidth, limits.min, limits.max),
      }))
    }
    const onPointerUp = () => setResizeState(null)
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp, { once: true })
    window.addEventListener('pointercancel', onPointerUp, { once: true })
    return () => {
      document.body.style.cursor = previousCursor
      document.body.style.userSelect = previousUserSelect
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('pointercancel', onPointerUp)
    }
  }, [resizeState])

  useEffect(() => {
    if (!readerOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || !window.matchMedia('(max-width: 1279px)').matches) return
      setReaderOpen(false)
      setPanels(current => ({ ...current, previewCollapsed: true }))
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [readerOpen])

  const clearFilters = () => { setQuery(''); setDomain('all'); setType('all'); setVerifiedOnly(false) }
  const selectNote = (slug: string) => {
    if (window.matchMedia('(max-width: 900px)').matches) {
      onOpenNote(slug)
      return
    }
    setSelectedSlug(slug)
    setOpenTabs(current => current.includes(slug) ? current : [...current, slug])
    setReaderVisibility(true)
  }
  const closeNoteTab = (slug: string) => {
    if (openTabs.length === 1) {
      setOpenTabs([])
      setReaderVisibility(false)
      return
    }
    const index = openTabs.indexOf(slug)
    const remaining = openTabs.filter(tabSlug => tabSlug !== slug)
    setOpenTabs(remaining)
    if (selectedKey === slug) setSelectedSlug(remaining[Math.min(index, remaining.length - 1)])
  }
  const startResize = (side: PanelSide, event: ReactPointerEvent<HTMLDivElement>) => {
    if (!window.matchMedia('(min-width: 1280px)').matches) return
    event.preventDefault()
    setResizeState({ side, startX: event.clientX, startWidth: side === 'left' ? panels.leftWidth : panels.rightWidth })
  }
  const resizeWithKeyboard = (side: PanelSide, event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home'].includes(event.key)) return
    event.preventDefault()
    const defaultWidth = side === 'left' ? DEFAULT_PANELS.leftWidth : DEFAULT_PANELS.rightWidth
    const currentWidth = side === 'left' ? panels.leftWidth : panels.rightWidth
    const direction = side === 'left' ? 1 : -1
    const step = event.shiftKey ? 48 : 16
    const delta = event.key === 'ArrowRight' ? step * direction : event.key === 'ArrowLeft' ? -step * direction : 0
    const limits = PANEL_LIMITS[side]
    setPanels(current => ({ ...current, [side === 'left' ? 'leftWidth' : 'rightWidth']: event.key === 'Home' ? defaultWidth : clamp(currentWidth + delta, limits.min, limits.max) }))
  }
  const resetPanelWidth = (side: PanelSide) => {
    setPanels(current => ({ ...current, [side === 'left' ? 'leftWidth' : 'rightWidth']: side === 'left' ? DEFAULT_PANELS.leftWidth : DEFAULT_PANELS.rightWidth }))
  }
  const resetLayout = () => {
    setPanels(DEFAULT_PANELS)
    setReaderOpen(!window.matchMedia('(max-width: 1279px)').matches)
  }
  const gridStyle = {
    '--ah-left-panel': `${panels.filtersCollapsed ? 0 : panels.leftWidth}px`,
    '--ah-right-panel': `${readerOpen ? panels.rightWidth : 0}px`,
  } as CSSProperties

  return (
    <main className="ah-workspace ah-library">
      <button type="button" className="ah-note-back ah-library-home" onClick={onGoHome}>← AFTER HOURS 首页</button>
      <div className="ah-workspace-heading">
        <div><span>PRIVATE KNOWLEDGE WORKSPACE</span><h1>体系资料库</h1></div>
        <div className="ah-library-heading-meta"><span>{String(filtered.length).padStart(2, '0')} / {String(content.notes.length).padStart(2, '0')} ENTRIES</span><button type="button" onClick={onOpenSearch}>全局搜索 ⌘ K</button></div>
      </div>

      <div className="ah-library-panelbar" aria-label="资料库面板控制">
        <div>
          <button type="button" aria-pressed={!panels.filtersCollapsed} onClick={() => setPanels(current => ({ ...current, filtersCollapsed: !current.filtersCollapsed }))}>{panels.filtersCollapsed ? '显示筛选' : '隐藏筛选'}</button>
          <button type="button" aria-pressed={readerOpen} onClick={() => setReaderVisibility(!readerOpen)}>{readerOpen ? '返回索引' : '阅读面板'}</button>
        </div>
        <span>拖拽分隔线调宽 · 双击复位 · 方向键微调</span>
        <button type="button" onClick={resetLayout}>重置布局</button>
      </div>

      <button type="button" className="ah-filter-toggle" onClick={() => setFiltersOpen(open => !open)} aria-expanded={filtersOpen}>
        筛选与搜索 <span>{filtersOpen ? '−' : '+'}</span>
      </button>

      <div className={`ah-library-grid ${panels.filtersCollapsed ? 'is-left-collapsed' : ''} ${readerOpen ? '' : 'is-right-collapsed'} ${resizeState ? 'is-resizing' : ''}`} style={gridStyle}>
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

        <div
          className="ah-panel-resizer ah-panel-resizer-left"
          role="separator"
          aria-label="调整筛选栏宽度"
          aria-orientation="vertical"
          aria-valuemin={PANEL_LIMITS.left.min}
          aria-valuemax={PANEL_LIMITS.left.max}
          aria-valuenow={panels.leftWidth}
          tabIndex={panels.filtersCollapsed ? -1 : 0}
          onPointerDown={event => startResize('left', event)}
          onKeyDown={event => resizeWithKeyboard('left', event)}
          onDoubleClick={() => resetPanelWidth('left')}
        ><span /></div>

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

        <div
          className="ah-panel-resizer ah-panel-resizer-right"
          role="separator"
          aria-label="调整阅读栏宽度"
          aria-orientation="vertical"
          aria-valuemin={PANEL_LIMITS.right.min}
          aria-valuemax={PANEL_LIMITS.right.max}
          aria-valuenow={panels.rightWidth}
          tabIndex={readerOpen ? 0 : -1}
          onPointerDown={event => startResize('right', event)}
          onKeyDown={event => resizeWithKeyboard('right', event)}
          onDoubleClick={() => resetPanelWidth('right')}
        ><span /></div>

        <aside ref={readerRef} className={`ah-library-preview ${readerOpen ? 'is-medium-open' : ''}`} aria-label="完整文章阅读区">
          <div className="ah-reader-toolbar">
            <button type="button" className="ah-preview-close" onClick={() => setReaderVisibility(false)}>← 返回索引</button>
            <span>{selected ? `${selected.index} / ${NOTE_TYPE_LABELS[selected.type]}` : 'READER'}</span>
          </div>
          <div className="ah-reader-tabs" role="tablist" aria-label="已打开的文章">
            {tabNotes.map(note => (
              <div className={`ah-reader-tab ${selected?.slug === note.slug ? 'is-active' : ''}`} key={note.slug}>
                <button type="button" role="tab" aria-selected={selected?.slug === note.slug} title={note.title} onClick={() => selectNote(note.slug)}><span>{note.index}</span>{note.title}</button>
                <button type="button" className="ah-reader-tab-close" aria-label={`关闭 ${note.title}`} onClick={() => closeNoteTab(note.slug)}>×</button>
              </div>
            ))}
          </div>
          {selected ? (
            <article key={selected.slug} className="ah-library-reader">
              <header>
                <span className="ah-preview-index">{selected.tag}</span>
                <h2>{selected.title}</h2>
                <p className="ah-preview-summary">{selected.summary}</p>
                <div className="ah-reader-meta"><span>{DOMAIN_LABELS[selected.domain]}</span><span>{selectedItemCount} 条内容</span><span>{selected.updatedAt.replaceAll('-', '.')}</span></div>
              </header>
              {selected.sections.map((section, index) => (
                <section key={section.heading}>
                  <h3><span>{String(index + 1).padStart(2, '0')}</span>{section.heading}</h3>
                  {section.text && <p>{section.text}</p>}
                  {section.items && <ol>{section.items.map(item => <li key={item}>{item}</li>)}</ol>}
                </section>
              ))}
              {related.length > 0 && (
                <nav className="ah-reader-related" aria-label="关联卷宗">
                  <span>LINKED NOTES / {String(related.length).padStart(2, '0')}</span>
                  {related.map(note => <button type="button" key={note.slug} onClick={() => selectNote(note.slug)}><small>{note.index} / {NOTE_TYPE_LABELS[note.type]}</small><strong>{note.title}</strong><span>→</span></button>)}
                </nav>
              )}
              <button type="button" className="ah-preview-open" onClick={() => onOpenNote(selected.slug)}>在独立页面打开 <span>↗</span></button>
            </article>
          ) : <p className="ah-preview-empty">选择一条内容开始阅读。</p>}
        </aside>
      </div>
      <footer className="ah-library-status" aria-label="资料库状态">
        <span>{filtered.length} 个文件</span><span>{openTabs.length} 个标签</span><span>{selectedItemCount} 条正文</span><span>LOCAL VAULT · READ ONLY</span>
      </footer>
      {readerOpen && <button type="button" className="ah-preview-scrim" aria-label="关闭阅读区并返回索引" onClick={() => setReaderVisibility(false)} />}
    </main>
  )
}
