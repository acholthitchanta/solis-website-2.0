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
                <a className="social-box" target="_blank" rel="noreferrer" href="https://www.tiktok.com/@solisandlunaarts">
                  <svg className="social" viewBox="0 0 24 24" fill="currentColor"><path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07Z" /></svg>
                </a>
              </div>
            </div>
          </div>
          <p id="copyright">© 2026 Solis and Luna Arts</p>
        </div>
      </footer>
  )
}
