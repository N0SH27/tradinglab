import { useMemo, useState, type KeyboardEvent, type MouseEvent } from 'react'
import AnimatedList from '../../components/AnimatedList'
import DomeGallery from '../../components/DomeGallery'
import Folder from '../../components/Folder'
import MagicBento from '../../components/MagicBento'
import Masonry from '../../components/Masonry'
import Stack from '../../components/Stack'
import type { HiddenCollection as Collection, HiddenCollectionId } from './hiddenTypes'

type Props = {
  collection: Collection
  onGoHome: () => void
  onOpenLibrary: () => void
}

const STAGE_HELP: Partial<Record<HiddenCollectionId, string>> = {
  research: '点击或拖出最上方卷宗，切换研究分类。',
  media: '选择一张封面，查看对应的内容归档。',
  tools: '打开文件夹，整理工具索引、说明与工作流。',
  dashboards: '选择看板分类；真实数据接入前不展示数值。',
  conversations: '点击选择分类，也可聚焦列表后使用方向键。',
  investors: '拖动旋转图廊，点击图块放大并选择框架分类。',
}

const TOOL_SHEETS = [
  { title: '工具索引', description: '内容等待归档' },
  { title: '使用说明', description: '口径等待补充' },
  { title: '工作流', description: '步骤等待整理' },
]

function DashboardPlaceholder() {
  return (
    <div className="ah-dashboard-placeholder">
      <span className="ah-dashboard-cross" aria-hidden="true">+</span>
      <span>WAITING FOR DATA</span>
    </div>
  )
}

export default function HiddenCollection({ collection, onGoHome, onOpenLibrary }: Props) {
  const [activeGroup, setActiveGroup] = useState(0)
  const [openFolder, setOpenFolder] = useState<number | null>(null)
  const active = collection.groups[activeGroup] ?? { title: collection.title, description: collection.summary }

  const mediaItems = useMemo(() => collection.groups.map((group, index) => ({
    id: `media-${index}`,
    img: group.src ?? collection.src,
    title: group.title,
    description: group.description,
    alt: `${group.title}分类封面`,
    width: 900,
    height: [1180, 760, 1020][index] ?? 900,
  })), [collection.groups, collection.src])

  const investorImages = useMemo(() => collection.groups.map(group => ({
    src: group.src ?? collection.src,
    alt: group.title,
  })), [collection.groups, collection.src])

  const selectDomeTile = (target: EventTarget | null) => {
    if (!(target instanceof Element)) return
    const tile = target.closest('.item__image')
    if (!tile) return
    const index = collection.groups.findIndex(group => group.title === tile.getAttribute('aria-label'))
    if (index >= 0) setActiveGroup(index)
  }

  const onDomeClick = (event: MouseEvent<HTMLDivElement>) => {
    selectDomeTile(event.target)
  }

  const onDomeKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Enter' && event.key !== ' ') return
    if (!(event.target instanceof HTMLElement) || !event.target.classList.contains('item__image')) return
    event.preventDefault()
    selectDomeTile(event.target)
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
                    <footer><span>00 / ENTRIES</span><span>点击或拖出 →</span></footer>
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
              <div><strong>00</strong><span>ENTRIES<br />等待建立研究档案</span></div>
            </aside>
          </div>
        )
      case 'media':
        return (
          <div className="ah-media-masonry" data-active-group={activeGroup}>
            <Masonry
              items={mediaItems}
              columns="auto"
              columnWidth={270}
              gap={16}
              radius={0}
              captions="always"
              lightbox={false}
              draggable={false}
              onItemClick={(_, index) => setActiveGroup(index)}
            />
          </div>
        )
      case 'tools':
        return (
          <div className="ah-tool-folders" data-active-group={activeGroup}>
            {collection.groups.map((group, index) => (
              <article className="ah-tool-folder" data-active={activeGroup === index ? '' : undefined} key={group.title}>
                <Folder
                  items={TOOL_SHEETS}
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
        return (
          <div className="ah-dashboard-grid" data-active-group={activeGroup}>
            <MagicBento
              items={collection.groups.map((group, index) => ({
                id: `dashboard-${index}`,
                title: group.title,
                description: group.description,
                label: `${String(index + 1).padStart(2, '0')} / NO SOURCE`,
                visual: <DashboardPlaceholder />,
                colSpan: index === 0 ? 2 : 1,
                rowSpan: index === 0 ? 2 : 1,
              }))}
              columns={3}
              rowHeight={180}
              gap={12}
              radius={0}
              glowColor="#f7f7f7"
              textAutoHide={false}
              onItemClick={(_, index) => setActiveGroup(index)}
            />
          </div>
        )
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
          <div
            className="ah-investor-dome"
            data-active-group={activeGroup}
            onClickCapture={onDomeClick}
            onKeyDown={onDomeKeyDown}
          >
            <DomeGallery
              images={investorImages}
              fit={0.55}
              minRadius={360}
              maxRadius={620}
              segments={28}
              overlayBlurColor="#101010"
              openedImageWidth="min(78vw, 560px)"
              openedImageHeight="min(110vw, 420px)"
              imageBorderRadius="0px"
              openedImageBorderRadius="0px"
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
          <span>00 / ENTRIES</span>
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
          <p>{STAGE_HELP[collection.id]}</p>
        </div>
        {renderStage()}
      </section>

      <section className="ah-collection-empty" aria-label="内容归档区" aria-live="polite">
        <span>{String(activeGroup + 1).padStart(2, '0')} / CONTENT ARCHIVE</span>
        <div>
          <h2>{active.title} · 内容等待归档。</h2>
          <p>{collection.editorial}</p>
        </div>
      </section>

      <footer className="ah-collection-footer">
        <button type="button" onClick={onGoHome}>← 返回目录轮播</button>
        {collection.id !== 'library' && <button type="button" onClick={onOpenLibrary}>进入交易知识 Library →</button>}
        <span>HSN · PRIVATE COLLECTIONS</span>
      </footer>
    </main>
  )
}
