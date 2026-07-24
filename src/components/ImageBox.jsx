import React from 'react'

export default function ImageBox({pic1, pic2, pic3, description}) {
  return (
    <div className="imagebox">
      <img className="imagebox-main" src={pic1} alt=""/>
      <img className="imagebox-secondary" src={pic2} alt=""/>
      <div className="imagebox-circle">
        <p>{description}</p>
      </div>
    </div>
  )
}
