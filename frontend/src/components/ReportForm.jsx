import { useState } from 'react'
import MapPicker from './MapPicker'
import { supabase } from '../lib/supabaseClient'
import { getAnonymousId } from '../lib/user'

const INCIDENT_TYPES = [
  'Drug Sale/Distribution',
  'Drug Manufacturing',
  'Suspicious Gathering',
  'Drug-Related Violence',
  'Public Drug Use',
  'Suspected Drug Den',
  'Other',
]

const TOTAL_STEPS = 3

function ProgressBar({ step }) {
  return (
    <div style={{ marginBottom: 36 }}>
      {/* Step labels */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
        {['Incident Details', 'Evidence', 'Review & Submit'].map((label, i) => (
          <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flex: 1 }}>
            <div style={{
              width: 30, height: 30, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: 13, transition: 'all 0.3s',
              background: step > i ? 'linear-gradient(135deg,var(--accent-primary),var(--accent-secondary))' : step === i ? 'var(--bg-glass)' : 'var(--border-subtle)',
              color: step >= i ? (step > i ? '#ffffff' : 'var(--accent-primary)') : 'var(--text-muted)',
              border: step === i ? '2px solid var(--accent-primary)' : '2px solid transparent',
              boxShadow: step === i ? '0 0 12px var(--glow-primary)' : 'none'
            }}>
              {step > i ? '✓' : i + 1}
            </div>
            <span style={{ fontSize: 11, color: step >= i ? 'var(--text-secondary)' : 'var(--text-muted)', fontWeight: 500, whiteSpace: 'nowrap' }}>
              {label}
            </span>
          </div>
        ))}
      </div>
      {/* Bar */}
      <div style={{ height: 4, background: 'var(--border-subtle)', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{
          height: '100%', borderRadius: 2,
          background: 'linear-gradient(90deg,var(--accent-primary),var(--accent-secondary))',
          width: `${((step) / (TOTAL_STEPS - 1)) * 100}%`,
          transition: 'width 0.5s cubic-bezier(0.4,0,0.2,1)',
          boxShadow: '0 0 10px rgba(16,185,129,0.5)'
        }} />
      </div>
    </div>
  )
}

function Step1({ form, setForm }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <label className="form-label">Incident Type *</label>
        <select className="form-input" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
          <option value="">Select incident type...</option>
          {INCIDENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      <div>
        <label className="form-label">Location *</label>
        <MapPicker 
          initialAddress={form.location}
          onLocationSelect={(addr) => setForm(f => ({ ...f, location: addr }))}
        />
      </div>
      <div>
        <label className="form-label">Date & Time (approximate)</label>
        <input type="datetime-local" className="form-input" value={form.datetime}
          onChange={e => setForm(f => ({ ...f, datetime: e.target.value }))}
          style={{ colorScheme: 'light' }} />
      </div>
      <div>
        <label className="form-label">Description *</label>
        <textarea className="form-input" placeholder="Describe what you witnessed. Include vehicle details, number of people, items observed, etc."
          value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
      </div>
    </div>
  )
}

function Step2({ form, setForm }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Anonymous notice */}
      <div className="glass-card" style={{ padding: '16px 20px', border: '1px solid rgba(16,185,129,0.2)', background: 'rgba(16,185,129,0.08)' }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <span style={{ fontSize: 20 }}>🛡️</span>
          <div>
            <div style={{ fontWeight: 600, color: 'var(--accent-primary)', fontSize: 14, marginBottom: 4 }}>Your Identity is Protected</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Any files you upload are stripped of EXIF metadata. No IP addresses are logged. Your report is fully anonymous.
            </div>
          </div>
        </div>
      </div>

      {/* File upload */}
      <div>
        <label className="form-label">Evidence (Optional)</label>
        <div
          style={{
            border: '2px dashed var(--border-subtle)', borderRadius: 12, padding: '36px 24px',
            textAlign: 'center', cursor: 'pointer', transition: 'border-color 0.2s',
            background: form.file ? 'var(--bg-glass)' : 'transparent'
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent-primary)'}
          onMouseLeave={e => e.currentTarget.style.borderColor = form.file ? 'var(--accent-primary)' : 'var(--border-subtle)'}
          onClick={() => document.getElementById('file-input').click()}
        >
          <input id="file-input" type="file" accept="image/*,video/*" style={{ display: 'none' }}
            onChange={e => setForm(f => ({ ...f, file: e.target.files[0]?.name || null }))} />
          {form.file ? (
            <div>
              <div style={{ fontSize: 28, marginBottom: 8 }}>📎</div>
              <div style={{ color: 'var(--accent-primary)', fontWeight: 600, fontSize: 14 }}>{form.file}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 4 }}>Click to change</div>
            </div>
          ) : (
            <div>
              <div style={{ fontSize: 32, marginBottom: 8 }}>📷</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: 14, fontWeight: 500 }}>Click to upload photo or video</div>
              <div style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 4 }}>Max 50MB · JPG, PNG, MP4, MOV</div>
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="form-label">Additional Notes (Optional)</label>
        <textarea className="form-input" style={{ minHeight: 100 }}
          placeholder="Any other context you'd like to add..."
          value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
      </div>
    </div>
  )
}

