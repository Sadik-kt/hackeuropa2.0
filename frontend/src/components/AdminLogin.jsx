import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useNavigate } from 'react-router-dom'

export default function AdminLogin({ onLogin, onClose }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        alert('Wrong email or password!');
        throw authError
      }

      if (data.user) {
        onLogin?.()
        onClose?.()
        navigate('/dashboard')
      }
    } catch (err) {
      setError(err.message || 'Invalid admin credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div 
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)', zIndex: 200 }} 
      />
      <div style={{
        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
        zIndex: 300, width: '90%', maxWidth: 400, borderRadius: 24,
        background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)',
        padding: '36px', boxShadow: '0 40px 80px rgba(0,0,0,0.15)',
        animation: 'fadeInUp 0.3s cubic-bezier(0.34,1.56,0.64,1)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🔐</div>
          <h2 className="font-display" style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: 24 }}>
            Admin Access
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 4 }}>Login with Supabase credentials.</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label className="form-label">Admin Email</label>
            <input 
              type="email" 
              className="form-input" 
              autoFocus
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@example.com"
            />
          </div>
          <div>
            <label className="form-label">Password</label>
            <input 
              type="password" 
              className="form-input" 
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••"
            />
          </div>
          
          {error && (
            <div style={{ color: 'var(--accent-red)', fontSize: 13, fontWeight: 500, textAlign: 'center' }}>
              {error}
            </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="glow-btn"
            style={{
              background: 'linear-gradient(135deg,var(--accent-primary),var(--accent-secondary))',
              color: '#ffffff', border: 'none', padding: '14px',
              borderRadius: 12, fontWeight: 700, fontSize: 15,
              cursor: loading ? 'not-allowed' : 'pointer', fontFamily: "'Inter',sans-serif",
              marginTop: 10, opacity: loading ? 0.7 : 1
            }}>
            {loading ? 'Verifying...' : 'Login to Dashboard'}
          </button>
        </form>
        
        <button 
          onClick={onClose}
          style={{ 
            width: '100%', background: 'transparent', border: 'none', 
            color: 'var(--text-muted)', fontSize: 13, marginTop: 24, 
            cursor: 'pointer', fontWeight: 500 
          }}>
          Back to Public View
        </button>
      </div>
    </>
  )
}
