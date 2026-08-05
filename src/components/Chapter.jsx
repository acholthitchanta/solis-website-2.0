import React from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { Card, Spinner, Modal } from "react-bootstrap";
import { getRegion, getTeams, getEvents, getRegionMembers, formatSlugRegion, formatSlugLabel } from "../services/MemberService"
import Landing from './Landing'
import RegionLanding from './RegionLanding';
import useShrinkTextToFit from '../hooks/useShrinkTextToFit'
import { Navigate } from 'react-router-dom';
import PrivateFeature from './PrivateFeature';
import AddTeam from '../pages/admin/AddTeam';
import AddMember from '../pages/admin/AddMember';
import AddEvent from '../pages/admin/AddEvent';
import EditMember from '../pages/admin/EditMember';
import EditEvent from '../pages/admin/EditEvent';
import EditRegionImage from '../pages/admin/EditRegionImage';

function formatEventDate(dateString) {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).toUpperCase()
}

function splitEventContent(content) {
  const [title, ...rest] = (content || '').split(':')
  return { title: title.trim(), description: rest.join(':').trim() }
}

function PencilIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
    </svg>
  )
}

export default function Chapter() {
  const navigate = useNavigate()
  const { slug } = useParams()

  const [region, setRegion] = useState(null)
  const [regionLoading, setRegionLoading] = useState(true)

  const [teams, setTeams] = useState(null)
  const [teamsLoading, setTeamsLoading] = useState(true)

  const [members, setMembers] = useState(null)
  const [membersLoading, setMembersLoading] = useState(true)

  const [events, setEvents] = useState(null)
  const [eventsLoading, setEventsLoading] = useState(true)

  const [expandedTeams, setExpandedTeams] = useState({})
  const [overflowingTeams, setOverflowingTeams] = useState({})
  const [rowHeights, setRowHeights] = useState({})
  const peopleRefs = useRef({})
  const teamsColRef = useRef(null)

  const [showAllEvents, setShowAllEvents] = useState(false)
  const eventsGridRef = useRef(null)

  const [showAddTeam, setShowAddTeam] = useState(false)
  const [addMemberTeam, setAddMemberTeam] = useState(null)
  const [showAddEvent, setShowAddEvent] = useState(false)
  const [editMemberState, setEditMemberState] = useState(null)
  const [editEventState, setEditEventState] = useState(null)
  const [showEditRegionImage, setShowEditRegionImage] = useState(false)

  const placeholder_url = 'https://uvwpttufrutumpzkysvo.supabase.co/storage/v1/object/public/regions/placeholder_2560x1400.png'
  const member_placeholder_url = 'https://uvwpttufrutumpzkysvo.supabase.co/storage/v1/object/public/members/solis.jpeg'

  async function fetchRegion() {
    const { data: regionData, error: regionDataError } = await getRegion(slug);

    if (regionDataError) {
      console.error(regionDataError)
      setRegionLoading(false)
      return
    }
    setRegion(regionData)
    setRegionLoading(false)
  }

  useEffect(() => {
    fetchRegion();
  }, [])

  async function refreshRegion() {
    const { data: regionData, error: regionDataError } = await getRegion(slug);
    if (regionDataError) {
      console.error(regionDataError)
      return
    }
    setRegion(regionData)
  }

  async function fetchEvents() {
    if (!region) return
    const { data: eventsData, error: eventsDataError } = await getEvents(region.id);

    if (eventsDataError) {
      console.error(eventsDataError)
      setEventsLoading(false)
      return
    }
    setEvents(eventsData)
    setEventsLoading(false)
  }

  useEffect(() => {
    fetchEvents();
  }, [region])

  async function fetchTeams() {
    if (!region) return
    const { data: teamsData, error: teamsDataError } = await getTeams(region.id);

    if (teamsDataError) {
      console.log(teamsDataError)
      setTeamsLoading(false)
      return
    }
    setTeams(teamsData)
    setTeamsLoading(false)
  }

  useEffect(() => {
    fetchTeams();
  }, [region])

  async function fetchMembers() {
    if (!teams) return

    const results = await Promise.all(
      teams.map((team) => getRegionMembers(team.id))
    )

    const allMembers = results.flatMap((result) => result.data || [])
    setMembers(allMembers)
    setMembersLoading(false)
  }

  useEffect(() => {
    fetchMembers();
  }, [teams])

  useEffect(() => {
    if (!teams) return

    const nextOverflowing = {}
    const nextRowHeights = {}
    teams.forEach((team) => {
      const el = peopleRefs.current[team.id]
      if (el && el.firstElementChild) {
        // measure the actual rendered row height (cards stretch to match
        // the tallest sibling in their row, so any card reflects it) instead
        // of assuming a fixed card height, since long names/roles can wrap
        // to a second line and grow a row taller than expected
        const rowHeight = el.firstElementChild.getBoundingClientRect().height
        nextRowHeights[team.id] = rowHeight
        // small buffer to absorb sub-pixel rounding, so an exact single row
        // never falsely counts as overflowing
        nextOverflowing[team.id] = el.scrollHeight > rowHeight + 10
      }
    })
    setOverflowingTeams(nextOverflowing)
    setRowHeights(nextRowHeights)
  }, [teams, members])

  useShrinkTextToFit(eventsGridRef, '.chapter-event-card-body p:not(.chapter-event-card-date)', [events, showAllEvents])
  useShrinkTextToFit(teamsColRef, '.chapter-person .card-title', [members])

  if (!regionLoading && !region) {
    return (
      <div className="spinner-container dark-blue">
        <p>Region not found.</p>
      </div>
    )
  }

  const latestEvents = events
    ? [...events]
      .sort((a, b) => new Date(b.event_date) - new Date(a.event_date))
    : []

  const teamsListLoading = teams === null
  const peopleLoading = members === null
  const regionImageIsPlaceholder = !region || !region.image_url || region.image_url === placeholder_url

  return (
    <div>
      {regionLoading ? (
        <div className="chapter-landing-skeleton">
          <div className="chapter-landing-skeleton-text">
            <div className="chapter-skeleton chapter-skeleton-title" />
            <div className="chapter-skeleton chapter-skeleton-line" />
          </div>
          <div className="chapter-skeleton chapter-landing-skeleton-image" />
        </div>
      ) : (
        <>
          <div className="chapter-landing-wrap">
            <button className="chapter-back-link" onClick={() => navigate('/chapters')}>
                <svg className="blog-back-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12" />
                    <polyline points="12 19 5 12 12 5" />
                </svg> Back to Chapters
            </button>

            <RegionLanding
              theme="dark-blue"
              background="lb"
              landingImg={region.image_url || placeholder_url}
              title={formatSlugRegion(region.name)}
              description={""}
              imageOverlay={
                <PrivateFeature>
                  <button className="chapter-edit-icon-btn chapter-edit-icon-btn-region" onClick={() => setShowEditRegionImage(true)} aria-label="Edit region image">
                    <PencilIcon />
                  </button>
                </PrivateFeature>
              }
            />
          </div>

        </>
      )}

      <div className="section-wide light-blue">
        <div className="chapter-teams-row">
          <div className="chapter-teams-col" ref={teamsColRef}>
            <div className="chapter-teams-header">
              <PrivateFeature>
                <button className="chapter-add-btn" onClick={() => setShowAddTeam(true)}>Add Team</button>
              </PrivateFeature>
            </div>
            {teamsListLoading ? (
              [0, 1].map((i) => (
                <div key={i} className="chapter-team">
                  <div className="chapter-skeleton chapter-team-title-skeleton" />
                  <div className="chapter-people">
                    {[0, 1, 2, 3].map((j) => (
                      <div key={j} className="chapter-person-skeleton">
                        <div className="chapter-skeleton chapter-person-skeleton-img" />
                        <div className="chapter-skeleton chapter-skeleton-line" />
                        <div className="chapter-skeleton chapter-skeleton-line short" />
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : teams.length === 0 ? (
              <p>No teams yet.</p>
            ) : (
              teams.map((team) => {
                const teamMembersAll = (members || [])
                  .filter((m) => m.team_id === team.id)
                const teamDirectors = teamMembersAll
                  .filter((m) => m.role === 'rd')
                  .sort((a, b) => a.name.localeCompare(b.name))
                const teamMembers = teamMembersAll
                  .filter((m) => m.role !== 'rd')
                  .sort((a, b) => a.name.localeCompare(b.name))
                return (
                  <div key={team.id} className="chapter-team">
                    <div className="chapter-team-header">
                      <h2 style={{ textTransform: 'uppercase' }}>{formatSlugLabel(team.discipline)} Team</h2>
                      <PrivateFeature>
                        <button className="chapter-add-btn" onClick={() => setAddMemberTeam(team)}>Add Member</button>
                      </PrivateFeature>
                    </div>
                    <div
                      className={`chapter-people${expandedTeams[team.id] ? ' expanded' : ''}`}
                      ref={(el) => { peopleRefs.current[team.id] = el }}
                      style={!expandedTeams[team.id] && rowHeights[team.id] ? { maxHeight: rowHeights[team.id] } : undefined}
                    >
                      {peopleLoading ? (
                        [0, 1, 2, 3].map((j) => (
                          <div key={j} className="chapter-person-skeleton">
                            <div className="chapter-skeleton chapter-person-skeleton-img" />
                            <div className="chapter-skeleton chapter-skeleton-line" />
                            <div className="chapter-skeleton chapter-skeleton-line short" />
                          </div>
                        ))
                      ) : teamDirectors.length === 0 && teamMembers.length === 0 ? (
                        <p>No members yet.</p>
                      ) : (
                        <>
                          {teamDirectors.map((director) => (
                            <Card className="chapter-person" key={director.id}>
                              <PrivateFeature>
                                <button className="chapter-edit-icon-btn chapter-edit-icon-btn-person" onClick={() => setEditMemberState(director)} aria-label="Edit member">
                                  <PencilIcon />
                                </button>
                              </PrivateFeature>
                              <Card.Img src={director.headshot_url || member_placeholder_url} />
                              <Card.Body>
                                <Card.Title>{director.name}</Card.Title>
                                <Card.Text>Regional Director</Card.Text>
                              </Card.Body>
                            </Card>
                          ))}
                          {teamMembers.map((member) => (
                            <Card className="chapter-person" key={member.id}>
                              <PrivateFeature>
                                <button className="chapter-edit-icon-btn chapter-edit-icon-btn-person" onClick={() => setEditMemberState(member)} aria-label="Edit member">
                                  <PencilIcon />
                                </button>
                              </PrivateFeature>
                              <Card.Img src={member.headshot_url || member_placeholder_url} />
                              <Card.Body>
                                <Card.Title>{member.name}</Card.Title>
                                <Card.Text style={{ textTransform: 'capitalize' }}>{member.role}</Card.Text>
                              </Card.Body>
                            </Card>
                          ))}
                        </>
                      )}
                    </div>
                    {overflowingTeams[team.id] && !expandedTeams[team.id] && (
                      <div
                        className="chapter-load-more-btn"
                        onClick={() => setExpandedTeams((prev) => ({ ...prev, [team.id]: true }))}
                      >
                        SEE ALL MEMBERS
                      </div>
                    )}
                    {overflowingTeams[team.id] && expandedTeams[team.id] && (
                      <div
                        className="chapter-load-more-btn"
                        onClick={() => setExpandedTeams((prev) => ({ ...prev, [team.id]: false }))}
                      >
                        HIDE MEMBERS
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </div>

          {eventsLoading ? (
            <div className="chapter-events-sidebar">
              <h4 className="text-primary">OUR LATEST EVENTS</h4>
              {[0, 1, 2].map((i) => (
                <div key={i} className="chapter-events-sidebar-item-skeleton">
                  <div className="chapter-events-sidebar-text-skeleton">
                    <div className="chapter-skeleton chapter-skeleton-line" />
                    <div className="chapter-skeleton chapter-skeleton-line short" />
                  </div>
                  <div className="chapter-skeleton chapter-events-sidebar-img-skeleton" />
                </div>
              ))}
            </div>
          ) : latestEvents.length > 0 ? (
            <div className="chapter-events-sidebar">
              <h4 className="text-primary">OUR LATEST EVENTS</h4>
              {latestEvents.slice(0, 3).map((event) => {
                const { title } = splitEventContent(event.content)
                return (
                  <Link key={event.id} to={`#event-${event.id}`} className="chapter-events-sidebar-item">
                    <div className="chapter-events-sidebar-text">
                      <h5>{title}</h5>
                      <span className="chapter-events-sidebar-date">{formatEventDate(event.event_date)}</span>
                    </div>
                    {event.image_url && <img src={event.image_url} alt="" />}
                  </Link>
                )
              })}
            </div>
          ) : (
            <div className="chapter-events-sidebar">
              <h4 className="text-primary">OUR LATEST EVENTS</h4>
              <p>No events yet.</p>
            </div>
          )}
        </div>
      </div>

      <div className="section-wide yellow chapter-events-section">
        <div className="chapter-events-header">
          <h1>OUR EVENTS</h1>
          <PrivateFeature>
            <button className="chapter-add-btn" onClick={() => setShowAddEvent(true)}>Add Event</button>
          </PrivateFeature>
        </div>
        {eventsLoading ? (
          <div className="chapter-events-grid">
            {[0, 1, 2].map((i) => (
              <div key={i} className="chapter-event-card chapter-event-card-skeleton">
                <div className="chapter-skeleton dark chapter-event-skeleton-image" />
                <div className="chapter-event-card-body">
                  <div className="chapter-skeleton dark chapter-skeleton-line" />
                  <div className="chapter-skeleton dark chapter-skeleton-line short" />
                  <div className="chapter-skeleton dark chapter-skeleton-paragraph" />
                </div>
              </div>
            ))}
          </div>
        ) : events && events.length > 0 ? (
          <>
          <div className="chapter-events-grid" ref={eventsGridRef}>
            {(showAllEvents ? latestEvents : latestEvents.slice(0, 6)).map((event) => {
              const { title, description } = splitEventContent(event.content)
              return (
                <div
                  key={event.id}
                  id={`event-${event.id}`}
                  className="chapter-event-card"
                >
                  <PrivateFeature>
                    <button className="chapter-edit-icon-btn chapter-edit-icon-btn-event" onClick={() => setEditEventState(event)} aria-label="Edit event">
                      <PencilIcon />
                    </button>
                  </PrivateFeature>
                  {event.image_url && <img src={event.image_url} alt="" />}
                  <div className="chapter-event-card-body">
                    <h3>{title}</h3>
                    <p className="chapter-event-card-date">{formatEventDate(event.event_date)}</p>
                    <p>{description}</p>
                  </div>
                </div>
              )
            })}
          </div>
          {events.length > 6 && !showAllEvents && (
            <div style={{alignSelf: 'center'}} className="dark-blue show-more-btn" onClick={() => setShowAllEvents(true)}>
              SEE MORE EVENTS
            </div>
          )}
          </>
        ) : (
          <p>No events yet.</p>
        )}
      </div>

      <Modal show={showAddTeam} onHide={() => setShowAddTeam(false)} size="lg" scrollable>
        <Modal.Header closeButton>
          <Modal.Title>ADD TEAM</Modal.Title>
        </Modal.Header>
        <Modal.Body className="dark-blue" data-lenis-prevent>
          {region && <AddTeam region={region} onAdded={fetchTeams} />}
        </Modal.Body>
      </Modal>

      <Modal show={!!addMemberTeam} onHide={() => setAddMemberTeam(null)} size="lg" scrollable>
        <Modal.Header closeButton>
          <Modal.Title>ADD MEMBER</Modal.Title>
        </Modal.Header>
        <Modal.Body className="dark-blue" data-lenis-prevent>
          {addMemberTeam && <AddMember team={addMemberTeam} onAdded={fetchMembers} />}
        </Modal.Body>
      </Modal>

      <Modal show={showAddEvent} onHide={() => setShowAddEvent(false)} size="lg" scrollable>
        <Modal.Header closeButton>
          <Modal.Title>ADD EVENT</Modal.Title>
        </Modal.Header>
        <Modal.Body className="dark-blue" data-lenis-prevent>
          {region && <AddEvent region={region} onAdded={fetchEvents} />}
        </Modal.Body>
      </Modal>

      <Modal show={!!editMemberState} onHide={() => setEditMemberState(null)} size="lg" scrollable>
        <Modal.Header closeButton>
          <Modal.Title>EDIT MEMBER</Modal.Title>
        </Modal.Header>
        <Modal.Body className="dark-blue" data-lenis-prevent>
          {editMemberState && (
            <EditMember
              member={editMemberState}
              onUpdated={fetchMembers}
              onDeleted={() => { fetchMembers(); setEditMemberState(null) }}
            />
          )}
        </Modal.Body>
      </Modal>

      <Modal show={!!editEventState} onHide={() => setEditEventState(null)} size="lg" scrollable>
        <Modal.Header closeButton>
          <Modal.Title>EDIT EVENT</Modal.Title>
        </Modal.Header>
        <Modal.Body className="dark-blue" data-lenis-prevent>
          {editEventState && (
            <EditEvent
              event={editEventState}
              onUpdated={fetchEvents}
              onDeleted={() => { fetchEvents(); setEditEventState(null) }}
            />
          )}
        </Modal.Body>
      </Modal>

      <Modal show={showEditRegionImage} onHide={() => setShowEditRegionImage(false)} size="lg" scrollable>
        <Modal.Header closeButton>
          <Modal.Title>EDIT REGION IMAGE</Modal.Title>
        </Modal.Header>
        <Modal.Body className="dark-blue" data-lenis-prevent>
          {region && (
            <EditRegionImage
              region={region}
              isPlaceholder={regionImageIsPlaceholder}
              onUpdated={refreshRegion}
            />
          )}
        </Modal.Body>
      </Modal>
    </div>
  )
}
