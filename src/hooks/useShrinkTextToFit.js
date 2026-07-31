import { useEffect } from 'react'

// Shrinks each element's font size just enough that its full text fits
// within its own (fixed-height) box, instead of truncating/clamping it.
export default function useShrinkTextToFit(containerRef, selector, data = [], minFontSize = 10) {
  useEffect(() => {
    if (!containerRef.current) return
    const elements = containerRef.current.querySelectorAll(selector)

    elements.forEach((el) => {
      el.style.fontSize = ''
      let fontSize = parseFloat(getComputedStyle(el).fontSize)

      while (el.scrollHeight > el.clientHeight && fontSize > minFontSize) {
        fontSize -= 0.5
        el.style.fontSize = `${fontSize}px`
      }
    })
  }, [containerRef, selector, data])
}
