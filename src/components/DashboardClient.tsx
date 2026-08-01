'use client'

import { useState, useEffect } from 'react'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
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

  return (
    <div style={{ position: 'relative' }}>
      <div className="watermark">NEXUSPULSE</div>
      
      <div className="ph">
        <div>
          <div className="pt">Sales Overview</div>
          <div className="ps">Fiscal Year 2024-2026 &middot; All categories &middot; Live data</div>
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
        <div style={{ padding: 40, textAlign: 'center', opacity: 0.5 }}>Loading data...</div>
      ) : error ? (
        <div style={{ padding: 40, textAlign: 'center', color: '#ff4444' }}>
          <strong>Error:</strong> {error}
          <p style={{ marginTop: 10, fontSize: 14, opacity: 0.8 }}>Please check if the database is configured correctly on the server.</p>
        </div>
      ) : (
        <>
          <div className="kg">
            <div className="kc" style={{ '--ca': '#00cc00' } as any}>
              <div className="kiw">💰</div>
              <div className="kl">Total Revenue</div>
              <div className="kv">{formatCurrency(overview?.kpis?.total_revenue || 0)}</div>
              <div className="kd"><span className="du">↗ {overview?.kpis?.revenue_change}</span></div>
            </div>
            <div className="kc" style={{ '--ca': '#333333' } as any}>
              <div className="kiw">📦</div>
              <div className="kl">Units Sold</div>
              <div className="kv">{overview?.kpis?.units_sold?.toLocaleString()}</div>
              <div className="kd"><span className="du">↗ {overview?.kpis?.units_change}</span></div>
            </div>
            <div className="kc" style={{ '--ca': '#1a1a1a' } as any}>
              <div className="kiw">🏷️</div>
              <div className="kl">Avg Price</div>
              <div className="kv">${(overview?.kpis?.avg_price || 0).toFixed(2)}</div>
              <div className="kd"><span className="dd">↘ {overview?.kpis?.price_change}</span></div>
            </div>
            <div className="kc" style={{ '--ca': '#004d00' } as any}>
              <div className="kiw">🌍</div>
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
                    <Tooltip cursor={{stroke: 'rgba(0,0,0,0.1)', strokeWidth: 2}} contentStyle={{ borderRadius: 12, border: 'none', boxShadow: 'var(--nr)' }} formatter={(value: number) => formatCurrency(value)} />
                    <Line type="monotone" dataKey="revenue" stroke="teal" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="cr">
            <div className="cc">
              <div className="ct">Top 10 Products by Revenue</div>
              <div className="cs">Revenue (USD)</div>
              <div style={{ height: 250, marginTop: 16 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topProductsRevData || []} layout="vertical" margin={{ left: 20 }}>
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: 'var(--tm)' }} axisLine={false} tickLine={false} width={100} />
                    <Tooltip cursor={{fill: 'rgba(0,0,0,0.05)'}} contentStyle={{ borderRadius: 12, border: 'none', boxShadow: 'var(--nr)' }} formatter={(value: number) => formatCurrency(value)} />
                    <Bar dataKey="revenue" fill="var(--indigo)" radius={[0, 4, 4, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="cc">
              <div className="ct">Top 10 Products by Quantity Sold</div>
              <div className="cs">Units Sold</div>
              <div style={{ height: 250, marginTop: 16 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topProductsVolData || []} layout="vertical" margin={{ left: 20 }}>
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: 'var(--tm)' }} axisLine={false} tickLine={false} width={100} />
                    <Tooltip cursor={{fill: 'rgba(0,0,0,0.05)'}} contentStyle={{ borderRadius: 12, border: 'none', boxShadow: 'var(--nr)' }} />
                    <Bar dataKey="volume" fill="#00cc00" radius={[0, 4, 4, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="cr" style={{ gridTemplateColumns: '1fr' }}>
             <div className="cc">
              <div className="ct">Total Sales Revenue by Customer City</div>
              <div className="cs">Revenue concentration by region</div>
              <div style={{ height: 250, marginTop: 16 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topCitiesData || []}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'var(--tm)' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: 'var(--tm)' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v/1000}k`} />
                    <Tooltip cursor={{fill: 'rgba(0,0,0,0.05)'}} contentStyle={{ borderRadius: 12, border: 'none', boxShadow: 'var(--nr)' }} formatter={(value: number) => formatCurrency(value)} />
                    <Bar dataKey="revenue" fill="teal" radius={[4, 4, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
