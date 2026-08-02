'use client'
import { useState, useRef, useEffect } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import Link from 'next/link'
import { Search, Bell, Menu, User, Settings, LogOut, TrendingDown, ChevronDown, Check } from 'lucide-react'
import CommandPalette from './CommandPalette'

export default function CommandBar() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentRange = searchParams.get('range') || 'All Time'

  const [showNotifications, setShowNotifications] = useState(false)
  const [showAvatarMenu, setShowAvatarMenu] = useState(false)
  const [showTabletFilter, setShowTabletFilter] = useState(false)
  const [showCommandPalette, setShowCommandPalette] = useState(false)
  const [hasUnread, setHasUnread] = useState(true)
  const [overviewData, setOverviewData] = useState<any>(null)

  const notifRef = useRef<HTMLDivElement>(null)
  const avatarRef = useRef<HTMLDivElement>(null)
  const filterRef = useRef<HTMLDivElement>(null)

  const pageName = pathname === '/' ? 'Dashboard' : pathname.split('/')[1]
  const formattedPageName = pageName ? pageName.charAt(0).toUpperCase() + pageName.slice(1) : ''

  useEffect(() => {
    fetch('/api/overview')
      .then(res => res.json())
      .then(data => setOverviewData(data))
      .catch(() => {})
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
      if (avatarRef.current && !avatarRef.current.contains(event.target as Node)) {
        setShowAvatarMenu(false)
      }
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setShowTabletFilter(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setShowCommandPalette(true)
      }
    }
    window.addEventListener('keydown', handleGlobalKeyDown)
    return () => window.removeEventListener('keydown', handleGlobalKeyDown)
  }, [])

  const handleRangeChange = (t: string) => {
    const newParams = new URLSearchParams(searchParams.toString())
    newParams.set('range', t)
    router.push(`?${newParams.toString()}`)
    setShowTabletFilter(false)
  }

  const handleOpenNotifications = () => {
    setShowNotifications(!showNotifications)
    if (!showNotifications) setHasUnread(false)
  }

  const ranges = ['All Time', 'Last Quarter', 'Last Month', 'Last Week']

  return (
    <>
      <div className="command-bar">
        <div className="logo-area">
          <Menu size={24} style={{marginRight: '8px', cursor: 'pointer', opacity: 0.8}} />
          <div className="logo-name">NexusPulse<span className="logo-dot" style={{ color: 'var(--clay-accent)' }}>.</span></div>
          {formattedPageName && (
            <div className="logo-sub desktop-only">{formattedPageName}</div>
          )}
        </div>
        
        {/* Desktop inline pills */}
        <div className="fr desktop-filter" style={{ marginBottom: 0 }}>
          {ranges.map(t => (
            <button 
              key={t}
              className={`pill ${currentRange === t ? 'active' : ''}`}
              onClick={() => handleRangeChange(t)}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Tablet Dropdown Filter */}
        <div className="tablet-filter" style={{ position: 'relative' }} ref={filterRef}>
          <button 
            className="pill active" 
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            onClick={() => setShowTabletFilter(!showTabletFilter)}
          >
            {currentRange} <ChevronDown size={14} />
          </button>
          
          {showTabletFilter && (
            <div className="dropdown-menu" style={{ left: '50%', right: 'auto', transform: 'translateX(-50%)' }}>
              {ranges.map(t => (
                <button 
                  key={t}
                  className="dropdown-item"
                  onClick={() => handleRangeChange(t)}
                >
                  <span style={{ width: '16px' }}>{currentRange === t && <Check size={14} style={{ color: 'var(--clay-accent)' }} />}</span>
                  <span>{t}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="top-actions">
          <div className="live-indicator desktop-only" title="Synced just now" style={{ marginRight: '8px' }}></div>
          
          <div className="search-wrap" onClick={() => setShowCommandPalette(true)}>
            <Search className="search-icon" size={14} strokeWidth={2} />
            <input 
              className="search-inp" 
              placeholder="Search (Cmd+K)" 
              readOnly
              style={{ cursor: 'pointer' }}
            />
          </div>
          
          <div className="notification-wrap" ref={notifRef} style={{ position: 'relative' }}>
            <div 
              className="avatar"
              onClick={handleOpenNotifications}
              style={{ color: 'var(--clay-text-dim)', background: showNotifications ? 'var(--clay-surface-pressed)' : 'var(--clay-surface-raised)', boxShadow: showNotifications ? 'inset 3px 3px 6px var(--clay-shadow-dark), inset -2px -2px 6px var(--clay-shadow-light)' : '' }}
            >
              <Bell size={18} strokeWidth={2.5} />
              {hasUnread && <div style={{ position: 'absolute', top: '8px', right: '8px', width: '6px', height: '6px', background: 'var(--clay-danger)', borderRadius: '50%', boxShadow: '0 0 8px var(--clay-danger)' }}></div>}
            </div>
            
            {showNotifications && (
              <div className="dropdown-menu">
                <div style={{ padding: '8px 12px', fontSize: '11px', textTransform: 'uppercase', color: 'var(--clay-text-dim)', letterSpacing: '0.05em', fontWeight: 800 }}>Alerts</div>
                <button className="dropdown-item">
                  <TrendingDown size={16} style={{ color: 'var(--clay-danger)', flexShrink: 0 }} />
                  <span>Avg. Order Value {overviewData?.kpis?.price_change || 'down 0.3%'} — worth a look</span>
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
                <Link href="/profile" className="dropdown-item" style={{ textDecoration: 'none' }} onClick={() => setShowAvatarMenu(false)}>
                  <User size={16} />
                  <span>Profile</span>
                </Link>
                <Link href="/settings" className="dropdown-item" style={{ textDecoration: 'none' }} onClick={() => setShowAvatarMenu(false)}>
                  <Settings size={16} />
                  <span>Settings</span>
                </Link>
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
      
      {/* Mobile filter strip */}
      <div className="mobile-filter-strip">
        {ranges.map(t => (
          <button 
            key={t}
            className={`pill ${currentRange === t ? 'active' : ''}`}
            onClick={() => handleRangeChange(t)}
            style={{ flexShrink: 0, padding: '6px 16px', fontSize: '12px' }}
          >
            {t}
          </button>
        ))}
      </div>

      <CommandPalette isOpen={showCommandPalette} onClose={() => setShowCommandPalette(false)} />
    </>
  )
}
