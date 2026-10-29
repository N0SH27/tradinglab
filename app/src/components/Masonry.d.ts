import type { CSSProperties, MouseEvent, ReactElement } from 'react'

export type MasonryItem = {
  id: string | number
  img: string
  title?: string
  description?: string
  alt?: string
  width?: number
  height?: number
}

export type MasonryProps = {
  items?: MasonryItem[]
  columns?: number | 'auto'
  columnWidth?: number
  gap?: number
  radius?: number
  captions?: 'hover' | 'always' | 'none'
  lightbox?: boolean
  draggable?: boolean
  className?: string
  style?: CSSProperties
  onItemClick?: (item: MasonryItem, index: number, event: MouseEvent<HTMLElement>) => void
}

export default function Masonry(props: MasonryProps): ReactElement
