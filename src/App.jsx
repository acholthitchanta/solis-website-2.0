import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import { Card, Nav } from 'react-bootstrap';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import NavigationBar from './components/NavigationBar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Region from './pages/Region';

import AboutUs from './pages/AboutUs';
import Blogs from './pages/Blogs';
import OurStory from './pages/OurStory';
import ExecutiveBoard from './pages/ExecutiveBoard';
import TeamMembers from './pages/TeamMembers';
import Chapters from './pages/Chapters';
import LunaTunes from './pages/LunaTunes';
import PhotoGallery from './pages/PhotoGallery';
import PressFeatures from './pages/PressFeatures';
import Podcast from './pages/Podcast';
import Donate from './pages/Donate';
import Contact from './pages/Contact';
import "./styles/custom.scss";

export default function App() {

  return (
    <div>
      <Router>
        <NavigationBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/region" element={<Region />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/our-story" element={<OurStory />} />
          <Route path="/executive-board" element={<ExecutiveBoard />} />
          <Route path="/team-members" element={<TeamMembers />} />
          <Route path="/chapters" element={<Chapters />} />
          <Route path="/lunatunes" element={<LunaTunes />} />
          <Route path="/photo-gallery" element={<PhotoGallery />} />
          <Route path="/press-features" element={<PressFeatures />} />
          <Route path="/podcast" element={<Podcast />} />
          <Route path="/donate" element={<Donate />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  )
}

