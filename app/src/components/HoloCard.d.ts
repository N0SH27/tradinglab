import type { CSSProperties, ReactElement } from 'react'

export type HoloCardProps = {
  image?: string
  backImage?: string
  alt?: string
  preset?: 'bursts' | 'stars' | 'shards' | 'cosmos' | 'rainbow' | 'swirl' | 'glitter' | 'gold'
  intensity?: number
  scale?: number
  edgeSparkle?: number
  frame?: number
  glare?: number
  foilColor?: string
  width?: number
  radius?: number
  tiltMax?: number
  hoverScale?: number
  idle?: boolean
  shadow?: boolean
  className?: string
  style?: CSSProperties
}

export default function HoloCard(props: HoloCardProps): ReactElement
