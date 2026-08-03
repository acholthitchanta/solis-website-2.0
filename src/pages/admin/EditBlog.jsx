import React, { useRef, useState } from 'react'
import { Card, Form, Button, Alert } from 'react-bootstrap'
import { editBlog, uploadBlogImage } from '../../services/Admin';



export default function EditBlog({ blog }) {
    const formRef = useRef();
    const categoryRef = useRef();
    const imageRef = useRef();
    const authorRef = useRef();
    const descriptionRef = useRef();
    const contentRef = useRef();
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
    return (
        <Card className="align-items-center justify-content-center d-flex dark-blue">
            <Card.Body>
                <Card.Title>{blog.title}</Card.Title>
                {error && <Alert variant="danger">{error}</Alert>}
                {message && <Alert variant="success">{message}</Alert>}
                <Form onSubmit={handleSubmit} ref={formRef}>
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

                    <Button disabled={loading} className="w-100  mt-3" type="submit">Edit Blog</Button>
                </Form>
            </Card.Body>
        </Card>
    )
}
