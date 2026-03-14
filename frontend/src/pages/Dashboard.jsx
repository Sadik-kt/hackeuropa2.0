import ReportsLedger from '../components/ReportsLedger'
import { supabase } from '../lib/supabaseClient'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const navigate = useNavigate()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  return (
    <div style={{ background: 'var(--bg-secondary)', minHeight: '100vh', paddingBottom: '60px' }}>
      {/* Header */}
      <nav style={{ 
        background: 'var(--bg-primary)', padding: '20px 32px', 
        borderBottom: '1px solid var(--border-subtle)', position: 'sticky', top: 0, zIndex: 100 
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: 'linear-gradient(135deg,#10b981,#f59e0b)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#030b07', fontSize: 14 }}>🛡️</div>
            <span style={{ fontWeight: 800, fontSize: 18, color: 'var(--text-primary)', fontFamily: "'Space Grotesk', sans-serif" }}>
              Admin<span style={{ color: 'var(--accent-primary)' }}>Dashboard</span>
            </span>
          </div>
          
          <button 
            onClick={handleLogout}
            style={{ 
              padding: '10px 20px', borderRadius: 100, border: '1px solid var(--border-subtle)', 
              background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', 
              fontSize: 14, fontWeight: 600, transition: 'all 0.2s'
            }}
            onMouseEnter={e => {
                e.target.style.borderColor = 'var(--accent-red)';
                e.target.style.color = 'var(--accent-red)';
            }}
            onMouseLeave={e => {
                e.target.style.borderColor = 'var(--border-subtle)';
                e.target.style.color = 'var(--text-muted)';
            }}
          >
            Sign Out
          </button>
        </div>
      </nav>

      {/* Stats Summary (Optional Placeholder) */}
      <div style={{ maxWidth: 1100, margin: '40px auto 0', padding: '0 32px' }}>
        <h1 className="font-display" style={{ fontSize: 32, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8 }}>Incident Ledger</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 32 }}>Official intake for verified community reports.</p>
      </div>

      {/* The Ledger Component */}
      <ReportsLedger isAdmin={true} />
    </div>
  )
}
