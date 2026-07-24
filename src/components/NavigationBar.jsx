import React, { useEffect, useState } from 'react'
import { Nav, Navbar, NavDropdown, Container } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

export default function NavigationBar() {
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 100)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

  return (
    <Navbar className={`navigation-bar ${scrolled ? 'navbar-scrolled' : ''}`} expand="lg" sticky="top">
        <Container fluid>
            <Navbar.Brand className="link" onClick={()=> navigate('/')}>  <img src="/solis.png" alt="Logo" id="navlogo"/></Navbar.Brand>
            <div style={{marginLeft: 'auto', marginRight:'0'}}>
                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav>
                        <Nav.Item>
                            <Nav.Link onClick={()=> navigate('/')}>HOME</Nav.Link>
                        </Nav.Item>
                        <NavDropdown title="ABOUT US" id="about-us-dropdown">
                            <NavDropdown.Item onClick={()=> navigate('/our-story')}>Our Story</NavDropdown.Item>
                            <NavDropdown.Item onClick={()=> navigate('/executive-board')}>Executive Board</NavDropdown.Item>
                            <NavDropdown.Item onClick={()=> navigate('/team-members')}>Team Members</NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown title="OUR WORK" id="our-work-dropdown">
                            <NavDropdown.Item onClick={()=> navigate('/chapters')}>Chapters</NavDropdown.Item>
                            <NavDropdown.Item onClick={()=> navigate('/lunatunes')}>LunaTunes</NavDropdown.Item>
                            <NavDropdown.Item onClick={()=> navigate('/photo-gallery')}>Photo Gallery</NavDropdown.Item>
                            <NavDropdown.Item onClick={()=> navigate('/press-features')}>Press Features</NavDropdown.Item>
                        </NavDropdown>
                        <Nav.Item>
                            <Nav.Link onClick={()=> navigate('/blogs')}>BLOG</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link onClick={()=> navigate('/podcast')}>PODCAST</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link className="donate" onClick={()=> navigate('/donate')}>DONATE</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link className="contact" onClick={()=> navigate('/contact')}>CONTACT</Nav.Link>
                        </Nav.Item>
                    </Nav>
                </Navbar.Collapse>
            </div>

        </Container>
    </Navbar>
  )
}
