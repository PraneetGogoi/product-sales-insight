'use client'

import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { formatCurrency } from '@/lib/utils'

export default function DashboardClient() {
  const [range, setRange] = useState('All Time')
  
  const [overview, setOverview] = useState<any>(null)
  const [products, setProducts] = useState<any>(null)
  const [cities, setCities] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      const qs = `?range=${encodeURIComponent(range)}`
      
      const [overviewRes, productsRes, citiesRes] = await Promise.all([
        fetch(`/api/overview${qs}`).then(r => r.json()),
        fetch(`/api/products${qs}`).then(r => r.json()),
        fetch(`/api/cities${qs}`).then(r => r.json())
      ])

      setOverview(overviewRes)
      setProducts(productsRes)
      setCities(citiesRes)
      setLoading(false)
    }
    loadData()
  }, [range])

  const chartData = overview?.overview_bar?.labels.map((label: string, i: number) => ({
    name: label,
    value: overview.overview_bar.values[i]
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
            <div className="cc">
              <div className="ct">Monthly Revenue</div>
              <div className="cs">Total USD across all product lines</div>
              <div style={{ height: 180, marginTop: 16 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData || []}>
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'var(--tm)' }} axisLine={false} tickLine={false} />
                    <Tooltip cursor={{fill: 'rgba(0,0,0,0.05)'}} contentStyle={{ borderRadius: 12, border: 'none', boxShadow: 'var(--nr)' }} />
                    <Bar dataKey="value" fill="var(--indigo)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="cc">
              <div className="ct">Top Products</div>
              <div className="cs">By Revenue USD</div>
              <div className="cl" style={{ marginTop: 16 }}>
                {products?.top_products_revenue?.slice(0, 4).map((p: any, i: number) => (
                  <div className="cir" key={p.name}>
                    <div className="crk">{p.rank}</div>
                    <div className="cn">{p.name}</div>
                    <div className="crv">{formatCurrency(p.value)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="cr" style={{ gridTemplateColumns: '1fr 1fr' }}>
             <div className="cc">
              <div className="ct">Top Cities</div>
              <div className="cs">Revenue concentration by region</div>
              <div className="cl" style={{ marginTop: 16 }}>
                {cities?.top_cities_overview?.map((c: any, i: number) => (
                  <div className="cir" key={c.name}>
                    <div className="crk">0{i+1}</div>
                    <div className="cn">{c.name}</div>
                    <div className="crv">{formatCurrency(c.revenue)}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="cc">
              <div className="ct">Volume Leaders</div>
              <div className="cs">Top products by units sold</div>
              <div className="cl" style={{ marginTop: 16 }}>
                {products?.top_products_volume?.slice(0, 4).map((p: any, i: number) => (
                  <div className="cir" key={p.name}>
                    <div className="crk">{p.rank}</div>
                    <div className="cn">{p.name}</div>
                    <div className="crv">{p.value.toLocaleString()} units</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
