import React, { useRef, useState } from 'react'
import { Card, Form, Button, Alert } from 'react-bootstrap'
import { addOrgMember, uploadMemberHeadshot } from '../../services/Admin';

export default function AddOrgMember({ team, onAdded }) {
    const formRef = useRef();
    const nameRef = useRef();
    const roleRef = useRef();
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
            if (file) headshotURL = await uploadMemberHeadshot(file)

            await addOrgMember({
                org_team_id: team.id,
                name: nameRef.current.value,
                role: roleRef.current.value,
                headshotURL,
            })

            setMessage('Member added!')
            formRef.current.reset()
            onAdded?.()

        }
        catch (err) {
            setError('Failed to add member')
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
                        <Form.Label>Name (required)</Form.Label>
                        <Form.Control type="text" ref={nameRef} required />
                    </Form.Group>

                    <Form.Group id="role">
                        <Form.Label>Role</Form.Label>
                        <Form.Control type="text" ref={roleRef}/>
                    </Form.Group>

                    <Form.Group id="headshot">
                        <Form.Label>Headshot (required) </Form.Label>
                        <Form.Control type="file" required ref={headshotRef} />
                    </Form.Group>

                    {message && <Alert variant="success" className="mt-3 mb-1 text-center">{message}</Alert>}
                    {error && <Alert variant="danger" className="mt-3 mb-1 text-center">{error}</Alert>}
                    <Button disabled={loading} className="w-100 mt-3" type="submit">Add Member</Button>
                </Form>
            </Card.Body>
        </Card>
    )
}
