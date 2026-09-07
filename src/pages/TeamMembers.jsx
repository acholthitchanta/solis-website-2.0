
import { useEffect, useState, useRef } from "react"
import { getOrgTeamMembers, getOrgTeams } from "../services/MemberService"
import { addOrgMember,editOrgMember } from "../services/Admin"
import { Card, Placeholder,Modal } from "react-bootstrap"
import useReveal from '../hooks/useReveal'
import useFitTextToLine from '../hooks/useFitTextToLine'
import Landing from "../components/Landing"
import ourteam from '../assets/whoweare.jpg'
import PrivateFeature from "../components/PrivateFeature"
import AddOrgMember from "./admin/AddOrgMember"
import EditOrgMember from "./admin/EditOrgMember"

function PencilIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
    </svg>
  )
}

export default function TeamMembers() {
  const [orgTeams, setOrgTeams] = useState([])
  const [teamMembers, setTeamMembers] = useState([])
  const [membersLoading, setMembersLoading] = useState(true)

  const [loading, setLoading] = useState(true)
  const [loadedHeadshots, setLoadedHeadshots] = useState({})
  const execRef = useRef(null)
  const [addMemberTeam, setAddMemberTeam] = useState(null)
  const [editMemberState, setEditMemberState] = useState(null)
  
  

  useReveal(execRef, teamMembers)
  useFitTextToLine(execRef, '.person .card-title, .card-text', teamMembers)

  useEffect(() => {
    if (!loading) window.scrollTo(0, 0)
    }, [loading])

    async function loadMembers(){

      if (!orgTeams){
        return
      }
      const results = await Promise.all(
        orgTeams.map((team) => getOrgTeamMembers(team.id))
      )
      const allMembers = results.flatMap((result) => result.data || [])
      setTeamMembers(allMembers)
      setMembersLoading(false)

    }

  useEffect(() => {

    async function loadTeams() {
      const { data, error } = await getOrgTeams()

      if (error) {
        console.error(error)
        return
      }
      const priorityOrder = { 'outreach': 0, 'writing': 1, 'research': 2, 'media': 3 }

      const sortedTeams = data.sort((a, b) => {
        const aPriority = priorityOrder[a.name] ?? 99
        const bPriority = priorityOrder[b.name] ?? 99
        return aPriority - bPriority

      })
      setOrgTeams(sortedTeams)
      setLoading(false)


    }

    loadTeams()

  }, [])

  useEffect(()=>{
    loadMembers();
  }, [orgTeams])
  


  return (
    <div ref={execRef} className="light-blue">
      <title>Our Team | Solis and Luna Arts</title>
      <meta property="og:image" content={ourteam} />

      <Landing theme="dark-blue" background="lb" landingImg={ourteam} title={"OUR TEAM"} description={"Meet the team behind Solis and Luna Arts's international operations: writing, outreach, research, tech, and media."}/>
      <div className="section-wide light-blue">
        {(loading || membersLoading) ? (
          <div className="people">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
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

        orgTeams.map((team) =>{
          const teamMembersAll = (teamMembers || [])
          .filter((m) => m.org_team_id === team.id)
          .sort((a, b) => a.name.localeCompare(b.name))
            return(
              <div key={team.id}>
                <div className="chapter-team-header">
                  <h2 style={{ textTransform: 'uppercase', fontWeight: 'bold' }}>{team.name}</h2>
                  <PrivateFeature>
                    <button className="chapter-add-btn" onClick={() => setAddMemberTeam(team)}>Add Member</button>
                  </PrivateFeature>
                </div>   

                <div className="people">
             
                {teamMembersAll.map((exec) => (
                      <Card key={exec.id} className="person reveal" style={{height: '250px'}}>
                        <PrivateFeature>
                          <button className="chapter-edit-icon-btn chapter-edit-icon-btn-person" onClick={() => setEditMemberState(exec)} aria-label="Edit member">
                            <PencilIcon />
                          </button>
                        </PrivateFeature>
                        {!loadedHeadshots[exec.id] && (
                          <Placeholder as="div" animation="glow">
                            <Placeholder xs={12} bg="secondary" className="headshot-placeholder" />
                          </Placeholder>
                        )}
                        <Card.Img
                          src={exec.headshot_url}
                          style={{ display: loadedHeadshots[exec.id] ? 'block' : 'none', aspectRatio: '1', height: 'auto'}}
                          onLoad={() => setLoadedHeadshots((prev) => ({ ...prev, [exec.id]: true }))}
                        />
                        <Card.Body>
                          <Card.Title>{exec.name}</Card.Title>
                          <Card.Text style={{color: '#f5e39b', textTransform: 'uppercase'}}>{exec.role}</Card.Text>
                        </Card.Body>
                      </Card>
                ))}
                </div>
              <Modal show={!!addMemberTeam} onHide={() => setAddMemberTeam(null)} size="lg" scrollable>
                <Modal.Header closeButton>
                  <Modal.Title>ADD MEMBER</Modal.Title>
                </Modal.Header>
                <Modal.Body className="dark-blue" data-lenis-prevent>
                  {addMemberTeam && <AddOrgMember team={addMemberTeam} onAdded={loadMembers} />}
                </Modal.Body>
              </Modal>

              <Modal show={!!editMemberState} onHide={() => setEditMemberState(null)} size="lg" scrollable>
                <Modal.Header closeButton>
                  <Modal.Title>EDIT MEMBER</Modal.Title>
                </Modal.Header>
                <Modal.Body className="dark-blue" data-lenis-prevent>
                  {editMemberState && (
                    <EditOrgMember
                      member={editMemberState}
                      onUpdated={loadMembers}
                      onDeleted={() => { loadMembers(); setEditMemberState(null) }}
                    />
                  )}
                </Modal.Body>
              </Modal>
              </div>)

        }))}

          
      </div>
      <div className="section-medium yellow">
          <h1>WANT TO BE PART OF THE TEAM?</h1>
          <p>If you'd like to join one of Solis and Luna Arts's essential organizational teams, please email us at <a href="mailto:contact@solisandlunaarts.com">contact@solisandlunaarts.com</a>. No experience required. 
             We would love for you to help us continue to grow and reach even more communities!
          </p>
      </div>
    </div>
  )
}
