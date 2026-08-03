import React, {useRef, useState, useEffect} from 'react'
import { Card, Form, Button, Alert } from 'react-bootstrap'
import { Link, useNavigate} from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';


export default function Login() {
    const emailRef = useRef();
    const passwordRef = useRef();
    const {login, currentUser} = useAuth()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();

    useEffect(()=>{
        if (currentUser){
            navigate('/')
        }
    })
    async function handleSubmit(e){
        e.preventDefault()

            setError('')
            setLoading(true)
            const {data, error} = await login(emailRef.current.value, passwordRef.current.value)
            if (error){
                setError('Failed to log in')
                setLoading(false)
                return
            }

            navigate('/')
            setLoading(false)

    }
  return (
    <div  className="d-flex align-items-center justify-content-center dark-blue px-3" style={{minHeight:"100vh", flexDirection: 'column'}}>
    <Card className="w-100" style={{maxWidth: '400px', flex: 'none'}}>
        <Card.Body >
            <h2 className="text-center mb-4">LOG IN</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
                <Form.Group id="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" ref={emailRef} required />
                </Form.Group>

                <Form.Group id="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" ref={passwordRef} required />
                </Form.Group>

                <Button disabled={loading} className="w-100 mt-3" type="submit">Log In</Button>
            </Form>
        </Card.Body>
    </Card>
    </div>
  )
}
