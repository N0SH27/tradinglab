import { useRef } from 'react'
import { grantHiddenEntry, HIDDEN_ROUTE } from '../lib/hiddenAccess'
import { HSNSymbol } from './Brand'

const CLICK_WINDOW = 700

export function HiddenEntryLogo() {
  const clicks = useRef<number[]>([])

  const registerClick = () => {
    const now = Date.now()
    clicks.current = [...clicks.current.filter(time => now - time <= CLICK_WINDOW), now]
    if (clicks.current.length < 3) return

    clicks.current = []
    grantHiddenEntry()
    window.location.hash = HIDDEN_ROUTE
  }

  return (
    <button
      type="button"
      className="block cursor-default select-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-[rgb(var(--cinnabar))]"
      onClick={registerClick}
      aria-label="HSN 符号"
    >
      <HSNSymbol size={72} className="opacity-90 pointer-events-none" />
    </button>
  )
}
