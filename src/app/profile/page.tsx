'use client'

import { useState } from 'react'

export default function ProfilePage() {
  const [name, setName] = useState('Praneet Gogoi')
  const [email, setEmail] = useState('praneet.gogoi@example.com')
  const [password, setPassword] = useState('********')

  return (
    <>
      <div className="ph" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="pt">Profile</h1>
        </div>
      </div>

      <div className="scroll-container">
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* Identity Card (Hero) */}
          <div className="clay-floating" style={{ padding: '48px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ 
              width: '100px', 
              height: '100px', 
              borderRadius: '50%', 
              background: 'var(--clay-surface-raised)', 
              boxShadow: '-6px -6px 14px var(--clay-shadow-light), 10px 10px 24px var(--clay-shadow-dark)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              color: 'var(--clay-accent)', 
              fontWeight: 800, 
              fontSize: '48px', 
              marginBottom: '24px' 
            }}>
              P
            </div>
            <h2 style={{ fontSize: '32px', marginBottom: '8px', fontWeight: 'bold' }}>{name}</h2>
            <div style={{ fontSize: '18px', color: 'var(--clay-text-dim)', marginBottom: '8px' }}>Product Manager</div>
            <div style={{ fontSize: '14px', color: 'var(--clay-accent)', background: 'var(--clay-surface-pressed)', padding: '6px 16px', borderRadius: '16px', boxShadow: 'inset 2px 2px 4px var(--clay-shadow-dark)' }}>
              Member since Jan 2024
            </div>
          </div>

          {/* Editable Account Details */}
          <div className="clay-raised" style={{ padding: '32px', borderRadius: '16px', background: 'var(--clay-surface)' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '8px' }}>Account Details</h2>
            <div style={{ color: 'var(--clay-text-dim)', marginBottom: '32px' }}>Update your personal information</div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>Full Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  className="input-clay"
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>Email Address</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  className="input-clay"
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>Password</label>
                <input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  className="input-clay"
                />
              </div>
            </div>
          </div>

          {/* Activity Summary */}
          <div className="clay-raised" style={{ padding: '32px', borderRadius: '16px', background: 'var(--clay-surface)' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '8px' }}>Activity Summary</h2>
            <div style={{ color: 'var(--clay-text-dim)', marginBottom: '24px' }}>Your recent engagement</div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div style={{ padding: '24px', background: 'var(--clay-surface-pressed)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.02)', textAlign: 'center' }}>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--clay-accent)', marginBottom: '8px' }}>14</div>
                <div style={{ fontSize: '14px', color: 'var(--clay-text-dim)' }}>Dashboard views this month</div>
              </div>
              <div style={{ padding: '24px', background: 'var(--clay-surface-pressed)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.02)', textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--clay-text)', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '38px' }}>Today<br/>9:15 AM</div>
                <div style={{ fontSize: '14px', color: 'var(--clay-text-dim)' }}>Last login</div>
              </div>
            </div>
          </div>

          {/* Sign Out Action */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
            <button className="clay-raised" style={{ 
              padding: '12px 32px', 
              borderRadius: '24px', 
              background: 'var(--clay-surface-raised)', 
              color: 'var(--clay-danger)', 
              fontWeight: 'bold', 
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}>
              Sign Out
            </button>
          </div>

        </div>
      </div>
    </>
  )
}
