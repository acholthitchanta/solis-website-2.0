import React, { useRef } from 'react'
import useReveal from '../hooks/useReveal'

export default function RegionLanding({landingImg, title, description, theme,background}) {
  const containerRef = useRef(null)
  useReveal(containerRef)
  return (
    <div ref={containerRef}className={`landing-medium ${theme} ${background}`}>
      <div className="landing-medium-text reveal">
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      <div className="landing-medium-image-wrap">
        <img src={landingImg} className="landing-medium-image" alt="" />
      </div>
    </div>
  )
}


//      <Landing landingImg={} title={""} description={""}/>
