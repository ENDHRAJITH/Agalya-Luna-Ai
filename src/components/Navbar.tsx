import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const navRef = useRef<HTMLElement>(null)
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    gsap.fromTo(navRef.current,
      { y: -80, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.2 }
    )
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogout = () => { logout(); navigate('/') }

  const navLinks = isAuthenticated
    ? [{ to: '/dashboard', label: 'Dashboard' }, { to: '/builder', label: 'Builder' }, { to: '/models', label: 'My Models' }]
    : [{ to: '/#features', label: 'Features' }, { to: '/#how', label: 'How It Works' }]

  return (
    <nav ref={navRef} style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      padding: scrolled ? '10px 0' : '18px 0',
      background: scrolled ? 'rgba(2,2,5,0.90)' : 'transparent',
      backdropFilter: scrolled ? 'blur(24px)' : 'none',
      WebkitBackdropFilter: scrolled ? 'blur(24px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(123,110,246,0.12)' : 'none',
      transition: 'all 0.4s ease',
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

        {/* Logo */}
        <Link to="/" data-hover style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{ position: 'relative', width: '34px', height: '34px' }}>
            <div style={{
              position: 'absolute', inset: 0, borderRadius: '9px',
              background: 'linear-gradient(135deg, var(--accent-luna), var(--accent-cyan))',
              opacity: 0.25,
            }} />
            <div style={{
              position: 'absolute', inset: '2px', borderRadius: '7px',
              background: 'var(--bg-void)', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <svg viewBox="0 0 20 20" fill="none" style={{ width: '16px', height: '16px' }}>
                <path d="M10 2L3 6.5l7 4 7-4L10 2zM3 13.5l7 4 7-4M3 10l7 4 7-4"
                  stroke="url(#lg)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <defs>
                  <linearGradient id="lg" x1="3" y1="2" x2="17" y2="18" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#9D93FF" /><stop offset="1" stopColor="#00D4FF" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.05rem', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
            Luna<span style={{ background: 'linear-gradient(135deg, #9D93FF, #00D4FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>AI</span>
          </span>
        </Link>

        {/* Nav links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }} className="hidden md:flex">
          {navLinks.map(link => (
            <Link key={link.to} to={link.to} data-hover style={{
              fontSize: '0.875rem', fontWeight: 500, textDecoration: 'none',
              color: location.pathname === link.to ? 'var(--accent-luna-bright)' : 'var(--text-secondary)',
              transition: 'color 0.2s ease',
            }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent-luna-bright)')}
              onMouseLeave={e => (e.currentTarget.style.color = location.pathname === link.to ? 'var(--accent-luna-bright)' : 'var(--text-secondary)')}>
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} className="hidden md:flex">
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--accent-luna), var(--accent-cyan))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.75rem', fontWeight: 700, color: 'white',
                }}>
                  {user?.name?.[0]?.toUpperCase()}
                </div>
                <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{user?.name}</span>
              </div>
              <button onClick={handleLogout} data-hover style={{
                background: 'none', border: 'none', cursor: 'none',
                fontSize: '0.8rem', color: 'var(--text-muted)', transition: 'color 0.2s',
              }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}>
                Sign out
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" data-hover style={{
                fontSize: '0.875rem', fontWeight: 500, textDecoration: 'none',
                color: 'var(--text-secondary)', padding: '8px 14px', borderRadius: '8px',
                transition: 'color 0.2s ease',
              }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}>
                Sign in
              </Link>
              <Link to="/signup" data-hover style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                padding: '9px 22px', borderRadius: '10px',
                fontSize: '0.875rem', fontWeight: 600, letterSpacing: '0.01em',
                color: 'white', textDecoration: 'none',
                background: 'linear-gradient(135deg, #7B6EF6 0%, #5B4FD4 100%)',
                border: '1px solid rgba(155,147,255,0.35)',
                boxShadow: '0 2px 12px rgba(123,110,246,0.25), inset 0 1px 0 rgba(255,255,255,0.1)',
                transition: 'all 0.25s ease',
                position: 'relative', zIndex: 10,
              }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement
                  el.style.boxShadow = '0 4px 20px rgba(123,110,246,0.45), inset 0 1px 0 rgba(255,255,255,0.15)'
                  el.style.transform = 'translateY(-1px)'
                  el.style.background = 'linear-gradient(135deg, #8B7EFF 0%, #6B5FE4 100%)'
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement
                  el.style.boxShadow = '0 2px 12px rgba(123,110,246,0.25), inset 0 1px 0 rgba(255,255,255,0.1)'
                  el.style.transform = 'translateY(0)'
                  el.style.background = 'linear-gradient(135deg, #7B6EF6 0%, #5B4FD4 100%)'
                }}>
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)} data-hover style={{
          background: 'none', border: 'none', cursor: 'none', padding: '8px', display: 'flex', flexDirection: 'column', gap: '5px'
        }}>
          {[0, 1, 2].map(i => (
            <span key={i} style={{
              display: 'block', width: '20px', height: '1.5px',
              background: 'var(--text-primary)', borderRadius: '2px',
              transition: 'all 0.3s ease',
              transform: menuOpen ? (i === 0 ? 'rotate(45deg) translateY(6px)' : i === 2 ? 'rotate(-45deg) translateY(-6px)' : 'scaleX(0)') : 'none',
            }} />
          ))}
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div style={{
          padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px',
          background: 'rgba(7,7,15,0.97)', backdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(123,110,246,0.1)',
        }}>
          {navLinks.map(link => (
            <Link key={link.to} to={link.to}
              style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textDecoration: 'none' }}
              onClick={() => setMenuOpen(false)}>
              {link.label}
            </Link>
          ))}
          {!isAuthenticated && (
            <Link to="/signup" style={{
              display: 'block', padding: '11px 20px', borderRadius: '10px', textAlign: 'center',
              fontSize: '0.875rem', fontWeight: 600, color: 'white', textDecoration: 'none',
              background: 'linear-gradient(135deg, #7B6EF6, #5B4FD4)',
            }} onClick={() => setMenuOpen(false)}>
              Get Started
            </Link>
          )}
        </div>
      )}
    </nav>
  )
}
