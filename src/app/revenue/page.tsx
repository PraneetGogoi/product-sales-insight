'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { ComposedChart, Bar, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { formatCurrency } from '@/lib/utils'

function RevenueContent() {
  const searchParams = useSearchParams()
  const range = searchParams.get('range') || 'All Time'
  
  const [monthlyTrendData, setMonthlyTrendData] = useState<any>(null)
  const [heatmapData, setHeatmapData] = useState<any>(null)
  const [cumulativeData, setCumulativeData] = useState<any>(null)
  const [categoryData, setCategoryData] = useState<any>(null)

  useEffect(() => {
    fetch(`/api/revenue/monthly?range=${encodeURIComponent(range)}`)
      .then(r => r.json())
      .then(data => setMonthlyTrendData(data))

    fetch(`/api/revenue/heatmap?range=${encodeURIComponent(range)}`)
      .then(r => r.json())
      .then(data => setHeatmapData(data))

    fetch(`/api/revenue/cumulative?range=${encodeURIComponent(range)}`)
      .then(r => r.json())
      .then(data => setCumulativeData(data))

    fetch(`/api/categories?range=${encodeURIComponent(range)}`)
      .then(r => r.json())
      .then(data => setCategoryData(data))
  }, [range])

  const maxMonthRev = Array.isArray(monthlyTrendData) && monthlyTrendData.length > 0 ? Math.max(...monthlyTrendData.map((d: any) => d.revenue)) : 1

  const CustomBar = (props: any) => {
    const { fill, x, y, width, height } = props;
    const radius = 6;
    if (height <= 0) return null;
    return (
      <path
        d={`M${x},${y + height} L${x},${y + radius} Q${x},${y} ${x + radius},${y} L${x + width - radius},${y} Q${x + width},${y} ${x + width},${y + radius} L${x + width},${y + height} Z`}
        fill={fill}
      />
    );
  }

  return (
    <>
      <div className="ph" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="pt">Revenue Deep Dive</h1>
        </div>
      </div>

      <div className="scroll-container">
        <div className="charts-grid">
          <div className="clay-raised chart-card" style={{ gridColumn: 'span 2' }}>
            <div className="chart-title">Monthly Revenue & Rolling Average</div>
            <div className="chart-sub">3-month rolling average overlaid on actuals</div>
            <div style={{ height: 320, marginTop: 16 }}>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={monthlyTrendData || []}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--clay-surface-raised)" />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'var(--clay-text-dim)' }} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="left" tick={{ fontSize: 12, fill: 'var(--clay-text-dim)' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v/1000}k`} />
                  <YAxis yAxisId="right" orientation="right" hide />
                  <Tooltip cursor={{fill: 'rgba(255,255,255,0.03)'}} contentStyle={{ borderRadius: 12, border: 'none', background: 'var(--clay-surface-raised)', color: 'var(--clay-text)' }} formatter={(value: any) => formatCurrency(value)} />
                  <Bar yAxisId="left" dataKey="revenue" shape={<CustomBar />}>
                    {(monthlyTrendData || []).map((entry: any, index: number) => {
                      const intensity = 0.3 + (entry.revenue / maxMonthRev) * 0.7;
                      return <Cell key={index} fill={`rgba(74, 222, 128, ${intensity})`} />;
                    })}
                  </Bar>
                  <Line yAxisId="right" type="monotone" dataKey="rollingAvg" stroke="#8b5cf6" strokeWidth={3} strokeDasharray="5 5" dot={false} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="clay-raised chart-card">
            <div className="chart-title">YTD Progress</div>
            <div className="chart-sub">Cumulative total sales over time</div>
            <div style={{ height: 280, marginTop: 16 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={cumulativeData || []}>
                  <defs>
                    <linearGradient id="colorCum" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--clay-accent)" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="var(--clay-accent)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--clay-surface-raised)" />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'var(--clay-text-dim)' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: 'var(--clay-text-dim)' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v/1000}k`} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: 'none', background: 'var(--clay-surface-raised)', color: 'var(--clay-text)' }} formatter={(value: any) => formatCurrency(value)} />
                  <Area type="monotone" dataKey="cumulative" stroke="var(--clay-accent)" fillOpacity={1} fill="url(#colorCum)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="clay-raised chart-card">
            <div className="chart-title">Seasonality Heatmap</div>
            <div className="chart-sub">Revenue concentration by Month & Year</div>
            <div className="heatmap-container" style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 4 }}>
              {(heatmapData || []).map((row: any, i: number) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 40, fontSize: 11, color: 'var(--clay-text-dim)' }}>{row.year}</div>
                  <div style={{ display: 'flex', gap: 4, flex: 1 }}>
                    {row.months.map((m: any, j: number) => {
                      const maxMonth = Math.max(...(heatmapData || []).flatMap((r:any) => r.months.map((mx:any) => mx.revenue)))
                      const intensity = m.revenue > 0 ? (m.revenue / maxMonth) * 0.8 + 0.2 : 0.05
                      return (
                        <div 
                          key={j} 
                          title={`${m.month} ${row.year}: ${formatCurrency(m.revenue)}`}
                          style={{
                            height: 32,
                            flex: 1,
                            backgroundColor: `rgba(74, 222, 128, ${intensity})`,
                            borderRadius: 'var(--clay-radius)',
                            boxShadow: m.revenue > 0 ? 'inset 0 2px 4px rgba(255,255,255,0.1)' : 'none'
                          }}
                        />
                      )
                    })}
                  </div>
                </div>
              ))}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                <div style={{ width: 40 }}></div>
                <div style={{ display: 'flex', gap: 4, flex: 1 }}>
                  {['J','F','M','A','M','J','J','A','S','O','N','D'].map((m, j) => (
                    <div key={j} style={{ flex: 1, textAlign: 'center', fontSize: 10, color: 'var(--clay-text-dim)' }}>{m}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="clay-raised chart-card" style={{ gridColumn: 'span 2' }}>
            <div className="chart-title">Category Breakdown</div>
            <div className="chart-sub">Performance metrics by product category</div>
            <div style={{ marginTop: 16, overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 14 }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--clay-surface-raised)', color: 'var(--clay-text-dim)' }}>
                    <th style={{ padding: '12px 8px' }}>Category</th>
                    <th style={{ padding: '12px 8px' }}>Revenue</th>
                    <th style={{ padding: '12px 8px' }}>Units Sold</th>
                    <th style={{ padding: '12px 8px' }}>Avg. Order Value</th>
                  </tr>
                </thead>
                <tbody>
                  {(categoryData || []).map((cat: any, i: number) => (
                    <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '12px 8px', fontWeight: 'bold' }}>{cat.name}</td>
                      <td style={{ padding: '12px 8px', color: 'var(--clay-accent)' }}>{formatCurrency(cat.revenue)}</td>
                      <td style={{ padding: '12px 8px' }}>{cat.quantity.toLocaleString()}</td>
                      <td style={{ padding: '12px 8px' }}>{formatCurrency(cat.avgPrice)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default function RevenuePage() {
  return (
    <Suspense fallback={<div>Loading Revenue...</div>}>
      <RevenueContent />
    </Suspense>
  )
}
