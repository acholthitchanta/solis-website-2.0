import React from 'react'
import { Nav, Navbar, NavDropdown, Container } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

export default function NavigationBar() {
    const navigate = useNavigate();

    let toggled = false
    let nav = document.querySelector('nav')

  return (
    <Navbar  expand="lg" sticky="top">
        <Container>
            <Navbar.Brand className="link" onClick={()=> navigate('/')}>  <img src="/favicon.ico" alt="Logo" height="40"/></Navbar.Brand>
            <div style={{marginLeft: 'auto', marginRight:'0'}}>
                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav>
                        <Nav.Item>
                            <Nav.Link onClick={()=> navigate('/')}>HOME</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link onClick={()=> navigate('/about-us')}>ABOUT US</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link onClick={()=> navigate('/test2')}>TEST2</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link onClick={()=> navigate('/blogs')}>BLOGS</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link onClick={()=> navigate('/region')}>REGION</Nav.Link>
                        </Nav.Item>
                    </Nav>
                </Navbar.Collapse>
            </div>

        </Container>
    </Navbar>
  )
}
