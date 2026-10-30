import { useMemo, useState, type KeyboardEvent } from 'react'
import AnimatedList from '../../components/AnimatedList'
import DomeGallery from '../../components/DomeGallery'
import Folder from '../../components/Folder'
import Masonry from '../../components/Masonry'
import Stack from '../../components/Stack'
import HiddenDashboard from './HiddenDashboard'
import HiddenBookshelf from './HiddenBookshelf'
import HiddenToolDirectory from './HiddenToolDirectory'
import { HIDDEN_BOOKS } from './hiddenBooks'
import type { HiddenCollection as Collection, HiddenCollectionId, InvestorProfile, ToolGroup } from './hiddenTypes'

type Props = {
  collection: Collection
  investors: InvestorProfile[]
  toolGroups: ToolGroup[]
  onGoHome: () => void
  onOpenLibrary: () => void
  onOpenInvestor: (id: string) => void
  onOpenResearchTopic: (id: string) => void
}

const STAGE_HELP: Partial<Record<HiddenCollectionId, string>> = {
  research: '点击或拖出最上方卷宗，切换研究分类。',
  media: '单击书脊预览封面；再次单击封面进入书籍介绍。',
  tools: '打开文件夹，或在下方按分类访问真实网站。',
  dashboards: '指数主源不可用时自动切换备用源；其他模块接入真实数据前保持空白。',
  conversations: '点击选择分类，也可聚焦列表后使用方向键。',
  investors: '拖动旋转图廊，点击人物进入独立档案；下方也可直接查找。',
}

