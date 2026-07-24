import React from 'react'
import { Figure, Carousel, Card, Button } from 'react-bootstrap'
import { useRef, useEffect, useState } from 'react'
import { Tab, Nav, Row, Col } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import ImageBox from './components/ImageBox'
import Counter from './components/Counter'
import landing from './assets/landing.jpg'
import landing1 from './assets/landing1.jpg'
import landing2 from './assets/landing2.jpg'
import landing3 from './assets/landing3.jpg'
import whoweare from './assets/whoweare.jpg'
import ourteam from './assets/ourteam.jpg'
import ourblog from './assets/ourblog.jpg'
import music1 from './assets/music-therapy.jpeg'
import music2 from './assets/music-therapy2.jpeg'
import art1 from './assets/neurographic-art.jpeg'
import art2 from './assets/neurographic-art1.jpg'
import nailart1 from './assets/nailart.jpg'
import nailart2 from './assets/nailart1.jpg'
import fashion1 from './assets/fashion.jpg'
import fashion2 from './assets/fashion2.jpg'
import floral1 from './assets/floral.jpeg'
import floral2 from './assets/floral2.jpeg'
import floral3 from './assets/floral3.jpeg'



export default function Home() {
  const navigate = useNavigate()
  const [activeOffer, setActiveOffer] = useState('first')

  useEffect(() => {
    const elements = document.querySelectorAll('.reveal')
    elements.forEach((el) => { el.style.opacity = 0 })
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target
          const repeats = el.classList.contains('reveal-repeat')
          if (!repeats && el.classList.contains('shift-up')) return
          if (entry.isIntersecting) {
            el.classList.remove('fade-out')
            el.classList.add('shift-up')
            el.style.opacity = 1
            if (!repeats) observer.unobserve(el)
          } else if (repeats) {
            el.classList.remove('shift-up')
            el.classList.add('fade-out')
            el.style.opacity = 0
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    )
    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <div className="landing">
        <Carousel controls={false} interval={2000}>
          <Carousel.Item>
            <img className="landing-img" src={landing}/>
          </Carousel.Item>
          <Carousel.Item>
            <img  className="landing-img" src={landing1}/>
          </Carousel.Item>
          <Carousel.Item>
            <img className="landing-img" src={landing2}/>
          </Carousel.Item>
          <Carousel.Item>
            <img className="landing-img" src={landing3}/>
          </Carousel.Item>
        </Carousel>
        <div className="box">
            <h1 className="highlight reveal reveal-repeat">SOLIS AND LUNA ARTS</h1>
            <h2 className="highlight reveal reveal-repeat">Offering companionship and joy through therapeutic creative sessions.</h2>
        </div>
      </div>

      <div className="light-blue spacer"/>
    {/* landing */}
    <div className="yellow section">
        <h1 className="reveal">THE ART OF CONNECTION</h1>
        <p className="reveal"> Solis and Luna Arts is a nonprofit 501(c)(3) student-run organization that offers companionship and encouragement to individuals facing physical and mental health troubles. Through musical performances, collaborative art workshops, nail art, and more, we are dedicated to bringing a variety art forms to as many communities as possible!</p>
        <div className="impact">
          <div className="num">
              <h1><Counter target='50'/>+</h1>
              <h4 className="reveal">Chapters</h4>
          </div>
          <div className="num">
              <h1><Counter target='350'/>+</h1>
              <h4 className="reveal">Events</h4>
          </div>
          <div className="num">
              <h1><Counter target='2000'/>+</h1>
              <h4 className="reveal">Volunteers</h4>
          </div>
          <div className="num">
              <h1><Counter target='10'/>K+</h1>
              <h4 className="reveal">Patients Impacted</h4>
          </div>
        </div>
      </div>
      
      {/* what we offer */}
      <div className="dark-blue section section-wide">
        <Tab.Container activeKey={activeOffer} onSelect={(key) => setActiveOffer(key)}>
          <Row>
            <Col sm={6}>
            <h1 className="reveal">WHAT WE OFFER</h1>
            <p className="reveal">Our chapters across the world organize personalized therapeutic events catered to each hospital, retirement home, or venue of request. We provide our patients with a variety of fun and relaxing endeavors such as live music, collaborative art workshops, nail art, floral art, and fashion. </p>
            <Tab.Container defaultActiveKey="first"></Tab.Container>
              <Nav className="flex-column activities mt-5">
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
                <Tab.Pane eventKey="first"><ImageBox pic1={music2} pic2={music1} description="Live music creates moments of comfort, connection, and joy. Our student musicians perform uplifting concerts that encourage relaxation, reduce stress, and brighten the day for audiences of all ages."/></Tab.Pane>
                <Tab.Pane eventKey="second"><ImageBox pic1={art1} pic2={art2} description="Neurographic art combines mindful drawing with creativity to encourage relaxation and self-expression. Participants transform simple lines into unique works of art while practicing focus and finding a sense of calm."/></Tab.Pane>
                <Tab.Pane eventKey="third"><ImageBox pic1={floral3} pic2={floral2} description="Floral art invites participants to explore creativity through arranging flowers and natural materials. The calming process of designing beautiful arrangements promotes mindfulness, relaxation, and a connection to nature."/></Tab.Pane>
                <Tab.Pane eventKey="fourth"><ImageBox pic1={fashion1} pic2={fashion2} description="Fashion design encourages creativity, self-expression, and confidence. Participants design and personalize wearable art, exploring their unique style while enjoying a fun, hands-on creative experience."/></Tab.Pane>
                <Tab.Pane eventKey="fifth"><ImageBox pic1={nailart1} pic2={nailart2} description="Nail art offers a fun, creative outlet that builds confidence and celebrates individuality. Through personalized nail designs, participants can express themselves while enjoying a relaxing and uplifting experience."/></Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>


      </div>
        
      {/* more about section */}
      <div className="cards light-blue">
          <Card className="reveal">
            <Card.Img var="top" src={whoweare}/>
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
            <Card.Img var="top" src={ourteam}/>
            <Card.Body>
              <Card.Title>
               OUR TEAM
              </Card.Title>
              <Card.Text>
                Our executive team is filled with dedicated students from across the country who wish to bring positivity to their communities through therapeutic art
              </Card.Text>
              <Button variant='secondary'>MEET THE TEAM</Button>
            </Card.Body>
          </Card>

          <Card className="reveal">
            <Card.Img var="top" src={ourblog}/>
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

      <footer className="footer dark-blue">
        <div className="footer-content">
          <div className="footer-columns">
            <div className="contact-learn-group">
              <div className="links">
                <h2>CONTACT US</h2>
                <p>Los Angeles, California</p>
                <p><a href="tel:+2019130331">+1 (201) 913-0331</a></p>
                <p><a target="_blank" rel="noreferrer" href="mailto:solisandlunaarts@gmail.com">solisandlunaarts@gmail.com</a></p>
              </div>

              <div className="links">
                <h2>LEARN MORE</h2>
                <div className="pages">
                  <p><a onClick={() => navigate('/')}>HOME</a></p>
                  <p><a onClick={() => navigate('/about')}>ABOUT US</a></p>
                  <p><a onClick={() => navigate('/blog')}>BLOG</a></p>
                  <p><a onClick={() => navigate('/podcast')}>PODCAST</a></p>
                  <p><a onClick={() => navigate('/press')}>PRESS</a></p>
                  <p><a onClick={() => navigate('/videos')}>VIDEOS</a></p>
                </div>
              </div>
            </div>

            <div className="footer-logo-col">
              <img id="footer-logo" src="/solis.png" alt="Solis and Luna Arts logo" height="200"/>
              <div className="social-media">
                <a className="social-box" target="_blank" rel="noreferrer" href="https://www.instagram.com/solisandlunaarts/">
                  <svg className="social" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.2c3.2 0 3.6 0 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.25.07 1.62.07 4.81s-.01 3.56-.07 4.81c-.15 3.23-1.66 4.77-4.92 4.92-1.25.06-1.62.07-4.85.07-3.2 0-3.6 0-4.85-.07-3.26-.15-4.77-1.7-4.92-4.92-.06-1.25-.07-1.62-.07-4.81s.01-3.56.07-4.81c.15-3.23 1.66-4.77 4.92-4.92 1.25-.06 1.62-.07 4.85-.07M12 0C8.74 0 8.33.01 7.05.07c-4.35.2-6.78 2.62-6.98 6.98C.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.2 4.36 2.62 6.78 6.98 6.98C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c4.35-.2 6.79-2.62 6.98-6.98.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.19-4.35-2.62-6.78-6.98-6.98C15.67.01 15.26 0 12 0Zm0 5.84A6.16 6.16 0 1 0 18.16 12 6.16 6.16 0 0 0 12 5.84Zm0 10.16A4 4 0 1 1 16 12a4 4 0 0 1-4 4Zm6.41-10.4a1.44 1.44 0 1 1-1.44-1.44 1.44 1.44 0 0 1 1.44 1.44Z"/></svg>
                </a>
                <a className="social-box" target="_blank" rel="noreferrer" href="https://www.linkedin.com/company/solisandlunaarts">
                  <svg className="social" viewBox="0 0 24 24" fill="currentColor"><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.03-1.85-3.03-1.85 0-2.14 1.44-2.14 2.94v5.66H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.35-1.85 3.58 0 4.24 2.36 4.24 5.43ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56Z"/></svg>
                </a>
                <a className="social-box" target="_blank" rel="noreferrer" href="https://www.youtube.com/@SolisandLunaArts">
                  <svg className="social" viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.38.55A3.02 3.02 0 0 0 .5 6.19 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.81 3.02 3.02 0 0 0 2.12 2.14C4.5 20.5 12 20.5 12 20.5s7.5 0 9.38-.55a3.02 3.02 0 0 0 2.12-2.14A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.81ZM9.6 15.6V8.4L15.8 12Z"/></svg>
                </a>
              </div>
            </div>
          </div>
          <p id="copyright">©2025 Solis and Luna Arts</p>
        </div>
      </footer>

    </>
  )
}
