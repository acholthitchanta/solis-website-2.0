import React from 'react'

export default function Landing({landingImg, title, description}) {
  return (
      <div className="landing">
        <img className="landing-img" src={landingImg} />
        <div className="box">
          <h1 className="highlight reveal reveal-repeat">{title}</h1>
          <h2 className="highlight reveal reveal-repeat">{description}</h2>
        </div>
      </div>
  )
}
