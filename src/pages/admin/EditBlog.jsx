import React, { useRef, useState } from 'react'
import { Card, Form, Button, Alert } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';
import { editBlog, deleteBlog, uploadBlogImage } from '../../services/Admin';
import { supabase } from '../../lib/supabase';


export default function EditBlog({ blog }) {
    const formRef = useRef();
    const categoryRef = useRef();
    const imageRef = useRef();
    const authorRef = useRef();
    const descriptionRef = useRef();
    const contentRef = useRef();
    const navigate = useNavigate();
    const [deleting, setDeleting] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')

    async function handleSubmit(e) {
        e.preventDefault()

        setLoading(true)
        setError("")
        setMessage('')


        try {
            const payload = {
                author: authorRef.current.value,
                category: categoryRef.current.value,
                description: descriptionRef.current.value,
                content: contentRef.current.value,
            }

            const file = imageRef.current.files[0]
            if (file) payload.imageURL = await uploadBlogImage(file)

            await editBlog(blog.id, payload)

            setMessage('Blog updated!')
        }
        catch (err) {
            setError("Failed to update blog")
            console.error(err)
        }
        finally {
            setLoading(false)
        }

    }

    async function handleDelete() {
        const confirmed = window.confirm(`Delete "${blog.title}"? This cannot be undone.`)
        if (!confirmed) return

        setDeleting(true)
        setError('')

        try {
            await deleteBlog(blog.id)
            navigate('/blogs')
        }
        catch (err) {
            setError("Failed to delete blog")
            console.error(err)
            setDeleting(false)
        }
    }
    return (
        <Card className="align-items-center justify-content-center d-flex dark-blue w-100">
            <Card.Body className="w-100">
                <Card.Title>{blog.title}</Card.Title>
                <Form onSubmit={handleSubmit} ref={formRef} className="w-100">
                    <Form.Group id="author">
                        <Form.Label>Author</Form.Label>
                        <Form.Control type="text" ref={authorRef} defaultValue={blog.author} />
                    </Form.Group>

                    <Form.Group id="content">
                        <Form.Label>Content</Form.Label>
                        <Form.Control as="textarea" rows={8} ref={contentRef} defaultValue={blog.content} data-lenis-prevent />
                    </Form.Group>
                    <Form.Group id="description">
                        <Form.Label>Description</Form.Label>
                        <Form.Control type="text" ref={descriptionRef} defaultValue={blog.description} />
                    </Form.Group>

                    <Form.Group id="category">
                        <Form.Label>Category</Form.Label>
                        <Form.Select type="text" ref={categoryRef} defaultValue={blog.category}>
                            <option value="">Select a category</option>
                            <option value="music">Music</option>
                            <option value="art">Art</option>
                            <option value="culture">Culture</option>
                            <option value="psychology">Psychology</option>
                            <option value="interviews">Interviews</option>
                            <option value="news">News</option>
                        </Form.Select>
                    </Form.Group>


                    <Form.Group id="logo">
                        <Form.Label>Image</Form.Label>
                        <Form.Control type="file" ref={imageRef} />
                    </Form.Group>

                    {message && <Alert variant="success" className="mt-3 mb-1 text-center">{message}</Alert>}
                    {error && <Alert variant="danger" className="mt-3 mb-1 text-center">{error}</Alert>}
                    <div className="d-grid gap-2 d-md-flex mt-3">
                        <Button disabled={loading} className="flex-fill" type="submit">Edit Blog</Button>
                        <Button disabled={deleting} variant="danger" className="flex-fill" type="button" onClick={handleDelete}>Delete Blog</Button>
                    </div>
                </Form>
            </Card.Body>
        </Card>
    )
}
