import React from 'react'
import { Figure, Carousel, Card, Button } from 'react-bootstrap'
import { useRef, useState } from 'react'
import { Tab, Nav, Row, Col } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import useReveal from '../hooks/useReveal'
import ImageBox from '../components/ImageBox'
import Counter from '../components/Counter'
import landing from '../assets/homepage/landing.jpg'
import landing1 from '../assets/homepage/landing1.jpg'
import landing2 from '../assets/homepage/landing2.jpg'
import landing3 from '../assets/homepage/landing3.jpg'
import whoweare from '../assets/homepage/ourmission.jpg'
import ourteam from '../assets/homepage/ourteam.jpg'
import ourblog from '../assets/homepage/ourblog.jpg'
import music1 from '../assets/homepage/music-therapy.jpeg'
import music2 from '../assets/homepage/music-therapy2.jpeg'
import art1 from '../assets/homepage/neurographic-art.jpeg'
import art2 from '../assets/homepage/neurographic-art1.jpg'
import nailart1 from '../assets/homepage/nailart.jpg'
import nailart2 from '../assets/homepage/nailart1.jpg'
import fashion1 from '../assets/homepage/fashion.jpg'
import fashion2 from '../assets/homepage/fashion2.jpg'
import floral1 from '../assets/homepage/floral.jpeg'
import floral2 from '../assets/homepage/floral2.jpeg'
import floral3 from '../assets/homepage/floral3.jpeg'



