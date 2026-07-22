import React from 'react'
import { Figure, Carousel, Card, Button } from 'react-bootstrap'
import landing from './assets/landing.jpg'
import landing1 from './assets/landing1.jpg'
import landing2 from './assets/landing2.jpg'
import landing3 from './assets/landing3.jpg'

export default function Home() {
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
            <h1 className="highlight">SOLIS AND LUNA ARTS</h1>
            <h2 className="highlight">Offering companionship and joy through therapeutic creative sessions.</h2>
        </div>
      </div>

      <div class="yellow spacer"/>

      
      <div class="cards light-blue">
          <Card> 
            <Card.Body>
              <Card.Title>
                WHO WE ARE
              </Card.Title>
              <Card.Text>
                Solis and Luna Arts is a 501(c)(3) organization that offers companionship and encouragement to people with physical and mental health issues through student-led therapeutic creative concerts and sessions.
              </Card.Text>
              <Button variant='secondary'>LEARN MORE</Button>
            </Card.Body>

          </Card>

          <Card > 
            <Card.Body>
              <Card.Title>
               OUR TEAM
              </Card.Title>
              <Card.Text>
                Our executive team is filled with dedicated students from across the country who wish to bring positivity to their communities through therapeutic art
              </Card.Text>
              <Button variant='secondary'>MEET US</Button>
            </Card.Body>
          </Card>

          <Card> 
            <Card.Body>
              <Card.Title>
               OUR BLOG
              </Card.Title>
              <Card.Text>
                Our writing department focuses on blogging updates on the organization and spreading knowledge on various forms of therapy through articles and newsletteres
              </Card.Text>
              <Button variant='secondary'>SEE OUR BLOGS</Button>
            </Card.Body>
          </Card>
      </div>
    </>
  )
}
