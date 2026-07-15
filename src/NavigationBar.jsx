import React from 'react'
import { Nav, Navbar, NavDropdown, Container } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

export default function NavigationBar() {
    const navigate = useNavigate();
  return (
    <Navbar>
        <Container>
            <Navbar.Brand className="link" onClick={()=> navigate('/')}>  <img src="/favicon.ico" alt="Logo" height="40"/></Navbar.Brand>
            <div style={{marginLeft: 'auto', marginRight:'0'}}>
                <Nav className="me-auto">
                    <Nav.Link onClick={()=> navigate('/')}>HOME</Nav.Link>
                    <Nav.Link onClick={()=> navigate('/test')}>TEST</Nav.Link>
                    <Nav.Link onClick={()=> navigate('/test2')}>TEST2</Nav.Link>
                    <Nav.Link onClick={()=> navigate('/region')}>REGION</Nav.Link>
                </Nav>
            </div>
        </Container>
    </Navbar>
  )
}
