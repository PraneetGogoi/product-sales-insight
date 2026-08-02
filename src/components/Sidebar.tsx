'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, CircleDollarSign, Package, Map, TrendingUp, Settings, ChevronLeft, UserCircle2 } from 'lucide-react'

export default function Sidebar() {
  const pathname = usePathname()

  const navItems = [
    { name: 'Overview', icon: LayoutDashboard, path: '/' },
    { name: 'Revenue', icon: CircleDollarSign, path: '/revenue' },
    { name: 'Products', icon: Package, path: '/products' },
    { name: 'Cities', icon: Map, path: '/cities' },
    { name: 'Trends', icon: TrendingUp, path: '/trends' },
    { name: 'About', icon: UserCircle2, path: '/about' }
  ]

  return (
    <div className="sidebar">
      {navItems.map(item => {
        const Icon = item.icon
        const isActive = pathname === item.path
        
        return (
          <Link 
            href={item.path}
            key={item.name}
            className={`sidebar-item ${isActive ? 'active' : ''}`}
            data-tooltip={item.name}
          >
            <Icon size={22} style={{opacity: isActive ? 1 : 0.6}} strokeWidth={2.5} />
          </Link>
        )
      })}
      
      <div style={{ flex: 1 }}></div>

      <Link 
        href="/settings"
        className={`sidebar-item ${pathname === '/settings' ? 'active' : ''}`}
        data-tooltip="Settings"
      >
        <Settings size={22} style={{opacity: pathname === '/settings' ? 1 : 0.6}} strokeWidth={2.5} />
      </Link>

      <div 
        className="sidebar-item" 
        data-tooltip="Collapse"
        style={{ marginTop: '8px' }}
      >
        <ChevronLeft size={22} style={{ opacity: 0.6 }} strokeWidth={2.5} />
      </div>
    </div>
  )
}