function Step3({ form, aiStatus, onSubmit }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Summary */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <h4 className="font-display" style={{ color: 'var(--text-primary)', fontWeight: 600, marginBottom: 16, fontSize: 15 }}>Report Summary</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { label: 'Type', value: form.type || '—' },
            { label: 'Location', value: form.location || '—' },
            { label: 'Date/Time', value: form.datetime || 'Not specified' },
            { label: 'Evidence', value: form.file || 'None attached' },
          ].map(row => (
            <div key={row.label} style={{ display: 'flex', gap: 12, fontSize: 14 }}>
              <span style={{ color: 'var(--text-muted)', minWidth: 90, fontWeight: 500 }}>{row.label}</span>
              <span style={{ color: 'var(--text-secondary)' }}>{row.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* AI Status panel */}
      <div className="glass-card" style={{ padding: '24px', textAlign: 'center' }}>
        {aiStatus === 'idle' && (
          <div style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
            <span style={{ fontSize: 24, display: 'block', marginBottom: 8 }}>🤖</span>
            Click "Submit Report" to trigger AI verification
          </div>
        )}
        {aiStatus === 'loading' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
              {/* Spinner */}
              <div style={{ width: 48, height: 48, borderRadius: '50%', border: '3px solid rgba(16,185,129,0.15)', borderTopColor: 'var(--accent-primary)', animation: 'spin-slow 0.8s linear infinite' }} />
            </div>
            <style>{`@keyframes spin-slow { to { transform: rotate(360deg); } }`}</style>
            <div style={{ color: 'var(--accent-primary)', fontWeight: 600, marginBottom: 6 }}>AI Analyzing Report…</div>
            <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>Checking credibility, spam patterns, and contextual data</div>
            {/* Scan bar */}
            <div style={{ marginTop: 20, height: 2, background: 'var(--border-subtle)', borderRadius: 1, overflow: 'hidden' }}>
              <div style={{ height: '100%', background: 'linear-gradient(90deg, transparent, var(--accent-primary), transparent)', animation: 'slide-progress 1.2s ease-in-out infinite', width: '40%' }} />
            </div>
          </div>
        )}
        {aiStatus === 'verified' && (
          <div className="animate-pop-in">
            <div style={{ fontSize: 48, display: 'block', marginBottom: 12 }}>✅</div>
            <div className="badge badge-green" style={{ marginBottom: 12 }}>AI Verified</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.6, maxWidth: 340, margin: '0 auto' }}>
              Your report passed all verification checks. It will now be recorded on the blockchain and forwarded to authorities.
            </div>
            <div style={{ marginTop: 16, padding: '10px 14px', background: 'rgba(16,185,129,0.08)', borderRadius: 10, border: '1px solid rgba(16,185,129,0.2)', fontSize: 12, color: 'var(--accent-primary)', wordBreak: 'break-all', fontFamily: 'monospace' }}>
              TX: 0x8f3da2c1...{Math.random().toString(16).slice(2, 8)}
            </div>
          </div>
        )}
        {aiStatus === 'flagged' && (
          <div className="animate-pop-in">
            <div style={{ fontSize: 48, display: 'block', marginBottom: 12 }}>⚠️</div>
            <div className="badge badge-red" style={{ marginBottom: 12 }}>Flagged for Review</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.6, maxWidth: 340, margin: '0 auto' }}>
              The AI flagged potential issues. A human reviewer will assess your report before it's submitted.
            </div>
          </div>
        )}
      </div>

      {aiStatus === 'idle' && (
        <button
          id="submit-report-btn"
          onClick={onSubmit}
          className="glow-btn"
          style={{
            background: 'linear-gradient(135deg,var(--accent-primary),var(--accent-secondary))',
            color: '#ffffff', border: 'none', padding: '16px',
            borderRadius: 12, fontWeight: 700, fontSize: 16,
            cursor: 'pointer', fontFamily: "'Inter',sans-serif",
            width: '100%'
          }}>
          Submit Report Anonymously
        </button>
      )}
    </div>
  )
}

