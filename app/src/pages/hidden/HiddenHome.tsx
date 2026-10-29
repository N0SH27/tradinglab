import CircularCarousel from '../../components/CircularCarousel'
import type { HiddenCollectionId, PrivateContent } from './hiddenTypes'

type Props = {
  content: PrivateContent
  onOpenCollection: (id: HiddenCollectionId) => void
  onOpenSearch: () => void
}

export default function HiddenHome({ content, onOpenCollection, onOpenSearch }: Props) {
  return (
    <main className="ah-private">
      <section className="ah-hero" aria-labelledby="after-hours-title">
        <p className="ah-kicker">{content.kicker}</p>
        <h1 id="after-hours-title">{content.title[0]}<br />{content.title[1]}</h1>
        <div className="ah-hero-bottom">
          <p>{content.intro}</p>
          <div className="ah-hero-actions">
            <button type="button" className="ah-command-hint" onClick={onOpenSearch}>搜索体系 <span>⌘ K</span></button>
            <button
              type="button"
              className="ah-scroll-link"
              onClick={() => document.getElementById('private-collections')?.scrollIntoView({ behavior: 'smooth' })}
            >
              探索目录 <span aria-hidden="true">↓</span>
            </button>
          </div>
        </div>
      </section>

      <section id="private-collections" className="ah-carousel-section" aria-label="私人内容目录">
        <div className="ah-section-heading">
          <span>01 / DIRECTORY</span>
          <span>{String(content.collections.length).padStart(2, '0')} COLLECTIONS</span>
        </div>
        <div className="ah-carousel-stage">
          <CircularCarousel
            items={content.collections.map(item => ({ src: item.src, alt: item.title, title: item.shortTitle, subtitle: item.format }))}
            preset="cylinder"
            intro="assemble"
            cardWidth={280}
            aspectRatio={0.78}
            gap={34}
            curve={1}
            tilt={-8}
            autoplay="off"
            draggable
            momentum={0.55}
            snap
            pauseOnHover
            focusOnClick
            parallax={0.25}
            stretch={0.35}
            depthFade={0.62}
            fadeColor="#101010"
            innerShade={0.45}
            cornerRadius={0}
            captions
            onItemClick={(_, index) => onOpenCollection(content.collections[index].id)}
          />
        </div>
      </section>
    </main>
  )
}
