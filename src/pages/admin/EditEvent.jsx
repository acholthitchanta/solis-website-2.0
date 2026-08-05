import React, { useRef, useState } from 'react'
import { Card, Form, Button, Alert } from 'react-bootstrap'
import { editEvent, deleteEvent, uploadEventImage } from '../../services/Admin';

function splitEventContent(content) {
    const [title, ...rest] = (content || '').split(':')
    return { title: title.trim(), description: rest.join(':').trim() }
}

export default function EditEvent({ event, onUpdated, onDeleted }) {
    const formRef = useRef();
    const titleRef = useRef();
    const dateRef = useRef();
    const contentRef = useRef();
    const imageRef = useRef();
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const [message, setMessage] = useState('')

    const { title: existingTitle, description: existingDescription } = splitEventContent(event.content)

    async function handleSubmit(e) {
        e.preventDefault()

        setLoading(true)
        setError('')
        setMessage('')

        try {
            const payload = {
                title: titleRef.current.value,
                date: dateRef.current.value,
                content: contentRef.current.value,
            }

            const file = imageRef.current.files[0]
            if (file) payload.imageURL = await uploadEventImage(file)

            await editEvent(event.id, payload)

            setMessage('Event updated!')
            onUpdated?.()

        }
        catch (err) {
            setError('Failed to update event')
            console.error(err)
        }
        finally {
            setLoading(false)
        }

    }

    async function handleDelete() {
        const confirmed = window.confirm('Delete this event? This cannot be undone.')
        if (!confirmed) return

        setDeleting(true)
        setError('')

        try {
            await deleteEvent(event.id)
            onDeleted?.()
        }
        catch (err) {
            setError('Failed to delete event')
            console.error(err)
            setDeleting(false)
        }
    }

    return (
        <Card className="align-items-center justify-content-center d-flex dark-blue w-100">
            <Card.Body className="w-100">
                <Form onSubmit={handleSubmit} ref={formRef} className="w-100">
                    <Form.Group id="title">
                        <Form.Label>Title</Form.Label>
                        <Form.Control type="text" ref={titleRef} defaultValue={existingTitle} required />
                    </Form.Group>

                    <Form.Group id="date">
                        <Form.Label>Date</Form.Label>
                        <Form.Control type="date" ref={dateRef} defaultValue={event.event_date} required />
                    </Form.Group>

                    <Form.Group id="content">
                        <Form.Label>Description</Form.Label>
                        <Form.Control as="textarea" rows={8} ref={contentRef} defaultValue={existingDescription} required />
                    </Form.Group>

                    <Form.Group id="image">
                        <Form.Label>Image</Form.Label>
                        <Form.Control type="file" ref={imageRef} />
                    </Form.Group>

                    {message && <Alert variant="success" className="mt-3 mb-1 text-center">{message}</Alert>}
                    {error && <Alert variant="danger" className="mt-3 mb-1 text-center">{error}</Alert>}
                    <div className="d-grid gap-2 d-md-flex mt-3">
                        <Button disabled={loading} className="flex-fill" type="submit">Save Changes</Button>
                        <Button disabled={deleting} variant="danger" className="flex-fill" type="button" onClick={handleDelete}>Delete Event</Button>
                    </div>
                </Form>
            </Card.Body>
        </Card>
    )
}
