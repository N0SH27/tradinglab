import type { ToolGroup } from './hiddenTypes'

type Props = {
  groups: ToolGroup[]
  activeGroup: number
  onSelect: (index: number) => void
}

export default function HiddenToolDirectory({ groups, activeGroup, onSelect }: Props) {
  const active = groups[activeGroup] ?? groups[0]
  if (!active) return null

  return (
    <section className="ah-tool-directory" aria-label="实用工具网站目录">
      <div className="ah-tool-tabs" role="tablist" aria-label="工具分类">
        {groups.map((group, index) => (
          <button
            type="button"
            role="tab"
            aria-selected={activeGroup === index}
            className={activeGroup === index ? 'is-active' : ''}
            onClick={() => onSelect(index)}
            key={group.id}
          >
            <span>{String(index + 1).padStart(2, '0')}</span>{group.title}<small>{group.links.length}</small>
          </button>
        ))}
      </div>
      <div className="ah-tool-directory-heading" role="tabpanel">
        <span>{active.links.length} SOURCE LINKS / 官方与明确来源</span>
        <p>{active.description}</p>
      </div>
      <div className="ah-tool-links">
        {active.links.map((link, index) => (
          <a href={link.url} target="_blank" rel="noreferrer" key={link.url}>
            <span className="ah-tool-link-index">{String(index + 1).padStart(2, '0')}</span>
            <span className="ah-tool-link-title"><strong>{link.title}</strong><small>{link.institution}</small></span>
            <span className="ah-tool-link-description">{link.description}</span>
            <span className="ah-tool-link-arrow" aria-hidden="true">↗</span>
          </a>
        ))}
      </div>
      <p className="ah-tool-source-note">选自你提供的美国数据网站清单。链接在新窗口打开；数据含义、发布时间与访问权限以原始机构页面为准。</p>
    </section>
  )
}
