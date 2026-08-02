import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import { Card, Nav } from 'react-bootstrap';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import NavigationBar from './components/NavigationBar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import SmoothScroll from './components/SmoothScroll';
import Home from './pages/Home';
import Region from './pages/Region';
import Login from './pages/Login';
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
import Contact from './pages/Contact';
import SupportUs from './pages/SupportUs';
import PageNotFound from './pages/PageNotFound';
import Blog from './components/Blog';
import Chapter from './components/Chapter';
import { AuthProvider } from './context/AuthContext';
import Dashboard from './pages/admin/Dashboard';
import "./styles/custom.scss";


export default function App() {

  return (
    <div>
      <AuthProvider>
        <Router>
          <SmoothScroll />
          <ScrollToTop />
          <NavigationBar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/region" element={<Region />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/blogs/:slug" element={<Blog />} />
            <Route path="/our-story" element={<OurStory />} />
            <Route path="/executive-board" element={<ExecutiveBoard />} />
            <Route path="/team-members" element={<TeamMembers />} />
            <Route path="/chapters" element={<Chapters />} />
            <Route path="/chapter/:slug" element={<Chapter />} />
            <Route path="/lunatunes" element={<LunaTunes />} />
            <Route path="/photo-gallery" element={<PhotoGallery />} />
            <Route path="/press-features" element={<PressFeatures />} />
            <Route path="/podcast" element={<Podcast />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/support-us" element={<SupportUs />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
          <Footer />
        </Router>
      </AuthProvider>
    </div>
  )
}

