import { useRef } from 'react'
import Landing from "../components/Landing";
import useReveal from '../hooks/useReveal'
import useScrollY from '../hooks/useScrollY'
import ourstory from "../assets/ourstory.jpg"
import pic1 from "../assets/our-story/pic1.png"
import pic2 from "../assets/our-story/pic2.png"
import pic3 from "../assets/our-story/pic3.png"
import pic4 from "../assets/our-story/pic4.png"
import notesGraphic from "../assets/our-story/graphics/1.png"
import starGraphic from "../assets/our-story/graphics/2.png"
import sunGraphic from "../assets/our-story/graphics/3.png"
import moonGraphic from "../assets/our-story/graphics/4.png"
import starsGraphic from "../assets/our-story/graphics/5.png"

export default function OurStory() {
  const containerRef = useRef(null)
  useReveal(containerRef)
  const scrollY = useScrollY()

  const bigOffset = scrollY * 0.15
  const smallOffset = scrollY * 0.075

  return (
    <div ref={containerRef}>
      <Landing theme='orange' landingImg={ourstory} title={"OUR STORY"} description={"Solis and Luna Arts started in 2021 as a small school club in Bergen County, New Jersey by Chloey Cho."} />

      {/* Section A */}
      <div className="story-row dark-blue">
        <div className="story-row-inner">
          <div className="story-photo-wrap story-photo-bleed-down">
            <img
              src={pic1}
              className="story-photo"
              alt="Chloey Cho playing the violin as a child"
              loading="lazy"
              // style={{ transform: `translateY(${-smallOffset}px)` }}
            />
          </div>
          <div className="story-text reveal">
            <header>
              <h1 className="text-primary"><em>ARIRANG</em></h1>
            </header>
            <p>The story of Solis and Luna Arts begins with the popular Korean folk song &ldquo;Arirang.&rdquo; When founder and CEO Chloey Cho was just eight years old, she discovered that a simple rendition of this song on her quarter-size violin could light up her grandfather's eyes, a Vietnam War veteran.</p>
          </div>
        </div>
      </div>

      {/* Section B */}
      <div className="story-row story-row-media-top-mobile white">
        <img
          src={notesGraphic}
          className="story-graphic story-graphic-notes"
          alt=""
          loading="lazy"
          style={{ transform: `translateY(${smallOffset}px)` }}
        />
        <div className="story-row-inner">
          <div className="story-text reveal">
            <header>
              <h1 className="text-secondary">A FACE FILLED WITH JOY</h1>
            </header>
            <p>Throughout her childhood, Chloey rarely heard her grandfather speak a word. With the language barriers and his struggles with PTSD from his service, the most interaction they'd have was a nod of acknowledgement. When Chloey's mother encouraged her to play a song for her grandfather on the violin, she decided to play “Arirang”. As she performed, she noticed that her grandfather’s eyes started to twinkle and his mouth slowly turned up into a smile: it was the first time she had ever felt the connection she had been longing for.</p>
            <br/>
            <p>With a new light in his eyes, Chloey’s grandfather began telling bedtime stories about his childhood to her and her brother, accounts that brought them immeasurably closer to him. She then realized how powerful music was in connecting people, and that music performance was a two-way street: it's not just about what you want to play, but also about what the audience wants to hear.</p>
          </div>
            <div className="story-spacer"/>
          <div className="story-photo-cluster">
            <div className="story-photo-wrap story-photo-2">
              <img
                src={pic2}
                className="story-photo"
                alt="Chloey Cho as a toddler"
                loading="lazy"
              />
            </div>
            <div className="story-photo-wrap story-photo-3">
              <img
                src={pic3}
                className="story-photo"
                alt="Chloey Cho practicing the violin"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Section C */}
      <div className="story-row light-blue">
        <div className="story-row-inner story-row-inner-wide-gap">
          <div className="story-photo-wrap story-photo-bleed-left">
            <img
              src={pic4}
              className="story-photo story-photo-pic4"
              alt="Chloey Cho performing with the violin"
              loading="lazy"
            />
            <img
              src={starsGraphic}
              className="story-graphic story-graphic-stars"
              alt=""
              loading="lazy"
              style={{ transform: `translateY(${smallOffset}px)` }}
            />
          </div>
          <div className="story-text reveal">
            <header>
              <h1 className="text-primary">A MOVEMENT BEGINS</h1>
            </header>
            <p>Chloey remembered how playing music for her grandfather transformed him from a silent, grave man to a vibrant personality with endless stories to tell. She wondered if she could also help change the lives of more people like him through her art. </p>
            <br/>
            <p>Thus, in 2021 — when she was just 14 years old — she started Solis and Luna Arts as a small club at her school so her peers too could use their passions to create profound connections with those around them. Soon, one club became two, and two became three. Five years later, Solis and Luna Arts has grown to support over 50 chapters across 15 states and 10 chapters!Our members resonate with Chloey, whether it be through similar experiences or personal interest. </p>
          </div>
        </div>
      </div>

      {/* Section D: Our Mission */}
      <div className="story-row dark-blue">
        <div className="story-row-inner story-row-inner-wide-gap">

          <div className="story-text reveal cluster-story-text">

            <header>
              <h1 className="orange-text">OUR MISSION</h1>
            </header>
            <p>Every Solis and Luna Arts member has their unique story, but each has come to the same conclusion as Chloey — that they want to leverage their passion for the arts to heal and connect.</p>
            <br/>
            <p>The unique stories and diverse backgrounds of our thousands of volunteers across the globe come together to meet the shared goal of shedding light on therapeutic creative arts.</p>
          </div>
          <div className="story-mission-cluster">
            <img
              src={starGraphic}
              className="story-mission-graphic story-mission-star"
              alt=""
              loading="lazy"
              style={{ transform: `translateY(${bigOffset}px)` }}
            />
            <img
              src={sunGraphic}
              className="story-mission-graphic story-mission-sun"
              alt=""
              loading="lazy"
              style={{ transform: `translateY(${-bigOffset}px)` }}
            />
            <img
              src={moonGraphic}
              className="story-mission-graphic story-mission-moon"
              alt=""
              loading="lazy"
              style={{ transform: `translateY(${-bigOffset}px)` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
