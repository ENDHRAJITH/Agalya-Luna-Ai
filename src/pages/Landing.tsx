import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const FEATURES = [
  { icon: '⬡', title: 'Describe in Plain English', desc: 'No ML knowledge needed. Just tell Luna what you want to predict or classify.', color: '#7B6EF6' },
  { icon: '◈', title: 'Auto Model Selection', desc: 'Luna analyzes your problem and picks the best algorithm automatically.', color: '#00D4FF' },
  { icon: '◉', title: 'Train & Evaluate', desc: 'Full training pipeline with accuracy metrics, confusion matrices, and more.', color: '#00FFB3' },
  { icon: '⬢', title: 'Export Ready', desc: 'Download your model as a ZIP with code, weights, and usage examples.', color: '#FF6B35' }
]

const STEPS = [
  { num: '01', title: 'Describe Your Problem', desc: 'Type what you want to predict in plain English. "Predict house prices based on location and size."' },
  { num: '02', title: 'Luna Reasons', desc: 'Our AI classifies your problem, selects the right algorithm and dataset strategy.' },
  { num: '03', title: 'Model Trains', desc: 'Pipeline runs automatically — data loading, training, validation, evaluation.' },
  { num: '04', title: 'Download & Deploy', desc: 'Get your trained model as a ready-to-use Python package with docs.' }
]

const STATS = [
  { val: '< 60s', label: 'Average train time' },
  { val: '94%', label: 'Accuracy on demos' },
  { val: '3', label: 'ML task types' },
  { val: '∞', label: 'Possibilities' }
]

const PIPELINE_STEPS = ['Classify', 'Select', 'Train', 'Evaluate', 'Export']

