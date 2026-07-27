import React from 'react'
import { Card, Placeholder } from 'react-bootstrap'
import { supabase } from '../lib/supabase';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBlogs } from '../services/DataService';
import formatDate from '../lib/formatDate';

const CATEGORIES = ['music', 'art', 'psychology', 'culture', 'interviews', 'news']
const PAGE_SIZE = 12

export default function Blogs() {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    async function fetchBlogs() {
      const { data, error } = await getBlogs();

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

  useEffect(() => {
    setVisibleCount(PAGE_SIZE)
  }, [search, activeCategory, sortOrder])

  const filteredBlogs = blogs
    .filter((blog) => activeCategory === 'all' || blog.category === activeCategory)
    .filter((blog) => blog.description?.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const diff = new Date(a.date) - new Date(b.date)
      return sortOrder === 'oldest' ? diff : -diff
    })

  const visibleBlogs = filteredBlogs.slice(0, visibleCount)

  return (
    <div>
      <div className="mobile-spacer light-blue"/>
      <div className="section-medium light-blue">
        <h1>OUR BLOG</h1>
        <p>Updates on the organization and knowledge on various forms of therapy, straight from our writing team.</p>
      </div>

      <div className="blog-controls">
        <div className="blog-controls-top">
          <div className="blog-categories">
            <button
              className={`category-filter-btn${activeCategory === 'all' ? ' active' : ''}`}
              onClick={() => setActiveCategory('all')}
            >
              All
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`category-filter-btn${activeCategory === cat ? ' active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
          <div className="blog-search-wrap">
            <input
              className="blog-search"
              type="text"
              placeholder="Search blogs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <svg className="blog-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
        </div>

        <div className="blog-sort">
          <span>Sort by date:</span>
          <button
            className={`sort-btn${sortOrder === 'oldest' ? ' active' : ''}`}
            onClick={() => setSortOrder('oldest')}
          >
            &uarr; Oldest
          </button>
          <button
            className={`sort-btn${sortOrder === 'newest' ? ' active' : ''}`}
            onClick={() => setSortOrder('newest')}
          >
            &darr; Newest
          </button>
        </div>
      </div>

      {loading ? (
        <div className="blog-grid">
          {Array.from({ length: PAGE_SIZE }, (_, i) => i).map((n) => (
            <Card className="blog-card" key={n}>
              <Placeholder as="div" animation="glow">
                <Placeholder xs={12} bg="secondary" className="blog-card-image" />
              </Placeholder>
              <div className="blog-card-body">
                <Placeholder as="p" animation="glow"><Placeholder xs={4} /></Placeholder>
                <Placeholder as="h2" animation="glow"><Placeholder xs={8} /></Placeholder>
                <Placeholder as="p" animation="glow">
                  <Placeholder xs={12} /> <Placeholder xs={10} />
                </Placeholder>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <>
          <div className="blog-grid">
            {visibleBlogs.map((blog) => (
              <Card className="blog-card" key={blog.id} onClick={()=> (navigate(`/blogs/${blog.slug}`))}>
                <img src={blog.image_url} className="blog-card-image" alt={blog.title} />
                <div className="blog-card-body">
                  <div className="blog-card-meta">
                    <span className={`category-badge category-${blog.category}`}>{blog.category}</span>
                    <span className="blog-card-date">{formatDate(blog.date)}</span>
                  </div>
                  <h2 className="blog-card-title">{blog.title}</h2>
                  <p className="blog-card-description">{blog.description}</p>
                </div>
              </Card>
            ))}
          </div>

          {visibleBlogs.length === 0 && (
            <p className="blog-no-results">No blogs match your search.</p>
          )}

          {visibleCount < filteredBlogs.length && (
            <div className="load-more-wrap">
              <button className="load-more-btn" onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}>
                Load More
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
