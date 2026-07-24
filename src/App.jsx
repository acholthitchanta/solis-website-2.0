import {useEffect, useState} from 'react'
import {supabase} from './lib/supabase'
import { Card, Nav } from 'react-bootstrap';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import NavigationBar from './components/NavigationBar';
import Footer from './components/Footer';
import Home from './Home';
import Region from './Region';

import AboutUs from './AboutUs';
import Test2 from './Test2';
import Blogs from './Blogs';
import OurStory from './OurStory';
import ExecutiveBoard from './ExecutiveBoard';
import TeamMembers from './TeamMembers';
import Chapters from './Chapters';
import LunaTunes from './LunaTunes';
import PhotoGallery from './PhotoGallery';
import PressFeatures from './PressFeatures';
import Podcast from './Podcast';
import Donate from './Donate';
import Contact from './Contact';
import Videos from './Videos';
import "./styles/custom.scss";

export default function App(){

  return (
    <div>
        <Router>
          <NavigationBar/>
          <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/about-us" element={<AboutUs/>}/>
            <Route path="/region" element={<Region/>}/>
            <Route path="/test2" element={<Test2/>}/>
            <Route path="/blogs" element={<Blogs/>}/>
            <Route path="/our-story" element={<OurStory/>}/>
            <Route path="/executive-board" element={<ExecutiveBoard/>}/>
            <Route path="/team-members" element={<TeamMembers/>}/>
            <Route path="/chapters" element={<Chapters/>}/>
            <Route path="/lunatunes" element={<LunaTunes/>}/>
            <Route path="/photo-gallery" element={<PhotoGallery/>}/>
            <Route path="/press-features" element={<PressFeatures/>}/>
            <Route path="/podcast" element={<Podcast/>}/>
            <Route path="/donate" element={<Donate/>}/>
            <Route path="/contact" element={<Contact/>}/>
            <Route path="/videos" element={<Videos/>}/>
          </Routes>
          <Footer/>
        </Router>
    </div>
  )}

