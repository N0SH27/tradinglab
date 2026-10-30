import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react'
import GhostFibers from '../components/GhostFibers'
import { clearHiddenEntry } from '../lib/hiddenAccess'
import HiddenCollection from './hidden/HiddenCollection'
import HiddenHome from './hidden/HiddenHome'
import HiddenInvestor from './hidden/HiddenInvestor'
import HiddenLibrary from './hidden/HiddenLibrary'
import HiddenNote from './hidden/HiddenNote'
import HiddenSearch from './hidden/HiddenSearch'
import { goAfterHours, type DomainId, type HiddenCollectionId, type PrivateContent } from './hidden/hiddenTypes'
import './HiddenPage.css'

type Phase = 'checking' | 'locked' | 'unlocked'
type Props = { path: string }

async function getPrivateContent(signal?: AbortSignal): Promise<PrivateContent> {
  const response = await fetch('/api/hidden-content', {
    credentials: 'same-origin',
    cache: 'no-store',
    signal,
  })
  if (!response.ok) throw new Error(response.status === 401 ? 'session_expired' : 'content_unavailable')
  return response.json() as Promise<PrivateContent>
}

export default function HiddenPage({ path }: Props) {
  const [phase, setPhase] = useState<Phase>('checking')
  const [content, setContent] = useState<PrivateContent | null>(null)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [carouselIndex, setCarouselIndex] = useState(0)
  const [restoreCarousel, setRestoreCarousel] = useState(false)
  const passwordRef = useRef<HTMLInputElement>(null)
  const routePath = path.split('?')[0]
  const view = routePath.startsWith('/after-hours/note/')
    ? 'note'
    : routePath === '/after-hours/library'
      ? 'library'
      : routePath.startsWith('/after-hours/investor/')
        ? 'investor'
        : routePath.startsWith('/after-hours/collection/')
          ? 'collection'
          : 'home'
  const noteSlug = view === 'note' ? decodeURIComponent(routePath.replace('/after-hours/note/', '')) : ''
  const collectionId = view === 'collection' ? decodeURIComponent(routePath.replace('/after-hours/collection/', '')) : ''
  const investorId = view === 'investor' ? decodeURIComponent(routePath.replace('/after-hours/investor/', '')) : ''
  const collection = content?.collections.find(item => item.id === collectionId && item.id !== 'library')
  const investor = content?.investors.find(item => item.id === investorId)
  const queryDomain = new URLSearchParams(path.split('?')[1] ?? '').get('domain') ?? 'all'
  const validDomains: (DomainId | 'all')[] = ['all', 'foundation', 'language', 'tools', 'structure', 'execution', 'review']
  const initialDomain = validDomains.includes(queryDomain as DomainId | 'all') ? queryDomain as DomainId | 'all' : 'all'

  useEffect(() => {
    const previousTitle = document.title
    document.title = 'After Hours — TradingLabb'
    const controller = new AbortController()

    const restoreSession = async () => {
      try {
        const response = await fetch('/api/hidden-access', {
          credentials: 'same-origin',
          cache: 'no-store',
          signal: controller.signal,
        })
        if (!response.ok) throw new Error('status_unavailable')
        const session = await response.json() as { authenticated: boolean }
        if (!session.authenticated) {
          setPhase('locked')
          return
        }
        const privateContent = await getPrivateContent(controller.signal)
        setContent(privateContent)
        setPhase('unlocked')
      } catch (cause) {
        if (cause instanceof DOMException && cause.name === 'AbortError') return
        setPhase('locked')
        setError('暂时无法连接验证服务，请稍后重试。')
      }
    }

    void restoreSession()
    return () => {
      controller.abort()
      document.title = previousTitle
    }
  }, [])

  useEffect(() => {
    if (phase === 'locked') passwordRef.current?.focus()
  }, [phase])

  useEffect(() => {
    if (!content || phase !== 'unlocked') return
    const note = view === 'note' ? content.notes.find(item => item.slug === noteSlug) : null
    document.title = note
      ? `${note.title} — After Hours`
      : view === 'library'
        ? '体系资料库 — After Hours'
        : investor
          ? `${investor.name} · 投资者框架 — After Hours`
          : collection
            ? `${collection.title} — After Hours`
            : 'After Hours — TradingLabb'
  }, [collection, content, investor, noteSlug, phase, view])

  useEffect(() => {
    if (phase !== 'unlocked') return
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLocaleLowerCase() === 'k') {
        event.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [phase])

  const leave = () => {
    clearHiddenEntry()
    window.location.hash = '/'
  }

  const closeSearch = useCallback(() => setSearchOpen(false), [])
  const openNote = useCallback((slug: string) => {
    setSearchOpen(false)
    goAfterHours(`note/${encodeURIComponent(slug)}`)
  }, [])
  const openLibrary = useCallback((domain?: DomainId) => {
    goAfterHours(domain ? `library?domain=${domain}` : 'library')
  }, [])
  const openCollection = useCallback((id: HiddenCollectionId) => {
    const index = content?.collections.findIndex(item => item.id === id) ?? -1
    if (index >= 0) setCarouselIndex(index)
    setRestoreCarousel(true)
    if (id === 'library') {
      openLibrary()
      return
    }
    goAfterHours(`collection/${encodeURIComponent(id)}`)
  }, [content, openLibrary])
  const openInvestor = useCallback((id: string) => {
    goAfterHours(`investor/${encodeURIComponent(id)}`)
  }, [])
  const goHome = useCallback(() => {
    if (collection) {
      const index = content?.collections.findIndex(item => item.id === collection.id) ?? -1
      if (index >= 0) setCarouselIndex(index)
    } else if (view === 'library') {
      setCarouselIndex(0)
    }
    setRestoreCarousel(true)
    goAfterHours()
  }, [collection, content, view])

  const submitPassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!password || pending) return
    setPending(true)
    setError('')

    try {
      const response = await fetch('/api/hidden-access', {
        method: 'POST',
        credentials: 'same-origin',
        cache: 'no-store',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (!response.ok) {
        if (response.status === 401) setError('密码不正确，请再试一次。')
        else if (response.status === 429) setError('尝试次数过多，请十分钟后再试。')
        else setError('验证服务暂时不可用，请稍后重试。')
        setPassword('')
        passwordRef.current?.focus()
        return
      }

      const privateContent = await getPrivateContent()
      setContent(privateContent)
      setPassword('')
      setPhase('unlocked')
    } catch (cause) {
      if (cause instanceof Error && cause.message === 'session_expired') {
        setError('访问状态已过期，请重新输入密码。')
      } else {
        setError('网络连接未完成，请重试。')
      }
    } finally {
      setPending(false)
    }
  }

  const logout = async () => {
    if (pending) return
    setPending(true)
    try {
      await fetch('/api/hidden-access', { method: 'DELETE', credentials: 'same-origin' })
      leave()
    } catch {
      setError('退出未完成，请检查网络后重试。')
      setPending(false)
    }
  }

  return (
    <div className={`after-hours ah-view-${view}`}>
      {(phase !== 'unlocked' || view === 'home') && (
        <GhostFibers
          className="ah-fibers"
          glowColor="#f7f7f7"
          lineColor="#ffffff"
          secondaryColor="#949494"
          gradient="depth"
          speed={0.32}
          scale={1.08}
          rotation={18}
          rollSpeed={0.12}
          layers={3}
          waves={1.1}
          twist={1.35}
          threads={64}
          density={0.85}
          fiberStyle="lines"
          sparkle={0.35}
          glow={0.7}
          brightness={0.9}
          grain={0.05}
          vignette={0.42}
          hoverEffect="focus"
        />
      )}

      <div className="ah-shell">
        <header className="ah-header">
          <button type="button" className="ah-wordmark" onClick={phase === 'unlocked' ? goHome : leave}>trading-lab</button>
          <span className="ah-header-meta">PRIVATE / {view === 'home' ? '001' : view === 'library' ? 'LIBRARY' : view === 'collection' ? (collection?.english ?? 'COLLECTION') : 'NOTE'}</span>
          <div className="ah-header-actions">
            {phase === 'unlocked' && view !== 'library' && <button type="button" className="ah-header-link" onClick={() => openLibrary()}>LIBRARY</button>}
            {phase === 'unlocked' && <button type="button" className="ah-header-link ah-header-search" onClick={() => setSearchOpen(true)} aria-label="搜索知识库">⌘ K</button>}
            <button type="button" className="ah-text-button" onClick={phase === 'unlocked' ? logout : leave} disabled={pending}>
              {phase === 'unlocked' ? '退出并返回' : '返回首页'} <span aria-hidden="true">↗</span>
            </button>
          </div>
        </header>

        {phase !== 'unlocked' || !content ? (
          <main className="ah-lock">
            <div className="ah-lock-title">
              <p className="ah-kicker">A PAGE OUTSIDE THE INDEX</p>
              <h1>AFTER<br />HOURS</h1>
            </div>
            <div className="ah-access">
              <span className="ah-access-index">01 / ACCESS</span>
              {phase === 'checking' ? (
                <p className="ah-checking" role="status">正在确认访问状态</p>
              ) : (
                <form onSubmit={submitPassword} className="ah-form">
                  <label htmlFor="after-hours-password">访问密码</label>
                  <div className="ah-input-row">
                    <input
                      ref={passwordRef}
                      id="after-hours-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={event => setPassword(event.target.value)}
                      autoComplete="current-password"
                      autoCapitalize="none"
                      spellCheck={false}
                      disabled={pending}
                      required
                    />
                    <button type="button" className="ah-reveal" onClick={() => setShowPassword(value => !value)} aria-label={showPassword ? '隐藏密码' : '显示密码'}>
                      {showPassword ? '隐藏' : '显示'}
                    </button>
                  </div>
                  <div className="ah-form-bottom">
                    <button type="submit" className="ah-enter" disabled={pending || !password}>{pending ? '验证中' : '进入'} <span aria-hidden="true">→</span></button>
                    <span className="ah-session-note">限时访问 · 2 HOURS</span>
                  </div>
                </form>
              )}
              {error && <p className="ah-error" role="alert">{error}</p>}
            </div>
          </main>
        ) : view === 'library' ? (
          <HiddenLibrary key={path} content={content} initialDomain={initialDomain} onGoHome={goHome} onOpenNote={openNote} onOpenSearch={() => setSearchOpen(true)} />
        ) : view === 'note' ? (
          <HiddenNote content={content} slug={noteSlug} onBack={() => openLibrary()} onOpenNote={openNote} />
        ) : view === 'investor' && investor ? (
          <HiddenInvestor key={investor.id} profile={investor} profiles={content.investors} onBack={() => openCollection('investors')} onOpenInvestor={openInvestor} />
        ) : view === 'collection' && collection ? (
          <HiddenCollection key={collection.id} collection={collection} investors={content.investors} toolGroups={content.toolGroups} onGoHome={goHome} onOpenLibrary={() => openLibrary()} onOpenInvestor={openInvestor} />
        ) : (
          <HiddenHome content={content} initialIndex={carouselIndex} restoreScroll={restoreCarousel} onOpenCollection={openCollection} onOpenSearch={() => setSearchOpen(true)} onSelectionChange={setCarouselIndex} />
        )}
      </div>
      {searchOpen && content && <HiddenSearch notes={content.notes} onClose={closeSearch} onOpenNote={openNote} />}
    </div>
  )
}
