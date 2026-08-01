import React from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { Card, Spinner } from "react-bootstrap";
import { getRegion, getTeams, getEvents, getRDs, getRegionMembers, formatSlugRegion, formatSlugLabel } from "../services/MemberService"
import Landing from './Landing'
import RegionLanding from './RegionLanding';
import useShrinkTextToFit from '../hooks/useShrinkTextToFit'

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

export default function Chapter() {
  const { slug } = useParams()

  const [region, setRegion] = useState(null)
  const [regionLoading, setRegionLoading] = useState(true)

  const [directors, setDirectors] = useState(null)
  const [directorsLoading, setDirectorsLoading] = useState(null)

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

  const [showAllEvents, setShowAllEvents] = useState(false)
  const eventsGridRef = useRef(null)

  const placeholder_url = 'https://uvwpttufrutumpzkysvo.supabase.co/storage/v1/object/public/regions/placeholder_2560x1400.png'

  useEffect(() => {
    async function fetchRegion() {
      const { data: regionData, error: regionDataError } = await getRegion(slug);

      if (regionDataError) {
        console.error(regionDataError)
        setRegionLoading(false)
        return
      }
      console.log(regionData)
      setRegion(regionData)
      setRegionLoading(false)
    }

    fetchRegion();

  }, [])

  useEffect(() => {
    async function fetchEvents() {
      if (!region) return
      const { data: eventsData, error: eventsDataError } = await getEvents(region.id);

      if (eventsDataError) {
        console.error(eventsDataError)
        setEventsLoading(false)
        return
      }
      console.log(eventsData)
      setEvents(eventsData)
      setEventsLoading(false)
    }

    fetchEvents();

  }, [region])

  useEffect(() => {
    async function fetchTeams() {
      if (!region) return
      const { data: teamsData, error: teamsDataError } = await getTeams(region.id);

      if (teamsDataError) {
        console.log(teamsDataError)
        setTeamsLoading(false)
        return
      }
      console.log(teamsData)
      setTeams(teamsData)
      setTeamsLoading(false)
    }
    fetchTeams();
  }, [region])


  useEffect(() => {
    async function fetchDirectors() {
      if (!teams) return

      const results = await Promise.all(
        teams.map((team) => getRDs(team.id))
      )

      const allDirectors = results.flatMap((result) => result.data || [])
      console.log(allDirectors)
      setDirectors(allDirectors)
      setDirectorsLoading(false)
    }
    fetchDirectors();

  }, [teams])

  useEffect(() => {
    async function fetchMembers() {
      if (!teams) return


      const results = await Promise.all(
        teams.map((team) => getRegionMembers(team.id))
      )

      const allMembers = results.flatMap((result) => result.data || [])
      console.log(allMembers)
      setMembers(allMembers)
      setMembersLoading(false)
    }
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
  }, [teams, directors, members])

  useShrinkTextToFit(eventsGridRef, '.chapter-event-card-body p:not(.chapter-event-card-date)', [events, showAllEvents])

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
  const peopleLoading = directors === null || members === null

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
        <RegionLanding theme="dark-blue" background="lb" landingImg={region.image_url || placeholder_url} title={formatSlugRegion(region.name)} description={""} />
      )}

      <div className="section-wide light-blue">
        <div className="chapter-teams-row">
          <div className="chapter-teams-col">
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
                const teamDirectors = (directors || [])
                  .filter((d) => d.team_id === team.id)
                  .sort((a, b) => a.full_name.localeCompare(b.full_name))
                const teamMembers = (members || [])
                  .filter((m) => m.team_id === team.id)
                  .sort((a, b) => a.name.localeCompare(b.name))
                return (
                  <div key={team.id} className="chapter-team">
                    <h2 style={{ textTransform: 'uppercase' }}>{formatSlugLabel(team.discipline)} Team</h2>
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
                              <Card.Img src={director.headshot_url} />
                              <Card.Body>
                                <Card.Title>{director.full_name}</Card.Title>
                                <Card.Text>Regional Director</Card.Text>
                              </Card.Body>
                            </Card>
                          ))}
                          {teamMembers.map((member) => (
                            <Card className="chapter-person" key={member.id}>
                              <Card.Img src={member.headshot_url} />
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
        <h1>OUR EVENTS</h1>
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
    </div>
  )
}
