import React from 'react'
import { useState } from 'react'
import { Card, Button, Alert } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function Dashboard() {
    const [error, setError] = useState("");
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();

    async function handleLogout() {
        setError('');

        try {
            await logout();
            navigate('/login');
        } catch {
            setError('Failed to log out');
        }
    }
    return (
        <div className="d-flex align-items-center justify-content-center dark-blue px-3" style={{ minHeight: "100vh", flexDirection: 'column'}}>
            <Card className="w-100" style={{ maxWidth: '400px', flex: 'none'}}>
                <Card.Body>
                    <h2 className="text-center mb-4">Profile</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <strong>Email: </strong>{currentUser.email}
                    {/* <Link to="/update-profile" className="btn btn-primary w-100 mt-3">Update Profile</Link> */}
                </Card.Body>


                <div className="w-100 text-center mt-2 mb-3">
                    <Button variant="link" className="dark-blue" onClick={handleLogout}>
                        Log Out
                    </Button>
                </div>
            </Card>
        </div>

    )
}
