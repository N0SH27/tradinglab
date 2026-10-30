import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { createPortal } from 'react-dom'
import HoloCard from '../../components/HoloCard'
import { getHiddenBookDownload, HIDDEN_BOOKS, type HiddenBook } from './hiddenBooks'
import { getBookShelfPage, TIERS_PER_PAGE } from './hiddenBookshelfLayout'

type View = 'shelf' | 'preview' | 'detail'

export default function HiddenBookshelf() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [view, setView] = useState<View>('shelf')
  const [requestedPage, setRequestedPage] = useState(0)
  const dialogRef = useRef<HTMLDivElement>(null)
  const detailHeadingRef = useRef<HTMLHeadingElement>(null)
  const holoButtonRef = useRef<HTMLButtonElement>(null)
  const selected = HIDDEN_BOOKS.find(book => book.id === selectedId) ?? null
  const download = selected ? getHiddenBookDownload(selected) : null
  const isOpen = view !== 'shelf' && Boolean(selected)
  const shelf = getBookShelfPage(HIDDEN_BOOKS, requestedPage)

  const selectBook = (book: HiddenBook) => {
    if (selectedId === book.id && view === 'preview') {
      setView('detail')
      return
    }
    setSelectedId(book.id)
    setView('preview')
  }

  const returnToShelf = () => {
    const previousId = selectedId
    setView('shelf')
    setSelectedId(null)
    if (previousId) requestAnimationFrame(() => document.getElementById(`book-spine-${previousId}`)?.focus())
  }

  useEffect(() => {
    if (!isOpen) return
    const previousOverflow = document.body.style.overflow
    const previousPaddingRight = document.body.style.paddingRight
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
    document.body.style.overflow = 'hidden'
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`
    return () => {
      document.body.style.overflow = previousOverflow
      document.body.style.paddingRight = previousPaddingRight
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const frame = requestAnimationFrame(() => {
      dialogRef.current?.scrollTo({ top: 0 })
      if (view === 'detail') detailHeadingRef.current?.focus({ preventScroll: true })
      else holoButtonRef.current?.focus({ preventScroll: true })
    })
    return () => cancelAnimationFrame(frame)
  }, [view, selectedId, isOpen])

  useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        if (view === 'detail') setView('preview')
        else returnToShelf()
        return
      }
      if (event.key !== 'Tab' || !dialogRef.current) return
      const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], input:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )).filter(element => element.getClientRects().length > 0)
      if (!focusable.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [view, selectedId, isOpen])

  return (
    <>
      <section className="ah-bookshelf" aria-label="书籍书架">
        <header className="ah-bookshelf-meta" aria-live="polite">
          <span>{String(HIDDEN_BOOKS.length).padStart(2, '0')} VOLUMES / {String(shelf.tiers.length).padStart(2, '0')} TIERS</span>
          <span>MAX 03 TIERS · 15 VOLUMES PER SHELF</span>
        </header>
        <div className="ah-bookshelf-rack">
          {shelf.tiers.map((tier, tierIndex) => {
            const tierOffset = shelf.tiers.slice(0, tierIndex).reduce((total, item) => total + item.length, 0)
            const tierNumber = shelf.page * TIERS_PER_PAGE + tierIndex + 1
            return (
              <div className="ah-bookshelf-tier" key={`${shelf.page}-${tierIndex}`}>
                <div className="ah-bookshelf-spines" role="list" aria-label={`书架第 ${shelf.page + 1} 页，第 ${tierIndex + 1} 层`}>
                  {tier.map((book, index) => (
                    <div role="listitem" key={book.id}>
                      <button
                        id={`book-spine-${book.id}`}
                        type="button"
                        className="ah-book-spine"
                        data-tone={book.tone}
                        data-active={selectedId === book.id ? '' : undefined}
                        style={{ '--spine-index': shelf.startIndex + tierOffset + index } as CSSProperties}
                        onClick={() => selectBook(book)}
                        aria-label={`${book.title}，${selectedId === book.id && view === 'preview' ? '再次点击进入介绍' : '单击预览封面'}`}
                        aria-pressed={selectedId === book.id}
                        aria-haspopup="dialog"
                      >
                        <span className="ah-book-spine-index">{book.index}</span>
                        <span className="ah-book-spine-title">{book.spineTitle}</span>
                        <span className="ah-book-spine-mark">TL</span>
                      </button>
                    </div>
                  ))}
                </div>
                <div className="ah-bookshelf-board" aria-hidden="true"><span>PRIVATE READING ROOM / TIER {String(tierNumber).padStart(2, '0')}</span></div>
              </div>
            )
          })}
        </div>
        {shelf.pageCount > 1 && (
          <nav className="ah-bookshelf-pagination" aria-label="书架翻页">
            <button type="button" disabled={shelf.page === 0} onClick={() => setRequestedPage(shelf.page - 1)}>← 上一页</button>
            <span aria-live="polite">SHELF {String(shelf.page + 1).padStart(2, '0')} / {String(shelf.pageCount).padStart(2, '0')}</span>
            <button type="button" disabled={shelf.page === shelf.pageCount - 1} onClick={() => setRequestedPage(shelf.page + 1)}>下一页 →</button>
          </nav>
        )}
      </section>

      {isOpen && selected && createPortal(
        <div className={`ah-book-immersive ah-book-immersive--${view}`} data-book={selected.id}>
          <div
            ref={dialogRef}
            className="ah-book-immersive-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby={view === 'detail' ? 'ah-book-detail-title' : 'ah-book-preview-title'}
          >
            <header className="ah-book-immersive-chrome">
              <span>PRIVATE READING ROOM / {view === 'detail' ? 'READING DOSSIER' : 'COVER PREVIEW'}</span>
              <button type="button" onClick={returnToShelf} aria-label="关闭并返回书架"><span>关闭</span><b aria-hidden="true">×</b></button>
            </header>

            {view === 'preview' ? (
              <aside className="ah-book-preview">
                <div className="ah-book-preview-copy">
                  <span>{selected.index} / COVER PREVIEW</span>
                  <h2 id="ah-book-preview-title">{selected.title}</h2>
                  <p>{selected.category}</p>
                </div>
                <button ref={holoButtonRef} type="button" className="ah-book-holo-button" onClick={() => setView('detail')} aria-label={`打开《${selected.title}》书籍介绍`}>
                  <HoloCard
                    key={selected.id}
                    image={selected.cover}
                    alt={`${selected.title}封面`}
                    preset="shards"
                    intensity={0}
                    edgeSparkle={0}
                    glare={0.32}
                    foilColor="#dedede"
                    width={330}
                    radius={2}
                    tiltMax={9}
                    hoverScale={1.025}
                  />
                  <span>再次单击封面，进入书籍介绍 ↗</span>
                </button>
                <div className="ah-book-preview-actions">
                  <button type="button" onClick={() => setView('detail')}>阅读书籍介绍</button>
                  <button type="button" onClick={returnToShelf}>收起封面</button>
                </div>
              </aside>
            ) : (
              <article className="ah-book-detail">
                <nav className="ah-book-detail-nav" aria-label="书籍阅读导航">
                  <button type="button" onClick={() => setView('preview')}>← 返回封面</button>
                  <button type="button" onClick={returnToShelf}>返回书架 / 换一本</button>
                </nav>
                <header className="ah-book-detail-header">
                  <span>{selected.index} / READING DOSSIER</span>
                  <h1 id="ah-book-detail-title" ref={detailHeadingRef} tabIndex={-1}>{selected.title}</h1>
                  <p>{selected.summary}</p>
                  <dl>
                    <div><dt>{selected.creatorRole}</dt><dd>{selected.creator}</dd></div>
                    <div><dt>阅读分类</dt><dd>{selected.category}</dd></div>
                  </dl>
                </header>
                <div className="ah-book-detail-layout">
                  <aside className="ah-book-detail-cover">
                    <img src={selected.cover} alt={`《${selected.title}》黑白封面`} />
                    <p>{selected.sourceNote}</p>
                    {download && (
                      <a
                        className="ah-book-download"
                        href={download.href}
                        download={download.fileName}
                        aria-label={`下载《${selected.title}》PDF 原文`}
                      >
                        <span>SOURCE PDF / {download.fileName}</span>
                        <strong>下载 PDF 原文</strong>
                        <b aria-hidden="true">↓</b>
                      </a>
                    )}
                  </aside>
                  <div className="ah-book-detail-reading">
                    <section>
                      <span>01 / ABOUT THIS VOLUME</span>
                      <h2>阅读入口</h2>
                      {selected.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
                    </section>
                    <section>
                      <span>02 / QUESTIONS FOR READING</span>
                      <h2>带着问题读</h2>
                      <ol>{selected.prompts.map(prompt => <li key={prompt}>{prompt}</li>)}</ol>
                    </section>
                    <section className="ah-book-detail-next">
                      <span>03 / YOUR ANNOTATIONS</span>
                      <h2>把材料变成自己的笔记</h2>
                      <p>先记录原文出处与形成时间，再写自己的理解。观点、事实和复盘结论分栏保存，避免事后解释替代当时的真实决策。</p>
                      <button type="button" onClick={returnToShelf}>完成本次导览，返回书架 →</button>
                    </section>
                  </div>
                </div>
              </article>
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
