'use client'
import { useState } from 'react'

export default function Sidebar() {
  const [active, setActive] = useState('Overview')

  const navItems = [
    { name: 'Overview', icon: <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="7" height="7" rx="1.5"/><rect x="11" y="2" width="7" height="7" rx="1.5"/><rect x="2" y="11" width="7" height="7" rx="1.5"/><rect x="11" y="11" width="7" height="7" rx="1.5"/></svg> },
    { name: 'Revenue', icon: <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="2,14 7,8 11,11 18,4"/></svg> },
    { name: 'Products', icon: <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="14" height="14" rx="2"/><line x1="7" y1="8" x2="13" y2="8"/><line x1="7" y1="12" x2="11" y2="12"/></svg>, badge: 3 },
    { name: 'Cities', icon: <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="10" cy="10" r="7"/><line x1="2" y1="10" x2="18" y2="10"/><path d="M10 3 C7 6 7 14 10 17"/><path d="M10 3 C13 6 13 14 10 17"/></svg> },
    { name: 'Trends', icon: <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3,14 8,9 13,12 18,5"/></svg> },
  ]

  return (
    <div className="sidebar">
      {navItems.map(item => (
        <div 
          key={item.name}
          className={`ni ${active === item.name ? 'active' : ''}`}
          onClick={() => setActive(item.name)}
          title={item.name}
        >
          {item.icon}
          {item.badge && <div className="nbadge">{item.badge}</div>}
        </div>
      ))}
      <div style={{ marginTop: 'auto', marginBottom: '24px' }}>
        <div className="ni" title="Settings">
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="10" cy="10" r="3"/><path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.2 4.2l1.4 1.4M14.4 14.4l1.4 1.4M4.2 15.8l1.4-1.4M14.4 5.6l1.4-1.4"/></svg>
        </div>
      </div>
    </div>
  )
}
