import { useEffect, useState } from 'react'

export function useHashRoute() {
  const getPath = () => {
    const h = window.location.hash.replace(/^#/, '')
    return h === '' ? '/' : h
  }
  const [path, setPath] = useState(getPath)

  useEffect(() => {
    const onChange = () => {
      setPath(getPath())
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
    }
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  return path
}
