import React, { useRef, useState } from 'react'
import { Card, Form, Button, Alert } from 'react-bootstrap'
import { editMember, deleteMember, uploadMemberHeadshot } from '../../services/Admin';

export default function EditMember({ member, onUpdated, onDeleted }) {
    const formRef = useRef();
    const nameRef = useRef();
    const roleRef = useRef();
    const headshotRef = useRef();
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const [message, setMessage] = useState('')

    async function handleSubmit(e) {
        e.preventDefault()

        setLoading(true)
        setError('')
        setMessage('')

        try {
            const payload = {
                name: nameRef.current.value,
                role: roleRef.current.value,
            }

            const file = headshotRef.current.files[0]
            if (file) payload.headshotURL = await uploadMemberHeadshot(file)

            await editMember(member.id, payload)

            setMessage('Member updated!')
            onUpdated?.()

        }
        catch (err) {
            setError('Failed to update member')
            console.error(err)
        }
        finally {
            setLoading(false)
        }

    }

    async function handleDelete() {
        const confirmed = window.confirm(`Remove "${member.name}"? This cannot be undone.`)
        if (!confirmed) return

        setDeleting(true)
        setError('')

        try {
            await deleteMember(member.id)
            onDeleted?.()
        }
        catch (err) {
            setError('Failed to delete member')
            console.error(err)
            setDeleting(false)
        }
    }

    return (
        <Card className="align-items-center justify-content-center d-flex dark-blue w-100">
            <Card.Body className="w-100">
                <Form onSubmit={handleSubmit} ref={formRef} className="w-100">
                    <Form.Group id="name">
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" ref={nameRef} defaultValue={member.name} required />
                    </Form.Group>

                    <Form.Group id="role">
                        <Form.Label>Role</Form.Label>
                        <Form.Select ref={roleRef} defaultValue={member.role} required>
                            <option value="member">Member</option>
                            <option value="rd">Regional Director</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group id="headshot">
                        <Form.Label>Headshot</Form.Label>
                        <Form.Control type="file" ref={headshotRef} />
                    </Form.Group>

                    {message && <Alert variant="success" className="mt-3 mb-1 text-center">{message}</Alert>}
                    {error && <Alert variant="danger" className="mt-3 mb-1 text-center">{error}</Alert>}
                    <div className="d-grid gap-2 d-md-flex mt-3">
                        <Button disabled={loading} className="flex-fill" type="submit">Save Changes</Button>
                        <Button disabled={deleting} variant="danger" className="flex-fill" type="button" onClick={handleDelete}>Delete Member</Button>
                    </div>
                </Form>
            </Card.Body>
        </Card>
    )
}
