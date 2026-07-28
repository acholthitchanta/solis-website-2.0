import { useEffect } from 'react'

export default function useFitTextToLine(containerRef, selector, data = []) {
  useEffect(() => {
    if (!containerRef.current) return
    const elements = containerRef.current.querySelectorAll(selector)

    elements.forEach((el) => {
      el.style.fontSize = ''
      el.style.whiteSpace = 'nowrap'

      const naturalWidth = el.scrollWidth
      const availableWidth = el.clientWidth

      if (naturalWidth > availableWidth) {
        const scale = availableWidth / naturalWidth
        const currentSize = parseFloat(getComputedStyle(el).fontSize)
        el.style.fontSize = `${currentSize * scale}px`
      }
    })
  }, [containerRef, selector, data])
}
