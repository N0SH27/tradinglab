import { useEffect, useRef, useState, type FormEvent } from 'react'
import GhostFibers from '../components/GhostFibers'
import { clearHiddenEntry } from '../lib/hiddenAccess'
import './HiddenPage.css'

type PrivateNote = {
  index: string
  title: string
  tag: string
  body: string
}

type PrivateContent = {
  kicker: string
  title: [string, string]
  intro: string
  notes: PrivateNote[]
}

type Phase = 'checking' | 'locked' | 'unlocked'

async function getPrivateContent(signal?: AbortSignal): Promise<PrivateContent> {
  const response = await fetch('/api/hidden-content', {
    credentials: 'same-origin',
    cache: 'no-store',
    signal,
  })
  if (!response.ok) throw new Error(response.status === 401 ? 'session_expired' : 'content_unavailable')
  return response.json() as Promise<PrivateContent>
}

export default function HiddenPage() {
  const [phase, setPhase] = useState<Phase>('checking')
  const [content, setContent] = useState<PrivateContent | null>(null)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const [openNote, setOpenNote] = useState<string | null>(null)
  const passwordRef = useRef<HTMLInputElement>(null)

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

  const leave = () => {
    clearHiddenEntry()
    window.location.hash = '/'
  }

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
    <div className="after-hours">
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

      <div className="ah-shell">
        <header className="ah-header">
          <span className="ah-wordmark">trading-lab</span>
          <span className="ah-header-meta">PRIVATE / 001</span>
          <button type="button" className="ah-text-button" onClick={phase === 'unlocked' ? logout : leave} disabled={pending}>
            {phase === 'unlocked' ? '退出并返回' : '返回首页'} <span aria-hidden="true">↗</span>
          </button>
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
                    <button
                      type="button"
                      className="ah-reveal"
                      onClick={() => setShowPassword(value => !value)}
                      aria-label={showPassword ? '隐藏密码' : '显示密码'}
                    >
                      {showPassword ? '隐藏' : '显示'}
                    </button>
                  </div>
                  <div className="ah-form-bottom">
                    <button type="submit" className="ah-enter" disabled={pending || !password}>
                      {pending ? '验证中' : '进入'} <span aria-hidden="true">→</span>
                    </button>
                    <span className="ah-session-note">限时访问 · 2 HOURS</span>
                  </div>
                </form>
              )}
              {error && <p className="ah-error" role="alert">{error}</p>}
            </div>
          </main>
        ) : (
          <main className="ah-private">
            <section className="ah-hero" aria-labelledby="after-hours-title">
              <p className="ah-kicker">{content.kicker}</p>
              <h1 id="after-hours-title">{content.title[0]}<br />{content.title[1]}</h1>
              <div className="ah-hero-bottom">
                <p>{content.intro}</p>
                <a href="#private-notes" className="ah-scroll-link">阅读档案 <span aria-hidden="true">↓</span></a>
              </div>
            </section>

            <section id="private-notes" className="ah-notes" aria-label="私密档案">
              <div className="ah-section-heading">
                <span>FIELD NOTES</span>
                <span>{String(content.notes.length).padStart(2, '0')} ENTRIES</span>
              </div>
              <div className="ah-note-list">
                {content.notes.map(note => {
                  const open = openNote === note.index
                  return (
                    <article className={`ah-note${open ? ' is-open' : ''}`} key={note.index}>
                      <button
                        type="button"
                        className="ah-note-trigger"
                        onClick={() => setOpenNote(open ? null : note.index)}
                        aria-expanded={open}
                        aria-controls={`note-${note.index}`}
                      >
                        <span className="ah-note-index">{note.index}</span>
                        <span className="ah-note-title">{note.title}</span>
                        <span className="ah-note-tag">{note.tag}</span>
                        <span className="ah-note-toggle" aria-hidden="true">{open ? '−' : '+'}</span>
                      </button>
                      <div id={`note-${note.index}`} className="ah-note-detail" hidden={!open}>
                        <span className="ah-detail-mark" aria-hidden="true">{note.index}</span>
                        <p>{note.body}</p>
                      </div>
                    </article>
                  )
                })}
              </div>
            </section>

            <footer className="ah-footer">
              <span>NOT INDEXED / NOT IN NAVIGATION</span>
              <span>HSN · TRADINGLABB</span>
            </footer>
          </main>
        )}
      </div>
    </div>
  )
}
