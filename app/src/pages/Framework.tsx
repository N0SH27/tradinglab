import { FRAMEWORKS } from '../data/content'
import { Label, PageHead } from '../components/Bits'

export default function Framework() {
  return (
    <div className="max-w-[1400px] mx-auto px-5 md:px-10">
      <PageHead
        no="09"
        zh="框架"
        en="FRAMEWORK"
        intro="网站的知识底座。把私人的研究习惯沉淀为公开的方法论——框架的价值不在于正确，而在于可以被检验、被复用、被推翻。"
      />

      <div className="border-t border-[rgb(var(--line))]">
        {FRAMEWORKS.map((f) => (
          <section key={f.id} className="grid md:grid-cols-12 gap-8 md:gap-10 py-14 md:py-20 hairline-b">
            <div className="md:col-span-4">
              <span className="font-mono-num tnum text-sm ink-3 block mb-4">{f.id}</span>
              <h2 className="font-serif-sc font-bold text-2xl md:text-3xl tracking-tight leading-snug mb-3">
                {f.title}
              </h2>
              <Label className="block mb-6">{f.en}</Label>
              <p className="font-serif-sc text-lg font-bold leading-relaxed">{f.core}</p>
            </div>
            <div className="md:col-span-7 md:col-start-6">
              <ol className="space-y-6">
                {f.steps.map((s, i) => (
                  <li key={i} className="flex gap-5 items-baseline hairline-b pb-6 last:border-0 last:pb-0">
                    <span className="font-mono-num tnum text-sm ink-3 shrink-0">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="text-base leading-loose ink-2">{s}</span>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
