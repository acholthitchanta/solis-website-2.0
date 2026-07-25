import React from 'react'

export default function Team({people}) {
  return (
        <div className="people">
          {people.map((person) => (
              <Card className="person">
                <div className="position">
                  <span>{person.role}</span>
                </div>
                <Card.Img src={person.headshot_url}/>
                <Card.Body>
                  <Card.Title>{person.full_name}</Card.Title>
                </Card.Body>
              </Card>
          ))
          }
        </div>
  )
}
