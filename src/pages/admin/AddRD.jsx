import React, { useRef, useState } from 'react'
import { Card, Form, Button, Alert } from 'react-bootstrap'
import { addRD, uploadRDHeadshot } from '../../services/Admin';

export default function AddRD({ team, onAdded }) {
    const formRef = useRef();
    const nameRef = useRef();
    const emailRef = useRef();
    const headshotRef = useRef();
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')

    async function handleSubmit(e) {
        e.preventDefault()

        setLoading(true)
        setError('')
        setMessage('')

        try {
            const file = headshotRef.current.files[0]

            let headshotURL = ''
            if (file) headshotURL = await uploadRDHeadshot(file)

            await addRD({
                team_id: team.id,
                name: nameRef.current.value,
                email: emailRef.current.value,
                headshotURL,
            })

            setMessage('Regional Director added! They will be able to log in once the pending_rds script has been run.')
            formRef.current.reset()
            onAdded?.()

        }
        catch (err) {
            setError('Failed to add regional director')
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
                    <Form.Group id="name">
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" ref={nameRef} required />
                    </Form.Group>

                    <Form.Group id="email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" ref={emailRef} required />
                    </Form.Group>

                    <Form.Group id="headshot">
                        <Form.Label>Headshot</Form.Label>
                        <Form.Control type="file" ref={headshotRef} />
                    </Form.Group>

                    {message && <Alert variant="success" className="mt-3 mb-1 text-center">{message}</Alert>}
                    {error && <Alert variant="danger" className="mt-3 mb-1 text-center">{error}</Alert>}
                    <Button disabled={loading} className="w-100 mt-3" type="submit">Add Regional Director</Button>
                </Form>
            </Card.Body>
        </Card>
    )
}
