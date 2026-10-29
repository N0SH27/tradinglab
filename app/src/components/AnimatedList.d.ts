import type { CSSProperties, ReactElement, ReactNode } from 'react'

export type AnimatedListItem = {
  id?: string | number
  title: ReactNode
  description?: ReactNode
  meta?: ReactNode
}

export type AnimatedListProps = {
  items?: AnimatedListItem[]
  initialSelectedIndex?: number
  selectOnHover?: boolean
  onItemSelect?: (item: AnimatedListItem, index: number) => void
  frame?: boolean
  radius?: number
  gap?: number
  width?: number | string
  maxHeight?: number | string
  showGradients?: boolean
  displayScrollbar?: boolean
  animation?: 'pop' | 'slide' | 'fade' | 'none'
  className?: string
  style?: CSSProperties
}

export default function AnimatedList(props: AnimatedListProps): ReactElement
