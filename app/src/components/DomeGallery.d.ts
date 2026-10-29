import type { ReactElement } from 'react'

export type DomeGalleryProps = {
  images?: { src: string; alt: string }[]
  fit?: number
  fitBasis?: 'auto' | 'min' | 'max' | 'width' | 'height'
  minRadius?: number
  maxRadius?: number
  segments?: number
  overlayBlurColor?: string
  openedImageWidth?: string
  openedImageHeight?: string
  imageBorderRadius?: string
  openedImageBorderRadius?: string
  grayscale?: boolean
}

export default function DomeGallery(props: DomeGalleryProps): ReactElement
