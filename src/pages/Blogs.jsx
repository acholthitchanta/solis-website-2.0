import React from 'react'
import { Card, Placeholder } from 'react-bootstrap'
import { supabase } from '../lib/supabase';
import { useState, useEffect } from 'react';

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    async function fetchBlogs() {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .order('date', { ascending: false });
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

  return (
    <div>
      <div className="mobile-spacer light-blue"/>
      <div className="section-medium light-blue">
        <h1>OUR BLOG</h1>
        <p>Updates on the organization and knowledge on various forms of therapy, straight from our writing team.</p>
      </div>
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[1, 2, 3].map((n) => (
            <Card key={n} style={{ width: '80%', margin: 'auto', padding: '2rem' }}>
              <div style={{ marginBottom: '1rem' }}>
                <Placeholder as="h2" animation="glow"><Placeholder xs={5} /></Placeholder>
                <Placeholder as="h3" animation="glow"><Placeholder xs={3} /></Placeholder>
                <Placeholder as="p" animation="glow">
                  <Placeholder xs={12} /> <Placeholder xs={10} /> <Placeholder xs={7} />
                </Placeholder>
                <Placeholder as="div" animation="glow">
                  <Placeholder xs={12} bg="secondary" style={{ height: '250px', width: '90%' }} />
                </Placeholder>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {blogs.map((blog) => (
            <Card style={{ width: '80%', margin: 'auto', padding: '2rem' }}>
              <div key={blog.id} style={{ marginBottom: '1rem' }}>
                <h2>{blog.title}</h2>
                <h3>{blog.date}</h3>
                <p>{blog.description}</p>
                <img src={blog.image_url} style={{ width: '90%' }} />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
