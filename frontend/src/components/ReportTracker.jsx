import { useState } from 'react'

const MOCK_REPORTS = {
  'ANS-4821': {
    id: 'ANS-4821',
    type: 'Drug Sale/Distribution',
    location: 'Central Park Ave, Block 7',
    submitted: '2026-03-10 14:32',
    status: 'action_taken',
    txHash: '0x8f3da2c1b4e9f7a025d6c3894f12b8e5a1d7c9f0',
    timeline: [
      { label: 'Submitted Anonymously', time: '2026-03-10 14:32', done: true },
      { label: 'AI Verification Passed', time: '2026-03-10 14:33', done: true },
      { label: 'Blockchain Recorded', time: '2026-03-10 14:34', done: true },
      { label: 'Authority Notified', time: '2026-03-10 15:10', done: true },
      { label: 'Action Taken', time: '2026-03-11 09:45', done: true },
    ],
  },
  'ANS-7340': {
    id: 'ANS-7340',
    type: 'Suspected Drug Den',
    location: 'Elm Street Warehouse District',
    submitted: '2026-03-12 08:15',
    status: 'under_investigation',
    txHash: '0x3c7f9a4e8d2b1f560847c9a3e4718d2f9b5c6e1a',
    timeline: [
      { label: 'Submitted Anonymously', time: '2026-03-12 08:15', done: true },
      { label: 'AI Verification Passed', time: '2026-03-12 08:16', done: true },
      { label: 'Blockchain Recorded', time: '2026-03-12 08:17', done: true },
      { label: 'Authority Notified', time: '2026-03-12 09:00', done: true },
      { label: 'Action Taken', time: 'Pending', done: false },
    ],
  },
  'ANS-9901': {
    id: 'ANS-9901',
    type: 'Public Drug Use',
    location: 'Metro Station North Exit',
    submitted: '2026-03-13 22:55',
    status: 'verified',
    txHash: '0xd5e2a7f413c9b84760f2c1d9e3b5a8f247910c6d',
    timeline: [
      { label: 'Submitted Anonymously', time: '2026-03-13 22:55', done: true },
      { label: 'AI Verification Passed', time: '2026-03-13 22:56', done: true },
      { label: 'Blockchain Recorded', time: '2026-03-13 22:56', done: true },
      { label: 'Authority Notified', time: 'Pending', done: false },
      { label: 'Action Taken', time: 'Pending', done: false },
    ],
  },
}

const STATUS_CONFIG = {
  verified:          { badge: 'badge-cyan',   icon: '🔷', label: 'Verified' },
  under_investigation: { badge: 'badge-amber',  icon: '🔍', label: 'Under Investigation' },
  action_taken:      { badge: 'badge-green',  icon: '✅', label: 'Action Taken' },
}

