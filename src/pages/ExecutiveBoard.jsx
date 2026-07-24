import { useEffect, useState } from "react"
import { fetchExecutives } from "../services/MemberService"
import { Card } from "react-bootstrap"

export default function ExecutiveBoard() {
  const [executives, setExecutives] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() =>{
    async function loadExecutives(){
      const {data, error} = await fetchExecutives()

      if (error){
        console.error(error)
        setLoading(false)
        return
      }

      const priorityOrder = {'Chief Executive Director': 0, 'Vice President of Music': 1, 'Vice President of Art': 2, 'Chief of Tech & Impact': 3}

      const sortedExec = data.sort((a ,b) =>{
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
      <div className="section-medium light-blue">
        <div className="mobile-spacer light-blue" />
        <h1>OUR EXECUTIVE BOARD</h1>
        <div className=" people">
          {executives.map((exec) => (
              <Card className="person">
                <div className="position">
                  <span>{exec.position}</span>
                </div>
                <Card.Img src={exec.headshot_url}/>
                <Card.Body>
                  <Card.Title>{exec.full_name}</Card.Title>
                  <Card.Text className="email">
                    <a className="email-icon" href={`mailto:${exec.email}`} aria-label={`Email ${exec.full_name}`}>
                      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M2 4h20a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Zm19 2.35-8.42 6.32a1 1 0 0 1-1.16 0L3 6.35V18h18ZM3.5 5l8.5 6.4L20.5 5Z"/></svg>
                    </a>
                    {exec.email}
                  </Card.Text>
                  <Card.Text>{exec.occupation}</Card.Text>
                </Card.Body>
              </Card>
          ))
          }
        </div>
        <div className="mobile-spacer light-blue" />
      </div>

    </>

  )
}
