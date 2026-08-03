import React, { useRef, useState, useEffect } from 'react'
import { Card, Form, Button, Alert } from 'react-bootstrap'
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { addBlog, uploadBlogImage } from '../../services/Admin';



export default function AddBlog() {
    const formRef = useRef();
    const titleRef = useRef();
    const categoryRef = useRef();
    const dateRef = useRef();
    const imageRef = useRef();
    const authorRef = useRef();
    const descriptionRef = useRef();
    const contentRef = useRef();
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault()

        setLoading(true)
        setError("")
        setMessage('')


        try {
            const file = imageRef.current.files[0]

            let imageURL = ""

            if (file) {
                imageURL = await uploadBlogImage(file)
            }

            await addBlog({
                title: titleRef.current.value,
                author: authorRef.current.value,
                category: categoryRef.current.value,
                date: dateRef.current.value,
                description: descriptionRef.current.value,
                imageURL: imageURL,
                content: contentRef.current.value
            })

            setMessage('Blog added!')
            formRef.current.reset()

        }
        catch (err) {
            setError("Failed to add business")
            console.error(err)
        }
        finally {
            setLoading(false)
        }

    }
    return (
        <Card className="align-items-center justify-content-center d-flex dark-blue">
            <Card.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                {message && <Alert variant="success">{message}</Alert>}
                <Form onSubmit={handleSubmit} ref={formRef}>
                    <Form.Group id="name">
                        <Form.Label>Title</Form.Label>
                        <Form.Control type="text" ref={titleRef} required />
                    </Form.Group>

                    <Form.Group id="author">
                        <Form.Label>Author</Form.Label>
                        <Form.Control type="text" ref={authorRef} required />
                    </Form.Group>

                    <Form.Group id="content">
                        <Form.Label>Content</Form.Label>
                        <Form.Control as="textarea" rows={8} ref={contentRef} required />
                    </Form.Group>
                    <Form.Group id="description">
                        <Form.Label>Description</Form.Label>
                        <Form.Control type="text" ref={descriptionRef} required />
                    </Form.Group>

                    <Form.Group id="category">
                        <Form.Label>Category</Form.Label>
                        <Form.Select type="text" ref={categoryRef} required >
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
                        <Form.Control type="file" ref={imageRef} required />
                    </Form.Group>

                    <Form.Group id="date">
                        <Form.Label>Date</Form.Label>
                        <Form.Control type="date" ref={dateRef} required />
                    </Form.Group>

                    <Button disabled={loading} className="w-100  mt-3" type="submit">Add Blog</Button>
                </Form>
            </Card.Body>
        </Card>
    )
}






