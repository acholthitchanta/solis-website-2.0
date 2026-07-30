import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import {getRegion, getTeams, getEvents,getRDs, getRegionMembers, formatSlugRegion} from "../services/MemberService"

import Landing from './Landing'

export default function Chapter() {
  const {slug} = useParams()

  const [region, setRegion] = useState(null)
  const [regionLoading, setRegionLoading] = useState(true)

  const [teams, setTeams] = useState(null)
  const [teamsLoading, setTeamsLoading] = useState(true)

  const [members, setMembers] = useState(null)
  const [membersLoading, setMembersLoading] = useState(true)

  const [events, setEvents] = useState(null)
  const [eventsLoading, setEventsLoading] = useState(true)

  useEffect(()=>{
    async function fetchRegion(){
      const {data: regionData, error: regionDataError} = await getRegion(slug);

      if (regionDataError){
        console.log(regionDataError)
        setRegionLoading(false)
        return
      }
      setRegion(regionData)
      setRegionLoading(false)
    }
    fetchRegion();

  },[])


  return (
    <div className="section marine" style={{height: '500px'}}>

        {!regionLoading && <div style={{margin: 'auto'}}><h1>{formatSlugRegion(region.name)}
          </h1></div>}

    </div>

  )
}
