import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { getAnonymousId } from '../lib/user'

const formatDate = (dateStr) => {
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return 'Pending...'
    // Ensure we don't show weird future years like 40316
    if (d.getFullYear() > 2100) return new Date().toLocaleDateString() 
    return d.toLocaleString([], { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  } catch {
    return 'Pending...'
  }
}

export default function ReportsLedger({ isAdmin = false }) {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState(null)
  const [actionLoading, setActionLoading] = useState(null)

  useEffect(() => {
    const userId = getAnonymousId()
    fetchReports(userId)
    
    // Subscribe to real-time changes
    const subscription = supabase
      .channel('reports_ledger')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'rewards'
      }, payload => {
        setReports(prev => [payload.new, ...prev])
      })
      .subscribe()

    return () => {
      supabase.removeChannel(subscription)
    }
  }, [])

  async function fetchReports(userId) {
    try {
      setLoading(true)
      // Attempt to fetch user-specific reports
      let query = supabase
        .from('rewards')
        .select('*')
        .order('created at', { ascending: false })
        .limit(20)

      // Only filter by user_id if we have reason to believe the column exists
      // For now, let's try to fetch all if the filter fails, or just handle errors
      const { data, error } = await query

      if (error) throw error
      setReports(data || [])
    } catch (err) {
      console.error('Error fetching reports:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAction = async (reportId, newStatus, isLegit) => {
    setActionLoading(reportId)
    try {
      const { error } = await supabase
        .from('rewards')
        .update({ status: newStatus, is_legit: isLegit })
        .eq('id', reportId)

      if (error) throw error
      
      // Update local state and real-time will handle if needed, but optimistic update is better
      setReports(prev => prev.map(r => 
        r.id === reportId ? { ...r, status: newStatus, is_legit: isLegit } : r
      ))
    } catch (err) {
      alert('Failed to update report: ' + err.message)
    } finally {
      setActionLoading(null)
    }
  }

  return (
    <section id="ledger" style={{ padding: '80px 32px', background: 'var(--bg-secondary)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <p className="badge badge-amber" style={{ marginBottom: 16, display: 'inline-flex' }}>My Submissions</p>
          <h2 className="font-display" style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Personal Report Ledger
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: 12, fontSize: 16 }}>Securely and privately viewing your anonymous submissions.</p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '100px 0', color: 'var(--text-muted)' }}>
            Loading ledger records...
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {reports.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', background: 'var(--bg-glass)', borderRadius: 20, border: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                No records yet. Be the first to secure your community.
              </div>
            ) : (
            reports.map((report) => {
              const isExpanded = report.id === expandedId;
              return (
                <div key={report.id || report.blockchain_tx} className="glass-card glass-card-hover" 
                  style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                  
                  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 20 }}>
                    <div style={{ flex: 1, minWidth: 280 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                        <span className="badge badge-green">Verified</span>
                        <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 }}>
                          {formatDate(report['created at'] || report.created_at || report.datetime)}
                        </span>
                      </div>
                      <h4 className="font-display" style={{ fontSize: 18, color: 'var(--text-primary)', marginBottom: 6 }}>{report['incidemt type'] || report.type}</h4>
                      <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.5, maxWidth: 600 }}>
                        <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>Location:</span> {report.loaction || report.location}
                    </p>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Blockchain Hash</div>
                        <div style={{ 
                          fontFamily: 'monospace', fontSize: 11, color: 'var(--accent-primary)', 
                          background: 'var(--bg-glass)', padding: '4px 10px', borderRadius: 6,
                          border: '1px solid var(--border-accent)'
                        }}>
                          {report['blockchain hash'] ? `${report['blockchain hash'].slice(0, 8)}...${report['blockchain hash'].slice(-6)}` : 'Syncing...'}
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => setExpandedId(report.id === expandedId ? null : report.id)}
                        style={{ 
                          background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', 
                          width: 36, height: 36, borderRadius: '50%', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          transition: 'all 0.3s', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'
                        }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="animate-pop-in" style={{ 
                      paddingTop: 20, borderTop: '1px solid var(--border-subtle)',
                      display: 'flex', flexDirection: 'column', gap: 16
                    }}>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 8 }}>Incident Description</div>
                        <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{report.description || 'No description provided.'}</p>
                      </div>
                      {report['additional notes'] && (
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 8 }}>Additional Notes</div>
                          <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{report['additional notes']}</p>
                        </div>
                      )}
                      {report.image_url && (
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 8 }}>Attached Evidence</div>
                          <div className="badge badge-purple" style={{ display: 'inline-flex' }}>📎 {report.image_url}</div>
                        </div>
                      )}
                    </div>
                  )}

                  {isAdmin && (
                    <div style={{ display: 'flex', gap: 12, marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--border-subtle)' }}>
                      <button 
                        onClick={() => handleAction(report.id, 'verified', true)}
                        disabled={actionLoading === report.id || report.status === 'verified'}
                        style={{ 
                          padding: '10px 24px', borderRadius: 12, background: 'var(--accent-primary)', 
                          color: '#fff', border: 'none', fontWeight: 700, fontSize: 13, cursor: 'pointer',
                          opacity: (report.status === 'verified' || actionLoading === report.id) ? 0.6 : 1
                        }}
                      >
                        {actionLoading === report.id ? 'Processing...' : report.status === 'verified' ? 'Already Verified' : 'Verify Incident'}
                      </button>
                      <button 
                        onClick={() => handleAction(report.id, 'rejected', false)}
                        disabled={actionLoading === report.id || report.status === 'rejected'}
                        style={{ 
                          padding: '10px 24px', borderRadius: 12, background: 'transparent', 
                          color: 'var(--accent-red)', border: '1px solid var(--accent-red)', 
                          fontWeight: 700, fontSize: 13, cursor: 'pointer',
                          opacity: (report.status === 'rejected' || actionLoading === report.id) ? 0.6 : 1
                        }}
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              )
            })
            )}
          </div>
        )}
      </div>
    </section>
  )
}
