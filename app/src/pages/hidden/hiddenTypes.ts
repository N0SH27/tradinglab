export type DomainId = 'foundation' | 'language' | 'tools' | 'structure' | 'execution' | 'review'
export type NoteType = 'concept' | 'rule' | 'setup' | 'indicator' | 'lesson' | 'case'

export type HiddenSection = {
  heading: string
  text?: string
  items?: string[]
}

export type PrivateNote = {
  slug: string
  index: string
  title: string
  tag: string
  type: NoteType
  domain: DomainId
  topics: string[]
  status: 'draft' | 'reviewing' | 'verified' | 'archived'
  src: string
  summary: string
  readingMinutes: number
  updatedAt: string
  reviewCount: number
  featured: boolean
  featuredOrder: number
  sections: HiddenSection[]
  relatedSlugs: string[]
}

export type HiddenDomain = {
  id: DomainId
  index: string
  name: string
  english: string
  description: string
}

export type HiddenPath = {
  title: string
  progress: string
  current: string
  targetSlug: string
  steps: { label: string; state: 'done' | 'current' | 'next' }[]
}

export type HiddenCollectionId = 'library' | 'research' | 'media' | 'tools' | 'dashboards' | 'conversations' | 'investors'

export type HiddenCollection = {
  id: HiddenCollectionId
  index: string
  title: string
  shortTitle: string
  english: string
  summary: string
  src: string
  format: string
  groups: { title: string; description: string; src?: string }[]
  editorial: string
}

export type InvestorProfile = {
  id: string
  index: string
  name: string
  english: string
  kind: string
  focus: string
  era?: string
  summary: string
  src: string
  framework: string[]
  execution: string[]
  risks: string[]
  checklist: string[]
  sources: { label: string; locator: string; url?: string }[]
  attribution: string
  photoSource?: { label: string; url: string }
}

export type ToolGroup = {
  id: string
  title: string
  description: string
  links: { title: string; institution: string; url: string; description: string }[]
}

export type PrivateContent = {
  kicker: string
  title: [string, string]
  intro: string
  collections: HiddenCollection[]
  domains: HiddenDomain[]
  notes: PrivateNote[]
  currentPath: HiddenPath
  investors: InvestorProfile[]
  toolGroups: ToolGroup[]
}

export const NOTE_TYPE_LABELS: Record<NoteType, string> = {
  concept: '概念',
  rule: '规则',
  setup: 'Setup',
  indicator: '指标',
  lesson: '课程',
  case: '案例',
}

export const DOMAIN_LABELS: Record<DomainId, string> = {
  foundation: '起点与认知',
  language: '市场语言',
  tools: '工具与测量',
  structure: '结构与资金',
  execution: '执行系统',
  review: '复盘与验证',
}

export function goAfterHours(path = '') {
  window.location.hash = path ? `/after-hours/${path}` : '/after-hours'
}
