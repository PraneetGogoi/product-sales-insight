'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Bell, Activity } from 'lucide-react'

export default function CommandBar() {
  const [search, setSearch] = useState('')
  const router = useRouter()

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && search.trim() !== '') {
      router.push(`/products?q=${encodeURIComponent(search.trim())}`)
      setSearch('')
    }
  }

  return (
    <div className="command-bar">
      <div className="logo-area">
        <Activity size={24} style={{marginRight: '8px', cursor: 'pointer', opacity: 0.8}} />
        <div className="logo-name">Nexus<span className="logo-dot">Pulse</span></div>
        <div className="logo-sub">Analytics Suite</div>
      </div>
      <div className="top-actions">
        <div className="search-wrap">
          <Search className="search-icon" size={14} strokeWidth={2} />
          <input 
            className="search-inp" 
            placeholder="Search products..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearch}
          />
        </div>
        <div className="notification-wrap" style={{ position: 'relative', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '50%', background: 'var(--clay-surface-raised)', boxShadow: 'var(--clay-shadow-raised)' }}>
          <Bell size={16} strokeWidth={2.5} style={{ color: 'var(--clay-text-dim)' }} />
          <div style={{ position: 'absolute', top: '6px', right: '6px', width: '6px', height: '6px', background: 'var(--clay-danger)', borderRadius: '50%', boxShadow: '0 0 8px var(--clay-danger)' }}></div>
        </div>
        <div className="avatar">P</div>
      </div>
    </div>
  )
}
