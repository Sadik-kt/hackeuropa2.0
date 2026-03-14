import { useEffect, useRef, useState } from 'react'

const steps = [
  {
    num: '01', title: 'Submit Anonymously',
    desc: 'Fill in details about the suspicious activity — location picked from map, type, description, and optionally attach evidence. No personal data is ever collected.',
    icon: (<svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>),
    color: 'var(--accent-primary)', bg: 'rgba(37, 99, 235, 0.1)',
  },
  {
    num: '02', title: 'AI Verification',
    desc: 'Our AI engine analyzes each submission for spam, duplicate, or false reports. It checks credibility patterns and contextual signals before flagging it for approval.',
    icon: (<svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M12 2a10 10 0 110 20A10 10 0 0112 2z"/><path d="M12 6v6l4 2"/></svg>),
    color: 'var(--accent-secondary)', bg: 'rgba(79, 70, 229, 0.1)',
  },
  {
    num: '03', title: 'Blockchain Recording',
    desc: 'Verified reports are cryptographically hashed and written to an Ethereum smart contract, creating an immutable, tamper-proof record that no one can alter or delete.',
    icon: (<svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 3H8a1 1 0 00-1 1v3h10V4a1 1 0 00-1-1z"/></svg>),
    color: 'var(--accent-primary)', bg: 'rgba(37, 99, 235, 0.1)',
  },
  {
    num: '04', title: 'Authority Review',
    desc: 'Law enforcement accesses the verified, blockchain-backed report through a secure dashboard. They can identify patterns, corroborate intelligence, and take action.',
    icon: (<svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>),
    color: 'var(--accent-secondary)', bg: 'rgba(79, 70, 229, 0.1)',
  },
]

export default function HowItWorksSection() {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold: 0.15 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="how-it-works" style={{ padding: '100px 32px', background: 'transparent', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', width: 600, height: 600, borderRadius: '50%', background: 'rgba(37,99,235,0.04)', filter: 'blur(80px)', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative' }}>
        <div style={{ textAlign: 'center', marginBottom: 72 }}>
          <p className="badge badge-cyan" style={{ marginBottom: 16, display: 'inline-flex' }}>How It Works</p>
          <h2 className="font-display" style={{ fontSize: 'clamp(28px,4vw,48px)', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            From report to action.<br />
            <span className="gradient-text">Securely and transparently.</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: 16, fontSize: 17, maxWidth: 540, margin: '16px auto 0' }}>
            A four-step pipeline that protects your identity at every stage.
          </p>
        </div>

        <div ref={ref} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
          {steps.map((step, i) => (
            <div key={step.num} className="glass-card glass-card-hover" style={{
              padding: '36px 28px',
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(40px)',
              transition: `opacity 0.6s ease ${i * 0.12}s, transform 0.6s ease ${i * 0.12}s`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <div style={{ width: 50, height: 50, borderRadius: 14, background: step.bg, color: step.color, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${step.color}30` }}>
                  {step.icon}
                </div>
                <span className="font-display" style={{ fontSize: 40, fontWeight: 800, color: 'var(--bg-secondary)', letterSpacing: '-0.04em' }}>{step.num}</span>
              </div>
              <h3 className="font-display" style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>{step.title}</h3>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>{step.desc}</p>
              <div style={{ marginTop: 24, height: 3, borderRadius: 2, background: `linear-gradient(90deg, ${step.color}, transparent)`, opacity: 0.5 }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
