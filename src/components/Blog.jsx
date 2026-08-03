import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react';
import { Placeholder, Modal } from 'react-bootstrap';
import { getBlog } from '../services/DataService';
import formatDate from '../lib/formatDate';
import ReactMarkdown from 'react-markdown';
import PrivateFeature from './PrivateFeature';
import EditBlog from '../pages/admin/EditBlog';

export default function Blog() {
    const { slug } = useParams()
    const [showAddBlog, setShowAddBlog] = useState(false)
    const navigate = useNavigate()
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchBlog() {
            const { data, error } = await getBlog(slug);

            if (error) {
                console.error(error);
                return;
            }
            setBlog(data)
            setLoading(false);
        }
        fetchBlog();

    }, [slug]);


    return (
        <>
            <Modal show={showAddBlog} onHide={() => setShowAddBlog(false)}>
                <Modal.Header closeButton>
                <Modal.Title>EDIT BLOG</Modal.Title>
                </Modal.Header>

                <Modal.Body className='align-items-center justify-content-center d-flex dark-blue'>
                {blog && <EditBlog blog={blog}/>}
                </Modal.Body>
            </Modal>
            <div className="blog-detail-spacer" />
            <div className="blog-detail-page">
                <div className="blog-detail-header">
                    <button className="blog-back-link" onClick={() => navigate('/blogs')}>
                        <svg className="blog-back-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="19" y1="12" x2="5" y2="12" />
                            <polyline points="12 19 5 12 12 5" />
                        </svg> Back to Blogs
                    </button>
                    <PrivateFeature><div className="show-more-btn" onClick={() => setShowAddBlog(true)}>Edit Blog</div></PrivateFeature>
                </div>

                {loading ? (
                    <div className="blog-detail">
                        <div className="blog-detail-meta">
                            <Placeholder as="span" animation="glow"><Placeholder xs={12} style={{ width: '80px' }} /></Placeholder>
                            <Placeholder as="span" animation="glow"><Placeholder xs={12} style={{ width: '120px' }} /></Placeholder>
                        </div>
                        <Placeholder as="h1" animation="glow"><Placeholder xs={9} /></Placeholder>
                        <Placeholder as="p" animation="glow"><Placeholder xs={4} /></Placeholder>
                        <Placeholder as="p" animation="glow">
                            <Placeholder xs={12} /> <Placeholder xs={12} /> <Placeholder xs={8} />
                        </Placeholder>
                        <Placeholder as="div" animation="glow">
                            <Placeholder xs={12} bg="secondary" className="blog-detail-image" />
                        </Placeholder>
                    </div>
                ) : !blog ? (
                    <p className="blog-not-found">Blog not found.</p>
                ) : (
                    <article className="blog-detail">
                        <div className="blog-detail-meta">
                            <span className={`category-badge category-${blog.category}`}>{blog.category}</span>
                            <span className="blog-detail-date">{formatDate(blog.date)}</span>
                        </div>
                        <h1 className="blog-detail-title">{blog.title}</h1>
                        <p className="blog-detail-author">{blog.author}</p>
                        <p className="blog-detail-description">{blog.description}</p>
                        <img src={blog.image_url} className="blog-detail-image" alt={blog.title} loading="lazy" />
                        <div className="blog-detail-content">
                            <ReactMarkdown>{blog.content}</ReactMarkdown>
                        </div>
                    </article>
                )}
            </div>
        </>
    )
}
