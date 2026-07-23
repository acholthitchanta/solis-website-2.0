import React from 'react'
import { Figure, Carousel, Card, Button } from 'react-bootstrap'
import { useRef, useEffect, useState } from 'react'
import Counter from './components/Counter'
import landing from './assets/landing.jpg'
import landing1 from './assets/landing1.jpg'
import landing2 from './assets/landing2.jpg'
import landing3 from './assets/landing3.jpg'
import whoweare from './assets/whoweare.jpg'
import ourteam from './assets/ourteam.jpg'
import ourblog from './assets/ourblog.jpg'




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

      <div class="light-blue spacer"/>

    <div class="yellow section">
        <h1>THE ART OF CONNECTION</h1>
        <p> Solis and Luna Arts is a nonprofit 501(c)(3) student-run organization that offers companionship and encouragement to individuals facing physical and mental health troubles. Through musical performances, collaborative art workshops, nail art, and more, we are dedicated to bringing a variety art forms to as many communities as possible!</p>      
        <div className="impact">
          <div className="num">
              <h1><Counter target='50'/>+</h1>
              <h4>Chapters</h4>
          </div>
          <div className="num">
              <h1><Counter target='350'/>+</h1>
              <h4>Events</h4>
          </div>
          <div className="num">
              <h1><Counter target='2000'/>+</h1>
              <h4>Volunteers</h4>
          </div>
          <div className="num">
              <h1><Counter target='10'/>K+</h1>
              <h4>Patients Impacted</h4>
          </div>
        </div>
      </div>
      
      <div class="cards light-blue">
          <Card> 
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

          <Card > 
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

          <Card> 
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
    </>
  )
}
