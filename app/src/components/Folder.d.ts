import type { CSSProperties, ReactElement } from 'react'

export type FolderItem = { title?: string; description?: string }

export type FolderProps = {
  items?: FolderItem[]
  label?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onItemClick?: (item: FolderItem, index: number) => void
  draggable?: boolean
  zoomOnClick?: boolean
  layout?: 'spread' | 'row' | 'stack'
  color?: string
  paperColor?: string
  size?: number
  variant?: 'solid' | 'glass' | 'matte'
  className?: string
  style?: CSSProperties
}

export default function Folder(props: FolderProps): ReactElement