export default function HiddenCollection({ collection, investors, toolGroups, onGoHome, onOpenLibrary, onOpenInvestor, onOpenResearchTopic }: Props) {
  const [activeGroup, setActiveGroup] = useState(0)
  const [openFolder, setOpenFolder] = useState<number | null>(null)
  const active = collection.groups[activeGroup] ?? { title: collection.title, description: collection.summary }
  const researchCount = collection.groups.reduce((total, group) => total + (group.count ?? 0), 0)

  const mediaItems = useMemo(() => collection.groups.map((group, index) => ({
    id: `media-${index}`,
    img: group.src ?? collection.src,
    title: group.title,
    description: group.description,
    alt: `${group.title}分类封面`,
    width: 900,
    height: [1180, 760, 1020][index] ?? 900,
  })), [collection.groups, collection.src])

  const investorImages = useMemo(() => investors.map(profile => ({
    src: profile.src,
    alt: profile.name,
  })), [investors])

  const openDomeProfile = (name: string) => {
    const profile = investors.find(item => item.name === name)
    if (profile) onOpenInvestor(profile.id)
  }

  const onDomeKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Enter' && event.key !== ' ') return
    if (!(event.target instanceof HTMLElement) || !event.target.classList.contains('item__image')) return
    event.preventDefault()
    event.target.click()
  }

  const renderStage = () => {
    switch (collection.id) {
      case 'research':
        return (
          <div className="ah-research-layout" data-active-group={activeGroup}>
            <div className="ah-research-stack">
              <Stack
                cards={collection.groups.map((group, index) => (
                  <article className="ah-research-card" key={group.title}>
                    <header>
                      <span>{collection.index}.{String(index + 1).padStart(2, '0')}</span>
                      <span>{collection.english}</span>
                    </header>
                    <div>
                      <span>RESEARCH DOSSIER</span>
                      <h2>{group.title}</h2>
                      <p>{group.description}</p>
                    </div>
                    <footer><span>{String(group.count ?? 0).padStart(2, '0')} / ENTRIES</span><span>点击或拖出切换 →</span></footer>
                  </article>
                ))}
                layout="cascade"
                visible={3}
                spread={0.55}
                depth={0.5}
                radius={0}
                shadow={false}
                sendToBackOnClick
                onChange={setActiveGroup}
              />
            </div>
            <aside className="ah-research-current" aria-live="polite">
              <span>CURRENT DOSSIER / {String(activeGroup + 1).padStart(2, '0')}</span>
              <h2>{active.title}</h2>
              <p>{active.description}</p>
              <div><strong>{String(active.count ?? 0).padStart(2, '0')}</strong><span>ENTRIES<br />{active.count ? '真实研究已归档' : '等待建立研究档案'}</span></div>
              {active.id && <button type="button" className="ah-research-topic-enter" onClick={() => onOpenResearchTopic(active.id!)}>进入专题 <span aria-hidden="true">→</span></button>}
            </aside>
          </div>
        )
      case 'media':
        return (
          <div className="ah-media-browser" data-active-group={activeGroup}>
            <div className="ah-media-tabs" role="tablist" aria-label="书籍与影像分类">
              {collection.groups.map((group, index) => (
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeGroup === index}
                  className="ah-media-tab"
                  onClick={() => setActiveGroup(index)}
                  key={group.title}
                >
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <strong>{group.title}</strong>
                </button>
              ))}
            </div>
            {activeGroup === 0 ? <HiddenBookshelf /> : (
              <div className="ah-media-masonry ah-media-single" role="tabpanel" aria-label={active.title}>
                <Masonry
                  items={[mediaItems[activeGroup]]}
                  columns="auto"
                  columnWidth={270}
                  gap={16}
                  radius={0}
                  captions="always"
                  lightbox={false}
                  draggable={false}
                  onItemClick={() => {}}
                />
              </div>
            )}
          </div>
        )
      case 'tools':
        return (
          <div className="ah-tool-folders" data-active-group={activeGroup}>
            {collection.groups.map((group, index) => (
              <article className="ah-tool-folder" data-active={activeGroup === index ? '' : undefined} key={group.title}>
                <Folder
                  items={(toolGroups[index]?.links ?? []).slice(0, 3).map(link => ({ title: link.title, description: link.institution }))}
                  label={group.title}
                  open={openFolder === index}
                  onOpenChange={open => {
                    setOpenFolder(open ? index : null)
                    if (open) setActiveGroup(index)
                  }}
                  onItemClick={() => setActiveGroup(index)}
                  draggable={false}
                  zoomOnClick={false}
                  layout="stack"
                  color="#2c2c2c"
                  paperColor="#e8e8e3"
                  size={0.95}
                  variant="matte"
                />
                <div className="ah-tool-folder-copy">
                  <span>{String(index + 1).padStart(2, '0')} / TOOL DRAWER</span>
                  <h2>{group.title}</h2>
                  <p>{group.description}</p>
                </div>
              </article>
            ))}
          </div>
        )
      case 'dashboards':
        return <HiddenDashboard />
      case 'conversations':
        return (
          <div className="ah-conversation-list" data-active-group={activeGroup}>
            <AnimatedList
              items={collection.groups.map((group, index) => ({
                id: `conversation-${index}`,
                title: group.title,
                description: group.description,
                meta: `ARCHIVE / ${String(index + 1).padStart(2, '0')}`,
              }))}
              initialSelectedIndex={0}
              selectOnHover={false}
              onItemSelect={(_, index) => setActiveGroup(index)}
              frame={false}
              radius={0}
              gap={0}
              width="100%"
              maxHeight={460}
              showGradients={false}
              displayScrollbar={false}
              animation="slide"
            />
          </div>
        )
      case 'investors':
        return (
          <div className="ah-investor-dome" onKeyDown={onDomeKeyDown}>
            <DomeGallery
              images={investorImages}
              onImageClick={openDomeProfile}
              fit={0.55}
              minRadius={360}
              maxRadius={620}
              segments={28}
              overlayBlurColor="#101010"
              imageBorderRadius="0px"
              grayscale
            />
          </div>
        )
      default:
        return null
    }
  }

  return (
    <main className="ah-workspace ah-collection">
      <button type="button" className="ah-note-back ah-collection-home" onClick={onGoHome}>← AFTER HOURS 目录</button>
      <header className="ah-collection-header">
        <div>
          <span>{collection.index} / {collection.english}</span>
          <h1>{collection.title}</h1>
        </div>
        <div className="ah-collection-header-meta">
          <span>{collection.id === 'investors' ? `${investors.length} / PROFILES` : collection.id === 'research' ? `${String(researchCount).padStart(2, '0')} / ENTRIES` : collection.id === 'tools' ? '21 / LINKS' : collection.id === 'dashboards' ? '06 / INDICES' : collection.id === 'media' && activeGroup === 0 ? `${String(HIDDEN_BOOKS.length).padStart(2, '0')} / BOOKS` : '00 / ENTRIES'}</span>
          <span>DIRECTORY READY</span>
        </div>
      </header>

      <section className="ah-collection-intro" aria-label="目录说明">
        <p>{collection.summary}</p>
        <span>{collection.format}</span>
      </section>

      <section className={`ah-collection-interactive ah-collection-interactive--${collection.id}`} aria-label={`${collection.title}交互目录`}>
        <div className="ah-collection-stage-heading">
          <span>{String(activeGroup + 1).padStart(2, '0')} / {active.title}</span>
          <p>{collection.id === 'media' && activeGroup !== 0 ? '当前分类的内容索引待继续归档。' : STAGE_HELP[collection.id]}</p>
        </div>
        {renderStage()}
      </section>

      {collection.id === 'tools' && <HiddenToolDirectory groups={toolGroups} activeGroup={activeGroup} onSelect={index => { setActiveGroup(index); setOpenFolder(null) }} />}
      {collection.id === 'investors' && (
        <section className="ah-investor-directory" aria-label="全部投资者档案">
          <div className="ah-investor-directory-heading"><span>20 / PROFILE INDEX</span><p>姓名字卡代表论坛 ID，不代表已核实的真实身份或公开照片。</p></div>
          <div className="ah-investor-directory-grid">
            {investors.map(profile => (
              <button type="button" onClick={() => onOpenInvestor(profile.id)} key={profile.id}>
                <img src={profile.src} alt="" loading="lazy" />
                <span><small>{profile.index} / {profile.kind}</small><strong>{profile.name}</strong><span>{profile.focus}</span></span>
                <span aria-hidden="true">↗</span>
              </button>
            ))}
          </div>
        </section>
      )}
      {!['research', 'tools', 'dashboards', 'investors'].includes(collection.id) && !(collection.id === 'media' && activeGroup === 0) && (
        <section className="ah-collection-empty" aria-label="内容归档区" aria-live="polite">
          <span>{String(activeGroup + 1).padStart(2, '0')} / CONTENT ARCHIVE</span>
          <div>
            <h2>{active.title} · 内容等待归档。</h2>
            <p>{collection.editorial}</p>
          </div>
        </section>
      )}

      <footer className="ah-collection-footer">
        <button type="button" onClick={onGoHome}>← 返回目录轮播</button>
        {collection.id !== 'library' && <button type="button" onClick={onOpenLibrary}>进入交易知识 Library →</button>}
        <span>HSN · PRIVATE COLLECTIONS</span>
      </footer>
    </main>
  )
}
