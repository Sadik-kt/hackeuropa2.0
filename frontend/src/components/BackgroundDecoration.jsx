export default function BackgroundDecoration() {
  const symbols = [
    { icon: '⚠️', top: '15%', left: '5%', size: 40, anim: 'float-bg', delay: '0s' },
    { icon: '🛡️', top: '25%', left: '85%', size: 30, anim: 'sway-bg', delay: '2s' },
    { icon: '🔒', top: '65%', left: '10%', size: 35, anim: 'float-bg', delay: '4s' },
    { icon: '⚖️', top: '80%', left: '80%', size: 45, anim: 'sway-bg', delay: '1s' },
    { icon: '🚨', top: '45%', left: '90%', size: 25, anim: 'float-bg', delay: '3s' },
    { icon: '⚠️', top: '55%', left: '2%', size: 20, anim: 'sway-bg', delay: '5s' },
    { icon: '🛡️', top: '10%', left: '50%', size: 18, anim: 'drift-bg', delay: '1.5s' },
    { icon: '🔍', top: '40%', left: '15%', size: 22, anim: 'float-bg', delay: '6s' },
    { icon: '🔐', top: '75%', left: '45%', size: 28, anim: 'sway-bg', delay: '2.5s' },
    { icon: '🕸️', top: '30%', left: '30%', size: 50, anim: 'drift-bg', delay: '0.5s' },
    { icon: '⛓️', top: '85%', left: '15%', size: 32, anim: 'float-bg', delay: '7s' },
    { icon: '🛰️', top: '12%', left: '75%', size: 24, anim: 'drift-bg', delay: '3.2s' },
    { icon: '📋', top: '90%', left: '60%', size: 20, anim: 'sway-bg', delay: '4.5s' },
    { icon: '🛡️', top: '60%', left: '95%', size: 26, anim: 'float-bg', delay: '1s' },
  ]

  return (
    <div style={{
      position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: -1,
      overflow: 'hidden', opacity: 0.28
    }}>
      {symbols.map((s, idx) => (
        <div
          key={idx}
          style={{
            position: 'absolute', top: s.top, left: s.left,
            fontSize: s.size, animation: `${s.anim} ${idx % 2 === 0 ? '12s' : '15s'} ease-in-out infinite`,
            animationDelay: s.delay, filter: 'grayscale(1) brightness(1.2) contrast(0.7)'
          }}
        >
          {s.icon}
        </div>
      ))}
      
      {/* Background orbs */}
      <div style={{
        position: 'absolute', top: '-15%', left: '10%', width: '50vw', height: '50vw',
        background: 'radial-gradient(circle, rgba(37,99,235,0.06) 0%, transparent 70%)',
        borderRadius: '50%'
      }} />
      <div style={{
        position: 'absolute', bottom: '0%', right: '-10%', width: '40vw', height: '40vw',
        background: 'radial-gradient(circle, rgba(71,85,105,0.05) 0%, transparent 70%)',
        borderRadius: '50%'
      }} />

      <style>{`
        @keyframes float-bg {
          0%, 100% { transform: translateY(0) rotate(0); }
          50% { transform: translateY(-30px) rotate(5deg); }
        }
        @keyframes sway-bg {
          0%, 100% { transform: translateX(0) scale(1); }
          50% { transform: translateX(20px) scale(1.1); }
        }
        @keyframes drift-bg {
          0%, 100% { transform: translate(0, 0) rotate(0); }
          50% { transform: translate(-15px, 15px) rotate(-10deg); }
        }
      `}</style>
    </div>
  )
}
