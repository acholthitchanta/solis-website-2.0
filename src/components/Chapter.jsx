import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getRegion, getTeams, getEvents, getRDs, getRegionMembers, formatSlugRegion } from "../services/MemberService"

import Landing from './Landing'

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
      if(!region) return
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

  return (

    //landing page, 
    <div className="section marine" style={{ height: '500px' }}>
      {!regionLoading && <div style={{ margin: 'auto' }}><h1>{formatSlugRegion(region.name)}
      </h1></div>}

    </div>

  )
}
