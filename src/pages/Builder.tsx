import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

const EXAMPLES = [
  'Classify emails as spam or not spam',
  'Predict house prices based on location and size',
  'Detect fraudulent credit card transactions',
  'Classify iris flowers by species',
  'Predict customer churn for a subscription service',
]

type Stage = 'input' | 'training' | 'done' | 'error'

interface TrainResult {
  task_type: string
  model_type: string
  accuracy?: number
  r2_score?: number
  rmse?: number
  download_url?: string
  explanation?: string
}

const PROGRESS_STEPS = [
  { pct: 15, label: 'Analyzing your problem...' },
  { pct: 30, label: 'Selecting best algorithm...' },
  { pct: 50, label: 'Loading dataset...' },
  { pct: 70, label: 'Training model...' },
  { pct: 85, label: 'Evaluating performance...' },
  { pct: 95, label: 'Exporting project...' },
]

export default function Builder() {
  const { token } = useAuth()
  const [problem, setProblem] = useState('')
  const [stage, setStage] = useState<Stage>('input')
  const [result, setResult] = useState<TrainResult | null>(null)
  const [error, setError] = useState('')
  const [progress, setProgress] = useState(0)
  const [progressLabel, setProgressLabel] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.fromTo(containerRef.current,
      { opacity: 0, y: 32 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', delay: 0.1 }
    )
  }, [])

  const simulateProgress = () => {
    let i = 0
    return setInterval(() => {
      if (i < PROGRESS_STEPS.length) {
        setProgress(PROGRESS_STEPS[i].pct)
        setProgressLabel(PROGRESS_STEPS[i].label)
        i++
      }
    }, 1400)
  }

  const handleTrain = async () => {
    if (!problem.trim()) return
    setStage('training')
    setProgress(5)
    setProgressLabel('Connecting to Luna pipeline...')
    const interval = simulateProgress()
    try {
      const res = await axios.post(`${API}/models/train`,
        { problem_description: problem },
        { headers: { Authorization: `Bearer ${token}` }, timeout: 120000 }
      )
      clearInterval(interval)
      setProgress(100)
      setProgressLabel('Done!')
      setResult(res.data)
      setTimeout(() => setStage('done'), 600)
    } catch (err: any) {
      clearInterval(interval)
      setError(err?.response?.data?.message || 'Training failed. Is the ML pipeline running?')
      setStage('error')
    }
  }

  const reset = () => {
    setStage('input')
    setProblem('')
    setResult(null)
    setError('')
    setProgress(0)
    gsap.fromTo(containerRef.current,
      { opacity: 0, scale: 0.98 },
      { opacity: 1, scale: 1, duration: 0.5, ease: 'power3.out' }
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-void)', paddingTop: '100px', paddingBottom: '60px' }}>

      {/* Grid bg */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage: 'linear-gradient(rgba(123,110,246,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(123,110,246,0.03) 1px, transparent 1px)',
        backgroundSize: '64px 64px',
      }} />
      {/* Orb */}
      <div style={{
        position: 'fixed', top: '30%', left: '50%', transform: 'translateX(-50%)',
        width: '600px', height: '400px', borderRadius: '50%', pointerEvents: 'none', zIndex: 0,
        background: 'radial-gradient(ellipse, rgba(123,110,246,0.06) 0%, transparent 70%)',
        filter: 'blur(60px)',
      }} />

      <div ref={containerRef} style={{ position: 'relative', zIndex: 1, maxWidth: '640px', margin: '0 auto', padding: '0 24px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            display: 'inline-block', padding: '4px 14px', borderRadius: '100px', marginBottom: '16px',
            fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.15em', textTransform: 'uppercase',
            background: 'rgba(123,110,246,0.08)', border: '1px solid rgba(123,110,246,0.15)', color: 'rgba(123,110,246,0.7)',
          }}>Model Builder</div>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontWeight: 800,
            fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', letterSpacing: '-0.03em',
            color: 'var(--text-primary)', marginBottom: '12px',
          }}>
            Describe your{' '}
            <span style={{ background: 'linear-gradient(135deg, #9D93FF, #00D4FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              ML problem
            </span>
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.35)', lineHeight: 1.6 }}>
            Plain English. No code. Luna handles everything.
          </p>
        </div>

        {/* ── INPUT STAGE ── */}
        {stage === 'input' && (
          <div style={{
            background: 'rgba(13,13,26,0.8)', backdropFilter: 'blur(24px)',
            border: '1px solid rgba(123,110,246,0.18)', borderRadius: '20px', padding: '32px',
            boxShadow: '0 8px 40px rgba(0,0,0,0.4)',
          }}>
            {/* Top border glow */}
            <div style={{
              position: 'absolute', top: 0, left: '10%', right: '10%', height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(123,110,246,0.6), transparent)',
              borderRadius: '1px',
            }} />

            <label style={{
              display: 'block', marginBottom: '10px',
              fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
              letterSpacing: '0.15em', textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.2)',
            }}>Problem Description</label>

            <textarea value={problem} onChange={e => setProblem(e.target.value)}
              placeholder="e.g. Classify emails as spam or not spam based on subject and content..."
              rows={4}
              style={{
                width: '100%', padding: '14px 16px', borderRadius: '12px',
                fontSize: '0.9rem', fontFamily: 'var(--font-display)', lineHeight: 1.6,
                color: 'var(--text-primary)', resize: 'none', outline: 'none',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(123,110,246,0.2)',
                transition: 'all 0.2s ease', boxSizing: 'border-box',
                marginBottom: '20px',
              }}
              onFocus={e => {
                e.target.style.border = '1px solid rgba(123,110,246,0.5)'
                e.target.style.background = 'rgba(123,110,246,0.04)'
                e.target.style.boxShadow = '0 0 0 3px rgba(123,110,246,0.08)'
              }}
              onBlur={e => {
                e.target.style.border = '1px solid rgba(123,110,246,0.2)'
                e.target.style.background = 'rgba(255,255,255,0.04)'
                e.target.style.boxShadow = 'none'
              }}
            />

            {/* Examples */}
            <div style={{ marginBottom: '24px' }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'rgba(255,255,255,0.2)', marginBottom: '10px', letterSpacing: '0.08em' }}>
                TRY AN EXAMPLE:
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {EXAMPLES.map((ex, i) => (
                  <button key={i} onClick={() => setProblem(ex)} data-hover style={{
                    padding: '6px 12px', borderRadius: '8px', border: 'none', cursor: 'none',
                    fontSize: '0.75rem', fontFamily: 'var(--font-display)',
                    color: 'rgba(255,255,255,0.4)',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.07)' as any,
                    transition: 'all 0.2s ease',
                  }}
                    onMouseEnter={e => {
                      const el = e.currentTarget as HTMLElement
                      el.style.color = '#9D93FF'
                      el.style.borderColor = 'rgba(123,110,246,0.3)'
                      el.style.background = 'rgba(123,110,246,0.06)'
                    }}
                    onMouseLeave={e => {
                      const el = e.currentTarget as HTMLElement
                      el.style.color = 'rgba(255,255,255,0.4)'
                      el.style.borderColor = 'rgba(255,255,255,0.07)'
                      el.style.background = 'rgba(255,255,255,0.04)'
                    }}>
                    {ex.length > 38 ? ex.slice(0, 38) + '...' : ex}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={handleTrain} disabled={!problem.trim()} data-hover style={{
              width: '100%', padding: '15px', borderRadius: '12px', border: 'none',
              fontSize: '0.95rem', fontWeight: 700, fontFamily: 'var(--font-display)',
              color: 'white', cursor: problem.trim() ? 'none' : 'not-allowed',
              background: problem.trim() ? 'linear-gradient(135deg, #7B6EF6, #5B4FD4)' : 'rgba(123,110,246,0.2)',
              boxShadow: problem.trim() ? '0 4px 20px rgba(123,110,246,0.35)' : 'none',
              transition: 'all 0.25s ease',
            }}
              onMouseEnter={e => {
                if (problem.trim()) {
                  const el = e.currentTarget as HTMLElement
                  el.style.transform = 'translateY(-1px)'
                  el.style.boxShadow = '0 8px 28px rgba(123,110,246,0.45)'
                }
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement
                el.style.transform = 'translateY(0)'
                el.style.boxShadow = problem.trim() ? '0 4px 20px rgba(123,110,246,0.35)' : 'none'
              }}>
              Train Model →
            </button>
          </div>
        )}

        {/* ── TRAINING STAGE ── */}
        {stage === 'training' && (
          <div style={{
            background: 'rgba(13,13,26,0.8)', backdropFilter: 'blur(24px)',
            border: '1px solid rgba(123,110,246,0.18)', borderRadius: '20px', padding: '48px 32px',
            textAlign: 'center', boxShadow: '0 8px 40px rgba(0,0,0,0.4)',
          }}>
            {/* Animated rings */}
            <div style={{ position: 'relative', width: '80px', height: '80px', margin: '0 auto 32px' }}>
              <div style={{
                position: 'absolute', inset: 0, borderRadius: '50%',
                border: '1px solid rgba(123,110,246,0.2)',
                animation: 'ringPing 2s ease-in-out infinite',
              }} />
              <div style={{
                position: 'absolute', inset: '8px', borderRadius: '50%',
                border: '1px solid rgba(0,212,255,0.2)',
                animation: 'spinSlow 8s linear infinite',
              }} />
              <div style={{
                position: 'absolute', inset: '18px', borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(123,110,246,0.4), rgba(0,212,255,0.3))',
                animation: 'pulse 2s ease-in-out infinite',
              }} />
            </div>

            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.3rem', marginBottom: '8px', color: 'var(--text-primary)' }}>
              Training in progress
            </h2>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#9D93FF', marginBottom: '32px' }}>
              {progressLabel}
            </p>

            {/* Progress bar */}
            <div style={{ height: '4px', borderRadius: '2px', background: 'rgba(255,255,255,0.06)', marginBottom: '10px', overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: '2px', transition: 'width 0.8s ease',
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #7B6EF6, #00D4FF)',
                boxShadow: '0 0 10px rgba(123,110,246,0.5)',
              }} />
            </div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'rgba(255,255,255,0.2)' }}>
              {progress}%
            </p>

            <div style={{
              marginTop: '28px', padding: '16px', borderRadius: '12px',
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)',
              textAlign: 'left',
            }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#9D93FF', marginBottom: '6px' }}>
                $ luna.train()
              </p>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)', lineHeight: 1.6 }}>
                → "{problem.slice(0, 55)}{problem.length > 55 ? '...' : ''}"
              </p>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#00D4FF', marginTop: '4px' }}>
                → status: <span style={{ animation: 'pulse 1s ease-in-out infinite', display: 'inline-block' }}>processing...</span>
              </p>
            </div>
          </div>
        )}

        {/* ── DONE STAGE ── */}
        {stage === 'done' && result && (
          <div>
            {/* Success badge */}
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '8px 18px', borderRadius: '100px',
                background: 'rgba(0,255,179,0.08)', border: '1px solid rgba(0,255,179,0.2)',
                fontSize: '0.82rem', fontWeight: 600, color: '#00FFB3',
              }}>
                <span>✓</span> Model trained successfully!
              </div>
            </div>

            <div style={{
              background: 'rgba(13,13,26,0.8)', backdropFilter: 'blur(24px)',
              border: '1px solid rgba(123,110,246,0.18)', borderRadius: '20px', padding: '28px',
              boxShadow: '0 8px 40px rgba(0,0,0,0.4)', marginBottom: '14px',
            }}>
              {/* Top border */}
              <div style={{
                position: 'absolute', top: 0, left: '10%', right: '10%', height: '1px',
                background: 'linear-gradient(90deg, transparent, rgba(0,255,179,0.5), transparent)',
              }} />

              {/* Metric cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px', marginBottom: '20px' }}>
                {[
                  { label: 'Task Type', value: result.task_type || 'Classification', color: '#9D93FF' },
                  { label: 'Algorithm', value: result.model_type || 'RandomForest', color: '#00D4FF' },
                  result.accuracy != null
                    ? { label: 'Accuracy', value: `${(result.accuracy * 100).toFixed(1)}%`, color: '#00FFB3' }
                    : result.r2_score != null
                    ? { label: 'R² Score', value: result.r2_score.toFixed(3), color: '#00FFB3' }
                    : { label: 'Status', value: 'Complete', color: '#00FFB3' }
                ].map((m, i) => (
                  <div key={i} style={{
                    padding: '16px', borderRadius: '12px', textAlign: 'center',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    position: 'relative', overflow: 'hidden',
                  }}>
                    <div style={{
                      position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
                      background: `linear-gradient(90deg, transparent, ${m.color}50, transparent)`,
                    }} />
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'rgba(255,255,255,0.2)', marginBottom: '8px', letterSpacing: '0.08em' }}>
                      {m.label}
                    </p>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: 700, color: m.color, margin: 0 }}>
                      {m.value}
                    </p>
                  </div>
                ))}
              </div>

              {result.explanation && (
                <div style={{
                  padding: '14px 16px', borderRadius: '10px', marginBottom: '18px',
                  background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)',
                  fontSize: '0.85rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.7,
                }}>
                  {result.explanation}
                </div>
              )}

              {result.download_url && (
                <a href={`http://localhost:8000${result.download_url}`} data-hover style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '14px 18px', borderRadius: '12px', textDecoration: 'none',
                  background: 'linear-gradient(135deg, rgba(123,110,246,0.15), rgba(0,212,255,0.08))',
                  border: '1px solid rgba(123,110,246,0.3)',
                  transition: 'all 0.2s ease',
                }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement
                    el.style.boxShadow = '0 0 20px rgba(123,110,246,0.2)'
                    el.style.transform = 'translateY(-1px)'
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement
                    el.style.boxShadow = 'none'
                    el.style.transform = 'translateY(0)'
                  }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', fontWeight: 700, color: '#9D93FF' }}>
                    ↓ Download Model ZIP
                  </span>
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
                    padding: '3px 10px', borderRadius: '6px',
                    background: 'rgba(0,255,179,0.1)', color: '#00FFB3', border: '1px solid rgba(0,255,179,0.2)',
                  }}>READY</span>
                </a>
              )}
            </div>

            <button onClick={reset} data-hover style={{
              width: '100%', padding: '13px', borderRadius: '12px', border: 'none', cursor: 'none',
              fontSize: '0.875rem', fontWeight: 500, fontFamily: 'var(--font-display)',
              color: 'rgba(255,255,255,0.35)',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)' as any,
              transition: 'all 0.2s ease',
            }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement
                el.style.color = 'rgba(255,255,255,0.7)'
                el.style.borderColor = 'rgba(123,110,246,0.3)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement
                el.style.color = 'rgba(255,255,255,0.35)'
                el.style.borderColor = 'rgba(255,255,255,0.07)'
              }}>
              ← Build Another Model
            </button>
          </div>
        )}

        {/* ── ERROR STAGE ── */}
        {stage === 'error' && (
          <div style={{
            background: 'rgba(13,13,26,0.8)', backdropFilter: 'blur(24px)',
            border: '1px solid rgba(255,107,53,0.2)', borderRadius: '20px', padding: '48px 32px',
            textAlign: 'center', boxShadow: '0 8px 40px rgba(0,0,0,0.4)',
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '16px', opacity: 0.7 }}>⚠</div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#FF6B35', marginBottom: '10px' }}>
              Training Failed
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.4)', marginBottom: '24px', lineHeight: 1.6 }}>
              {error}
            </p>
            <div style={{
              padding: '14px 16px', borderRadius: '10px', marginBottom: '24px',
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)',
              textAlign: 'left',
            }}>
              {[
                'ML Pipeline running? → cd ml-pipeline && python run.py',
                'Backend running? → cd luna-backend && npm run dev',
              ].map((t, i) => (
                <p key={i} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)', marginBottom: i < 1 ? '6px' : 0 }}>
                  {i + 1}. {t}
                </p>
              ))}
            </div>
            <button onClick={reset} data-hover style={{
              padding: '13px 32px', borderRadius: '12px', border: 'none', cursor: 'none',
              fontSize: '0.9rem', fontWeight: 600, color: 'white',
              background: 'linear-gradient(135deg, #7B6EF6, #5B4FD4)',
              boxShadow: '0 4px 16px rgba(123,110,246,0.3)',
              transition: 'all 0.2s ease',
            }}>
              Try Again
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes ringPing { 0%,100%{transform:scale(1);opacity:0.3} 50%{transform:scale(1.1);opacity:0.6} }
        @keyframes spinSlow { to{transform:rotate(360deg)} }
        @keyframes pulse { 0%,100%{opacity:0.5} 50%{opacity:1} }
      `}</style>
    </div>
  )
}