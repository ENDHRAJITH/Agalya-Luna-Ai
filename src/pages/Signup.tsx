import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import { useAuth } from '../context/AuthContext'

export default function Signup() {
  const { signup, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard')
  }, [isAuthenticated])

  useEffect(() => {
    gsap.fromTo(cardRef.current,
      { opacity: 0, y: 50, scale: 0.96 },
      { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power3.out', delay: 0.1 }
    )
    gsap.fromTo('.auth-field',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, stagger: 0.07, duration: 0.5, ease: 'power3.out', delay: 0.3 }
    )
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return }
    setLoading(true)
    try {
      await signup(name, email, password)
      navigate('/dashboard')
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Signup failed. Please try again.')
      gsap.timeline()
        .to(cardRef.current, { x: -10, duration: 0.08 })
        .to(cardRef.current, { x: 10, duration: 0.08 })
        .to(cardRef.current, { x: -6, duration: 0.08 })
        .to(cardRef.current, { x: 0, duration: 0.08 })
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%', padding: '13px 16px', borderRadius: '12px',
    fontSize: '0.9rem', fontFamily: 'var(--font-display)',
    color: 'var(--text-primary)', outline: 'none',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(123,110,246,0.2)',
    transition: 'all 0.2s ease', boxSizing: 'border-box' as const,
  }
  const onFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.border = '1px solid rgba(123,110,246,0.6)'
    e.target.style.background = 'rgba(123,110,246,0.06)'
    e.target.style.boxShadow = '0 0 0 3px rgba(123,110,246,0.1)'
  }
  const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.border = '1px solid rgba(123,110,246,0.2)'
    e.target.style.background = 'rgba(255,255,255,0.04)'
    e.target.style.boxShadow = 'none'
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '100px 16px 40px', background: 'var(--bg-void)', position: 'relative', overflow: 'hidden'
    }}>
      {/* BG */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(rgba(123,110,246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(123,110,246,0.04) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }} />
      <div style={{
        position: 'absolute', bottom: '30%', right: '20%', width: '400px', height: '400px',
        borderRadius: '50%', pointerEvents: 'none',
        background: 'radial-gradient(circle, rgba(0,212,255,0.07) 0%, transparent 70%)',
        filter: 'blur(60px)',
      }} />
      <div style={{
        position: 'absolute', top: '25%', left: '15%', width: '350px', height: '350px',
        borderRadius: '50%', pointerEvents: 'none',
        background: 'radial-gradient(circle, rgba(123,110,246,0.08) 0%, transparent 70%)',
        filter: 'blur(60px)',
      }} />

      <div ref={cardRef} style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '440px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none', marginBottom: '24px' }}>
            <div style={{ position: 'relative', width: '36px', height: '36px' }}>
              <div style={{
                position: 'absolute', inset: 0, borderRadius: '10px',
                background: 'linear-gradient(135deg, var(--accent-luna), var(--accent-cyan))', opacity: 0.3,
              }} />
              <div style={{
                position: 'absolute', inset: '2px', borderRadius: '8px',
                background: 'var(--bg-void)', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <svg viewBox="0 0 20 20" fill="none" style={{ width: '14px', height: '14px' }}>
                  <path d="M10 2L3 6.5l7 4 7-4L10 2zM3 13.5l7 4 7-4M3 10l7 4 7-4"
                    stroke="url(#lg3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <defs><linearGradient id="lg3" x1="3" y1="2" x2="17" y2="18" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#9D93FF" /><stop offset="1" stopColor="#00D4FF" />
                  </linearGradient></defs>
                </svg>
              </div>
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.2rem', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
              Luna<span style={{ background: 'linear-gradient(135deg, #9D93FF, #00D4FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>AI</span>
            </span>
          </Link>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.75rem', letterSpacing: '-0.03em', color: 'var(--text-primary)', marginBottom: '8px' }}>
            Create your account
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Start building ML models for free</p>
        </div>

        {/* Card */}
        <div style={{
          background: 'rgba(13,13,26,0.8)', backdropFilter: 'blur(24px)',
          border: '1px solid rgba(123,110,246,0.18)',
          borderRadius: '20px', padding: '36px',
          boxShadow: '0 8px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(123,110,246,0.05) inset',
        }}>
          {error && (
            <div className="auth-field" style={{
              marginBottom: '20px', padding: '12px 16px', borderRadius: '10px',
              fontSize: '0.85rem', color: '#f87171',
              background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {[
              { label: 'Full Name', type: 'text', value: name, setter: setName, placeholder: 'John Doe' },
              { label: 'Email', type: 'email', value: email, setter: setEmail, placeholder: 'you@example.com' },
              { label: 'Password', type: 'password', value: password, setter: setPassword, placeholder: 'Min 6 characters' },
            ].map((field, i) => (
              <div key={i} className="auth-field" style={{ marginBottom: i < 2 ? '16px' : '24px' }}>
                <label style={{
                  display: 'block', marginBottom: '8px',
                  fontSize: '0.7rem', fontFamily: 'var(--font-mono)',
                  letterSpacing: '0.12em', textTransform: 'uppercase',
                  color: 'var(--text-muted)',
                }}>
                  {field.label}
                </label>
                <input
                  type={field.type}
                  value={field.value}
                  onChange={e => field.setter(e.target.value)}
                  placeholder={field.placeholder}
                  required
                  style={inputStyle}
                  onFocus={onFocus}
                  onBlur={onBlur}
                />
              </div>
            ))}

            <div className="auth-field">
              <button type="submit" disabled={loading} data-hover style={{
                width: '100%', padding: '14px', borderRadius: '12px', border: 'none',
                fontSize: '0.95rem', fontWeight: 600, fontFamily: 'var(--font-display)',
                color: 'white', cursor: loading ? 'not-allowed' : 'none',
                background: loading ? 'rgba(123,110,246,0.4)' : 'linear-gradient(135deg, #7B6EF6 0%, #5B4FD4 100%)',
                boxShadow: loading ? 'none' : '0 4px 20px rgba(123,110,246,0.35), inset 0 1px 0 rgba(255,255,255,0.12)',
                transition: 'all 0.25s ease',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              }}
                onMouseEnter={e => {
                  if (!loading) {
                    (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 28px rgba(123,110,246,0.5), inset 0 1px 0 rgba(255,255,255,0.15)'
                    ;(e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'
                  }
                }}
                onMouseLeave={e => {
                  if (!loading) {
                    (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(123,110,246,0.35), inset 0 1px 0 rgba(255,255,255,0.12)'
                    ;(e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
                  }
                }}>
                {loading ? (
                  <>
                    <span style={{
                      width: '16px', height: '16px', borderRadius: '50%',
                      border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white',
                      display: 'inline-block', animation: 'spin 0.7s linear infinite',
                    }} />
                    Creating account...
                  </>
                ) : 'Create Account →'}
              </button>
            </div>
          </form>

          <div style={{
            marginTop: '24px', paddingTop: '24px',
            borderTop: '1px solid rgba(123,110,246,0.1)',
            textAlign: 'center',
          }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
              Already have an account?{' '}
              <Link to="/login" data-hover style={{ color: 'var(--accent-luna-bright)', fontWeight: 600, textDecoration: 'none' }}
                onMouseEnter={e => (e.currentTarget.style.textDecoration = 'underline')}
                onMouseLeave={e => (e.currentTarget.style.textDecoration = 'none')}>
                Sign in
              </Link>
            </p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              By signing up, you agree to our Terms of Service.
            </p>
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
