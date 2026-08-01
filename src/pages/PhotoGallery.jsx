import Landing from '../components/Landing'
import { useEffect, useState, useRef, useMemo } from 'react'
import { getPhotos } from '../services/DataService'
import useReveal from '../hooks/useReveal'

const PAGE_SIZE = 9

export default function PhotoGallery() {

  const [pictures, setPictures] = useState(null)
  const [loading, setLoading] = useState(true)
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const galleryRef = useRef(null)
  useReveal(galleryRef, useMemo(()=> ({pictures}), [pictures]))

  useEffect(() => {

    async function fetchPics() {
      const files = await getPhotos()

      if (files.length == 0) {
        console.log("No sponsors found")
      }
      console.log(files)
      setPictures(files)
      setLoading(false)
    }

    fetchPics();

  }, [])



  return (
    <div ref={galleryRef}>
      <Landing theme='blue' title={"PHOTO GALLERY"} description={"Pictures from our events across all chapters!"} />
      <div className="section-wide">
        {loading ? (
          <div className="gallery-skeleton-grid">
            {Array.from({ length: PAGE_SIZE }).map((_, i) => (
              <div key={i} className="gallery-skeleton-item" />
            ))}
          </div>
        ) : pictures && pictures.length > 0 ? (
          <>
            <div className="gallery-grid">
              {pictures.slice(0, visibleCount).map((url) => (
                <img key={url} src={url} alt="" className="gallery-photo" loading="lazy" />
              ))}
            </div>
            {pictures.length > visibleCount && (
              <div className="gallery-show-more-btn" onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}>
                SHOW MORE
              </div>
            )}
          </>
        ) : (
          <p>No photos yet.</p>
        )}
      </div>
    </div>
  )
}
