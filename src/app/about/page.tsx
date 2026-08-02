import { Mail, Code2, Cpu, Layout } from 'lucide-react'

const GithubIcon = ({ size = 24 }: { size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
)

export default function AboutPage() {
  return (
    <>
      <div className="ph" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="pt">About NexusPulse</h1>
          <div className="ps">Portfolio Showcase & Architecture</div>
        </div>
      </div>

      <div className="scroll-container">
        <div className="charts-grid">
          {/* Main Info Card */}
          <div className="clay-raised chart-card" style={{ gridColumn: 'span 2' }}>
            <div className="chart-title" style={{ fontSize: '24px', marginBottom: '16px', color: 'var(--clay-accent)' }}>Project Overview</div>
            <div style={{ color: 'var(--clay-text)', fontSize: '16px', lineHeight: '1.6', marginBottom: '24px' }}>
              NexusPulse is a premium analytics dashboard showcasing a modern <strong>Claymorphic</strong> design language. 
              It combines soft, tactile 3D elements (double shadows, inner highlights, and organic rounded corners) with dark mode aesthetics to create a highly engaging, professional user interface.
            </div>
            
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <a href="https://github.com/PraneetGogoi/product-sales-insight" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: 'var(--clay-surface-pressed)', borderRadius: '99px', color: 'var(--clay-text)', textDecoration: 'none', fontWeight: 'bold', boxShadow: 'inset 4px 4px 10px var(--clay-shadow-dark), inset -2px -2px 6px var(--clay-shadow-light)' }}>
                <GithubIcon size={18} /> View on GitHub
              </a>
              <a href="mailto:praneetgogoi@example.com" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: 'var(--clay-surface-pressed)', borderRadius: '99px', color: 'var(--clay-text)', textDecoration: 'none', fontWeight: 'bold', boxShadow: 'inset 4px 4px 10px var(--clay-shadow-dark), inset -2px -2px 6px var(--clay-shadow-light)' }}>
                <Mail size={18} /> Contact Developer
              </a>
            </div>
          </div>

          {/* Tech Stack Cards */}
          <div className="clay-raised chart-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--clay-surface-pressed)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--clay-accent)' }}>
                <Layout size={20} />
              </div>
              <div className="chart-title" style={{ margin: 0 }}>Frontend</div>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: 'var(--clay-text-dim)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--clay-accent)' }}></div> Next.js 15 (App Router)</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--clay-accent)' }}></div> React 19 Server Components</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--clay-accent)' }}></div> Recharts (Custom SVG Shapes)</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--clay-accent)' }}></div> Vanilla CSS (Claymorphism System)</li>
            </ul>
          </div>

          <div className="clay-raised chart-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--clay-surface-pressed)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8b5cf6' }}>
                <Cpu size={20} />
              </div>
              <div className="chart-title" style={{ margin: 0 }}>Backend & Data</div>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: 'var(--clay-text-dim)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#8b5cf6' }}></div> Prisma ORM</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#8b5cf6' }}></div> SQLite Database</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#8b5cf6' }}></div> Next.js API Routes</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#8b5cf6' }}></div> Vercel Deployment</li>
            </ul>
          </div>

          {/* Architecture Notes */}
          <div className="clay-raised chart-card" style={{ gridColumn: 'span 2' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'var(--clay-surface-pressed)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#06b6d4' }}>
                <Code2 size={24} />
              </div>
              <div>
                <div className="chart-title" style={{ margin: 0 }}>Performance Architecture</div>
                <div className="chart-sub" style={{ margin: 0 }}>SEO and Core Web Vitals optimization</div>
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
              <div>
                <h3 style={{ color: 'var(--clay-text)', fontSize: '15px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: '#4ade80' }}>✓</span> Server Components First
                </h3>
                <p style={{ color: 'var(--clay-text-dim)', fontSize: '14px', lineHeight: '1.6' }}>
                  All data fetching is handled securely on the server using Next.js Server Components. This eliminates initial client-side network requests, prevents layout shift ("Loading..." flash), and significantly improves Time to First Byte (TTFB).
                </p>
              </div>
              
              <div>
                <h3 style={{ color: 'var(--clay-text)', fontSize: '15px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: '#4ade80' }}>✓</span> SEO & Social Previews
                </h3>
                <p style={{ color: 'var(--clay-text-dim)', fontSize: '14px', lineHeight: '1.6' }}>
                  The application is fully crawlable with generated OpenGraph images, semantic meta tags, and server-rendered HTML payloads, ensuring rich link previews on social platforms like Twitter and Slack.
                </p>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </>
  )
}
