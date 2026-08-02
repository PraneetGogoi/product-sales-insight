'use client'


import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { CircleDollarSign, Package, ShoppingCart, Map } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

export default function DashboardClient({ 
  initialOverview, 
  initialMonthlyTrendData, 
  initialTopProductsRev, 
  initialCategoryData 
}: any) {
  const overview = initialOverview
  const monthlyTrendData = initialMonthlyTrendData
  const topProductsRev = initialTopProductsRev
  const categoryData = initialCategoryData

  const maxMonthRev = Array.isArray(monthlyTrendData) && monthlyTrendData.length > 0 ? Math.max(...monthlyTrendData.map((d: any) => d.revenue)) : 1
  const maxProdRev = Array.isArray(topProductsRev) && topProductsRev.length > 0 ? Math.max(...topProductsRev.map((d: any) => d.revenue)) : 1

  const pieColors = ['var(--clay-accent)', '#8b5cf6', '#ec4899', '#f59e0b', '#06b6d4', '#64748b']

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
          <h1 className="pt">Good Morning.</h1>
        </div>
      </div>

      <div className="scroll-container">
        <>
          <div className="pebble-cluster">
            <div className="clay-raised pebble hero">
              <div className="pebble-icon" style={{ background: 'var(--clay-surface-pressed)', color: 'var(--clay-accent)' }}>
                <CircleDollarSign size={36} strokeWidth={2.5} filter="url(#clayIconFilter)" />
              </div>
              <div className="pebble-label">Revenue, YTD</div>
              <div className="pebble-val">{formatCurrency(overview?.kpis?.total_revenue || 0)}</div>
              <div className="pebble-delta"><span className="delta-up">Up {overview?.kpis?.revenue_change} from last year</span></div>
            </div>
            
            <div className="clay-raised pebble">
              <div className="pebble-icon" style={{ background: 'var(--clay-surface-pressed)', color: 'var(--clay-accent)' }}>
                <Package size={26} strokeWidth={2.5} filter="url(#clayIconFilter)" />
              </div>
              <div className="pebble-label">Units Moved</div>
              <div className="pebble-val">{overview?.kpis?.units_sold?.toLocaleString()}</div>
              <div className="pebble-delta"><span className="delta-up">{overview?.kpis?.units_change} ahead of last year</span></div>
            </div>
            
            <div className="clay-raised pebble">
              <div className="pebble-icon" style={{ background: 'var(--clay-surface-pressed)', color: 'var(--clay-danger)' }}>
                <ShoppingCart size={26} strokeWidth={2.5} filter="url(#clayIconFilter)" />
              </div>
              <div className="pebble-label">Avg. Order Value</div>
              <div className="pebble-val">${(overview?.kpis?.avg_price || 0).toFixed(2)}</div>
              <div className="pebble-delta"><span className="delta-down">Down {overview?.kpis?.price_change} — worth a look</span></div>
            </div>
            
            <div className="clay-raised pebble">
              <div className="pebble-icon" style={{ background: 'var(--clay-surface-pressed)', color: 'var(--clay-text-dim)' }}>
                <Map size={26} strokeWidth={2.5} filter="url(#clayIconFilter)" />
              </div>
              <div className="pebble-label">Markets Live</div>
              <div className="pebble-val">{overview?.kpis?.cities_active}</div>
              <div className="pebble-delta"><span className="delta-up">{overview?.kpis?.cities_change} new this year</span></div>
            </div>
          </div>

          <div className="charts-grid">
            <div className="clay-raised chart-card" style={{ gridColumn: 'span 2' }}>
              <div className="chart-title">Where the Revenue Landed</div>
              <div className="chart-sub">Month by month, FY24–26 — hover any bar</div>
              <div style={{ height: 280, marginTop: 16 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyTrendData || []}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--clay-surface-raised)" />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'var(--clay-text-dim)' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: 'var(--clay-text-dim)' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v/1000}k`} />
                    <Tooltip cursor={{fill: 'rgba(255,255,255,0.03)'}} contentStyle={{ borderRadius: 12, border: 'none', background: 'var(--clay-surface-raised)', color: 'var(--clay-text)' }} formatter={(value: any) => formatCurrency(value)} />
                    <Bar dataKey="revenue" shape={<CustomBar />}>
                      {(monthlyTrendData || []).map((entry: any, index: number) => {
                        const intensity = 0.3 + (entry.revenue / maxMonthRev) * 0.7;
                        return <Cell key={index} fill={`rgba(74, 222, 128, ${intensity})`} />;
                      })}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="clay-raised chart-card">
              <div className="chart-title">Top 10 Products by Revenue</div>
              <div className="chart-sub">The heavy hitters</div>
              <div style={{ height: 280, marginTop: 16 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topProductsRev || []} layout="vertical" margin={{ left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="var(--clay-surface-raised)" />
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: 'var(--clay-text)' }} width={100} axisLine={false} tickLine={false} />
                    <Tooltip cursor={{fill: 'rgba(255,255,255,0.03)'}} contentStyle={{ borderRadius: 12, border: 'none', background: 'var(--clay-surface-raised)', color: 'var(--clay-text)' }} formatter={(value: any) => formatCurrency(value)} />
                    <Bar dataKey="revenue" barSize={12} radius={[0, 6, 6, 0]}>
                       {(topProductsRev || []).map((entry: any, index: number) => {
                        const intensity = 0.3 + (entry.revenue / maxProdRev) * 0.7;
                        return <Cell key={index} fill={`rgba(139, 92, 246, ${intensity})`} />;
                      })}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="clay-raised chart-card">
              <div className="chart-title">What's Selling?</div>
              <div className="chart-sub">Category split by volume</div>
              <div style={{ height: 280, marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData || []}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="quantity"
                      stroke="none"
                    >
                      {(categoryData || []).map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: 12, border: 'none', background: 'var(--clay-surface-raised)', color: 'var(--clay-text)' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      </div>

      <svg width="0" height="0">
        <filter id="clayIconFilter">
          <feDropShadow dx="2" dy="2" stdDeviation="3" floodOpacity="0.5" floodColor="#000" />
          <feDropShadow dx="-1" dy="-1" stdDeviation="2" floodOpacity="0.3" floodColor="#fff" />
        </filter>
      </svg>
    </>
  )
}
