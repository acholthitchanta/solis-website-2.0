import { useEffect, useState } from 'react'
import pressIMG from '../assets/press.jpg'
import Landing from '../components/Landing'
import { getPress } from '../services/DataService'

const CARD_THEMES = ['white', 'yellow', 'light-blue', 'dark-blue']

export default function PressFeatures() {
  const [press, setPress] = useState(null)
  const [pressLoading, setPressLoading] = useState(true)

  useEffect(() => {
    async function fetchPress() {
      const { data, error } = await getPress();
      if (error) {
        console.error(error)
        setPressLoading(false)
        return
      }
      setPress(data)
      setPressLoading(false)
    }

    fetchPress()
  }, [])

  return (
    <div>
      <Landing theme="light-blue" background="orange-bg" landingImg={pressIMG} title={"PRESS FEATURES"} description={"See where Solis and Luna Arts has been recognized for our work bringing therapeutic art to communities."}/>

      <div className="section-medium orange">
        {pressLoading ? (
          <div className="press-grid">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="press-card press-card-skeleton">
                <div className="press-card-header">
                  <div className="press-skeleton press-skeleton-publisher" />
                  <div className="press-skeleton press-skeleton-logo" />
                </div>
                <div className="press-skeleton press-skeleton-line" />
                <div className="press-skeleton press-skeleton-line short" />
              </div>
            ))}
          </div>
        ) : press && press.length > 0 ? (
          <div className="press-grid">
            {press.map((item, index) => (
              <a
                key={item.id}
                className={`press-card theme-${CARD_THEMES[index % CARD_THEMES.length]}`}
                href={item.article_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="press-card-header">
                  <h3>{item.publisher}</h3>
                  {item.article_logo_url && <img src={item.article_logo_url} alt={item.publisher} />}
                </div>
                <p>{item.description}</p>
              </a>
            ))}
          </div>
        ) : (
          <p>No press features yet.</p>
        )}
      </div>
    </div>
  )
}
