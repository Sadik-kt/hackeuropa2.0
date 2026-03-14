import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import StatsSection from './components/StatsSection'
import HowItWorksSection from './components/HowItWorksSection'
import ReportForm from './components/ReportForm'
import AdminLogin from './components/AdminLogin'
import Footer from './components/Footer'
import Dashboard from './pages/Dashboard'
import ProtectedRoute from './components/ProtectedRoute'
import BackgroundDecoration from './components/BackgroundDecoration'

export default function App() {
  const [showForm, setShowForm] = useState(false)
  const [showAdminLogin, setShowAdminLogin] = useState(false)

  const handleReportClick = () => setShowForm(true)

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", minHeight: '100svh' }}>
      <BackgroundDecoration />
      <Routes>
        {/* Public Route */}
        <Route path="/" element={
          <>
            <Navbar onReportClick={handleReportClick} />
            <HeroSection onReportClick={handleReportClick} />
            <StatsSection />
            <HowItWorksSection />
            
            {/* CTA Banner */}
            <section style={{ padding: '80px 32px', background: 'transparent', textAlign: 'center' }}>
              <div style={{ maxWidth: 640, margin: '0 auto' }}>
                  <div style={{
                    display: 'inline-block', padding: '36px 48px', borderRadius: 24,
                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.04) 0%, rgba(245, 158, 11, 0.02) 100%)',
                    border: '1px solid var(--border-subtle)',
                    boxShadow: '0 0 60px rgba(16, 185, 129, 0.03)',
                    backdropFilter: 'blur(10px)'
                  }}>
                    <div style={{ fontSize: 40, marginBottom: 16 }}>🛡️</div>
                    <h2 className="font-display" style={{ fontSize: 'clamp(24px, 3.5vw, 36px)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 14, letterSpacing: '-0.02em' }}>
                      See something? Say something.
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 16, lineHeight: 1.7, marginBottom: 28 }}>
                      Your report could save lives. Your identity will never be revealed.
                      It takes less than 2 minutes.
                    </p>
                    <button
                      id="cta-report-btn"
                      onClick={handleReportClick}
                      className="glow-btn"
                      style={{
                        background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                        color: '#ffffff', border: 'none', padding: '16px 40px',
                        borderRadius: 100, fontWeight: 800, fontSize: 16,
                        cursor: 'pointer', fontFamily: "'Inter',sans-serif"
                      }}>
                      Submit an Anonymous Report
                    </button>
                  </div>
              </div>
            </section>
            
            <Footer onAdminClick={() => setShowAdminLogin(true)} />
          </>
        } />

        {/* Protected Admin Route */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
      </Routes>

      {/* Modals */}
      {showForm && <ReportForm onClose={() => setShowForm(false)} />}
      {showAdminLogin && (
        <AdminLogin 
          onClose={() => setShowAdminLogin(false)} 
        />
      )}
    </div>
  )
}