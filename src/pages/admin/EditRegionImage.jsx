import React, { useRef, useState } from 'react'
import { Card, Form, Button, Alert } from 'react-bootstrap'
import { uploadRegionImage, updateRegionImage, deleteRegionImage } from '../../services/Admin';

export default function EditRegionImage({ region, isPlaceholder, onUpdated }) {
    const formRef = useRef();
    const imageRef = useRef();
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')

    async function handleSubmit(e) {
        e.preventDefault()

        const file = imageRef.current.files[0]
        if (!file) {
            setError('Please choose an image')
            return
        }

        setLoading(true)
        setError('')
        setMessage('')

        try {
            const imageURL = await uploadRegionImage(file)

            if (!isPlaceholder && region.image_url) {
                await deleteRegionImage(region.image_url)
            }

            await updateRegionImage(region.id, imageURL)

            setMessage('Region image updated!')
            formRef.current.reset()
            onUpdated?.()

        }
        catch (err) {
            setError('Failed to update region image')
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
                    <Form.Group id="image">
                        <Form.Label>New Region Image</Form.Label>
                        <Form.Control type="file" ref={imageRef} required />
                    </Form.Group>

                    {message && <Alert variant="success" className="mt-3 mb-1 text-center">{message}</Alert>}
                    {error && <Alert variant="danger" className="mt-3 mb-1 text-center">{error}</Alert>}
                    <Button disabled={loading} className="w-100 mt-3" type="submit">Upload New Image</Button>
                </Form>
            </Card.Body>
        </Card>
    )
}
