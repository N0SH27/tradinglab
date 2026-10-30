import { useEffect, useMemo, useState, type FormEvent } from 'react'
import ChromaGrid from '../../components/ChromaGrid'
import LineSidebar from '../../components/LineSidebar'
import {
  goAfterHours,
  type HiddenCollection,
  type HiddenResearchResponse,
} from './hiddenTypes'
import './HiddenResearchTopic.css'

type Props = {
  path: string
  topicId: string
  topics: HiddenCollection['groups']
  onBack: () => void
  onOpenTopic: (id: string) => void
}

export default function HiddenResearchTopic({ path, topicId, topics, onBack, onOpenTopic }: Props) {
  const parameters = useMemo(() => new URLSearchParams(path.split('?')[1] ?? ''), [path])
  const [data, setData] = useState<HiddenResearchResponse | null>(null)
  const [error, setError] = useState('')
  const [retry, setRetry] = useState(0)
  const [searchInput, setSearchInput] = useState(parameters.get('q') ?? '')
  const currentTopic = topics.find(topic => topic.id === topicId)
  const hasFilters = Boolean(parameters.get('q') || parameters.get('tag') || parameters.get('kind'))

  useEffect(() => {
    const controller = new AbortController()
    const query = new URLSearchParams(path.split('?')[1] ?? '')
    query.set('topic', topicId)
    setData(null)
    setError('')

    async function loadResearch() {
      try {
        const response = await fetch(`/api/hidden-research?${query.toString()}`, {
          credentials: 'same-origin',
          cache: 'no-store',
          signal: controller.signal,
        })
        if (!response.ok) {
          if (response.status === 401) throw new Error('访问状态已过期，请重新进入隐藏页。')
          if (response.status === 404) throw new Error('这个研究专题不存在。')
          throw new Error('研究索引暂时不可用，请重试。')
        }
        setData(await response.json() as HiddenResearchResponse)
      } catch (cause) {
        if (cause instanceof DOMException && cause.name === 'AbortError') return
        setError(cause instanceof Error ? cause.message : '研究索引暂时不可用，请重试。')
      }
    }

    void loadResearch()
    return () => controller.abort()
  }, [path, retry, topicId])

  const updateQuery = (changes: Record<string, string>) => {
    const next = new URLSearchParams(parameters)
    for (const [key, value] of Object.entries(changes)) {
      if (!value || (key === 'sort' && value === 'newest') || (key === 'page' && value === '1')) next.delete(key)
      else next.set(key, value)
    }
    const suffix = next.toString()
    goAfterHours(`research/${encodeURIComponent(topicId)}${suffix ? `?${suffix}` : ''}`)
  }

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    updateQuery({ q: searchInput.trim(), page: '1' })
  }

  const topic = data?.topic ?? currentTopic
  const resultStart = data && data.total > 0 ? (data.page - 1) * data.pageSize + 1 : 0
  const resultEnd = data ? resultStart + data.articles.length - 1 : 0

  return (
    <main className="ah-workspace ah-research-topic">
      <button type="button" className="ah-note-back ah-research-topic-back" onClick={onBack}>← 研报与文章</button>

      <header className="ah-research-topic-header">
        <div>
          <span>{data?.topic.index ?? '02'} / {data?.topic.english ?? 'RESEARCH DOSSIER'}</span>
          <h1>{topic?.title ?? '研究专题'}</h1>
        </div>
        <div className="ah-research-topic-header-meta">
          <span>{String(data?.topic.count ?? currentTopic?.count ?? 0).padStart(2, '0')} / ENTRIES</span>
          <span>SERVER INDEX / 15 PER PAGE</span>
        </div>
      </header>

      <section className="ah-research-topic-intro">
        <p>{data?.topic.summary ?? currentTopic?.description}</p>
        <span>RESEARCH / ESSAY / SPECIAL</span>
      </section>

      <div className="ah-research-topic-mobile-nav">
        <label htmlFor="research-topic-select">当前专题</label>
        <select id="research-topic-select" value={topicId} onChange={event => onOpenTopic(event.target.value)}>
          {topics.map(item => <option value={item.id} key={item.id}>{item.title} · {item.count ?? 0}</option>)}
        </select>
      </div>

      <div className="ah-research-topic-layout">
        <aside className="ah-research-topic-sidebar" aria-label="研究专题导航">
          <span>DOSSIERS / 03</span>
          <LineSidebar
            items={topics.map(item => `${item.title} · ${String(item.count ?? 0).padStart(2, '0')}`)}
            defaultActive={Math.max(0, topics.findIndex(item => item.id === topicId))}
            onItemClick={(index: number) => {
              const id = topics[index]?.id
              if (id) onOpenTopic(id)
            }}
            accentColor="#f7f7f7"
            textColor="#777777"
            markerColor="#3c3c3c"
            markerLength={26}
            markerGap={12}
            itemGap={22}
            fontSize={0.82}
            maxShift={8}
          />
          <p>专题只负责分类；全部文章在右侧统一索引中查找。</p>
        </aside>

        <div className="ah-research-topic-content">
          {error ? (
            <section className="ah-research-topic-state" role="alert">
              <span>INDEX / UNAVAILABLE</span>
              <h2>{error}</h2>
              <button type="button" onClick={() => setRetry(value => value + 1)}>重新加载 →</button>
            </section>
          ) : !data ? (
            <section className="ah-research-topic-state" role="status">
              <span>INDEX / LOADING</span>
              <h2>正在读取研究档案</h2>
            </section>
          ) : (
            <>
              {!hasFilters && data.featured.length > 0 && (
                <section className="ah-research-featured" aria-label="精选研究">
                  <div className="ah-research-section-heading">
                    <span>01 / EDITOR'S SELECTION</span>
                    <p>从关键问题进入完整报告</p>
                  </div>
                  <ChromaGrid
                    items={data.featured.map(article => ({
                      image: article.image,
                      title: article.title,
                      subtitle: `${article.archiveId} · ${article.date} · ${article.version}`,
                      accent: '#f7f7f7',
                      url: article.href,
                    }))}
                    columns={3}
                    minCardWidth={220}
                    gap={12}
                    cardRadius={0}
                    aspectRatio="3 / 2"
                    frame={false}
                    theme="dark"
                    grayscale={1}
                    dim={0.2}
                    glow={0.35}
                  />
                </section>
              )}

              {data.topic.count > 0 && (
                <section className="ah-research-index" aria-label="研究文章索引">
                  <div className="ah-research-section-heading">
                    <span>{hasFilters ? '01' : '02'} / COMPLETE INDEX</span>
                    <p>{data.total} 条结果 · 每页 {data.pageSize} 条</p>
                  </div>

                  <div className="ah-research-controls">
                    <form className="ah-research-search" onSubmit={submitSearch} role="search">
                      <label htmlFor="research-index-search">搜索标题、摘要、编号或标签</label>
                      <div>
                        <input
                          id="research-index-search"
                          type="search"
                          value={searchInput}
                          onChange={event => setSearchInput(event.target.value)}
                          placeholder="例如：存储、AI 算力、RC-001"
                          maxLength={80}
                        />
                        <button type="submit">检索 →</button>
                      </div>
                    </form>
                    <label className="ah-research-select">内容类型
                      <select value={data.query.kind} onChange={event => updateQuery({ kind: event.target.value, page: '1' })}>
                        <option value="">全部类型</option>
                        {data.facets.kinds.map(kind => <option value={kind.id} key={kind.id}>{kind.label} · {kind.count}</option>)}
                      </select>
                    </label>
                    <label className="ah-research-select">排序
                      <select value={data.query.sort} onChange={event => updateQuery({ sort: event.target.value, page: '1' })}>
                        <option value="newest">日期：由新到旧</option>
                        <option value="oldest">日期：由旧到新</option>
                        <option value="title">标题：拼音顺序</option>
                      </select>
                    </label>
                  </div>

                  <div className="ah-research-tags" aria-label="按主题筛选">
                    <button type="button" aria-pressed={!data.query.tag} onClick={() => updateQuery({ tag: '', page: '1' })}>全部主题 <span>{data.topic.count}</span></button>
                    {data.facets.tags.map(tag => (
                      <button type="button" aria-pressed={data.query.tag === tag.id} onClick={() => updateQuery({ tag: data.query.tag === tag.id ? '' : tag.id, page: '1' })} key={tag.id}>
                        {tag.id} <span>{tag.count}</span>
                      </button>
                    ))}
                    {(hasFilters || data.query.sort !== 'newest') && <button type="button" className="ah-research-clear" onClick={() => goAfterHours(`research/${encodeURIComponent(topicId)}`)}>清除条件 ×</button>}
                  </div>

                  <div className="ah-research-results-meta" aria-live="polite">
                    <span>SHOWING {String(resultStart).padStart(2, '0')}–{String(resultEnd).padStart(2, '0')} / {String(data.total).padStart(2, '0')}</span>
                    <span>{data.query.sort.toUpperCase()} / PAGE {data.page}</span>
                  </div>

                  {data.articles.length > 0 ? (
                    <div className="ah-research-article-list">
                      {data.articles.map(article => (
                        <a className="ah-research-article-row" href={article.href} key={article.id}>
                          <span className="ah-research-article-id">{article.archiveId}</span>
                          <span className="ah-research-article-copy">
                            <strong>{article.title}</strong>
                            <span>{article.summary}</span>
                            <small>{article.tags.map(tag => <span key={tag}>{tag}</span>)}</small>
                          </span>
                          <span className="ah-research-article-source">{article.source}<small>{article.kind === 'report' ? '研究报告' : '深度文章'}</small></span>
                          <span className="ah-research-article-version">{article.date}<small>{article.version}</small></span>
                          <span className="ah-research-article-arrow" aria-hidden="true">↗</span>
                        </a>
                      ))}
                    </div>
                  ) : (
                    <div className="ah-research-no-results">
                      <h2>没有符合当前条件的内容。</h2>
                      <p>可以缩短关键词，或清除主题与类型筛选。</p>
                      <button type="button" onClick={() => goAfterHours(`research/${encodeURIComponent(topicId)}`)}>查看全部 {data.topic.count} 条 →</button>
                    </div>
                  )}

                  {data.pageCount > 1 && (
                    <nav className="ah-research-pagination" aria-label="文章索引分页">
                      <button type="button" disabled={data.page <= 1} onClick={() => updateQuery({ page: String(data.page - 1) })}>← 上一页</button>
                      <span>PAGE {data.page} / {data.pageCount}</span>
                      <button type="button" disabled={data.page >= data.pageCount} onClick={() => updateQuery({ page: String(data.page + 1) })}>下一页 →</button>
                    </nav>
                  )}
                </section>
              )}

              {data.topic.count === 0 && (
                <section className="ah-research-topic-state ah-research-topic-empty">
                  <span>00 / CONTENT ARCHIVE</span>
                  <h2>{data.topic.title} · 内容等待归档。</h2>
                  <p>这里不会用演示文章填充。首批真实内容整理完成后，将自动进入同一套检索与分页结构。</p>
                  <button type="button" onClick={onBack}>返回研究分类 →</button>
                </section>
              )}
            </>
          )}
        </div>
      </div>

      <footer className="ah-collection-footer">
        <button type="button" onClick={onBack}>← 返回研究分类</button>
        <span>HSN · PRIVATE RESEARCH</span>
      </footer>
    </main>
  )
}
