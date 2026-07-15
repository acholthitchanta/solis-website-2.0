import {useEffect, useState} from 'react'
import {supabase} from './lib/supabase'
import { Card, Nav } from 'react-bootstrap';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import NavigationBar from './NavigationBar';
import Home from './Home';
import Region from './Region';

import Test from './Test';
import Test2 from './Test2';
import Test3 from './Test3';

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
            <Route path="/test3" element={<Test3/>}/>
          </Routes>
        </Router>
    </div>
  )}

