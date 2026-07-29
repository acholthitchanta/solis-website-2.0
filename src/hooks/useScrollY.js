import { useState, useEffect } from 'react'

export default function useScrollY() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    let ticking = false

    function handleScroll() {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY)
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return scrollY
}
