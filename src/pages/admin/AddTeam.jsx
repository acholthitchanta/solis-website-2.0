import React, { useRef, useState } from 'react'
import { Card, Form, Button, Alert } from 'react-bootstrap'
import { addTeam } from '../../services/Admin';

export default function AddTeam({ region, onAdded }) {
    const formRef = useRef();
    const disciplineRef = useRef();
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')

    async function handleSubmit(e) {
        e.preventDefault()

        setLoading(true)
        setError('')
        setMessage('')

        try {
            await addTeam({
                region_name: region.name,
                region_id: region.id,
                discipline: disciplineRef.current.value,
            })

            setMessage('Team added!')
            formRef.current.reset()
            onAdded?.()

        }
        catch (err) {
            setError('Failed to add team')
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
                    <Form.Group id="discipline">
                        <Form.Label>Discipline</Form.Label>
                        <Form.Control type="text" ref={disciplineRef} placeholder="e.g. art, music, nail art" required />
                    </Form.Group>

                    {message && <Alert variant="success" className="mt-3 mb-1 text-center">{message}</Alert>}
                    {error && <Alert variant="danger" className="mt-3 mb-1 text-center">{error}</Alert>}
                    <Button disabled={loading} className="w-100 mt-3" type="submit">Add Team</Button>
                </Form>
            </Card.Body>
        </Card>
    )
}
