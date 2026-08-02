'use client'
import { useState, useRef, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, Bell, Menu, User, Settings, LogOut, TrendingDown } from 'lucide-react'

export default function CommandBar() {
  const [search, setSearch] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentRange = searchParams.get('range') || 'All Time'

  const [showNotifications, setShowNotifications] = useState(false)
  const [showAvatarMenu, setShowAvatarMenu] = useState(false)

  const notifRef = useRef<HTMLDivElement>(null)
  const avatarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
      if (avatarRef.current && !avatarRef.current.contains(event.target as Node)) {
        setShowAvatarMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && search.trim() !== '') {
      router.push(`/products?q=${encodeURIComponent(search.trim())}`)
      setSearch('')
    }
  }

  const handleRangeChange = (t: string) => {
    const newParams = new URLSearchParams(searchParams.toString())
    newParams.set('range', t)
    router.push(`?${newParams.toString()}`)
  }

  return (
    <div className="command-bar">
      <div className="logo-area">
        <Menu size={24} style={{marginRight: '8px', cursor: 'pointer', opacity: 0.8}} />
        <div className="logo-name">Nexus<span className="logo-dot" style={{ color: 'var(--clay-accent)' }}>.</span></div>
      </div>
      
      <div className="fr" style={{ marginBottom: 0 }}>
        {['All Time', 'Last Quarter', 'Last Month', 'Last Week'].map(t => (
          <button 
            key={t}
            className={`pill ${currentRange === t ? 'active' : ''}`}
            onClick={() => handleRangeChange(t)}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="top-actions">
        <div className="search-wrap">
          <Search className="search-icon" size={14} strokeWidth={2} />
          <input 
            className="search-inp" 
            placeholder="Search NexusPulse..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearch}
          />
        </div>
        
        <div className="notification-wrap" ref={notifRef} style={{ position: 'relative' }}>
          <div 
            className="avatar"
            onClick={() => setShowNotifications(!showNotifications)}
            style={{ color: 'var(--clay-text-dim)', background: showNotifications ? 'var(--clay-surface-pressed)' : 'var(--clay-surface-raised)', boxShadow: showNotifications ? 'inset 3px 3px 6px var(--clay-shadow-dark), inset -2px -2px 6px var(--clay-shadow-light)' : '' }}
          >
            <Bell size={18} strokeWidth={2.5} />
            <div style={{ position: 'absolute', top: '8px', right: '8px', width: '6px', height: '6px', background: 'var(--clay-danger)', borderRadius: '50%', boxShadow: '0 0 8px var(--clay-danger)' }}></div>
          </div>
          
          {showNotifications && (
            <div className="dropdown-menu">
              <div style={{ padding: '8px 12px', fontSize: '11px', textTransform: 'uppercase', color: 'var(--clay-text-dim)', letterSpacing: '0.05em', fontWeight: 800 }}>Alerts</div>
              <button className="dropdown-item">
                <TrendingDown size={16} style={{ color: 'var(--clay-danger)' }} />
                <span>Avg. Order Value down 0.3% — worth a look</span>
              </button>
            </div>
          )}
        </div>

        <div style={{ position: 'relative' }} ref={avatarRef}>
          <div 
            className="avatar" 
            onClick={() => setShowAvatarMenu(!showAvatarMenu)}
            style={{ background: showAvatarMenu ? 'var(--clay-surface-pressed)' : 'var(--clay-surface-raised)', boxShadow: showAvatarMenu ? 'inset 3px 3px 6px var(--clay-shadow-dark), inset -2px -2px 6px var(--clay-shadow-light)' : '' }}
          >
            P
          </div>
          
          {showAvatarMenu && (
            <div className="dropdown-menu">
              <button className="dropdown-item">
                <User size={16} />
                <span>Profile</span>
              </button>
              <button className="dropdown-item">
                <Settings size={16} />
                <span>Settings</span>
              </button>
              <div style={{ height: '1px', background: 'var(--clay-surface)', margin: '4px 0' }}></div>
              <button className="dropdown-item" style={{ color: 'var(--clay-danger)' }}>
                <LogOut size={16} />
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
