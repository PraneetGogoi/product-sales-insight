'use client'

import { useState, useEffect } from 'react'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { formatCurrency } from '@/lib/utils'

export default function DashboardClient() {
  const [range, setRange] = useState('All Time')
  
  const [overview, setOverview] = useState<any>(null)
  const [products, setProducts] = useState<any>(null)
  const [cities, setCities] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      setError(null)
      try {
        const qs = `?range=${encodeURIComponent(range)}`
        
        const [overviewRes, productsRes, citiesRes] = await Promise.all([
          fetch(`/api/overview${qs}`).then(r => {
            if (!r.ok) throw new Error('Failed to fetch overview data')
            return r.json()
          }),
          fetch(`/api/products${qs}`).then(r => {
            if (!r.ok) throw new Error('Failed to fetch products data')
            return r.json()
          }),
          fetch(`/api/cities${qs}`).then(r => {
            if (!r.ok) throw new Error('Failed to fetch cities data')
            return r.json()
          })
        ])

        setOverview(overviewRes)
        setProducts(productsRes)
        setCities(citiesRes)
      } catch (err: any) {
        console.error("Error fetching data:", err)
        setError(err.message || 'An error occurred while fetching data.')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [range])

  const monthlyTrendData = overview?.overview_bar?.labels.map((label: string, i: number) => ({
    name: label,
    revenue: overview.overview_bar.values[i]
  }))

  const topProductsRevData = products?.top_products_revenue?.slice(0, 10).map((p: any) => ({
    name: p.name,
    revenue: p.value
  }))

  const topProductsVolData = products?.top_products_volume?.slice(0, 10).map((p: any) => ({
    name: p.name,
    volume: p.value
  }))

  const topCitiesData = cities?.top_cities_overview?.map((c: any) => ({
    name: c.name,
    revenue: c.revenue
  }))

  const pieColors = ['#333333', '#555555', '#777777', '#999999', '#bbbbbb'];

  return (
    <div style={{ position: 'relative' }}>
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <filter id="clayFilter">
            <feDropShadow dx="2" dy="2" stdDeviation="4" floodColor="#000" floodOpacity="0.1" result="shadow" />
            <feDropShadow dx="-2" dy="-2" stdDeviation="4" floodColor="#fff" floodOpacity="0.8" result="highlight" />
            <feComposite in="highlight" in2="SourceAlpha" operator="in" result="innerHighlight" />
            <feComposite in="shadow" in2="SourceAlpha" operator="in" result="innerShadow" />
            <feMerge>
              <feMergeNode in="SourceGraphic" />
              <feMergeNode in="innerHighlight" />
              <feMergeNode in="innerShadow" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      <div className="watermark">NEXUSPULSE</div>
      
      <div className="ph">
        <div>
          <div className="pt">Sales Overview</div>
          <div className="ps" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            Fiscal Year 2024-2026 &middot; All categories &middot; 
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              Live data <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'radial-gradient(circle at 30% 30%, #00ff00, #006600)', boxShadow: '0 0 10px rgba(0,255,0,0.5)', animation: 'blob-morph 2s infinite' }}></div>
            </span>
          </div>
        </div>
      </div>

      <div className="fr">
        {['All Time', 'Last Quarter', 'Last Month', 'Last Week'].map(pill => (
          <button 
            key={pill} 
            className={`pill ${range === pill ? 'active' : ''}`}
            onClick={() => setRange(pill)}
          >
            {pill}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ padding: 60, textAlign: 'center' }}>
          <div className="loading-blob"></div>
        </div>
      ) : error ? (
        <div style={{ padding: 40, textAlign: 'center', color: '#ff4444' }}>
          <strong>Error:</strong> {error}
          <p style={{ marginTop: 10, fontSize: 14, opacity: 0.8 }}>Please check if the database is configured correctly on the server.</p>
        </div>
      ) : (
        <>
          <div className="kg">
            <div className="kc hero-pebble">
              <div className="kiw">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="var(--amber)" filter="url(#clayFilter)"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
              </div>
              <div className="kl">Total Revenue</div>
              <div className="kv">{formatCurrency(overview?.kpis?.total_revenue || 0)}</div>
              <div className="kd"><span className="du">↗ {overview?.kpis?.revenue_change}</span></div>
            </div>
            
            <div className="kc">
              <div className="kiw">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="var(--indigo)" filter="url(#clayFilter)"><path d="M21 16.5c0 .38-.21.71-.53.88l-7.9 4.44c-.16.12-.36.18-.57.18s-.41-.06-.57-.18l-7.9-4.44A.991.991 0 0 1 3 16.5v-9c0-.38.21-.71.53-.88l7.9-4.44c.16-.12.36-.18.57-.18s.41.06.57.18l7.9 4.44c.32.17.53.5.53.88v9zM12 4.15L6.04 7.5 12 10.85l5.96-3.35L12 4.15z"/></svg>
              </div>
              <div className="kl">Units Sold</div>
              <div className="kv">{overview?.kpis?.units_sold?.toLocaleString()}</div>
              <div className="kd"><span className="du">↗ {overview?.kpis?.units_change}</span></div>
            </div>
            
            <div className="kc">
              <div className="kiw">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="var(--tm)" filter="url(#clayFilter)"><path d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z"/></svg>
              </div>
              <div className="kl">Avg Price</div>
              <div className="kv">${(overview?.kpis?.avg_price || 0).toFixed(2)}</div>
              <div className="kd"><span className="dd">↘ {overview?.kpis?.price_change}</span></div>
            </div>
            
            <div className="kc">
              <div className="kiw">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="var(--rose)" filter="url(#clayFilter)"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
              </div>
              <div className="kl">Active Cities</div>
              <div className="kv">{overview?.kpis?.cities_active}</div>
              <div className="kd"><span className="du">↗ {overview?.kpis?.cities_change}</span></div>
            </div>
          </div>

          <div className="cr">
            <div className="cc" style={{ gridColumn: 'span 2' }}>
              <div className="ct">Monthly Sales Revenue Trend</div>
              <div className="cs">Total USD across all product lines</div>
              <div style={{ height: 250, marginTop: 16 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyTrendData || []}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'var(--tm)' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: 'var(--tm)' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v/1000}k`} />
                    <Tooltip cursor={{stroke: 'rgba(0,0,0,0.1)', strokeWidth: 2}} contentStyle={{ borderRadius: 12, border: 'none', boxShadow: 'var(--nr)' }} formatter={(value: any) => formatCurrency(value)} />
                    <Line type="monotone" dataKey="revenue" stroke="teal" strokeWidth={5} dot={{ r: 6, fill: 'teal', filter: 'url(#clayFilter)' }} activeDot={{ r: 8, fill: 'var(--amber)' }} style={{ filter: 'url(#clayFilter)' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="cr">
            <div className="cc">
              <div className="ct">Top 10 Products by Revenue</div>
              <div className="cs">Revenue (USD)</div>
              <div style={{ height: 350, marginTop: 16 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topProductsRevData || []} layout="vertical" margin={{ left: 20 }}>
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: 'var(--tm)' }} axisLine={false} tickLine={false} width={120} />
                    <Tooltip cursor={{fill: 'rgba(0,0,0,0.05)'}} contentStyle={{ borderRadius: 12, border: 'none', boxShadow: 'var(--nr)' }} formatter={(value: any) => formatCurrency(value)} />
                    <Bar dataKey="revenue" fill="var(--indigo)" radius={20} barSize={24} style={{ filter: 'url(#clayFilter)' }} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="cc">
              <div className="ct">Revenue by Customer City</div>
              <div className="cs">Revenue concentration across the top 5 regions</div>
              <div style={{ height: 350, marginTop: 16 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={topCitiesData?.slice(0, 5) || []}
                      dataKey="revenue"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      stroke="none"
                      style={{ filter: 'url(#clayFilter)' }}
                    >
                      {(topCitiesData?.slice(0, 5) || []).map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: 'var(--nr)' }} formatter={(value: any) => formatCurrency(value)} />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

        </>
      )}
    </div>
  )
}
