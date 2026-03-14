import { useEffect, useRef, useState } from 'react'

const defaultStats = [
  { key: 'reports', value: 342,  label: 'Reports Verified',     suffix: '+', color: 'var(--accent-primary)', icon: '✅' },
  { key: 'privacy', value: 100,  label: 'Identities Protected', suffix: '%', color: 'var(--accent-secondary)', icon: '🛡️' },
  { key: 'speed',   value: 4.2,  label: 'Avg Response (hrs)',   suffix: 'h', color: '#3b82f6', icon: '⚡' },
  { key: 'global',  value: 38,   label: 'Communities Served',   suffix: '+', color: '#6366f1', icon: '🏘️' },
]

import { supabase } from '../lib/supabaseClient'

function useCountUp(target, isVisible, decimals = 0) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!isVisible) return
    let start = 0
    const duration = 1800, step = 16
    const increment = target / (duration / step)
    const timer = setInterval(() => {
      start += increment
      if (start >= target) { setCount(target); clearInterval(timer) }
      else setCount(parseFloat(start.toFixed(decimals)))
    }, step)
    return () => clearInterval(timer)
  }, [isVisible, target, decimals])
  return count
}

function StatCard({ stat, isVisible }) {
  const count = useCountUp(stat.value, isVisible, stat.value % 1 !== 0 ? 1 : 0)
  return (
    <div className="glass-card glass-card-hover" style={{ padding: '36px 28px', textAlign: 'center', flex: '1 1 200px' }}>
      <div style={{ fontSize: 36, marginBottom: 12 }}>{stat.icon}</div>
      <div className="font-display" style={{ fontSize: 44, fontWeight: 800, color: stat.color, lineHeight: 1, marginBottom: 8 }}>
        {count}{stat.suffix}
      </div>
      <div style={{ fontSize: 14, color: 'var(--text-secondary)', fontWeight: 500 }}>{stat.label}</div>
    </div>
  )
}

export default function StatsSection() {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  const [liveStats, setLiveStats] = useState(defaultStats)

  useEffect(() => {
    const fetchLiveCount = async () => {
      try {
        const { count, error } = await supabase
          .from('rewards')
          .select('*', { count: 'exact', head: true })
        
        if (!error && count !== null) {
          setLiveStats(prev => prev.map(s => 
            s.key === 'reports' ? { ...s, value: count } : s
          ))
        }
      } catch (err) {
        console.warn('Could not fetch live stats:', err)
      }
    }

    fetchLiveCount()
    
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold: 0.3 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="stats" style={{ padding: '80px 32px', background: 'transparent' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <p className="badge badge-cyan" style={{ marginBottom: 16, display: 'inline-flex' }}>Impact</p>
          <h2 className="font-display" style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Real results. Real change.
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: 12, fontSize: 16 }}>Trusted by communities across Europe.</p>
        </div>
        <div ref={ref} style={{ display: 'flex', gap: 20, flexWrap: 'wrap', justifyContent: 'center' }}>
          {liveStats.map(s => <StatCard key={s.label} stat={s} isVisible={visible} />)}
        </div>
      </div>
    </section>
  )
}
