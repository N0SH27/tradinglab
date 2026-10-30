import type { CSSProperties, ReactElement, ReactNode } from 'react'

export type MagicBentoItem = {
  id?: string | number
  title?: string
  description?: string
  label?: string
  visual?: ReactNode
  colSpan?: number
  rowSpan?: number
}

export type MagicBentoProps = {
  items?: MagicBentoItem[]
  columns?: number
  rowHeight?: number
  gap?: number
  radius?: number
  glowColor?: string
  textAutoHide?: boolean
  intro?: boolean
  className?: string
  style?: CSSProperties
  onItemClick?: (item: MagicBentoItem, index: number) => void
}

export default function MagicBento(props: MagicBentoProps): ReactElement
