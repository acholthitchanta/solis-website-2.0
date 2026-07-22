import {useEffect, useState} from 'react'
import {supabase} from './lib/supabase'
import { Card } from 'react-bootstrap';

export default function AboutUs(){
  const [region, setRegion] = useState(null);
  const [team, setTeam] = useState(null);
  const [members, setMembers] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=> {
    async function fetchBergenMusic(){
      const {data: regionData, error: regionError} = await supabase
        .from('regions')
        .select('*')
        .eq('name', 'new-jersey:bergen-county')
        .single();

      if (regionError){
        console.error(regionError);
        setLoading(false);
        return;
      }
      setRegion(regionData);

      const {data: teamData, error: teamError} = await supabase
        .from('teams')
        .select('*')
        .eq('region_id', regionData.id)
        .eq('discipline', 'music')
        .single();

      if (teamError){
        console.error(teamError);
        setLoading(false);
        return;
      }
      setTeam(teamData);

      const {data: membersData, error: membersError} = await supabase
        .from('team_members')
        .select('*')
        .eq('team_id', teamData.id);

      if (membersError) console.error(membersError);
      setMembers(membersData || []);

      const {data: eventsData, error: eventsError} = await supabase
        .from('events')
        .select('*, event_images(*)')
        .eq('region_id', regionData.id);

      if (eventsError) console.error(eventsError);
      setEvents(eventsData || []);

      setLoading(false);
    }

    fetchBergenMusic()
  }, [])

  if (loading) return <p>Loading...</p>

  return (



    <Card style={{width: '80%', margin:'auto', padding:'2rem'}}>
      <h1>{region?.name} — {team?.discipline} team</h1>

      <h2>Members ({members.length})</h2>
      {members.map(member => (
        <div key={member.id} style={{marginBottom: '1rem'}}>
          <img src={member.headshot_url} alt={member.name} width={100} />
          <p>{member.name} — {member.role}</p>
        </div>
      ))}

      <h2>Events ({events.length})</h2>
      {events.map(event => (
        <div key={event.id} style={{marginBottom: '1rem'}}>
          <p>{event.event_date}</p>
          <p>{event.content}</p>
          {event.event_images?.map(img => (
            <img key={img.id} src={img.image_url} width={300} />
          ))}
        </div>
      ))}
    </Card>
  )
}
