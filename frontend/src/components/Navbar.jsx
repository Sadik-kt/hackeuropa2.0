import { useState, useEffect } from 'react'

const ShieldIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    <path d="m9 12 2 2 4-4"/>
  </svg>
)


export default function Navbar({ onReportClick }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      transition: 'background 0.3s ease, border-color 0.3s ease',
      background: scrolled ? 'rgba(255,255,255,0.85)' : 'transparent',
      borderBottom: scrolled ? '1px solid var(--border-subtle)' : '1px solid transparent',
      backdropFilter: scrolled ? 'blur(16px)' : 'none',
      WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 70 }}>
        {/* Logo */}
        <a href="#" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10,
            background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', flexShrink: 0,
            boxShadow: '0 0 16px var(--glow-primary)'
          }}>
            <ShieldIcon />
          </div>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 20, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Anon<span style={{ color: 'var(--accent-primary)' }}>Sentra</span>
          </span>
        </a>

        {/* Desktop Nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          <a href="#how-it-works"
             style={{ color: 'var(--text-secondary)', fontSize: 14, fontWeight: 500, textDecoration: 'none', transition: 'color 0.2s' }}
             onMouseEnter={e => e.target.style.color = 'var(--accent-primary)'}
             onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}>
            How It Works
          </a>
          <button id="nav-report-btn" onClick={onReportClick} className="glow-btn"
            style={{
              background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
              color: '#ffffff', border: 'none', padding: '10px 22px',
              borderRadius: 100, fontWeight: 800, fontSize: 14,
              cursor: 'pointer', fontFamily: "'Inter', sans-serif", letterSpacing: '0.02em'
            }}>
            Report Anonymously
          </button>
        </div>
      </div>
    </nav>
  )
}
