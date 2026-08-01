import { getRegions, formatSlugLabel, slugifyCountryName } from "../services/MemberService"
import { useEffect, useState, useMemo } from "react";
import { Spinner } from "react-bootstrap";
import chapterIMG from "../assets/chapters.jpg"
import Landing from "../components/Landing";

import { ComposableMap, Geographies, Geography, Annotation, ZoomableGroup } from 'react-simple-maps'
import usStates from 'us-atlas/states-10m.json'
import worldCountries from 'world-atlas/countries-50m.json'
import { Link } from "react-router-dom";


export default function Chapters() {
    const [regions, setRegions] = useState(null);
    const [regionsLoading, setRegionsLoading] = useState(true)
    const [regionsError, setRegionsError] = useState(false)
    const [view, setView] = useState('usa')
    const [usselected, usSetSelected] = useState(null)
    const [selected, setSelected] = useState(null)
    const [showFullList, setShowFullList] = useState(false)


    async function fetchRegions(){
      setRegionsLoading(true);
      setRegionsError(false);
      const {data: regionData, error: regionError} = await getRegions();

      if (regionError){
        console.error(regionError);
        setRegionsError(true);
        setRegionsLoading(false);
        return;
      }

      setRegions(regionData);
      setRegionsLoading(false);
    }

    useEffect(()=>{
        fetchRegions();
    }, [])

    const grouped = useMemo(()=>{
      if (!regions) return {}
      return regions.reduce((acc,region) =>{
          const parts = region.name.split(':')
          const country = parts[0]

          if (parts.length === 3) {
            const state = parts[1]
            const county = parts[2]

            if (!acc[country]) acc[country] = {}
            if (!acc[country][state]) acc[country][state] = []
            acc[country][state].push(county)
          }
          else {
            if (!acc[country]) acc[country] = []
            acc[country].push(parts[1])
          }          
          return acc
          

      }, {})
    }, [regions])


  return (
    <div>
      <Landing theme="yellow" background="white" landingImg={chapterIMG} title={"OUR CHAPTERS"} description={<>Explore our chapters from around the world and find one near you! Interested in joining or starting one? <a href="/support-us">Sign up here</a>!</>} />
      {regionsLoading ? (
        <>
        <div className="spinner-container">
          <Spinner/>
          <p>Loading chapters...</p>
        </div>
        </>
      ) : regionsError ? (
        <div className="spinner-container">
          <p>Something went wrong loading chapters. Please check your connection and try again.</p>
          <button className="retry-btn" onClick={fetchRegions}>Retry</button>
        </div>
      ) : (
      <>
      <div className="chapters-map-row white">
        <button className="chapters-list-btn" onClick={() => setShowFullList((v) => !v)}>
          {showFullList ? 'Hide full list' : 'Show full list'}
        </button>
      {selected && (
          <div className="chapter-panel">
            <button className="chapter-panel-close" onClick={() => setSelected(null)} aria-label="Close">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="5" y1="5" x2="19" y2="19" />
                <line x1="19" y1="5" x2="5" y2="19" />
              </svg>
            </button>
            <h3>{formatSlugLabel(selected.name)}</h3>
            <ul>
            {selected.regions.map((region) =>(
                <li key={region.fullSlug}>
                  <Link to={`/chapter/${region.fullSlug}`}>{region.label}</Link>
                </li>
            ))}
            </ul>
          </div>
      )}
      {view === 'world' ? (
        <div>
          <button className="chapters-view-btn" onClick={() => setView('usa')}>See USA map</button>
          <div className="chapter-map">
            <ComposableMap>
              <ZoomableGroup >
                <Geographies geography={worldCountries}>
                  {({ geographies }) =>
                    geographies.map((geo) => {
                      const slug = slugifyCountryName(geo.properties.name)
                      return (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          style={{
                            default: { fill: grouped[slug] ? '#2b4469' : '#DDD', outline: 'none' },
                            hover: { fill: grouped[slug] ? 'rgb(75,112,173)' : '#DDD', outline: 'none' },
                            pressed: { fill: grouped[slug] ? 'rgb(75,112,173)' : '#DDD', outline: 'none' },
                          }}
                          onClick={() => {
                            if (slug === 'usa') setView('usa')
                            //country clicked
                            else {
                              const list = grouped[slug]
                              if (!list) return

                              const regionsList = Array.isArray(list)
                                ? list.map((county) => ({
                                    label: formatSlugLabel(county),
                                    fullSlug: `${slug}:${county}`,
                                  }))
                                : Object.entries(list).flatMap(([state, counties]) =>
                                    counties.map((county) => ({
                                      label: `${formatSlugLabel(county)}, ${formatSlugLabel(state)}`,
                                      fullSlug: `${slug}:${state}:${county}`,
                                    }))
                                  )

                              setSelected({ name: geo.properties.name, regions: regionsList })
                            }
                          }}
                        />
                      )
                    })
                  }
                </Geographies>
              </ZoomableGroup>
            </ComposableMap>
          </div>
          </div>
          ) : (
            <div className="chapter-map">
              <button className="chapters-view-btn" onClick={() => setView('world')}>See world map</button>
            <ComposableMap projection="geoAlbersUsa" projectionConfig={{ scale: 1000 }}>
              <ZoomableGroup center={[-98, 39]}>
              <Geographies geography={usStates}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const slug = slugifyCountryName(geo.properties.name)
                    const hasChapters = Boolean(grouped.usa && grouped.usa[slug])
                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        style={{
                          default: { fill: hasChapters ? '#2b4469' : '#DDD', outline: 'none' },
                          hover: { fill: hasChapters ? 'rgb(75,112,173)' : '#DDD', outline: 'none' },
                          pressed: { fill: hasChapters ? 'rgb(75,112,173)' : '#DDD', outline: 'none' },
                        }}
                        onClick={() => {
                          const list = grouped.usa && grouped.usa[slug]
                          if (!list) return

                          setSelected({
                            name: geo.properties.name,
                            regions: list.map((county) =>({
                              label: formatSlugLabel(county),
                              fullSlug: `usa:${slug}:${county}`,
                            })),
                          })
                        }}
                      />
                    )
                  })
                }
              </Geographies>
              </ZoomableGroup>
            </ComposableMap>
            </div>
          )}
        </div>

        <div className="light-blue chapters-list">
          {showFullList && Object.entries(grouped).flatMap(([country, value]) => {
            if (country === 'usa') {
              return Object.entries(value).map(([state, counties]) => (
                <div key={`usa-${state}`} className="chapters-list-group">
                  <h4>{formatSlugLabel(state)}, USA</h4>
                  <ul>
                    {counties.map((county) => (
                      <li key={county}>
                        <Link to={`/chapter/usa:${state}:${county}`}>{formatSlugLabel(county)}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            }

            const items = Array.isArray(value)
              ? value.map((region) => ({
                  label: formatSlugLabel(region),
                  fullSlug: `${country}:${region}`,
                }))
              : Object.entries(value).flatMap(([state, counties]) =>
                  counties.map((county) => ({
                    label: `${formatSlugLabel(county)}, ${formatSlugLabel(state)}`,
                    fullSlug: `${country}:${state}:${county}`,
                  }))
                )

            return [
              <div key={country} className="chapters-list-group">
                <h4>{formatSlugLabel(country)}</h4>
                <ul>
                  {items.map((item) => (
                    <li key={item.fullSlug}>
                      <Link to={`/chapter/${item.fullSlug}`}>{item.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ]
          })}
        </div>
      </>
      )}
    </div>
  )
}
