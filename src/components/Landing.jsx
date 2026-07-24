import React, { useRef } from 'react'
import useReveal from '../hooks/useReveal'

export default function Landing({landingImg, title, description}) {
  const containerRef = useRef(null)
  useReveal(containerRef)

  return (
      <div className="landing" ref={containerRef}>
        <img className="landing-img" src={landingImg} />
        <div className="box">
          <h1 className="highlight reveal reveal-repeat">{title}</h1>
          {description && <h2 className="highlight reveal reveal-repeat">{description}</h2>}
        </div>
      </div>
  )
}
