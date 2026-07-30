import { useEffect, useState } from 'react'
import { Card, Placeholder } from 'react-bootstrap'
import { supabase } from '../lib/supabase'

export default function Region() {
  const [directors, setDirectors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDirectors() {
      const { data, error } = await supabase
        .from('profiles')
        .select('*, teams(name, discipline, regions(name, country))')
        .eq('role', 'rd');

      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }
      setDirectors(data || []);
      setLoading(false);
    }

    fetchDirectors();
  }, []);

  if (loading) return (
    <div>
      <div className="mobile-spacer" />
      <Placeholder as="h1" animation="glow"><Placeholder xs={4} /></Placeholder>
      {[1, 2, 3].map((n) => (
        <Card key={n} style={{ marginBottom: '1rem', width: '80%', margin: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', padding: '1rem', gap: '1rem' }}>
            <Placeholder as="div" animation="glow">
              <Placeholder xs={12} bg="secondary" style={{ width: '100px', height: '100px', borderRadius: '50%' }} />
            </Placeholder>
            <div style={{ flex: 1 }}>
              <Placeholder as="h3" animation="glow"><Placeholder xs={5} /></Placeholder>
              <Placeholder as="p" animation="glow"><Placeholder xs={4} /></Placeholder>
              <Placeholder as="p" animation="glow"><Placeholder xs={3} /></Placeholder>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  return (
    <div>
      <div className="mobile-spacer" />
      <h1>Regional Directors</h1>
      {directors.map((director) => (
        <Card key={director.id} style={{ marginBottom: '1rem', width: '80%', margin: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', padding: '1rem' }}>
            <img
              src={director.headshot_url}
              alt={director.full_name}
              width={100}
              height={100}
              loading="lazy"
              style={{ borderRadius: '50%', objectFit: 'cover', marginRight: '1rem' }}
            />
            <div>
              <h3>{director.full_name}</h3>
              <p>{director.teams?.regions?.name}</p>
              <p>{director.teams?.discipline}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
