import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { gsap } from 'gsap'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

interface Model {
  id: string
  name: string
  problem_description: string
  task_type: string
  status: string
  accuracy?: number
  r2_score?: number
  created_at: string
}

const TASK_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  classification: { bg: 'rgba(123,110,246,0.1)', text: '#9D93FF', border: 'rgba(123,110,246,0.25)' },
  regression:     { bg: 'rgba(0,212,255,0.1)',   text: '#00D4FF', border: 'rgba(0,212,255,0.25)' },
  clustering:     { bg: 'rgba(0,255,179,0.1)',   text: '#00FFB3', border: 'rgba(0,255,179,0.25)' },
}

const STATUS_CFG: Record<string, { dot: string; text: string }> = {
  completed: { dot: '#00FFB3', text: '#00FFB3' },
  training:  { dot: '#9D93FF', text: '#9D93FF' },
  failed:    { dot: '#FF6B35', text: '#FF6B35' },
  pending:   { dot: '#555',    text: '#555' },
}

export default function Models() {
  const { token } = useAuth()
  const [models, setModels] = useState<Model[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'classification' | 'regression' | 'clustering'>('all')

  useEffect(() => {
    fetchModels()
  }, [])

  const fetchModels = async () => {
    try {
      const res = await axios.get(`${API}/models`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setModels(res.data.models || [])
    } catch { setModels([]) }
    finally {
      setLoading(false)
      setTimeout(() => {
        gsap.fromTo('.model-row',
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, stagger: 0.06, duration: 0.4, ease: 'power3.out' }
        )
      }, 50)
    }
  }

  const filtered = filter === 'all' ? models : models.filter(m => m.task_type === filter)

  const getMetric = (m: Model) => {
    if (m.accuracy != null) return `${(m.accuracy * 100).toFixed(1)}%`
    if (m.r2_score != null) return `R² ${m.r2_score.toFixed(3)}`
    return '—'
  }

  const getMetricColor = (m: Model) => {
    if (m.accuracy != null || m.r2_score != null) return '#00FFB3'
    return 'rgba(255,255,255,0.2)'
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-void)', paddingTop: '88px', paddingBottom: '60px' }}>

      {/* Grid bg */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage: 'linear-gradient(rgba(123,110,246,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(123,110,246,0.03) 1px, transparent 1px)',
        backgroundSize: '64px 64px',
      }} />

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 28px', position: 'relative', zIndex: 1 }}>

        {/* ── Header ── */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '36px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <p style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
              letterSpacing: '0.15em', textTransform: 'uppercase',
              color: 'rgba(123,110,246,0.5)', marginBottom: '8px',
            }}>My Models</p>
            <h1 style={{
              fontFamily: 'var(--font-display)', fontWeight: 800,
              fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', letterSpacing: '-0.03em',
              color: 'var(--text-primary)', margin: 0,
            }}>
              Trained{' '}
              <span style={{
                background: 'linear-gradient(135deg, #9D93FF, #00D4FF)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>Models</span>
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

        {/* ── Filter tabs ── */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
          {(['all', 'classification', 'regression', 'clustering'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} data-hover style={{
              padding: '7px 16px', borderRadius: '8px', border: 'none', cursor: 'none',
              fontFamily: 'var(--font-mono)', fontSize: '0.7rem',
              letterSpacing: '0.08em', textTransform: 'capitalize',
              transition: 'all 0.2s ease',
              background: filter === f ? 'rgba(123,110,246,0.2)' : 'rgba(255,255,255,0.04)',
              color: filter === f ? '#9D93FF' : 'rgba(255,255,255,0.3)',
              border: `1px solid ${filter === f ? 'rgba(123,110,246,0.4)' : 'rgba(255,255,255,0.06)'}` as any,
            }}>
              {f === 'all' ? `All (${models.length})` : `${f} (${models.filter(m => m.task_type === f).length})`}
            </button>
          ))}
        </div>

        {/* ── Content ── */}
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[...Array(4)].map((_, i) => (
              <div key={i} style={{
                height: '68px', borderRadius: '14px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.05)',
                animation: 'pulse 1.5s ease-in-out infinite',
              }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{
            padding: '80px 24px', textAlign: 'center',
            borderRadius: '20px',
            background: 'rgba(255,255,255,0.02)',
            border: '1px dashed rgba(255,255,255,0.07)',
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px', opacity: 0.2 }}>◈</div>
            <h3 style={{ fontWeight: 600, marginBottom: '10px', color: 'var(--text-primary)' }}>
              {filter === 'all' ? 'No models yet' : `No ${filter} models`}
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.25)', marginBottom: '28px' }}>
              Build your first ML model in under a minute
            </p>
            <Link to="/builder" style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '11px 24px', borderRadius: '10px', textDecoration: 'none',
              fontSize: '0.875rem', fontWeight: 600, color: 'white',
              background: 'linear-gradient(135deg, #7B6EF6, #5B4FD4)',
              boxShadow: '0 4px 16px rgba(123,110,246,0.25)',
            }}>
              Start Building →
            </Link>
          </div>
        ) : (
          <div style={{
            borderRadius: '18px', overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.06)',
            background: 'rgba(13,13,26,0.6)',
            backdropFilter: 'blur(20px)',
          }}>
            {/* Table header */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '2fr 120px 120px 100px 80px',
              gap: '0',
              padding: '14px 24px',
              borderBottom: '1px solid rgba(255,255,255,0.05)',
              background: 'rgba(255,255,255,0.02)',
            }}>
              {['Problem', 'Task', 'Status', 'Metric', ''].map((h, i) => (
                <div key={i} style={{
                  fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
                  letterSpacing: '0.12em', textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.2)',
                  textAlign: i === 4 ? 'right' : 'left',
                }}>{h}</div>
              ))}
            </div>

            {/* Rows */}
            {filtered.map((m, i) => {
              const tc = TASK_COLORS[m.task_type] || TASK_COLORS.classification
              const sc = STATUS_CFG[m.status]    || STATUS_CFG.pending
              return (
                <div key={m.id} className="model-row" style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 120px 120px 100px 80px',
                  gap: '0',
                  padding: '18px 24px',
                  borderBottom: i < filtered.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                  transition: 'background 0.2s ease',
                  cursor: 'default',
                }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(123,110,246,0.04)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>

                  {/* Problem */}
                  <div style={{ paddingRight: '20px' }}>
                    <p style={{
                      fontSize: '0.9rem', fontWeight: 600,
                      color: 'rgba(255,255,255,0.85)', marginBottom: '4px',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {m.name || m.problem_description?.slice(0, 60)}
                    </p>
                    <p style={{
                      fontFamily: 'var(--font-mono)', fontSize: '0.62rem',
                      color: 'rgba(255,255,255,0.2)',
                    }}>
                      {new Date(m.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </p>
                  </div>

                  {/* Task */}
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{
                      padding: '4px 12px', borderRadius: '6px',
                      fontFamily: 'var(--font-mono)', fontSize: '0.62rem',
                      letterSpacing: '0.06em', textTransform: 'uppercase',
                      background: tc.bg, color: tc.text,
                      border: `1px solid ${tc.border}`,
                      whiteSpace: 'nowrap',
                    }}>
                      {m.task_type || '—'}
                    </span>
                  </div>

                  {/* Status */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                    <div style={{
                      width: '7px', height: '7px', borderRadius: '50%', flexShrink: 0,
                      background: sc.dot,
                      boxShadow: `0 0 8px ${sc.dot}80`,
                      animation: m.status === 'training' ? 'pulse 1.5s ease-in-out infinite' : 'none',
                    }} />
                    <span style={{
                      fontFamily: 'var(--font-mono)', fontSize: '0.72rem',
                      color: sc.text, textTransform: 'capitalize',
                    }}>
                      {m.status}
                    </span>
                  </div>

                  {/* Metric */}
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{
                      fontFamily: 'var(--font-mono)', fontSize: '0.82rem',
                      fontWeight: 700, color: getMetricColor(m),
                      textShadow: m.accuracy != null ? '0 0 12px rgba(0,255,179,0.3)' : 'none',
                    }}>
                      {getMetric(m)}
                    </span>
                  </div>

                  {/* Action */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                    <Link to={`/models/${m.id}`} data-hover style={{
                      fontFamily: 'var(--font-mono)', fontSize: '0.7rem',
                      color: 'rgba(123,110,246,0.5)', textDecoration: 'none',
                      padding: '5px 12px', borderRadius: '7px',
                      border: '1px solid rgba(123,110,246,0.15)',
                      background: 'rgba(123,110,246,0.06)',
                      transition: 'all 0.2s ease',
                      whiteSpace: 'nowrap',
                    }}
                      onMouseEnter={e => {
                        const el = e.currentTarget as HTMLElement
                        el.style.color = '#9D93FF'
                        el.style.borderColor = 'rgba(123,110,246,0.4)'
                        el.style.background = 'rgba(123,110,246,0.12)'
                      }}
                      onMouseLeave={e => {
                        const el = e.currentTarget as HTMLElement
                        el.style.color = 'rgba(123,110,246,0.5)'
                        el.style.borderColor = 'rgba(123,110,246,0.15)'
                        el.style.background = 'rgba(123,110,246,0.06)'
                      }}>
                      View →
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* ── Footer count ── */}
        {!loading && filtered.length > 0 && (
          <div style={{
            marginTop: '16px', textAlign: 'right',
            fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
            color: 'rgba(255,255,255,0.15)',
          }}>
            {filtered.length} model{filtered.length > 1 ? 's' : ''} total
          </div>
        )}
      </div>

      <style>{`@keyframes pulse { 0%,100%{opacity:0.4} 50%{opacity:0.8} }`}</style>
    </div>
  )
}
