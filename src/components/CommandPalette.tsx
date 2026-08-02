'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, LayoutDashboard, TrendingUp, DollarSign, Package, Map as MapIcon } from 'lucide-react'

export default function CommandPalette({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [search, setSearch] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      setSearch('')
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isOpen])

  // Handle escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const navCommands = [
    { name: 'Dashboard', icon: <LayoutDashboard size={16} />, action: () => router.push('/') },
    { name: 'Trends', icon: <TrendingUp size={16} />, action: () => router.push('/trends') },
    { name: 'Revenue', icon: <DollarSign size={16} />, action: () => router.push('/revenue') },
    { name: 'Products', icon: <Package size={16} />, action: () => router.push('/products') },
    { name: 'Cities', icon: <MapIcon size={16} />, action: () => router.push('/cities') },
  ]

  const filterCommands = [
    { name: 'Set Filter: All Time', action: () => handleFilter('All Time') },
    { name: 'Set Filter: Last Quarter', action: () => handleFilter('Last Quarter') },
    { name: 'Set Filter: Last Month', action: () => handleFilter('Last Month') },
    { name: 'Set Filter: Last Week', action: () => handleFilter('Last Week') },
  ]

  const handleFilter = (range: string) => {
    const newParams = new URLSearchParams(searchParams.toString())
    newParams.set('range', range)
    router.push(`?${newParams.toString()}`)
  }

  const query = search.toLowerCase().trim()
  
  const filteredNav = navCommands.filter(c => c.name.toLowerCase().includes(query))
  const filteredFilters = filterCommands.filter(c => c.name.toLowerCase().includes(query))
  
  const hasResults = filteredNav.length > 0 || filteredFilters.length > 0 || query.length > 0

  const handleExecute = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (filteredNav.length > 0) {
        filteredNav[0].action()
        onClose()
      } else if (filteredFilters.length > 0) {
        filteredFilters[0].action()
        onClose()
      } else if (query.length > 0) {
        // Fallback to global search
        router.push(`/products?q=${encodeURIComponent(query)}`)
        onClose()
      }
    }
  }

  return (
    <div 
      className="palette-backdrop"
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(4px)',
        zIndex: 999,
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        paddingTop: '10vh'
      }}
      onClick={onClose}
    >
      <div 
        className="clay-floating"
        style={{ width: '100%', maxWidth: '500px', overflow: 'hidden' }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ position: 'relative', borderBottom: '1px solid var(--clay-surface)' }}>
          <Search size={18} style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--clay-text-dim)' }} />
          <input
            ref={inputRef}
            placeholder="Type a command or search..."
            style={{
              width: '100%', padding: '16px 16px 16px 44px',
              background: 'transparent', border: 'none', outline: 'none',
              color: 'var(--clay-text)', fontSize: '16px',
              fontFamily: 'inherit'
            }}
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={handleExecute}
          />
        </div>
        
        <div style={{ maxHeight: '300px', overflowY: 'auto', padding: '8px 0' }}>
          {query.length > 0 && !hasResults && (
            <div style={{ padding: '16px', color: 'var(--clay-text-dim)', textAlign: 'center', fontSize: '14px' }}>
              No commands found. Press Enter to search products.
            </div>
          )}
          
          {filteredNav.length > 0 && (
            <div style={{ marginBottom: '8px' }}>
              <div style={{ padding: '4px 16px', fontSize: '11px', textTransform: 'uppercase', color: 'var(--clay-text-dim)', fontWeight: 800 }}>Navigation</div>
              {filteredNav.map(c => (
                <div 
                  key={c.name}
                  className="dropdown-item"
                  style={{ padding: '10px 16px', margin: '0 8px', width: 'calc(100% - 16px)' }}
                  onClick={() => { c.action(); onClose(); }}
                >
                  {c.icon}
                  <span>{c.name}</span>
                </div>
              ))}
            </div>
          )}

          {filteredFilters.length > 0 && (
            <div>
              <div style={{ padding: '4px 16px', fontSize: '11px', textTransform: 'uppercase', color: 'var(--clay-text-dim)', fontWeight: 800 }}>Filters</div>
              {filteredFilters.map(c => (
                <div 
                  key={c.name}
                  className="dropdown-item"
                  style={{ padding: '10px 16px', margin: '0 8px', width: 'calc(100% - 16px)' }}
                  onClick={() => { c.action(); onClose(); }}
                >
                  <span style={{ marginLeft: '28px' }}>{c.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
