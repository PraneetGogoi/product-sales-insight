'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, CircleDollarSign, Package, Map, TrendingUp, Settings } from 'lucide-react'

export default function Sidebar() {
  const pathname = usePathname()

  const navItems = [
    { name: 'Overview', icon: LayoutDashboard, path: '/' },
    { name: 'Revenue', icon: CircleDollarSign, path: '/revenue' },
    { name: 'Products', icon: Package, path: '/products' },
    { name: 'Cities', icon: Map, path: '/cities' },
    { name: 'Trends', icon: TrendingUp, path: '/trends' },
    { name: 'Settings', icon: Settings, path: '/settings' }
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
            title={item.name}
          >
            <Icon size={22} style={{opacity: isActive ? 1 : 0.6}} strokeWidth={2.5} />
          </Link>
        )
      })}
    </div>
  )
}
