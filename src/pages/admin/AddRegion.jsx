import React, { useRef, useState } from 'react'
import { Card, Form, Button, Alert } from 'react-bootstrap'
import { addRegion, uploadRegionImage } from '../../services/Admin';
import { countryOptions, usStateOptions, slugifyCountryName } from '../../services/MemberService';
import { useNavigate } from 'react-router-dom';


export default function AddRegion({ onAdded }) {
    const formRef = useRef();
    const stateRef = useRef();
    const countyRef = useRef();
    const imageRef = useRef();
    const [country, setCountry] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const navigate = useNavigate()

    const isUSA = country === 'United States of America'

    async function handleSubmit(e) {
        e.preventDefault()

        setLoading(true)
        setError('')
        setMessage('')
        

        try {
            const file = imageRef.current.files[0]

            let imageURL = ''
            if (file) imageURL = await uploadRegionImage(file)

            const countrySlug = slugifyCountryName(country)
            const stateSlug = isUSA && stateRef.current.value ? slugifyCountryName(stateRef.current.value) : null
            const countySlug = slugifyCountryName(countyRef.current.value)

            await addRegion({
                country: countrySlug,
                state: stateSlug,
                county: countySlug,
                imageURL,
            })

            setMessage('Region added!')
            formRef.current.reset()
            setCountry('')
            onAdded?.()

            const fullSlug = stateSlug ? `${countrySlug}:${stateSlug}:${countySlug}` : `${countrySlug}:${countySlug}`
            navigate(`/chapter/${fullSlug}`)

        }
        catch (err) {
            setError('Failed to add region')
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
                    <Form.Group id="country">
                        <Form.Label>Country</Form.Label>
                        <Form.Select value={country} onChange={(e) => setCountry(e.target.value)} required>
                            <option value="">Select a country</option>
                            {countryOptions.map((name) => (
                                <option key={name} value={name}>{name}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    {isUSA && (
                        <Form.Group id="state">
                            <Form.Label>State</Form.Label>
                            <Form.Select ref={stateRef} defaultValue="">
                                <option value="">None</option>
                                {usStateOptions.map((name) => (
                                    <option key={name} value={name}>{name}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    )}

                    <Form.Group id="county">
                        <Form.Label>County / City</Form.Label>
                        <Form.Control type="text" ref={countyRef} required />
                    </Form.Group>

                    <Form.Group id="logo">
                        <Form.Label>Image</Form.Label>
                        <Form.Control type="file" ref={imageRef} />
                    </Form.Group>

                    {message && <Alert variant="success" className="mt-3 mb-1 text-center">{message}</Alert>}
                    {error && <Alert variant="danger" className="mt-3 mb-1 text-center">{error}</Alert>}
                    <Button disabled={loading} className="w-100 mt-3" type="submit">Add Region</Button>
                </Form>
            </Card.Body>
        </Card>
    )
}
