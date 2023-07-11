import { useEffect, useState } from 'react'

export default function useScrollPosition() {
  const [scrollPosition, setScrollPosition] = useState(0)
  const handleScroll = () => {
    const position = window.scrollY
    setScrollPosition(
      position / (window.document.scrollingElement?.scrollHeight ?? 1)
    )
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return scrollPosition
}
