import type { ReactElement } from 'react'

export type ChromaGridItem = {
  image: string
  title?: string
  subtitle?: string
  accent?: string
  borderColor?: string
  url?: string
  external?: boolean
  alt?: string
}

export type ChromaGridProps = {
  items?: ChromaGridItem[]
  columns?: number
  minCardWidth?: number
  gap?: number
  radius?: number
  softness?: number
  damping?: number
  fadeOut?: number
  grayscale?: number
  dim?: number
  glow?: number
  borderGlow?: number
  reveal?: 'spotlight' | 'card'
  aspectRatio?: string
  cardRadius?: number
  showInfo?: boolean
  frame?: boolean
  theme?: 'dark' | 'light'
  className?: string
}

export default function ChromaGrid(props: ChromaGridProps): ReactElement
