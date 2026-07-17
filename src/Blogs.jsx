import React from 'react'
import { Card } from 'react-bootstrap'
import { supabase } from './lib/supabase';
import { useState, useEffect } from 'react';

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(()=>{
    async function fetchBlogs(){
      const {data, error} = await supabase
      .from('blogs')
      .select('*')
      .order('date', {ascending: false});
      if (error) {
        console.error(error);
        setLoading(false)
        return
      }
  

    setBlogs(data);
    setLoading(false);
    }

    fetchBlogs()
  }, [])

  if (loading) return <p>Loading...</p>
  return (
    <div style={{display: 'flex', flexDirection:'column', gap:'1rem'}}>
      <h1>Blogs</h1>
      {blogs.map((blog)=>(
        <Card style={{width: '80%', margin:'auto', padding:'2rem'}}>
          <div key={blog.id} style={{marginBottom: '1rem'}}>
            <h2>{blog.title}</h2>
            <h3>{blog.date}</h3>
            <p>{blog.description}</p>
            <img src={blog.image_url} style={{width: '90%'}}/>
          </div>
        </Card>
      ))}
    </div>
  )
}
