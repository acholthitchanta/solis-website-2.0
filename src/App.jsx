import {useEffect, useState} from 'react'
import {supabase} from './lib/supabase'
import { Card, Nav } from 'react-bootstrap';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import NavigationBar from './NavigationBar';
import Region from './Region';
import Test from './Test';
import Home from './Home';

export default function App(){

  return (
    <div>
        <Router>
          <NavigationBar/>
          <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/test" element={<Test/>}/>
            <Route path="/region" element={<Region/>}/>
          </Routes>
        </Router>
    </div>
  )}

