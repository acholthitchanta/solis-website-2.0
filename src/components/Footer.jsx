import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Footer() {
  const navigate = useNavigate()

  return (
      <footer className="footer marine">
        <div className="footer-content">
          <div className="footer-columns">
            <div className="footer-links-group">
              <div className="links">
                <h2>CONTACT US</h2>
                <p>Los Angeles, California</p>
                <p><a href="tel:+2019130331">+1 (201) 913-0331</a></p>
                <p><a target="_blank" rel="noreferrer" href="mailto:solisandlunaarts@gmail.com">solisandlunaarts@gmail.com</a></p>
              </div>

              <div className="links">
                <h2>OUR WORK</h2>
                <div className="pages">
                  <p><a onClick={() => navigate('/chapters')}>Chapters</a></p>
                  <p><a onClick={() => navigate('/lunatunes')}>LunaTunes</a></p>
                  <p><a onClick={() => navigate('/press-features')}>Press Features</a></p>
                </div>
              </div>

              <div className="links">
                <h2>LEARN MORE</h2>
                <div className="pages">
                  <p><a onClick={() => navigate('/our-story')}>Our Story</a></p>
                  <p><a onClick={() => navigate('/executive-board')}>Executive Board</a></p>
                  <p><a onClick={() => navigate('/team-members')}>Team Members</a></p>
                </div>
              </div>

              <div className="links">
                <h2>MEDIA</h2>
                <div className="pages">
                  <p><a onClick={() => navigate('/podcast')}>Podcast</a></p>
                  <p><a onClick={() => navigate('/blogs')}>Blog</a></p>
                  <p><a onClick={() => navigate('/videos')}>Photo Gallery</a></p>
                </div>
              </div>
            </div>

            <div className="footer-logo-col">
              <img id="footer-logo" src="/solis.png" alt="Solis and Luna Arts logo" height="200" />
              <div className="social-media">
                <a className="social-box" target="_blank" rel="noreferrer" href="https://www.instagram.com/solisandlunaarts/">
                  <svg className="social" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.2c3.2 0 3.6 0 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.25.07 1.62.07 4.81s-.01 3.56-.07 4.81c-.15 3.23-1.66 4.77-4.92 4.92-1.25.06-1.62.07-4.85.07-3.2 0-3.6 0-4.85-.07-3.26-.15-4.77-1.7-4.92-4.92-.06-1.25-.07-1.62-.07-4.81s.01-3.56.07-4.81c.15-3.23 1.66-4.77 4.92-4.92 1.25-.06 1.62-.07 4.85-.07M12 0C8.74 0 8.33.01 7.05.07c-4.35.2-6.78 2.62-6.98 6.98C.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.2 4.36 2.62 6.78 6.98 6.98C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c4.35-.2 6.79-2.62 6.98-6.98.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.19-4.35-2.62-6.78-6.98-6.98C15.67.01 15.26 0 12 0Zm0 5.84A6.16 6.16 0 1 0 18.16 12 6.16 6.16 0 0 0 12 5.84Zm0 10.16A4 4 0 1 1 16 12a4 4 0 0 1-4 4Zm6.41-10.4a1.44 1.44 0 1 1-1.44-1.44 1.44 1.44 0 0 1 1.44 1.44Z" /></svg>
                </a>
                <a className="social-box" target="_blank" rel="noreferrer" href="https://www.linkedin.com/company/solisandlunaarts">
                  <svg className="social" viewBox="0 0 24 24" fill="currentColor"><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.03-1.85-3.03-1.85 0-2.14 1.44-2.14 2.94v5.66H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.35-1.85 3.58 0 4.24 2.36 4.24 5.43ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56Z" /></svg>
                </a>
                <a className="social-box" target="_blank" rel="noreferrer" href="https://www.youtube.com/@SolisandLunaArts">
                  <svg className="social" viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.38.55A3.02 3.02 0 0 0 .5 6.19 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.81 3.02 3.02 0 0 0 2.12 2.14C4.5 20.5 12 20.5 12 20.5s7.5 0 9.38-.55a3.02 3.02 0 0 0 2.12-2.14A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.81ZM9.6 15.6V8.4L15.8 12Z" /></svg>
                </a>
              </div>
            </div>
          </div>
          <p id="copyright">© 2026 Solis and Luna Arts</p>
        </div>
      </footer>
  )
}
