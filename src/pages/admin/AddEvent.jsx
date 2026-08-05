import React, { useRef, useState } from 'react'
import { Card, Form, Button, Alert } from 'react-bootstrap'
import { addEvent, uploadEventImage } from '../../services/Admin';

export default function AddEvent({ region, onAdded }) {
    const formRef = useRef();
    const titleRef = useRef();
    const dateRef = useRef();
    const contentRef = useRef();
    const imageRef = useRef();
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')

    async function handleSubmit(e) {
        e.preventDefault()

        setLoading(true)
        setError('')
        setMessage('')

        try {
            const file = imageRef.current.files[0]

            let imageURL = ''
            if (file) imageURL = await uploadEventImage(file)

            await addEvent({
                region_id: region.id,
                date: dateRef.current.value,
                title: titleRef.current.value,
                content: contentRef.current.value,
                imageURL,
            })

            setMessage('Event added!')
            formRef.current.reset()
            onAdded?.()

        }
        catch (err) {
            setError('Failed to add event')
            console.error(err)
        }
        finally {
            setLoading(false)
        }

    }
    return (
        <Card className="align-items-center justify-content-center d-flex dark-blue w-100">
            <Card.Body className="w-100">
                <Form onSubmit={handleSubmit} ref={formRef} className="w-100">
                    <Form.Group id="title">
                        <Form.Label>Title</Form.Label>
                        <Form.Control type="text" ref={titleRef} required />
                    </Form.Group>

                    <Form.Group id="date">
                        <Form.Label>Date</Form.Label>
                        <Form.Control type="date" ref={dateRef} required />
                    </Form.Group>

                    <Form.Group id="content">
                        <Form.Label>Description</Form.Label>
                        <Form.Control as="textarea" rows={8} ref={contentRef} required />
                    </Form.Group>

                    <Form.Group id="image">
                        <Form.Label>Image</Form.Label>
                        <Form.Control type="file" ref={imageRef} />
                    </Form.Group>

                    {message && <Alert variant="success" className="mt-3 mb-1 text-center">{message}</Alert>}
                    {error && <Alert variant="danger" className="mt-3 mb-1 text-center">{error}</Alert>}
                    <Button disabled={loading} className="w-100 mt-3" type="submit">Add Event</Button>
                </Form>
            </Card.Body>
        </Card>
    )
}