// ─── Animated Console Component ──────────────────────────────────
function ProConsole() {
  const [activeStep, setActiveStep] = useState(3)
  const [showResult, setShowResult] = useState(true)

  useEffect(() => {
    // Animate pipeline steps cycling
    const interval = setInterval(() => {
      setActiveStep(prev => {
        const next = (prev + 1) % (PIPELINE_STEPS.length + 1)
        if (next === PIPELINE_STEPS.length) {
          setShowResult(true)
          return prev
        }
        return next
      })
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{
      width: '100%',
      borderRadius: '16px',
      overflow: 'hidden',
      background: 'rgba(8, 8, 16, 0.98)',
      border: '1px solid rgba(123,110,246,0.3)',
      boxShadow: `
        0 0 0 1px rgba(123,110,246,0.06),
        0 40px 100px rgba(0,0,0,0.7),
        0 0 80px rgba(123,110,246,0.08),
        inset 0 1px 0 rgba(255,255,255,0.04)
      `,
      position: 'relative',
    }}>

      {/* Gradient border top */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(123,110,246,0.8), rgba(0,212,255,0.6), transparent)',
      }} />

      {/* Title bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 20px',
        background: 'rgba(255,255,255,0.025)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {[['#FF5F57','#FF3B30'], ['#FFBD2E','#FF9500'], ['#28C840','#34C759']].map(([bg, shadow], i) => (
            <div key={i} style={{
              width: '12px', height: '12px', borderRadius: '50%', background: bg,
              boxShadow: `0 0 6px ${shadow}40`,
            }} />
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '6px', height: '6px', borderRadius: '50%',
            background: '#00FFB3',
            boxShadow: '0 0 8px #00FFB3',
            animation: 'pulseDot 2s ease-in-out infinite',
          }} />
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.7rem',
            color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em',
          }}>luna://builder — active session</span>
        </div>

        <div style={{ display: 'flex', gap: '4px' }}>
          {['rgba(255,255,255,0.06)', 'rgba(255,255,255,0.04)', 'rgba(255,255,255,0.03)'].map((bg, i) => (
            <div key={i} style={{
              width: '28px', height: '20px', borderRadius: '4px',
              background: bg, border: '1px solid rgba(255,255,255,0.04)',
            }} />
          ))}
        </div>
      </div>

      {/* Console body */}
      <div style={{ padding: '28px 28px 24px' }}>

        {/* Input section */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <div style={{
              width: '20px', height: '20px', borderRadius: '50%',
              background: 'rgba(123,110,246,0.2)',
              border: '1px solid rgba(123,110,246,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ fontSize: '8px', color: '#9D93FF' }}>$</span>
            </div>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
              color: 'rgba(123,110,246,0.5)', letterSpacing: '0.15em', textTransform: 'uppercase',
            }}>luna.describe_problem()</span>
          </div>

          <div style={{
            padding: '16px 18px',
            background: 'rgba(123,110,246,0.04)',
            border: '1px solid rgba(123,110,246,0.15)',
            borderLeft: '2px solid rgba(123,110,246,0.6)',
            borderRadius: '0 10px 10px 0',
            position: 'relative',
          }}>
            <p style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.9rem',
              color: 'rgba(255,255,255,0.85)', margin: 0, lineHeight: 1.5,
            }}>
              <span style={{ color: 'rgba(123,110,246,0.5)' }}>"</span>
              Classify emails as spam or not spam
              <span style={{ color: 'rgba(123,110,246,0.5)' }}>"</span>
              <span style={{
                display: 'inline-block', width: '2px', height: '14px',
                background: '#9D93FF', marginLeft: '3px', verticalAlign: 'middle',
                animation: 'cursorBlink 1.2s step-end infinite',
              }} />
            </p>
          </div>
        </div>

        {/* Pipeline */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
            color: 'rgba(255,255,255,0.2)', letterSpacing: '0.12em',
            textTransform: 'uppercase', marginBottom: '14px',
          }}>
            ▸ pipeline execution
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0' }}>
            {PIPELINE_STEPS.map((step, i) => {
              const done = i < 3
              const active = i === 3
              const pending = i > 3
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', flex: i < 4 ? 1 : 'none' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                    <div style={{
                      width: '30px', height: '30px', borderRadius: '50%', flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: done ? 'rgba(0,255,179,0.12)' : active ? 'rgba(123,110,246,0.18)' : 'rgba(255,255,255,0.03)',
                      border: done ? '1px solid rgba(0,255,179,0.5)' : active ? '1px solid rgba(123,110,246,0.6)' : '1px solid rgba(255,255,255,0.07)',
                      boxShadow: done ? '0 0 10px rgba(0,255,179,0.15)' : active ? '0 0 12px rgba(123,110,246,0.25)' : 'none',
                      transition: 'all 0.4s ease',
                    }}>
                      {done && <span style={{ fontSize: '11px', color: '#00FFB3' }}>✓</span>}
                      {active && <span style={{
                        width: '8px', height: '8px', borderRadius: '50%',
                        background: '#7B6EF6', display: 'block',
                        animation: 'pulseDot 1s ease-in-out infinite',
                      }} />}
                      {pending && <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.15)' }}>○</span>}
                    </div>
                    <span style={{
                      fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.05em',
                      color: done ? 'rgba(0,255,179,0.6)' : active ? 'rgba(123,110,246,0.8)' : 'rgba(255,255,255,0.15)',
                      whiteSpace: 'nowrap', textAlign: 'center',
                    }}>{step}</span>
                  </div>

                  {i < 4 && (
                    <div style={{
                      flex: 1, height: '1px', marginTop: '15px', marginLeft: '4px', marginRight: '4px',
                      background: done
                        ? 'linear-gradient(90deg, rgba(0,255,179,0.4), rgba(0,255,179,0.1))'
                        : 'rgba(255,255,255,0.05)',
                    }} />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: '1px', background: 'rgba(255,255,255,0.04)', margin: '0 0 24px' }} />

        {/* Output metrics */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
            color: 'rgba(255,255,255,0.2)', letterSpacing: '0.12em',
            textTransform: 'uppercase', marginBottom: '14px',
          }}>
            ▸ model output
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            {[
              { label: 'task_type', value: 'classification', color: '#9D93FF', icon: '◈' },
              { label: 'algorithm', value: 'RandomForest', color: '#00D4FF', icon: '◉' },
              { label: 'accuracy', value: '94.2%', color: '#00FFB3', icon: '▲' },
            ].map((m, i) => (
              <div key={i} style={{
                padding: '14px', borderRadius: '10px',
                background: 'rgba(255,255,255,0.025)',
                border: '1px solid rgba(255,255,255,0.06)',
                position: 'relative', overflow: 'hidden',
              }}>
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
                  background: `linear-gradient(90deg, transparent, ${m.color}40, transparent)`,
                }} />
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: '0.58rem',
                  color: 'rgba(255,255,255,0.2)', marginBottom: '8px',
                  letterSpacing: '0.08em',
                }}>{m.label}</div>
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: '0.82rem',
                  fontWeight: 700, color: m.color,
                  textShadow: `0 0 12px ${m.color}40`,
                }}>{m.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Download */}
        <div style={{
          padding: '14px 20px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, rgba(123,110,246,0.12), rgba(0,212,255,0.06))',
          border: '1px solid rgba(123,110,246,0.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          cursor: 'pointer',
          transition: 'all 0.25s ease',
          boxShadow: '0 0 20px rgba(123,110,246,0.06)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '28px', height: '28px', borderRadius: '8px',
              background: 'rgba(123,110,246,0.2)',
              border: '1px solid rgba(123,110,246,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '12px',
            }}>↓</div>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 700, color: '#9D93FF' }}>
                model_spam_classifier.zip
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'rgba(255,255,255,0.2)', marginTop: '2px' }}>
                includes weights · inference code · docs
              </div>
            </div>
          </div>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.62rem',
            color: '#00FFB3', letterSpacing: '0.05em',
            background: 'rgba(0,255,179,0.1)', border: '1px solid rgba(0,255,179,0.2)',
            padding: '4px 10px', borderRadius: '6px',
          }}>
            READY
          </div>
        </div>
      </div>

      <style>{`
        @keyframes cursorBlink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes pulseDot { 0%,100%{opacity:0.4; transform:scale(1)} 50%{opacity:1; transform:scale(1.2)} }
      `}</style>
    </div>
  )
}

