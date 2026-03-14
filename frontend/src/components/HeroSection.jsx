import { useEffect, useRef } from 'react'

const HeroShield = () => (
  <svg width="120" height="120" viewBox="0 0 100 100" fill="none">
    <defs>
      <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="var(--accent-primary)" />
        <stop offset="100%" stopColor="var(--accent-secondary)" />
      </linearGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
        <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
    <path d="M50 8 L88 22 L88 52 C88 72 70 88 50 95 C30 88 12 72 12 52 L12 22 Z"
      fill="url(#shieldGrad)" opacity="0.15" filter="url(#glow)"/>
    <path d="M50 8 L88 22 L88 52 C88 72 70 88 50 95 C30 88 12 72 12 52 L12 22 Z"
      stroke="url(#shieldGrad)" strokeWidth="2" fill="none" filter="url(#glow)"/>
    <path d="M36 50 L46 60 L66 40" stroke="var(--accent-primary)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" filter="url(#glow)"/>
    <circle cx="50" cy="46" r="6" stroke="var(--accent-secondary)" strokeWidth="2" fill="none" opacity="0.6"/>
    <rect x="44" y="50" width="12" height="9" rx="2" fill="rgba(79,70,229,0.3)" stroke="var(--accent-secondary)" strokeWidth="1.5" opacity="0.7"/>
  </svg>
)

const FloatingOrb = ({ style }) => (
  <div style={{ position: 'absolute', borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none', ...style }} />
)

export default function HeroSection({ onReportClick }) {
  const badgeRef = useRef(null)
  const h1Ref = useRef(null)
  const subRef = useRef(null)
  const ctaRef = useRef(null)

  useEffect(() => {
    const els = [badgeRef, h1Ref, subRef, ctaRef]
    els.forEach((ref, i) => {
      if (ref.current) {
        ref.current.style.opacity = '0'
        ref.current.style.transform = 'translateY(24px)'
        setTimeout(() => {
          if (ref.current) {
            ref.current.style.transition = 'opacity 0.7s ease, transform 0.7s ease'
            ref.current.style.opacity = '1'
            ref.current.style.transform = 'translateY(0)'
          }
        }, 100 + i * 150)
      }
    })
  }, [])

  return (
    <section id="home" style={{
      position: 'relative', minHeight: '100svh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: '120px 32px 80px', overflow: 'hidden',
      background: 'transparent'
    }}>
      <div className="bg-grid" style={{ position: 'absolute', inset: 0, opacity: 0.6 }} />
      <FloatingOrb style={{ width: 500, height: 500, background: 'rgba(239,68,68,0.03)', top: '-10%', left: '-10%' }} />
      <FloatingOrb style={{ width: 400, height: 400, background: 'rgba(153,27,27,0.02)', bottom: '-5%', right: '-5%' }} />
      <FloatingOrb style={{ width: 300, height: 300, background: 'rgba(244,63,94,0.02)', top: '40%', right: '10%' }} />

      <div style={{ maxWidth: 860, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
        <div className="animate-float" style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
          <HeroShield />
        </div>

        <div ref={badgeRef} className="badge badge-cyan" style={{ marginBottom: 24, display: 'inline-flex' }}>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor"><circle cx="5" cy="5" r="5"/></svg>
          Blockchain-Secured · AI-Verified · 100% Anonymous
        </div>

        <h1 ref={h1Ref} className="font-display" style={{
          fontSize: 'clamp(36px, 6vw, 72px)', fontWeight: 800,
          lineHeight: 1.08, letterSpacing: '-0.03em',
          color: 'var(--text-primary)', marginBottom: 28
        }}>
          Report Drug Activity.<br />
          <span className="gradient-text">Stay Anonymous.</span><br />
          Stay Safe.
        </h1>

        <p ref={subRef} style={{
          fontSize: 'clamp(16px, 2vw, 20px)', color: 'var(--text-secondary)',
          lineHeight: 1.7, maxWidth: 620, margin: '0 auto 48px'
        }}>
          Submit reports securely through our platform. Every submission is screened by AI to filter spam and false reports, then permanently recorded on a tamper-proof blockchain ledger.
        </p>

        <div ref={ctaRef} style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button id="hero-report-btn" onClick={onReportClick} className="glow-btn"
            style={{
              background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)',
              color: '#ffffff', border: 'none', padding: '16px 36px',
              borderRadius: 100, fontWeight: 800, fontSize: 16,
              cursor: 'pointer', fontFamily: "'Inter', sans-serif",
              display: 'flex', alignItems: 'center', gap: 10
            }}>
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
            </svg>
            Submit a Report
          </button>
        </div>

        <div style={{ display: 'flex', gap: 32, justifyContent: 'center', marginTop: 64, flexWrap: 'wrap' }}>
          {[
            { icon: '🔒', text: 'Zero Identity Data Stored' },
            { icon: '⛓️', text: 'Ethereum Blockchain' },
            { icon: '🤖', text: 'AI Spam Filter' },
          ].map(item => (
            <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', fontSize: 13 }}>
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              {item.text}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
