import landing from '../assets/gallerylanding.jpg'
import Landing from '../components/Landing'


export default function PhotoGallery() {
  return (
    <div>
      <Landing theme='light-blue' background='db' landingImg={landing} title={"PHOTO GALLERY"} description={"Solis and Luna Arts started in 2021 as a small school club in Bergen County, New Jersey by Chloey Cho."} />
        <div className="section-medium dark-blue">
        <h1>PHOTO GALLERY</h1>
        <p>Take a look back at our performances, workshops, and the communities we've had the privilege to serve.</p>
      </div>

      <div className="section-medium light-blue">
        <h1>COMING SOON</h1>
        <p>We're working on this page — check back soon!</p>
      </div>
    </div>
  )
}