export default function ReportTracker() {
  const [query, setQuery] = useState('')
  const [report, setReport] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSearch = () => {
    if (!query.trim()) return
    setLoading(true)
    setError(null)
    setReport(null)
    setTimeout(() => {
      const found = MOCK_REPORTS[query.trim().toUpperCase()]
      setLoading(false)
      if (found) setReport(found)
      else setError(`No report found for ID: "${query}". Try ANS-4821, ANS-7340, or ANS-9901`)
    }, 1000)
  }

  const cfg = report ? STATUS_CONFIG[report.status] : null

  return (
    <section id="track" style={{ padding: '100px 32px', background: 'var(--bg-secondary)' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <p className="badge badge-cyan" style={{ marginBottom: 16, display: 'inline-flex' }}>Track Report</p>
          <h2 className="font-display" style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Track your submission
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: 12, fontSize: 16 }}>
            Enter the tracking ID you received after submitting your report.
          </p>
        </div>

        {/* Search */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 32 }}>
          <input
            id="tracker-input"
            className="form-input"
            placeholder="e.g. ANS-4821"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            style={{ fontSize: 16, letterSpacing: '0.04em' }}
          />
          <button
            id="tracker-search-btn"
            onClick={handleSearch}
            className="glow-btn"
            style={{
              background: 'linear-gradient(135deg,#38bdf8,#6366f1)',
              color: '#fff', border: 'none', padding: '14px 28px',
              borderRadius: 12, fontWeight: 700, fontSize: 15, cursor: 'pointer',
              fontFamily: "'Inter',sans-serif", whiteSpace: 'nowrap', flexShrink: 0
            }}>
            Search
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div style={{ width: 40, height: 40, border: '3px solid rgba(56,189,248,0.15)', borderTopColor: '#38bdf8', borderRadius: '50%', margin: '0 auto 16px', animation: 'spin-slow 0.8s linear infinite' }} />
            <style>{`@keyframes spin-slow{to{transform:rotate(360deg)}}`}</style>
            <div style={{ color: 'var(--text-muted)', fontSize: 14 }}>Querying blockchain…</div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="glass-card" style={{ padding: '20px 24px', border: '1px solid rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.06)' }}>
            <div style={{ color: '#ef4444', fontWeight: 600, marginBottom: 4 }}>⚠️ Not Found</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{error}</div>
          </div>
        )}

        {/* Result card */}
        {report && cfg && (
          <div className="glass-card animate-fade-in-up" style={{ padding: '32px', border: '1px solid rgba(56,189,248,0.15)' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
              <div>
                <div className="font-display" style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>
                  {report.id}
                </div>
                <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{report.type}</div>
              </div>
              <div className={`badge ${cfg.badge}`}>{cfg.icon} {cfg.label}</div>
            </div>

            {/* Details */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 28 }}>
              {[
                { label: '📍 Location', val: report.location },
                { label: '🕐 Submitted', val: report.submitted },
              ].map(r => (
                <div key={r.label} className="glass-card" style={{ padding: '14px 16px', borderRadius: 12 }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>{r.label}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{r.val}</div>
                </div>
              ))}
            </div>

            {/* TX Hash */}
            <div style={{ marginBottom: 28, padding: '12px 16px', background: 'rgba(56,189,248,0.05)', borderRadius: 10, border: '1px solid rgba(56,189,248,0.12)' }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>⛓️ Blockchain TX Hash</div>
              <div style={{ fontSize: 12, color: '#38bdf8', fontFamily: 'monospace', wordBreak: 'break-all' }}>{report.txHash}</div>
            </div>

            {/* Timeline */}
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Timeline</div>
              {report.timeline.map((step, i) => (
                <div key={i} style={{ display: 'flex', gap: 16, marginBottom: i < report.timeline.length - 1 ? 0 : 0 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700,
                      background: step.done ? 'linear-gradient(135deg,#38bdf8,#6366f1)' : 'rgba(255,255,255,0.05)',
                      color: step.done ? '#fff' : 'var(--text-muted)',
                      border: step.done ? 'none' : '2px solid rgba(255,255,255,0.1)',
                      transition: 'all 0.3s'
                    }}>
                      {step.done ? '✓' : i + 1}
                    </div>
                    {i < report.timeline.length - 1 && (
                      <div style={{ width: 2, flexGrow: 1, minHeight: 24, background: step.done ? 'rgba(56,189,248,0.3)' : 'rgba(255,255,255,0.05)', margin: '4px 0' }} />
                    )}
                  </div>
                  <div style={{ paddingBottom: i < report.timeline.length - 1 ? 20 : 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: step.done ? 'var(--text-primary)' : 'var(--text-muted)', marginBottom: 2 }}>
                      {step.label}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{step.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Demo hint */}
        {!report && !error && !loading && (
          <div style={{ textAlign: 'center', marginTop: 12 }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Try demo IDs: </span>
            {['ANS-4821', 'ANS-7340', 'ANS-9901'].map(id => (
              <button key={id} onClick={() => { setQuery(id) }}
                style={{ background: 'none', border: '1px solid rgba(255,255,255,0.07)', color: '#38bdf8', padding: '3px 10px', borderRadius: 100, cursor: 'pointer', fontFamily: "'Inter',sans-serif", fontSize: 12, marginLeft: 8, transition: 'border-color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(56,189,248,0.4)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'}
              >{id}</button>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
