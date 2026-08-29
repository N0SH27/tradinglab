import { ESSAYS } from '../data/content'
import { PageHead } from '../components/Bits'

export default function Essays() {
  return (
    <div className="max-w-[1400px] mx-auto px-5 md:px-10">
      <PageHead
        no="04"
        zh="文集"
        en="ESSAYS"
        intro="定期更新的长文：对行业、对交易、对世界的思考。每一篇都是完整的书写，而非碎片的观点。"
      />

      <div className="border-t border-[rgb(var(--line))]">
        {ESSAYS.map((e) => (
          <a
            key={e.id}
            href={`#/essays/${e.id}`}
            className="ink-row group grid md:grid-cols-12 gap-4 md:gap-8 py-10 md:py-14 hairline-b items-baseline"
          >
            <div className="md:col-span-2">
              <span className="label-sm block mb-3">HSN / RESEARCH / {e.no}</span>
              <span className="font-mono-num tnum text-sm block mb-2">{e.date}</span>
              <span className="label-sm water">{e.category}</span>
            </div>
            <div className="md:col-span-7">
              <h3 className="row-zh font-serif-sc font-bold text-2xl md:text-4xl leading-snug tracking-tight mb-3">
                {e.title}
              </h3>
              <p className="text-sm md:text-base leading-relaxed ink-2">{e.subtitle}</p>
            </div>
            <div className="md:col-span-3 md:text-right">
              <span className="label-sm block mb-2">阅读约 {e.readTime} 分钟</span>
            </div>
          </a>
        ))}
      </div>

      <div className="py-14 md:py-20 text-center">
        <p className="text-sm ink-3 tracking-widest">新文章不定期发布——写下，即接受检验。</p>
      </div>
    </div>
  )
}
