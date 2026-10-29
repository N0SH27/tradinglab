import type { CSSProperties, ReactElement, ReactNode } from 'react'

export type StackProps = {
  cards?: ReactNode[]
  layout?: 'fan' | 'cascade' | 'deck' | 'pile'
  visible?: number
  spread?: number
  depth?: number
  radius?: number
  shadow?: boolean
  sendToBackOnClick?: boolean
  onChange?: (topIndex: number) => void
  className?: string
  style?: CSSProperties
}

export default function Stack(props: StackProps): ReactElement