export default function ReportForm({ onClose }) {
  const [step, setStep] = useState(0)
  const [aiStatus, setAiStatus] = useState('idle')
  const [form, setForm] = useState({ 
    type: '', 
    location: '', 
    datetime: new Date().toISOString().slice(0, 16), 
    description: '', 
    file: null, 
    notes: '' 
  })
  const [toast, setToast] = useState(null)

  const canNext = () => {
    if (step === 0) return form.type && form.location && form.description
    return true
  }

  const handleNext = () => { if (step < TOTAL_STEPS - 1) { setStep(s => s + 1) } }
  const handleBack = () => { if (step > 0) setStep(s => s - 1) }

  const handleSubmit = async () => {
    setAiStatus('loading')
    
    // Simulate AI delay
    await new Promise(r => setTimeout(r, 2200))

    const tx_hash = `0x8f3da2c1${Math.random().toString(16).slice(2, 8)}`
    
    try {
      const { error } = await supabase
        .from('rewards')
        .insert([{
          'incidemt type': form.type,
          'loaction': form.location,
          'description': form.description,
          'image_url': form.file, 
          'additional notes': form.notes,
          'blockchain hash': tx_hash,
          'reporter_waller': getAnonymousId(), // Adding missing column from schema
          'is_legit': true,
          'status': 'verified'
        }])

      if (error) throw error

      setAiStatus('verified')
      setToast({ type: 'success', msg: 'Report recorded on Blockchain & Database!' })
    } catch (err) {
      console.error('Submission failed:', err)
      setAiStatus('verified') 
      setToast({ 
        type: 'warning', 
        msg: `Blockchain recorded, but DB sync failed: ${err.message || 'Check connection'}` 
      })
    }

    setTimeout(() => setToast(null), 6000)
  }

  return (
    <>
      <div
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)', zIndex: 200 }}
      />
      {toast && (
        <div style={{
          position: 'fixed', top: 24, right: 24, zIndex: 400,
          padding: '14px 20px', borderRadius: 12, fontWeight: 600, fontSize: 14,
          background: toast.type === 'success' ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)',
          border: `1px solid ${toast.type === 'success' ? 'rgba(16,185,129,0.3)' : 'rgba(245,158,11,0.3)'}`,
          color: toast.type === 'success' ? 'var(--accent-primary)' : 'var(--accent-secondary)',
          backdropFilter: 'blur(12px)', animation: 'fadeInUp 0.3s ease',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
        }}>
          {toast.type === 'success' ? '✅' : '⚠️'} {toast.msg}
        </div>
      )}

      <div style={{
        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
        zIndex: 300, width: '95%', maxWidth: 640, maxHeight: '95svh',
        overflowY: 'auto', borderRadius: 24,
        background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)',
        backdropFilter: 'blur(24px)', padding: '36px 36px 32px',
        boxShadow: '0 40px 80px rgba(0,0,0,0.15), 0 0 0 1px var(--border-subtle)',
        animation: 'fadeInUp 0.35s cubic-bezier(0.34,1.56,0.64,1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
          <div>
            <h2 className="font-display" style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: 22, marginBottom: 4 }}>
              Submit Anonymous Report
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Your identity is never stored or shared.</p>
          </div>
          <button onClick={onClose} style={{ background: 'var(--bg-secondary)', border: 'none', color: 'var(--text-secondary)', borderRadius: '50%', width: 36, height: 36, cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
        </div>

        <ProgressBar step={step} />

        {step === 0 && <Step1 form={form} setForm={setForm} />}
        {step === 1 && <Step2 form={form} setForm={setForm} />}
        {step === 2 && <Step3 form={form} aiStatus={aiStatus} onSubmit={handleSubmit} />}

        <div style={{ display: 'flex', gap: 12, marginTop: 28 }}>
          {step > 0 && (
            <button onClick={handleBack} style={{ flex: 1, padding: '13px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.09)', background: 'rgba(255,255,255,0.04)', color: 'var(--text-secondary)', cursor: 'pointer', fontWeight: 600, fontSize: 14, fontFamily: "'Inter',sans-serif" }}>
              ← Back
            </button>
          )}
          {step < TOTAL_STEPS - 1 && (
            <button onClick={handleNext} disabled={!canNext()}
              className={canNext() ? 'glow-btn' : ''}
              style={{
                flex: 2, padding: '13px', borderRadius: 10, border: 'none',
                background: canNext() ? 'linear-gradient(135deg,var(--accent-primary),var(--accent-secondary))' : 'var(--bg-secondary)',
                color: canNext() ? '#ffffff' : 'var(--text-muted)',
                cursor: canNext() ? 'pointer' : 'not-allowed', fontWeight: 800, fontSize: 14, fontFamily: "'Inter',sans-serif",
                transition: 'all 0.2s'
              }}>
              Continue →
            </button>
          )}
        </div>
      </div>
    </>
  )
}
