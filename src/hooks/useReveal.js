import { useEffect } from 'react'

export default function useReveal(containerRef) {
  useEffect(() => {
    const elements = containerRef.current.querySelectorAll('.reveal')
    elements.forEach((el) => { el.style.opacity = 0 })
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target
          const repeats = el.classList.contains('reveal-repeat')
          if (!repeats && el.classList.contains('shift-up')) return
          if (entry.isIntersecting) {
            el.classList.remove('fade-out')
            el.classList.add('shift-up')
            el.style.opacity = 1
            if (!repeats) observer.unobserve(el)
          } else if (repeats) {
            el.classList.remove('shift-up')
            el.classList.add('fade-out')
            el.style.opacity = 0
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    )
    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])
}
