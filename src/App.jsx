import {useEffect, useState} from 'react'
import {supabase} from './lib/supabase'
import { Card, Nav } from 'react-bootstrap';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import NavigationBar from './components/NavigationBar';
import Home from './Home';
import Region from './Region';

import AboutUs from './AboutUs';
import Test2 from './Test2';
import Blogs from './Blogs';
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
          </Routes>
        </Router>
    </div>
  )}

