'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { formatCurrency } from '@/lib/utils'

// Hardcoded coordinates for a simplified pseudo-map to match dashboard styling without bloating with map libs
const CITY_COORDS: Record<string, { x: number, y: number }> = {
  'New York': { x: 75, y: 35 },
  'Los Angeles': { x: 15, y: 55 },
  'Chicago': { x: 60, y: 35 },
  'Houston': { x: 50, y: 65 },
  'Phoenix': { x: 25, y: 60 },
  'Philadelphia': { x: 73, y: 37 },
  'San Antonio': { x: 45, y: 70 },
  'San Diego': { x: 17, y: 62 },
  'Dallas': { x: 48, y: 62 },
  'San Jose': { x: 10, y: 45 },
  'Austin': { x: 46, y: 68 },
  'Jacksonville': { x: 70, y: 75 },
  'San Francisco': { x: 9, y: 43 },
  'Columbus': { x: 65, y: 40 },
  'Indianapolis': { x: 62, y: 42 }
}

function CitiesContent() {
  const searchParams = useSearchParams()
  const initialSearch = searchParams.get('q') || ''
  
  const [range, setRange] = useState('All Time')
  const [search, setSearch] = useState(initialSearch)
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch)
  
  const [citiesData, setCitiesData] = useState<any>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
    }, 500)
    return () => clearTimeout(timer)
  }, [search])

  useEffect(() => {
    // API returns Top 15 cities sorted by revenue
    fetch(`/api/cities?range=${encodeURIComponent(range)}`)
      .then(r => r.json())
      .then(data => setCitiesData(data))
  }, [range])

  const filteredCities = (citiesData || []).filter((c: any) => 
    c.name.toLowerCase().includes(debouncedSearch.toLowerCase())
  )

  const maxRev = Array.isArray(citiesData) && citiesData.length > 0 ? Math.max(...citiesData.map((d: any) => d.revenue)) : 1

  return (
    <>
      <div className="ph" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="pt">City Markets</h1>
        </div>
        <div className="fr" style={{ marginBottom: 0 }}>
          {['All Time', 'Last Quarter', 'Last Month', 'Last Week'].map(t => (
            <button 
              key={t}
              className={`pill ${range === t ? 'active' : ''}`}
              onClick={() => setRange(t)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="scroll-container">
        <div className="charts-grid">
          <div className="clay-raised chart-card" style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column' }}>
            <div className="chart-title">Revenue Concentration</div>
            <div className="chart-sub">Relative scale of markets</div>
            <div style={{ flex: 1, marginTop: 16, position: 'relative', background: 'var(--clay-surface-pressed)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.02)', overflow: 'hidden' }}>
              {/* Pseudo-map background grids */}
              <div style={{ position: 'absolute', inset: 0, opacity: 0.1, backgroundImage: 'radial-gradient(var(--clay-text) 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
              
              <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '300px' }}>
                {filteredCities.map((city: any, i: number) => {
                  const coords = CITY_COORDS[city.name] || { x: 50 + (Math.random()*40-20), y: 50 + (Math.random()*40-20) } // Random fallback
                  const scale = 0.5 + (city.revenue / maxRev) * 1.5
                  
                  return (
                    <div 
                      key={i}
                      style={{
                        position: 'absolute',
                        left: `${coords.x}%`,
                        top: `${coords.y}%`,
                        transform: 'translate(-50%, -50%)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        zIndex: Math.floor(scale * 10)
                      }}
                      title={`${city.name}: ${formatCurrency(city.revenue)}`}
                    >
                      <div style={{
                        width: `${16 * scale}px`,
                        height: `${16 * scale}px`,
                        borderRadius: '50%',
                        background: 'var(--clay-accent)',
                        boxShadow: '0 0 20px var(--clay-accent)',
                        opacity: 0.8
                      }}></div>
                      <div style={{ marginTop: 4, fontSize: 10, fontWeight: 'bold', color: 'var(--clay-text)', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                        {city.name}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="clay-raised chart-card" style={{ gridColumn: 'span 2' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div className="chart-title">Top Markets</div>
                <div className="chart-sub">Ranked list of cities by revenue</div>
              </div>
              <input 
                className="search-inp" 
                placeholder="Filter cities..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ width: '250px', background: 'var(--clay-surface-pressed)', border: 'none', padding: '8px 16px', borderRadius: '16px', color: 'var(--clay-text)' }}
              />
            </div>
            
            <div style={{ marginTop: 24 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px' }}>
                {citiesData === null ? (
                  <div style={{ color: 'var(--clay-text-dim)' }}>Loading...</div>
                ) : filteredCities.length === 0 ? (
                  <div style={{ color: 'var(--clay-text-dim)' }}>No cities found</div>
                ) : (
                  filteredCities.map((city: any, i: number) => (
                    <div key={i} className="clay-raised" style={{ padding: '16px', borderRadius: '16px', background: 'var(--clay-surface)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontSize: 16, fontWeight: 'bold' }}>{city.name}</div>
                        <div style={{ fontSize: 12, color: 'var(--clay-text-dim)' }}>#{i + 1}</div>
                      </div>
                      <div style={{ marginTop: 12, fontSize: 20, color: 'var(--clay-accent)' }}>
                        {formatCurrency(city.revenue)}
                      </div>
                      <div style={{ marginTop: 4, fontSize: 12, color: 'var(--clay-text-dim)' }}>
                        {city.quantity.toLocaleString()} units sold
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default function CitiesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CitiesContent />
    </Suspense>
  )
}
