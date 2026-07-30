import landing from '../assets/gallerylanding.jpg'
import Landing from '../components/Landing'


export default function PhotoGallery() {
  return (
    <div>
      <Landing theme='light-blue' background='db' landingImg={landing} title={"PHOTO GALLERY"} description={"Solis and Luna Arts started in 2021 as a small school club in Bergen County, New Jersey by Chloey Cho."} />
      <div className="section-medium dark-blue">
        <h1>COMING SOON</h1>
        <p>We're working on this page — check back soon!</p>
      </div>
    </div>
  )
}
