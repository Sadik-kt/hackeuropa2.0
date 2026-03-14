export default function Footer({ onAdminClick }) {
  return (
    <footer style={{ background: 'transparent', borderTop: '1px solid var(--border-subtle)', padding: '64px 32px 40px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        {/* Top row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 40, marginBottom: 56 }}>
          {/* Brand */}
          <div style={{ maxWidth: 320 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{ width: 34, height: 34, borderRadius: 9, background: 'linear-gradient(135deg,var(--accent-primary),var(--accent-secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 16 }}>🛡️</div>
              <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 18, color: 'var(--text-primary)' }}>
                Anon<span style={{ color: 'var(--accent-primary)' }}>Sentra</span>
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.7 }}>
              Empowering communities to fight drug crime safely and anonymously — through blockchain immutability and AI verification.
            </p>
            {/* Tech badges */}
            <div style={{ display: 'flex', gap: 8, marginTop: 20, flexWrap: 'wrap' }}>
              <span className="badge badge-cyan">⛓️ Ethereum</span>
              <span className="badge badge-amber">🤖 AI-Verified</span>
              <span className="badge badge-green">🔒 Zero-PII</span>
            </div>
          </div>

          {/* Links */}
          <div style={{ display: 'flex', gap: 60, flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>Platform</div>
              {['How It Works', 'Submit Report', 'FAQ'].map(link => (
                <div key={link} style={{ marginBottom: 10 }}>
                  <a href="#" style={{ color: 'var(--text-secondary)', fontSize: 14, textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.target.style.color = 'var(--accent-primary)'}
                    onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}>{link}</a>
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>Legal</div>
              {['Privacy Policy', 'Terms of Use', 'Data Handling', 'Contact'].map(link => (
                <div key={link} style={{ marginBottom: 10 }}>
                  <a href="#" style={{ color: 'var(--text-secondary)', fontSize: 14, textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.target.style.color = 'var(--accent-primary)'}
                    onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}>{link}</a>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: 'var(--border-subtle)', marginBottom: 28 }} />

        {/* Bottom row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ color: 'var(--text-muted)', fontSize: 13, display: 'flex', gap: 16 }}>
            <span>© 2026 AnonSentra</span>
            <button 
              onClick={onAdminClick}
              style={{ background: 'transparent', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer', fontSize: 13, padding: 0 }}
            >
              Admin Portal
            </button>
          </div>
          <div style={{ color: 'var(--text-muted)', fontSize: 13, display: 'flex', gap: 6, alignItems: 'center' }}>
            <span>All reports are encrypted end-to-end</span>
            <span style={{ color: 'var(--accent-primary)' }}>🔐</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
