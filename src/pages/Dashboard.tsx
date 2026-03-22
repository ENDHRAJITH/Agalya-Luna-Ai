import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

interface Model {
  id: string
  name: string
  problem_description: string
  task_type: string
  status: string
  accuracy?: number
  created_at: string
}

const STATUS_COLOR: Record<string, { bg: string; dot: string; text: string }> = {
  completed: { bg: 'rgba(0,255,179,0.08)', dot: '#00FFB3', text: '#00FFB3' },
  training:  { bg: 'rgba(123,110,246,0.08)', dot: '#9D93FF', text: '#9D93FF' },
  failed:    { bg: 'rgba(255,107,53,0.08)', dot: '#FF6B35', text: '#FF6B35' },
  pending:   { bg: 'rgba(255,255,255,0.04)', dot: '#555', text: '#666' },
}

export default function Dashboard() {
  const { user, token } = useAuth()
  const [models, setModels] = useState<Model[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    gsap.fromTo('.dash-card',
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, stagger: 0.07, duration: 0.55, ease: 'power3.out', delay: 0.1 }
    )
    fetchModels()
  }, [])

  const fetchModels = async () => {
    try {
      const res = await axios.get(`${API}/models`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setModels(res.data.models || [])
    } catch { setModels([]) }
    finally { setLoading(false) }
  }

  const completed = models.filter(m => m.status === 'completed')
  const avgAcc = completed.filter(m => m.accuracy).length
    ? (completed.filter(m => m.accuracy).reduce((a, m) => a + (m.accuracy || 0), 0) / completed.filter(m => m.accuracy).length * 100).toFixed(1)
    : null

  const STATS = [
    { label: 'Total Models', val: models.length, color: '#9D93FF', icon: '◈' },
    { label: 'Completed', val: completed.length, color: '#00FFB3', icon: '✓' },
    { label: 'In Training', val: models.filter(m => m.status === 'training').length, color: '#00D4FF', icon: '◌' },
    { label: 'Avg Accuracy', val: avgAcc ? `${avgAcc}%` : '—', color: '#FF6B35', icon: '▲' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-void)', paddingTop: '88px', paddingBottom: '60px' }}>

      {/* Subtle grid */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage: 'linear-gradient(rgba(123,110,246,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(123,110,246,0.03) 1px, transparent 1px)',
        backgroundSize: '64px 64px',
      }} />

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 28px', position: 'relative', zIndex: 1 }}>

        {/* ── Header ── */}
        <div className="dash-card" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <p style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
              letterSpacing: '0.15em', textTransform: 'uppercase',
              color: 'rgba(123,110,246,0.5)', marginBottom: '8px',
            }}>Dashboard</p>
            <h1 style={{
              fontFamily: 'var(--font-display)', fontWeight: 800,
              fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', letterSpacing: '-0.03em',
              color: 'var(--text-primary)', margin: 0,
            }}>
              Welcome back,{' '}
              <span style={{
                background: 'linear-gradient(135deg, #9D93FF, #00D4FF)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>
                {user?.name?.split(' ')[0]}
              </span>
            </h1>
          </div>
          <Link to="/builder" data-hover style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '11px 22px', borderRadius: '12px', textDecoration: 'none',
            fontSize: '0.875rem', fontWeight: 600, color: 'white',
            background: 'linear-gradient(135deg, #7B6EF6, #5B4FD4)',
            border: '1px solid rgba(155,147,255,0.3)',
            boxShadow: '0 4px 16px rgba(123,110,246,0.25)',
            transition: 'all 0.2s ease',
          }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement
              el.style.transform = 'translateY(-1px)'
              el.style.boxShadow = '0 6px 24px rgba(123,110,246,0.4)'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement
              el.style.transform = 'translateY(0)'
              el.style.boxShadow = '0 4px 16px rgba(123,110,246,0.25)'
            }}>
            + New Model
          </Link>
        </div>

        {/* ── Stats ── */}
        <div className="dash-card" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '36px' }}>
          {STATS.map((s, i) => (
            <div key={i} style={{
              padding: '24px 22px', borderRadius: '16px',
              background: 'rgba(255,255,255,0.025)',
              border: '1px solid rgba(255,255,255,0.06)',
              position: 'relative', overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
                background: `linear-gradient(90deg, transparent, ${s.color}50, transparent)`,
              }} />
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
                color: 'rgba(255,255,255,0.25)', letterSpacing: '0.1em',
                textTransform: 'uppercase', marginBottom: '10px',
              }}>{s.label}</div>
              <div style={{
                fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.03em',
                color: s.color, fontFamily: 'var(--font-display)',
                textShadow: `0 0 20px ${s.color}30`,
              }}>{s.val}</div>
            </div>
          ))}
        </div>

        {/* ── Models ── */}
        <div className="dash-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)' }}>
              Your Models
            </h2>
            <Link to="/models" data-hover style={{
              fontSize: '0.8rem', color: 'rgba(123,110,246,0.7)', textDecoration: 'none',
              fontFamily: 'var(--font-mono)',
            }}
              onMouseEnter={e => (e.currentTarget.style.color = '#9D93FF')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(123,110,246,0.7)')}>
              View all →
            </Link>
          </div>

          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '14px' }}>
              {[...Array(3)].map((_, i) => (
                <div key={i} style={{
                  height: '130px', borderRadius: '14px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  animation: 'pulse 1.5s ease-in-out infinite',
                }} />
              ))}
            </div>
          ) : models.length === 0 ? (
            <div style={{
              padding: '60px 24px', textAlign: 'center',
              borderRadius: '16px',
              background: 'rgba(255,255,255,0.02)',
              border: '1px dashed rgba(255,255,255,0.08)',
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '14px', opacity: 0.25 }}>◈</div>
              <h3 style={{ fontWeight: 600, marginBottom: '8px', color: 'var(--text-primary)' }}>No models yet</h3>
              <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.3)', marginBottom: '24px' }}>
                Build your first ML model in under a minute
              </p>
              <Link to="/builder" data-hover style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                padding: '10px 22px', borderRadius: '10px', textDecoration: 'none',
                fontSize: '0.875rem', fontWeight: 600, color: 'white',
                background: 'linear-gradient(135deg, #7B6EF6, #5B4FD4)',
                boxShadow: '0 4px 16px rgba(123,110,246,0.25)',
              }}>
                Start Building →
              </Link>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px,1fr))', gap: '14px' }}>
              {models.slice(0, 6).map((m, i) => {
                const sc = STATUS_COLOR[m.status] || STATUS_COLOR.pending
                return (
                  <Link key={i} to={`/models/${m.id}`} data-hover style={{
                    display: 'block', textDecoration: 'none', padding: '20px',
                    borderRadius: '14px',
                    background: 'rgba(255,255,255,0.025)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    transition: 'all 0.25s ease',
                  }}
                    onMouseEnter={e => {
                      const el = e.currentTarget as HTMLElement
                      el.style.border = '1px solid rgba(123,110,246,0.3)'
                      el.style.background = 'rgba(123,110,246,0.04)'
                      el.style.transform = 'translateY(-2px)'
                    }}
                    onMouseLeave={e => {
                      const el = e.currentTarget as HTMLElement
                      el.style.border = '1px solid rgba(255,255,255,0.06)'
                      el.style.background = 'rgba(255,255,255,0.025)'
                      el.style.transform = 'translateY(0)'
                    }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <span style={{
                        fontFamily: 'var(--font-mono)', fontSize: '0.62rem',
                        letterSpacing: '0.1em', textTransform: 'uppercase',
                        padding: '3px 10px', borderRadius: '6px',
                        background: 'rgba(123,110,246,0.1)', color: '#9D93FF',
                        border: '1px solid rgba(123,110,246,0.15)',
                      }}>{m.task_type || 'ML Model'}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <div style={{
                          width: '6px', height: '6px', borderRadius: '50%',
                          background: sc.dot,
                          boxShadow: `0 0 6px ${sc.dot}`,
                        }} />
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: sc.text, textTransform: 'capitalize' }}>
                          {m.status}
                        </span>
                      </div>
                    </div>

                    <p style={{
                      fontSize: '0.875rem', fontWeight: 600,
                      color: 'rgba(255,255,255,0.8)', marginBottom: '14px',
                      lineHeight: 1.4,
                      display: '-webkit-box', WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical', overflow: 'hidden',
                    }}>
                      {m.name || m.problem_description?.slice(0, 70)}
                    </p>

                    {m.accuracy != null && (
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'rgba(255,255,255,0.2)' }}>Accuracy</span>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#00FFB3' }}>
                            {(m.accuracy * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div style={{ height: '3px', borderRadius: '2px', background: 'rgba(255,255,255,0.06)' }}>
                          <div style={{
                            height: '100%', borderRadius: '2px',
                            width: `${m.accuracy * 100}%`,
                            background: 'linear-gradient(90deg, #7B6EF6, #00FFB3)',
                          }} />
                        </div>
                      </div>
                    )}
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </div>

      <style>{`@keyframes pulse { 0%,100%{opacity:0.4} 50%{opacity:0.7} }`}</style>
    </div>
  )
}