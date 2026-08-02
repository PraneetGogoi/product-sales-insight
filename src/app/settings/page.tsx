'use client'

import { useState } from 'react'

export default function SettingsPage() {
  const [theme, setTheme] = useState('dark')
  const [notifications, setNotifications] = useState(true)
  const [weeklyReport, setWeeklyReport] = useState(true)

  return (
    <>
      <div className="ph" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="pt">Settings</h1>
        </div>
      </div>

      <div className="scroll-container">
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          <div className="clay-raised" style={{ padding: '32px', borderRadius: '16px', background: 'var(--clay-surface)' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '8px' }}>Preferences</h2>
            <div style={{ color: 'var(--clay-text-dim)', marginBottom: '24px' }}>Manage your workspace settings</div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <div>
                <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Theme Appearance</div>
                <div style={{ fontSize: '14px', color: 'var(--clay-text-dim)' }}>Select your preferred interface theme. Dark Clay is currently enforced.</div>
              </div>
              <select 
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                style={{ background: 'var(--clay-surface-pressed)', border: 'none', color: 'var(--clay-text)', padding: '10px 16px', borderRadius: '8px', outline: 'none' }}
              >
                <option value="dark">Dark Clay (Default)</option>
                <option value="light" disabled>Light Clay (Coming Soon)</option>
              </select>
            </div>
          </div>

          <div className="clay-raised" style={{ padding: '32px', borderRadius: '16px', background: 'var(--clay-surface)' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '8px' }}>Notifications</h2>
            <div style={{ color: 'var(--clay-text-dim)', marginBottom: '24px' }}>Configure what alerts you receive</div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <div>
                <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Real-time Alerts</div>
                <div style={{ fontSize: '14px', color: 'var(--clay-text-dim)' }}>Show the red dot in the command bar for critical anomalies.</div>
              </div>
              <button 
                onClick={() => setNotifications(!notifications)}
                style={{ 
                  width: '44px', height: '24px', borderRadius: '12px', border: 'none', 
                  background: notifications ? 'var(--clay-accent)' : 'var(--clay-surface-pressed)', 
                  position: 'relative', cursor: 'pointer', transition: 'background 0.2s'
                }}
              >
                <div style={{ 
                  position: 'absolute', top: '2px', left: notifications ? '22px' : '2px', 
                  width: '20px', height: '20px', borderRadius: '10px', background: '#fff', 
                  transition: 'left 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}></div>
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0' }}>
              <div>
                <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Weekly Digest</div>
                <div style={{ fontSize: '14px', color: 'var(--clay-text-dim)' }}>Receive a summary of trends and top products every Monday.</div>
              </div>
              <button 
                onClick={() => setWeeklyReport(!weeklyReport)}
                style={{ 
                  width: '44px', height: '24px', borderRadius: '12px', border: 'none', 
                  background: weeklyReport ? 'var(--clay-accent)' : 'var(--clay-surface-pressed)', 
                  position: 'relative', cursor: 'pointer', transition: 'background 0.2s'
                }}
              >
                <div style={{ 
                  position: 'absolute', top: '2px', left: weeklyReport ? '22px' : '2px', 
                  width: '20px', height: '20px', borderRadius: '10px', background: '#fff', 
                  transition: 'left 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}></div>
              </button>
            </div>
          </div>

          <div className="clay-raised" style={{ padding: '32px', borderRadius: '16px', background: 'var(--clay-surface)' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '8px' }}>Data Connection</h2>
            <div style={{ color: 'var(--clay-text-dim)', marginBottom: '24px' }}>Database and API integration status</div>
            
            <div style={{ padding: '16px', background: 'var(--clay-surface-pressed)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.02)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--clay-accent)', boxShadow: '0 0 8px var(--clay-accent)' }}></div>
                <div style={{ fontWeight: 'bold' }}>SQLite Database Connected</div>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--clay-text-dim)', fontFamily: 'var(--font-space-mono)' }}>
                prisma://file:./dev.db
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}
