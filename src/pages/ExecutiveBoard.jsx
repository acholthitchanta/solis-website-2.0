import { useEffect, useState, useRef } from "react"
import { fetchExecutives } from "../services/MemberService"
import { Card, Placeholder } from "react-bootstrap"
import useReveal from '../hooks/useReveal'


export default function ExecutiveBoard() {
  const [executives, setExecutives] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadedHeadshots, setLoadedHeadshots] = useState({})
  const execRef = useRef(null)
  useReveal(execRef, executives)

  useEffect(() => {
    async function loadExecutives() {
      const { data, error } = await fetchExecutives()

      if (error) {
        console.error(error)
        setLoading(false)
        return
      }

      const priorityOrder = { 'Chief Executive Director': 0, 'Vice President of Music': 1, 'Vice President of Art': 2, 'Chief of Tech & Impact': 3 }

      const sortedExec = data.sort((a, b) => {
        const aPriority = priorityOrder[a.position] ?? 99
        const bPriority = priorityOrder[b.position] ?? 99
        return aPriority - bPriority

      })

      setExecutives(sortedExec)
      setLoading(false)
    }

    loadExecutives()

  }, [])



  return (
    <>
      <div ref={execRef} className="section-medium light-blue">
        <div className="mobile-spacer light-blue" />
        <div class="header">
          <h1 className="reveal">OUR EXECUTIVE BOARD</h1>
          <h3 className="reveal landing-description">Solis and Luna Arts is entirely student-led: our executive team is made up of high school and college students from across the country who plan, organize, and oversee every Solis chapter, event, and program.</h3>
        </div>
        {(loading) ? (
          <div className="people">
            {[1, 2, 3, 4].map((n) => (
              <Card className="person" key={n}>
                <div className="position">
                  <Placeholder as="span" animation="glow"><Placeholder xs={6} /></Placeholder>
                </div>
                <Placeholder as="div" animation="glow">
                  <Placeholder xs={12} bg="secondary" className="headshot-placeholder" />
                </Placeholder>
                <Card.Body>
                  <Placeholder as={Card.Title} animation="glow"><Placeholder xs={8} /></Placeholder>
                  <Placeholder as={Card.Text} animation="glow" className="email"><Placeholder xs={7} /></Placeholder>
                  <Placeholder as={Card.Text} animation="glow"><Placeholder xs={5} /></Placeholder>
                </Card.Body>
              </Card>
            ))}
          </div>
        ) : (
          <div className=" people">
            {executives.map((exec) => (
              <Card className="person reveal" key={exec.id}>
                <div className="position">
                  <span>{exec.position}</span>
                </div>
                {!loadedHeadshots[exec.id] && (
                  <Placeholder as="div" animation="glow">
                    <Placeholder xs={12} bg="secondary" className="headshot-placeholder" />
                  </Placeholder>
                )}
                <Card.Img
                  src={exec.headshot_url}
                  style={{ display: loadedHeadshots[exec.id] ? 'block' : 'none' }}
                  onLoad={() => setLoadedHeadshots((prev) => ({ ...prev, [exec.id]: true }))}
                />
                <Card.Body>
                  <Card.Title>{exec.full_name}</Card.Title>
                  <Card.Text className="email">
                    <a className="email-icon" href={`mailto:${exec.email}`} aria-label={`Email ${exec.full_name}`}>
                      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M2 4h20a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Zm19 2.35-8.42 6.32a1 1 0 0 1-1.16 0L3 6.35V18h18ZM3.5 5l8.5 6.4L20.5 5Z" /></svg>
                    </a>
                    {exec.email}
                  </Card.Text>
                  <Card.Text>{exec.occupation}</Card.Text>
                </Card.Body>
              </Card>
            ))
            }
          </div>
        )}
        <div className="mobile-spacer light-blue" />
      </div>

    </>

  )
}
