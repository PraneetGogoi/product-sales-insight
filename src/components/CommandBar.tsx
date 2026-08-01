export default function CommandBar() {
  return (
    <div className="command-bar">
      <div className="logo-area">
        <div className="logo-name">Nexus<span className="logo-dot">Pulse</span></div>
        <div className="logo-sub">Analytics Suite &middot; 2024</div>
      </div>
      <div className="search-wrap">
        <svg className="search-icon" width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="6" cy="6" r="4"/>
          <line x1="9.5" y1="9.5" x2="13" y2="13"/>
        </svg>
        <input className="search-inp" placeholder="Search..." />
      </div>
    </div>
  )
}
