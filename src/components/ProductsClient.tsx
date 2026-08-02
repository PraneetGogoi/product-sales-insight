'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { formatCurrency } from '@/lib/utils'

import { useRouter, usePathname } from 'next/navigation'

export default function ProductsClient({
  initialTopRevenue,
  initialTopQuantity,
  initialAllProducts
}: any) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const initialSearch = searchParams.get('q') || ''
  
  const [search, setSearch] = useState(initialSearch)

  useEffect(() => {
    const timer = setTimeout(() => {
      const current = new URLSearchParams(Array.from(searchParams.entries()))
      if (search) {
        current.set('q', search)
      } else {
        current.delete('q')
      }
      router.push(`${pathname}?${current.toString()}`)
    }, 500)
    return () => clearTimeout(timer)
  }, [search, pathname, router, searchParams])
  
  const topRevenue = initialTopRevenue
  const topQuantity = initialTopQuantity
  const allProducts = initialAllProducts

  const maxRev = Array.isArray(topRevenue) && topRevenue.length > 0 ? Math.max(...topRevenue.map((d: any) => d.revenue)) : 1
  const maxQty = Array.isArray(topQuantity) && topQuantity.length > 0 ? Math.max(...topQuantity.map((d: any) => d.quantity)) : 1

  return (
    <>
      <div className="ph" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="pt">Products Analysis</h1>
        </div>
      </div>

      <div className="scroll-container">
        <div className="charts-grid">
          <div className="clay-raised chart-card">
            <div className="chart-title">Top 10 by Revenue</div>
            <div className="chart-sub">Highest grossing products</div>
            <div style={{ height: 280, marginTop: 16 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topRevenue || []} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="var(--clay-surface-raised)" />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: 'var(--clay-text)' }} width={100} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{fill: 'rgba(255,255,255,0.03)'}} contentStyle={{ borderRadius: 12, border: 'none', background: 'var(--clay-surface-raised)', color: 'var(--clay-text)' }} formatter={(value: any) => formatCurrency(value)} />
                  <Bar dataKey="revenue" barSize={12} radius={[0, 6, 6, 0]}>
                     {(topRevenue || []).map((entry: any, index: number) => {
                      const intensity = 0.3 + (entry.revenue / maxRev) * 0.7;
                      return <Cell key={index} fill={`rgba(139, 92, 246, ${intensity})`} />;
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="clay-raised chart-card">
            <div className="chart-title">Top 10 by Volume</div>
            <div className="chart-sub">Most frequently sold items</div>
            <div style={{ height: 280, marginTop: 16 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topQuantity || []} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="var(--clay-surface-raised)" />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: 'var(--clay-text)' }} width={100} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{fill: 'rgba(255,255,255,0.03)'}} contentStyle={{ borderRadius: 12, border: 'none', background: 'var(--clay-surface-raised)', color: 'var(--clay-text)' }} />
                  <Bar dataKey="quantity" barSize={12} radius={[0, 6, 6, 0]}>
                     {(topQuantity || []).map((entry: any, index: number) => {
                      const intensity = 0.3 + (entry.quantity / maxQty) * 0.7;
                      return <Cell key={index} fill={`rgba(6, 182, 212, ${intensity})`} />;
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="clay-raised chart-card" style={{ gridColumn: 'span 2' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div className="chart-title">Product Catalog</div>
                <div className="chart-sub">Detailed sales performance</div>
              </div>
              <input 
                className="search-inp" 
                placeholder="Filter products..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ width: '250px', background: 'var(--clay-surface-pressed)', border: 'none', padding: '8px 16px', borderRadius: '16px', color: 'var(--clay-text)' }}
              />
            </div>
            
            <div style={{ marginTop: 24, overflowX: 'auto', maxHeight: '400px', overflowY: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 14 }}>
                <thead style={{ position: 'sticky', top: 0, background: 'var(--clay-surface)', zIndex: 1 }}>
                  <tr style={{ borderBottom: '1px solid var(--clay-surface-raised)', color: 'var(--clay-text-dim)' }}>
                    <th style={{ padding: '12px 8px' }}>Product Name</th>
                    <th style={{ padding: '12px 8px' }}>Category</th>
                    <th style={{ padding: '12px 8px' }}>Avg Price</th>
                    <th style={{ padding: '12px 8px' }}>Units Sold</th>
                    <th style={{ padding: '12px 8px' }}>Total Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {allProducts === null ? (
                    <tr><td colSpan={5} style={{ padding: '24px', textAlign: 'center', color: 'var(--clay-text-dim)' }}>Loading...</td></tr>
                  ) : allProducts.length === 0 ? (
                    <tr><td colSpan={5} style={{ padding: '24px', textAlign: 'center', color: 'var(--clay-text-dim)' }}>No products found</td></tr>
                  ) : (
                    allProducts.map((p: any, i: number) => (
                      <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <td style={{ padding: '12px 8px', fontWeight: 'bold' }}>{p.name}</td>
                        <td style={{ padding: '12px 8px' }}>{p.category}</td>
                        <td style={{ padding: '12px 8px' }}>{formatCurrency(p.avgPrice)}</td>
                        <td style={{ padding: '12px 8px' }}>{p.quantity.toLocaleString()}</td>
                        <td style={{ padding: '12px 8px', color: 'var(--clay-accent)' }}>{formatCurrency(p.revenue)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
