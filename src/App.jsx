import {useEffect, useState} from 'react'
import {supabase} from './lib/supabase'
import { Card, Nav } from 'react-bootstrap';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import NavigationBar from './NavigationBar';
import Region from './Region';
import Test from './Test';
import Home from './Home';
import Test2 from './Test2';

export default function App(){

  return (
    <div>
        <Router>
          <NavigationBar/>
          <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/test" element={<Test/>}/>
            <Route path="/region" element={<Region/>}/>
            <Route path="/test2" element={<Test2/>}/>
          </Routes>
        </Router>
    </div>
  )}

