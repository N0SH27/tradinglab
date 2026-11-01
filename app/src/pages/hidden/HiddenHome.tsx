import { useLayoutEffect } from 'react'
import CircularCarousel from '../../components/CircularCarousel'
import type { HiddenCollectionId, PrivateContent } from './hiddenTypes'

type Props = {
  content: PrivateContent
  initialIndex: number
  onOpenCollection: (id: HiddenCollectionId) => void
  onSelectionChange: (index: number) => void
}

export default function HiddenHome({ content, initialIndex, onOpenCollection, onSelectionChange }: Props) {
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [])

  return (
    <main className="ah-private">
      <section className="ah-home-directory" aria-labelledby="after-hours-title">
        <div className="ah-home-heading">
          <div>
            <p className="ah-kicker">{content.kicker}</p>
            <h1 id="after-hours-title">{content.title[0]} {content.title[1]}</h1>
          </div>
        </div>

        <div className="ah-home-divider" aria-hidden="true" />

        <div className="ah-carousel-stage">
          <CircularCarousel
            items={content.collections.map(item => ({ src: item.src, alt: item.title, title: item.shortTitle, subtitle: item.format }))}
            preset="cylinder"
            intro="assemble"
            cardWidth={300}
            aspectRatio={0.78}
            gap={34}
            curve={1}
            tilt={-8}
            autoplay="off"
            draggable
            wheel="both"
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
            initialIndex={initialIndex}
            onChange={onSelectionChange}
            onItemClick={(_, index) => onOpenCollection(content.collections[index].id)}
          />
        </div>
      </section>
    </main>
  )
}
