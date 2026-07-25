import React, { useEffect, useState } from 'react'
import { Nav, Navbar, NavDropdown, Container } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

export default function NavigationBar() {
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false)
    const [expanded, setExpanded] = useState(false)

    function handleNavigate(path){
        navigate(path)
        setExpanded(false)
    }
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 100)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])



  return (
    <Navbar expanded={expanded} onToggle={setExpanded} className={`navigation-bar ${scrolled ? 'navbar-scrolled' : ''}`} expand="lg" sticky="top">
        <Container fluid>
            <Navbar.Brand className="link" onClick={()=> handleNavigate('/')}>  <img src="/solis.png" alt="Logo" id="navlogo"/></Navbar.Brand>
            <div style={{marginLeft: 'auto', marginRight:'0'}}>
                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav>
                        <Nav.Item>
                            <Nav.Link onClick={()=> handleNavigate('/')}>HOME</Nav.Link>
                        </Nav.Item>
                        <NavDropdown title="ABOUT US" id="about-us-dropdown">
                            <NavDropdown.Item onClick={()=> handleNavigate('/our-story')}>Our Story</NavDropdown.Item>
                            <NavDropdown.Item onClick={()=> handleNavigate('/executive-board')}>Executive Board</NavDropdown.Item>
                            <NavDropdown.Item onClick={()=> handleNavigate('/team-members')}>Team Members</NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown title="OUR WORK" id="our-work-dropdown">
                            <NavDropdown.Item onClick={()=> handleNavigate('/chapters')}>Chapters</NavDropdown.Item>
                            <NavDropdown.Item onClick={()=> handleNavigate('/lunatunes')}>LunaTunes</NavDropdown.Item>
                            <NavDropdown.Item onClick={()=> handleNavigate('/photo-gallery')}>Photo Gallery</NavDropdown.Item>
                            <NavDropdown.Item onClick={()=> handleNavigate('/press-features')}>Press Features</NavDropdown.Item>
                        </NavDropdown>
                        <Nav.Item>
                            <Nav.Link onClick={()=> handleNavigate('/blogs')}>BLOG</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link onClick={()=> handleNavigate('/podcast')}>PODCAST</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link className="donate" onClick={()=> handleNavigate('/donate')}>DONATE</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link className="contact" onClick={()=> handleNavigate('/contact')}>CONTACT</Nav.Link>
                        </Nav.Item>
                    </Nav>
                </Navbar.Collapse>
            </div>

        </Container>
    </Navbar>
  )
}
