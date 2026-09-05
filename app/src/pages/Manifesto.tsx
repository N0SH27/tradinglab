import { MANIFESTO, MANIFESTO_CLOSING, SITE } from '../data/content'
import { Label, PageHead } from '../components/Bits'

export default function Manifesto() {
  return (
    <div className="max-w-[1400px] mx-auto px-5 md:px-10">
      <PageHead
        no="01"
        zh="宣言"
        en="MANIFESTO"
        intro="这不是自我介绍，而是回答一个问题：我是如何理解技术、资本、周期与人性。"
      />

      {/* 宣言五行已回首页（V2-C.1 · 2026-09-05 Human 裁决 D1=YES）：
          One Object → One Primary Home——核心品牌宣言唯一 Primary Home = Homepage，
          本页不再重复渲染 site.ts description 段落。 */}

      <div>
        {MANIFESTO.map((m, i) => (
          <section
            key={m.id}
            className={`grid md:grid-cols-12 gap-6 md:gap-10 py-14 md:py-20 ${
              i > 0 ? 'hairline-t' : 'border-t border-[rgb(var(--line))]'
            }`}
          >
            <div className="md:col-span-4">
              <span className="font-mono-num tnum text-sm ink-3 block mb-4">{m.id}</span>
              <h2 className="font-serif-sc font-bold text-2xl md:text-4xl tracking-tight leading-snug">
                {m.title}
              </h2>
              <Label className="block mt-3">{m.en}</Label>
            </div>
            <div className="md:col-span-7 md:col-start-6 space-y-6">
              {m.body.map((p, j) => (
                <p
                  key={j}
                  className={`leading-loose ${
                    j === 0 ? 'text-lg md:text-xl' : 'text-base ink-2'
                  }`}
                >
                  {p}
                </p>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="hairline-t py-16 md:py-24 text-center">
        <p className="font-serif-sc text-xl md:text-3xl font-bold leading-relaxed tracking-wide max-w-3xl mx-auto">
          {MANIFESTO_CLOSING.quote}
        </p>
        <p className="mt-8 text-sm md:text-base leading-loose ink-2 max-w-2xl mx-auto">
          {MANIFESTO_CLOSING.body}
        </p>
        <p className="mt-10 label-sm">{SITE.author}</p>
      </div>
    </div>
  )
}