// ─── Landing Page ─────────────────────────────────────────────────
export default function Landing() {
  const heroRef    = useRef<HTMLElement>(null)
  const orb1Ref    = useRef<HTMLDivElement>(null)
  const orb2Ref    = useRef<HTMLDivElement>(null)
  const titleRef   = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const statsRef   = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.2 })
      tl.fromTo('.hero-tag',    { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' })
        .fromTo(titleRef.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.2')
        .fromTo(subtitleRef.current, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.4')
        .fromTo('.hero-cta',    { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }, '-=0.3')
        .fromTo('.hero-console',{ opacity: 0, y: 50, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: 'power3.out' }, '-=0.2')

      gsap.to(orb1Ref.current, { y: -25, duration: 5, yoyo: true, repeat: -1, ease: 'sine.inOut' })
      gsap.to(orb2Ref.current, { y: 18, x: -12, duration: 6, yoyo: true, repeat: -1, ease: 'sine.inOut' })

      gsap.fromTo('.stat-item',  { opacity: 0, y: 24 }, { opacity: 1, y: 0, stagger: 0.08, duration: 0.5,
        scrollTrigger: { trigger: statsRef.current, start: 'top 85%' } })
      gsap.fromTo('.feature-card', { opacity: 0, y: 36 }, { opacity: 1, y: 0, stagger: 0.1, duration: 0.6,
        scrollTrigger: { trigger: '#features', start: 'top 78%' } })
      gsap.fromTo('.step-item',  { opacity: 0, x: -24 }, { opacity: 1, x: 0, stagger: 0.15, duration: 0.5,
        scrollTrigger: { trigger: '#how', start: 'top 78%' } })
    })
    return () => ctx.revert()
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-void)', color: 'var(--text-primary)' }}>

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section ref={heroRef} style={{
        position: 'relative', minHeight: '100vh',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '120px 24px 80px', overflow: 'hidden',
      }}>
        {/* Grid bg */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'linear-gradient(rgba(123,110,246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(123,110,246,0.04) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }} />

        {/* Orbs */}
        <div ref={orb1Ref} style={{
          position: 'absolute', top: '20%', left: '15%', width: '480px', height: '480px',
          borderRadius: '50%', pointerEvents: 'none',
          background: 'radial-gradient(circle, rgba(123,110,246,0.12) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }} />
        <div ref={orb2Ref} style={{
          position: 'absolute', bottom: '20%', right: '10%', width: '380px', height: '380px',
          borderRadius: '50%', pointerEvents: 'none',
          background: 'radial-gradient(circle, rgba(0,212,255,0.08) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }} />

        {/* Content */}
        <div style={{
          position: 'relative', zIndex: 10,
          width: '100%', maxWidth: '760px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
        }}>
          {/* Badge */}
          <div className="hero-tag" style={{
            display: 'inline-flex', alignItems: 'center', gap: '10px',
            padding: '6px 14px 6px 8px', borderRadius: '100px', marginBottom: '32px',
            background: 'rgba(123,110,246,0.08)',
            border: '1px solid rgba(123,110,246,0.2)',
          }}>
            <span style={{
              padding: '2px 8px', borderRadius: '100px', fontSize: '0.6rem',
              fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
              background: 'rgba(123,110,246,0.3)', color: '#9D93FF',
              fontFamily: 'var(--font-mono)',
            }}>BETA</span>
            <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-mono)' }}>
              AI-Powered ML Model Builder
            </span>
          </div>

          {/* Title */}
          <h1 ref={titleRef} style={{
            fontSize: 'clamp(2.8rem, 7vw, 5.5rem)', fontWeight: 800,
            lineHeight: 1.05, letterSpacing: '-0.035em', marginBottom: '20px',
            fontFamily: 'var(--font-display)',
          }}>
            Build ML Models
            <br />
            <span style={{
              background: 'linear-gradient(135deg, #9D93FF 0%, #00D4FF 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>Without Code</span>
          </h1>

          {/* Subtitle */}
          <p ref={subtitleRef} style={{
            fontSize: '1.1rem', color: 'rgba(255,255,255,0.45)',
            maxWidth: '520px', lineHeight: 1.7, marginBottom: '36px',
            fontWeight: 400,
          }}>
            Describe your ML problem in plain English.
            Luna trains, evaluates, and exports a production-ready model —{' '}
            <em style={{ color: 'rgba(255,255,255,0.7)', fontStyle: 'italic', fontFamily: 'var(--font-serif)' }}>automatically.</em>
          </p>

          {/* CTA Buttons */}
          <div className="hero-cta" style={{ display: 'flex', gap: '12px', marginBottom: '56px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link to="/signup" data-hover style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '13px 28px', borderRadius: '12px',
              fontSize: '0.9rem', fontWeight: 700, textDecoration: 'none',
              color: 'white', letterSpacing: '0.01em',
              background: 'linear-gradient(135deg, #7B6EF6, #5B4FD4)',
              border: '1px solid rgba(155,147,255,0.3)',
              boxShadow: '0 4px 20px rgba(123,110,246,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
              transition: 'all 0.25s ease',
            }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement
                el.style.transform = 'translateY(-2px)'
                el.style.boxShadow = '0 8px 30px rgba(123,110,246,0.45), inset 0 1px 0 rgba(255,255,255,0.15)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement
                el.style.transform = 'translateY(0)'
                el.style.boxShadow = '0 4px 20px rgba(123,110,246,0.3), inset 0 1px 0 rgba(255,255,255,0.1)'
              }}>
              Start Building Free
              <span style={{ opacity: 0.7 }}>→</span>
            </Link>
            <Link to="/login" data-hover style={{
              display: 'inline-flex', alignItems: 'center',
              padding: '13px 24px', borderRadius: '12px',
              fontSize: '0.9rem', fontWeight: 500, textDecoration: 'none',
              color: 'rgba(255,255,255,0.5)',
              border: '1px solid rgba(255,255,255,0.08)',
              background: 'rgba(255,255,255,0.03)',
              transition: 'all 0.25s ease',
            }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement
                el.style.color = 'rgba(255,255,255,0.8)'
                el.style.borderColor = 'rgba(123,110,246,0.3)'
                el.style.background = 'rgba(123,110,246,0.05)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement
                el.style.color = 'rgba(255,255,255,0.5)'
                el.style.borderColor = 'rgba(255,255,255,0.08)'
                el.style.background = 'rgba(255,255,255,0.03)'
              }}>
              Sign In
            </Link>
          </div>

          {/* PRO CONSOLE */}
          <div className="hero-console" style={{ width: '100%', position: 'relative' }}>
            <ProConsole />
            {/* Ambient glow below */}
            <div style={{
              position: 'absolute', bottom: '-40px', left: '50%', transform: 'translateX(-50%)',
              width: '60%', height: '80px', borderRadius: '50%',
              background: 'radial-gradient(ellipse, rgba(123,110,246,0.2) 0%, transparent 70%)',
              filter: 'blur(30px)', pointerEvents: 'none',
            }} />
          </div>
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────────────────── */}
      <section ref={statsRef} style={{
        padding: '72px 24px',
        borderTop: '1px solid rgba(255,255,255,0.04)',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        background: 'rgba(255,255,255,0.015)',
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '40px', textAlign: 'center' }}>
          {STATS.map((s, i) => (
            <div key={i} className="stat-item">
              <div style={{
                fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '8px',
                background: 'linear-gradient(135deg, #9D93FF, #00D4FF)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>{s.val}</div>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.12em', fontFamily: 'var(--font-mono)' }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────────── */}
      <section id="features" style={{ padding: '100px 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <div style={{
              display: 'inline-block', padding: '4px 14px', borderRadius: '100px', marginBottom: '16px',
              fontSize: '0.65rem', fontFamily: 'var(--font-mono)', letterSpacing: '0.15em', textTransform: 'uppercase',
              background: 'rgba(123,110,246,0.08)', border: '1px solid rgba(123,110,246,0.15)', color: 'rgba(123,110,246,0.7)',
            }}>Capabilities</div>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, letterSpacing: '-0.025em', marginBottom: '12px' }}>
              Everything you need to{' '}
              <span style={{ background: 'linear-gradient(135deg, #9D93FF, #00D4FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                ship ML models
              </span>
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '1rem' }}>From problem description to trained model in under a minute.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            {FEATURES.map((f, i) => (
              <div key={i} className="feature-card" style={{
                padding: '32px', borderRadius: '16px',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.05)',
                transition: 'all 0.3s ease', position: 'relative', overflow: 'hidden', cursor: 'default',
              }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement
                  el.style.border = `1px solid ${f.color}30`
                  el.style.background = `rgba(255,255,255,0.035)`;
                  (el.querySelector('.feat-line') as HTMLElement).style.width = '100%'
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement
                  el.style.border = '1px solid rgba(255,255,255,0.05)'
                  el.style.background = 'rgba(255,255,255,0.02)';
                  (el.querySelector('.feat-line') as HTMLElement).style.width = '0'
                }}>
                <div style={{ fontSize: '2rem', marginBottom: '20px', color: f.color }}>{f.icon}</div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '10px', lineHeight: 1.3 }}>{f.title}</h3>
                <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.35)', lineHeight: 1.7 }}>{f.desc}</p>
                <div className="feat-line" style={{
                  position: 'absolute', bottom: 0, left: 0, height: '2px', width: '0',
                  background: `linear-gradient(90deg, transparent, ${f.color}, transparent)`,
                  transition: 'width 0.4s ease',
                }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────── */}
      <section id="how" style={{ padding: '100px 24px', background: 'rgba(0,0,0,0.3)' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, letterSpacing: '-0.025em', marginBottom: '12px' }}>
              How it{' '}
              <span style={{ background: 'linear-gradient(135deg, #9D93FF, #00D4FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                works
              </span>
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.35)' }}>Four simple steps from idea to production model.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {STEPS.map((s, i) => (
              <div key={i} className="step-item" style={{ display: 'flex', gap: '24px', position: 'relative', paddingBottom: i < STEPS.length - 1 ? '40px' : '0' }}>
                {/* Connector line */}
                {i < STEPS.length - 1 && (
                  <div style={{
                    position: 'absolute', left: '31px', top: '64px',
                    width: '1px', bottom: '0',
                    background: 'linear-gradient(to bottom, rgba(123,110,246,0.3), transparent)',
                  }} />
                )}
                <div style={{
                  flexShrink: 0, width: '64px', height: '64px', borderRadius: '16px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'rgba(123,110,246,0.06)',
                  border: '1px solid rgba(123,110,246,0.15)',
                  fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#9D93FF',
                  letterSpacing: '0.05em', transition: 'all 0.3s ease',
                }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement
                    el.style.background = 'rgba(123,110,246,0.12)'
                    el.style.borderColor = 'rgba(123,110,246,0.4)'
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement
                    el.style.background = 'rgba(123,110,246,0.06)'
                    el.style.borderColor = 'rgba(123,110,246,0.15)'
                  }}>
                  {s.num}
                </div>
                <div style={{ paddingTop: '16px' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px' }}>{s.title}</h3>
                  <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.35)', lineHeight: 1.7 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section style={{ padding: '120px 24px', textAlign: 'center' }}>
        <div style={{
          maxWidth: '640px', margin: '0 auto',
          padding: '72px 48px', borderRadius: '32px',
          background: 'rgba(123,110,246,0.04)',
          border: '1px solid rgba(123,110,246,0.12)',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'radial-gradient(ellipse at center top, rgba(123,110,246,0.08) 0%, transparent 60%)',
          }} />
          <h2 style={{
            fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800,
            letterSpacing: '-0.03em', marginBottom: '16px', position: 'relative', zIndex: 1,
          }}>
            Ready to build your <br />
            <span style={{ background: 'linear-gradient(135deg, #9D93FF, #00D4FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              first model?
            </span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.35)', marginBottom: '36px', fontSize: '1rem', position: 'relative', zIndex: 1 }}>
            No credit card. No ML experience needed. Just describe and build.
          </p>
          <Link to="/signup" data-hover style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '14px 32px', borderRadius: '12px',
            fontSize: '0.95rem', fontWeight: 700, textDecoration: 'none',
            color: 'white', position: 'relative', zIndex: 1,
            background: 'linear-gradient(135deg, #7B6EF6, #5B4FD4)',
            border: '1px solid rgba(155,147,255,0.3)',
            boxShadow: '0 4px 24px rgba(123,110,246,0.35)',
            transition: 'all 0.25s ease',
          }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement
              el.style.transform = 'translateY(-2px)'
              el.style.boxShadow = '0 8px 35px rgba(123,110,246,0.5)'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement
              el.style.transform = 'translateY(0)'
              el.style.boxShadow = '0 4px 24px rgba(123,110,246,0.35)'
            }}>
            Start for Free →
          </Link>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────── */}
      <footer style={{
        padding: '32px 24px',
        borderTop: '1px solid rgba(255,255,255,0.04)',
        background: 'rgba(0,0,0,0.4)',
      }}>
        <div style={{
          maxWidth: '1100px', margin: '0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px',
        }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem' }}>
            Luna<span style={{ background: 'linear-gradient(135deg, #9D93FF, #00D4FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>AI</span>
          </span>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'rgba(255,255,255,0.2)' }}>
            Built with React + Python + ☽
          </p>
          <div style={{ display: 'flex', gap: '28px' }}>
            {['Docs', 'GitHub', 'MIT License'].map(l => (
              <a key={l} href="#" style={{
                fontSize: '0.75rem', color: 'rgba(255,255,255,0.2)', textDecoration: 'none',
                transition: 'color 0.2s',
              }}
                onMouseEnter={e => (e.currentTarget.style.color = '#9D93FF')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.2)')}>
                {l}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}