export default function Home() {
  const navigate = useNavigate()
  const [activeOffer, setActiveOffer] = useState('first')
  const homeRef = useRef(null)
  useReveal(homeRef)

  return (
    <div ref={homeRef} className="home-page">
      <div className="landing">
        <Carousel controls={false} interval={2000}>
          <Carousel.Item>
            <img className="landing-img" src={landing} />
          </Carousel.Item>
          <Carousel.Item>
            <img className="landing-img" src={landing1} />
          </Carousel.Item>
          <Carousel.Item>
            <img className="landing-img" src={landing2} />
          </Carousel.Item>
          <Carousel.Item>
            <img className="landing-img" src={landing3} />
          </Carousel.Item>
        </Carousel>
        <div className="box">
          <h1 className="highlight reveal reveal-repeat">SOLIS AND LUNA ARTS</h1>
          <h2 id="solisdescription" className="highlight reveal reveal-repeat">Offering companionship and joy through therapeutic creative sessions.</h2>
        </div>
      </div>

      <div className="light-blue spacer" />
      {/* landing */}
      <div className="yellow section">
        <header>
          <h1 className="reveal">THE ART OF CONNECTION</h1>
          <p className="reveal"> Solis and Luna Arts is a student-run 501(c)(3) organization that offers companionship and encouragement to individuals facing physical and mental health troubles. Through musical performances, collaborative art workshops, nail art, and more, we are dedicated to bringing a variety art forms to as many communities as possible!</p>
        </header>
        <div className="impact">
          <div className="num">
            <h1><Counter target='50' />+</h1>
            <h4 className="reveal">Chapters</h4>
          </div>
          <div className="num">
            <h1><Counter target='350' />+</h1>
            <h4 className="reveal">Events</h4>
          </div>
          <div className="num">
            <h1><Counter target='2000' />+</h1>
            <h4 className="reveal">Volunteers</h4>
          </div>
          <div className="num">
            <h1><Counter target='10' />K+</h1>
            <h4 className="reveal">Patients Impacted</h4>
          </div>
        </div>
      </div>

      {/* what we offer */}
      <div className="dark-blue section section-wide offer-section">
        <Tab.Container activeKey={activeOffer} onSelect={(key) => setActiveOffer(key)}>
          <Row>
            <Col sm={6}>
              <header>
                <h1 className="reveal">WHAT WE OFFER</h1>
                <p className="reveal">Our chapters across the world organize personalized therapeutic events catered to each hospital, retirement home, or venue of request. We provide our patients with a variety of fun and relaxing endeavors such as live music, collaborative art workshops, nail art, floral art, and fashion. </p>
              </header>
              <Tab.Container defaultActiveKey="first"></Tab.Container>
              <Nav className="flex-column activities mt-4">
                <Nav.Item>
                  <Nav.Link eventKey="first">Musical Performances</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="second">Neurographic Art</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="third">Floral Art Making</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="fourth">Fashion Design</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="fifth">Nail Art Sessions</Nav.Link>
                </Nav.Item>
              </Nav>
            </Col>
            <Col sm={5}>
              <Tab.Content key={activeOffer}>
                <Tab.Pane eventKey="first"><ImageBox pic1={music2} pic2={music1} description="The goal of our music performances is to perform what our patients would like to hear. Through these tailored performances and encouraging our patients to sing along, we hope to bring comfort, connection, and uplift audiences of all ages." /></Tab.Pane>
                <Tab.Pane eventKey="second"><ImageBox pic1={art1} pic2={art2} description="During our Neurographic Art sessions, participants create a “neuro” line after thinking about a stressor or goal, create the sharp edges into rounded corners, and add a sprinkle of color. With these sessions, we aim for a quiet, stress-free mind." /></Tab.Pane>
                <Tab.Pane eventKey="third"><ImageBox pic1={floral3} pic2={floral2} description="With our flower arrangement sessions, we wish for our audiences to choose flowers of their liking to create long-lasting bouquets. This intentional interaction with fresh blooms stimulates the mind and calms the nervous system." /></Tab.Pane>
                <Tab.Pane eventKey="fourth"><ImageBox pic1={fashion1} pic2={fashion2} description="Working with delicate fabrics and clothes as a base allows participants to enter a state of flow and focus, and gives quick gratification with a beautiful, finished work. Our volunteers ensure a safe and welcoming environment where you can freely explore your creativity." /></Tab.Pane>
                <Tab.Pane eventKey="fifth"><ImageBox pic1={nailart1} pic2={nailart2} description="When our volunteers do nails for patients, it is an intentional way of promoting human connection and care. By having our participants choose their own design and preferred color scheme, we aim to give back a powerful sense of agency and self-expression." /></Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>


      </div>

      {/* more about section */}
      <div className="section-wide light-blue more-about-section">
        <header>
          <h1 className="reveal">DISCOVER SOLIS</h1>
          <p className="reveal">Take a closer look at who we are, where we came from, and what other programs we run!</p>
        </header>
        <div className="cards">
          <Card className="reveal">
            <Card.Img var="top" src={whoweare} />
            <Card.Body>
              <Card.Title>
                OUR MISSION
              </Card.Title>
              <Card.Text>
                Our goal is to bring together passionate musicians, artists, and creators who use their skills to lift the spirits of those in need and make a lasting impact in their communities.             </Card.Text>
              <Button variant='secondary'>LEARN MORE</Button>
            </Card.Body>
          </Card>

          <Card className="reveal">
            <Card.Img var="top" src={ourteam} />
            <Card.Body>
              <Card.Title>
                OUR PODCAST
              </Card.Title>
              <Card.Text>
                Hosted by Willow Yoo, our podcast began with conversations on music therapy and has since grown to feature interdisciplinary professionals and youth leaders exploring creativity's role in social good and wellbeing.
              </Card.Text>
              <Button variant='secondary'>LISTEN NOW</Button>
            </Card.Body>
          </Card>

          <Card className="reveal">
            <Card.Img var="top" src={ourblog} />
            <Card.Body>
              <Card.Title>
                OUR BLOG
              </Card.Title>
              <Card.Text>
                Our writing department focuses on blogging updates on the organization and spreading knowledge on various forms of therapy through articles and newsletters
              </Card.Text>
              <Button variant='secondary'>READ OUR ARTICLES</Button>
            </Card.Body>
          </Card>
        </div>
      </div>

      {/* interested in joining */}
      <div className="yellow section-wide join-section">
        <header style={{maxWidth: '700px'}}>
          <h1 className="reveal">GET INVOLVED</h1>
          <p className="reveal">Whether you're an artist, a musician, an organizer, or simply someone who supports our mission, there's a place for you here. We welcome volunteers of all ages and skill levels to join us in sharing the beauty of art.</p>
        </header>
        <div className="volunteer-cards-row">
          <div className="volunteer-cards marine text-white">
            <h2>FIND A LOCAL CHAPTER</h2>
            <p>
              Take a look at our <a href="/chapters">chapters page</a> to locate one near you. If there isn't one yet, consider <a href="/support-us">starting your own branch</a> to bring Solis to your region!
            </p>
            <button className="volunteer-arrow" aria-label="Find your local chapter" onClick={() => navigate('/chapters')}>›</button>
          </div>

          <div className="volunteer-cards dark-blue">
            <h2>JOIN OUR TEAM</h2>
            <p>Get involved with one of the many teams that keep our organization running: finance, outreach, media, writing, or tech &amp; impact.</p>
            <button className="volunteer-arrow" aria-label="Join our team" onClick={() => navigate('/support-us')}>›</button>
          </div>

          <div className="volunteer-cards light-blue">
            <h2>DONATE</h2>
            <p>We rely on generous donations from organizations and individuals who give to our cause. Every contribution allows us to continue bringing therapeutic arts to our community.</p>
            <button className="volunteer-arrow" aria-label="Donate now" onClick={() => navigate('/support-us#donate')}>›</button>
          </div>
        </div>
      </div>
    </div>
  )
}
